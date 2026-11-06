import { useState, useEffect, useMemo, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, where, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { logActivity } from '../../utils/logger';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, X, RefreshCw, Download, StickyNote, Scale, FileSpreadsheet, FileText } from 'lucide-react';
import ReconcileModal from './ReconcileModal';
import MonthSpotlight, { focusableMonths } from './MonthSpotlight';
import YearCompare from './YearCompare';
import { MonthlySummaryRow } from './types';
import { MonthlyCharts, DividendSplit } from './MonthlySummaryInsights';
import {
  margins, cogsTone, fmtPct, currentMonthLabel, projectMonth, totalsOf, yearOf, yearsIn,
  sameMonthLastYear, changePct, exportSummaryCsv, exportDividendsCsv, pattayaNow, COGS_TARGET_PCT, COGS_WARN_PCT,
} from './monthlySummaryAnalytics';

const fmt = (n: number) => `฿${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (v: string) => (v.trim() === '' ? 0 : parseFloat(v) || 0);

const emptyForm = { label: '', balance: '', income: '', cogsExpense: '', operatingExpense: '', rentExpense: '', dividends: '' };
type FormState = typeof emptyForm;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Expense categories (see EXPENSE_CATEGORIES in LogExpense.tsx) that count as Cost of
// Goods Sold rather than Operating Expense for the auto-calculated Monthly Summary.
// Exported so monthlyReportPdf.ts uses the exact same categorization — never redefine
// this list a second time elsewhere.
export const COGS_CATEGORY_IDS = new Set(['food_expense', 'drink_expense', 'ice']);
export const COGS_CATEGORY_NAMES = new Set(['Food Expense', 'Drink Expense', 'Ice']);
export const DIVIDEND_CATEGORY_ID = 'dividends';
export const DIVIDEND_CATEGORY_NAME = 'Dividends';

// Rent is paid in advance (around February) for the rent year April–March, to 2 landlords.
// Every month is charged 1/12 of the payment that covers it (rentExpense, in profit). The
// payments themselves are "Rent paid" (rentPaid, logged in Finance as Rent Expense) and
// go into Prepaid rent (stored as rentReserve), which runs down by each month's share.
// New Balance stays as the real money: balance + income − COGS − operating − dividends −
// rent paid.
export const RENT_CATEGORY_IDS = new Set(['rent_expense']);
export const RENT_CATEGORY_NAMES = new Set(['Rent Expense', 'Rent']);
// Total rent for the rent year starting April of the given year. Years after the last one
// listed use the last amount until a new one is added here.
const RENT_BY_YEAR: Record<number, number> = { 2023: 1_400_000, 2024: 1_400_000, 2025: 1_620_000, 2026: 1_620_000 };
const RENT_YEAR_START_MONTH = 3; // April (0-indexed)
// Hand-entered months where a rent payment was entered under another heading. The figures
// here are what those months should hold once the payment is moved to Rent paid.
const HISTORIC_RENT_PAYMENTS: Record<string, Partial<Pick<MonthlySummaryRow, 'operatingExpense' | 'dividends'>> & { rentPaid: number }> = {
  'February 2024': { operatingExpense: 738_588, rentPaid: 1_200_000 }, // was 1,938,588
  'March 2024': { operatingExpense: 888_369, rentPaid: 200_000 }, // was 1,088,369
  'February 2025': { dividends: 0, rentPaid: 1_620_000 }, // was 1,620,000 in dividends
  'February 2026': { operatingExpense: 654_804, rentPaid: 1_620_000 }, // 1,400,000 was in Rent, 220,000 in operating
};
export const isRentExpense = (e: { category_id?: string; category_name?: string }) =>
  (!!e.category_id && RENT_CATEGORY_IDS.has(e.category_id)) || (!!e.category_name && RENT_CATEGORY_NAMES.has(e.category_name));
const rentYearOf = (year: number, month: number) => (month >= RENT_YEAR_START_MONTH ? year : year - 1);
const rentYearIndex = (month: number) => (month - RENT_YEAR_START_MONTH + 12) % 12;
const annualRent = (rentYear: number) => {
  const years = Object.keys(RENT_BY_YEAR).map(Number).sort((a, b) => a - b);
  const known = years.filter(y => y <= rentYear).pop() ?? years[0];
  return RENT_BY_YEAR[known];
};
// Rent used by the end of month index k of a rent year (k = 0 is April). Rounded on the
// cumulative figure so twelve months add up to exactly the year's rent.
const rentCumulative = (annual: number, k: number) => Math.round((annual * k) / 12 * 100) / 100;
const monthlyRent = (year: number, month: number) => {
  const annual = annualRent(rentYearOf(year, month));
  const k = rentYearIndex(month);
  return Math.round((rentCumulative(annual, k + 1) - rentCumulative(annual, k)) * 100) / 100;
};

// Auto-calculation only applies from July 2026 onward — earlier months were seeded
// manually from historical records and should not be silently overwritten from live data.
const AUTO_CALC_START = { year: 2026, month: 6 }; // month is 0-indexed (6 = July)

// From this month onward, every COMPLETED month is created and kept up to date
// automatically from finance_income / finance_expenses (see the auto-sync effect in
// MonthlySummary below). July 2026 and earlier are imported history and never touched.
const AUTO_SYNC_START = { year: 2026, month: 7 }; // 0-indexed (7 = August)

const round2 = (n: number) => Math.round(n * 100) / 100;

function isAutoCalcEligible(year: number, month: number) {
  return year > AUTO_CALC_START.year || (year === AUTO_CALC_START.year && month >= AUTO_CALC_START.month);
}

function formatMonthLabel(year: number, month: number) {
  return `${MONTH_NAMES[month]} ${year}`;
}

// Parses labels like "July 2026" back into { year, month }. Returns null for labels
// that don't match that pattern (e.g. "Balance from old Accounts").
export function parseMonthLabel(label: string): { year: number; month: number } | null {
  const parts = label.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const year = parseInt(parts[parts.length - 1], 10);
  if (!Number.isFinite(year)) return null;
  const monthName = parts.slice(0, -1).join(' ').toLowerCase();
  const month = MONTH_NAMES.findIndex(m => m.toLowerCase() === monthName);
  if (month === -1) return null;
  return { year, month };
}

export function nextMonth(year: number, month: number) {
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
}

// Sums finance_income / finance_expenses for the given calendar month into the four
// fields Monthly Summary tracks. Dates in both collections are 'YYYY-MM-DD' strings.
async function computeMonthTotals(year: number, month: number) {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const { year: endYear, month: endMonth } = nextMonth(year, month);
  const endDate = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`;

  const [incomeSnap, expenseSnap] = await Promise.all([
    getDocs(query(collection(db, 'finance_income'), where('date', '>=', startDate), where('date', '<', endDate))),
    getDocs(query(collection(db, 'finance_expenses'), where('date', '>=', startDate), where('date', '<', endDate))),
  ]);

  const income = incomeSnap.docs.reduce((s, d) => s + (d.data().amount || 0), 0);

  let cogsExpense = 0;
  let operatingExpense = 0;
  let dividends = 0;
  expenseSnap.docs.forEach(d => {
    const e = d.data();
    const total = e.total || 0;
    const isDividend = e.category_id === DIVIDEND_CATEGORY_ID || e.category_name === DIVIDEND_CATEGORY_NAME;
    const isCogs = (e.category_id && COGS_CATEGORY_IDS.has(e.category_id)) || COGS_CATEGORY_NAMES.has(e.category_name);
    if (isDividend) dividends += total;
    else if (isCogs) cogsExpense += total;
    else operatingExpense += total;
  });

  return { income, cogsExpense, operatingExpense, dividends };
}

// Same categorisation as computeMonthTotals(), applied to already-loaded docs so the
// auto-sync can recalculate every synced month from one live listener per collection.
function totalsFromDocs(incomeDocs: any[], expenseDocs: any[], startDate: string, endDate: string) {
  const inRange = (d: any) => typeof d.date === 'string' && d.date >= startDate && d.date < endDate;
  const income = incomeDocs.filter(inRange).reduce((s, d) => s + (d.amount || 0), 0);
  let cogsExpense = 0;
  let operatingExpense = 0;
  let dividends = 0;
  let rentPaid = 0;
  expenseDocs.filter(inRange).forEach(e => {
    const total = e.total || 0;
    const isDividend = e.category_id === DIVIDEND_CATEGORY_ID || e.category_name === DIVIDEND_CATEGORY_NAME;
    const isCogs = (e.category_id && COGS_CATEGORY_IDS.has(e.category_id)) || COGS_CATEGORY_NAMES.has(e.category_name);
    if (isDividend) dividends += total;
    else if (isRentExpense(e)) rentPaid += total; // paid from the rent reserve
    else if (isCogs) cogsExpense += total;
    else operatingExpense += total;
  });
  return { income: round2(income), cogsExpense: round2(cogsExpense), operatingExpense: round2(operatingExpense), dividends: round2(dividends), rentPaid: round2(rentPaid) };
}

// Months from AUTO_SYNC_START up to AND including the current (in-progress) month, GMT+7.
function completedSyncMonths(): { year: number; month: number }[] {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000); // Pattaya time
  const cur = { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  const out: { year: number; month: number }[] = [];
  let m = { ...AUTO_SYNC_START };
  while (m.year < cur.year || (m.year === cur.year && m.month <= cur.month)) {
    out.push(m);
    m = nextMonth(m.year, m.month);
  }
  return out;
}

const monthStart = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, '0')}-01`;

export default function MonthlySummary({ readOnly = false }: { readOnly?: boolean } = {}) {
  const [rows, setRows] = useState<MonthlySummaryRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState<MonthlySummaryRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [noteRow, setNoteRow] = useState<MonthlySummaryRow | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [reconRow, setReconRow] = useState<MonthlySummaryRow | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(''); // 'YYYY-MM', Add-mode month picker
  const [autoCalcLoading, setAutoCalcLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  // Guards against out-of-order resolution: if the user changes the month while a
  // previous computeMonthTotals() call is still in flight, only the response for the
  // most recently requested month is allowed to write into the form.
  const autoCalcRequestId = useRef(0);

  useEffect(() => {
    const q = query(collection(db, 'finance_monthly_summary'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      snap => {
        setRows(snap.docs.map(d => ({ id: d.id, ...d.data() } as MonthlySummaryRow)));
        setLoading(false);
      },
      err => {
        console.error(err);
        setError(err.message || 'Failed to load');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Live finance data from AUTO_SYNC_START onward, used to keep synced months current.
  const [syncIncome, setSyncIncome] = useState<any[] | null>(null);
  const [syncExpenses, setSyncExpenses] = useState<any[] | null>(null);
  useEffect(() => {
    const start = monthStart(AUTO_SYNC_START.year, AUTO_SYNC_START.month);
    const u1 = onSnapshot(query(collection(db, 'finance_income'), where('date', '>=', start)),
      snap => setSyncIncome(snap.docs.map(d => d.data())), err => console.error('Auto-sync income:', err));
    const u2 = onSnapshot(query(collection(db, 'finance_expenses'), where('date', '>=', start)),
      snap => setSyncExpenses(snap.docs.map(d => d.data())), err => console.error('Auto-sync expenses:', err));
    return () => { u1(); u2(); };
  }, []);

  // Private month notes live in their own owner-only collection (keyed by the month
  // row's id) so read-only partners can't see them, even in the raw data.
  const [privateNotes, setPrivateNotes] = useState<Record<string, string>>({});
  useEffect(() => {
    if (readOnly) return;
    return onSnapshot(collection(db, 'finance_monthly_summary_notes'),
      snap => setPrivateNotes(Object.fromEntries(snap.docs.map(d => [d.id, (d.data().notes as string) || '']))),
      err => console.error('Monthly Summary notes:', err));
  }, [readOnly]);

  // Every month with its rent charged monthly: hand-entered months (before August 2026)
  // keep their own income / COGS / operating / dividends, synced months come live from
  // Finance. The balance chains on from the first month's opening balance. Pure — used
  // both to persist (owner) and to display live (read-only partners, who can't write).
  const computedSync = useMemo(() => {
    if (!rows || !syncIncome || !syncExpenses) return null;
    const ymKey = (y: number, m: number) => y * 12 + m;
    const syncStartKey = ymKey(AUTO_SYNC_START.year, AUTO_SYNC_START.month);
    const handRows = rows.filter(r => {
      const p = parseMonthLabel(r.label);
      return !!p && ymKey(p.year, p.month) < syncStartKey;
    });
    const months = completedSyncMonths();
    const firstMonth = handRows.length ? parseMonthLabel(handRows[0].label)! : months[0];
    if (!firstMonth) return null;
    // Opening balance: the first hand-entered month's own, else the last row before sync.
    const prior = rows.filter(r => { const p = parseMonthLabel(r.label); return !p || ymKey(p.year, p.month) < syncStartKey; }).pop();
    if (!handRows.length && !prior) return null; // nothing to chain from yet
    let balance = handRows.length ? handRows[0].balance || 0 : prior!.newBalance;
    // Prepaid rent at the start: the part of the first month's rent year not yet used.
    const firstAnnual = annualRent(rentYearOf(firstMonth.year, firstMonth.month));
    let prepaid = round2(firstAnnual - rentCumulative(firstAnnual, rentYearIndex(firstMonth.month)));
    const out: (Omit<MonthlySummaryRow, 'id' | 'order'>)[] = [];
    const push = (label: string, year: number, month: number, t: { income: number; cogsExpense: number; operatingExpense: number; dividends: number; rentPaid: number }) => {
      const rentExpense = monthlyRent(year, month);
      prepaid = round2(prepaid + t.rentPaid - rentExpense);
      const profit = round2(t.income - t.cogsExpense - t.operatingExpense - rentExpense);
      const newBalance = round2(balance + t.income - t.cogsExpense - t.operatingExpense - t.dividends - t.rentPaid);
      out.push({ label, balance: round2(balance), ...t, rentExpense, profit, newBalance, rentReserve: prepaid });
      balance = newBalance;
    };
    handRows.forEach(r => {
      const p = parseMonthLabel(r.label)!;
      const fix = HISTORIC_RENT_PAYMENTS[r.label];
      push(r.label, p.year, p.month, {
        income: r.income || 0, cogsExpense: r.cogsExpense || 0,
        operatingExpense: fix?.operatingExpense ?? (r.operatingExpense || 0),
        dividends: fix?.dividends ?? (r.dividends || 0),
        rentPaid: fix?.rentPaid ?? 0,
      });
    });
    months.forEach(m => {
      const next = nextMonth(m.year, m.month);
      const t = totalsFromDocs(syncIncome, syncExpenses, monthStart(m.year, m.month), monthStart(next.year, next.month));
      push(formatMonthLabel(m.year, m.month), m.year, m.month, t);
    });
    return out;
  }, [rows, syncIncome, syncExpenses]);

  // Auto-sync (owner only): persist computedSync — create missing months, update changed
  // ones. Only writes when a figure actually differs, so the rows snapshot settles at once.
  const syncingRef = useRef(false);
  useEffect(() => {
    if (readOnly || !rows || !computedSync || syncingRef.current) return;
    const run = async () => {
      syncingRef.current = true;
      try {
        const byLabel = new Map(rows.map(r => [r.label, r]));
        let order = Math.max(...rows.map(r => r.order));
        const nowIso = new Date().toISOString();
        const by = auth.currentUser?.email || 'auto-sync';
        for (const data of computedSync) {
          const existing = byLabel.get(data.label);
          if (!existing) {
            order += 1;
            await addDoc(collection(db, 'finance_monthly_summary'), { ...data, order, autoSynced: true, createdAt: nowIso, updatedAt: nowIso, updatedBy: by });
          } else {
            const changed = (['balance', 'income', 'cogsExpense', 'operatingExpense', 'dividends', 'profit', 'newBalance', 'rentExpense', 'rentPaid', 'rentReserve'] as const)
              .some(k => round2((existing as any)[k] || 0) !== (data as any)[k]);
            if (changed) {
              await updateDoc(doc(db, 'finance_monthly_summary', existing.id!), { ...data, updatedAt: nowIso, updatedBy: by });
            }
          }
        }
      } catch (err) {
        console.error('Monthly Summary auto-sync failed:', err);
      } finally {
        syncingRef.current = false;
      }
    };
    run();
  }, [readOnly, rows, computedSync]);

  const nextOrder = useMemo(
    () => (rows && rows.length > 0 ? Math.max(...rows.map(r => r.order)) + 1 : 0),
    [rows]
  );
  const lastNewBalance = useMemo(
    () => (rows && rows.length > 0 ? rows[rows.length - 1].newBalance : 0),
    [rows]
  );
  // Fetched oldest-first (needed for nextOrder/lastNewBalance above); displayed newest-first.
  // Partners see synced months live from Finance (they can't write, so stored rows may
  // lag until the owner next opens the page); the owner sees the stored rows.
  const displayRows = useMemo(() => {
    if (!rows) return rows;
    if (!readOnly || !computedSync) return [...rows].reverse();
    const live = new Map(computedSync.map(d => [d.label, d]));
    const merged = rows.map(r => (live.has(r.label) ? { ...r, ...live.get(r.label)! } : r));
    let order = Math.max(...rows.map(r => r.order));
    computedSync.forEach(d => {
      if (!rows.some(r => r.label === d.label)) merged.push({ id: `live-${d.label}`, order: ++order, ...d } as MonthlySummaryRow);
    });
    return merged.reverse();
  }, [rows, readOnly, computedSync]);

  // Runs the live aggregation for a given month and fills it into the form. Used both
  // by the Add-mode month picker and the Edit-mode "Recalculate" button.
  const runAutoCalc = async (year: number, month: number) => {
    const requestId = ++autoCalcRequestId.current;
    setAutoCalcLoading(true);
    try {
      const totals = await computeMonthTotals(year, month);
      if (requestId !== autoCalcRequestId.current) return; // superseded by a newer request
      setForm(f => ({
        ...f,
        income: String(totals.income),
        cogsExpense: String(totals.cogsExpense),
        operatingExpense: String(totals.operatingExpense),
        dividends: String(totals.dividends),
      }));
      setAutoFilled(true);
    } catch (err) {
      if (requestId !== autoCalcRequestId.current) return; // superseded by a newer request
      console.error(err);
      toast.error('Failed to pull logged totals for that month');
    } finally {
      if (requestId === autoCalcRequestId.current) setAutoCalcLoading(false);
    }
  };

  const openAdd = () => {
    setEditingRow(null);
    setAutoFilled(false);

    // Default the picker to the month after the most recent existing row.
    const lastLabel = rows && rows.length > 0 ? rows[rows.length - 1].label : null;
    const parsedLast = lastLabel ? parseMonthLabel(lastLabel) : null;
    const now = new Date();
    const fallback = { year: now.getFullYear(), month: now.getMonth() };
    const { year, month } = parsedLast ? nextMonth(parsedLast.year, parsedLast.month) : fallback;

    setSelectedMonth(`${year}-${String(month + 1).padStart(2, '0')}`);
    setForm({ ...emptyForm, label: formatMonthLabel(year, month), balance: lastNewBalance ? String(lastNewBalance) : '' });
    setShowForm(true);
    runAutoCalc(year, month);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    const [y, m] = value.split('-').map(Number);
    if (!y || !m) return;
    const year = y;
    const month = m - 1;
    if (isAutoCalcEligible(year, month)) {
      setForm(f => ({ ...f, label: formatMonthLabel(year, month) }));
      runAutoCalc(year, month);
    } else {
      // Historical months are seeded manually — never auto-fill from live data, and
      // invalidate any in-flight request from a previously selected eligible month.
      autoCalcRequestId.current++;
      setAutoFilled(false);
      setForm(f => ({ ...f, label: formatMonthLabel(year, month), income: '', cogsExpense: '', operatingExpense: '', rentExpense: '', dividends: '' }));
    }
  };

  const openEdit = (r: MonthlySummaryRow) => {
    setEditingRow(r);
    setAutoFilled(false);
    setForm({
      label: r.label,
      balance: String(r.balance ?? ''),
      income: String(r.income ?? ''),
      cogsExpense: String(r.cogsExpense ?? ''),
      operatingExpense: String(r.operatingExpense ?? ''),
      rentExpense: String(r.rentExpense ?? ''),
      dividends: String(r.dividends ?? ''),
    });
    setShowForm(true);
  };

  const handleRecalc = () => {
    if (!editingRow) return;
    // Use the currently displayed label (which the user may have edited), not the
    // row's original label, so the fetched totals always match what will be saved.
    const parsed = parseMonthLabel(form.label);
    if (!parsed) return;
    runAutoCalc(parsed.year, parsed.month);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRow(null);
  };

  const previewRent = (() => { const p = parseMonthLabel(form.label); return p ? monthlyRent(p.year, p.month) : num(form.rentExpense); })();
  const previewProfit = num(form.income) - num(form.cogsExpense) - num(form.operatingExpense) - previewRent;
  const previewNewBalance = num(form.balance) + num(form.income) - num(form.cogsExpense) - num(form.operatingExpense) - num(form.dividends) - (editingRow?.rentPaid || 0);

  // Whether the currently-displayed label (which may have been edited) is eligible
  // for the "Recalculate" button — always derived from form.label, not the original
  // row, so eligibility and the fetch in handleRecalc agree on the same month.
  const editingParsed = editingRow ? parseMonthLabel(form.label) : null;
  const editingRecalcEligible = !!editingParsed && isAutoCalcEligible(editingParsed.year, editingParsed.month);

  const handleSave = async () => {
    if (!form.label.trim()) {
      toast.error('Month label is required');
      return;
    }
    setSaving(true);
    const balance = num(form.balance);
    const income = num(form.income);
    const cogsExpense = num(form.cogsExpense);
    const operatingExpense = num(form.operatingExpense);
    const parsedLabel = parseMonthLabel(form.label);
    const rentExpense = parsedLabel ? monthlyRent(parsedLabel.year, parsedLabel.month) : num(form.rentExpense);
    const dividends = num(form.dividends);
    const profit = income - cogsExpense - operatingExpense - rentExpense;
    // Real money: rent is taken out when it's paid, not month by month.
    const newBalance = balance + income - cogsExpense - operatingExpense - dividends - (editingRow?.rentPaid || 0);
    const nowIso = new Date().toISOString();

    try {
      if (editingRow) {
        await updateDoc(doc(db, 'finance_monthly_summary', editingRow.id), {
          label: form.label.trim(),
          balance,
          income,
          cogsExpense,
          operatingExpense,
          rentExpense,
          dividends,
          profit,
          newBalance,
          updatedAt: nowIso,
          updatedBy: auth.currentUser?.email || 'unknown',
        });
        await logActivity('Monthly Summary Edited', `${form.label.trim()} · New Balance ${fmt(newBalance)}`, 'finance');
        toast.success('Month updated');
      } else {
        await addDoc(collection(db, 'finance_monthly_summary'), {
          order: nextOrder,
          label: form.label.trim(),
          balance,
          income,
          cogsExpense,
          operatingExpense,
          rentExpense,
          dividends,
          profit,
          newBalance,
          createdAt: nowIso,
          updatedAt: nowIso,
          updatedBy: auth.currentUser?.email || 'unknown',
        });
        await logActivity('Monthly Summary Added', `${form.label.trim()} · New Balance ${fmt(newBalance)}`, 'finance');
        toast.success('Month added');
      }
      closeForm();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save — super admin permissions required');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async (r: MonthlySummaryRow) => {
    if (!rows) return;
    setGeneratingReportId(r.id);
    try {
      // Dynamically imported so the jsPDF/autotable bundle is only downloaded when a
      // report is actually requested, not by every visitor who loads this page.
      const { generateMonthlyReportPdf } = await import('./monthlyReportPdf');
      await generateMonthlyReportPdf(r, rows);
      await logActivity('Monthly Report Generated', r.label, 'finance');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate report');
    } finally {
      setGeneratingReportId(null);
    }
  };

  const openNote = (r: MonthlySummaryRow) => {
    setNoteRow(r);
    setNoteText(privateNotes[r.id] ?? r.notes ?? '');
  };

  const closeNote = () => {
    setNoteRow(null);
    setNoteText('');
  };

  const handleSaveNote = async () => {
    if (!noteRow) return;
    setSavingNote(true);
    try {
      await setDoc(doc(db, 'finance_monthly_summary_notes', noteRow.id), {
        notes: noteText.trim(),
        label: noteRow.label,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || 'unknown',
      });
      await logActivity('Monthly Summary Note Updated', noteRow.label, 'finance');
      toast.success('Note saved');
      closeNote();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save note — super admin permissions required');
    } finally {
      setSavingNote(false);
    }
  };

  // ---- Views, year filter, exports, period reports ----------------------------
  const [view, setView] = useState<'table' | 'charts' | 'compare' | 'dividends'>('table');
  const [focusLabel, setFocusLabel] = useState<string | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [yearFilter, setYearFilter] = useState<'all' | number>('all');
  const [showPeriod, setShowPeriod] = useState(false);
  const [periodYear, setPeriodYear] = useState<number>(pattayaNow().year);
  const [periodQuarter, setPeriodQuarter] = useState<number | null>(Math.floor(pattayaNow().month / 3) + 1);
  const [generatingPeriod, setGeneratingPeriod] = useState(false);
  const [periodPreview, setPeriodPreview] = useState<{ url: string; filename: string; label: string } | null>(null);
  // Free the preview's object URL when it's replaced or the page unmounts.
  useEffect(() => () => { if (periodPreview) URL.revokeObjectURL(periodPreview.url); }, [periodPreview]);
  const mtdLabel = currentMonthLabel();

  // Oldest-first, using the same figures that are displayed (live for partners).
  const allRowsOldest = useMemo(() => (displayRows ? [...displayRows].reverse() : []), [displayRows]);
  const years = useMemo(() => yearsIn(allRowsOldest), [allRowsOldest]);
  const filteredOldest = useMemo(
    () => (yearFilter === 'all' ? allRowsOldest : allRowsOldest.filter(r => yearOf(r) === yearFilter)),
    [allRowsOldest, yearFilter]
  );
  // Month rows only (excludes opening-balance rows like "Balance from old Accounts").
  const monthRowsOldest = useMemo(() => filteredOldest.filter(r => yearOf(r) !== null), [filteredOldest]);

  // Table items, newest-first, with a subtotal row heading each year.
  const tableItems = useMemo(() => {
    const items: ({ kind: 'row'; row: MonthlySummaryRow } | { kind: 'year'; year: number })[] = [];
    let lastYear: number | null = null;
    [...filteredOldest].reverse().forEach(r => {
      const y = yearOf(r);
      if (y !== null && y !== lastYear) items.push({ kind: 'year', year: y });
      if (y !== null) lastYear = y;
      items.push({ kind: 'row', row: r });
    });
    return items;
  }, [filteredOldest]);
  const yearTotals = useMemo(() => {
    const m = new Map<number, ReturnType<typeof totalsOf>>();
    years.forEach(y => m.set(y, totalsOf(allRowsOldest.filter(r => yearOf(r) === y))));
    return m;
  }, [years, allRowsOldest]);

  const handleExport = () => {
    const suffix = yearFilter === 'all' ? 'All' : String(yearFilter);
    if (view === 'dividends') exportDividendsCsv(monthRowsOldest, `Hemingways_Pattaya_Dividends_${suffix}.csv`);
    else exportSummaryCsv(filteredOldest, `Hemingways_Pattaya_Monthly_Summary_${suffix}.csv`);
    logActivity('Monthly Summary Exported', `${view === 'dividends' ? 'Dividends' : 'Summary'} · ${suffix}`, 'finance');
  };

  const handleGeneratePeriod = async () => {
    setGeneratingPeriod(true);
    try {
      const { generatePeriodReportPdf, periodLabel } = await import('./periodReportPdf');
      const period = { year: periodYear, quarter: periodQuarter };
      const { blob, filename } = await generatePeriodReportPdf(period, allRowsOldest);
      setPeriodPreview({ url: URL.createObjectURL(blob), filename, label: periodLabel(period) });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error && err.message.startsWith('No months') ? err.message : 'Failed to generate report');
    } finally {
      setGeneratingPeriod(false);
    }
  };

  const closePeriod = () => {
    setShowPeriod(false);
    setPeriodPreview(null);
  };

  const handleDownloadPeriod = async () => {
    if (!periodPreview) return;
    const a = document.createElement('a');
    a.href = periodPreview.url;
    a.download = periodPreview.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    await logActivity('Period Report Downloaded', periodPreview.label, 'finance');
  };

  const toneCls = { good: 'text-green-600', warn: 'text-amber-600', bad: 'text-red-600', none: 'text-gray-400' } as const;
  const colCount = readOnly ? 14 : 15;

  const handleDelete = async (r: MonthlySummaryRow) => {
    if (!window.confirm(`Delete "${r.label}"? This cannot be undone.`)) return;
    setDeletingId(r.id);
    try {
      await deleteDoc(doc(db, 'finance_monthly_summary', r.id));
      await logActivity('Monthly Summary Deleted', r.label, 'finance');
      toast.success('Month deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete — super admin permissions required');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Monthly Summary</h1>
          <p className="text-xs text-gray-400 mt-1">
            {readOnly
              ? 'Read-only · August 2026 onward updates live from Finance · rent charged monthly, payments held as prepaid rent · running balance, income, expenses, profit & dividends by month'
              : 'Private · August 2026 onward updates automatically from Finance · rent charged monthly, payments held as prepaid rent · running balance, income, expenses, profit & dividends by month'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowPeriod(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
            title="Quarterly or annual P&L report (PDF)"
          >
            <FileText size={16} /> Period Report
          </button>
          <button
            onClick={handleExport}
            disabled={!rows || rows.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
            title={view === 'dividends' ? 'Export dividend split (CSV, opens in Excel)' : 'Export summary (CSV, opens in Excel)'}
          >
            <FileSpreadsheet size={16} /> Export
          </button>
          {!readOnly && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DA0A8] text-white rounded-xl text-sm font-bold hover:bg-[#18919a] transition-all"
            >
              <Plus size={16} /> Add Month
            </button>
          )}
        </div>
      </div>

      {!loading && !error && allRowsOldest.length > 0 && (
        <div ref={spotlightRef}>
          <MonthSpotlight rows={allRowsOldest} focusLabel={focusLabel} onFocus={setFocusLabel} />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1">
          {([['table', 'Table'], ['charts', 'Charts'], ['compare', 'Compare'], ['dividends', 'Dividends']] as const).map(([v, name]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-[#1DA0A8] text-white' : 'text-gray-600 hover:text-ink'}`}
            >
              {name}
            </button>
          ))}
        </div>
        {view !== 'compare' && <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1DA0A8]"
        >
          <option value="all">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>}
      </div>

      {loading && (
        <p className="text-xs text-gray-400 italic flex items-center gap-1">
          <Loader2 size={12} className="animate-spin" /> Loading...
        </p>
      )}
      {error && <p className="text-xs text-red-500">Couldn't load: {error}</p>}

      {!loading && !error && (
        rows && rows.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center py-10 bg-white rounded-2xl border border-gray-100">
            No months logged yet
          </p>
        ) : view === 'charts' ? (
          <MonthlyCharts rows={monthRowsOldest} />
        ) : view === 'compare' ? (
          <YearCompare rows={allRowsOldest} />
        ) : view === 'dividends' ? (
          <DividendSplit rows={monthRowsOldest} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto max-h-[calc(100vh-10rem)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide sticky top-0 z-20 bg-white">
                  <th className="px-4 py-3 sticky left-0 z-30 bg-white">Month</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-right">Income</th>
                  <th className="px-4 py-3 text-right">COGS Expense</th>
                  <th className="px-4 py-3 text-right">Operating Expense</th>
                  <th className="px-4 py-3 text-right" title="Rent charged to the month: 1/12 of the rent for that April–March year.">Rent</th>
                  <th className="px-4 py-3 text-right">Profit</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap" title={`Food, drink and ice as % of income. Target ${COGS_TARGET_PCT}% or less, amber up to ${COGS_WARN_PCT}%.`}>COGS %</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap" title="Income after COGS, as % of income">Gross %</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap" title="Profit as % of income">Net %</th>
                  <th className="px-4 py-3 text-right">Dividends</th>
                  <th className="px-4 py-3 text-right">New Balance</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap" title="Rent already paid that covers future months. Goes up when rent is paid and down by each month's share.">Prepaid Rent</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap" title="Income and profit vs the same month last year">vs Last Year</th>
                  {!readOnly && <th className="px-4 py-3 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tableItems.map(item => {
                  if (item.kind === 'year') {
                    const t = yearTotals.get(item.year)!;
                    const m = margins(t);
                    const isCurrentYear = item.year === pattayaNow().year;
                    return (
                      <tr key={`year-${item.year}`} className="border-b border-gray-100 bg-cream font-bold text-ink">
                        <td className="px-4 py-2.5 whitespace-nowrap sticky left-0 z-10 bg-cream">
                          {item.year} {isCurrentYear ? 'YTD' : 'total'}
                          <span className="ml-1.5 text-[11px] font-normal text-gray-500">{t.months} mo</span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-gray-600 font-medium">{fmt(t.balance)}</td>
                        <td className="px-4 py-2.5 text-right text-green-600">{fmt(t.income)}</td>
                        <td className="px-4 py-2.5 text-right text-red-500">{fmt(t.cogsExpense)}</td>
                        <td className="px-4 py-2.5 text-right text-red-500">{fmt(t.operatingExpense)}</td>
                        <td className="px-4 py-2.5 text-right text-red-500">{fmt(t.rentExpense)}</td>
                        <td className={`px-4 py-2.5 text-right ${t.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(t.profit)}</td>
                        <td className={`px-4 py-2.5 text-right ${toneCls[cogsTone(m.cogsPct)]}`}>{fmtPct(m.cogsPct)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-700">{fmtPct(m.grossMarginPct)}</td>
                        <td className={`px-4 py-2.5 text-right ${(m.netMarginPct ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmtPct(m.netMarginPct)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{fmt(t.dividends)}</td>
                        <td className="px-4 py-2.5 text-right">{fmt(t.newBalance)}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600 font-medium">{t.rentReserve === null ? '' : fmt(t.rentReserve)}</td>
                        <td className="px-4 py-2.5" colSpan={colCount - 13} />
                      </tr>
                    );
                  }
                  const r = item.row;
                  const isMtd = r.label === mtdLabel;
                  // No percentages for the month in progress: income isn't fully entered
                  // yet, so margins and the comparison with last year would mislead.
                  const m = isMtd ? { cogsPct: null, grossMarginPct: null, netMarginPct: null } : margins(r);
                  const proj = isMtd ? projectMonth(r) : null;
                  const ly = isMtd ? null : sameMonthLastYear(r, allRowsOldest);
                  const incomeChg = ly ? changePct(r.income, ly.income) : null;
                  const profitChg = ly ? changePct(r.profit, ly.profit) : null;
                  const chgCls = (p: number | null) => (p === null ? 'text-gray-400' : p >= 0 ? 'text-green-600' : 'text-red-600');
                  const chgTxt = (p: number | null) => (p === null ? '—' : `${p > 0 ? '+' : ''}${p.toFixed(1)}%`);
                  return (
                  <tr key={r.id} className={`border-b border-gray-50 last:border-0 ${isMtd ? 'bg-amber-50/40' : ''}`}>
                    <td className={`px-4 py-3 font-medium text-ink whitespace-nowrap sticky left-0 z-10 ${isMtd ? 'bg-amber-50' : 'bg-white'}`}>
                      {focusableMonths([r]).length ? (
                        <button
                          onClick={() => { setFocusLabel(r.label); spotlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                          className={`hover:text-[#1DA0A8] hover:underline underline-offset-4 ${focusLabel === r.label ? 'text-[#1DA0A8]' : ''}`}
                          title="Show this month in focus"
                        >
                          {r.label}
                        </button>
                      ) : r.label}
                      {isMtd && (
                        <span
                          className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 rounded px-1.5 py-0.5"
                          title={`Month in progress: day ${proj!.daysElapsed} of ${proj!.daysInMonth}`}
                        >
                          MTD
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.balance)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">{fmt(r.income)}</td>
                    <td className="px-4 py-3 text-right text-red-500">{fmt(r.cogsExpense)}</td>
                    <td className="px-4 py-3 text-right text-red-500">{fmt(r.operatingExpense)}</td>
                    <td className="px-4 py-3 text-right text-red-500">{fmt(r.rentExpense || 0)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${r.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(r.profit)}
                      {proj && (
                        <div className="text-[11px] font-normal text-gray-500 whitespace-nowrap" title={`Projected full month from ${proj.daysElapsed} of ${proj.daysInMonth} days: income ${fmt(proj.income)}`}>
                          projected {fmt(proj.profit)}
                        </div>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${toneCls[cogsTone(m.cogsPct)]}`}>{fmtPct(m.cogsPct)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{fmtPct(m.grossMarginPct)}</td>
                    <td className={`px-4 py-3 text-right ${m.netMarginPct === null ? 'text-gray-400' : m.netMarginPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmtPct(m.netMarginPct)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(r.dividends)}</td>
                    <td className="px-4 py-3 text-right font-bold text-ink">{fmt(r.newBalance)}</td>
                    <td
                      className="px-4 py-3 text-right text-gray-600 whitespace-nowrap"
                      title={r.rentReserve === undefined ? '' : `Used ${fmt(r.rentExpense || 0)}${r.rentPaid ? ` · paid ${fmt(r.rentPaid)}` : ''}`}
                    >
                      {r.rentReserve === undefined ? <span className="text-gray-300">—</span> : (
                        <>
                          {fmt(r.rentReserve)}
                          {!!r.rentPaid && <div className="text-[11px] text-amber-600">paid {fmt(r.rentPaid)}</div>}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-xs" title={ly ? `${ly.label}: income ${fmt(ly.income)}, profit ${fmt(ly.profit)}` : isMtd ? 'Month in progress' : 'No figures for the same month last year'}>
                      {ly ? (
                        <>
                          <div className={chgCls(incomeChg)}>Income {chgTxt(incomeChg)}</div>
                          <div className={chgCls(profitChg)}>Profit {chgTxt(profitChg)}</div>
                        </>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    {!readOnly && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleGenerateReport(r)}
                          disabled={generatingReportId === r.id}
                          className="text-gray-400 hover:text-[#1DA0A8] transition-colors disabled:opacity-50"
                          title="Generate partner report (PDF)"
                        >
                          {generatingReportId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        </button>
                        <button
                          onClick={() => openNote(r)}
                          className={`transition-colors rounded-md p-1 -m-1 ${(privateNotes[r.id] ?? r.notes)?.trim() ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'text-gray-400 hover:text-[#1DA0A8]'}`}
                          title={(privateNotes[r.id] ?? r.notes)?.trim() ? 'View/edit note' : 'Add note'}
                        >
                          <StickyNote size={14} strokeWidth={(privateNotes[r.id] ?? r.notes)?.trim() ? 2.5 : 2} />
                        </button>
                        <button onClick={() => setReconRow(r)} className="text-gray-400 hover:text-[#1DA0A8] transition-colors" title="Reconcile">
                          <Scale size={14} />
                        </button>
                        <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-[#1DA0A8] transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          disabled={deletingId === r.id}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                    )}
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeForm}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">{editingRow ? 'Edit Month' : 'Add Month'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {editingRow ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month label</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. July 2026"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                  />
                  {editingRecalcEligible && (
                    <button
                      type="button"
                      onClick={handleRecalc}
                      disabled={autoCalcLoading}
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#1DA0A8] hover:text-[#18919a] disabled:opacity-50"
                    >
                      {autoCalcLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      Recalculate from logged data
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={e => handleMonthChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                  />
                </div>
              )}
              {autoFilled && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5 -mt-2">
                  {autoCalcLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                  Income / COGS / Operating / Dividends pulled from logged transactions for {form.label} — review before saving.
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance (starting, ฿)</label>
                <input
                  type="number"
                  value={form.balance}
                  onChange={e => setForm(f => ({ ...f, balance: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income (฿)</label>
                <input
                  type="number"
                  value={form.income}
                  onChange={e => setForm(f => ({ ...f, income: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COGS Expense (฿)</label>
                <input
                  type="number"
                  value={form.cogsExpense}
                  onChange={e => setForm(f => ({ ...f, cogsExpense: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Expense (฿)</label>
                <input
                  type="number"
                  value={form.operatingExpense}
                  onChange={e => setForm(f => ({ ...f, operatingExpense: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent (฿)</label>
                <input
                  type="number"
                  value={(() => { const p = parseMonthLabel(form.label); return p ? String(monthlyRent(p.year, p.month)) : form.rentExpense; })()}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Set automatically: 1/12 of the year's rent. Rent payments go in Finance as Rent Expense.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dividends (฿)</label>
                <input
                  type="number"
                  value={form.dividends}
                  onChange={e => setForm(f => ({ ...f, dividends: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div className="text-center p-3 bg-cream rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Profit (auto)</p>
                  <p className={`font-bold ${previewProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(previewProfit)}</p>
                </div>
                <div className="text-center p-3 bg-cream rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">New Balance (auto)</p>
                  <p className="font-bold text-ink">{fmt(previewNewBalance)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closeForm} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#1DA0A8] text-white rounded-xl font-bold hover:bg-[#18919a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {reconRow && <ReconcileModal row={reconRow} onClose={() => setReconRow(null)} />}

      {showPeriod && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closePeriod}>
          <div className={`bg-white rounded-2xl p-6 w-full shadow-xl ${periodPreview ? 'max-w-5xl' : 'max-w-sm'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Period Report{periodPreview ? ` — ${periodPreview.label}` : ''}</h3>
              <button onClick={closePeriod} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {periodPreview ? (
              <>
                <iframe src={periodPreview.url} title={`${periodPreview.label} report preview`} className="w-full h-[70vh] rounded-xl border border-gray-200 bg-gray-50" />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setPeriodPreview(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={handleDownloadPeriod}
                    className="flex-1 py-2.5 bg-[#1DA0A8] text-white rounded-xl font-bold hover:bg-[#18919a] transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </>
            ) : (
            <>
            <p className="text-xs text-gray-500 mb-4">P&L for a quarter or full year, with month-by-month figures, margins, the same period last year and each partner's dividend share.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={periodYear}
                  onChange={e => setPeriodYear(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900 bg-white"
                >
                  {(years.length ? years : [pattayaNow().year]).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4].map(q => (
                    <button
                      key={q}
                      onClick={() => setPeriodQuarter(q)}
                      className={`py-2 rounded-xl text-sm font-medium border ${periodQuarter === q ? 'bg-[#1DA0A8] text-white border-[#1DA0A8]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Q{q}
                    </button>
                  ))}
                  <button
                    onClick={() => setPeriodQuarter(null)}
                    className={`py-2 rounded-xl text-sm font-medium border ${periodQuarter === null ? 'bg-[#1DA0A8] text-white border-[#1DA0A8]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={closePeriod} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleGeneratePeriod}
                disabled={generatingPeriod}
                className="flex-1 py-2.5 bg-[#1DA0A8] text-white rounded-xl font-bold hover:bg-[#18919a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingPeriod ? (<><Loader2 size={16} className="animate-spin" /> Generating...</>) : (<><FileText size={16} /> Preview</>)}
              </button>
            </div>
            </>
            )}
          </div>
        </div>
      )}

      {noteRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeNote}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Note — {noteRow.label}</h3>
              <button onClick={closeNote} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Internal note for this month (not shown in partner reports)..."
              rows={6}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button onClick={closeNote} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="flex-1 py-2.5 bg-[#1DA0A8] text-white rounded-xl font-bold hover:bg-[#18919a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingNote ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pure helpers for the Monthly Summary page and its reports: margins, month-to-date
// projection, year totals, year-on-year comparison, partner dividend split and CSV export.
// No Firestore access here — everything works on MonthlySummaryRow data already loaded.
import { MonthlySummaryRow } from './types';
import { DIVIDEND_SHARES } from '../../utils/partners';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Gross COGS (food / drink / ice) as a % of income. At or under the target is green,
// up to the warning level is amber, above is red.
export const COGS_TARGET_PCT = 35;
export const COGS_WARN_PCT = 40;

export const round2 = (n: number) => Math.round(n * 100) / 100;

// Local copy of MonthlySummary.parseMonthLabel — kept here so this module doesn't
// import the page component (which would create a circular import).
export function parseLabel(label: string): { year: number; month: number } | null {
  const parts = label.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const year = parseInt(parts[parts.length - 1], 10);
  if (!Number.isFinite(year)) return null;
  const month = MONTHS.findIndex(m => m.toLowerCase() === parts.slice(0, -1).join(' ').toLowerCase());
  return month === -1 ? null : { year, month };
}

// null when income is zero, so the UI shows "—" instead of NaN/Infinity.
export function pctOf(num: number, den: number): number | null {
  return Math.abs(den) < 0.005 ? null : (num / den) * 100;
}
export const fmtPct = (p: number | null, digits = 1) => (p === null ? '—' : `${p.toFixed(digits)}%`);

export function margins(r: { income: number; cogsExpense: number; profit: number }) {
  return {
    cogsPct: pctOf(r.cogsExpense, r.income),
    grossMarginPct: pctOf(r.income - r.cogsExpense, r.income),
    netMarginPct: pctOf(r.profit, r.income),
  };
}

export function cogsTone(cogsPct: number | null): 'good' | 'warn' | 'bad' | 'none' {
  if (cogsPct === null) return 'none';
  if (cogsPct <= COGS_TARGET_PCT) return 'good';
  if (cogsPct <= COGS_WARN_PCT) return 'warn';
  return 'bad';
}

// ---- Month to date (GMT+7) -----------------------------------------------

export function pattayaNow() {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return { year: now.getUTCFullYear(), month: now.getUTCMonth(), day: now.getUTCDate() };
}

export function currentMonthLabel() {
  const { year, month } = pattayaNow();
  return `${MONTHS[month]} ${year}`;
}

// Straight-line projection of the in-progress month to a full month: income and
// expenses scaled by days-in-month / days-elapsed. Dividends aren't projected.
export function projectMonth(r: MonthlySummaryRow) {
  const { year, month, day } = pattayaNow();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const factor = daysInMonth / Math.max(day, 1);
  const income = round2(r.income * factor);
  const cogsExpense = round2(r.cogsExpense * factor);
  const operatingExpense = round2(r.operatingExpense * factor);
  // Rent is already a full month's share, so it isn't scaled.
  const rent = r.rentExpense || 0;
  return { daysElapsed: day, daysInMonth, income, cogsExpense, operatingExpense, profit: round2(income - cogsExpense - operatingExpense - rent) };
}

// ---- Totals, years, YoY --------------------------------------------------

export type Totals = {
  income: number;
  cogsExpense: number;
  operatingExpense: number;
  profit: number;
  dividends: number;
  balance: number; // opening balance of the first month in the set
  newBalance: number; // closing balance of the last month in the set
  rentExpense: number; // rent charged over the set
  rentPaid: number;
  rentReserve: number | null; // prepaid rent at the end of the set (null if never tracked)
  months: number;
};

// rows must be oldest-first.
export function totalsOf(rows: MonthlySummaryRow[]): Totals {
  const sum = (k: 'income' | 'cogsExpense' | 'operatingExpense' | 'profit' | 'dividends') =>
    round2(rows.reduce((s, r) => s + (r[k] || 0), 0));
  return {
    income: sum('income'),
    cogsExpense: sum('cogsExpense'),
    operatingExpense: sum('operatingExpense'),
    profit: sum('profit'),
    dividends: sum('dividends'),
    balance: rows.length ? rows[0].balance : 0,
    newBalance: rows.length ? rows[rows.length - 1].newBalance : 0,
    rentExpense: round2(rows.reduce((s, r) => s + (r.rentExpense || 0), 0)),
    rentPaid: round2(rows.reduce((s, r) => s + (r.rentPaid || 0), 0)),
    rentReserve: [...rows].reverse().find(r => r.rentReserve !== undefined)?.rentReserve ?? null,
    months: rows.length,
  };
}

export function yearOf(r: MonthlySummaryRow): number | null {
  return parseLabel(r.label)?.year ?? null;
}

// Distinct years present, newest first.
export function yearsIn(rows: MonthlySummaryRow[]): number[] {
  return [...new Set(rows.map(yearOf).filter((y): y is number => y !== null))].sort((a, b) => b - a);
}

// Same calendar month one year earlier, if logged.
export function sameMonthLastYear(r: MonthlySummaryRow, all: MonthlySummaryRow[]): MonthlySummaryRow | null {
  const p = parseLabel(r.label);
  if (!p) return null;
  const target = `${MONTHS[p.month]} ${p.year - 1}`;
  return all.find(x => x.label === target) || null;
}

export function changePct(now: number, before: number): number | null {
  return Math.abs(before) < 0.005 ? null : ((now - before) / Math.abs(before)) * 100;
}

// Rows in a calendar range (inclusive month indexes), oldest-first.
export function rowsInRange(all: MonthlySummaryRow[], year: number, fromMonth: number, toMonth: number) {
  return all
    .filter(r => {
      const p = parseLabel(r.label);
      return !!p && p.year === year && p.month >= fromMonth && p.month <= toMonth;
    })
    .sort((a, b) => a.order - b.order);
}

// ---- Partner dividend split ----------------------------------------------

export function splitDividend(amount: number) {
  return DIVIDEND_SHARES.map(s => ({ name: s.name, pct: s.pct, amount: round2((amount * s.pct) / 100) }));
}

// ---- CSV export -----------------------------------------------------------

function csvCell(v: string | number) {
  const s = typeof v === 'number' ? String(round2(v)) : v;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filename: string, header: string[], body: (string | number)[][]) {
  const text = [header, ...body].map(r => r.map(csvCell).join(',')).join('\r\n');
  // BOM so Excel opens it as UTF-8.
  const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const pctCell = (p: number | null) => (p === null ? '' : round2(p));

// rows oldest-first.
export function exportSummaryCsv(rows: MonthlySummaryRow[], filename: string) {
  downloadCsv(
    filename,
    ['Month', 'Balance', 'Income', 'COGS', 'Operating', 'Rent', 'Profit', 'Dividends', 'New Balance',
      'Rent Paid', 'Prepaid Rent', 'COGS %', 'Gross Margin %', 'Net Margin %'],
    rows.map(r => {
      const m = margins(r);
      const opt = (v?: number) => (v === undefined ? '' : v);
      return [r.label, r.balance, r.income, r.cogsExpense, r.operatingExpense, r.rentExpense || 0, r.profit, r.dividends, r.newBalance,
        opt(r.rentPaid), opt(r.rentReserve),
        pctCell(m.cogsPct), pctCell(m.grossMarginPct), pctCell(m.netMarginPct)];
    })
  );
}

// rows oldest-first; only months with a dividend are exported.
export function exportDividendsCsv(rows: MonthlySummaryRow[], filename: string) {
  const paid = rows.filter(r => (r.dividends || 0) > 0);
  const totals = DIVIDEND_SHARES.map(() => 0);
  const body: (string | number)[][] = paid.map(r => {
    const split = splitDividend(r.dividends);
    split.forEach((s, i) => (totals[i] += s.amount));
    return [r.label, r.dividends, ...split.map(s => s.amount)];
  });
  body.push(['Total', round2(paid.reduce((s, r) => s + r.dividends, 0)), ...totals.map(round2)]);
  downloadCsv(filename, ['Month', 'Total Dividend', ...DIVIDEND_SHARES.map(s => `${s.name} (${s.pct}%)`)], body);
}

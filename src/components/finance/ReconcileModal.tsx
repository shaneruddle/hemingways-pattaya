import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { logActivity } from '../../utils/logger';
import { toast } from 'sonner';
import { Loader2, X, StickyNote } from 'lucide-react';
import { MonthlySummaryRow, Reconciliation } from './types';

// Fixed cash float kept on the premises — always counted, never editable.
export const FLOAT_AMOUNT = 133000;

const fmt = (n: number) => `฿${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (v: string) => (v.trim() === '' ? 0 : parseFloat(v) || 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

type Field = 'bank' | 'cash' | 'other';
const FIELDS: { key: Field; label: string }[] = [
  { key: 'bank', label: 'Bank Balance' },
  { key: 'cash', label: 'Cash Balance' },
  { key: 'other', label: 'Other' },
];

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DA0A8] text-gray-900';

function NoteToggle({ value, onChange, open, onToggle }: { value: string; onChange: (v: string) => void; open: boolean; onToggle: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1 text-xs mt-1 transition-colors ${value.trim() ? 'text-[#1DA0A8]' : 'text-gray-400 hover:text-[#1DA0A8]'}`}
      >
        <StickyNote size={12} /> {value.trim() ? 'Edit note' : 'Add note'}
      </button>
      {open && (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          placeholder="Note..."
          className={`${inputCls} mt-1 text-sm resize-none`}
        />
      )}
    </>
  );
}

export default function ReconcileModal({ row, onClose }: { row: MonthlySummaryRow; onClose: () => void }) {
  const [values, setValues] = useState<Record<Field, string>>({ bank: '', cash: '', other: '' });
  const [notes, setNotes] = useState<Record<Field | 'float', string>>({ bank: '', cash: '', other: '', float: '' });
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Reconciliation[]>([]);

  useEffect(() => {
    // Single-field filter + client-side sort, so no composite index is needed.
    const q = query(collection(db, 'finance_reconciliations'), where('monthLabel', '==', row.label));
    return onSnapshot(
      q,
      snap => setHistory(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as Reconciliation))
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      ),
      err => console.error('Reconciliation history:', err)
    );
  }, [row.label]);

  // Pre-fill once from the most recent saved count for this month, so reopening the
  // pop-up shows what was entered last time instead of a blank form.
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || history.length === 0) return;
    prefilled.current = true;
    const last = history[0];
    const str = (n: number) => (n ? String(n) : '');
    setValues({ bank: str(last.bank), cash: str(last.cash), other: str(last.other) });
    setNotes({ bank: last.bankNote || '', cash: last.cashNote || '', other: last.otherNote || '', float: last.floatNote || '' });
    setOpenNotes({ bank: !!last.bankNote, cash: !!last.cashNote, other: !!last.otherNote, float: !!last.floatNote });
  }, [history]);

  const systemBalance = row.newBalance || 0;
  const counted = round2(num(values.bank) + num(values.cash) + num(values.other) + FLOAT_AMOUNT);
  const difference = round2(counted - systemBalance);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: Omit<Reconciliation, 'id'> = {
        monthLabel: row.label,
        monthRowId: row.id,
        systemBalance: round2(systemBalance),
        bank: round2(num(values.bank)),
        bankNote: notes.bank.trim(),
        cash: round2(num(values.cash)),
        cashNote: notes.cash.trim(),
        other: round2(num(values.other)),
        otherNote: notes.other.trim(),
        float: FLOAT_AMOUNT,
        floatNote: notes.float.trim(),
        totalCounted: counted,
        difference,
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.email || 'unknown',
      };
      await addDoc(collection(db, 'finance_reconciliations'), data);
      await logActivity('Reconciliation Saved', `${row.label} · difference ${fmt(difference)}`, 'finance');
      // Keep the figures on screen after saving — the form stays pre-filled with the
      // latest count so it can be adjusted and re-saved.
      toast.success('Reconciliation saved');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to save reconciliation');
    } finally {
      setSaving(false);
    }
  };

  const diffColor = difference === 0 ? 'text-green-600' : difference > 0 ? 'text-[#1DA0A8]' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink">Reconcile — {row.label}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">System closing balance</p>
          <p className="text-2xl font-bold text-ink">{fmt(systemBalance)}</p>
        </div>

        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={values[f.key]}
                onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                placeholder="0.00"
                className={inputCls}
              />
              <NoteToggle
                value={notes[f.key]}
                onChange={v => setNotes(n => ({ ...n, [f.key]: v }))}
                open={!!openNotes[f.key]}
                onToggle={() => setOpenNotes(o => ({ ...o, [f.key]: !o[f.key] }))}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Float (fixed)</label>
            <div className={`${inputCls} bg-gray-50 text-gray-500`}>{fmt(FLOAT_AMOUNT)}</div>
            <NoteToggle
              value={notes.float}
              onChange={v => setNotes(n => ({ ...n, float: v }))}
              open={!!openNotes.float}
              onToggle={() => setOpenNotes(o => ({ ...o, float: !o.float }))}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 mt-5 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600"><span>Total counted</span><span className="font-medium">{fmt(counted)}</span></div>
          <div className="flex justify-between text-gray-600"><span>System balance</span><span className="font-medium">{fmt(systemBalance)}</span></div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="font-bold text-ink">Difference</span>
            <span className={`text-xl font-bold ${diffColor}`}>{difference > 0 ? '+' : ''}{fmt(difference)}</span>
          </div>
          <p className="text-xs text-gray-400">
            {difference === 0 ? 'Balanced.' : difference > 0 ? 'More on hand than the system shows.' : 'Less on hand than the system shows.'}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-[#1DA0A8] text-white rounded-xl font-bold hover:bg-[#18919a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : 'Save'}
          </button>
        </div>

        {history.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Previous reconciliations</p>
            <div className="space-y-2">
              {history.map(h => {
                const lines = [
                  ['Bank', h.bank, h.bankNote],
                  ['Cash', h.cash, h.cashNote],
                  ['Other', h.other, h.otherNote],
                  ['Float', h.float, h.floatNote],
                ] as const;
                return (
                  <div key={h.id} className="border border-gray-100 rounded-xl p-3 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">
                        {new Date(h.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`font-bold ${h.difference === 0 ? 'text-green-600' : h.difference > 0 ? 'text-[#1DA0A8]' : 'text-red-600'}`}>
                        {h.difference > 0 ? '+' : ''}{fmt(h.difference)}
                      </span>
                    </div>
                    {lines.map(([label, amount, note]) => (
                      <div key={label} className="text-gray-600">
                        {label}: {fmt(amount)}{note ? <span className="text-gray-400"> — {note}</span> : null}
                      </div>
                    ))}
                    <div className="text-gray-400 mt-1">System {fmt(h.systemBalance)} · Counted {fmt(h.totalCounted)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

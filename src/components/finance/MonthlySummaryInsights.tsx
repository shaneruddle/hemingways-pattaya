import { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { MonthlySummaryRow } from './types';
import { DIVIDEND_SHARES } from '../../utils/partners';
import { margins, splitDividend, round2, currentMonthLabel } from './monthlySummaryAnalytics';

const fmt = (n: number) => `฿${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmt0 = (n: number) => `฿${(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const kTick = (v: number) => `฿${Math.round(v / 1000).toLocaleString('en-US')}k`;
// "January 2026" → "Jan 26"
const shortLabel = (label: string) => {
  const parts = label.split(' ');
  return parts.length === 2 ? `${parts[0].slice(0, 3)} ${parts[1].slice(2)}` : label;
};

// rows: oldest-first, month rows only (already filtered by the selected year).
export function MonthlyCharts({ rows }: { rows: MonthlySummaryRow[] }) {
  const mtd = currentMonthLabel();
  const data = useMemo(() => rows.map(r => {
    const m = margins(r);
    return {
      name: shortLabel(r.label) + (r.label === mtd ? '*' : ''),
      Income: round2(r.income),
      Expenses: round2(r.cogsExpense + r.operatingExpense + (r.rentExpense || 0)),
      Profit: round2(r.profit),
      Balance: round2(r.newBalance),
      'COGS %': m.cogsPct === null ? null : round2(m.cogsPct),
      'Net margin %': m.netMarginPct === null ? null : round2(m.netMarginPct),
    };
  }), [rows, mtd]);

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm italic text-center py-10 bg-white rounded-2xl border border-gray-100">No months to chart</p>;
  }

  const card = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';
  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className="font-bold text-ink mb-4">Income, expenses and profit</h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data} margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={kTick} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Income" fill="#1DA0A8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#F29C8F" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="Profit" stroke="#1E8E5A" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={card}>
          <h3 className="font-bold text-ink mb-4">Running balance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={kTick} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Line type="monotone" dataKey="Balance" stroke="#136066" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
          <h3 className="font-bold text-ink mb-4">COGS % and net margin %</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="COGS %" stroke="#E8A33D" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              <Line type="monotone" dataKey="Net margin %" stroke="#1E8E5A" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {data.some(d => d.name.endsWith('*')) && (
        <p className="text-xs text-gray-400">* Current month, month to date.</p>
      )}
    </div>
  );
}

// rows: oldest-first, month rows only (already filtered by the selected year).
export function DividendSplit({ rows }: { rows: MonthlySummaryRow[] }) {
  const paid = useMemo(() => rows.filter(r => (r.dividends || 0) > 0).slice().reverse(), [rows]);
  const total = round2(paid.reduce((s, r) => s + r.dividends, 0));
  const perPartner = splitDividend(total);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {perPartner.map(p => (
          <div key={p.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{p.name} · {p.pct}%</p>
            <p className="text-xl font-bold text-ink mt-1">{fmt0(p.amount)}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">total paid</p>
          </div>
        ))}
      </div>

      {paid.length === 0 ? (
        <p className="text-gray-400 text-sm italic text-center py-10 bg-white rounded-2xl border border-gray-100">No dividends paid in this period</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Total dividend</th>
                {DIVIDEND_SHARES.map(s => <th key={s.name} className="px-4 py-3 text-right">{s.name} ({s.pct}%)</th>)}
              </tr>
            </thead>
            <tbody>
              {paid.map(r => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{r.label}</td>
                  <td className="px-4 py-3 text-right font-bold text-ink">{fmt(r.dividends)}</td>
                  {splitDividend(r.dividends).map(s => <td key={s.name} className="px-4 py-3 text-right text-gray-600">{fmt(s.amount)}</td>)}
                </tr>
              ))}
              <tr className="bg-cream font-bold">
                <td className="px-4 py-3 text-ink">Total</td>
                <td className="px-4 py-3 text-right text-ink">{fmt(total)}</td>
                {perPartner.map(s => <td key={s.name} className="px-4 py-3 text-right text-ink">{fmt(s.amount)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400">
        Split: {DIVIDEND_SHARES.map(s => `${s.name} ${s.pct}%`).join(' · ')}. Dividends come from Finance expenses in the Dividends category.
      </p>
    </div>
  );
}

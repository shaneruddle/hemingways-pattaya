import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { MonthlySummaryRow } from './types';
import { changePct, currentMonthLabel, parseLabel, yearsIn } from './monthlySummaryAnalytics';

// Compare tab: one year against another over the same finished months (like for like),
// in plain English for the partners. rows: oldest-first, all years.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmt0 = (n: number) => `฿${Math.round(n || 0).toLocaleString('en-US')}`;
const mil = (n: number) => `฿${(n / 1e6).toFixed(2)}M`;
const kTick = (v: number) => `฿${Math.round(v / 1000).toLocaleString('en-US')}k`;
const sgn = (p: number | null, unit = '%') => (p === null ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p).toFixed(1)}${unit}`);
const C_A = '#2a78d6'; // earlier year
const C_B = '#eb6834'; // later year

type T = { income: number; cogs: number; op: number; rent: number; profit: number; div: number };
const totals = (rs: MonthlySummaryRow[]): T => rs.reduce((t, r) => ({
  income: t.income + (r.income || 0), cogs: t.cogs + (r.cogsExpense || 0), op: t.op + (r.operatingExpense || 0),
  rent: t.rent + (r.rentExpense || 0), profit: t.profit + (r.profit || 0), div: t.div + (r.dividends || 0),
}), { income: 0, cogs: 0, op: 0, rent: 0, profit: 0, div: 0 });
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);

export default function YearCompare({ rows }: { rows: MonthlySummaryRow[] }) {
  const mtd = currentMonthLabel();
  const years = [...yearsIn(rows)].sort((x, y) => x - y);
  const latest = years[years.length - 1];
  const [yearB, setYearB] = useState<number>(latest);
  const [yearA, setYearA] = useState<number>(years.includes(latest - 1) ? latest - 1 : years[0]);

  const data = useMemo(() => {
    const byKey = new Map<string, MonthlySummaryRow>();
    rows.forEach(r => { const p = parseLabel(r.label); if (p && r.label !== mtd) byKey.set(`${p.year}-${p.month}`, r); });
    // Months both years have finished, so the comparison is like for like.
    const months = MONTHS.map((_, m) => m).filter(m => byKey.has(`${yearA}-${m}`) && byKey.has(`${yearB}-${m}`));
    const a = months.map(m => byKey.get(`${yearA}-${m}`)!);
    const b = months.map(m => byKey.get(`${yearB}-${m}`)!);
    return { months, a, b, A: totals(a), B: totals(b) };
  }, [rows, mtd, yearA, yearB]);

  const { months, a, b, A, B } = data;
  const card = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';
  const select = (v: number, set: (n: number) => void) => (
    <select value={v} onChange={e => set(Number(e.target.value))}
      className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1DA0A8]">
      {years.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  );

  const header = (
    <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: C_A }} />{select(yearA, setYearA)}
      <span className="mx-1">vs</span>
      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: C_B }} />{select(yearB, setYearB)}
      {months.length > 0 && (
        <span className="text-gray-400 ml-2">
          {MONTHS[months[0]]}{months.length > 1 ? ` to ${MONTHS[months[months.length - 1]]}` : ''} in both years ({months.length} month{months.length === 1 ? '' : 's'})
        </span>
      )}
    </div>
  );

  if (yearA === yearB || months.length === 0) {
    return (
      <div className="space-y-4">
        {header}
        <p className="text-gray-400 text-sm italic text-center py-10 bg-white rounded-2xl border border-gray-100">
          {yearA === yearB ? 'Pick two different years' : 'These years have no finished months in common'}
        </p>
      </div>
    );
  }

  const incChg = changePct(B.income, A.income);
  const profChg = changePct(B.profit, A.profit);
  const netA = pct(A.profit, A.income), netB = pct(B.profit, B.income);
  const cogsA = pct(A.cogs, A.income), cogsB = pct(B.cogs, B.income);
  const opA = pct(A.op, A.income), opB = pct(B.op, B.income);
  const divChg = changePct(B.div, A.div);
  const downMonths = months.filter((_, i) => b[i].income < a[i].income).length;
  const later = yearB > yearA;
  const tone = (good: boolean) => (good ? 'text-green-600' : 'text-red-600');

  const tiles = [
    { label: 'Income', big: sgn(incChg), sub: `${mil(A.income)} → ${mil(B.income)}`, good: B.income >= A.income },
    { label: 'Profit', big: sgn(profChg), sub: `${mil(A.profit)} → ${mil(B.profit)}`, good: B.profit >= A.profit },
    { label: 'Net margin', big: sgn(netB - netA, ' pts'), sub: `${netA.toFixed(1)}% → ${netB.toFixed(1)}%`, good: netB >= netA },
    { label: 'Dividends paid', big: sgn(divChg), sub: `${mil(A.div)} → ${mil(B.div)}`, good: B.div >= A.div },
  ];

  // Plain-English findings, written from the numbers.
  const findings: { head: string; body: string }[] = [];
  findings.push({
    head: `Income ${B.income >= A.income ? 'up' : 'down'} in ${B.income >= A.income ? months.length - downMonths : downMonths} of ${months.length} months.`,
    body: `Over the same months, income ${B.income >= A.income ? 'rose' : 'fell'} by ${fmt0(Math.abs(B.income - A.income))} (${sgn(incChg)}).`,
  });
  // Biggest monthly swings.
  const swings = months.map((m, i) => ({ m, c: changePct(b[i].income, a[i].income) ?? 0 })).sort((x, y) => x.c - y.c);
  const worst = swings.slice(0, 3).filter(s => s.c < 0);
  if (worst.length) findings.push({ head: 'Weakest months:', body: worst.map(s => `${MONTHS[s.m]} ${sgn(s.c)}`).join(', ') + '.' });
  findings.push({
    head: cogsB <= cogsA ? 'Food and drink costs are under control.' : 'Food and drink costs are taking more of income.',
    body: `COGS went from ${cogsA.toFixed(1)}% to ${cogsB.toFixed(1)}% of income.`,
  });
  findings.push({
    head: changePct(B.op, A.op)! > (incChg ?? 0) ? "Running costs haven't come down with income." : 'Running costs have moved with income.',
    body: `Operating costs ${B.op >= A.op ? 'rose' : 'fell'} ${sgn(changePct(B.op, A.op)).replace(/^[+−]/, '')}, and now take ${opB.toFixed(1)}% of income (was ${opA.toFixed(1)}%). Rent was ${fmt0(A.rent)} vs ${fmt0(B.rent)}.`,
  });
  findings.push({
    head: 'Result:',
    body: `profit is ${B.profit >= A.profit ? 'up' : 'down'} ${fmt0(Math.abs(B.profit - A.profit))} (${sgn(profChg)}), and dividends are ${B.div >= A.div ? 'up' : 'down'} ${fmt0(Math.abs(B.div - A.div))}.`,
  });

  const chartData = months.map((m, i) => ({
    name: MONTHS[m].slice(0, 3),
    [`Income ${yearA}`]: Math.round(a[i].income), [`Income ${yearB}`]: Math.round(b[i].income),
    [`Profit ${yearA}`]: Math.round(a[i].profit), [`Profit ${yearB}`]: Math.round(b[i].profit),
  }));

  const plRows: [string, number, number, boolean, boolean?][] = [
    ['Income', A.income, B.income, true],
    ['Food & drink (COGS)', A.cogs, B.cogs, false],
    ['COGS % of income', cogsA, cogsB, false, true],
    ['Operating costs', A.op, B.op, false],
    ['Rent', A.rent, B.rent, false],
    ['Profit', A.profit, B.profit, true],
    ['Net margin', netA, netB, true, true],
    ['Dividends paid', A.div, B.div, true],
  ];

  return (
    <div className="space-y-6">
      {header}
      {!later && <p className="text-xs text-gray-400">Tip: put the earlier year on the left so the changes read forwards.</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(t => (
          <div key={t.label} className={card}>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">{t.label}</p>
            <p className={`text-3xl font-bold mt-1 ${tone(t.good)}`}>{t.big}</p>
            <p className="text-xs text-gray-500 mt-1 tabular-nums">{t.sub}</p>
          </div>
        ))}
      </div>

      <div className={card}>
        <h3 className="font-bold text-ink mb-3">What the numbers say</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          {findings.map((f, i) => <li key={i}><b className="text-ink">{f.head}</b> {f.body}</li>)}
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(['Income', 'Profit'] as const).map(k => (
          <div key={k} className={card}>
            <h3 className="font-bold text-ink mb-4">{k} by month</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ left: 8, right: 8 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={kTick} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={64} />
                <Tooltip formatter={(v) => fmt0(Number(v))} cursor={{ fill: '#f3f4f6' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey={`${k} ${yearA}`} fill={C_A} radius={[4, 4, 0, 0]} />
                <Bar dataKey={`${k} ${yearB}`} fill={C_B} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 text-left">Profit & loss</th><th className="px-4 py-3 text-right">{yearA}</th><th className="px-4 py-3 text-right">{yearB}</th><th className="px-4 py-3 text-right">Change</th>
            </tr></thead>
            <tbody>
              {plRows.map(([label, x, y, upGood, isPct]) => {
                const good = upGood ? y >= x : y <= x;
                return (
                  <tr key={label} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{label}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">{isPct ? `${x.toFixed(1)}%` : fmt0(x)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-800">{isPct ? `${y.toFixed(1)}%` : fmt0(y)}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${tone(good)}`}>{isPct ? sgn(y - x, ' pts') : sgn(changePct(y, x))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 text-left">Month</th><th className="px-4 py-3 text-right">Income</th><th className="px-4 py-3 text-right">Change</th><th className="px-4 py-3 text-right">Profit</th><th className="px-4 py-3 text-right">Change</th>
            </tr></thead>
            <tbody>
              {months.map((m, i) => {
                const ic = changePct(b[i].income, a[i].income), pc = changePct(b[i].profit, a[i].profit);
                return (
                  <tr key={m} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{MONTHS[m]}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-800">{fmt0(b[i].income)}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${tone((ic ?? 0) >= 0)}`}>{sgn(ic)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-800">{fmt0(b[i].profit)}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${tone((pc ?? 0) >= 0)}`}>{sgn(pc)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 px-4 pb-3">Amounts are {yearB}; changes are against the same month in {yearA}.</p>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { MonthlySummaryRow } from './types';
import { changePct, currentMonthLabel, margins, parseLabel, sameMonthLastYear } from './monthlySummaryAnalytics';

// "Month in focus": a story-first view of one finished month at the top of Monthly
// Summary, so the owner and partners see what happened before the spreadsheet.
// rows are oldest-first; only finished months with income can be focused.

const baht = (n: number) => `฿${Math.round(n).toLocaleString('en-US')}`;
const short = (n: number) => {
  const a = Math.abs(n);
  const s = a >= 1e6 ? `${(a / 1e6).toFixed(2)}M` : a >= 1e3 ? `${Math.round(a / 1e3)}k` : `${Math.round(a)}`;
  return `${n < 0 ? '−' : ''}฿${s}`;
};
const pctTxt = (p: number | null, unit = '%') => (p === null ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p).toFixed(1)}${unit}`);

export function focusableMonths(rows: MonthlySummaryRow[]) {
  const mtd = currentMonthLabel();
  return rows.filter(r => !!parseLabel(r.label) && r.label !== mtd && (r.income || 0) > 0);
}

function Spark({ values, highlight, color }: { values: (number | null)[]; highlight: number; color: string }) {
  const W = 132, H = 38, pad = 4;
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length < 2) return <svg width={W} height={H} />;
  const min = Math.min(...nums), max = Math.max(...nums), span = max - min || 1;
  const x = (i: number) => pad + (i / (values.length - 1)) * (W - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (H - pad * 2);
  const pts = values.map((v, i) => (v === null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`)).filter(Boolean).join(' ');
  const hv = values[highlight];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {hv !== null && hv !== undefined && <circle cx={x(highlight)} cy={y(hv)} r={4} fill={color} stroke="#141414" strokeWidth={2} />}
    </svg>
  );
}

function Chip({ label, p, invert = false, unit = '%' }: { label: string; p: number | null; invert?: boolean; unit?: string }) {
  const good = p === null ? null : invert ? p < 0 : p > 0;
  const cls = good === null ? 'bg-white/5 text-white/50' : good ? 'bg-[#4FA64F]/15 text-[#7fd07f]' : 'bg-[#F0463D]/15 text-[#ff8a83]';
  const Icon = p === null ? null : p >= 0 ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {Icon && <Icon size={13} />} {pctTxt(p, unit)} <span className="font-normal opacity-75">{label}</span>
    </span>
  );
}

export default function MonthSpotlight({ rows, focusLabel, onFocus }: {
  rows: MonthlySummaryRow[]; // oldest-first
  focusLabel: string | null;
  onFocus: (label: string) => void;
}) {
  const months = focusableMonths(rows);
  if (months.length === 0) return null;
  let idx = months.findIndex(r => r.label === focusLabel);
  if (idx === -1) idx = months.length - 1;
  const r = months[idx];
  const prev = idx > 0 ? months[idx - 1] : null;
  const ly = sameMonthLastYear(r, rows);
  const m = margins(r);
  const lyM = ly ? margins(ly) : null;
  const rent = r.rentExpense || 0;
  const income = r.income || 0;

  // Where every ฿100 of income went.
  const parts = [
    { key: 'COGS', label: 'Food & drink', value: r.cogsExpense || 0, color: '#E3B860' },
    { key: 'Operating', label: 'Running costs', value: r.operatingExpense || 0, color: '#A9753A' },
    { key: 'Rent', label: 'Rent', value: rent, color: '#6b6763' },
    { key: 'Profit', label: r.profit >= 0 ? 'Profit' : 'Loss', value: r.profit, color: r.profit >= 0 ? '#34B2BA' : '#F0463D' },
  ];
  const per100 = (v: number) => (income > 0 ? (v / income) * 100 : 0);
  const barParts = parts.filter(p => p.value > 0);
  const barTotal = barParts.reduce((s, p) => s + p.value, 0) || 1;

  // Sparklines: the 12 months ending at the focused month.
  const window = months.slice(Math.max(0, idx - 11), idx + 1);
  const hi = window.length - 1;
  const kpis = [
    { label: 'Income', value: baht(income), series: window.map(w => w.income), color: '#34B2BA',
      sub: ly ? `${pctTxt(changePct(income, ly.income))} vs ${ly.label}` : 'No month last year', good: ly ? income >= ly.income : null },
    { label: 'Food & drink cost', value: m.cogsPct === null ? '—' : `${m.cogsPct.toFixed(1)}%`, series: window.map(w => margins(w).cogsPct), color: '#E3B860',
      sub: lyM?.cogsPct != null && m.cogsPct !== null ? `${pctTxt(m.cogsPct - lyM.cogsPct, ' pts')} vs last year` : 'of income', good: lyM?.cogsPct != null && m.cogsPct !== null ? m.cogsPct <= lyM.cogsPct : null },
    { label: 'Net margin', value: m.netMarginPct === null ? '—' : `${m.netMarginPct.toFixed(1)}%`, series: window.map(w => margins(w).netMarginPct), color: '#ECC878',
      sub: lyM?.netMarginPct != null && m.netMarginPct !== null ? `${pctTxt(m.netMarginPct - lyM.netMarginPct, ' pts')} vs last year` : 'profit ÷ income', good: lyM?.netMarginPct != null && m.netMarginPct !== null ? m.netMarginPct >= lyM.netMarginPct : null },
    { label: 'Cash at month end', value: baht(r.newBalance), series: window.map(w => w.newBalance), color: '#F6F1E6',
      sub: prev ? `${short(r.newBalance - prev.newBalance)} on ${prev.label.split(' ')[0]}` : '', good: prev ? r.newBalance >= prev.newBalance : null },
  ];

  // Year to date vs the same months last year.
  const p = parseLabel(r.label)!;
  const ytd = (year: number) => rows.filter(x => { const q = parseLabel(x.label); return q && q.year === year && q.month <= p.month; });
  const thisYtd = ytd(p.year), lastYtd = ytd(p.year - 1);
  const sum = (xs: MonthlySummaryRow[], k: 'income' | 'profit') => xs.reduce((s, x) => s + (x[k] || 0), 0);
  const fullLast = lastYtd.length === thisYtd.length && thisYtd.length > 0;
  const ytdRows = fullLast ? (['income', 'profit'] as const).map(k => ({ k, now: sum(thisYtd, k), before: sum(lastYtd, k) })) : [];

  // One plain-English line.
  const incChg = ly ? changePct(income, ly.income) : null;
  const profChg = ly ? changePct(r.profit, ly.profit) : null;
  const verdict = ly
    ? `Income ${incChg! >= 0 ? 'up' : 'down'} ${Math.abs(incChg!).toFixed(1)}% and profit ${profChg === null ? 'flat' : `${profChg >= 0 ? 'up' : 'down'} ${Math.abs(profChg).toFixed(1)}%`} on ${ly.label}.`
    : prev ? `Profit ${r.profit >= prev.profit ? 'up' : 'down'} ${short(Math.abs(r.profit - prev.profit))} on ${prev.label}.` : '';

  const nav = (d: number) => { const n = months[idx + d]; if (n) onFocus(n.label); };

  return (
    <section className="rounded-3xl bg-[#141414] text-[#F6F1E6] p-6 md:p-8 shadow-xl relative overflow-hidden" aria-label={`Month in focus: ${r.label}`}>
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#1DA0A8]/20 blur-3xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E3B860]">Month in focus</p>
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => nav(-1)} disabled={idx === 0} className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-30" aria-label="Previous month"><ChevronLeft size={18} /></button>
            <h2 className="font-['Anton'] text-3xl md:text-4xl tracking-wide uppercase">{r.label}</h2>
            <button onClick={() => nav(1)} disabled={idx === months.length - 1} className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 disabled:opacity-30" aria-label="Next month"><ChevronRight size={18} /></button>
          </div>
          {verdict && <p className="text-sm text-white/70 mt-2">{verdict}</p>}
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">{r.profit >= 0 ? 'Profit' : 'Loss'}</p>
          <p className={`font-['Anton'] text-5xl md:text-6xl leading-none mt-1 ${r.profit >= 0 ? 'text-[#5CC6CD]' : 'text-[#F0463D]'}`}>{baht(r.profit)}</p>
          <div className="flex gap-2 justify-end mt-3 flex-wrap">
            <Chip label={prev ? `vs ${prev.label.split(' ')[0]}` : 'vs last month'} p={prev ? changePct(r.profit, prev.profit) : null} />
            <Chip label="vs last year" p={profChg} />
          </div>
        </div>
      </div>

      <div className="relative mt-7">
        <p className="text-xs text-white/60 mb-2">Where every ฿100 of income went</p>
        <div className="flex h-11 w-full gap-[2px] rounded-xl overflow-hidden">
          {barParts.map(pt => (
            <div key={pt.key} style={{ width: `${(pt.value / barTotal) * 100}%`, background: pt.color }}
              className="flex items-center justify-center text-[13px] font-bold text-[#141414] min-w-0"
              title={`${pt.label}: ${baht(pt.value)}`}>
              {per100(pt.value) >= 6 && `฿${Math.round(per100(pt.value))}`}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-white/70">
          {parts.map(pt => (
            <span key={pt.key} className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: pt.color }} />
              {pt.label} <span className="text-white font-semibold">฿{Math.round(per100(pt.value))}</span>
              <span className="text-white/40">({short(pt.value)})</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">{k.label}</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{k.value}</p>
            <div className="flex items-end justify-between gap-2 mt-1">
              <p className={`text-xs ${k.good === null ? 'text-white/45' : k.good ? 'text-[#7fd07f]' : 'text-[#ff8a83]'}`}>{k.sub}</p>
              <Spark values={k.series} highlight={hi} color={k.color} />
            </div>
          </div>
        ))}
      </div>

      {ytdRows.length > 0 && (
        <div className="relative mt-7 grid md:grid-cols-2 gap-4">
          {ytdRows.map(y => {
            const max = Math.max(y.now, y.before, 1);
            const chg = changePct(y.now, y.before);
            return (
              <div key={y.k}>
                <div className="flex justify-between text-xs text-white/60 mb-1.5">
                  <span>{y.k === 'income' ? 'Income' : 'Profit'} so far this year (Jan–{r.label.split(' ')[0].slice(0, 3)})</span>
                  <span className={chg !== null && chg < 0 ? 'text-[#ff8a83] font-semibold' : 'text-[#7fd07f] font-semibold'}>{pctTxt(chg)}</span>
                </div>
                {[[p.year, y.now, '#34B2BA'], [p.year - 1, y.before, '#ffffff33']].map(([yr, v, c]) => (
                  <div key={yr as number} className="flex items-center gap-2 mb-1">
                    <span className="w-10 text-xs text-white/50 tabular-nums">{yr}</span>
                    <div className="flex-1 h-3.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.max(0, (v as number) / max) * 100}%`, background: c as string }} />
                    </div>
                    <span className="w-20 text-right text-xs tabular-nums">{short(v as number)}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

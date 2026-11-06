// Quarterly / annual P&L report for the partners, in the same style as the monthly
// report (monthlyReportPdf.ts). Totals come from the Monthly Summary rows; the category
// breakdown comes from Finance transactions for the period where they exist.
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MonthlySummaryRow } from './types';
import { fetchCategoryBreakdownRange, sortedEntries, drawBarChart } from './monthlyReportPdf';
import { rowsInRange, totalsOf, Totals, splitDividend, changePct, pctOf, currentMonthLabel } from './monthlySummaryAnalytics';

const TEAL = '#1DA0A8';
const TEAL_DARK = '#136066';
const INK = '#1F2937';
const MUTED = '#6B7280';
const LIGHT_ROW = '#F7FAFA';
const RED = '#DC4C4C';
const GREEN = '#1E8E5A';

const fmt0 = (n: number) => `${n < 0 ? '-' : ''}THB ${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const pct = (num: number, den: number) => {
  const p = pctOf(num, den);
  return p === null ? '—' : `${p.toFixed(1)}%`;
};
const chg = (now: number, before: number) => {
  const p = changePct(now, before);
  return p === null ? '—' : `${p > 0 ? '+' : ''}${p.toFixed(1)}%`;
};

// quarter: 1-4, or null for the full year.
export type Period = { year: number; quarter: number | null };

export function periodLabel(p: Period) {
  return p.quarter ? `Q${p.quarter} ${p.year}` : `Full Year ${p.year}`;
}

function periodMonths(p: Period) {
  return p.quarter ? { from: (p.quarter - 1) * 3, to: (p.quarter - 1) * 3 + 2 } : { from: 0, to: 11 };
}

// Builds the PDF and returns it (not downloaded), so the page can preview it first.
export async function generatePeriodReportPdf(period: Period, allRows: MonthlySummaryRow[]): Promise<{ blob: Blob; filename: string }> {
  const { from, to } = periodMonths(period);
  const expectedMonths = to - from + 1;
  const rows = rowsInRange(allRows, period.year, from, to);
  if (rows.length === 0) throw new Error(`No months logged for ${periodLabel(period)}`);
  // Compare like for like: only the same calendar months last year (so a year that
  // is still in progress isn't compared with a full 12 months).
  const monthsCovered = new Set(rows.map(r => r.label.split(' ')[0]));
  const lastYearRows = rowsInRange(allRows, period.year - 1, from, to).filter(r => monthsCovered.has(r.label.split(' ')[0]));
  const t = totalsOf(rows);
  // Only compare when last year has every month this period has; a partial match
  // (e.g. 3 months vs 1) would give misleading changes, so the column is left out.
  const ly: Totals | null = lastYearRows.length === rows.length ? totalsOf(lastYearRows) : null;
  const label = periodLabel(period);
  const lyLabel = lastYearRows.length < expectedMonths ? `Same months ${period.year - 1}` : periodLabel({ ...period, year: period.year - 1 });
  const includesMtd = rows.some(r => r.label === currentMonthLabel());

  const startDate = `${period.year}-${String(from + 1).padStart(2, '0')}-01`;
  const endDate = to === 11 ? `${period.year + 1}-01-01` : `${period.year}-${String(to + 2).padStart(2, '0')}-01`;
  const breakdown = await fetchCategoryBreakdownRange(startDate, endDate);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 15;

  // ---- Header -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(INK);
  doc.text('Hemingways Pattaya', marginX, 20);
  doc.setFontSize(12);
  doc.setTextColor(TEAL_DARK);
  doc.text(`${period.quarter ? 'Quarterly' : 'Annual'} P&L Report — ${label}`, marginX, 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  const notes = [
    `Generated ${new Date().toISOString().slice(0, 10)}`,
    `${t.months} of ${expectedMonths} months on record`,
    includesMtd ? 'includes the current month to date' : '',
  ].filter(Boolean).join('  ·  ');
  doc.text(`Prepared for the partners  ·  ${notes}`, marginX, 34);
  doc.setDrawColor(TEAL);
  doc.setLineWidth(0.8);
  doc.line(marginX, 38, pageW - marginX, 38);

  // ---- P&L summary with comparison to the same period last year -----------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text('Profit & Loss', marginX, 48);

  const line = (name: string, now: number, before: number | null) =>
    ly ? [name, fmt0(now), fmt0(before ?? 0), chg(now, before ?? 0)] : [name, fmt0(now)];
  const body = [
    line('Income', t.income, ly?.income ?? null),
    line('COGS (Food / Drink / Ice)', t.cogsExpense, ly?.cogsExpense ?? null),
    line('Operating Expense', t.operatingExpense, ly?.operatingExpense ?? null),
    line('Profit', t.profit, ly?.profit ?? null),
    line('Dividends Paid', t.dividends, ly?.dividends ?? null),
    ly ? ['COGS % of Income', pct(t.cogsExpense, t.income), pct(ly.cogsExpense, ly.income), ''] : ['COGS % of Income', pct(t.cogsExpense, t.income)],
    ly ? ['Gross Margin', pct(t.income - t.cogsExpense, t.income), pct(ly.income - ly.cogsExpense, ly.income), ''] : ['Gross Margin', pct(t.income - t.cogsExpense, t.income)],
    ly ? ['Net Margin', pct(t.profit, t.income), pct(ly.profit, ly.income), ''] : ['Net Margin', pct(t.profit, t.income)],
    ly ? ['Opening Balance', fmt0(t.balance), fmt0(ly.balance), ''] : ['Opening Balance', fmt0(t.balance)],
    ly ? ['Closing Balance', fmt0(t.newBalance), fmt0(ly.newBalance), ''] : ['Closing Balance', fmt0(t.newBalance)],
  ];
  autoTable(doc, {
    startY: 53,
    margin: { left: marginX },
    tableWidth: ly ? 150 : 95,
    head: ly ? [['', label, lyLabel, 'Change']] : [['', label]],
    body,
    theme: 'plain',
    headStyles: { fontStyle: 'bold', textColor: MUTED, fontSize: 9, halign: 'right' },
    styles: { font: 'helvetica', fontSize: 10, textColor: INK, cellPadding: { top: 2, bottom: 2, left: 0, right: 4 } },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) data.cell.styles.halign = 'left';
      if (data.section === 'body' && data.row.index === 3) {
        data.cell.styles.fontStyle = 'bold';
        if (data.column.index === 1) data.cell.styles.textColor = t.profit >= 0 ? GREEN : RED;
      }
    },
  });

  if (breakdown.hasData) {
    drawBarChart(doc, marginX + (ly ? 160 : 105), 48, pageW - marginX - (marginX + (ly ? 160 : 105)), `Income to Profit — ${label}`, [
      { label: 'Income', value: t.income, color: TEAL },
      { label: 'COGS', value: -t.cogsExpense, color: RED },
      { label: 'Operating', value: -t.operatingExpense, color: '#E8A33D' },
      { label: 'Profit', value: t.profit, color: GREEN },
    ]);
  }

  // ---- Dividend split -----------------------------------------------------
  // Right-hand column, under the bar chart, so it stays on page 1.
  if (t.dividends > 0) {
    const left = marginX + (ly ? 160 : 105);
    const y = 100;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(INK);
    doc.text('Dividends by Partner', left, y - 4);
    autoTable(doc, {
      startY: y,
      margin: { left },
      tableWidth: Math.min(110, pageW - marginX - left),
      head: [['Partner', 'Share', 'Amount']],
      body: [...splitDividend(t.dividends).map(s => [s.name, `${s.pct}%`, fmt0(s.amount)]), ['Total', '100%', fmt0(t.dividends)]],
      headStyles: { fillColor: '#EAF6F6', textColor: INK, fontStyle: 'bold', fontSize: 9.5 },
      styles: { font: 'helvetica', fontSize: 9.5, textColor: INK },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      didParseCell: (data) => {
        if (data.section === 'head' && data.column.index > 0) data.cell.styles.halign = 'right';
        if (data.section === 'body' && data.row.index === splitDividend(0).length) data.cell.styles.fontStyle = 'bold';
      },
    });
  }

  // ---- Month by month -----------------------------------------------------
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text(`Month by Month — ${label}`, marginX, 18);
  autoTable(doc, {
    startY: 24,
    margin: { left: marginX, right: marginX },
    head: [['Month', 'Income', 'COGS', 'Operating', 'Profit', 'COGS %', 'Net Margin', 'Dividends', 'New Balance']],
    body: [
      ...rows.map(r => [
        r.label + (r.label === currentMonthLabel() ? ' (MTD)' : ''), fmt0(r.income), fmt0(r.cogsExpense), fmt0(r.operatingExpense), fmt0(r.profit),
        pct(r.cogsExpense, r.income), pct(r.profit, r.income), fmt0(r.dividends), fmt0(r.newBalance),
      ]),
      ['Total', fmt0(t.income), fmt0(t.cogsExpense), fmt0(t.operatingExpense), fmt0(t.profit),
        pct(t.cogsExpense, t.income), pct(t.profit, t.income), fmt0(t.dividends), fmt0(t.newBalance)],
    ],
    headStyles: { fillColor: TEAL_DARK, textColor: '#FFFFFF', fontStyle: 'bold', fontSize: 8.5 },
    styles: { font: 'helvetica', fontSize: 8.5, textColor: INK, cellPadding: 2.2 },
    columnStyles: Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map(i => [i, { halign: 'right' as const }])),
    alternateRowStyles: { fillColor: LIGHT_ROW },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === rows.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = '#DFF3F3';
      }
    },
  });

  // ---- Category breakdown -------------------------------------------------
  if (breakdown.hasData) {
    const cats = (title: string, map: Map<string, number>, left: number, width: number, startY: number) => {
      const entries = sortedEntries(map);
      const total = entries.reduce((s, [, v]) => s + v, 0);
      autoTable(doc, {
        startY,
        margin: { left },
        tableWidth: width,
        head: [[title, 'Amount', '% of Total']],
        body: [...entries.map(([n, v]) => [n, fmt0(v), pct(v, total)]), ['Total', fmt0(total), entries.length ? '100.0%' : '—']],
        headStyles: { fillColor: '#F3F4F6', textColor: INK, fontStyle: 'bold', fontSize: 8.5 },
        styles: { font: 'helvetica', fontSize: 8.5, textColor: INK },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
        didParseCell: (data) => {
          if (data.section === 'body' && data.row.index === entries.length) data.cell.styles.fontStyle = 'bold';
        },
      });
    };
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(INK);
    doc.text(`Category Breakdown — ${label}`, marginX, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text('From itemized Finance transactions. Months before live logging have no itemized detail.', marginX, 24);
    const third = (pageW - marginX * 2 - 12) / 3;
    cats('Income Category', breakdown.incomeByCategory, marginX, third, 30);
    cats('COGS Category', breakdown.cogsByCategory, marginX + third + 6, third, 30);
    cats('Operating Category', breakdown.operatingByCategory, marginX + (third + 6) * 2, third, 30);
  }

  // ---- Footer -------------------------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text('Hemingways Pattaya — Confidential, for partner distribution', marginX, doc.internal.pageSize.getHeight() - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageW - marginX, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  return { blob: doc.output('blob'), filename: `Hemingways_Pattaya_${label.replace(/\s+/g, '_')}_Report.pdf` };
}

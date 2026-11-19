import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import type { SunenEditionStats } from '../../types';
import { ManuscriptCard } from '../ui/Card';
import { SpeechControls } from '../tts/SpeechControls';

import { formatLocaleNumber, getLocalizedSunenUi } from '../../utils/articleTranslations';

interface SunenChartsProps {
  totalWritten: number;
  selectedInSunen: number;
  murselApprox: number;
  elMerasilApprox: number;
  editions: SunenEditionStats[];
}

type EditionMetric = 'hadiths' | 'babs' | 'books';

export const SunenCharts: React.FC<SunenChartsProps> = ({
  totalWritten,
  selectedInSunen,
  murselApprox,
  editions,
}) => {
  const { settings, articlePack } = useApp();
  const isDark = settings.theme === 'dark';
  const lang = settings.language;
  const ui = getLocalizedSunenUi(lang, articlePack).charts;
  const [metric, setMetric] = useState<EditionMetric>('hadiths');

  const metricMeta: Record<
    EditionMetric,
    { label: string; unit: string; domain: [number, number] }
  > = {
    hadiths: {
      label: ui.metricHadiths,
      unit: ui.unitHadith,
      domain: [4500, 5400],
    },
    babs: {
      label: ui.metricBabs,
      unit: ui.unitBab,
      domain: [1800, 1920],
    },
    books: {
      label: ui.metricBooks,
      unit: ui.unitBook,
      domain: [30, 45],
    },
  };

  const axisColor = isDark ? '#c4bdb0' : '#57534e';
  const gridColor = isDark ? '#2c374c' : '#dfd6c3';
  const tooltipBg = isDark ? '#171e2b' : '#fbf9f4';
  const tooltipBorder = isDark ? '#3e4c66' : '#c9bca2';
  const tooltipText = isDark ? '#efeae0' : '#1c1917';

  const navyColor = isDark ? '#3b67b0' : '#14284b';
  const emeraldColor = isDark ? '#2d9f6b' : '#0f5132';
  const goldColor = isDark ? '#d9ad5b' : '#b8862d';

  const nonMursel = selectedInSunen - murselApprox;
  const murselData = useMemo(
    () => [
      { name: ui.musnadSliceName, value: nonMursel, color: navyColor },
      { name: ui.murselSliceName, value: murselApprox, color: goldColor },
    ],
    [ui.musnadSliceName, ui.murselSliceName, nonMursel, murselApprox, navyColor, goldColor]
  );

  const barData = useMemo(
    () =>
      editions.map((ed, idx) => ({
        id: ed.id,
        name: ui.shortLabels[ed.id] || ed.editionName,
        fullName: ed.editionName,
        value: ed[metric],
        books: ed.books,
        babs: ed.babs,
        hadiths: ed.hadiths,
        fill: [navyColor, emeraldColor, goldColor, isDark ? '#60a5fa' : '#1d396b'][idx % 4],
      })),
    [editions, metric, ui.shortLabels, navyColor, emeraldColor, goldColor, isDark]
  );

  const activeMetric = metricMeta[metric];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{ui.intro}</p>
        <SpeechControls
          id="sunen-charts-narration"
          compact
          arabicText={lang === 'ar' ? ui.narration : undefined}
          primaryText={lang === 'ar' ? undefined : ui.narration}
        />
      </div>

      {/* Top Grid: 500.000 -> 4.800 Funnel + Mürsel Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <ManuscriptCard
          accentColor="var(--accent-navy)"
          className="lg:col-span-6 p-6 flex flex-col justify-between gap-5"
        >
          <div className="space-y-2">
            <p className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              {ui.funnelKicker}
            </p>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.funnelHeading}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {ui.funnelSubtitle}
            </p>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">{ui.writtenRowLabel}</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {formatLocaleNumber(totalWritten, lang)}
                </span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-1 flex items-center">
                <div
                  className="min-h-[22px] rounded-lg flex items-center px-3 py-0.5 text-[11px] font-tabular font-semibold text-white"
                  style={{ width: '100%', backgroundColor: navyColor }}
                >
                  {ui.totalAccumulationBar}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">{ui.selectedRowLabel}</span>
                <span className="font-bold text-[var(--accent-emerald)]">
                  {formatLocaleNumber(selectedInSunen, lang)}
                </span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-1.5 py-1 flex items-center gap-2">
                <div
                  className="h-5 rounded-lg shrink-0"
                  style={{ width: '4%', minWidth: '14px', backgroundColor: emeraldColor }}
                />
                <span className="text-[11px] font-tabular font-semibold text-[var(--text-primary)] leading-snug">
                  {ui.selectionRatioNote}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">{ui.murselRowLabel}</span>
                <span className="font-bold text-[var(--accent-gold)]">
                  ~{formatLocaleNumber(murselApprox, lang)}
                </span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-1.5 py-1 flex items-center gap-2">
                <div
                  className="h-5 rounded-lg shrink-0"
                  style={{ width: '12.5%', backgroundColor: goldColor }}
                />
                <span className="text-[11px] font-tabular text-[var(--text-secondary)] leading-snug">
                  {ui.murselRatioNote}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">{ui.manuscriptEvidenceLabel}</strong>{' '}
            {ui.manuscriptEvidenceBody}
          </div>
        </ManuscriptCard>

        <ManuscriptCard
          accentColor="var(--accent-gold)"
          className="lg:col-span-6 p-6 flex flex-col justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-[var(--accent-gold)]">{ui.pieKicker}</p>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.pieHeading}</h3>
          </div>

          <div className="w-full h-[240px]" dir="ltr" data-testid="mursel-pie-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={murselData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {murselData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${formatLocaleNumber(Number(value ?? 0), lang)} ${ui.unitHadith}`,
                    ui.tooltipCountLabel,
                  ]}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    color: tooltipText,
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {murselData.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-between gap-2"
              >
                <span className="inline-flex items-center gap-2 text-[var(--text-primary)] font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </span>
                <span className="font-tabular font-bold text-[var(--text-primary)]">
                  {formatLocaleNumber(item.value, lang)}
                </span>
              </div>
            ))}
          </div>
        </ManuscriptCard>
      </div>

      {/* Bottom: 4-Edition Comparison BarChart + Table */}
      <ManuscriptCard accentColor="var(--accent-emerald)" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[var(--accent-emerald)]">{ui.barKicker}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {ui.barHeading}
            </h3>
          </div>

          <div
            role="group"
            aria-label={ui.metricGroupAria}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
          >
            {(['hadiths', 'babs', 'books'] as EditionMetric[]).map((key) => {
              const active = metric === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMetric(key)}
                  aria-pressed={active}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {metricMeta[key].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[290px]" dir="ltr" data-testid="editions-bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 12, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                domain={activeMetric.domain}
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
                width={54}
              />
              <Tooltip
                formatter={(value) => [
                  `${formatLocaleNumber(Number(value ?? 0), lang)} ${activeMetric.unit}`,
                  activeMetric.label,
                ]}
                labelFormatter={(_label, payload) =>
                  payload?.[0]?.payload?.fullName ?? String(_label)
                }
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  color: tooltipText,
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={72}>
                {barData.map((entry) => (
                  <Cell key={entry.id} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clean Tabular Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
                <th className="py-2.5 pe-4 font-semibold text-start">{ui.tableColEdition}</th>
                <th className="py-2.5 px-3 font-semibold text-start">{ui.tableColYear}</th>
                <th className="py-2.5 px-3 font-semibold text-end">{ui.tableColBooks}</th>
                <th className="py-2.5 px-3 font-semibold text-end">{ui.tableColBabs}</th>
                <th className="py-2.5 ps-3 font-semibold text-end">{ui.tableColHadiths}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {editions.map((ed) => (
                <tr key={ed.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                  <td className="py-3 pe-4 font-medium text-[var(--text-primary)]">
                    {ed.editionName}
                  </td>
                  <td className="py-3 px-3 text-xs font-tabular text-[var(--text-secondary)] whitespace-nowrap">
                    {ed.yearText}
                  </td>
                  <td className="py-3 px-3 text-end font-tabular font-semibold text-[var(--text-primary)]">
                    {formatLocaleNumber(ed.books, lang)}
                  </td>
                  <td className="py-3 px-3 text-end font-tabular font-semibold text-[var(--text-primary)]">
                    {formatLocaleNumber(ed.babs, lang)}
                  </td>
                  <td className="py-3 ps-3 text-end font-tabular font-bold text-[var(--accent-emerald)]">
                    {formatLocaleNumber(ed.hadiths, lang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ManuscriptCard>
    </div>
  );
};

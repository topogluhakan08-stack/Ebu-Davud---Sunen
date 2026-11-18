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

interface SunenChartsProps {
  totalWritten: number;
  selectedInSunen: number;
  murselApprox: number;
  elMerasilApprox: number;
  editions: SunenEditionStats[];
}

type EditionMetric = 'hadiths' | 'babs' | 'books';

const METRIC_META: Record<
  EditionMetric,
  { label: string; unit: string; shortLabel: string; domain: [number, number] }
> = {
  hadiths: {
    label: 'Hadis Sayısı',
    unit: 'hadis',
    shortLabel: 'Hadis',
    domain: [4500, 5400],
  },
  babs: {
    label: 'Bab Sayısı',
    unit: 'bab',
    shortLabel: 'Bab',
    domain: [1800, 1920],
  },
  books: {
    label: 'Kitap Sayısı',
    unit: 'kitap',
    shortLabel: 'Kitap',
    domain: [30, 45],
  },
};

const SHORT_EDITION_LABELS: Record<string, string> = {
  wensinck: 'Wensinck',
  abdulhamid: 'M. Abdülhamîd',
  avvame: 'M. Avvâme',
  liechtenstein: 'Liechtenstein',
};

export const SunenCharts: React.FC<SunenChartsProps> = ({
  totalWritten,
  selectedInSunen,
  murselApprox,
  elMerasilApprox,
  editions,
}) => {
  const { settings } = useApp();
  const isDark = settings.theme === 'dark';
  const [metric, setMetric] = useState<EditionMetric>('hadiths');

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
      { name: 'Müsned & Muttasıl Hadisler', value: nonMursel, color: navyColor },
      { name: 'Mürsel Rivayetler (~600)', value: murselApprox, color: goldColor },
    ],
    [nonMursel, murselApprox, navyColor, goldColor]
  );

  const barData = useMemo(
    () =>
      editions.map((ed, idx) => ({
        id: ed.id,
        name: SHORT_EDITION_LABELS[ed.id] || ed.editionName,
        fullName: ed.editionName,
        value: ed[metric],
        books: ed.books,
        babs: ed.babs,
        hadiths: ed.hadiths,
        fill: [navyColor, emeraldColor, goldColor, isDark ? '#60a5fa' : '#1d396b'][idx % 4],
      })),
    [editions, metric, navyColor, emeraldColor, goldColor, isDark]
  );

  const selectionRatio = ((selectedInSunen / totalWritten) * 100).toFixed(2);
  const murselRatio = ((murselApprox / selectedInSunen) * 100).toFixed(1);

  const narrationTr = `Ebû Dâvûd hayatı boyunca yazdığı ${totalWritten.toLocaleString('tr-TR')} hadisten ${selectedInSunen.toLocaleString('tr-TR')} ahkâm hadisini es-Sünen'e seçmiştir; bu oran yaklaşık yüzde ${selectionRatio}'dır. Seçilen 4.800 hadisten yaklaşık ${murselApprox} tanesi mürseldir ve el-Merâsîl kitabındaki ${elMerasilApprox}'e yakın rivayet es-Sünen'in tekmilesi niteliğindedir. Neşirlere göre Wensinck'te 40 kitap, 1.889 bab, 4.800 hadis; Muhammed Muhyiddin Abdülhamîd neşrinde 35 kitap, 1.871 bab, 5.274 hadis; Muhammed Avvâme neşrinde 36 kitap, 1.850 bab, 5.232 hadis; Cem'iyyetü'l-merkezi'l-İslâmî Liechtenstein neşrinde ise 42 kitap, 1.885 bab ve 5.276 hadis yer alır.`;

  const activeMetric = METRIC_META[metric];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
          500.000 rivayetten 4.800 hadise süzülme oranını, mürsel dağılımını ve dört temel neşrin
          kitap–bab–hadis sayılarını etkileşimli grafiklerle karşılaştırın.
        </p>
        <SpeechControls id="sunen-charts-narration" compact turkishText={narrationTr} />
      </div>

      {/* Top Grid: 500.000 -> 4.800 Funnel + Mürsel Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <ManuscriptCard accentColor="var(--accent-navy)" className="lg:col-span-6 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              Eleme ve Seçme Oranı · ~%{selectionRatio}
            </p>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              500.000 Hadisten 4.800 Ahkâm Hadisine Süzülme
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Senedinde kopukluk bulunmayan ve râvilerinin zayıflığında ittifak edilmeyen ahkâm
              rivayetlerinin seçimi.
            </p>
          </div>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">Hayatı boyunca yazdığı hadis</span>
                <span className="font-bold text-[var(--text-primary)]">500.000</span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-1 flex items-center">
                <div
                  className="min-h-[22px] rounded-lg flex items-center px-3 py-0.5 text-[11px] font-tabular font-semibold text-white"
                  style={{ width: '100%', backgroundColor: navyColor }}
                >
                  %100 · Toplam Hadis Birikimi
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">es-Sünen’e seçilen ahkâm hadisi</span>
                <span className="font-bold text-[var(--accent-emerald)]">4.800</span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-1.5 py-1 flex items-center gap-2">
                <div
                  className="h-5 rounded-lg shrink-0"
                  style={{ width: '4%', minWidth: '14px', backgroundColor: emeraldColor }}
                />
                <span className="text-[11px] font-tabular font-semibold text-[var(--text-primary)] leading-snug">
                  %{selectionRatio} seçki oranı (yaklaşık 104 rivayetten 1’i)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-tabular">
                <span className="text-[var(--text-secondary)]">
                  es-Sünen içindeki mürsel &amp; el-Merâsîl ilişkisi
                </span>
                <span className="font-bold text-[var(--accent-gold)]">~600</span>
              </div>
              <div className="min-h-[30px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-1.5 py-1 flex items-center gap-2">
                <div
                  className="h-5 rounded-lg shrink-0"
                  style={{ width: '12.5%', backgroundColor: goldColor }}
                />
                <span className="text-[11px] font-tabular text-[var(--text-secondary)] leading-snug">
                  4.800 içinde ~%{murselRatio} mürsel · el-Merâsîl tekmilesi (~{elMerasilApprox})
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Nüsha Delili:</strong> Köprülü Ktp.,
            nr. 363 ve bazı <em>es-Sünen</em> yazmalarının sonundaki{' '}
            <span className="italic text-[var(--text-primary)]">
              “Hâzâ âhirü’l-merâsîl min Kitâbi’s-Sünen”
            </span>{' '}
            kaydı, <em>el-Merâsîl</em>’in <em>es-Sünen</em>’in tamamlayıcısı (tekmilesi) olduğunu
            gösterir.
          </div>
        </ManuscriptCard>

        <ManuscriptCard accentColor="var(--accent-gold)" className="lg:col-span-6 p-6 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[var(--accent-gold)]">
              4.800 İçinde Mürsel Dağılımı
            </p>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Müsned ve Mürsel Rivayet Oranı
            </h3>
          </div>

          <div className="w-full h-[240px]" data-testid="mursel-pie-chart">
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
                    `${Number(value ?? 0).toLocaleString('tr-TR')} hadis`,
                    'Sayı',
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
                  {item.value.toLocaleString('tr-TR')}
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
            <p className="text-xs font-medium text-[var(--accent-emerald)]">
              Neşirlere Göre Sayısal Farklar
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Dört Temel Neşirde Kitap, Bab ve Hadis Sayıları
            </h3>
          </div>

          <div
            role="group"
            aria-label="Karşılaştırma ölçütü seçin"
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
                  {METRIC_META[key].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[290px]" data-testid="editions-bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 12, right: 20, left: 8, bottom: 8 }}
            >
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
                  `${Number(value ?? 0).toLocaleString('tr-TR')} ${activeMetric.unit}`,
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
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
                <th className="py-2.5 pr-4 font-semibold">Neşir / Sayım</th>
                <th className="py-2.5 px-3 font-semibold">Tarih</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kitap</th>
                <th className="py-2.5 px-3 font-semibold text-right">Bab</th>
                <th className="py-2.5 pl-3 font-semibold text-right">Hadis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {editions.map((ed) => (
                <tr key={ed.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                    {ed.editionName}
                  </td>
                  <td className="py-3 px-3 text-xs font-tabular text-[var(--text-secondary)] whitespace-nowrap">
                    {ed.yearText}
                  </td>
                  <td className="py-3 px-3 text-right font-tabular font-semibold text-[var(--text-primary)]">
                    {ed.books}
                  </td>
                  <td className="py-3 px-3 text-right font-tabular font-semibold text-[var(--text-primary)]">
                    {ed.babs.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 pl-3 text-right font-tabular font-bold text-[var(--accent-emerald)]">
                    {ed.hadiths.toLocaleString('tr-TR')}
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

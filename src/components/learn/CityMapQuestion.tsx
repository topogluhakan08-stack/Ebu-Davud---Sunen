import React, { useMemo } from 'react';
import ebuDavudRaw from '../../data/ebu-davud.json';
import { useApp } from '../../context/AppContext';
import type { EbuDavudData } from '../../types';
import { getLocalizedEbuDavud } from '../../utils/articleTranslations';
import { getLocalizedLearnUi } from '../../utils/learnTranslations';

const EBU_DAVUD_TR = ebuDavudRaw as EbuDavudData;

interface CityMapQuestionProps {
  targetCityId: string;
  selectedCityId: string | null;
  revealed: boolean;
  onSelect: (cityId: string) => void;
}

const MIN_LNG = 29.5;
const MAX_LNG = 68.5;
const MIN_LAT = 19.5;
const MAX_LAT = 38.5;
const W = 680;
const H = 310;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (W - 70) + 35;
  const y = H - (((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * (H - 64) + 32);
  return { x, y };
}

const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor?: 'start' | 'middle' | 'end' }> = {
  sijistan: { dx: 0, dy: 18, anchor: 'middle' },
  baghdad: { dx: 12, dy: -6, anchor: 'start' },
  basra: { dx: 12, dy: 12, anchor: 'start' },
  mecca: { dx: 12, dy: 4, anchor: 'start' },
  kufa: { dx: -12, dy: 4, anchor: 'end' },
  homs: { dx: 10, dy: -10, anchor: 'start' },
  damascus: { dx: 12, dy: 6, anchor: 'start' },
  harran: { dx: 0, dy: -12, anchor: 'middle' },
  khurasan: { dx: 0, dy: -12, anchor: 'middle' },
  balkh: { dx: 0, dy: -12, anchor: 'middle' },
  rayy: { dx: 0, dy: -12, anchor: 'middle' },
  egypt: { dx: -8, dy: 18, anchor: 'middle' },
  tarsus: { dx: -10, dy: -10, anchor: 'end' },
  herat: { dx: 8, dy: 16, anchor: 'start' },
};

export const CityMapQuestion: React.FC<CityMapQuestionProps> = ({
  targetCityId,
  selectedCityId,
  revealed,
  onSelect,
}) => {
  const { settings, articlePack, learnPack } = useApp();
  const lang = settings.language;
  const ui = getLocalizedLearnUi(lang, learnPack).cityMap;

  const cities = useMemo(() => {
    const loc = getLocalizedEbuDavud(EBU_DAVUD_TR, lang, articlePack);
    return loc ? loc.cities : EBU_DAVUD_TR.cities;
  }, [lang, articlePack]);

  const points = useMemo(
    () =>
      cities.map((c) => ({
        ...c,
        ...project(c.lat, c.lng),
      })),
    [cities]
  );

  return (
    <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-3.5 py-2 border-b border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
        <span className="font-semibold text-[var(--text-primary)]">{ui.headerBadge}</span>
        <span>
          {revealed
            ? `✓ ${cities.find((c) => c.id === targetCityId)?.nameTr || targetCityId}`
            : ui.legendHint}
        </span>
      </div>

      <div className="w-full overflow-x-auto bg-[#EFE8DA] dark:bg-[#171C23]" dir="ltr">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[520px] h-auto block select-none"
          role="img"
          aria-label={ui.svgAria}
        >
          <defs>
            <linearGradient id="mapSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--bg-surface)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--bg-card)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width={W} height={H} fill="url(#mapSeaGrad)" />

          {/* Subtle latitude/longitude graticule */}
          {[70, 145, 220].map((y) => (
            <line
              key={`lat-${y}`}
              x1={16}
              y1={y}
              x2={W - 16}
              y2={y}
              stroke="var(--border-hairline)"
              strokeDasharray="3 5"
              strokeWidth={1}
            />
          ))}
          {[140, 290, 440, 590].map((x) => (
            <line
              key={`lng-${x}`}
              x1={x}
              y1={16}
              x2={x}
              y2={H - 16}
              stroke="var(--border-hairline)"
              strokeDasharray="3 5"
              strokeWidth={1}
            />
          ))}

          {/* Stylized historical regions (soft non-figurative shapes) */}
          <path
            d="M 42 54 Q 160 36 300 62 T 580 76 L 642 150 Q 590 230 480 218 T 275 235 L 180 286 L 78 242 Z"
            fill="var(--bg-card)"
            fillOpacity="0.72"
            stroke="var(--border-hairline)"
            strokeWidth={1.2}
          />

          {/* Region Labels */}
          <text x={85} y={40} fontSize={10} fill="var(--text-muted)" opacity={0.75}>
            {ui.regionMedAnatolia}
          </text>
          <text x={198} y={288} fontSize={10} fill="var(--text-muted)" opacity={0.75}>
            {ui.regionHijaz}
          </text>
          <text x={505} y={248} fontSize={10} fill="var(--text-muted)" opacity={0.75}>
            {ui.regionSijistan}
          </text>

          {/* Subtle route connections along his life journey */}
          <polyline
            fill="none"
            stroke="var(--accent-gold)"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            points={points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
          />

          {/* 14 Interactive City Nodes */}
          {points.map((city) => {
            const isTarget = city.id === targetCityId;
            const isSelected = city.id === selectedCityId;
            const off = LABEL_OFFSETS[city.id] || { dx: 0, dy: -12, anchor: 'middle' };

            let fill = 'var(--accent-navy)';
            let ring = 'none';
            let radius = 7;

            if (revealed) {
              if (isTarget) {
                fill = '#2E6B5E';
                ring = '#2E6B5E';
                radius = 10;
              } else if (isSelected && !isTarget) {
                fill = '#A03848';
                ring = '#A03848';
                radius = 9;
              } else {
                fill = 'var(--text-muted)';
                radius = 5.5;
              }
            } else if (isSelected) {
              fill = 'var(--accent-gold)';
              radius = 9;
            }

            const displayLabel = lang === 'ar' ? city.nameAr : city.nameTr;

            return (
              <g
                key={city.id}
                transform={`translate(${city.x}, ${city.y})`}
                onClick={() => {
                  if (!revealed) onSelect(city.id);
                }}
                onKeyDown={(e) => {
                  if (!revealed && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelect(city.id);
                  }
                }}
                role="button"
                tabIndex={revealed ? -1 : 0}
                aria-label={displayLabel}
                style={{ cursor: revealed ? 'default' : 'pointer' }}
              >
                <circle r={16} fill="transparent" />
                {ring !== 'none' && (
                  <circle
                    r={radius + 6}
                    fill={ring}
                    fillOpacity={0.18}
                    stroke={ring}
                    strokeWidth={1.5}
                  />
                )}
                <circle
                  r={radius}
                  fill={fill}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                />
                <text
                  x={off.dx}
                  y={off.dy}
                  textAnchor={off.anchor || 'middle'}
                  fontSize={isTarget && revealed ? 11.5 : 10.5}
                  fontWeight={isTarget && revealed ? 700 : 600}
                  fill={
                    revealed && isTarget
                      ? '#2E6B5E'
                      : revealed && isSelected
                        ? '#A03848'
                        : 'var(--text-primary)'
                  }
                >
                  {displayLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {revealed && (
        <div className="px-3.5 py-2 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B5E]" />
            {ui.legendCorrect}
          </span>
          {selectedCityId && selectedCityId !== targetCityId && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A03848]" />
              {ui.legendWrong}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

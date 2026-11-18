import React, { useState } from 'react';
import { CheckCircle2, MapPin, XCircle } from 'lucide-react';
import ebuDavudRaw from '../../data/ebu-davud.json';
import type { EbuDavudData } from '../../types';
import { useApp } from '../../context/AppContext';

const CITIES = (ebuDavudRaw as EbuDavudData).cities;

interface CityMapQuestionProps {
  targetCityId: string;
  answeredCityId: string | null;
  onSelectCity: (cityId: string) => void;
}

// Equirectangular projection bounds covering Mısır (31E) -> Belh (67E) & Mekke (21N) -> Harran/Tarsus (37N)
const MIN_LNG = 28;
const MAX_LNG = 70;
const MIN_LAT = 19.5;
const MAX_LAT = 38.8;

const SVG_W = 680;
const SVG_H = 340;

function project(lat: number, lng: number): { x: number; y: number } {
  const padX = 44;
  const padY = 34;
  const x = padX + ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (SVG_W - padX * 2);
  const y = padY + ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * (SVG_H - padY * 2);
  return { x, y };
}

export const CityMapQuestion: React.FC<CityMapQuestionProps> = ({
  targetCityId,
  answeredCityId,
  onSelectCity,
}) => {
  const { settings } = useApp();
  const isDark = settings.theme === 'dark';
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hasAnswered = answeredCityId !== null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-3.5 py-2 border-b border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
            <span>14 Tarihî İlim Merkezi Haritası (Mısır — Hicaz — Şam — Irak — Horasan)</span>
          </span>
          <span>Haritadan bir şehir pinine veya aşağıdaki şehir butonuna tıklayın</span>
        </div>

        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Ebû Dâvûd’un seyahat ettiği 14 şehir haritası"
        >
          <rect
            x={0}
            y={0}
            width={SVG_W}
            height={SVG_H}
            fill={isDark ? '#121925' : '#F4EFE4'}
          />

          {/* Subtle historical land & sea horizon silhouettes (abstract geometric contours) */}
          <path
            d="M 0 115 Q 95 100 135 128 T 185 170 L 145 250 Q 170 295 225 340 L 0 340 Z"
            fill={isDark ? 'rgba(59, 103, 176, 0.14)' : 'rgba(29, 78, 137, 0.08)'}
          />
          <path
            d="M 190 215 L 250 325 L 330 335 L 365 265 L 270 195 Z"
            fill={isDark ? 'rgba(184, 134, 45, 0.08)' : 'rgba(184, 134, 45, 0.1)'}
          />
          {/* Subtle coordinate grid */}
          {[85, 170, 255].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={SVG_W}
              y2={y}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(28,25,23,0.06)'}
              strokeDasharray="4 4"
            />
          ))}
          {[136, 272, 408, 544].map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={SVG_H}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(28,25,23,0.06)'}
              strokeDasharray="4 4"
            />
          ))}

          {/* Regional water/region subtle labels */}
          <text x={34} y={62} fontSize="10" fill={isDark ? '#64748B' : '#948C7E'} fontWeight="600">
            AKDENİZ & ANADOLU
          </text>
          <text x={240} y={295} fontSize="10" fill={isDark ? '#64748B' : '#948C7E'} fontWeight="600">
            HİCAZ
          </text>
          <text x={505} y={255} fontSize="10" fill={isDark ? '#64748B' : '#948C7E'} fontWeight="600">
            SİCİSTAN & HORASAN
          </text>

          {/* Subtle travel route polyline connecting cities by order */}
          <polyline
            fill="none"
            stroke={isDark ? 'rgba(217, 173, 91, 0.25)' : 'rgba(184, 134, 45, 0.28)'}
            strokeWidth={1.3}
            strokeDasharray="4 3"
            points={CITIES.map((c) => {
              const p = project(c.lat, c.lng);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            }).join(' ')}
          />

          {/* 14 City Pins */}
          {CITIES.map((city) => {
            const { x, y } = project(city.lat, city.lng);
            const isTarget = city.id === targetCityId;
            const isChosen = city.id === answeredCityId;
            const isHovered = city.id === hoveredId;

            let fill = isDark ? '#3B67B0' : '#14284B';
            let stroke = isDark ? '#D9AD5B' : '#FBF9F4';
            let r = isHovered ? 9.5 : 7.5;

            if (hasAnswered) {
              if (isTarget) {
                fill = '#0F5132';
                stroke = '#34D399';
                r = 10.5;
              } else if (isChosen) {
                fill = '#8C3B4A';
                stroke = '#F472B6';
                r = 9.5;
              } else {
                fill = isDark ? '#334155' : '#A8A29E';
              }
            }

            // Slight label offsets to keep Iraq / Levant clusters legible
            const labelDy =
              city.id === 'harran' || city.id === 'halep'
                ? -13
                : city.id === 'humus'
                  ? 16
                  : city.id === 'kufe'
                    ? 16
                    : city.id === 'bagdat'
                      ? -13
                      : -12;

            return (
              <g
                key={city.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => !hasAnswered && onSelectCity(city.id)}
                onMouseEnter={() => setHoveredId(city.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === city.id ? null : prev))}
                role="button"
                tabIndex={hasAnswered ? -1 : 0}
                aria-label={`${city.nameTr} (${city.nameAr}) şehrini seç`}
                onKeyDown={(e) => {
                  if (!hasAnswered && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectCity(city.id);
                  }
                }}
                className={hasAnswered ? 'cursor-default' : 'cursor-pointer focus:outline-none'}
              >
                <circle cx={0} cy={0} r={14} fill="transparent" />
                <circle
                  cx={0}
                  cy={0}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={0}
                  y={labelDy}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight={isTarget && hasAnswered ? '700' : '600'}
                  fill={
                    hasAnswered && isTarget
                      ? isDark
                        ? '#6EE7B7'
                        : '#0F5132'
                      : hasAnswered && isChosen
                        ? isDark
                          ? '#F9A8D4'
                          : '#8C3B4A'
                        : isDark
                          ? '#EFEAE0'
                          : '#1C1917'
                  }
                >
                  {city.nameTr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Touch & Keyboard City Grid (14 cities) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {CITIES.map((city) => {
          const isTarget = city.id === targetCityId;
          const isChosen = city.id === answeredCityId;
          let cls =
            'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-navy)]';
          if (hasAnswered) {
            if (isTarget) {
              cls =
                'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] dark:border-[#34D399] text-[#0F5132] dark:text-[#6EE7B7] font-bold';
            } else if (isChosen) {
              cls =
                'bg-[#F7EAED] dark:bg-[#361921] border-[#8C3B4A] dark:border-[#F472B6] text-[#8C3B4A] dark:text-[#F9A8D4]';
            } else {
              cls = 'bg-[var(--bg-surface)]/50 border-[var(--border-hairline)] text-[var(--text-muted)]';
            }
          }
          return (
            <button
              key={city.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => onSelectCity(city.id)}
              className={`min-h-[38px] px-2 py-1.5 rounded-xl border text-xs font-medium inline-flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
            >
              <span className="truncate">{city.nameTr}</span>
              {hasAnswered && isTarget && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
              {hasAnswered && isChosen && !isTarget && (
                <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

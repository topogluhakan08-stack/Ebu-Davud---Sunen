import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  ArrowRight,
  Expand,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shrink,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { BABS } from '../../data/babs';
import hadislerRaw from '../../data/hadisler.json';
import type { BabInfo, HadithItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { getBabDisplayTitle } from '../../utils/localizedText';
import { SymbolicBabIcon } from '../icons/SymbolicIllustrations';
import { ManuscriptCard } from '../ui/Card';

const HADITHS = hadislerRaw as HadithItem[];

export interface ThematicCluster {
  id: string;
  titleTr: string;
  titleFr: string;
  titleAr: string;
  babIds: number[];
  colorLight: string;
  colorDark: string;
}

export const MINDMAP_CLUSTERS: ThematicCluster[] = [
  {
    id: 'hilm-vakar-ofke',
    titleTr: 'Hilim, Vakar & Öfke',
    titleFr: 'Clémence, Dignité & Colère',
    titleAr: 'الحلم والوقار والغضب',
    babIds: [1, 2, 3, 4],
    colorLight: '#1D4E89',
    colorDark: '#60A5FA',
  },
  {
    id: 'kolaylik-muaseret',
    titleTr: 'Kolaylık & Muaşeret',
    titleFr: 'Facilité & Sociabilité',
    titleAr: 'التيسير وحسن العشرة',
    babIds: [5, 6],
    colorLight: '#2B6E44',
    colorDark: '#4ADE80',
  },
  {
    id: 'haya-ahlak',
    titleTr: 'Hayâ & Güzel Ahlâk',
    titleFr: 'Pudeur & Noblesse morale',
    titleAr: 'الحياء وحسن الخلق',
    babIds: [7, 8],
    colorLight: '#3E5C76',
    colorDark: '#7DD3FC',
  },
  {
    id: 'tevazu-ovgu-rifk',
    titleTr: 'Tevazu, Övgü & Rıfk',
    titleFr: 'Humilité, Éloge & Douceur',
    titleAr: 'التواضع والتمـادح والرفق',
    babIds: [9, 10, 11],
    colorLight: '#8A6024',
    colorDark: '#FBBF24',
  },
];

interface HoverInfo {
  kind: 'bab' | 'hadith';
  bab: BabInfo;
  hadith?: HadithItem;
}

interface KitabMindMapProps {
  title?: string;
  subtitle?: string;
  initialExpandedBabs?: number[];
}

function toCartesian(angleRad: number, radius: number): { x: number; y: number } {
  // D3 radial convention: 0 rad at 12 o'clock, clockwise
  return {
    x: radius * Math.sin(angleRad),
    y: -radius * Math.cos(angleRad),
  };
}

export const KitabMindMap: React.FC<KitabMindMapProps> = ({
  title,
  subtitle,
  initialExpandedBabs = [1, 4],
}) => {
  const navigate = useNavigate();
  const { settings, progress, t } = useApp();
  const isDark = settings.theme === 'dark';
  const resolvedTitle = title ?? t.mindMap.title;
  const resolvedSubtitle = subtitle ?? t.mindMap.subtitle;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomLayerRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [expandedBabs, setExpandedBabs] = useState<number[]>(initialExpandedBabs);
  const [activeClusterId, setActiveClusterId] = useState<string | 'all'>('all');
  const [hovered, setHovered] = useState<HoverInfo | null>(null);
  const [selectedBabId, setSelectedBabId] = useState<number>(initialExpandedBabs[0] ?? 1);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hadithsByBab = useMemo(() => {
    const map = new Map<number, HadithItem[]>();
    for (const b of BABS) map.set(b.id, []);
    for (const h of HADITHS) {
      map.get(h.babId)?.push(h);
    }
    return map;
  }, []);

  // Compute radial tree geometry using D3 radial link & polar geometry
  const layout = useMemo(() => {
    const totalBabs = BABS.length; // 11
    const babRadius = 215;
    const leafBaseRadius = 338;

    const clusterSpan = new Map<string, { startAngle: number; endAngle: number }>();

    const babNodes = BABS.map((bab, idx) => {
      // Distribute 11 babs evenly around circle starting slightly right of 12 o'clock
      const angle = ((idx + 0.5) / totalBabs) * Math.PI * 2;
      const pos = toCartesian(angle, babRadius);
      const cluster = MINDMAP_CLUSTERS.find((c) => c.babIds.includes(bab.id)) ?? MINDMAP_CLUSTERS[0];

      const existingSpan = clusterSpan.get(cluster.id);
      if (!existingSpan) {
        clusterSpan.set(cluster.id, { startAngle: angle, endAngle: angle });
      } else {
        existingSpan.startAngle = Math.min(existingSpan.startAngle, angle);
        existingSpan.endAngle = Math.max(existingSpan.endAngle, angle);
      }

      const babHadiths = hadithsByBab.get(bab.id) ?? [];
      const isExpanded = expandedBabs.includes(bab.id);
      const spreadStep = babHadiths.length > 4 ? 0.085 : 0.11;
      const totalSpread = (babHadiths.length - 1) * spreadStep;

      const leaves = isExpanded
        ? babHadiths.map((hadith, hIdx) => {
            const leafAngle = angle - totalSpread / 2 + hIdx * spreadStep;
            // Slight stagger on dense babs (like Bab 6 with 7 hadiths) for clean legibility
            const stagger = babHadiths.length >= 5 && hIdx % 2 === 1 ? 36 : 0;
            const leafR = leafBaseRadius + stagger;
            const leafPos = toCartesian(leafAngle, leafR);
            return {
              hadith,
              angle: leafAngle,
              radius: leafR,
              x: leafPos.x,
              y: leafPos.y,
            };
          })
        : [];

      return {
        bab,
        cluster,
        angle,
        radius: babRadius,
        x: pos.x,
        y: pos.y,
        hadithCount: babHadiths.length,
        isExpanded,
        leaves,
      };
    });

    const clusterArcs = MINDMAP_CLUSTERS.map((c) => {
      const span = clusterSpan.get(c.id)!;
      const pad = (Math.PI * 2) / totalBabs / 2.35;
      const midAngle = (span.startAngle + span.endAngle) / 2;
      const labelPos = toCartesian(midAngle, 126);
      const arcGenerator = d3
        .arc<unknown>()
        .innerRadius(104)
        .outerRadius(112)
        .startAngle(span.startAngle - pad)
        .endAngle(span.endAngle + pad)
        .cornerRadius(4);

      return {
        cluster: c,
        pathData: arcGenerator({}) || '',
        labelPos,
        midAngle,
      };
    });

    const radialLink = d3
      .linkRadial<{ source: { angle: number; radius: number }; target: { angle: number; radius: number } }, { angle: number; radius: number }>()
      .angle((d) => d.angle)
      .radius((d) => d.radius);

    return { babNodes, clusterArcs, radialLink };
  }, [expandedBabs, hadithsByBab]);

  // Attach d3.zoom for pan, mouse-wheel zoom & mobile pinch-zoom
  useEffect(() => {
    const svgEl = svgRef.current;
    const layerEl = zoomLayerRef.current;
    if (!svgEl || !layerEl) return;

    const svgSelection = d3.select(svgEl);
    const layerSelection = d3.select(layerEl);

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.55, 2.6])
      .on('zoom', (event) => {
        layerSelection.attr('transform', event.transform.toString());
        setZoomScale(Number(event.transform.k.toFixed(2)));
      });

    zoomBehaviorRef.current = zoomBehavior;
    svgSelection.call(zoomBehavior);
    // Start nicely centered
    svgSelection.call(zoomBehavior.transform, d3.zoomIdentity);

    return () => {
      svgSelection.on('.zoom', null);
    };
  }, [isFullscreen]);

  const handleZoomBy = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(220).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetView = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(280).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const toggleBab = (babId: number) => {
    setSelectedBabId(babId);
    setExpandedBabs((prev) =>
      prev.includes(babId) ? prev.filter((id) => id !== babId) : [...prev, babId]
    );
  };

  const toggleAllBabs = () => {
    if (expandedBabs.length === BABS.length) {
      setExpandedBabs([]);
    } else {
      setExpandedBabs(BABS.map((b) => b.id));
    }
  };

  const activeSummaryBab = hovered?.bab ?? BABS.find((b) => b.id === selectedBabId) ?? BABS[0];
  const activeSummaryHadith = hovered?.hadith;

  return (
    <ManuscriptCard
      accentColor="var(--accent-gold)"
      className={
        isFullscreen
          ? 'fixed inset-3 sm:inset-6 z-50 flex flex-col p-4 sm:p-6 shadow-2xl overflow-y-auto'
          : 'p-4 sm:p-6 space-y-4 overflow-hidden'
      }
    >
      {/* Header & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-gold)]">
            <span className="font-arabic-inline text-base" dir="rtl">
              كِتَابُ الْأَدَبِ
            </span>
            <span>· 4 · 11 · 38</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
            {resolvedTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">{resolvedSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={toggleAllBabs}
            className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {expandedBabs.length === BABS.length ? (
              <>
                <Shrink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.mindMap.collapseAll}</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.mindMap.openAll}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleZoomBy(1.25)}
            aria-label={t.mindMap.zoomIn}
            className="min-h-[36px] min-w-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleZoomBy(0.8)}
            aria-label={t.mindMap.zoomOut}
            className="min-h-[36px] min-w-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label={t.mindMap.resetZoom}
            className="min-h-[36px] px-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] inline-flex items-center gap-1 text-xs font-tabular text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{Math.round(zoomScale * 100)}%</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? t.mindMap.exitFullscreen : t.mindMap.fullscreen}
            className="min-h-[36px] min-w-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Thematic Cluster Filter Strip */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.mindMap.allThemes}>
        <button
          type="button"
          onClick={() => setActiveClusterId('all')}
          aria-pressed={activeClusterId === 'all'}
          className={`min-h-[32px] px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            activeClusterId === 'all'
              ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t.mindMap.allThemes}
        </button>
        {MINDMAP_CLUSTERS.map((cluster) => {
          const isSelected = activeClusterId === cluster.id;
          const color = isDark ? cluster.colorDark : cluster.colorLight;
          const clusterLabel =
            settings.language === 'tr'
              ? cluster.titleTr
              : settings.language === 'fr'
                ? cluster.titleFr
                : cluster.titleAr;
          return (
            <button
              key={cluster.id}
              type="button"
              onClick={() => {
                setActiveClusterId((prev) => (prev === cluster.id ? 'all' : cluster.id));
                setExpandedBabs(cluster.babIds);
                setSelectedBabId(cluster.babIds[0]);
              }}
              aria-pressed={isSelected}
              className={`min-h-[32px] px-3 py-1 rounded-xl text-xs font-medium border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] ring-2 ring-[var(--accent-gold)] border-[var(--accent-gold)] font-semibold'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span>{clusterLabel}</span>
            </button>
          );
        })}
      </div>

      {/* D3 Radial SVG Canvas */}
      <div
        className={`relative rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/55 overflow-hidden select-none touch-none ${
          isFullscreen ? 'flex-1 min-h-[460px]' : 'h-[370px] sm:h-[560px]'
        }`}
      >
        <svg
          ref={svgRef}
          viewBox="-465 -445 930 890"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          role="img"
          aria-label="Kitâbü'l-Edeb 11 Bab ve 38 Hadis D3 Zihin Haritası"
        >
          <defs>
            <radialGradient id="kitab-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g ref={zoomLayerRef}>
            {/* Subtle concentric manuscript rings */}
            <circle
              cx={0}
              cy={0}
              r={108}
              fill="none"
              stroke="var(--border-hairline)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <circle
              cx={0}
              cy={0}
              r={215}
              fill="none"
              stroke="var(--border-hairline)"
              strokeWidth={1}
              opacity={0.7}
            />
            <circle
              cx={0}
              cy={0}
              r={338}
              fill="none"
              stroke="var(--border-hairline)"
              strokeDasharray="2 5"
              strokeWidth={1}
              opacity={0.55}
            />
            <circle cx={0} cy={0} r={96} fill="url(#kitab-center-glow)" />

            {/* Thematic Cluster Arcs */}
            {layout.clusterArcs.map(({ cluster, pathData }) => {
              const color = isDark ? cluster.colorDark : cluster.colorLight;
              const dimmed = activeClusterId !== 'all' && activeClusterId !== cluster.id;
              return (
                <path
                  key={cluster.id}
                  d={pathData}
                  fill={color}
                  fillOpacity={dimmed ? 0.16 : 0.72}
                  className="transition-opacity duration-200 cursor-pointer"
                  onClick={() => {
                    setActiveClusterId((prev) => (prev === cluster.id ? 'all' : cluster.id));
                    setExpandedBabs(cluster.babIds);
                  }}
                />
              );
            })}

            {/* Organic Curved Links: Center -> Bab -> Hadith Leaves */}
            {layout.babNodes.map((node) => {
              const color = isDark ? node.bab.colorDarkHex : node.bab.colorHex;
              const dimmed = activeClusterId !== 'all' && activeClusterId !== node.cluster.id;
              const centerToBabPath =
                layout.radialLink({
                  source: { angle: node.angle, radius: 74 },
                  target: { angle: node.angle, radius: node.radius },
                }) || '';

              return (
                <g key={`links-${node.bab.id}`} opacity={dimmed ? 0.22 : 1} className="transition-opacity">
                  <path
                    d={centerToBabPath}
                    fill="none"
                    stroke={color}
                    strokeWidth={node.isExpanded ? 3 : 2}
                    strokeOpacity={0.75}
                    strokeLinecap="round"
                  />

                  {node.leaves.map((leaf) => {
                    const leafPath =
                      layout.radialLink({
                        source: { angle: node.angle, radius: node.radius + 26 },
                        target: { angle: leaf.angle, radius: leaf.radius },
                      }) || '';
                    return (
                      <path
                        key={`link-h-${leaf.hadith.id}`}
                        d={leafPath}
                        fill="none"
                        stroke={color}
                        strokeWidth={1.6}
                        strokeOpacity={0.65}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Hadith Number Leaf Nodes */}
            {layout.babNodes.map((node) => {
              const color = isDark ? node.bab.colorDarkHex : node.bab.colorHex;
              const softBg = isDark ? node.bab.softBgDarkHex : node.bab.softBgHex;
              const dimmed = activeClusterId !== 'all' && activeClusterId !== node.cluster.id;

              return node.leaves.map((leaf) => {
                const isRead = progress.readHadiths.includes(leaf.hadith.id);
                const isHovered = hovered?.hadith?.id === leaf.hadith.id;
                return (
                  <g
                    key={`leaf-${leaf.hadith.id}`}
                    transform={`translate(${leaf.x}, ${leaf.y})`}
                    opacity={dimmed ? 0.22 : 1}
                    role="button"
                    tabIndex={0}
                    aria-label={`Hadis ${leaf.hadith.id} — ${node.bab.titleTr}`}
                    onClick={() => navigate(`/hadisler?bab=${node.bab.id}&hadith=${leaf.hadith.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/hadisler?bab=${node.bab.id}&hadith=${leaf.hadith.id}`);
                      }
                    }}
                    onMouseEnter={() =>
                      setHovered({ kind: 'hadith', bab: node.bab, hadith: leaf.hadith })
                    }
                    onFocus={() =>
                      setHovered({ kind: 'hadith', bab: node.bab, hadith: leaf.hadith })
                    }
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isHovered ? 24 : 21}
                      fill={isRead ? color : softBg}
                      stroke={isHovered ? 'var(--accent-gold)' : color}
                      strokeWidth={isHovered ? 2.6 : 1.7}
                    />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize="11.5"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                      fill={isRead ? (isDark ? '#0f172a' : '#ffffff') : 'var(--text-primary)'}
                    >
                      {leaf.hadith.id}
                    </text>
                  </g>
                );
              });
            })}

            {/* 11 Bab Branch Nodes */}
            {layout.babNodes.map((node) => {
              const color = isDark ? node.bab.colorDarkHex : node.bab.colorHex;
              const softBg = isDark ? node.bab.softBgDarkHex : node.bab.softBgHex;
              const dimmed = activeClusterId !== 'all' && activeClusterId !== node.cluster.id;
              const isSelected = selectedBabId === node.bab.id;
              const fullBabTitle = getBabDisplayTitle(node.bab, settings.language);
              const shortTitle =
                fullBabTitle.length > 18 ? fullBabTitle.slice(0, 17) + '…' : fullBabTitle;

              return (
                <g
                  key={`bab-${node.bab.id}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  opacity={dimmed ? 0.25 : 1}
                  role="button"
                  tabIndex={0}
                  aria-expanded={node.isExpanded}
                  aria-label={`${node.bab.numberLabel}: ${fullBabTitle} (${node.hadithCount})`}
                  onClick={() => toggleBab(node.bab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleBab(node.bab.id);
                    }
                  }}
                  onMouseEnter={() => setHovered({ kind: 'bab', bab: node.bab })}
                  onFocus={() => setHovered({ kind: 'bab', bab: node.bab })}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 40 : 36}
                    fill={softBg}
                    stroke={isSelected ? 'var(--accent-gold)' : color}
                    strokeWidth={isSelected ? 3 : 2.2}
                  />
                  {/* Non-figurative SymbolicBabIcon nested inside SVG */}
                  <g transform="translate(-13, -27)">
                    <svg width="26" height="26" viewBox="0 0 48 48">
                      <SymbolicBabIcon type={node.bab.iconType} color={color} className="w-12 h-12" />
                    </svg>
                  </g>
                  <text
                    y={9}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill={color}
                    fontFamily="var(--font-sans)"
                  >
                    {node.bab.numberLabel}
                  </text>
                  <text
                    y={22}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="600"
                    fill="var(--text-primary)"
                    fontFamily="var(--font-sans)"
                  >
                    {node.isExpanded ? `− ${node.hadithCount}` : `+ ${node.hadithCount}`}
                  </text>
                  {/* External Bab Title Tag */}
                  <g transform="translate(0, 50)">
                    <rect
                      x={-60}
                      y={-10}
                      width={120}
                      height={19}
                      rx={6}
                      fill="var(--bg-card)"
                      fillOpacity={0.94}
                      stroke={color}
                      strokeWidth={0.9}
                    />
                    <text
                      textAnchor="middle"
                      dy="0.32em"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="var(--text-primary)"
                      fontFamily="var(--font-sans)"
                    >
                      {shortTitle}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Center Node: Kitab al-Adab */}
            <g transform="translate(0, 0)">
              <circle
                r={72}
                fill="var(--bg-card)"
                stroke="var(--accent-gold)"
                strokeWidth={3}
              />
              <circle
                r={64}
                fill="none"
                stroke="var(--accent-navy)"
                strokeOpacity={0.35}
                strokeWidth={1.2}
                strokeDasharray="3 3"
              />
              <text
                y={-10}
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill="var(--accent-navy)"
                className="dark:fill-[var(--accent-gold)]"
                fontFamily="var(--font-arabic)"
              >
                كِتَابُ الْأَدَبِ
              </text>
              <text
                y={13}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="var(--text-primary)"
                fontFamily="var(--font-display)"
              >
                Kitâbü&apos;l-Edeb
              </text>
              <text
                y={30}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="600"
                fill="var(--text-secondary)"
                fontFamily="var(--font-mono)"
              >
                11 Bab · 4740–4777
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Live Summary & Quick Jump Inspector Bar */}
      <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shrink-0">
            <SymbolicBabIcon
              type={activeSummaryBab.iconType}
              color={isDark ? activeSummaryBab.colorDarkHex : activeSummaryBab.colorHex}
              className="w-7 h-7"
            />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <span>{activeSummaryBab.numberLabel}</span>
              <span>·</span>
              <span className="font-tabular">
                {activeSummaryHadith
                  ? `#${activeSummaryHadith.id} · PDF s. ${activeSummaryHadith.pdfPage}`
                  : `${activeSummaryBab.hadithStart}–${activeSummaryBab.hadithEnd} · PDF s. ${activeSummaryBab.pdfPages}`}
              </span>
            </div>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
              {activeSummaryHadith
                ? settings.language === 'tr'
                  ? activeSummaryHadith.translationTr.slice(0, 140) +
                    (activeSummaryHadith.translationTr.length > 140 ? '…' : '')
                  : settings.language === 'fr'
                    ? activeSummaryHadith.translationFr.slice(0, 140) +
                      (activeSummaryHadith.translationFr.length > 140 ? '…' : '')
                    : settings.language === 'ar'
                      ? activeSummaryHadith.matnAr.slice(0, 140) +
                        (activeSummaryHadith.matnAr.length > 140 ? '…' : '')
                      : t.common.translationPreparing
                : getBabDisplayTitle(activeSummaryBab, settings.language)}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {activeSummaryHadith
                ? settings.language === 'tr'
                  ? activeSummaryHadith.lessonsTr[0]
                  : t.common.translationPreparing
                : settings.language === 'tr'
                  ? activeSummaryBab.subtitleTr
                  : t.common.translationPreparing}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              activeSummaryHadith
                ? `/hadisler?bab=${activeSummaryBab.id}&hadith=${activeSummaryHadith.id}`
                : `/hadisler?bab=${activeSummaryBab.id}`
            )
          }
          className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shrink-0 hover:bg-[var(--accent-navy-hover)] cursor-pointer"
        >
          <span>
            {activeSummaryHadith
              ? `#${activeSummaryHadith.id} · ${t.mindMap.openBabHadiths}`
              : `${activeSummaryBab.numberLabel} · ${t.mindMap.openBabHadiths}`}
          </span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
        </button>
      </div>
    </ManuscriptCard>
  );
};

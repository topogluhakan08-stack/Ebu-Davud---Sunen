import React, { useEffect, useMemo, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpDown,
  BookOpenCheck,
  Expand,
  ExternalLink,
  Minimize2,
  RotateCcw,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import hadislerRaw from '../../data/hadisler.json';
import { useApp } from '../../context/AppContext';
import type { HadithItem, IsnadNode, IsnadTreeNode } from '../../types';
import { buildIsnadTree, findHadithsByNarrator } from '../../utils/isnadTree';
import {
  formatTabakaLabel,
  getLocalizedBranchLabel,
  getLocalizedCautionReason,
  getLocalizedIsnadUi,
  getLocalizedNarratorBio,
  getLocalizedNarratorDisplayName,
  getLocalizedNarratorLayer,
} from '../../utils/lexiconTranslations';

const ALL_HADITHS = hadislerRaw as HadithItem[];

interface IsnadFlowChartProps {
  hadithId?: number;
  nodes: IsnadNode[];
  isnadAr: string;
  highlightedChainNodeId?: string | null;
  onJumpToHadith?: (hadithId: number, babId: number) => void;
}

const LAYER_COLORS: Record<
  IsnadNode['layer'],
  {
    label: string;
    bandLight: string;
    bandDark: string;
    fillLight: string;
    fillDark: string;
    strokeLight: string;
    strokeDark: string;
    textLight: string;
    textDark: string;
  }
> = {
  prophet: {
    label: 'Kaynak · Nübüvvet',
    bandLight: 'rgba(184, 134, 45, 0.08)',
    bandDark: 'rgba(212, 168, 83, 0.08)',
    fillLight: '#FDF6E3',
    fillDark: '#362A14',
    strokeLight: '#B8862D',
    strokeDark: '#D4A853',
    textLight: '#6F4A08',
    textDark: '#FCD34D',
  },
  sahabi: {
    label: 'Sahâbî Tabakası',
    bandLight: 'rgba(15, 81, 50, 0.06)',
    bandDark: 'rgba(52, 211, 153, 0.06)',
    fillLight: '#ECF7F0',
    fillDark: '#102C20',
    strokeLight: '#0F5132',
    strokeDark: '#34D399',
    textLight: '#0F5132',
    textDark: '#6EE7B7',
  },
  tabiin: {
    label: 'Tâbiîn Tabakası',
    bandLight: 'rgba(120, 113, 108, 0.04)',
    bandDark: 'rgba(168, 162, 158, 0.04)',
    fillLight: '#FAF7F0',
    fillDark: '#1F1B18',
    strokeLight: '#9A8C78',
    strokeDark: '#78716C',
    textLight: '#1C1917',
    textDark: '#F5F5F4',
  },
  etba: {
    label: 'Etbâü’t-Tâbiîn / Şeyh',
    bandLight: 'rgba(29, 78, 137, 0.05)',
    bandDark: 'rgba(96, 165, 250, 0.05)',
    fillLight: '#F2F6FC',
    fillDark: '#152238',
    strokeLight: '#5C7AA3',
    strokeDark: '#60A5FA',
    textLight: '#1D4E89',
    textDark: '#BFDBFE',
  },
  musannif: {
    label: 'Musannif (Ebû Dâvûd)',
    bandLight: 'rgba(29, 78, 137, 0.09)',
    bandDark: 'rgba(96, 165, 250, 0.1)',
    fillLight: '#E8EFF9',
    fillDark: '#132744',
    strokeLight: '#1D4E89',
    strokeDark: '#60A5FA',
    textLight: '#1D4E89',
    textDark: '#93C5FD',
  },
};

export const IsnadFlowChart: React.FC<IsnadFlowChartProps> = ({
  hadithId = 0,
  nodes,
  isnadAr,
  highlightedChainNodeId = null,
  onJumpToHadith,
}) => {
  const { settings, t, glossaryPack } = useApp();
  const navigate = useNavigate();
  const isDark = settings.theme === 'dark';
  const ui = getLocalizedIsnadUi(settings.language, glossaryPack);

  const [direction, setDirection] = useState<'prophet_to_musannif' | 'musannif_to_prophet'>(
    'prophet_to_musannif'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomLayerRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const tree = useMemo(
    () => buildIsnadTree({ id: hadithId, isnadChain: nodes, isnadAr }),
    [hadithId, nodes, isnadAr]
  );

  // Sync highlighted node when jumped from tab 1 word card
  useEffect(() => {
    if (!highlightedChainNodeId) return;
    const match = tree.nodes.find((n) => n.sourceChainNodeId === highlightedChainNodeId);
    if (match) {
      setSelectedNodeId(match.id);
    }
  }, [highlightedChainNodeId, tree.nodes]);

  const selectedNode: IsnadTreeNode | undefined = useMemo(
    () => tree.nodes.find((n) => n.id === selectedNodeId),
    [tree.nodes, selectedNodeId]
  );

  const otherHadiths = useMemo(() => {
    if (!selectedNode) return [];
    return findHadithsByNarrator(selectedNode, ALL_HADITHS, hadithId);
  }, [selectedNode, hadithId]);

  // Compute deterministic coordinates per layer & branch
  const layout = useMemo(() => {
    const maxLayerOrder = Math.max(...tree.nodes.map((n) => n.layerOrder), 0);
    const maxBranches = Math.max(...tree.nodes.map((n) => n.branchCount), 1);

    const leftGutter = 152;
    const canvasWidth = Math.max(760, leftGutter + maxBranches * 265 + 40);
    const rowHeight = 112;
    const topPadding = 32;
    const canvasHeight = (maxLayerOrder + 1) * rowHeight + topPadding + 32;

    const getVisualRow = (layerOrder: number) =>
      direction === 'prophet_to_musannif' ? layerOrder : maxLayerOrder - layerOrder;

    const positions = new Map<string, { x: number; y: number; w: number; h: number; row: number }>();
    const contentCenterX = leftGutter + (canvasWidth - leftGutter) / 2;

    for (const node of tree.nodes) {
      const row = getVisualRow(node.layerOrder);
      const y = topPadding + row * rowHeight + rowHeight / 2;
      const spread = node.branchCount === 1 ? 0 : node.branchCount === 2 ? 250 : 215;
      const xOffset = (node.branchIndex - (node.branchCount - 1) / 2) * spread;
      const x = contentCenterX + xOffset;
      const pillWidth = node.branchCount > 1 ? 210 : 264;
      const pillHeight = 56;
      positions.set(node.id, { x, y, w: pillWidth, h: pillHeight, row });
    }

    // Group row metadata for left-side numbered layer bands
    const rowBands = Array.from({ length: maxLayerOrder + 1 }, (_, visualRow) => {
      const sampleNode = tree.nodes.find((n) => getVisualRow(n.layerOrder) === visualRow);
      const layer = sampleNode?.layer || 'tabiin';
      const yTop = topPadding + visualRow * rowHeight;
      return {
        visualRow,
        tabakaNumber: visualRow + 1,
        layer,
        label: getLocalizedNarratorLayer(layer, settings.language, glossaryPack),
        yTop,
        height: rowHeight,
      };
    });

    return {
      canvasWidth,
      canvasHeight,
      leftGutter,
      positions,
      rowBands,
    };
  }, [tree.nodes, direction, settings.language, glossaryPack]);

  // Attach d3-zoom for smooth drag, wheel & mobile pinch-zoom
  useEffect(() => {
    if (!svgRef.current || !zoomLayerRef.current) return;
    const svgSel = select(svgRef.current);
    const gSel = select(zoomLayerRef.current);

    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.55, 2.2])
      .on('zoom', (event) => {
        gSel.attr('transform', event.transform.toString());
      });

    svgSel.call(z);
    svgSel.call(z.transform, zoomIdentity);
    zoomBehaviorRef.current = z;

    return () => {
      svgSel.on('.zoom', null);
    };
  }, [layout.canvasWidth, layout.canvasHeight, isFullscreen]);

  const handleZoomBy = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current).transition().duration(200).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current).transition().duration(240).call(zoomBehaviorRef.current.transform, zoomIdentity);
  };

  const handleJump = (targetHadithId: number, babId: number) => {
    if (onJumpToHadith) {
      onJumpToHadith(targetHadithId, babId);
    } else {
      navigate(`/hadisler?bab=${babId}&hadith=${targetHadithId}`);
    }
  };

  const renderDiagramSurface = () => (
    <div
      className={`rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] overflow-hidden ${
        isFullscreen ? 'flex flex-col h-full' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/80">
        <div className="flex items-center gap-2 min-w-0">
          <Users className="w-4 h-4 text-[var(--accent-navy)] dark:text-[#93b8f9] shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
            {ui.treeTitle} · {tree.nodes.length} {ui.narratorNodeUnit}
          </span>
          {tree.hasBranching && (
            <span className="rounded-md px-2 py-0.5 text-[11px] font-medium bg-[var(--accent-navy-soft)] text-[var(--accent-navy)] dark:text-[#93b8f9]">
              {ui.multiTarikBadge}
            </span>
          )}
          {tree.hasCaution && (
            <span className="rounded-md px-2 py-0.5 text-[11px] font-medium bg-amber-500/15 text-amber-800 dark:text-amber-300 inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
              {ui.cautionBadge}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              setDirection((d) =>
                d === 'prophet_to_musannif' ? 'musannif_to_prophet' : 'prophet_to_musannif'
              )
            }
            className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {direction === 'prophet_to_musannif'
                ? ui.dirProphetToMusannif
                : ui.dirMusannifToProphet}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleZoomBy(1.18)}
            aria-label={ui.zoomInAria}
            className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleZoomBy(0.84)}
            aria-label={ui.zoomOutAria}
            className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label={ui.resetZoomAria}
            className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--accent-navy)] text-white text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-95 cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{ui.collapseBtn}</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{ui.fullscreenBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SVG Classical Tree Canvas */}
      <div
        className={`relative w-full overflow-hidden touch-none select-none bg-[var(--bg-card)] ${
          isFullscreen ? 'flex-1 min-h-0' : 'h-[470px] sm:h-[540px]'
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${layout.canvasWidth} ${layout.canvasHeight}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          role="img"
          aria-label={`#${hadithId || ''} ${ui.treeTitle}`}
        >
          <defs>
            <marker
              id={`arrow-${hadithId}-${isFullscreen ? 'fs' : 'in'}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path
                d="M 1 1 L 9 5 L 1 9 z"
                fill={isDark ? '#A8A29E' : '#645E58'}
              />
            </marker>
            <marker
              id={`arrow-warn-${hadithId}-${isFullscreen ? 'fs' : 'in'}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path
                d="M 1 1 L 9 5 L 1 9 z"
                fill={isDark ? '#FBBF24' : '#B45309'}
              />
            </marker>
          </defs>

          <g ref={zoomLayerRef}>
            {/* Left-numbered Tabaka Horizontal Bands */}
            {layout.rowBands.map((band) => {
              const lc = LAYER_COLORS[band.layer];
              return (
                <g key={band.visualRow}>
                  <rect
                    x={0}
                    y={band.yTop}
                    width={layout.canvasWidth}
                    height={band.height}
                    fill={isDark ? lc.bandDark : lc.bandLight}
                  />
                  <line
                    x1={0}
                    y1={band.yTop + band.height}
                    x2={layout.canvasWidth}
                    y2={band.yTop + band.height}
                    stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(28,25,23,0.06)'}
                    strokeDasharray="3 4"
                  />
                  <line
                    x1={layout.leftGutter}
                    y1={band.yTop}
                    x2={layout.leftGutter}
                    y2={band.yTop + band.height}
                    stroke={isDark ? 'rgba(255,255,255,0.09)' : 'rgba(28,25,23,0.09)'}
                  />
                  <text
                    x={14}
                    y={band.yTop + band.height / 2 - 6}
                    fontSize="11"
                    fontWeight="700"
                    fill={isDark ? lc.textDark : lc.textLight}
                  >
                    {formatTabakaLabel(band.tabakaNumber, settings.language, ui.tabakaSuffix)}
                  </text>
                  <text
                    x={14}
                    y={band.yTop + band.height / 2 + 10}
                    fontSize="10.5"
                    fontWeight="500"
                    fill={isDark ? '#A8A29E' : '#57534E'}
                  >
                    {band.label}
                  </text>
                </g>
              );
            })}

            {/* Directional Curved Edges with Tahammul Formulas */}
            {tree.edges.map((edge) => {
              const fromPos = layout.positions.get(edge.fromId);
              const toPos = layout.positions.get(edge.toId);
              if (!fromPos || !toPos) return null;

              const goingDown = toPos.y >= fromPos.y;
              const startY = goingDown ? fromPos.y + fromPos.h / 2 : fromPos.y - fromPos.h / 2;
              const endY = goingDown ? toPos.y - toPos.h / 2 - 4 : toPos.y + toPos.h / 2 + 4;
              const midY = (startY + endY) / 2;
              const midX = (fromPos.x + toPos.x) / 2;

              const pathD =
                Math.abs(fromPos.x - toPos.x) < 2
                  ? `M ${fromPos.x} ${startY} L ${toPos.x} ${endY}`
                  : `M ${fromPos.x} ${startY} C ${fromPos.x} ${midY}, ${toPos.x} ${midY}, ${toPos.x} ${endY}`;

              const markerId = edge.dashed
                ? `url(#arrow-warn-${hadithId}-${isFullscreen ? 'fs' : 'in'})`
                : `url(#arrow-${hadithId}-${isFullscreen ? 'fs' : 'in'})`;

              return (
                <g key={edge.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      edge.dashed
                        ? isDark
                          ? '#FBBF24'
                          : '#B45309'
                        : isDark
                          ? '#78716C'
                          : '#8C847B'
                    }
                    strokeWidth={edge.dashed ? 1.8 : 1.5}
                    strokeDasharray={edge.dashed ? '5 4' : undefined}
                    markerEnd={goingDown ? markerId : undefined}
                    markerStart={!goingDown ? markerId : undefined}
                  />

                  {/* Arabic Tahammul Badge centered on edge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-36}
                      y={-11}
                      width={72}
                      height={22}
                      rx={11}
                      fill={isDark ? '#181512' : '#FFFFFF'}
                      stroke={
                        edge.dashed
                          ? isDark
                            ? '#FBBF24'
                            : '#B45309'
                          : isDark
                            ? '#44403C'
                            : '#D6D0C4'
                      }
                      strokeWidth={1}
                    />
                    <text
                      x={edge.dashed ? -5 : 0}
                      y={3.5}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="600"
                      className="font-arabic-inline"
                      fill={
                        edge.dashed
                          ? isDark
                            ? '#FCD34D'
                            : '#92400E'
                          : isDark
                            ? '#E7E5E4'
                            : '#1C1917'
                      }
                    >
                      {edge.tahammulAr}
                    </text>
                    {edge.dashed && (
                      <text
                        x={24}
                        y={3.5}
                        textAnchor="middle"
                        fontSize="10"
                        fill={isDark ? '#FBBF24' : '#B45309'}
                      >
                        ⚠
                      </text>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Oval/Rounded Narrator Pills */}
            {tree.nodes.map((node) => {
              const pos = layout.positions.get(node.id);
              if (!pos) return null;
              const lc = LAYER_COLORS[node.layer];
              const isSelected = selectedNodeId === node.id;
              const isProphet = node.layer === 'prophet';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${getLocalizedNarratorDisplayName(node, settings.language)} (${getLocalizedNarratorLayer(node.layer, settings.language, glossaryPack)})`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNodeId(isSelected ? null : node.id);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={-pos.w / 2}
                    y={-pos.h / 2}
                    width={pos.w}
                    height={pos.h}
                    rx={isProphet ? 28 : 24}
                    fill={isDark ? lc.fillDark : lc.fillLight}
                    stroke={
                      isSelected
                        ? '#D4A853'
                        : node.isUncertain
                          ? isDark
                            ? '#FBBF24'
                            : '#B45309'
                          : isDark
                            ? lc.strokeDark
                            : lc.strokeLight
                    }
                    strokeWidth={isSelected ? 2.8 : isProphet ? 2.2 : 1.5}
                    strokeDasharray={node.isUncertain ? '4 3' : undefined}
                  />

                  {node.branchLabel && (
                    <g transform={`translate(${pos.w / 2 - 26}, ${-pos.h / 2})`}>
                      <rect
                        x={-26}
                        y={-9}
                        width={52}
                        height={16}
                        rx={8}
                        fill="#1D4E89"
                      />
                      <text
                        x={0}
                        y={2}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        {getLocalizedBranchLabel(node.branchLabel, settings.language, glossaryPack)}
                      </text>
                    </g>
                  )}

                  {node.isUncertain && (
                    <g transform={`translate(${-pos.w / 2 + 14}, ${-pos.h / 2 + 12})`}>
                      <circle cx={0} cy={0} r={8} fill={isDark ? '#78350F' : '#FEF3C7'} />
                      <text
                        x={0}
                        y={3.5}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill={isDark ? '#FCD34D' : '#92400E'}
                      >
                        !
                      </text>
                    </g>
                  )}

                  <text
                    x={0}
                    y={settings.language === 'ar' ? 5 : -5}
                    textAnchor="middle"
                    fontSize={isProphet ? '14.5' : settings.language === 'ar' ? '14' : '13'}
                    fontWeight="700"
                    className="font-arabic-inline"
                    fill={isDark ? lc.textDark : lc.textLight}
                  >
                    {node.nameAr.length > 34 ? `${node.nameAr.slice(0, 32)}…` : node.nameAr}
                  </text>
                  {settings.language !== 'ar' && (() => {
                    const displayName = getLocalizedNarratorDisplayName(node, settings.language);
                    return (
                      <text
                        x={0}
                        y={15}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                        fill={isDark ? '#E7E5E4' : '#292524'}
                      >
                        {displayName.length > 32 ? `${displayName.slice(0, 30)}…` : displayName}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>

        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="rounded-lg bg-[var(--bg-card)]/90 px-2.5 py-1 border border-[var(--border-hairline)]">
            {ui.dragHint}
          </span>
        </div>
      </div>

      {/* Selected Narrator Detail Card */}
      {selectedNode && (
        <div className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]/85 p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--accent-navy)] dark:text-[#93b8f9]">
                  {getLocalizedNarratorLayer(selectedNode.layer, settings.language, glossaryPack)}
                </span>
                {selectedNode.isUncertain && selectedNode.uncertainReason && (
                  <span className="rounded-lg px-2 py-0.5 text-[11px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    {getLocalizedCautionReason(
                      selectedNode.uncertainReason,
                      settings.language,
                      glossaryPack
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-baseline gap-2.5 pt-0.5">
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  {getLocalizedNarratorDisplayName(selectedNode, settings.language)}
                </h4>
                {settings.language !== 'ar' && (
                  <span className="font-arabic-inline text-lg font-bold text-[var(--accent-navy)] dark:text-[#93b8f9]">
                    {selectedNode.nameAr}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              aria-label={ui.closeNarratorAria}
              className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{ui.closeBtn}</span>
            </button>
          </div>

          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <span className="font-semibold text-[var(--text-primary)]">{ui.whoIsLabel} </span>
            {getLocalizedNarratorBio(
              selectedNode.bioTr,
              settings.language,
              glossaryPack,
              t.common.translationPreparing
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {ui.otherHadithsPrefix} ({otherHadiths.length} {ui.otherHadithsUnit})
            </p>
            {otherHadiths.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">{ui.noOtherHadiths}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {otherHadiths.slice(0, 18).map((ref) => (
                  <button
                    key={ref.hadithId}
                    type="button"
                    onClick={() => handleJump(ref.hadithId, ref.babId)}
                    className="min-h-[30px] px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--accent-navy)] text-xs font-medium font-tabular text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>#{ref.hadithId}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </button>
                ))}
                {otherHadiths.length > 18 && (
                  <span className="text-xs text-[var(--text-muted)] self-center px-1">
                    +{otherHadiths.length - 18} {ui.moreHadithsSuffix}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
          <BookOpenCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{ui.fullArabicIsnadHeader}</span>
        </div>
        <p className="font-arabic text-lg sm:text-xl leading-loose text-[var(--text-primary)]" dir="rtl">
          {isnadAr}
        </p>
      </div>

      {isFullscreen ? (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm p-2 sm:p-6 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={ui.fullscreenDialogAria}
        >
          <div className="w-full h-full max-w-6xl mx-auto">{renderDiagramSurface()}</div>
        </div>
      ) : (
        renderDiagramSurface()
      )}
    </div>
  );
};

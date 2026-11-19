import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { NetworkLink, NetworkNode } from '../../types';
import { useApp } from '../../context/AppContext';
import { ManuscriptCard } from '../ui/Card';
import { SpeechControls } from '../tts/SpeechControls';
import { getLocalizedEbuDavudUi } from '../../utils/articleTranslations';

interface TeacherStudentGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

type CategoryFilter = 'all' | 'fiqh_master' | 'teacher' | 'family' | 'student';

export const TeacherStudentGraph: React.FC<TeacherStudentGraphProps> = ({ nodes, links }) => {
  const { settings, articlePack } = useApp();
  const isDark = settings.theme === 'dark';
  const ui = getLocalizedEbuDavudUi(settings.language, articlePack).networkGraph;

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ebu-davud');

  const categoryColors: Record<NetworkNode['category'], string> = {
    center: isDark ? '#D9AD5B' : '#B8862D',
    fiqh_master: isDark ? '#5A8BE0' : '#14284B',
    teacher: isDark ? '#38B87E' : '#0F5132',
    family: isDark ? '#A78BFA' : '#6D28D9',
    student: isDark ? '#E09250' : '#A0522D',
  };

  const categoryLabels = ui.categories;

  const visibleNodes = useMemo(() => {
    if (filter === 'all') return nodes;
    return nodes.filter((n) => n.category === 'center' || n.category === filter);
  }, [nodes, filter]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const visibleLinks = useMemo(
    () => links.filter((l) => visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target)),
    [links, visibleNodeIds]
  );

  // Deterministic radial geometry with D3 scaleLinear so nodes and labels never overlap
  const positionedNodes = useMemo(() => {
    const centerX = 490;
    const centerY = 290;

    const ringGroups: {
      ids: string[];
      radiusX: number;
      radiusY: number;
      startAngle: number;
      endAngle: number;
    }[] = [
      {
        // Upper arc: teachers & masters
        ids: visibleNodes
          .filter((n) => n.category === 'fiqh_master' || n.category === 'teacher')
          .map((n) => n.id),
        radiusX: 250,
        radiusY: 180,
        startAngle: -Math.PI * 0.94,
        endAngle: -Math.PI * 0.06,
      },
      {
        // Lower arc: family & students
        ids: visibleNodes
          .filter((n) => n.category === 'family' || n.category === 'student')
          .map((n) => n.id),
        radiusX: 245,
        radiusY: 170,
        startAngle: Math.PI * 0.14,
        endAngle: Math.PI * 0.86,
      },
    ];

    const coords: Record<
      string,
      {
        x: number;
        y: number;
        labelDx: number;
        labelDy: number;
        textAnchor: 'start' | 'middle' | 'end';
      }
    > = {
      'ebu-davud': {
        x: centerX,
        y: centerY,
        labelDx: 0,
        labelDy: 52,
        textAnchor: 'middle',
      },
    };

    ringGroups.forEach((group) => {
      const count = group.ids.length;
      if (count === 0) return;
      const mid = (group.startAngle + group.endAngle) / 2;
      const angleScale = d3
        .scaleLinear()
        .domain([0, Math.max(1, count - 1)])
        .range(count === 1 ? [mid, mid] : [group.startAngle, group.endAngle]);

      group.ids.forEach((id, idx) => {
        const angle = angleScale(idx);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        if (cos > 0.15) textAnchor = 'start';
        else if (cos < -0.15) textAnchor = 'end';

        const labelDx = cos > 0.15 ? 20 : cos < -0.15 ? -20 : 0;
        const labelDy = sin < -0.2 ? -22 : sin > 0.2 ? 28 : 4;

        coords[id] = {
          x: centerX + cos * group.radiusX,
          y: centerY + sin * group.radiusY,
          labelDx,
          labelDy,
          textAnchor,
        };
      });
    });

    return coords;
  }, [visibleNodes]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const selectedRelations = useMemo(
    () =>
      links.filter((l) => l.source === selectedNode.id || l.target === selectedNode.id),
    [links, selectedNode]
  );

  const filterButtons: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: ui.filterAll },
    { id: 'fiqh_master', label: ui.filterMasters },
    { id: 'teacher', label: ui.filterTeachers },
    { id: 'family', label: ui.filterFamily },
    { id: 'student', label: ui.filterStudents },
  ];

  const selectedNarration = `${selectedNode.label}. ${selectedNode.roleTr}. ${selectedNode.detailTr}`;

  return (
    <div className="space-y-5">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilter(btn.id)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === btn.id
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Canvas + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div
          dir="ltr"
          className="lg:col-span-8 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 overflow-x-auto"
        >
          <svg
            viewBox="0 0 980 580"
            className="w-full min-w-[660px] h-auto select-none"
            role="img"
            aria-label={ui.svgAria}
          >
            {/* Ring guide ellipse */}
            <ellipse
              cx={490}
              cy={290}
              rx={248}
              ry={176}
              fill="none"
              stroke="var(--border-hairline)"
              strokeDasharray="4 5"
              strokeWidth={1.2}
            />

            {/* Edges */}
            {visibleLinks.map((link) => {
              const p1 = positionedNodes[link.source];
              const p2 = positionedNodes[link.target];
              if (!p1 || !p2) return null;
              const isHighlighted =
                link.source === selectedNode.id || link.target === selectedNode.id;
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlighted ? 'var(--accent-gold)' : 'var(--border-strong)'}
                  strokeWidth={isHighlighted ? 2.4 : 1.3}
                  strokeOpacity={isHighlighted ? 0.95 : 0.65}
                />
              );
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const pos = positionedNodes[node.id];
              if (!pos) return null;
              const isCenter = node.category === 'center';
              const isSelected = node.id === selectedNode.id;
              const color = categoryColors[node.category];
              const r = isCenter ? 32 : 15;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedNodeId(node.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label} - ${node.roleTr}`}
                  className="cursor-pointer focus:outline-none"
                >
                  {isSelected && (
                    <circle
                      r={r + 6}
                      fill="none"
                      stroke="var(--accent-gold)"
                      strokeWidth={2.2}
                    />
                  )}
                  <circle
                    r={r}
                    fill={color}
                    stroke="var(--bg-card)"
                    strokeWidth={2.5}
                  />
                  {isCenter && (
                    <text
                      y={4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={12}
                      fontWeight={700}
                    >
                      {ui.centerInitials}
                    </text>
                  )}
                  <text
                    x={pos.labelDx}
                    y={pos.labelDy}
                    textAnchor={pos.textAnchor}
                    fill="var(--text-primary)"
                    fontSize={isCenter ? 13.5 : 11.5}
                    fontWeight={isSelected || isCenter ? 700 : 500}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details */}
        <ManuscriptCard
          accentColor={categoryColors[selectedNode.category]}
          className="lg:col-span-4 p-6 flex flex-col justify-between gap-5"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                {categoryLabels[selectedNode.category]}
                {selectedNode.city ? ` · ${selectedNode.city}` : ''}
              </p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {selectedNode.label}
              </h3>
              {selectedNode.nameAr && settings.language !== 'ar' && (
                <p
                  className="font-arabic-inline text-xl text-[var(--accent-navy)] dark:text-[var(--accent-gold)] mt-1"
                  dir="rtl"
                >
                  {selectedNode.nameAr}
                </p>
              )}
            </div>

            <p className="text-xs font-semibold text-[var(--accent-emerald)]">
              {selectedNode.roleTr}
            </p>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {selectedNode.detailTr}
            </p>

            {selectedRelations.length > 0 && (
              <div className="pt-3 border-t border-[var(--border-hairline)] space-y-1.5">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {ui.connectionsHeading} ({selectedRelations.length})
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1 text-xs text-[var(--text-secondary)]">
                  {selectedRelations.slice(0, 6).map((rel) => {
                    const otherId =
                      rel.source === selectedNode.id ? rel.target : rel.source;
                    const other = nodes.find((n) => n.id === otherId);
                    return (
                      <button
                        key={`${rel.source}-${rel.target}`}
                        type="button"
                        onClick={() => setSelectedNodeId(otherId)}
                        className="block w-full text-start py-1 hover:text-[var(--text-primary)] underline-offset-2 hover:underline cursor-pointer"
                      >
                        {other?.label} — {rel.relationTr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-hairline)]">
            <SpeechControls
              id={`network-${selectedNode.id}`}
              compact
              arabicText={settings.language === 'ar' ? selectedNarration : undefined}
              primaryText={settings.language === 'ar' ? undefined : selectedNarration}
            />
          </div>
        </ManuscriptCard>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { Award, Flame, RotateCcw, Sparkles, Target, AlertTriangle } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BABS } from '../../data/babs';
import { QUESTION_BANK, type QuizBankItem } from '../../data/questionBank';
import { useApp } from '../../context/AppContext';
import { ManuscriptCard } from '../ui/Card';
import {
  BADGE_DEFS,
  getLevelForXp,
  type GamificationState,
  type SrsProgressMap,
} from '../../utils/learnEngine';
import { getLocalizedBab } from '../../utils/hadithTranslations';
import {
  getLocalizedBadge,
  getLocalizedLearnUi,
  getLocalizedLevelTitle,
} from '../../utils/learnTranslations';
import { formatLocaleNumber } from '../../utils/articleTranslations';

interface MasteryDashboardProps {
  gamification: GamificationState;
  srsMap: SrsProgressMap;
  totalSrsCards: number;
  questionBank?: QuizBankItem[];
  onStartMistakePractice: () => void;
  onResetGamification: () => void;
}

export const MasteryDashboard: React.FC<MasteryDashboardProps> = ({
  gamification,
  srsMap,
  totalSrsCards,
  questionBank = QUESTION_BANK,
  onStartMistakePractice,
  onResetGamification,
}) => {
  const { settings, progress, hadithPack, learnPack } = useApp();
  const lang = settings.language;
  const ui = getLocalizedLearnUi(lang, learnPack).mastery;
  const [confirmReset, setConfirmReset] = useState(false);

  const levelInfo = useMemo(() => getLevelForXp(gamification.xp), [gamification.xp]);
  const levelTitle = getLocalizedLevelTitle(levelInfo.current.level, lang, learnPack);
  const accuracy =
    gamification.totalAnswered > 0
      ? Math.round((gamification.totalCorrect / gamification.totalAnswered) * 100)
      : 0;

  const srsStats = useMemo(() => {
    const entries = Object.values(srsMap);
    const mastered = entries.filter((c) => c.intervalDays >= 6).length;
    const due = entries.filter((c) => c.dueAt <= Date.now()).length;
    return { reviewed: entries.length, mastered, due };
  }, [srsMap]);

  const babChartData = useMemo(() => {
    return BABS.map((bab) => {
      const locBab = getLocalizedBab(bab, lang, hadithPack);
      const ids: number[] = [];
      for (let h = bab.hadithStart; h <= bab.hadithEnd; h++) ids.push(h);
      const readCount = ids.filter((id) => progress.readHadiths.includes(id)).length;
      const listenedCount = ids.filter((id) => progress.listenedHadiths.includes(id)).length;
      const memCount = ids.filter((id) => progress.memorizedHadiths.includes(id)).length;
      const quizStat = gamification.babStats[bab.id] || { answered: 0, correct: 0 };
      const quizPct = quizStat.answered > 0 ? (quizStat.correct / quizStat.answered) * 100 : 0;

      const studyPct =
        ids.length > 0
          ? ((readCount * 0.4 + listenedCount * 0.3 + memCount * 0.3) / ids.length) * 100
          : 0;
      const combined =
        quizStat.answered > 0
          ? Math.round(studyPct * 0.45 + quizPct * 0.55)
          : Math.round(studyPct);

      return {
        babId: bab.id,
        short: `${ui.chartBabPrefix} ${bab.id}`,
        title: locBab.title,
        score: combined,
        read: readCount,
        total: ids.length,
        quizCorrect: quizStat.correct,
        quizAnswered: quizStat.answered,
        color: bab.colorHex,
      };
    });
  }, [progress, gamification.babStats, lang, hadithPack, ui.chartBabPrefix]);

  const mistakeQuestions = useMemo(() => {
    const map = new Map(questionBank.map((q) => [q.id, q]));
    return gamification.mistakeIds
      .map((id) => map.get(id))
      .filter((q): q is QuizBankItem => Boolean(q));
  }, [gamification.mistakeIds, questionBank]);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{ui.kpiTotalXp}</span>
            <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-tabular text-[var(--text-primary)]">
            {formatLocaleNumber(gamification.xp, lang)} {ui.xpUnit}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">{levelTitle}</div>
          <div className="h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-gold)]"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
        </ManuscriptCard>

        <ManuscriptCard accentColor="#A84A2C" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{ui.kpiDailyGoal}</span>
            <Flame className="w-4 h-4 text-[#A84A2C]" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-tabular text-[var(--text-primary)]">
            {gamification.todayXp}/{gamification.dailyGoalXp} {ui.xpUnit}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {gamification.streakDays} {ui.kpiStreakUnit}
          </div>
        </ManuscriptCard>

        <ManuscriptCard accentColor="#2E6B5E" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{ui.kpiAccuracy}</span>
            <Target className="w-4 h-4 text-[#2E6B5E]" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-tabular text-[var(--text-primary)]">
            {accuracy}%
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {gamification.totalCorrect}/{gamification.totalAnswered} {ui.kpiCorrectUnit}
          </div>
        </ManuscriptCard>

        <ManuscriptCard accentColor="var(--accent-navy)" className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{ui.kpiSrsCards}</span>
            <Award className="w-4 h-4 text-[var(--accent-navy)] dark:text-[#93b8f9]" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold font-tabular text-[var(--text-primary)]">
            {srsStats.reviewed}/{totalSrsCards}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {srsStats.mastered} {ui.kpiMasteredUnit} · {srsStats.due} {ui.kpiDueUnit}
          </div>
        </ManuscriptCard>
      </div>

      {/* 11-Bab Mastery Chart */}
      <ManuscriptCard className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
              {ui.chartHeading}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">{ui.chartSubtitle}</p>
          </div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-muted)] hover:text-[#A03848] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{ui.resetProgressBtn}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onResetGamification();
                setConfirmReset(false);
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#A03848] text-white text-xs font-semibold cursor-pointer"
            >
              {ui.resetConfirmBtn}
            </button>
          )}
        </div>

        <div className="h-[260px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={babChartData} margin={{ top: 10, right: 12, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-hairline)" vertical={false} />
              <XAxis dataKey="short" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-hairline)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
                formatter={(value) => [`${value ?? 0}%`, ui.chartScoreLabel]}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload;
                  return row ? `${row.short}: ${row.title} (${row.read}/${row.total} ${ui.chartHadithsUnit})` : '';
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={38}>
                {babChartData.map((entry) => (
                  <Cell key={entry.babId} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ManuscriptCard>

      {/* Badges & Mistake Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Badges */}
        <ManuscriptCard className="p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)]">
              {ui.badgesHeading}
            </h3>
            <span className="text-xs font-tabular font-semibold text-[var(--accent-gold)]">
              {gamification.unlockedBadges.length}/{BADGE_DEFS.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BADGE_DEFS.map((b) => {
              const unlocked = gamification.unlockedBadges.includes(b.id);
              const locBadge = getLocalizedBadge(b.id, lang, learnPack);
              return (
                <div
                  key={b.id}
                  className={`rounded-xl border p-3 transition-opacity ${
                    unlocked
                      ? 'bg-[var(--accent-gold-soft)]/50 border-[var(--accent-gold)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award
                      className={`w-4 h-4 shrink-0 ${
                        unlocked ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {locBadge.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                    {locBadge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </ManuscriptCard>

        {/* Mistake Notebook */}
        <ManuscriptCard className="p-5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-editorial text-lg font-bold text-[var(--text-primary)] inline-flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#A03848]" aria-hidden="true" />
              <span>
                {ui.mistakesHeading} ({mistakeQuestions.length})
              </span>
            </h3>
            {mistakeQuestions.length > 0 && (
              <button
                type="button"
                onClick={onStartMistakePractice}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#8C3B4A] text-white text-xs font-semibold cursor-pointer"
              >
                {ui.mistakesPracticeBtn}
              </button>
            )}
          </div>

          {mistakeQuestions.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-6 text-center">{ui.mistakesEmpty}</p>
          ) : (
            <ul className="space-y-2 max-h-[310px] overflow-y-auto pe-1">
              {mistakeQuestions.slice(0, 15).map((q) => (
                <li
                  key={q.id}
                  className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
                    <span className="font-semibold text-[#8C3B4A] dark:text-[#f0a5b0]">
                      {q.sourceRef}
                    </span>
                    {q.hadithId && (
                      <span>
                        {ui.hadithPrefix} #{q.hadithId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[var(--text-primary)] leading-snug">
                    {q.prompt}
                  </p>
                </li>
              ))}
              {mistakeQuestions.length > 15 && (
                <li className="text-center text-[11px] text-[var(--text-muted)] py-1">
                  +{mistakeQuestions.length - 15} {ui.mistakesMoreSuffix}
                </li>
              )}
            </ul>
          )}
        </ManuscriptCard>
      </div>
    </div>
  );
};

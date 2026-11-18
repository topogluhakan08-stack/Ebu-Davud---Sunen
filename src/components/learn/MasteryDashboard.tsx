import React from 'react';
import {
  Award,
  BookOpen,
  Flame,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BABS } from '../../data/babs';
import { QUESTION_BANK, type QuizBankItem } from '../../data/questionBank';
import {
  BADGE_DEFS,
  getLevelForXp,
  type GamificationState,
} from '../../utils/learnEngine';
import { ManuscriptCard } from '../ui/Card';

interface MasteryDashboardProps {
  gamification: GamificationState;
  onStartMistakePractice: () => void;
  onResetGamification?: () => void;
}

export const MasteryDashboard: React.FC<MasteryDashboardProps> = ({
  gamification,
  onStartMistakePractice,
  onResetGamification,
}) => {
  const levelInfo = getLevelForXp(gamification.xp);
  const dailyPct = Math.min(
    100,
    Math.round((gamification.todayXp / Math.max(1, gamification.dailyGoalXp)) * 100)
  );

  const chartData = BABS.map((bab) => {
    const stat = gamification.babStats[bab.id] ?? { answered: 0, correct: 0 };
    const accuracy =
      stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
    return {
      name: `Bab ${bab.id}`,
      title: bab.titleTr,
      answered: stat.answered,
      correct: stat.correct,
      accuracy,
    };
  });

  const mistakeQuestions: QuizBankItem[] = gamification.mistakeIds
    .map((id) => QUESTION_BANK.find((q) => q.id === id))
    .filter((q): q is QuizBankItem => Boolean(q));

  return (
    <section aria-label="İlerleme, Rozetler, Bab Hâkimiyeti ve Yanlış Defteri" className="space-y-6">
      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span>RÜTBE & XP</span>
            <Trophy className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            Sv. {levelInfo.current.level} · {levelInfo.current.titleTr}
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-gold)] rounded-full transition-all"
              style={{ width: `${levelInfo.progressPct}%` }}
            />
          </div>
          <p className="text-[11px] font-tabular text-[var(--text-muted)]">
            {gamification.xp} XP
            {levelInfo.next ? ` · Sonraki: ${levelInfo.next.minXp} XP` : ' · En Üst Seviye'}
          </p>
        </ManuscriptCard>

        <ManuscriptCard accentColor="var(--accent-emerald)" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span>GÜNLÜK HEDEF</span>
            <Target className="w-4 h-4 text-[var(--accent-emerald)]" aria-hidden="true" />
          </div>
          <div className="text-lg font-bold font-tabular text-[var(--text-primary)]">
            {gamification.todayXp} / {gamification.dailyGoalXp} XP
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-emerald)] rounded-full transition-all"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Tamamlanan: %{dailyPct}
          </p>
        </ManuscriptCard>

        <ManuscriptCard accentColor="#A64B2A" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span>SERİ & EN İYİ KOMBO</span>
            <Flame className="w-4 h-4 text-[#A64B2A] dark:text-[#FB923C]" aria-hidden="true" />
          </div>
          <div className="text-lg font-bold font-tabular text-[var(--text-primary)]">
            {gamification.streakDays} Gün · {gamification.bestCombo}x Seri
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Toplam {gamification.completedSessions} oturum tamamlandı
          </p>
        </ManuscriptCard>

        <ManuscriptCard accentColor="var(--accent-navy)" className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
            <span>GENEL İSABET</span>
            <BookOpen className="w-4 h-4 text-[var(--accent-navy)] dark:text-[#93b8f9]" aria-hidden="true" />
          </div>
          <div className="text-lg font-bold font-tabular text-[var(--text-primary)]">
            {gamification.totalAnswered > 0
              ? `%${Math.round((gamification.totalCorrect / gamification.totalAnswered) * 100)}`
              : '%0'}
          </div>
          <p className="text-[11px] font-tabular text-[var(--text-muted)]">
            {gamification.totalCorrect} doğru / {gamification.totalAnswered} soru
          </p>
        </ManuscriptCard>
      </div>

      {/* 11-Bab Mastery Chart */}
      <ManuscriptCard className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              11 Bab Hâkimiyet Grafiği
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Her babtan çözülen soru sayısına göre doğruluk yüzdesi (%)
            </p>
          </div>
          {onResetGamification && (
            <button
              type="button"
              onClick={onResetGamification}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>İstatistikleri Sıfırla</span>
            </button>
          )}
        </div>

        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(value: unknown, _name: unknown, props: { payload?: { answered?: number; correct?: number; title?: string } }) => [
                  `%${value} (${props.payload?.correct ?? 0}/${props.payload?.answered ?? 0})`,
                  props.payload?.title ?? 'Başarı',
                ]}
              />
              <Bar dataKey="accuracy" name="Başarı" fill="#1D4E89" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ManuscriptCard>

      {/* Badges & Mistake Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <ManuscriptCard className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent-gold)]" aria-hidden="true" />
              <span>Kazanılan Rozetler ({gamification.unlockedBadges.length}/{BADGE_DEFS.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BADGE_DEFS.map((b) => {
              const unlocked = gamification.unlockedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    unlocked
                      ? 'bg-[var(--accent-gold-soft)]/70 border-[var(--accent-gold)]'
                      : 'bg-[var(--bg-surface)]/60 border-[var(--border-hairline)] opacity-60'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {unlocked ? '★ ' : '○ '}
                    {b.titleTr}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{b.descTr}</div>
                </div>
              );
            })}
          </div>
        </ManuscriptCard>

        {/* Mistake Notebook (Tekrar Listesi) */}
        <ManuscriptCard className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                Tekrar Listesi ({mistakeQuestions.length})
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Yanlış yapılan sorular otomatik kaydedilir; doğru çözülünce listeden düşer.
              </p>
            </div>
            {mistakeQuestions.length > 0 && (
              <button
                type="button"
                onClick={onStartMistakePractice}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer hover:opacity-95"
              >
                Sadece Yanlışlarımı Çalış
              </button>
            )}
          </div>

          {mistakeQuestions.length === 0 ? (
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 text-center text-xs sm:text-sm text-[var(--text-secondary)]">
              Harika! Şu anda tekrar listenizde bekleyen yanlış soru bulunmuyor.
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {mistakeQuestions.map((mq) => (
                <div
                  key={mq.id}
                  className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3 space-y-1 text-xs"
                >
                  <div className="font-semibold text-[var(--text-primary)]">{mq.prompt}</div>
                  <div className="text-[11px] text-[var(--accent-emerald)]">
                    Doğru Bilgi: {mq.explanation}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">{mq.sourceRef}</div>
                </div>
              ))}
            </div>
          )}
        </ManuscriptCard>
      </div>
    </section>
  );
};

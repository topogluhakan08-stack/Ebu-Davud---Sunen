import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  getQuestionBankStats,
  QUESTION_BANK,
  type QuestionCategory,
  type QuestionGameType,
  type QuizBankItem,
} from '../../data/questionBank';
import { useSpeech } from '../../hooks/useSpeech';
import {
  BADGE_DEFS,
  finalizeQuizSession,
  getLevelForXp,
  recordQuizOutcome,
  selectQuizSession,
  type GamificationState,
  type SessionLengthOption,
} from '../../utils/learnEngine';
import { ManuscriptCard } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { CityMapQuestion } from './CityMapQuestion';

interface QuizArenaProps {
  gamification: GamificationState;
  onGamificationChange: (next: GamificationState) => void;
  externalMistakesOnlyTrigger?: number;
}

const CATEGORY_TABS: Array<{ id: QuestionCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Tümü' },
  { id: 'hadisler', label: '38 Hadis' },
  { id: 'ebu_davud', label: 'Ebû Dâvûd TDV' },
  { id: 'sunen', label: 'es-Sünen TDV' },
  { id: 'sozluk', label: 'Usûl Sözlüğü' },
  { id: 'bab_temalari', label: 'Bab Temaları' },
];

const GAME_TYPE_LABELS: Array<{ id: QuestionGameType | 'all'; label: string }> = [
  { id: 'all', label: 'Karışık (9 Tür)' },
  { id: 'multiple_choice', label: 'Çoktan Seçmeli' },
  { id: 'arabic_blank', label: 'Arapça Boşluk' },
  { id: 'matching', label: 'Eşleştirme' },
  { id: 'word_order', label: 'Kelime Sıralama' },
  { id: 'isnad_order', label: 'İsnad Sıralama' },
  { id: 'which_bab', label: 'Hangi Babta?' },
  { id: 'audio_listening', label: 'Sesli Dinleme' },
  { id: 'true_false', label: 'Doğru / Yanlış' },
  { id: 'city_map', label: '14 Şehir Haritası' },
];

const LENGTH_OPTIONS: Array<{ value: SessionLengthOption; label: string }> = [
  { value: 10, label: '10 Soru' },
  { value: 20, label: '20 Soru' },
  { value: 50, label: '50 Soru' },
  { value: 'all', label: 'Tümü' },
];

function deterministicShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  gamification,
  onGamificationChange,
  externalMistakesOnlyTrigger = 0,
}) => {
  const { speak } = useSpeech();
  const bankStats = useMemo(() => getQuestionBankStats(), []);

  // Session Config
  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [gameType, setGameType] = useState<QuestionGameType | 'all'>('all');
  const [lengthOpt, setLengthOpt] = useState<SessionLengthOption>(10);
  const [timedMode, setTimedMode] = useState(false);
  const [mistakesOnly, setMistakesOnly] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(1);

  // Active Question State
  const [qIndex, setQIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  // Matching State
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [matchMistakesCount, setMatchMistakesCount] = useState(0);

  // Ordering State (word_order & isnad_order)
  const [orderSelected, setOrderSelected] = useState<string[]>([]);
  const [isnadDraft, setIsnadDraft] = useState<string[]>([]);

  // Gamification / Session Metrics
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxComboSession, setMaxComboSession] = useState(0);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [sessionBadges, setSessionBadges] = useState<string[]>([]);
  const [sessionFinalized, setSessionFinalized] = useState(false);

  // Snapshot mistake IDs at session start so answering mistakes removes them from state without mutating active session array
  const [sessionMistakeIdsSnapshot, setSessionMistakeIdsSnapshot] = useState<string[]>(
    gamification.mistakeIds
  );

  const sessionQuestions = useMemo(
    () =>
      selectQuizSession(QUESTION_BANK, {
        category,
        gameType,
        length: lengthOpt,
        mistakesOnly,
        mistakeIds: sessionMistakeIdsSnapshot,
        seed: sessionSeed,
      }),
    [category, gameType, lengthOpt, mistakesOnly, sessionMistakeIdsSnapshot, sessionSeed]
  );

  const currentQuestion: QuizBankItem | undefined = sessionQuestions[qIndex];
  const isFinished =
    sessionQuestions.length > 0 &&
    (qIndex >= sessionQuestions.length || (timedMode && lives <= 0));

  const resetQuestionUiState = (q: QuizBankItem | undefined, seedOffset: number) => {
    setHasAnswered(false);
    setIsCurrentCorrect(false);
    setSelectedChoiceIdx(null);
    setSelectedBool(null);
    setSelectedCityId(null);
    setMatchSelectedLeft(null);
    setMatchedPairs({});
    setMatchMistakesCount(0);
    setOrderSelected([]);
    setHintRevealed(false);
    setSecondsLeft(30);
    if (q?.gameType === 'isnad_order' && q.orderedItems) {
      setIsnadDraft(deterministicShuffle(q.orderedItems, seedOffset + 19));
    } else {
      setIsnadDraft([]);
    }
  };

  const restartSession = (overrides?: {
    cat?: QuestionCategory | 'all';
    gt?: QuestionGameType | 'all';
    len?: SessionLengthOption;
    timed?: boolean;
    mistakes?: boolean;
  }) => {
    const nextCat = overrides?.cat ?? category;
    const nextGt = overrides?.gt ?? gameType;
    const nextLen = overrides?.len ?? lengthOpt;
    const nextTimed = overrides?.timed ?? timedMode;
    const nextMistakes = overrides?.mistakes ?? mistakesOnly;
    const nextSeed = sessionSeed + 1;

    setCategory(nextCat);
    setGameType(nextGt);
    setLengthOpt(nextLen);
    setTimedMode(nextTimed);
    setMistakesOnly(nextMistakes);
    setSessionMistakeIdsSnapshot(gamification.mistakeIds);
    setSessionSeed(nextSeed);
    setQIndex(0);
    setSessionCorrect(0);
    setSessionAnswered(0);
    setSessionXp(0);
    setCombo(0);
    setMaxComboSession(0);
    setLives(3);
    setHintsLeft(2);
    setSessionBadges([]);
    setSessionFinalized(false);

    const nextQs = selectQuizSession(QUESTION_BANK, {
      category: nextCat,
      gameType: nextGt,
      length: nextLen,
      mistakesOnly: nextMistakes,
      mistakeIds: gamification.mistakeIds,
      seed: nextSeed,
    });
    resetQuestionUiState(nextQs[0], nextSeed);
  };

  // Triggered from MasteryDashboard's "Sadece Yanlışlarımı Çalış" button
  useEffect(() => {
    if (externalMistakesOnlyTrigger > 0) {
      restartSession({ mistakes: true, cat: 'all', gt: 'all', len: 'all' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMistakesOnlyTrigger]);

  // Initialize shuffled isnadDraft on initial mount
  useEffect(() => {
    if (currentQuestion?.gameType === 'isnad_order' && currentQuestion.orderedItems && isnadDraft.length === 0) {
      setIsnadDraft(deterministicShuffle(currentQuestion.orderedItems, sessionSeed + qIndex + 19));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id]);

  // Countdown timer when Zamana Karşı (timedMode) is enabled
  useEffect(() => {
    if (!timedMode || hasAnswered || isFinished || !currentQuestion) return;
    if (secondsLeft <= 0) {
      submitOutcome(false);
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedMode, secondsLeft, hasAnswered, isFinished, currentQuestion?.id]);

  // Finalize session once completed
  useEffect(() => {
    if (isFinished && !sessionFinalized && sessionAnswered > 0) {
      const { nextState, newlyUnlocked } = finalizeQuizSession(
        gamification,
        sessionQuestions.length,
        sessionCorrect
      );
      onGamificationChange(nextState);
      if (newlyUnlocked.length > 0) {
        setSessionBadges((prev) => Array.from(new Set([...prev, ...newlyUnlocked])));
      }
      setSessionFinalized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, sessionFinalized]);

  const submitOutcome = (correct: boolean) => {
    if (!currentQuestion || hasAnswered) return;
    setHasAnswered(true);
    setIsCurrentCorrect(correct);

    const nextCombo = correct ? combo + 1 : 0;
    setCombo(nextCombo);
    setMaxComboSession((m) => Math.max(m, nextCombo));
    setSessionAnswered((a) => a + 1);
    if (correct) {
      setSessionCorrect((c) => c + 1);
    } else if (timedMode) {
      setLives((l) => Math.max(0, l - 1));
    }

    const { nextState, newlyUnlocked, earnedXp } = recordQuizOutcome(
      gamification,
      currentQuestion,
      correct,
      nextCombo,
      timedMode
    );
    setSessionXp((x) => x + earnedXp);
    if (newlyUnlocked.length > 0) {
      setSessionBadges((prev) => Array.from(new Set([...prev, ...newlyUnlocked])));
    }
    onGamificationChange(nextState);
  };

  // Shuffled choices for matching & word_order
  const shuffledRightPairs = useMemo(() => {
    if (currentQuestion?.gameType !== 'matching' || !currentQuestion.pairs) return [];
    return deterministicShuffle(
      currentQuestion.pairs.map((p) => ({ id: p.id, text: p.right })),
      sessionSeed + qIndex * 11 + 3
    );
  }, [currentQuestion, sessionSeed, qIndex]);

  const shuffledWordChips = useMemo(() => {
    if (currentQuestion?.gameType !== 'word_order' || !currentQuestion.orderedItems) return [];
    return deterministicShuffle(
      currentQuestion.orderedItems.map((word, idx) => ({ key: `${idx}-${word}`, word })),
      sessionSeed + qIndex * 17 + 5
    );
  }, [currentQuestion, sessionSeed, qIndex]);

  const levelInfo = getLevelForXp(gamification.xp);

  const handleUseHint = () => {
    if (hintsLeft <= 0 || hintRevealed || hasAnswered) return;
    setHintsLeft((h) => h - 1);
    setHintRevealed(true);
  };

  const handleMoveIsnadItem = (idx: number, dir: -1 | 1) => {
    if (hasAnswered) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= isnadDraft.length) return;
    const copy = [...isnadDraft];
    const tmp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = tmp;
    setIsnadDraft(copy);
  };

  return (
    <section aria-label="Etkileşimli 9 Oyun Modlu Bilgi Arenası" className="space-y-6">
      {/* Gamification Live HUD */}
      <ManuscriptCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-[var(--accent-gold-soft)] px-3 py-1.5 text-xs font-bold text-[#875C10] dark:text-[var(--accent-gold)]">
            Sv. {levelInfo.current.level} · {levelInfo.current.titleTr} ({gamification.xp} XP)
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] font-tabular">
            <Flame className="w-4 h-4 text-[#A64B2A] dark:text-[#FB923C]" aria-hidden="true" />
            <span>{gamification.streakDays} Gün Seri</span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-tabular">
            Günlük: <strong>{gamification.todayXp}/{gamification.dailyGoalXp} XP</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {timedMode && (
            <div className="inline-flex items-center gap-1 text-[#8C3B4A] dark:text-[#F9A8D4] font-bold">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart
                  key={i}
                  className="w-4 h-4"
                  fill={i < lives ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
          <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 py-1 font-tabular font-semibold text-[var(--text-primary)]">
            Skor: {sessionCorrect}/{sessionAnswered} · Seri: {combo}x
          </span>
          <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 py-1 font-tabular font-semibold text-[var(--accent-emerald)]">
            Banka: {bankStats.total} Soru
          </span>
        </div>
      </ManuscriptCard>

      {/* Filters & Controls Panel */}
      <ManuscriptCard className="p-4 space-y-3.5">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((cat) => {
            const active = category === cat.id && !mistakesOnly;
            const count =
              cat.id === 'all' ? bankStats.total : bankStats.byCategory[cat.id];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => restartSession({ cat: cat.id, mistakes: false })}
                aria-pressed={active}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}

          {gamification.mistakeIds.length > 0 && (
            <button
              type="button"
              onClick={() => restartSession({ mistakes: !mistakesOnly })}
              aria-pressed={mistakesOnly}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                mistakesOnly
                  ? 'bg-[#8C3B4A] text-white border-[#8C3B4A]'
                  : 'bg-[#F7EAED] dark:bg-[#361921] text-[#8C3B4A] dark:text-[#F9A8D4] border-[#8C3B4A]/40'
              }`}
            >
              Sadece Yanlışlarımı Çalış ({gamification.mistakeIds.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-hairline)]">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span>Oyun Türü:</span>
              <select
                aria-label="Quiz oyun türü seçici"
                value={gameType}
                onChange={(e) =>
                  restartSession({ gt: e.target.value as QuestionGameType | 'all' })
                }
                className="min-h-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
              >
                {GAME_TYPE_LABELS.map((gt) => (
                  <option key={gt.id} value={gt.id}>
                    {gt.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-flex rounded-xl bg-[var(--bg-surface)] p-0.5 border border-[var(--border-hairline)]">
              {LENGTH_OPTIONS.map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => restartSession({ len: opt.value })}
                  aria-pressed={lengthOpt === opt.value}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                    lengthOpt === opt.value
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-bold'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => restartSession({ timed: !timedMode })}
              aria-pressed={timedMode}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer ${
                timedMode
                  ? 'bg-[#A64B2A] text-white border-[#A64B2A]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{timedMode ? 'Zamana Karşı (Aktif)' : 'Rahat Mod'}</span>
            </button>

            <button
              type="button"
              onClick={() => restartSession()}
              className="min-h-[36px] px-3 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Yeniden Karıştır</span>
            </button>
          </div>
        </div>
      </ManuscriptCard>

      {/* Active Arena or Empty or Finished Summary */}
      {sessionQuestions.length === 0 ? (
        <ManuscriptCard className="p-8 text-center space-y-3 max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            Bu filtreye uyan soru bulunamadı
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Kategori, oyun türü veya Tekrar Listesi filtresini genişleterek tüm {bankStats.total} soruya ulaşabilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => restartSession({ cat: 'all', gt: 'all', mistakes: false, len: 10 })}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer"
          >
            Karma 10 Soruya Dön
          </button>
        </ManuscriptCard>
      ) : !isFinished && currentQuestion ? (
        <ManuscriptCard accentColor="var(--accent-navy)" className="max-w-4xl mx-auto p-5 sm:p-8 space-y-6">
          {/* Question Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-tabular font-bold text-[var(--text-primary)]">
                Soru {qIndex + 1} / {sessionQuestions.length}
              </span>
              <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-0.5 font-medium text-[var(--text-secondary)]">
                {GAME_TYPE_LABELS.find((g) => g.id === currentQuestion.gameType)?.label}
              </span>
              {currentQuestion.needs_review && (
                <StatusBadge variant="needs_review" label="İnceleme Notu" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {timedMode && (
                <span
                  className={`font-tabular font-bold px-2.5 py-0.5 rounded-lg ${
                    secondsLeft <= 8
                      ? 'bg-[#F7EAED] text-[#8C3B4A] dark:bg-[#361921] dark:text-[#F9A8D4]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                  }`}
                >
                  {secondsLeft} sn
                </span>
              )}
              <button
                type="button"
                disabled={hintsLeft <= 0 || hintRevealed || hasAnswered}
                onClick={handleUseHint}
                className="min-h-[30px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 disabled:opacity-45 cursor-pointer disabled:cursor-default"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                <span>İpucu ({hintsLeft})</span>
              </button>
              <span className="hidden sm:inline">{currentQuestion.sourceRef}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent-navy)] transition-all duration-300"
              style={{
                width: `${Math.round(((qIndex + (hasAnswered ? 1 : 0)) / sessionQuestions.length) * 100)}%`,
              }}
            />
          </div>

          {/* Prompt + Optional Arabic Box / Audio Player */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
              {currentQuestion.prompt}
            </h2>

            {hintRevealed && (
              <div className="rounded-xl bg-[var(--accent-gold-soft)]/70 border border-[var(--accent-gold)] px-3.5 py-2 text-xs text-[var(--text-primary)]">
                <strong>İpucu:</strong>{' '}
                {currentQuestion.hint || `Kaynak referansı: ${currentQuestion.sourceRef}`}
              </div>
            )}

            {currentQuestion.arabicPrompt && currentQuestion.gameType !== 'arabic_blank' && (
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 flex items-center justify-between gap-3">
                {currentQuestion.gameType === 'audio_listening' ? (
                  <div className="flex-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                    {hasAnswered ? (
                      <p className="font-arabic-inline text-xl leading-loose text-[var(--text-primary)] text-right" dir="rtl">
                        {currentQuestion.arabicPrompt}
                      </p>
                    ) : (
                      <span>
                        Sağdaki hoparlör butonuna basarak Arapça ses kaydını dinleyin ve doğru tercümeyi seçin.
                      </span>
                    )}
                  </div>
                ) : (
                  <p
                    className="font-arabic-inline text-xl sm:text-2xl leading-loose text-[var(--text-primary)] flex-1 text-right"
                    dir="rtl"
                  >
                    {currentQuestion.arabicPrompt}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() =>
                    speak(currentQuestion.arabicPrompt!, 'ar-SA', { id: currentQuestion.id })
                  }
                  aria-label="Sorudaki Arapça metni dinle"
                  className="min-h-[40px] px-3.5 py-2 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>{currentQuestion.gameType === 'audio_listening' ? 'Kaydı Dinle' : 'Dinle'}</span>
                </button>
              </div>
            )}

            {currentQuestion.gameType === 'arabic_blank' && currentQuestion.blankSentenceAr && (
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p
                  className="font-arabic-inline text-xl sm:text-2xl leading-loose text-[var(--text-primary)] text-right"
                  dir="rtl"
                >
                  {currentQuestion.blankSentenceAr}
                </p>
              </div>
            )}
          </div>

          {/* RENDERER 1: 4-Option Questions (MC, arabic_blank, which_bab, audio_listening) */}
          {currentQuestion.options && currentQuestion.correctIndex !== undefined && (
            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isChosen = selectedChoiceIdx === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                let btnClass =
                  'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--border-strong)]';
                if (hasAnswered) {
                  if (isCorrect) {
                    btnClass =
                      'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] dark:border-[#34D399] text-[#0F5132] dark:text-[#6EE7B7] font-semibold';
                  } else if (isChosen) {
                    btnClass =
                      'bg-[#F7EAED] dark:bg-[#361921] border-[#8C3B4A] dark:border-[#F472B6] text-[#8C3B4A] dark:text-[#F9A8D4]';
                  } else {
                    btnClass =
                      'bg-[var(--bg-surface)]/50 border-[var(--border-hairline)] text-[var(--text-muted)]';
                  }
                }
                const isArChoice = currentQuestion.gameType === 'arabic_blank';
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => {
                      setSelectedChoiceIdx(idx);
                      submitOutcome(idx === currentQuestion.correctIndex);
                    }}
                    className={`min-h-[48px] px-4 py-3 rounded-xl border text-left text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <span className={isArChoice ? 'font-arabic-inline text-xl' : ''}>{opt}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    {hasAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* RENDERER 2: True / False Rapid Round */}
          {currentQuestion.gameType === 'true_false' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: true, label: 'DOĞRU' },
                { val: false, label: 'YANLIŞ' },
              ].map((btn) => {
                const isChosen = selectedBool === btn.val;
                const isCorrect = currentQuestion.correctBool === btn.val;
                let cls =
                  'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)] hover:border-[var(--accent-navy)]';
                if (hasAnswered) {
                  if (isCorrect) {
                    cls =
                      'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] dark:border-[#34D399] text-[#0F5132] dark:text-[#6EE7B7]';
                  } else if (isChosen) {
                    cls =
                      'bg-[#F7EAED] dark:bg-[#361921] border-[#8C3B4A] dark:border-[#F472B6] text-[#8C3B4A] dark:text-[#F9A8D4]';
                  } else {
                    cls = 'bg-[var(--bg-surface)]/50 border-[var(--border-hairline)] text-[var(--text-muted)]';
                  }
                }
                return (
                  <button
                    key={btn.label}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => {
                      setSelectedBool(btn.val);
                      submitOutcome(btn.val === currentQuestion.correctBool);
                    }}
                    className={`min-h-[56px] rounded-2xl border-2 text-sm sm:text-base font-bold transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* RENDERER 3: Click-to-Pair Matching */}
          {currentQuestion.gameType === 'matching' && currentQuestion.pairs && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-secondary)]">
                Soldan bir kavram seçin, ardından sağdan doğru eşini tıklayın ({Object.keys(matchedPairs).length}/{currentQuestion.pairs.length} eşleşti).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  {currentQuestion.pairs.map((p) => {
                    const isMatched = Boolean(matchedPairs[p.id]);
                    const isActive = matchSelectedLeft === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={hasAnswered || isMatched}
                        onClick={() => setMatchSelectedLeft(p.id)}
                        className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          isMatched
                            ? 'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] text-[#0F5132] dark:text-[#6EE7B7]'
                            : isActive
                              ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                        }`}
                      >
                        <span className={/[\u0600-\u06FF]/.test(p.left) ? 'font-arabic-inline text-base' : ''}>
                          {p.left}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {shuffledRightPairs.map((r) => {
                    const alreadyMatched = Object.values(matchedPairs).includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={hasAnswered || alreadyMatched || !matchSelectedLeft}
                        onClick={() => {
                          if (!matchSelectedLeft) return;
                          if (matchSelectedLeft === r.id) {
                            const next = { ...matchedPairs, [matchSelectedLeft]: r.id };
                            setMatchedPairs(next);
                            setMatchSelectedLeft(null);
                            if (Object.keys(next).length === currentQuestion.pairs!.length) {
                              submitOutcome(matchMistakesCount <= 1);
                            }
                          } else {
                            setMatchMistakesCount((c) => c + 1);
                            setMatchSelectedLeft(null);
                          }
                        }}
                        className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-default ${
                          alreadyMatched
                            ? 'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] text-[#0F5132] dark:text-[#6EE7B7]'
                            : matchSelectedLeft
                              ? 'bg-[var(--bg-card)] border-[var(--accent-navy)]/50 hover:bg-[var(--bg-surface)] text-[var(--text-primary)]'
                              : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {r.text}
                      </button>
                    );
                  })}
                </div>
              </div>
              {matchMistakesCount > 0 && !hasAnswered && (
                <p className="text-xs text-[#8C3B4A] dark:text-[#F9A8D4]">
                  Yanlış eşleştirme denemesi: {matchMistakesCount}
                </p>
              )}
            </div>
          )}

          {/* RENDERER 4: Arabic Word Order */}
          {currentQuestion.gameType === 'word_order' && currentQuestion.orderedItems && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                {currentQuestion.orderDirectionLabel || 'Kelimelere sırayla tıklayarak cümleyi kurun:'}
              </p>

              {/* Target assembled tray */}
              <div
                dir="rtl"
                className="min-h-[60px] rounded-xl bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-strong)] p-3 flex flex-wrap gap-2 items-center"
              >
                {orderSelected.length === 0 ? (
                  <span className="text-xs text-[var(--text-muted)]" dir="ltr">
                    Aşağıdaki kelimelere sırayla tıklayın...
                  </span>
                ) : (
                  orderSelected.map((word, idx) => (
                    <button
                      key={`${word}-${idx}`}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => setOrderSelected((prev) => prev.filter((_, i) => i !== idx))}
                      className="font-arabic-inline text-lg px-3 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--accent-gold)] text-[var(--text-primary)] cursor-pointer"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Chip Bank */}
              <div dir="rtl" className="flex flex-wrap gap-2">
                {shuffledWordChips.map((chip) => {
                  const usedCount = orderSelected.filter((w) => w === chip.word).length;
                  const totalOccurrences = currentQuestion.orderedItems!.filter(
                    (w) => w === chip.word
                  ).length;
                  const alreadyPicked =
                    usedCount >= totalOccurrences &&
                    shuffledWordChips
                      .filter((c) => c.word === chip.word)
                      .findIndex((c) => c.key === chip.key) < usedCount;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      disabled={hasAnswered || alreadyPicked}
                      onClick={() => setOrderSelected((prev) => [...prev, chip.word])}
                      className={`font-arabic-inline text-lg px-3 py-1.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-default ${
                        'bg-[var(--bg-card)] border-[var(--border-hairline)] hover:border-[var(--accent-navy)] text-[var(--text-primary)]'
                      }`}
                    >
                      {chip.word}
                    </button>
                  );
                })}
              </div>

              {!hasAnswered && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderSelected([])}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-secondary)] cursor-pointer"
                  >
                    Temizle
                  </button>
                  <button
                    type="button"
                    disabled={orderSelected.length !== currentQuestion.orderedItems.length}
                    onClick={() => {
                      const matchesAll = currentQuestion.orderedItems!.every(
                        (w, idx) => orderSelected[idx] === w
                      );
                      submitOutcome(matchesAll);
                    }}
                    className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold disabled:opacity-45 cursor-pointer"
                  >
                    Sıralamayı Kontrol Et
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RENDERER 5: Isnad / Chronological Ordering */}
          {currentQuestion.gameType === 'isnad_order' && currentQuestion.orderedItems && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-secondary)]">
                {currentQuestion.orderDirectionLabel} · Yukarı/aşağı butonlarıyla sıralayın:
              </p>

              <div className="space-y-2">
                {isnadDraft.map((item, idx) => {
                  const isSpotRight = hasAnswered && currentQuestion.orderedItems![idx] === item;
                  return (
                    <div
                      key={`${item}-${idx}`}
                      className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm ${
                        hasAnswered
                          ? isSpotRight
                            ? 'bg-[#E6F2EC] dark:bg-[#132E22] border-[#0F5132] text-[#0F5132] dark:text-[#6EE7B7]'
                            : 'bg-[#F7EAED] dark:bg-[#361921] border-[#8C3B4A] text-[#8C3B4A] dark:text-[#F9A8D4]'
                          : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-center text-[11px] font-bold font-tabular shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate">{item}</span>
                      </div>
                      {!hasAnswered && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveIsnadItem(idx, -1)}
                            aria-label={`${item} öğesini yukarı taşı`}
                            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === isnadDraft.length - 1}
                            onClick={() => handleMoveIsnadItem(idx, 1)}
                            aria-label={`${item} öğesini aşağı taşı`}
                            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasAnswered && (
                <button
                  type="button"
                  onClick={() => {
                    const matches = currentQuestion.orderedItems!.every(
                      (item, idx) => isnadDraft[idx] === item
                    );
                    submitOutcome(matches);
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer"
                >
                  Zincir Sırasını Onayla
                </button>
              )}
            </div>
          )}

          {/* RENDERER 6: Interactive 14-City Map */}
          {currentQuestion.gameType === 'city_map' && currentQuestion.targetCityId && (
            <CityMapQuestion
              targetCityId={currentQuestion.targetCityId}
              answeredCityId={selectedCityId}
              onSelectCity={(cid) => {
                setSelectedCityId(cid);
                submitOutcome(cid === currentQuestion.targetCityId);
              }}
            />
          )}

          {/* Post-Answer Feedback Box */}
          {hasAnswered && (
            <div
              className={`rounded-xl border p-4 space-y-3 ${
                isCurrentCorrect
                  ? 'bg-[#E6F2EC]/60 dark:bg-[#132E22]/60 border-[#0F5132]/40'
                  : 'bg-[#F7EAED]/60 dark:bg-[#361921]/60 border-[#8C3B4A]/40'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {isCurrentCorrect ? '✓ Doğru Cevap!' : '✕ Yanlış — Tekrar Listesine Eklendi'}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  {currentQuestion.sourceRef}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {currentQuestion.explanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {currentQuestion.hadithId ? (
                  <Link
                    to={`/hadisler?hadith=${currentQuestion.hadithId}`}
                    className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline"
                  >
                    Hadis #{currentQuestion.hadithId} sayfasında incele →
                  </Link>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = qIndex + 1;
                    setQIndex(nextIdx);
                    resetQuestionUiState(sessionQuestions[nextIdx], sessionSeed + nextIdx);
                  }}
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  {qIndex + 1 >= sessionQuestions.length ? 'Oturum Raporunu Gör' : 'Sonraki Soru'}
                </button>
              </div>
            </div>
          )}
        </ManuscriptCard>
      ) : (
        /* Detailed End-of-Session Summary Report */
        <ManuscriptCard
          accentColor="var(--accent-gold)"
          className="max-w-2xl mx-auto p-6 sm:p-8 text-center space-y-5"
        >
          <Award className="w-11 h-11 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-editorial text-3xl font-bold text-[var(--text-primary)]">
              {timedMode && lives <= 0 ? 'Canlar Tükendi — Oturum Özeti' : 'Oturum Tamamlandı'}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {CATEGORY_TABS.find((c) => c.id === category)?.label} ·{' '}
              {GAME_TYPE_LABELS.find((g) => g.id === gameType)?.label}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-emerald)]">
                {sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0}%
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {sessionCorrect}/{sessionAnswered} Doğru
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-gold)]">
                +{sessionXp} XP
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">Kazanılan XP</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-navy)] dark:text-[#93b8f9]">
                {maxComboSession}x
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">En Uzun Seri</div>
            </div>
          </div>

          {sessionBadges.length > 0 && (
            <div className="rounded-xl bg-[var(--accent-gold-soft)]/75 border border-[var(--accent-gold)] p-3.5 space-y-1.5">
              <p className="text-xs font-bold text-[#875C10] dark:text-[var(--accent-gold)]">
                ★ Bu Oturumda Kazanılan Rozetler
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {sessionBadges.map((bid) => {
                  const def = BADGE_DEFS.find((d) => d.id === bid);
                  return (
                    <span
                      key={bid}
                      className="rounded-lg bg-[var(--bg-card)] border border-[var(--accent-gold)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      {def?.titleTr || bid}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => restartSession({ mistakes: false })}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent-navy)] text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Yeni Oturum Başlat</span>
            </button>
            {gamification.mistakeIds.length > 0 && (
              <button
                type="button"
                onClick={() => restartSession({ mistakes: true, cat: 'all', gt: 'all', len: 'all' })}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#8C3B4A] text-white text-sm font-semibold cursor-pointer"
              >
                Yanlışları Tekrar Çalış ({gamification.mistakeIds.length})
              </button>
            )}
          </div>
        </ManuscriptCard>
      )}
    </section>
  );
};

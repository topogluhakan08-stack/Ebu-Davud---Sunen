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
import { useApp } from '../../context/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import {
  finalizeQuizSession,
  getLevelForXp,
  recordQuizOutcome,
  selectQuizSession,
  type GamificationState,
  type SessionLengthOption,
} from '../../utils/learnEngine';
import {
  getLocalizedBadge,
  getLocalizedLearnUi,
  getLocalizedLevelTitle,
} from '../../utils/learnTranslations';
import { formatLocaleNumber } from '../../utils/articleTranslations';
import { ManuscriptCard } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { CityMapQuestion } from './CityMapQuestion';

interface QuizArenaProps {
  gamification: GamificationState;
  onGamificationChange: (next: GamificationState) => void;
  externalMistakesOnlyTrigger?: number;
  questionBank?: QuizBankItem[];
}

const CATEGORY_ORDER: Array<QuestionCategory | 'all'> = [
  'all',
  'hadisler',
  'ebu_davud',
  'sunen',
  'sozluk',
  'bab_temalari',
];

const GAME_TYPE_ORDER: Array<QuestionGameType | 'all'> = [
  'all',
  'multiple_choice',
  'arabic_blank',
  'matching',
  'word_order',
  'isnad_order',
  'which_bab',
  'audio_listening',
  'true_false',
  'city_map',
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
  questionBank = QUESTION_BANK,
}) => {
  const { settings, learnPack } = useApp();
  const { speak } = useSpeech();

  const lang = settings.language;
  const learnUi = getLocalizedLearnUi(lang, learnPack);
  const ui = learnUi.quiz;
  const xpUnit = learnUi.learnPage.xpUnit;
  const levelShort = learnUi.learnPage.levelShort;
  const activeBank = questionBank.length > 0 ? questionBank : QUESTION_BANK;
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
  const [timedOut, setTimedOut] = useState(false);
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

  const [sessionMistakeIdsSnapshot, setSessionMistakeIdsSnapshot] = useState<string[]>(
    gamification.mistakeIds
  );

  // Deterministic seeded selection preserves the exact active session across language switches!
  const sessionQuestions = useMemo(
    () =>
      selectQuizSession(activeBank, {
        category,
        gameType,
        length: lengthOpt,
        mistakesOnly,
        mistakeIds: sessionMistakeIdsSnapshot,
        seed: sessionSeed,
      }),
    [activeBank, category, gameType, lengthOpt, mistakesOnly, sessionMistakeIdsSnapshot, sessionSeed]
  );

  const currentQuestion: QuizBankItem | undefined = sessionQuestions[qIndex];
  const isFinished =
    sessionQuestions.length > 0 &&
    (qIndex >= sessionQuestions.length || (timedMode && lives <= 0));

  const resetQuestionUiState = (q: QuizBankItem | undefined, seedOffset: number) => {
    setHasAnswered(false);
    setIsCurrentCorrect(false);
    setTimedOut(false);
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

    const nextQs = selectQuizSession(activeBank, {
      category: nextCat,
      gameType: nextGt,
      length: nextLen,
      mistakesOnly: nextMistakes,
      mistakeIds: gamification.mistakeIds,
      seed: nextSeed,
    });
    resetQuestionUiState(nextQs[0], nextSeed);
  };

  useEffect(() => {
    if (externalMistakesOnlyTrigger > 0) {
      restartSession({ mistakes: true, cat: 'all', gt: 'all', len: 'all' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMistakesOnlyTrigger]);

  // Keep isnadDraft synchronized on mount or language change without resetting progress
  useEffect(() => {
    if (currentQuestion?.gameType === 'isnad_order' && currentQuestion.orderedItems) {
      setIsnadDraft(deterministicShuffle(currentQuestion.orderedItems, sessionSeed + qIndex + 19));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, currentQuestion?.orderedItems?.[0]]);

  // Countdown timer when timedMode is active
  useEffect(() => {
    if (!timedMode || hasAnswered || isFinished || !currentQuestion) return;
    if (secondsLeft <= 0) {
      setTimedOut(true);
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
  const levelTitle = getLocalizedLevelTitle(levelInfo.current.level, lang, learnPack);

  const lengthOptions: Array<{ value: SessionLengthOption; label: string }> = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 'all', label: ui.lengthAll },
  ];

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
    <section aria-label={learnUi.learnPage.tabs.quiz} className="space-y-6">
      {/* Gamification Live HUD */}
      <ManuscriptCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-[var(--accent-gold-soft)] px-3 py-1.5 text-xs font-bold text-[#875C10] dark:text-[var(--accent-gold)]">
            {levelShort} {levelInfo.current.level} · {levelTitle} ({formatLocaleNumber(gamification.xp, lang)} {xpUnit})
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] font-tabular">
            <Flame className="w-4 h-4 text-[#A64B2A] dark:text-[#FB923C]" aria-hidden="true" />
            <span>
              {gamification.streakDays} {ui.streak}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-tabular">
            {ui.dailyGoal}:{' '}
            <strong>
              {gamification.todayXp}/{gamification.dailyGoalXp} {xpUnit}
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {timedMode && (
            <div
              className="inline-flex items-center gap-1 text-[#8C3B4A] dark:text-[#F9A8D4] font-bold"
              aria-label={ui.livesAria}
            >
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
            {sessionCorrect}/{sessionAnswered} · {combo}× {ui.comboSuffix}
          </span>
          <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 py-1 font-tabular font-semibold text-[var(--accent-emerald)]">
            {ui.poolPrefix} {bankStats.total} {ui.questionUnit}
          </span>
        </div>
      </ManuscriptCard>

      {/* Filters & Controls Panel */}
      <ManuscriptCard className="p-4 space-y-3.5">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={ui.categoryFilterAria}>
          {CATEGORY_ORDER.map((catId) => {
            const active = category === catId && !mistakesOnly;
            const count = catId === 'all' ? bankStats.total : bankStats.byCategory[catId];
            return (
              <button
                key={catId}
                type="button"
                onClick={() => restartSession({ cat: catId, mistakes: false })}
                aria-pressed={active}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                }`}
              >
                {ui.categories[catId]} ({count})
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
              {mistakesOnly ? ui.exitMistakesBtn : ui.reviewMistakesBtn} ({gamification.mistakeIds.length})
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-hairline)]">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span>{ui.gameTypeLabel}</span>
              <select
                aria-label={ui.gameTypeLabel}
                value={gameType}
                onChange={(e) =>
                  restartSession({ gt: e.target.value as QuestionGameType | 'all' })
                }
                className="min-h-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
              >
                {GAME_TYPE_ORDER.map((gtId) => (
                  <option key={gtId} value={gtId}>
                    {ui.gameTypes[gtId]}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--bg-surface)] p-0.5 border border-[var(--border-hairline)]">
              <span className="px-2 text-[11px] text-[var(--text-muted)]">
                {ui.questionCountLabel}
              </span>
              {lengthOptions.map((opt) => (
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
              <span>{timedMode ? ui.timedModeLabel : ui.relaxedModeLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => restartSession()}
              className="min-h-[36px] px-3 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{ui.summaryNewSessionBtn}</span>
            </button>
          </div>
        </div>
      </ManuscriptCard>

      {/* Active Arena or Empty or Finished Summary */}
      {sessionQuestions.length === 0 ? (
        <ManuscriptCard className="p-8 text-center space-y-3 max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            {ui.emptyPoolTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{ui.emptyPoolDesc}</p>
          <button
            type="button"
            onClick={() => restartSession({ cat: 'all', gt: 'all', mistakes: false, len: 10 })}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer"
          >
            {ui.showAllBtn}
          </button>
        </ManuscriptCard>
      ) : !isFinished && currentQuestion ? (
        <ManuscriptCard accentColor="var(--accent-navy)" className="max-w-4xl mx-auto p-5 sm:p-8 space-y-6">
          {/* Question Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-tabular font-bold text-[var(--text-primary)]">
                {ui.progressQuestion} {qIndex + 1} / {sessionQuestions.length}
              </span>
              <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-0.5 font-medium text-[var(--text-secondary)]">
                {ui.gameTypes[currentQuestion.gameType]}
              </span>
              {currentQuestion.needs_review && (
                <StatusBadge variant="needs_review" label={ui.needsReviewBadge} />
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
                  {secondsLeft} {ui.secondsShort}
                </span>
              )}
              <button
                type="button"
                disabled={hintsLeft <= 0 || hintRevealed || hasAnswered}
                onClick={handleUseHint}
                className="min-h-[30px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 disabled:opacity-45 cursor-pointer disabled:cursor-default"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                <span>
                  {ui.hintShowBtn} ({hintsLeft})
                </span>
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
                {currentQuestion.hint || `${ui.sourcePrefix} ${currentQuestion.sourceRef}`}
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
                      <span>{ui.audioHiddenHint}</span>
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
                  aria-label={ui.listenArabicHadith}
                  className="min-h-[40px] px-3.5 py-2 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>{learnUi.flashcards.listenBtn}</span>
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

          {/* RENDERER 1: 4-Option Questions */}
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
                    className={`min-h-[48px] px-4 py-3 rounded-xl border text-start text-sm flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <span
                      dir={isArChoice ? 'rtl' : undefined}
                      className={isArChoice ? 'font-arabic-inline text-xl' : ''}
                    >
                      {opt}
                    </span>
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

          {/* RENDERER 2: True / False */}
          {currentQuestion.gameType === 'true_false' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: true, label: ui.trueLabel },
                { val: false, label: ui.falseLabel },
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
                    key={String(btn.val)}
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
                {ui.matchingInstruction} ({Object.keys(matchedPairs).length}/{currentQuestion.pairs.length}{' '}
                {ui.matchingMatchedSuffix})
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
                        className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border text-start text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
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
                        className={`w-full min-h-[46px] px-3.5 py-2 rounded-xl border text-start text-xs sm:text-sm transition-colors cursor-pointer disabled:cursor-default ${
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
                  {ui.mistakes}: {matchMistakesCount}
                </p>
              )}
            </div>
          )}

          {/* RENDERER 4: Arabic Word Order */}
          {currentQuestion.gameType === 'word_order' && currentQuestion.orderedItems && (
            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)]">
                {currentQuestion.orderDirectionLabel || ui.orderInstruction}
              </p>

              <div
                dir="rtl"
                className="min-h-[60px] rounded-xl bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-strong)] p-3 flex flex-wrap gap-2 items-center"
              >
                {orderSelected.length === 0 ? (
                  <span className="text-xs text-[var(--text-muted)]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {ui.orderInstruction}
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
                      className="font-arabic-inline text-lg px-3 py-1.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-default bg-[var(--bg-card)] border-[var(--border-hairline)] hover:border-[var(--accent-navy)] text-[var(--text-primary)]"
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
                    {learnUi.flashcards.rateAgain}
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
                    {ui.orderCheckBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RENDERER 5: Isnad / Chronological Ordering */}
          {currentQuestion.gameType === 'isnad_order' && currentQuestion.orderedItems && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-secondary)]">
                {currentQuestion.orderDirectionLabel || ui.orderInstruction}
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
                            aria-label={`${ui.orderMoveUpAria}: ${item}`}
                            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] disabled:opacity-35 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === isnadDraft.length - 1}
                            onClick={() => handleMoveIsnadItem(idx, 1)}
                            aria-label={`${ui.orderMoveDownAria}: ${item}`}
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
                  {ui.orderCheckBtn}
                </button>
              )}
            </div>
          )}

          {/* RENDERER 6: Interactive 14-City Map */}
          {currentQuestion.gameType === 'city_map' && currentQuestion.targetCityId && (
            <CityMapQuestion
              targetCityId={currentQuestion.targetCityId}
              selectedCityId={selectedCityId}
              revealed={hasAnswered}
              onSelect={(cid) => {
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
                  {isCurrentCorrect
                    ? `✓ ${ui.feedbackCorrect}`
                    : timedOut
                      ? `✕ ${ui.feedbackTimeout}`
                      : `✕ ${ui.feedbackWrong}`}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  {ui.sourcePrefix} {currentQuestion.sourceRef}
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
                    {learnUi.flashcards.hadithPrefix} #{currentQuestion.hadithId} →
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
                  {qIndex + 1 >= sessionQuestions.length ? ui.finishSessionBtn : ui.nextQuestionBtn}
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
              {timedMode && lives <= 0 ? ui.summaryLivesOutTitle : ui.summaryDoneTitle}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {ui.categories[category]} · {ui.gameTypes[gameType]}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-emerald)]">
                {sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0}%
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {sessionCorrect}/{sessionAnswered} {ui.summaryCorrectLabel}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-gold)]">
                +{sessionXp} {xpUnit}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{ui.summaryEarnedXp}</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3">
              <div className="text-xl sm:text-2xl font-bold font-tabular text-[var(--accent-navy)] dark:text-[#93b8f9]">
                {maxComboSession}x
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{ui.summaryLongestCombo}</div>
            </div>
          </div>

          {sessionBadges.length > 0 && (
            <div className="rounded-xl bg-[var(--accent-gold-soft)]/75 border border-[var(--accent-gold)] p-3.5 space-y-1.5">
              <p className="text-xs font-bold text-[#875C10] dark:text-[var(--accent-gold)]">
                {ui.summaryUnlockedBadges}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {sessionBadges.map((bid) => {
                  const def = getLocalizedBadge(bid, lang, learnPack);
                  return (
                    <span
                      key={bid}
                      className="rounded-lg bg-[var(--bg-card)] border border-[var(--accent-gold)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      {def.title}
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
              <span>{ui.summaryNewSessionBtn}</span>
            </button>
            {gamification.mistakeIds.length > 0 && (
              <button
                type="button"
                onClick={() => restartSession({ mistakes: true, cat: 'all', gt: 'all', len: 'all' })}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#8C3B4A] text-white text-sm font-semibold cursor-pointer"
              >
                {ui.summaryRetryMistakesBtn} ({gamification.mistakeIds.length})
              </button>
            )}
          </div>
        </ManuscriptCard>
      )}
    </section>
  );
};

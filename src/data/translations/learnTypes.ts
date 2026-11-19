import type { LanguageCode } from '../../types';
import type { MatchingPair, QuestionCategory, QuestionGameType } from '../questionBank';

export interface LearnPageStrings {
  levelShort: string;
  srsStatLabel: string;
  xpUnit: string;
  tabsAria: string;
  tabs: {
    quiz: string;
    flashcards: string;
    mastery: string;
    roots: string;
    mindmap: string;
  };
  loadingBank: string;
}

export interface QuizArenaStrings {
  categories: Record<'all' | QuestionCategory, string>;
  gameTypes: Record<'all' | QuestionGameType, string>;
  lengthAll: string;
  dailyGoal: string;
  streak: string;
  mistakes: string;
  categoryFilterAria: string;
  gameTypeLabel: string;
  questionCountLabel: string;
  timedModeLabel: string;
  relaxedModeLabel: string;
  reviewMistakesBtn: string;
  exitMistakesBtn: string;
  poolPrefix: string;
  questionUnit: string;
  emptyPoolTitle: string;
  emptyPoolDesc: string;
  showAllBtn: string;
  progressQuestion: string;
  comboSuffix: string;
  livesAria: string;
  secondsShort: string;
  needsReviewBadge: string;
  hintShowBtn: string;
  hintHideBtn: string;
  listenArabicHadith: string;
  audioHiddenHint: string;
  trueLabel: string;
  falseLabel: string;
  matchingInstruction: string;
  matchingLeftCol: string;
  matchingRightCol: string;
  matchingCompleteBtn: string;
  matchingMatchedSuffix: string;
  matchingCorrectListLabel: string;
  orderInstruction: string;
  orderMoveUpAria: string;
  orderMoveDownAria: string;
  orderCheckBtn: string;
  orderCorrectLabel: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  feedbackTimeout: string;
  sourcePrefix: string;
  finishSessionBtn: string;
  nextQuestionBtn: string;
  summaryLivesOutTitle: string;
  summaryDoneTitle: string;
  summaryCorrectLabel: string;
  summaryEarnedXp: string;
  summaryLongestCombo: string;
  summaryUnlockedBadges: string;
  summaryNewSessionBtn: string;
  summaryRetryMistakesBtn: string;
}

export interface CityMapStrings {
  headerBadge: string;
  svgAria: string;
  regionMedAnatolia: string;
  regionHijaz: string;
  regionSijistan: string;
  legendCorrect: string;
  legendWrong: string;
  legendHint: string;
}

export interface FlashcardStrings {
  deckWords: string;
  deckHadiths: string;
  allBabs: string;
  dueOnly: string;
  allCards: string;
  reviewedLabel: string;
  dueCountLabel: string;
  learnedLabel: string;
  emptyDueTitle: string;
  emptyDueDesc: string;
  showAllCardsBtn: string;
  swipeKnow: string;
  swipeRepeat: string;
  cardWordBadge: string;
  cardHadithBadge: string;
  rootLabel: string;
  listenBtn: string;
  showAnswerBtn: string;
  swipeHintDesktop: string;
  backWordBadge: string;
  backHadithBadge: string;
  morphologyLabel: string;
  showFrontBtn: string;
  ratePrompt: string;
  rateAgain: string;
  rateHard: string;
  rateGood: string;
  rateEasy: string;
  intervalTenMin: string;
  intervalOneDay: string;
  intervalDaysSuffix: string;
  prevAria: string;
  nextAria: string;
  hadithPrefix: string;
}

export interface MasteryStrings {
  kpiTotalXp: string;
  kpiDailyGoal: string;
  kpiStreakUnit: string;
  kpiAccuracy: string;
  kpiCorrectUnit: string;
  kpiSrsCards: string;
  kpiMasteredUnit: string;
  kpiDueUnit: string;
  chartHeading: string;
  chartSubtitle: string;
  resetProgressBtn: string;
  resetConfirmBtn: string;
  chartBabPrefix: string;
  chartScoreLabel: string;
  chartHadithsUnit: string;
  badgesHeading: string;
  mistakesHeading: string;
  mistakesPracticeBtn: string;
  mistakesEmpty: string;
  mistakesMoreSuffix: string;
  hadithPrefix: string;
  xpUnit: string;
}

export interface QuestionGeneratorStrings {
  // Hadith questions
  hadBabPrompt: string; // {id}, {tr}
  hadBabHint: string; // {page}, {term}
  hadBabExplanation: string; // {id}, {page}, {babNum}, {babTitle}
  hadBabSource: string; // {page}, {id}, {babNum}
  hadAudioPrompt: string; // {id}
  hadAudioExplanation: string; // {id}, {tr}
  hadSource: string; // {page}, {id}
  hadBlankPrompt: string; // {id}, {meaning}
  hadBlankHint: string; // {root}, {translit}
  hadBlankExplanation: string; // {arabic}, {meaning}, {root}
  hadWordPrompt: string; // {id}, {arabic}, {translit}
  hadWordHint: string; // {root}, {pos}
  hadWordExplanation: string; // {arabic}, {translit}, {root}, {meaning}, {morph}
  hadWordSource: string; // {page}, {id}
  hadIsnadPrompt: string; // {id}
  hadIsnadDir: string;
  hadIsnadHint: string; // {sahabi}
  hadIsnadExplanation: string; // {id}, {chain}
  hadIsnadSource: string; // {page}, {id}
  hadWordOrderPrompt: string; // {id}, {tr}
  hadWordOrderDir: string;
  hadWordOrderHint: string; // {first}
  hadWordOrderExplanation: string; // {matn}
  hadMatchPrompt: string; // {id}
  hadMatchHint: string; // {babNum}, {babTitle}
  hadLessonPrompt: string; // {id}
  hadSahabiPrompt: string; // {id}, {tr}
  hadSahabiHint: string; // {isnad}
  hadSahabiExplanation: string; // {id}, {name}, {nameAr}
  hadTfTruePrompt: string; // {id}, {tr}, {babNum}, {babTitle}, {page}
  hadTfFalsePrompt: string; // {id}, {babNum}, {babTitle}, {page}
  hadTfExplanation: string; // {id}, {babNum}, {babTitle}, {page}

  // Ebu Davud sayings & cities
  edSayingAudioPrompt: string; // {title}
  edSayingOrderPrompt: string; // {text}
  edSayingOrderDir: string;
  edSayingTfPrompt: string; // {text}
  edSayingsSource: string;
  edCityPrompt: string; // {num}, {role}, {year}, {event}
  edCityHint: string; // {region}, {nameAr}
  edCitySource: string;

  // Sunen generated
  snMekkePrompt: string; // {order}, {detail}
  snMekkeExplanation: string; // {order}, {title}, {detail}
  snMekkeSource: string;
  snRawiPrompt: string; // {detail}, {citation}
  snRawiSource: string; // {citation}
  snRawiDistractorExtra: string;
  snEdStatUnit: string; // {books}, {babs}, {hadiths}
  snEdStatPrompt: string; // {edition}, {year}
  snEdStatSource: string;
  snCityPrompt: string; // {highlight}, {edition}
  snCitySource: string;
  snComPrompt: string; // {summary}
  snComHint: string; // {scope}
  snComSource: string;
  snIncPrompt: string; // {title}, {note}
  snIncSource: string;
  snStudyPrompt: string; // {kind}, {summary}
  snStudySource: string;

  // Glossary generated
  glTermPrompt: string; // {def}
  glTermHint: string; // {cat}
  glTermSource: string; // {cat}

  // Bab themes generated
  btThemePrompt: string; // {subtitle}, {terms}
  btThemeHint: string; // {start}, {end}, {pages}
  btThemeExplanation: string; // {babNum}, {babTitle}, {titleAr}, {start}, {end}
  btSource: string; // {pages}, {babNum}
  btRangeSingle: string; // {start}, {pages}
  btRangeMulti: string; // {start}, {end}, {count}, {pages}
  btRangePrompt: string; // {babNum}, {babTitle}
}

export interface LearnUiStrings {
  learnPage: LearnPageStrings;
  quiz: QuizArenaStrings;
  cityMap: CityMapStrings;
  flashcards: FlashcardStrings;
  mastery: MasteryStrings;
  gen: QuestionGeneratorStrings;
}

export interface LocalizedBadgeDef {
  title: string;
  desc: string;
}

export interface LocalizedStaticQuestion {
  prompt: string;
  options?: string[];
  pairs?: MatchingPair[];
  orderedItems?: string[];
  orderDirectionLabel?: string;
  hint?: string;
  explanation: string;
  sourceRef: string;
}

export interface LearnTranslationPack {
  lang: Exclude<LanguageCode, 'tr'>;
  ui: LearnUiStrings;
  levels: Record<number, string>;
  badges: Record<string, LocalizedBadgeDef>;
  staticQuestions: Record<string, LocalizedStaticQuestion>;
}

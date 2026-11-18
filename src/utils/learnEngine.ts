import type { BabInfo, HadithItem, LanguageCode } from '../types';

export type SrsRating = 'again' | 'good' | 'easy';

export interface SrsCardState {
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: number;
  lastReviewedAt: number;
  lapses: number;
}

export type SrsProgressMap = Record<string, SrsCardState>;

export const SRS_STORAGE_KEY = 'sunen_adab_srs_v1';
const TEN_MINUTES_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function createInitialSrsState(cardId: string, nowMs = Date.now()): SrsCardState {
  return {
    cardId,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    dueAt: nowMs,
    lastReviewedAt: 0,
    lapses: 0,
  };
}

/**
 * Pure SM-2 inspired spaced repetition scheduler.
 */
export function reviewSrsCard(
  prev: SrsCardState | undefined,
  cardId: string,
  rating: SrsRating,
  nowMs = Date.now()
): SrsCardState {
  const current = prev ?? createInitialSrsState(cardId, nowMs);

  if (rating === 'again') {
    return {
      cardId,
      repetitions: 0,
      intervalDays: 0,
      easeFactor: Math.max(1.3, Number((current.easeFactor - 0.2).toFixed(2))),
      dueAt: nowMs + TEN_MINUTES_MS,
      lastReviewedAt: nowMs,
      lapses: current.lapses + 1,
    };
  }

  if (rating === 'good') {
    const nextReps = current.repetitions + 1;
    let nextIntervalDays = 1;
    if (current.repetitions === 0) {
      nextIntervalDays = 1;
    } else if (current.repetitions === 1) {
      nextIntervalDays = 3;
    } else {
      nextIntervalDays = Math.max(2, Math.round(current.intervalDays * current.easeFactor));
    }

    return {
      cardId,
      repetitions: nextReps,
      intervalDays: nextIntervalDays,
      easeFactor: current.easeFactor,
      dueAt: nowMs + nextIntervalDays * DAY_MS,
      lastReviewedAt: nowMs,
      lapses: current.lapses,
    };
  }

  // rating === 'easy'
  const nextReps = current.repetitions + 1;
  const nextEase = Math.min(3.2, Number((current.easeFactor + 0.15).toFixed(2)));
  let nextIntervalDays = 3;
  if (current.repetitions === 0) {
    nextIntervalDays = 3;
  } else if (current.repetitions === 1) {
    nextIntervalDays = 6;
  } else {
    nextIntervalDays = Math.max(4, Math.round(current.intervalDays * nextEase * 1.25));
  }

  return {
    cardId,
    repetitions: nextReps,
    intervalDays: nextIntervalDays,
    easeFactor: nextEase,
    dueAt: nowMs + nextIntervalDays * DAY_MS,
    lastReviewedAt: nowMs,
    lapses: current.lapses,
  };
}

export function isCardDue(state: SrsCardState | undefined, nowMs = Date.now()): boolean {
  if (!state) return true;
  return state.dueAt <= nowMs;
}

export function formatIntervalLabel(rating: SrsRating, prev: SrsCardState | undefined): string {
  const simulated = reviewSrsCard(prev, prev?.cardId ?? 'preview', rating, 0);
  if (simulated.intervalDays === 0) return '10 dk';
  if (simulated.intervalDays === 1) return '1 gün';
  return `${simulated.intervalDays} gün`;
}

export function loadSrsProgress(): SrsProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SRS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SrsProgressMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSrsProgress(map: SrsProgressMap): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors safely
  }
}

export type QuizMode = 'vocabulary' | 'hadith_bab' | 'encyclopedia' | 'mixed';

export interface QuizQuestion {
  id: string;
  mode: Exclude<QuizMode, 'mixed'>;
  prompt: string;
  arabicPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceLabel: string;
  hadithId?: number;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

interface EncyclopediaFactQuestion {
  id: string;
  prompt: string;
  arabicPrompt?: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
  referenceLabel: string;
}

const ENCYCLOPEDIA_BANK: EncyclopediaFactQuestion[] = [
  {
    id: 'enc-birth-death',
    prompt: 'Ebû Dâvûd es-Sicistânî’nin hicrî ve miladî doğum-vefat tarihleri aşağıdakilerden hangisidir?',
    correct: '202–275 / 817–889',
    distractors: ['194–256 / 810–870', '209–279 / 824–892', '215–303 / 830–915'],
    explanation:
      'TDV İslâm Ansiklopedisi’ne göre Ebû Dâvûd es-Sicistânî 202 (817) yılında Sicistan’da doğmuş, 16 Şevval 275’te (21 Şubat 889) Basra’da vefat etmiştir.',
    referenceLabel: 'TDV · Ebû Dâvûd es-Sicistânî',
  },
  {
    id: 'enc-sunen-ratio',
    prompt: 'Ebû Dâvûd yazdığı 500.000 hadis arasından es-Sünen’e kaç hadis seçmiştir?',
    correct: '4.800 hadis',
    distractors: ['7.275 hadis', '2.400 hadis', '12.000 hadis'],
    explanation:
      'Ebû Dâvûd, yazdığı 500.000 hadis içinden ahkâm ağırlıklı 4.800 hadisi seçerek es-Sünen’i telif ettiğini Mekke halkına yazdığı risâlede belirtir.',
    referenceLabel: 'TDV · es-Sünen (Mekke Mektubu)',
  },
  {
    id: 'enc-first-commentary',
    prompt: 'es-Sünen üzerine yazılan ilk meşhur şerh olan “Meâlimü’s-Sünen”in müellifi kimdir?',
    correct: 'Hattâbî (ö. 388/998)',
    distractors: [
      'Zekiyyüddin el-Münzirî (ö. 656/1258)',
      'Şemsülhak el-Azîmâbâdî (ö. 1329/1911)',
      'Halîl Ahmed es-Sehârenpûrî (ö. 1346/1927)',
    ],
    explanation:
      'Hattâbî’nin "Meâlimü’s-Sünen"i es-Sünen üzerine kaleme alınan ilk şerh olup Münzirî bu şerhi el-Muhtasar’da esas almıştır.',
    referenceLabel: 'TDV · es-Sünen Şerhleri',
  },
  {
    id: 'enc-basra-emir',
    prompt: 'Ebû Dâvûd’u Zenc isyanından sonra boşalan Basra’ya yerleşmeye ve ders vermeye davet eden Abbâsî emîri kimdir?',
    correct: 'Emîr Ebû Ahmed el-Muvaffak',
    distractors: ['Halife Hârûnürreşîd', 'Emîr Nâsırüddevle', 'Vezir Nizâmülmülk'],
    explanation:
      'Emîr el-Muvaffak bizzat Ebû Dâvûd’un evine giderek Basra’yı yeniden ilim merkezi yapmasını rica etmiş; Ebû Dâvûd ise emîrin oğullarına özel ders teklifini “ilim meclisinde herkes eşittir” diyerek şartlı kabul etmiştir.',
    referenceLabel: 'TDV · Ebû Dâvûd Hayatı',
  },
  {
    id: 'enc-silent-rule',
    prompt: 'Ebû Dâvûd’un Mekke halkına mektubuna göre, es-Sünen’de hakkında hiçbir şey söylemediği (sükût ettiği) hadisler için hükmü nedir?',
    correct: 'Sâlihtir (amel ve delil olmaya elverişlidir)',
    distractors: [
      'Münkerdir ve terk edilir',
      'Yalnızca tâbiî kavli (maktû) hükmündedir',
      'Buhârî’nin Sahîh’iyle aynı derecededir',
    ],
    explanation:
      'Ebû Dâvûd: "Kitabımda zikrettiğim şiddetli zayıflık taşıyan hadisleri açıkladım; hakkında bir şey söylemediğim hadisler sâlihtir (delil alınabilir)."',
    referenceLabel: 'TDV · es-Sünen (Sükût İlkesi)',
  },
  {
    id: 'enc-avvame-edition',
    prompt: 'Kitâbü’l-Edeb’in (4740–4777) bu atlasımızda esas alınan tahkikli neşri hangi muhakkik tarafından hazırlanmıştır?',
    correct: 'Muhammed Avvâme (5 cilt, Cidde-Beyrut 1998)',
    distractors: [
      'Muhammed Muhyiddin Abdülhamîd (Kahire 1935)',
      'İzzet Ubeyd ed-De‘‘âs (Humus 1969)',
      'Şuayb el-Arnaût (Dımaşk 2009)',
    ],
    explanation:
      'Hadis 4740–4777 metinleri ve hâşiye dipnotları Muhammed Avvâme’nin tahkikli neşrinden alınmıştır (PDF s. 264–279).',
    referenceLabel: 'TDV · es-Sünen Neşirleri',
  },
  {
    id: 'enc-three-masters',
    prompt: 'Ebû Dâvûd’un Bağdat ve diğer merkezlerde Ahmed b. Hanbel dışında bilhassa kendilerinden istifade ettiği üç büyük hadis münekkidi arasında kimler yer alır?',
    correct: 'Yahyâ b. Maîn ve Ali b. Medînî (ile Ahmed b. Hanbel)',
    distractors: [
      'İmam Mâlik ve İmam Şâfiî',
      'İbn Hibbân ve Hâkim en-Nîsâbûrî',
      'Dârekutnî ve Beyhakī',
    ],
    explanation:
      'Ebû Dâvûd: hadis hıfzında Yahyâ b. Maîn’i, fıkhî anlayışta Ahmed b. Hanbel’i, hadis illellerinde Ali b. Medînî’yi önde gördüğünü ifade etmiştir.',
    referenceLabel: 'TDV · Ebû Dâvûd Hocaları',
  },
  {
    id: 'enc-tomb-place',
    prompt: 'Ebû Dâvûd Basra’da vefat ettiğinde kimin kabrinin yanına defnedilmiştir?',
    correct: 'Süfyân es-Sevrî’nin kabrinin yanına',
    distractors: [
      'Hasan-ı Basrî’nin kabrinin yanına',
      'Ahmed b. Hanbel’in kabrinin yanına',
      'Buhârî’nin kabrinin yanına',
    ],
    explanation:
      '275 (889) yılında Basra’da vefat eden Ebû Dâvûd, büyük muhaddis ve fakih Süfyân es-Sevrî’nin kabrinin yanına defnedildi.',
    referenceLabel: 'TDV · Ebû Dâvûd Biyografisi',
  },
];

export function buildQuizQuestions(
  mode: QuizMode,
  hadiths: HadithItem[],
  babs: BabInfo[],
  language: LanguageCode = 'tr',
  seed = 1,
  count = 8
): QuizQuestion[] {
  const allWords = hadiths.flatMap((h) =>
    h.words.map((w) => ({ hadith: h, word: w }))
  );

  const vocabPool: QuizQuestion[] = allWords.map(({ hadith, word }, idx) => {
    const meaning = language === 'fr' ? word.meaningFr : word.meaningTr;
    const otherMeanings = seededShuffle(
      allWords
        .filter((item) => item.word.id !== word.id)
        .map((item) => (language === 'fr' ? item.word.meaningFr : item.word.meaningTr))
        .filter((m) => m !== meaning),
      seed + idx + 7
    ).slice(0, 3);

    const rawOptions = [meaning, ...otherMeanings];
    const shuffledOptions = seededShuffle(rawOptions, seed + idx * 13 + 3);
    const correctIndex = shuffledOptions.indexOf(meaning);

    return {
      id: `q-vocab-${word.id}`,
      mode: 'vocabulary',
      prompt: `Hadis #${hadith.id} içinde geçen bu kelimenin anlamı nedir?`,
      arabicPrompt: word.arabic,
      options: shuffledOptions,
      correctIndex,
      explanation: `${word.arabic} (${word.transliteration}) — Kök: ${word.root}. ${word.morphology}.`,
      referenceLabel: `Hadis #${hadith.id} · Kök: ${word.root}`,
      hadithId: hadith.id,
    };
  });

  const babPool: QuizQuestion[] = hadiths.map((hadith, idx) => {
    const correctBab = babs.find((b) => b.id === hadith.babId) ?? babs[0];
    const correctLabel = `${correctBab.numberLabel}: ${
      language === 'fr' ? correctBab.titleFr : correctBab.titleTr
    }`;
    const otherLabels = seededShuffle(
      babs
        .filter((b) => b.id !== correctBab.id)
        .map((b) => `${b.numberLabel}: ${language === 'fr' ? b.titleFr : b.titleTr}`),
      seed + idx * 17 + 5
    ).slice(0, 3);

    const shuffledOptions = seededShuffle([correctLabel, ...otherLabels], seed + idx * 19 + 11);
    const snippet =
      (language === 'fr' ? hadith.translationFr : hadith.translationTr).slice(0, 195) +
      ((language === 'fr' ? hadith.translationFr : hadith.translationTr).length > 195 ? '…' : '');

    return {
      id: `q-bab-${hadith.id}`,
      mode: 'hadith_bab',
      prompt: `Aşağıdaki hadis Kitâbü’l-Edeb’in hangi babında yer almaktadır? "${snippet}"`,
      arabicPrompt: hadith.matnAr,
      options: shuffledOptions,
      correctIndex: shuffledOptions.indexOf(correctLabel),
      explanation: `Hadis #${hadith.id} (PDF s. ${hadith.pdfPage}), ${correctBab.numberLabel} (${correctBab.titleTr}) içinde yer alır.`,
      referenceLabel: `Hadis #${hadith.id} · PDF s. ${hadith.pdfPage}`,
      hadithId: hadith.id,
    };
  });

  const encPool: QuizQuestion[] = ENCYCLOPEDIA_BANK.map((item, idx) => {
    const shuffledOptions = seededShuffle(
      [item.correct, ...item.distractors],
      seed + idx * 23 + 9
    );
    return {
      id: item.id,
      mode: 'encyclopedia',
      prompt: item.prompt,
      arabicPrompt: item.arabicPrompt,
      options: shuffledOptions,
      correctIndex: shuffledOptions.indexOf(item.correct),
      explanation: item.explanation,
      referenceLabel: item.referenceLabel,
    };
  });

  if (mode === 'vocabulary') {
    return seededShuffle(vocabPool, seed).slice(0, count);
  }
  if (mode === 'hadith_bab') {
    return seededShuffle(babPool, seed).slice(0, count);
  }
  if (mode === 'encyclopedia') {
    return seededShuffle(encPool, seed).slice(0, Math.min(count, encPool.length));
  }

  const combined = [
    ...seededShuffle(vocabPool, seed).slice(0, 3),
    ...seededShuffle(babPool, seed + 1).slice(0, 3),
    ...seededShuffle(encPool, seed + 2).slice(0, 2),
  ];
  return seededShuffle(combined, seed + 5).slice(0, count);
}

// ===========================================================================
// Interactive 9-Mode Quiz Engine & Gamification System
// ===========================================================================
import type {
  QuestionCategory,
  QuestionGameType,
  QuizBankItem,
} from '../data/questionBank';

export const GAMIFICATION_STORAGE_KEY = 'sunen_adab_gamification_v1';

export interface LevelTier {
  level: number;
  titleTr: string;
  minXp: number;
}

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, titleTr: 'Mübtedî Talebe', minXp: 0 },
  { level: 2, titleTr: 'Râvî Adayı', minXp: 150 },
  { level: 3, titleTr: 'Muhaddis Talebesi', minXp: 400 },
  { level: 4, titleTr: 'Mütebahhir', minXp: 800 },
  { level: 5, titleTr: 'Hâfız-ı Edeb', minXp: 1400 },
  { level: 6, titleTr: 'Sünen Üstadı', minXp: 2200 },
];

export interface BadgeDef {
  id: string;
  titleTr: string;
  descTr: string;
}

export const BADGE_DEFS: BadgeDef[] = [
  { id: 'first-step', titleTr: 'İlk Adım', descTr: 'İlk soruyu tamamladı' },
  { id: 'combo-5', titleTr: '5 Doğru Seri', descTr: 'Üst üste 5 soruyu hatasız bildi' },
  { id: 'scholar-50', titleTr: '50 Doğru Cevap', descTr: 'Toplam 50 doğru cevaba ulaştı' },
  { id: 'daily-goal', titleTr: 'Günlük Hedef', descTr: 'Günlük XP hedefini doldurdu' },
  { id: 'perfect-round', titleTr: 'Hatasız Tur', descTr: 'Bir oturumu %100 başarıyla tamamladı' },
  { id: 'city-traveler', titleTr: '14 Şehir Seyyahı', descTr: 'Seyahat haritası sorusunu doğru bildi' },
  { id: 'isnad-master', titleTr: 'İsnad Üstadı', descTr: 'İsnad sıralama sorusunu doğru çözdü' },
  { id: 'bab-explorer', titleTr: 'Kitâbü’l-Edeb Kaşifi', descTr: 'En az 5 farklı babtan soru çözdü' },
];

export interface BabMasteryStat {
  answered: number;
  correct: number;
}

export interface GamificationState {
  xp: number;
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  dailyGoalXp: number;
  todayXp: number;
  totalAnswered: number;
  totalCorrect: number;
  bestCombo: number;
  unlockedBadges: string[];
  babStats: Record<number, BabMasteryStat>;
  mistakeIds: string[];
  completedSessions: number;
}

export function getTodayDateStr(nowMs = Date.now()): string {
  const d = new Date(nowMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createInitialGamificationState(): GamificationState {
  return {
    xp: 0,
    streakDays: 0,
    lastStudyDate: '',
    dailyGoalXp: 150,
    todayXp: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    bestCombo: 0,
    unlockedBadges: [],
    babStats: {},
    mistakeIds: [],
    completedSessions: 0,
  };
}

export function loadGamificationState(): GamificationState {
  if (typeof window === 'undefined') return createInitialGamificationState();
  try {
    const raw = window.localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (!raw) return createInitialGamificationState();
    const parsed = JSON.parse(raw) as Partial<GamificationState>;
    const base = createInitialGamificationState();
    const today = getTodayDateStr();
    const sameDay = parsed.lastStudyDate === today;
    return {
      ...base,
      ...parsed,
      todayXp: sameDay ? (parsed.todayXp ?? 0) : 0,
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      babStats: parsed.babStats && typeof parsed.babStats === 'object' ? parsed.babStats : {},
      mistakeIds: Array.isArray(parsed.mistakeIds) ? parsed.mistakeIds : [],
    };
  } catch {
    return createInitialGamificationState();
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors safely
  }
}

export function getLevelForXp(xp: number): {
  current: LevelTier;
  next: LevelTier | null;
  progressPct: number;
} {
  let current = LEVEL_TIERS[0];
  let next: LevelTier | null = LEVEL_TIERS[1];
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      current = LEVEL_TIERS[i];
      next = LEVEL_TIERS[i + 1] ?? null;
    }
  }
  if (!next) {
    return { current, next: null, progressPct: 100 };
  }
  const span = next.minXp - current.minXp;
  const gained = xp - current.minXp;
  return {
    current,
    next,
    progressPct: Math.min(100, Math.max(0, Math.round((gained / span) * 100))),
  };
}

export function recordQuizOutcome(
  prev: GamificationState,
  question: QuizBankItem,
  isCorrect: boolean,
  nextCombo: number,
  timedMode: boolean,
  nowMs = Date.now()
): { nextState: GamificationState; newlyUnlocked: string[]; earnedXp: number } {
  const today = getTodayDateStr(nowMs);
  const yesterday = getTodayDateStr(nowMs - DAY_MS);

  const sameDay = prev.lastStudyDate === today;
  const continuedStreak = prev.lastStudyDate === yesterday;
  const streakDays = sameDay
    ? Math.max(1, prev.streakDays)
    : continuedStreak
      ? prev.streakDays + 1
      : 1;

  const baseXp = isCorrect ? 15 + Math.min(15, nextCombo * 3) + (timedMode ? 5 : 0) : 3;
  const newXp = prev.xp + baseXp;
  const newTodayXp = (sameDay ? prev.todayXp : 0) + baseXp;

  const nextBabStats = { ...prev.babStats };
  if (question.babId) {
    const cur = nextBabStats[question.babId] ?? { answered: 0, correct: 0 };
    nextBabStats[question.babId] = {
      answered: cur.answered + 1,
      correct: cur.correct + (isCorrect ? 1 : 0),
    };
  }

  let nextMistakeIds = [...prev.mistakeIds];
  if (!isCorrect) {
    if (!nextMistakeIds.includes(question.id)) {
      nextMistakeIds.push(question.id);
    }
  } else {
    nextMistakeIds = nextMistakeIds.filter((id) => id !== question.id);
  }

  const totalAnswered = prev.totalAnswered + 1;
  const totalCorrect = prev.totalCorrect + (isCorrect ? 1 : 0);
  const bestCombo = Math.max(prev.bestCombo, nextCombo);

  const badgeSet = new Set(prev.unlockedBadges);
  const newlyUnlocked: string[] = [];
  const unlock = (id: string) => {
    if (!badgeSet.has(id)) {
      badgeSet.add(id);
      newlyUnlocked.push(id);
    }
  };

  unlock('first-step');
  if (nextCombo >= 5) unlock('combo-5');
  if (totalCorrect >= 50) unlock('scholar-50');
  if (newTodayXp >= prev.dailyGoalXp) unlock('daily-goal');
  if (isCorrect && question.gameType === 'city_map') unlock('city-traveler');
  if (isCorrect && question.gameType === 'isnad_order') unlock('isnad-master');
  if (Object.keys(nextBabStats).length >= 5) unlock('bab-explorer');

  const nextState: GamificationState = {
    ...prev,
    xp: newXp,
    streakDays,
    lastStudyDate: today,
    todayXp: newTodayXp,
    totalAnswered,
    totalCorrect,
    bestCombo,
    unlockedBadges: Array.from(badgeSet),
    babStats: nextBabStats,
    mistakeIds: nextMistakeIds,
  };

  return { nextState, newlyUnlocked, earnedXp: baseXp };
}

export function finalizeQuizSession(
  prev: GamificationState,
  sessionTotal: number,
  sessionCorrect: number
): { nextState: GamificationState; newlyUnlocked: string[] } {
  const badgeSet = new Set(prev.unlockedBadges);
  const newlyUnlocked: string[] = [];
  if (sessionTotal >= 5 && sessionCorrect === sessionTotal && !badgeSet.has('perfect-round')) {
    badgeSet.add('perfect-round');
    newlyUnlocked.push('perfect-round');
  }
  return {
    nextState: {
      ...prev,
      completedSessions: prev.completedSessions + 1,
      unlockedBadges: Array.from(badgeSet),
    },
    newlyUnlocked,
  };
}

export type SessionLengthOption = 10 | 20 | 50 | 'all';

export function selectQuizSession(
  bank: QuizBankItem[],
  options: {
    category: QuestionCategory | 'all';
    gameType: QuestionGameType | 'all';
    length: SessionLengthOption;
    mistakesOnly?: boolean;
    mistakeIds?: string[];
    seed?: number;
  }
): QuizBankItem[] {
  const mistakeSet = new Set(options.mistakeIds ?? []);
  const filtered = bank.filter((item) => {
    if (options.mistakesOnly && !mistakeSet.has(item.id)) return false;
    if (options.category !== 'all' && item.category !== options.category) return false;
    if (options.gameType !== 'all' && item.gameType !== options.gameType) return false;
    return true;
  });

  const shuffled = seededShuffle(filtered, options.seed ?? 1);
  if (options.length === 'all') return shuffled;
  return shuffled.slice(0, options.length);
}


import hadislerRaw from '../data/hadisler.json';
import ebuDavudRaw from '../data/ebu-davud.json';
import sunenRaw from '../data/sunen.json';
import fullWordLexiconRaw from '../data/fullWordLexicon.json';
import { BABS, getBabById } from '../data/babs';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { QUESTION_BANK, type QuizBankItem } from '../data/questionBank';
import type {
  LearnTranslationPack,
  LearnUiStrings,
  LocalizedBadgeDef,
} from '../data/translations/learnTypes';
import type {
  EbuDavudData,
  FullWordLexiconEntry,
  HadithItem,
  IsnadNode,
  LanguageCode,
  SunenData,
} from '../types';
import { getLexiconKey } from './arabic';
import {
  getLocalizedBab,
  getLocalizedHadithContent,
  type HadithLanguagePack,
} from './hadithTranslations';
import {
  getLocalizedGlossaryTerm,
  getLocalizedNarratorDisplayName,
  getLocalizedPartOfSpeech,
  getLocalizedRootWordMorphology,
  getLocalizedWordMeaning,
  type GlossaryAndIsnadPack,
  type WordLexiconPack,
} from './lexiconTranslations';
import {
  getLocalizedEbuDavud,
  getLocalizedSunen,
  type ArticleTranslationPack,
} from './articleTranslations';
import {
  BADGE_DEFS,
  LEVEL_TIERS,
  reviewSrsCard,
  type SrsCardState,
  type SrsRating,
} from './learnEngine';

export type { LearnTranslationPack, LearnUiStrings, LocalizedBadgeDef };

const HADITHS = hadislerRaw as HadithItem[];
const EBU_DAVUD_TR = ebuDavudRaw as EbuDavudData;
const SUNEN_TR = sunenRaw as SunenData;
const FULL_LEXICON = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;

export const TR_LEARN_UI: LearnUiStrings = {
  learnPage: {
    levelShort: 'Lv.',
    srsStatLabel: 'SRS',
    xpUnit: 'XP',
    tabsAria: 'Öğrenme araçları',
    tabs: {
      quiz: 'Quiz',
      flashcards: 'SRS 3D',
      mastery: 'Hakimiyet',
      roots: 'Kök & Türevler',
      mindmap: 'Zihin Haritası',
    },
    loadingBank: 'Soru bankası yükleniyor...',
  },
  quiz: {
    categories: {
      all: 'Tümü',
      hadisler: '38 Hadis',
      ebu_davud: 'Ebû Dâvûd',
      sunen: 'es-Sünen',
      sozluk: 'Usûl Sözlüğü',
      bab_temalari: 'Bab Temaları',
    },
    gameTypes: {
      all: 'Tüm Oyunlar',
      multiple_choice: 'Çoktan Seçmeli',
      arabic_blank: 'Boşluk Doldurma',
      matching: 'Eşleştirme',
      word_order: 'Cümle Sıralama',
      isnad_order: 'İsnad Sıralama',
      which_bab: 'Hangi Bab?',
      audio_listening: 'Sesli Dinleme',
      true_false: 'Doğru / Yanlış',
      city_map: '14 Şehir Haritası',
    },
    lengthAll: 'Tümü',
    dailyGoal: 'Günlük Hedef',
    streak: 'Seri',
    mistakes: 'Yanlışlarım',
    categoryFilterAria: 'Soru kategorisi seçin',
    gameTypeLabel: 'Oyun Türü:',
    questionCountLabel: 'Soru:',
    timedModeLabel: 'Zamana Karşı',
    relaxedModeLabel: 'Rahat Mod',
    reviewMistakesBtn: 'Yanlışları Çalış',
    exitMistakesBtn: 'Yanlış Tekrarından Çık',
    poolPrefix: 'Havuz:',
    questionUnit: 'soru',
    emptyPoolTitle: 'Bu filtre kombinasyonunda soru bulunmuyor',
    emptyPoolDesc: 'Farklı bir kategori veya oyun türü seçerek devam edebilirsiniz.',
    showAllBtn: 'Tüm Soruları Göster',
    progressQuestion: 'Soru',
    comboSuffix: 'Seri',
    livesAria: 'Kalan can',
    secondsShort: 'sn',
    needsReviewBadge: 'Gözden geçirilecek',
    hintShowBtn: 'İpucu Göster',
    hintHideBtn: 'İpucunu Gizle',
    listenArabicHadith: 'Arapça Hadisi Dinle',
    audioHiddenHint: 'Sesli dinleme sorusu: Arapça metin gizlidir, dinleyip doğru karşılığı seçin.',
    trueLabel: 'Doğru',
    falseLabel: 'Yanlış',
    matchingInstruction: 'Soldaki öğeye tıklayıp sağdaki karşılığını seçin (veya sürükleyip bırakın):',
    matchingLeftCol: '1. Sütun',
    matchingRightCol: '2. Sütun',
    matchingCompleteBtn: 'Eşleştirmeyi Tamamla',
    matchingMatchedSuffix: 'eşleşti',
    matchingCorrectListLabel: 'Doğru Eşleştirme:',
    orderInstruction: 'Öğeleri doğru sıraya dizin (sürükle-bırak veya ↑ / ↓ düğmeleriyle):',
    orderMoveUpAria: 'Yukarı taşı',
    orderMoveDownAria: 'Aşağı taşı',
    orderCheckBtn: 'Sıralamayı Kontrol Et',
    orderCorrectLabel: 'Doğru Sıralama:',
    feedbackCorrect: 'Doğru Cevap!',
    feedbackWrong: 'Yanlış — Hata Defterine Kaydedildi',
    feedbackTimeout: 'Süre Doldu — Hata Defterine Kaydedildi',
    sourcePrefix: 'Kaynak:',
    finishSessionBtn: 'Oturumu Bitir & Raporu Gör',
    nextQuestionBtn: 'Sonraki Soru',
    summaryLivesOutTitle: 'Canlar Tükendi — Oturum Özeti',
    summaryDoneTitle: 'Oturum Tamamlandı',
    summaryCorrectLabel: 'Doğru',
    summaryEarnedXp: 'Kazanılan XP',
    summaryLongestCombo: 'En Uzun Seri',
    summaryUnlockedBadges: '★ Bu Oturumda Kazanılan Rozetler',
    summaryNewSessionBtn: 'Yeni Oturum Başlat',
    summaryRetryMistakesBtn: 'Yanlışları Tekrar Çalış',
  },
  cityMap: {
    headerBadge: 'Etkileşimli 14 Şehir Haritası — Doğru şehre tıklayın',
    svgAria: 'Ebû Dâvûd 14 şehir seçim haritası',
    regionMedAnatolia: 'Akdeniz & Anadolu',
    regionHijaz: 'Hicaz',
    regionSijistan: 'Sicistan & Horasan',
    legendCorrect: 'Doğru şehir',
    legendWrong: 'Seçiminiz',
    legendHint: '14 noktadan birine tıklayın',
  },
  flashcards: {
    deckWords: 'Kelime Kartları',
    deckHadiths: 'Hadis Kartları',
    allBabs: 'Tüm Bablar',
    dueOnly: 'Vakti Gelenler',
    allCards: 'Tümü',
    reviewedLabel: 'Görülen:',
    dueCountLabel: 'Vakti gelen:',
    learnedLabel: 'Öğrenilen:',
    emptyDueTitle: 'Tebrikler! Bugün vakti gelen kart kalmadı.',
    emptyDueDesc: 'Tekrar etmek için tüm kartları açabilir veya başka bir bab seçebilirsiniz.',
    showAllCardsBtn: 'Tüm Kartları Göster',
    swipeKnow: 'BİLDİM',
    swipeRepeat: 'TEKRAR',
    cardWordBadge: 'Kelime Kartı',
    cardHadithBadge: 'Hadis Kartı',
    rootLabel: 'Kök:',
    listenBtn: 'Dinle',
    showAnswerBtn: 'Cevabı Göster (Çevir)',
    swipeHintDesktop: 'Kaydır: Sağa = Bildim · Sola = Tekrar · Boşluk = Çevir',
    backWordBadge: 'Anlam & Sarf Analizi',
    backHadithBadge: 'Tercüme & Temel Ders',
    morphologyLabel: 'Sarf:',
    showFrontBtn: 'Ön Yüzü Göster',
    ratePrompt: 'Bu kartı ne kadar kolay hatırladınız?',
    rateAgain: 'Tekrar',
    rateHard: 'Zor',
    rateGood: 'İyi',
    rateEasy: 'Kolay',
    intervalTenMin: '10 dk',
    intervalOneDay: '1 gün',
    intervalDaysSuffix: 'gün',
    prevAria: 'Önceki kart',
    nextAria: 'Sonraki kart',
    hadithPrefix: 'Hadis',
  },
  mastery: {
    kpiTotalXp: 'Toplam XP',
    kpiDailyGoal: 'Günlük Hedef',
    kpiStreakUnit: 'gün seri',
    kpiAccuracy: 'Quiz Doğruluk',
    kpiCorrectUnit: 'doğru',
    kpiSrsCards: 'SRS Kartları',
    kpiMasteredUnit: 'öğrenildi',
    kpiDueUnit: 'bekliyor',
    chartHeading: '11 Bab Bazında Hakimiyet Grafiği',
    chartSubtitle: 'Okuma, dinleme, ezber ve quiz başarısına göre birleşik yüzde',
    resetProgressBtn: 'Quiz/SRS Sıfırla',
    resetConfirmBtn: 'Emin misiniz? Sıfırla',
    chartBabPrefix: 'Bab',
    chartScoreLabel: 'Hakimiyet',
    chartHadithsUnit: 'hadis',
    badgesHeading: 'Kazanılan Rozetler',
    mistakesHeading: 'Hata Defteri',
    mistakesPracticeBtn: 'Hataları Quizde Çalış',
    mistakesEmpty:
      'Şu an hata defterinizde bekleyen soru yok. Yanlış cevapladığınız sorular otomatik olarak buraya eklenir.',
    mistakesMoreSuffix: 'soru daha var — "Hataları Quizde Çalış" ile tümünü tekrar edebilirsiniz.',
    hadithPrefix: 'Hadis',
    xpUnit: 'XP',
  },
  gen: {
    hadBabPrompt: 'Hadis #{id} Kitâbü’l-Edeb’in hangi babında yer alır? "{tr}"',
    hadBabHint: 'PDF s. {page} · Anahtar kavram: {term}',
    hadBabExplanation: 'Hadis #{id} (PDF s. {page}), {babNum} ({babTitle}) babında yer alır.',
    hadBabSource: 'PDF s. {page} · Hadis #{id} · {babNum}',
    hadAudioPrompt: 'Arapça kaydı dinleyin ve Hadis #{id}’in doğru Türkçe tercümesini seçin:',
    hadAudioExplanation: 'Dinlediğiniz metin Hadis #{id}’tir: "{tr}"',
    hadSource: 'PDF s. {page} · Hadis #{id}',
    hadBlankPrompt: 'Hadis #{id} Arapça metnindeki boşluğu ("{meaning}") doğru kelimeyle tamamlayın:',
    hadBlankHint: 'Kök: {root} · Okunuş: [{translit}]',
    hadBlankExplanation: 'Boşluğa "{arabic}" ({meaning}) kelimesi gelir. Kök: {root}.',
    hadWordPrompt: 'Hadis #{id} içinde geçen "{arabic}" ({translit}) kelimesinin Türkçe anlamı nedir?',
    hadWordHint: 'Kök: {root} · Tür: {pos}',
    hadWordExplanation: '{arabic} ({translit}), {root} kökünden gelir ve "{meaning}" demektir ({morph}).',
    hadWordSource: 'PDF s. {page} · Hadis #{id} Kelime Analizi',
    hadIsnadPrompt: 'Hadis #{id}’in râvîlerini Hz. Peygamber’den (ﷺ) Ebû Dâvûd’a doğru doğru sıraya dizin:',
    hadIsnadDir: 'Hz. Peygamber ﷺ (1. Sıra) → Musannif Ebû Dâvûd (Son Sıra)',
    hadIsnadHint: 'Sahâbî tabakasında {sahabi} yer alır.',
    hadIsnadExplanation: 'Hadis #{id} sened sırası: {chain}.',
    hadIsnadSource: 'PDF s. {page} · Hadis #{id} İsnadı',
    hadWordOrderPrompt: 'Hadis #{id}’in Arapça metnini doğru sırayla dizin ("{tr}"):',
    hadWordOrderDir: 'Sağdan sola (1. kelimeden son kelimeye)',
    hadWordOrderHint: 'İlk kelime: {first}',
    hadWordOrderExplanation: 'Doğru sıralama: {matn}',
    hadMatchPrompt: 'Hadis #{id}’te geçen Arapça kelimeleri Türkçe anlamlarıyla eşleştirin:',
    hadMatchHint: 'Bu hadis {babNum} ({babTitle}) içindedir.',
    hadLessonPrompt: 'Hadis #{id}’ten çıkarılan başlıca hikmet/hüküm aşağıdakilerden hangisidir?',
    hadSahabiPrompt: 'Hadis #{id} ("{tr}") hangi sahâbî (veya ilk râvî) kanalıyla nakledilmiştir?',
    hadSahabiHint: 'Sened: {isnad}',
    hadSahabiExplanation: 'Hadis #{id}’in sahâbî tabakasında {name} ({nameAr}) yer almaktadır.',
    hadTfTruePrompt: 'Doğru mu Yanlış mı? Hadis #{id} ({tr}), {babNum} ({babTitle}) içinde ve PDF s. {page}’te yer alır.',
    hadTfFalsePrompt: 'Doğru mu Yanlış mı? Hadis #{id}, {babNum} ({babTitle}) içinde ve PDF s. {page}’te yer alır.',
    hadTfExplanation: 'Hadis #{id}, {babNum} ({babTitle}) içinde ve PDF sayfa {page}’te yer almaktadır.',

    edSayingAudioPrompt: 'Ebû Dâvûd maddesinde aktarılan bu Arapça söz/hadisin ({title}) Türkçe karşılığı nedir?',
    edSayingOrderPrompt: 'Ebû Dâvûd’a nispet edilen/seçtiği şu ifadeyi doğru sıraya dizin: "{text}"',
    edSayingOrderDir: 'Sağdan sola doğru sıralayın',
    edSayingTfPrompt: 'Doğru mu Yanlış mı? "{text}" hadisi, Ebû Dâvûd’un İslâm’ı anlamak için yeterli gördüğü dört temel hadisten biridir.',
    edSayingsSource: 'TDV · Ebû Dâvûd es-Sicistânî, s. 120',
    edCityPrompt: 'Haritada işaretli 14 şehir arasından bulun: ({num}/14) {role}. Dönem/Olay: {year} — {event}.',
    edCityHint: 'Bölge: {region} · Arapça adı: {nameAr}',
    edCitySource: 'TDV · Ebû Dâvûd Seyahatleri, s. 119-120',

    snMekkePrompt: 'Ebû Dâvûd’un Mekke halkına mektubundaki {order}. telif ilkesi aşağıdakilerden hangisinin açıklamasıdır? "{detail}"',
    snMekkeExplanation: '{order}. İlke — {title}: {detail}',
    snMekkeSource: 'TDV · es-Sünen (Mekke Mektubu), s. 145',
    snRawiPrompt: 'es-Sünen’in şu meşhur râvîsi kimdir? "{detail}" ({citation})',
    snRawiSource: 'TDV · es-Sünen ({citation}), s. 145',
    snRawiDistractorExtra: 'Hattâbî',
    snEdStatUnit: '{books} kitap · {babs} bab · {hadiths} hadis',
    snEdStatPrompt: '{edition} ({year}) neşrinde es-Sünen’in kitap, bab ve hadis sayısı kaçtır?',
    snEdStatSource: 'TDV · es-Sünen Neşirleri, s. 145-146',
    snCityPrompt: 'es-Sünen’in şu baskı özellikleriyle öne çıkan yayın merkezi hangisidir? "{highlight}" ({edition})',
    snCitySource: 'TDV · es-Sünen Baskıları, s. 146',
    snComPrompt: 'es-Sünen şerhlerinden hangisi şu özelliklere sahiptir? "{summary}"',
    snComHint: 'Kapsam: {scope}',
    snComSource: 'TDV · es-Sünen Şerhleri, s. 146',
    snIncPrompt: 'Yarım kalmış es-Sünen çalışmalarından "{title}" ({note}) kime aittir?',
    snIncSource: 'TDV · es-Sünen Yarım Kalmış Çalışmalar, s. 146',
    snStudyPrompt: 'es-Sünen üzerine yapılan bu "{kind}" çalışması hangisidir? "{summary}"',
    snStudySource: 'TDV · es-Sünen İhtisar & Araştırmaları, s. 146-147',

    glTermPrompt: 'Hadis usûlünde şu tanım hangi kavrama aittir? "{def}"',
    glTermHint: 'Kategori: {cat}',
    glTermSource: 'Hadis Usûlü Sözlüğü · {cat}',

    btThemePrompt: 'Kitâbü’l-Edeb’de "{subtitle}" temasını ve ({terms}) kavramlarını işleyen bab hangisidir?',
    btThemeHint: 'Hadis aralığı: #{start}–{end} · PDF s. {pages}',
    btThemeExplanation: '{babNum} ({babTitle} — {titleAr}), Hadis #{start}–{end} arasını içerir.',
    btSource: 'PDF s. {pages} · {babNum}',
    btRangeSingle: 'Hadis #{start} (1 hadis · PDF s. {pages})',
    btRangeMulti: 'Hadis #{start}–{end} ({count} hadis · PDF s. {pages})',
    btRangePrompt: '{babNum} ({babTitle}) hangi hadis numaralarını ve PDF sayfalarını kapsar?',
  },
};

const learnCache: Partial<Record<LanguageCode, LearnTranslationPack | null>> = {
  tr: null,
};

export function getCachedLearnPack(lang: LanguageCode): LearnTranslationPack | null {
  return learnCache[lang] ?? null;
}

export async function loadLearnPack(lang: LanguageCode): Promise<LearnTranslationPack | null> {
  if (lang === 'tr') return null;
  const existing = learnCache[lang];
  if (existing) return existing;

  let loaded: LearnTranslationPack;
  switch (lang) {
    case 'fr':
      loaded = (await import('../data/translations/learn.fr')).LEARN_PACK_FR;
      break;
    case 'de':
      loaded = (await import('../data/translations/learn.de')).LEARN_PACK_DE;
      break;
    case 'nl':
      loaded = (await import('../data/translations/learn.nl')).LEARN_PACK_NL;
      break;
    case 'ar':
      loaded = (await import('../data/translations/learn.ar')).LEARN_PACK_AR;
      break;
    default:
      return null;
  }
  learnCache[lang] = loaded;
  return loaded;
}

export function getLocalizedLearnUi(
  lang: LanguageCode,
  pack: LearnTranslationPack | null
): LearnUiStrings {
  if (lang === 'tr') return TR_LEARN_UI;
  return pack?.ui ?? TR_LEARN_UI;
}

export function getLocalizedLevelTitle(
  level: number,
  lang: LanguageCode,
  pack: LearnTranslationPack | null
): string {
  const def = LEVEL_TIERS.find((t) => t.level === level) ?? LEVEL_TIERS[0];
  if (lang === 'tr') return def.titleTr;
  return pack?.levels[level] ?? def.titleTr;
}

export function getLocalizedBadge(
  badgeId: string,
  lang: LanguageCode,
  pack: LearnTranslationPack | null
): LocalizedBadgeDef {
  const def = BADGE_DEFS.find((b) => b.id === badgeId);
  if (lang === 'tr') {
    return {
      title: def?.titleTr ?? badgeId,
      desc: def?.descTr ?? '',
    };
  }
  const loc = pack?.badges[badgeId];
  if (loc) return loc;
  return {
    title: def?.titleTr ?? badgeId,
    desc: def?.descTr ?? '',
  };
}

export function formatLocalizedIntervalLabel(
  rating: SrsRating,
  prev: SrsCardState | undefined,
  lang: LanguageCode,
  pack: LearnTranslationPack | null
): string {
  const ui = getLocalizedLearnUi(lang, pack).flashcards;
  const days = reviewSrsCard(prev, prev?.cardId ?? 'preview', rating, 0).intervalDays;
  if (days === 0) return ui.intervalTenMin;
  if (days === 1) return ui.intervalOneDay;
  return `${days} ${ui.intervalDaysSuffix}`;
}

function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  );
}

function truncate(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

function detPick<T>(arr: T[], startIdx: number, count: number): T[] {
  const uniquePool = Array.from(new Set(arr));
  const out: T[] = [];
  if (uniquePool.length === 0) return out;
  const used = new Set<number>();
  const step = uniquePool.length % 7 === 0 ? 3 : 7;
  let cursor = Math.abs(startIdx) % uniquePool.length;
  for (let i = 0; i < uniquePool.length && out.length < count; i++) {
    while (used.has(cursor)) {
      cursor = (cursor + 1) % uniquePool.length;
    }
    used.add(cursor);
    out.push(uniquePool[cursor]);
    cursor = (cursor + step) % uniquePool.length;
  }
  return out;
}

function stableOptionOrder(
  correct: string,
  distractors: string[],
  seed: number
): { options: string[]; correctIndex: number } {
  const uniqueDistractors = Array.from(new Set(distractors)).filter((d) => d && d !== correct);
  const items = [correct, ...uniqueDistractors.slice(0, 3)];
  const pos = Math.abs(seed) % items.length;
  const arranged = [...items.slice(1)];
  arranged.splice(pos, 0, correct);
  return { options: arranged, correctIndex: pos };
}

export interface LocalizedBankPacks {
  hadithPack: HadithLanguagePack | null;
  wordLexiconPack: WordLexiconPack | null;
  glossaryPack: GlossaryAndIsnadPack | null;
  articlePack: ArticleTranslationPack | null;
  learnPack: LearnTranslationPack | null;
  fallbackText?: string;
}

/**
 * Builds the full localized 300+ (418) question bank preserving exact IDs, categories,
 * game types, and answer indices across all 5 languages so mistake notebooks & stats
 * stay completely consistent when switching languages.
 */
export function buildLocalizedQuestionBank(
  lang: LanguageCode,
  packs: LocalizedBankPacks
): QuizBankItem[] {
  if (lang === 'tr') return QUESTION_BANK;

  const { hadithPack, wordLexiconPack, glossaryPack, articlePack, learnPack } = packs;
  const fallback = packs.fallbackText ?? '';
  if (!learnPack || !hadithPack || !wordLexiconPack || !glossaryPack || !articlePack) {
    return [];
  }

  const g = learnPack.ui.gen;
  const localizedEbuDavud = getLocalizedEbuDavud(EBU_DAVUD_TR, lang, articlePack) ?? EBU_DAVUD_TR;
  const localizedSunen = getLocalizedSunen(SUNEN_TR, lang, articlePack) ?? SUNEN_TR;

  const locBabMap = new Map(BABS.map((b) => [b.id, getLocalizedBab(b, lang, hadithPack)]));
  const locHadithMap = new Map(
    HADITHS.map((h) => [h.id, getLocalizedHadithContent(h, lang, hadithPack, fallback)])
  );
  const wordMeaning = (w: { meaningTr: string; meaningFr: string }) =>
    getLocalizedWordMeaning(w, lang, wordLexiconPack, fallback);

  // Pre-build unique localized word meanings pool for distractors
  const allWordsPool = HADITHS.flatMap((h) => h.words);

  // Map every generated ID so we can preserve EXACT order and IDs of QUESTION_BANK
  const generatedById = new Map<string, QuizBankItem>();

  // 1. HADISLER (228 questions)
  HADITHS.forEach((h, hIdx) => {
    const bab = getBabById(h.babId) ?? BABS[0];
    const locBab = locBabMap.get(bab.id)!;
    const locH = locHadithMap.get(h.id)!;
    const sahabiNode = h.isnadChain.find((n) => n.layer === 'sahabi');
    const primaryWord = h.words[0];
    const secondaryWord = h.words[1] || h.words[0];

    // Q1: Which Bab OR Audio Listening
    if (hIdx % 2 === 0) {
      const otherBabs = detPick(
        BABS.filter((b) => b.id !== bab.id).map((b) => {
          const lb = locBabMap.get(b.id)!;
          return `${lb.numberLabel}: ${lb.title}`;
        }),
        hIdx + 3,
        3
      );
      const correctBabOpt = `${locBab.numberLabel}: ${locBab.title}`;
      const { options, correctIndex } = stableOptionOrder(correctBabOpt, otherBabs, h.id + 1);
      generatedById.set(`had-${h.id}-bab`, {
        id: `had-${h.id}-bab`,
        category: 'hadisler',
        gameType: 'which_bab',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadBabPrompt, { id: h.id, tr: truncate(locH.translation, 165) }),
        arabicPrompt: h.matnAr,
        options,
        correctIndex,
        hint: fmt(g.hadBabHint, { page: h.pdfPage, term: bab.keyArabicTerms[0] }),
        explanation: fmt(g.hadBabExplanation, {
          id: h.id,
          page: h.pdfPage,
          babNum: locBab.numberLabel,
          babTitle: locBab.title,
        }),
        sourceRef: fmt(g.hadBabSource, {
          page: h.pdfPage,
          id: h.id,
          babNum: locBab.numberLabel,
        }),
        needs_review: h.needs_review,
      });
    } else {
      const otherTrs = detPick(
        HADITHS.filter((x) => x.id !== h.id).map((x) =>
          truncate(locHadithMap.get(x.id)!.translation, 130)
        ),
        hIdx + 5,
        3
      );
      const correctTr = truncate(locH.translation, 130);
      const { options, correctIndex } = stableOptionOrder(correctTr, otherTrs, h.id + 2);
      generatedById.set(`had-${h.id}-audio`, {
        id: `had-${h.id}-audio`,
        category: 'hadisler',
        gameType: 'audio_listening',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadAudioPrompt, { id: h.id }),
        arabicPrompt: h.matnAr,
        options,
        correctIndex,
        hint: `${locBab.numberLabel}: ${locBab.title}`,
        explanation: fmt(g.hadAudioExplanation, {
          id: h.id,
          tr: truncate(locH.translation, 160),
        }),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
        needs_review: h.needs_review,
      });
    }

    // Q2: Arabic Blank
    if (primaryWord) {
      const matnTokens = h.matnAr.split(/\s+/);
      const targetKey = getLexiconKey(primaryWord.arabic);
      const matchTok = matnTokens.find((t) => getLexiconKey(t) === targetKey);
      const blanked = matchTok
        ? h.matnAr.replace(matchTok, ' [ ــــــــ ] ')
        : `${truncate(h.matnAr, 90)} [ ــــــــ ]`;
      const otherArWords = detPick(
        allWordsPool
          .filter((w) => getLexiconKey(w.arabic) !== targetKey)
          .map((w) => w.arabic),
        hIdx * 3 + 2,
        3
      );
      const { options, correctIndex } = stableOptionOrder(
        primaryWord.arabic,
        otherArWords,
        h.id + 3
      );
      const pMeaning = wordMeaning(primaryWord);
      generatedById.set(`had-${h.id}-blank`, {
        id: `had-${h.id}-blank`,
        category: 'hadisler',
        gameType: 'arabic_blank',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadBlankPrompt, { id: h.id, meaning: pMeaning }),
        blankSentenceAr: blanked,
        options,
        correctIndex,
        hint: fmt(g.hadBlankHint, {
          root: primaryWord.root,
          translit: lang === 'ar' ? primaryWord.arabic : primaryWord.transliteration,
        }),
        explanation: fmt(g.hadBlankExplanation, {
          arabic: primaryWord.arabic,
          meaning: pMeaning,
          root: primaryWord.root,
        }),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
        needs_review: primaryWord.needs_review || h.needs_review,
      });
    }

    // Q3: Word Meaning / Root Analysis
    if (secondaryWord) {
      const sMeaning = wordMeaning(secondaryWord);
      const sPos = getLocalizedPartOfSpeech(secondaryWord.partOfSpeech, lang, wordLexiconPack);
      const sMorph = getLocalizedRootWordMorphology(
        secondaryWord,
        FULL_LEXICON,
        lang,
        wordLexiconPack,
        sPos
      );
      const otherMeanings = detPick(
        allWordsPool
          .map((w) => wordMeaning(w))
          .filter((m) => m && m !== sMeaning),
        hIdx * 5 + 1,
        3
      );
      const { options, correctIndex } = stableOptionOrder(sMeaning, otherMeanings, h.id + 4);
      generatedById.set(`had-${h.id}-word`, {
        id: `had-${h.id}-word`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadWordPrompt, {
          id: h.id,
          arabic: secondaryWord.arabic,
          translit: lang === 'ar' ? secondaryWord.root : secondaryWord.transliteration,
        }),
        arabicPrompt: secondaryWord.arabic,
        options,
        correctIndex,
        hint: fmt(g.hadWordHint, {
          root: secondaryWord.root,
          pos: sPos,
        }),
        explanation: fmt(g.hadWordExplanation, {
          arabic: secondaryWord.arabic,
          translit: lang === 'ar' ? secondaryWord.root : secondaryWord.transliteration,
          root: secondaryWord.root,
          meaning: sMeaning,
          morph: sMorph || sPos,
        }),
        sourceRef: fmt(g.hadWordSource, { page: h.pdfPage, id: h.id }),
        needs_review: secondaryWord.needs_review,
      });
    }

    // Q4: Isnad Order
    const orderedChain = [...h.isnadChain]
      .reverse()
      .slice(0, 6)
      .map((n: IsnadNode) => getLocalizedNarratorDisplayName(n, lang));
    const locSahabiName = sahabiNode
      ? getLocalizedNarratorDisplayName(sahabiNode, lang)
      : undefined;
    generatedById.set(`had-${h.id}-isnad-order`, {
      id: `had-${h.id}-isnad-order`,
      category: 'hadisler',
      gameType: 'isnad_order',
      babId: h.babId,
      hadithId: h.id,
      prompt: fmt(g.hadIsnadPrompt, { id: h.id }),
      orderedItems: orderedChain,
      orderDirectionLabel: g.hadIsnadDir,
      hint: locSahabiName ? fmt(g.hadIsnadHint, { sahabi: locSahabiName }) : undefined,
      explanation: fmt(g.hadIsnadExplanation, {
        id: h.id,
        chain: orderedChain.join(' → '),
      }),
      sourceRef: fmt(g.hadIsnadSource, { page: h.pdfPage, id: h.id }),
      needs_review: h.needs_review,
    });

    // Q5: Word Order / Matching / Lesson
    const cleanMatnWords = h.matnAr
      .replace(/[«»"'().,،؛:؟!]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (cleanMatnWords.length >= 4 && cleanMatnWords.length <= 7) {
      generatedById.set(`had-${h.id}-wordorder`, {
        id: `had-${h.id}-wordorder`,
        category: 'hadisler',
        gameType: 'word_order',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadWordOrderPrompt, {
          id: h.id,
          tr: truncate(locH.translation, 95),
        }),
        orderedItems: cleanMatnWords,
        orderDirectionLabel: g.hadWordOrderDir,
        hint: fmt(g.hadWordOrderHint, { first: cleanMatnWords[0] }),
        explanation: fmt(g.hadWordOrderExplanation, { matn: h.matnAr }),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
        needs_review: h.needs_review,
      });
    } else if (h.words.length >= 4) {
      const sampleWords = h.words.slice(0, 4);
      generatedById.set(`had-${h.id}-match`, {
        id: `had-${h.id}-match`,
        category: 'hadisler',
        gameType: 'matching',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadMatchPrompt, { id: h.id }),
        pairs: sampleWords.map((w, idx) => ({
          id: `p-${h.id}-${idx}`,
          left: w.arabic,
          right: wordMeaning(w),
        })),
        hint: fmt(g.hadMatchHint, { babNum: locBab.numberLabel, babTitle: locBab.title }),
        explanation: sampleWords.map((w) => `${w.arabic}: ${wordMeaning(w)}`).join(' · '),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
      });
    } else {
      const lessonCorrect = locH.lessons[0] || locBab.subtitle;
      const otherLessons = detPick(
        HADITHS.filter((x) => x.id !== h.id)
          .map((x) => locHadithMap.get(x.id)!.lessons[0])
          .filter((l): l is string => Boolean(l && l !== lessonCorrect)),
        hIdx + 9,
        3
      );
      const { options, correctIndex } = stableOptionOrder(lessonCorrect, otherLessons, h.id + 5);
      generatedById.set(`had-${h.id}-lesson`, {
        id: `had-${h.id}-lesson`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadLessonPrompt, { id: h.id }),
        options,
        correctIndex,
        explanation: lessonCorrect,
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
      });
    }

    // Q6: Sahabi MC or True/False
    if (hIdx % 2 === 0 && sahabiNode && locSahabiName) {
      const otherSahabis = detPick(
        Array.from(
          new Set(
            HADITHS.map((x) => {
              const s = x.isnadChain.find((n) => n.layer === 'sahabi');
              return s ? getLocalizedNarratorDisplayName(s, lang) : '';
            }).filter((n) => Boolean(n && n !== locSahabiName))
          )
        ),
        hIdx + 4,
        3
      );
      const { options, correctIndex } = stableOptionOrder(locSahabiName, otherSahabis, h.id + 6);
      generatedById.set(`had-${h.id}-sahabi`, {
        id: `had-${h.id}-sahabi`,
        category: 'hadisler',
        gameType: 'multiple_choice',
        babId: h.babId,
        hadithId: h.id,
        prompt: fmt(g.hadSahabiPrompt, { id: h.id, tr: truncate(locH.translation, 90) }),
        options,
        correctIndex,
        hint: fmt(g.hadSahabiHint, { isnad: truncate(h.isnadAr, 85) }),
        explanation: fmt(g.hadSahabiExplanation, {
          id: h.id,
          name: locSahabiName,
          nameAr: sahabiNode.nameAr,
        }),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
      });
    } else {
      const makeTrue = hIdx % 4 === 1;
      const shownPage = makeTrue ? h.pdfPage : h.pdfPage === 279 ? 264 : h.pdfPage + 3;
      const shownBabObj = makeTrue ? bab : BABS[(bab.id + 2) % BABS.length];
      const shownLocBab = locBabMap.get(shownBabObj.id)!;
      generatedById.set(`had-${h.id}-tf`, {
        id: `had-${h.id}-tf`,
        category: 'hadisler',
        gameType: 'true_false',
        babId: h.babId,
        hadithId: h.id,
        prompt: makeTrue
          ? fmt(g.hadTfTruePrompt, {
              id: h.id,
              tr: truncate(locH.translation, 85),
              babNum: locBab.numberLabel,
              babTitle: locBab.title,
              page: h.pdfPage,
            })
          : fmt(g.hadTfFalsePrompt, {
              id: h.id,
              babNum: shownLocBab.numberLabel,
              babTitle: shownLocBab.title,
              page: shownPage,
            }),
        correctBool: makeTrue,
        explanation: fmt(g.hadTfExplanation, {
          id: h.id,
          babNum: locBab.numberLabel,
          babTitle: locBab.title,
          page: h.pdfPage,
        }),
        sourceRef: fmt(g.hadSource, { page: h.pdfPage, id: h.id }),
      });
    }
  });

  // 2. EBU DAVUD GENERATED (7 sayings + 14 city_map)
  localizedEbuDavud.sayingsAndFourHadiths.forEach((q, idx) => {
    if (idx % 2 === 0) {
      const distractors = detPick(
        localizedEbuDavud.sayingsAndFourHadiths
          .filter((x) => x.id !== q.id)
          .map((x) => x.textTr),
        idx + 2,
        3
      );
      const { options, correctIndex } = stableOptionOrder(q.textTr, distractors, idx + 40);
      generatedById.set(`ed-saying-${q.id}`, {
        id: `ed-saying-${q.id}`,
        category: 'ebu_davud',
        gameType: 'audio_listening',
        prompt: fmt(g.edSayingAudioPrompt, { title: q.titleTr }),
        arabicPrompt: q.textAr,
        options,
        correctIndex,
        explanation: `${q.titleTr}: "${q.textAr}" → "${q.textTr}".`,
        sourceRef: g.edSayingsSource,
      });
    } else {
      const words = q.textAr.replace(/[.,،]/g, '').split(/\s+/).filter(Boolean);
      if (words.length <= 8) {
        generatedById.set(`ed-saying-order-${q.id}`, {
          id: `ed-saying-order-${q.id}`,
          category: 'ebu_davud',
          gameType: 'word_order',
          prompt: fmt(g.edSayingOrderPrompt, { text: q.textTr }),
          orderedItems: words,
          orderDirectionLabel: g.edSayingOrderDir,
          explanation: `${q.titleTr}: ${q.textAr} (${q.textTr})`,
          sourceRef: g.edSayingsSource,
        });
      } else {
        generatedById.set(`ed-saying-tf-${q.id}`, {
          id: `ed-saying-tf-${q.id}`,
          category: 'ebu_davud',
          gameType: 'true_false',
          prompt: fmt(g.edSayingTfPrompt, { text: q.textTr }),
          correctBool: q.kind === 'four_hadiths',
          explanation: `${q.titleTr}: "${q.textTr}".`,
          sourceRef: g.edSayingsSource,
        });
      }
    }
  });

  localizedEbuDavud.cities.forEach((city, idx) => {
    generatedById.set(`ed-citymap-${city.id}`, {
      id: `ed-citymap-${city.id}`,
      category: 'ebu_davud',
      gameType: 'city_map',
      targetCityId: city.id,
      prompt: fmt(g.edCityPrompt, {
        num: idx + 1,
        role: city.roleTr,
        year: city.yearText,
        event: city.teachersOrEvents[0] ?? '',
      }),
      hint: fmt(g.edCityHint, { region: city.region, nameAr: city.nameAr }),
      explanation:
        lang === 'ar'
          ? `${city.nameAr}: ${city.detailsTr}`
          : `${city.nameTr} (${city.nameAr}): ${city.detailsTr}`,
      sourceRef: g.edCitySource,
    });
  });

  // 3. SUNEN GENERATED (42 questions)
  localizedSunen.compilationAndPurpose.mekkeLetter.principles.forEach((p, idx) => {
    const distractors = detPick(
      localizedSunen.compilationAndPurpose.mekkeLetter.principles
        .filter((x) => x.order !== p.order)
        .map((x) => x.titleTr),
      idx + 1,
      3
    );
    const { options, correctIndex } = stableOptionOrder(p.titleTr, distractors, idx + 70);
    generatedById.set(`sn-mekke-p${p.order}`, {
      id: `sn-mekke-p${p.order}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snMekkePrompt, { order: p.order, detail: p.detailTr }),
      options,
      correctIndex,
      explanation: fmt(g.snMekkeExplanation, {
        order: p.order,
        title: p.titleTr,
        detail: p.detailTr,
      }),
      sourceRef: g.snMekkeSource,
    });
  });

  localizedSunen.authenticityAndStructure.rawis.forEach((r, idx) => {
    const others = localizedSunen.authenticityAndStructure.rawis
      .filter((x) => x.id !== r.id)
      .map((x) => x.nameTr);
    const { options, correctIndex } = stableOptionOrder(
      r.nameTr,
      [...others, g.snRawiDistractorExtra],
      idx + 80
    );
    generatedById.set(`sn-rawi-${r.id}`, {
      id: `sn-rawi-${r.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snRawiPrompt, { detail: r.detailTr, citation: r.citation }),
      options,
      correctIndex,
      explanation: `${r.nameTr}: ${r.detailTr}`,
      sourceRef: fmt(g.snRawiSource, { citation: r.citation }),
    });
  });

  localizedSunen.editionStats.forEach((ed, idx) => {
    const statsStr = fmt(g.snEdStatUnit, {
      books: ed.books,
      babs: ed.babs,
      hadiths: ed.hadiths,
    });
    const distractors = localizedSunen.editionStats
      .filter((x) => x.id !== ed.id)
      .map((x) =>
        fmt(g.snEdStatUnit, { books: x.books, babs: x.babs, hadiths: x.hadiths })
      );
    const { options, correctIndex } = stableOptionOrder(statsStr, distractors, idx + 90);
    generatedById.set(`sn-edstat-${ed.id}`, {
      id: `sn-edstat-${ed.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snEdStatPrompt, { edition: ed.editionName, year: ed.yearText }),
      options,
      correctIndex,
      explanation: ed.detailsTr,
      sourceRef: g.snEdStatSource,
    });
  });

  localizedSunen.printCities.slice(0, 6).forEach((pc, idx) => {
    const distractors = detPick(
      localizedSunen.printCities
        .filter((x) => x.id !== pc.id)
        .map((x) => `${x.cityTr} (${x.countryTr})`),
      idx + 2,
      3
    );
    const correct = `${pc.cityTr} (${pc.countryTr})`;
    const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 110);
    generatedById.set(`sn-city-${pc.id}`, {
      id: `sn-city-${pc.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snCityPrompt, {
        highlight: pc.highlightTr,
        edition: pc.editions[0] ?? '',
      }),
      options,
      correctIndex,
      explanation: `${pc.cityTr}: ${pc.editions.join(' | ')}`,
      sourceRef: g.snCitySource,
    });
  });

  localizedSunen.commentaries.forEach((com, idx) => {
    const distractors = detPick(
      localizedSunen.commentaries
        .filter((x) => x.id !== com.id)
        .map((x) => `${x.author} — ${x.title}`),
      idx + 3,
      3
    );
    const correct = `${com.author} — ${com.title}`;
    const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 130);
    generatedById.set(`sn-com-${com.id}`, {
      id: `sn-com-${com.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snComPrompt, { summary: truncate(com.summaryTr, 175) }),
      options,
      correctIndex,
      hint: fmt(g.snComHint, { scope: com.madhhabOrScope }),
      explanation: `${com.author}, ${com.title}: ${com.summaryTr}`,
      sourceRef: g.snComSource,
    });
  });

  localizedSunen.incompleteWorks.forEach((inc, idx) => {
    const distractors = detPick(
      localizedSunen.incompleteWorks.filter((x) => x.id !== inc.id).map((x) => x.author),
      idx + 1,
      3
    );
    const { options, correctIndex } = stableOptionOrder(inc.author, distractors, idx + 150);
    generatedById.set(`sn-inc-${inc.id}`, {
      id: `sn-inc-${inc.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snIncPrompt, { title: inc.title, note: inc.extentOrNoteTr }),
      options,
      correctIndex,
      explanation: `${inc.author} — ${inc.title}: ${inc.extentOrNoteTr} (${inc.manuscriptOrCitation}).`,
      sourceRef: g.snIncSource,
    });
  });

  localizedSunen.abridgementsAndStudies.forEach((st, idx) => {
    const distractors = detPick(
      localizedSunen.abridgementsAndStudies
        .filter((x) => x.id !== st.id)
        .map((x) => `${x.author} — ${x.title}`),
      idx + 2,
      3
    );
    const correct = `${st.author} — ${st.title}`;
    const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 170);
    generatedById.set(`sn-study-${st.id}`, {
      id: `sn-study-${st.id}`,
      category: 'sunen',
      gameType: 'multiple_choice',
      prompt: fmt(g.snStudyPrompt, {
        kind: st.kindLabelTr,
        summary: truncate(st.summaryTr, 160),
      }),
      options,
      correctIndex,
      explanation: `${st.author}, ${st.title}: ${st.summaryTr} (${st.publicationInfo}).`,
      sourceRef: g.snStudySource,
    });
  });

  // 4. GLOSSARY GENERATED (18 questions)
  const locGlossaryTerms = GLOSSARY_TERMS.map((term) => ({
    raw: term,
    loc: getLocalizedGlossaryTerm(term, lang, glossaryPack, fallback),
  }));
  locGlossaryTerms.forEach(({ raw, loc }, idx) => {
    const distractors = detPick(
      locGlossaryTerms.filter((x) => x.raw.id !== raw.id).map((x) => x.loc.term),
      idx + 2,
      3
    );
    const { options, correctIndex } = stableOptionOrder(loc.term, distractors, idx + 200);
    generatedById.set(`gl-term-${raw.id}`, {
      id: `gl-term-${raw.id}`,
      category: 'sozluk',
      gameType: 'multiple_choice',
      prompt: fmt(g.glTermPrompt, { def: truncate(loc.definition, 190) }),
      arabicPrompt: raw.termAr,
      options,
      correctIndex,
      hint: fmt(g.glTermHint, { cat: loc.categoryLabel }),
      explanation:
        lang === 'ar'
          ? `${loc.term}: ${loc.definition}`
          : `${loc.term} (${raw.termAr}): ${loc.definition}`,
      sourceRef: fmt(g.glTermSource, { cat: loc.categoryLabel }),
    });
  });

  // 5. BAB THEMES GENERATED (22 questions)
  BABS.forEach((bab, idx) => {
    const locBab = locBabMap.get(bab.id)!;
    const distractors = detPick(
      BABS.filter((b) => b.id !== bab.id).map((b) => {
        const lb = locBabMap.get(b.id)!;
        return `${lb.numberLabel}: ${lb.title}`;
      }),
      idx + 2,
      3
    );
    const correct = `${locBab.numberLabel}: ${locBab.title}`;
    const { options, correctIndex } = stableOptionOrder(correct, distractors, idx + 300);

    generatedById.set(`bt-bab-${bab.id}-theme`, {
      id: `bt-bab-${bab.id}-theme`,
      category: 'bab_temalari',
      gameType: 'which_bab',
      babId: bab.id,
      prompt: fmt(g.btThemePrompt, {
        subtitle: locBab.subtitle,
        terms: bab.keyArabicTerms.join(' · '),
      }),
      arabicPrompt: bab.titleAr,
      options,
      correctIndex,
      hint: fmt(g.btThemeHint, {
        start: bab.hadithStart,
        end: bab.hadithEnd,
        pages: bab.pdfPages,
      }),
      explanation: fmt(g.btThemeExplanation, {
        babNum: locBab.numberLabel,
        babTitle: locBab.title,
        titleAr: bab.titleAr,
        start: bab.hadithStart,
        end: bab.hadithEnd,
      }),
      sourceRef: fmt(g.btSource, { pages: bab.pdfPages, babNum: locBab.numberLabel }),
    });

    const formatRange = (b: typeof bab) =>
      b.hadithStart === b.hadithEnd
        ? fmt(g.btRangeSingle, { start: b.hadithStart, pages: b.pdfPages })
        : fmt(g.btRangeMulti, {
            start: b.hadithStart,
            end: b.hadithEnd,
            count: b.hadithCount,
            pages: b.pdfPages,
          });
    const rangeStr = formatRange(bab);
    const rangeDistractors = detPick(
      BABS.filter((b) => b.id !== bab.id).map(formatRange),
      idx + 4,
      3
    );
    const rangeOpt = stableOptionOrder(rangeStr, rangeDistractors, idx + 320);

    generatedById.set(`bt-bab-${bab.id}-range`, {
      id: `bt-bab-${bab.id}-range`,
      category: 'bab_temalari',
      gameType: 'multiple_choice',
      babId: bab.id,
      prompt: fmt(g.btRangePrompt, { babNum: locBab.numberLabel, babTitle: locBab.title }),
      options: rangeOpt.options,
      correctIndex: rangeOpt.correctIndex,
      explanation: `${locBab.numberLabel}: ${rangeStr}.`,
      sourceRef: fmt(g.btSource, { pages: bab.pdfPages, babNum: locBab.numberLabel }),
    });
  });

  // Assemble in exact QUESTION_BANK order combining generated + static translations
  return QUESTION_BANK.map((baseQ): QuizBankItem => {
    const gen = generatedById.get(baseQ.id);
    if (gen) return gen;

    const st = learnPack.staticQuestions[baseQ.id];
    if (st) {
      return {
        ...baseQ,
        prompt: st.prompt,
        options: st.options ?? baseQ.options,
        pairs: st.pairs ?? baseQ.pairs,
        orderedItems: st.orderedItems ?? baseQ.orderedItems,
        orderDirectionLabel: st.orderDirectionLabel ?? baseQ.orderDirectionLabel,
        hint: st.hint ?? baseQ.hint,
        explanation: st.explanation,
        sourceRef: st.sourceRef,
      };
    }

    // Should never happen when staticQuestions has 100% coverage; never leak Turkish
    return {
      ...baseQ,
      prompt: fallback || baseQ.id,
      explanation: fallback || baseQ.id,
      sourceRef: baseQ.sourceRef,
    };
  });
}

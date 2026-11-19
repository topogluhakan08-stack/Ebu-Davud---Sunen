import type { GlossaryCategory, GlossaryEntry } from '../data/glossaryData';
import type {
  GlossaryAndIsnadPack,
  LocalizedGlossaryTerm,
  LocalizedIsnadUi,
  WordLexiconPack,
} from '../data/translations/lexiconTypes';
import type {
  FullWordLexiconEntry,
  IsnadNode,
  LanguageCode,
  WordAnalysis,
} from '../types';
import { getLexiconKey } from './arabic';

export type {
  GlossaryAndIsnadPack,
  LocalizedGlossaryTerm,
  LocalizedIsnadUi,
  WordLexiconPack,
};

const NO_PDF_BIO_TR = "PDF'te bilgi yok";

export const TR_GLOSSARY_CATEGORIES: Record<GlossaryCategory, string> = {
  sened_sihhat: 'Sened & Sıhhat',
  telif_turleri: 'Telif & Sünen Türleri',
  tahkik_hasiye: 'Tahkik & Hâşiye',
};

export const TR_NARRATOR_LAYERS: Record<IsnadNode['layer'], string> = {
  prophet: 'Kaynak · Nübüvvet',
  sahabi: 'Sahâbî Tabakası',
  tabiin: 'Tâbiîn Tabakası',
  etba: 'Etbâü’t-Tâbiîn / Şeyh',
  musannif: 'Musannif (Ebû Dâvûd)',
};

export const TR_ISNAD_UI: LocalizedIsnadUi = {
  treeTitle: 'Klasik İsnad Ağacı',
  narratorNodeUnit: 'Râvî Düğümü',
  multiTarikBadge: 'Çoklu Tarîk',
  cautionBadge: 'İsnad Notu',
  dirProphetToMusannif: 'Hz. Peygamber’den Ebû Dâvûd’a',
  dirMusannifToProphet: 'Ebû Dâvûd’dan Kaynağa',
  zoomInAria: 'İsnad şemasını yakınlaştır',
  zoomOutAria: 'İsnad şemasını uzaklaştır',
  resetZoomAria: 'İsnad şeması yakınlaştırmasını sıfırla',
  collapseBtn: 'Küçült',
  fullscreenBtn: 'Tam Ekran Aç',
  tabakaSuffix: '. Tabaka',
  dragHint: 'Sürükleyin · Yakınlaştırın · Ayrıntı için bir râvîye tıklayın',
  closeBtn: 'Kapat',
  closeNarratorAria: 'Râvî detayını kapat',
  whoIsLabel: 'Kimdir (PDF Kayıtları):',
  otherHadithsPrefix: 'Bu râvî başka hangi hadislerde geçiyor?',
  otherHadithsUnit: 'hadis',
  noOtherHadiths: 'Seçili 38 hadislik bölümde bu râvînin geçtiği başka bir rivayet bulunmuyor.',
  moreHadithsSuffix: 'hadis daha',
  fullArabicIsnadHeader: 'Arapça Tam İsnad Metni',
  fullscreenDialogAria: 'Tam ekran isnad ağacı',
  exampleInAppLabel: 'Uygulamadaki Örneği:',
  noPdfBio: "PDF'te bilgi yok",
  branchTarik: 'Tarîk',
  branchKol: 'Kol',
};

const glossaryCache: Partial<Record<LanguageCode, GlossaryAndIsnadPack | null>> = {
  tr: null,
};

const wordPackCache: Partial<Record<LanguageCode, WordLexiconPack | null>> = {
  tr: null,
};

export function getCachedGlossaryPack(lang: LanguageCode): GlossaryAndIsnadPack | null {
  return glossaryCache[lang] ?? null;
}

export async function loadGlossaryPack(lang: LanguageCode): Promise<GlossaryAndIsnadPack | null> {
  if (lang === 'tr') return null;
  const existing = glossaryCache[lang];
  if (existing) return existing;

  let loaded: GlossaryAndIsnadPack;
  switch (lang) {
    case 'fr':
      loaded = (await import('../data/translations/glossary.fr')).GLOSSARY_PACK_FR;
      break;
    case 'de':
      loaded = (await import('../data/translations/glossary.de')).GLOSSARY_PACK_DE;
      break;
    case 'nl':
      loaded = (await import('../data/translations/glossary.nl')).GLOSSARY_PACK_NL;
      break;
    case 'ar':
      loaded = (await import('../data/translations/glossary.ar')).GLOSSARY_PACK_AR;
      break;
    default:
      return null;
  }
  glossaryCache[lang] = loaded;
  return loaded;
}

export function getCachedWordLexiconPack(lang: LanguageCode): WordLexiconPack | null {
  return wordPackCache[lang] ?? null;
}

export async function loadWordLexiconPack(lang: LanguageCode): Promise<WordLexiconPack | null> {
  if (lang === 'tr') return null;
  const existing = wordPackCache[lang];
  if (existing) return existing;

  let loaded: WordLexiconPack;
  switch (lang) {
    case 'fr':
      loaded = (await import('../data/translations/words.fr')).WORD_PACK_FR;
      break;
    case 'de':
      loaded = (await import('../data/translations/words.de')).WORD_PACK_DE;
      break;
    case 'nl':
      loaded = (await import('../data/translations/words.nl')).WORD_PACK_NL;
      break;
    case 'ar':
      loaded = (await import('../data/translations/words.ar')).WORD_PACK_AR;
      break;
    default:
      return null;
  }
  wordPackCache[lang] = loaded;
  return loaded;
}

export function getLocalizedGlossaryCategory(
  category: GlossaryCategory,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null
): string {
  if (lang === 'tr') return TR_GLOSSARY_CATEGORIES[category];
  return pack?.categories[category] ?? TR_GLOSSARY_CATEGORIES[category];
}

export function getLocalizedGlossaryTerm(
  entry: GlossaryEntry,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null,
  fallback: string
): LocalizedGlossaryTerm {
  if (lang === 'tr') {
    return {
      categoryLabel: entry.categoryLabelTr,
      term: entry.termTr,
      definition: entry.definitionTr,
      exampleInApp: entry.exampleInApp,
      relatedLabel: entry.relatedLabel,
    };
  }
  const localized = pack?.terms[entry.id];
  if (localized) return localized;
  return {
    categoryLabel: pack?.categories[entry.category] ?? '',
    term: lang === 'fr' ? entry.termFr : entry.termAr,
    definition: fallback,
    exampleInApp: '',
    relatedLabel: '',
  };
}

export function getLocalizedNarratorLayer(
  layer: IsnadNode['layer'],
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null
): string {
  if (lang === 'tr') return TR_NARRATOR_LAYERS[layer];
  return pack?.layers[layer] ?? TR_NARRATOR_LAYERS[layer];
}

export function getLocalizedIsnadUi(
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null
): LocalizedIsnadUi {
  if (lang === 'tr') return TR_ISNAD_UI;
  return pack?.isnadUi ?? TR_ISNAD_UI;
}

export function getLocalizedIsnadNote(
  noteTr: string,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null,
  fallback: string
): string {
  if (lang === 'tr') return noteTr;
  if (!pack) return fallback;
  return (
    pack.isnadNotes[noteTr] ??
    pack.narratorBios[noteTr] ??
    pack.tdvKnownBios[noteTr] ??
    fallback
  );
}

export function getLocalizedNarratorBio(
  bioTr: string | undefined,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null,
  fallback: string
): string {
  if (!bioTr || !bioTr.trim()) {
    return lang === 'tr' ? NO_PDF_BIO_TR : (pack?.isnadUi.noPdfBio ?? fallback);
  }
  const trimmed = bioTr.trim();
  if (lang === 'tr') return trimmed;
  if (!pack) return fallback;
  if (trimmed === NO_PDF_BIO_TR) return pack.isnadUi.noPdfBio;

  const direct =
    pack.narratorBios[trimmed] ??
    pack.tdvKnownBios[trimmed] ??
    pack.isnadNotes[trimmed];
  if (direct) return direct;

  // Handle combined `${note} (${tdvBio})` produced by isnadTree.ts
  const parenMatch = trimmed.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    const first = parenMatch[1].trim();
    const inner = parenMatch[2].trim();
    const locFirst =
      pack.isnadNotes[first] ?? pack.narratorBios[first] ?? pack.tdvKnownBios[first];
    const locInner =
      pack.tdvKnownBios[inner] ?? pack.narratorBios[inner] ?? pack.isnadNotes[inner];
    if (locFirst && locInner) return `${locFirst} (${locInner})`;
    if (locInner) return locInner;
    if (locFirst) return locFirst;
  }

  return fallback;
}

export function getLocalizedCautionReason(
  reasonTr: string,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null
): string {
  if (lang === 'tr') return reasonTr;
  return pack?.cautionReasons[reasonTr] ?? pack?.isnadUi.cautionBadge ?? reasonTr;
}

export function getLocalizedBranchLabel(
  branchLabel: string,
  lang: LanguageCode,
  pack: GlossaryAndIsnadPack | null
): string {
  if (lang === 'tr' || !pack) return branchLabel;
  if (branchLabel.startsWith('Tarîk ')) {
    return `${pack.isnadUi.branchTarik} ${branchLabel.slice(6)}`;
  }
  if (branchLabel.startsWith('Kol ')) {
    return `${pack.isnadUi.branchKol} ${branchLabel.slice(4)}`;
  }
  return branchLabel;
}

export function formatTabakaLabel(
  tabakaNumber: number,
  lang: LanguageCode,
  suffix: string
): string {
  if (lang === 'tr') return `${tabakaNumber}${suffix}`;
  if (lang === 'de') return `${tabakaNumber}. ${suffix}`;
  return `${suffix} ${tabakaNumber}`;
}

export function getLocalizedNarratorDisplayName(
  node: { nameAr: string; nameTr: string; layer: IsnadNode['layer'] },
  lang: LanguageCode
): string {
  if (lang === 'ar') return node.nameAr;
  if (lang === 'tr') return node.nameTr;

  if (node.layer === 'prophet' || /Hz\. Peygamber/i.test(node.nameTr)) {
    if (lang === 'fr') return 'Le Prophète ﷺ';
    if (lang === 'de') return 'Der Prophet ﷺ';
    if (lang === 'nl') return 'De Profeet ﷺ';
  }

  let out = node.nameTr;
  if (lang === 'fr') {
    out = out
      .replace(/Ebû Dâvûd \(İki ayrı tarikten\)/g, 'Abū Dāwūd (deux voies distinctes)')
      .replace(/Ebû Dâvûd \(İki ayrı rivayet sîgasıyla\)/g, 'Abū Dāwūd (deux formules de transmission)')
      .replace(/Ebû Dâvûd/g, 'Abū Dāwūd')
      .replace(/Hz\. Âişe \(r\.anhâ\)/g, 'ʿĀʾisha (r.a.)')
      .replace(/Sahâbî oğullarından bir zat \(mübhem râvi\)/g, 'Fils d’un Compagnon (anonyme)')
      .replace(/\(bir adamdan\)/g, '(d’après un homme)')
      .replace(/\(İbn Ebî Şeybe kardeşler\)/g, '(frères Ibn Abī Šayba)')
      .replace(/\(babası\)/g, '(son père)')
      .replace(/Babası/g, 'Son père')
      .replace(/Dedesi/g, 'Son grand-père')
      .replace(/Hasan-ı Basrî/g, 'al-Ḥasan al-Baṣrī')
      .replace(/\s*·\s*ve\s+/g, ' · et ')
      .replace(/\s*·\s*ile\s+/g, ' · avec ')
      .replace(/\s+ve\s+/g, ' et ');
  } else if (lang === 'de') {
    out = out
      .replace(/Ebû Dâvûd \(İki ayrı tarikten\)/g, 'Abū Dāwūd (zwei Überlieferungswege)')
      .replace(/Ebû Dâvûd \(İki ayrı rivayet sîgasıyla\)/g, 'Abū Dāwūd (zwei Überlieferungsformeln)')
      .replace(/Ebû Dâvûd/g, 'Abū Dāwūd')
      .replace(/Hz\. Âişe \(r\.anhâ\)/g, 'ʿĀʾischa (r.a.)')
      .replace(/Sahâbî oğullarından bir zat \(mübhem râvi\)/g, 'Sohn eines Gefährten (ungenannt)')
      .replace(/\(bir adamdan\)/g, '(nach einem Mann)')
      .replace(/\(İbn Ebî Şeybe kardeşler\)/g, '(Brüder Ibn Abī Šayba)')
      .replace(/\(babası\)/g, '(sein Vater)')
      .replace(/Babası/g, 'Sein Vater')
      .replace(/Dedesi/g, 'Sein Großvater')
      .replace(/Hasan-ı Basrî/g, 'al-Ḥasan al-Baṣrī')
      .replace(/\s*·\s*ve\s+/g, ' · und ')
      .replace(/\s*·\s*ile\s+/g, ' · mit ')
      .replace(/\s+ve\s+/g, ' und ');
  } else if (lang === 'nl') {
    out = out
      .replace(/Ebû Dâvûd \(İki ayrı tarikten\)/g, 'Abū Dāwūd (twee overleveringslijnen)')
      .replace(/Ebû Dâvûd \(İki ayrı rivayet sîgasıyla\)/g, 'Abū Dāwūd (twee overleveringsformules)')
      .replace(/Ebû Dâvûd/g, 'Abū Dāwūd')
      .replace(/Hz\. Âişe \(r\.anhâ\)/g, 'ʿĀʾisja (r.a.)')
      .replace(/Sahâbî oğullarından bir zat \(mübhem râvi\)/g, 'Zoon van een Metgezel (anoniem)')
      .replace(/\(bir adamdan\)/g, '(volgens een man)')
      .replace(/\(İbn Ebî Şeybe kardeşler\)/g, '(broers Ibn Abī Šayba)')
      .replace(/\(babası\)/g, '(zijn vader)')
      .replace(/Babası/g, 'Zijn vader')
      .replace(/Dedesi/g, 'Zijn grootvader')
      .replace(/Hasan-ı Basrî/g, 'al-Ḥasan al-Baṣrī')
      .replace(/\s*·\s*ve\s+/g, ' · en ')
      .replace(/\s*·\s*ile\s+/g, ' · met ')
      .replace(/\s+ve\s+/g, ' en ');
  }
  return out
    .replace(/İ/g, 'I')
    .replace(/Ş/g, 'Š')
    .replace(/ş/g, 'š')
    .replace(/Ğ/g, 'Gh')
    .replace(/ğ/g, 'gh')
    .replace(/ı/g, 'i');
}

export function getLocalizedWordMeaning(
  word: { meaningTr: string; meaningFr: string },
  lang: LanguageCode,
  wordPack: WordLexiconPack | null,
  fallback: string
): string {
  if (lang === 'tr') return word.meaningTr;
  if (lang === 'fr') return word.meaningFr;
  return wordPack?.meanings[word.meaningTr] ?? fallback;
}

export function getLocalizedDerivativeMeaning(
  deriv: { ar: string; tr: string; fr: string },
  lang: LanguageCode,
  wordPack: WordLexiconPack | null,
  fallback: string
): string {
  if (lang === 'tr') return deriv.tr;
  if (lang === 'fr') return deriv.fr;
  return wordPack?.derivatives[deriv.ar] ?? fallback;
}

export function getLocalizedPartOfSpeech(
  posTr: string,
  lang: LanguageCode,
  wordPack: WordLexiconPack | null
): string {
  if (lang === 'tr') return posTr;
  if (!wordPack) return '';
  return wordPack.grammar.pos[posTr] ?? wordPack.grammar.translateFormula(posTr);
}

export interface LocalizedWordGrammar {
  partOfSpeech: string;
  pattern: string;
  tense: string;
  number: string;
  gender: string;
  role: string;
  caseState: string;
  reason: string;
}

export function getLocalizedWordGrammar(
  word: Pick<WordAnalysis, 'partOfSpeech' | 'morphology' | 'sarf' | 'irab'>,
  lang: LanguageCode,
  wordPack: WordLexiconPack | null
): LocalizedWordGrammar {
  if (lang === 'tr') {
    return {
      partOfSpeech: word.partOfSpeech,
      pattern: word.sarf?.pattern || '—',
      tense: word.sarf?.tense || '—',
      number: word.sarf?.number || '—',
      gender: word.sarf?.gender || '—',
      role: word.irab?.role || word.morphology || '—',
      caseState: word.irab?.caseState || '—',
      reason: word.irab?.reason || '',
    };
  }
  if (!wordPack) {
    return {
      partOfSpeech: '',
      pattern: '—',
      tense: '—',
      number: '—',
      gender: '—',
      role: '—',
      caseState: '—',
      reason: '',
    };
  }

  const g = wordPack.grammar;
  const rawPattern = word.sarf?.pattern || '—';
  const rawTense = word.sarf?.tense || '—';
  const rawNumber = word.sarf?.number || '—';
  const rawGender = word.sarf?.gender || '—';
  const rawRole = word.irab?.role || '';
  const rawCase = word.irab?.caseState || '—';

  const partOfSpeech = g.pos[word.partOfSpeech] ?? g.translateFormula(word.partOfSpeech);
  const pattern = rawPattern === '—' ? '—' : g.translateFormula(rawPattern);
  const tense = rawTense === '—' ? '—' : (g.tense[rawTense] ?? g.translateFormula(rawTense));
  const number = rawNumber === '—' ? '—' : (g.number[rawNumber] ?? g.translateFormula(rawNumber));
  const gender = rawGender === '—' ? '—' : (g.gender[rawGender] ?? g.translateFormula(rawGender));
  const caseState = rawCase === '—' ? '—' : (g.caseState[rawCase] ?? g.translateFormula(rawCase));
  const role = rawRole
    ? g.translateFormula(rawRole)
    : word.morphology
      ? (g.morphologies[word.morphology] ?? g.translateFormula(word.morphology))
      : '—';

  const reason = word.irab?.reason
    ? g.localizeReason({
        rawReason: word.irab.reason,
        partOfSpeech: word.partOfSpeech,
        pattern: word.sarf?.pattern,
        tense: word.sarf?.tense,
        role: word.irab?.role,
        caseState: word.irab?.caseState,
      })
    : '';

  return {
    partOfSpeech,
    pattern,
    tense,
    number,
    gender,
    role,
    caseState,
    reason,
  };
}

export function getLocalizedRootWordMorphology(
  word: { arabic: string; partOfSpeech: string; morphology: string },
  fullLexicon: Record<string, FullWordLexiconEntry>,
  lang: LanguageCode,
  wordPack: WordLexiconPack | null,
  fallback: string
): string {
  if (lang === 'tr') return word.morphology;
  if (!wordPack) return fallback;

  const g = wordPack.grammar;
  if (g.morphologies[word.morphology]) {
    return g.morphologies[word.morphology];
  }

  const key = getLexiconKey(word.arabic);
  const entry = fullLexicon[key];
  if (entry) {
    return g.localizeReason({
      rawReason: entry.irab?.reason,
      partOfSpeech: entry.partOfSpeech,
      pattern: entry.sarf?.pattern,
      tense: entry.sarf?.tense,
      role: entry.irab?.role,
      caseState: entry.irab?.caseState,
    });
  }

  return g.localizeReason({
    partOfSpeech: word.partOfSpeech,
  });
}

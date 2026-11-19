import type { BabInfo, HadithItem, LanguageCode } from '../types';
import type { HadithLanguagePack } from '../data/translations/types';

export type { HadithLanguagePack };

const packCache: Partial<Record<LanguageCode, HadithLanguagePack>> = {};

export function getCachedHadithPack(lang: LanguageCode): HadithLanguagePack | null {
  if (lang === 'tr') return null;
  return packCache[lang] ?? null;
}

export async function loadHadithPack(lang: LanguageCode): Promise<HadithLanguagePack | null> {
  if (lang === 'tr') return null;
  const cached = packCache[lang];
  if (cached) return cached;

  let loaded: HadithLanguagePack;
  switch (lang) {
    case 'fr': {
      const mod = await import('../data/translations/hadiths.fr');
      loaded = mod.HADITH_PACK_FR;
      break;
    }
    case 'de': {
      const mod = await import('../data/translations/hadiths.de');
      loaded = mod.HADITH_PACK_DE;
      break;
    }
    case 'nl': {
      const mod = await import('../data/translations/hadiths.nl');
      loaded = mod.HADITH_PACK_NL;
      break;
    }
    case 'ar': {
      const mod = await import('../data/translations/hadiths.ar');
      loaded = mod.HADITH_PACK_AR;
      break;
    }
    default:
      return null;
  }

  packCache[lang] = loaded;
  return loaded;
}

export function getLocalizedBab(
  bab: BabInfo,
  lang: LanguageCode,
  pack: HadithLanguagePack | null
): { numberLabel: string; title: string; subtitle: string } {
  if (lang === 'tr') {
    return {
      numberLabel: bab.numberLabel,
      title: bab.titleTr,
      subtitle: bab.subtitleTr,
    };
  }
  const fromPack = pack?.babs[bab.id];
  if (fromPack) {
    return fromPack;
  }
  if (lang === 'fr') {
    return {
      numberLabel: `Chapitre ${bab.id}`,
      title: bab.titleFr,
      subtitle: bab.titleAr,
    };
  }
  return {
    numberLabel: bab.numberLabel,
    title: bab.titleAr,
    subtitle: '',
  };
}

export function getLocalizedHadithContent(
  hadith: HadithItem,
  lang: LanguageCode,
  pack: HadithLanguagePack | null,
  missingFallback: string
): {
  translation: string;
  lessons: string[];
  contextStory: { title: string; summary: string } | null;
  getFootnoteSummary: (fnId: string, fallbackTr: string) => string;
  isTranslationMissing: boolean;
} {
  if (lang === 'tr') {
    return {
      translation: hadith.translationTr,
      lessons: hadith.lessonsTr,
      contextStory: hadith.contextStory
        ? { title: hadith.contextStory.titleTr, summary: hadith.contextStory.summaryTr }
        : null,
      getFootnoteSummary: (_fnId, fallbackTr) => fallbackTr,
      isTranslationMissing: false,
    };
  }

  const entry = pack?.hadiths[hadith.id];
  if (entry) {
    return {
      translation: entry.translation,
      lessons: entry.lessons,
      contextStory: hadith.contextStory
        ? entry.contextStory ?? { title: '', summary: missingFallback }
        : null,
      getFootnoteSummary: (fnId) => entry.footnotes[fnId] || missingFallback,
      isTranslationMissing: false,
    };
  }

  if (lang === 'fr' && hadith.translationFr?.trim()) {
    return {
      translation: hadith.translationFr,
      lessons: [],
      contextStory: hadith.contextStory ? { title: '', summary: missingFallback } : null,
      getFootnoteSummary: () => missingFallback,
      isTranslationMissing: false,
    };
  }

  return {
    translation: missingFallback,
    lessons: [],
    contextStory: hadith.contextStory ? { title: '', summary: missingFallback } : null,
    getFootnoteSummary: () => missingFallback,
    isTranslationMissing: true,
  };
}

const TAHRIC_SOURCE_MAP: Record<Exclude<LanguageCode, 'tr'>, [RegExp, string][]> = {
  fr: [
    [/Buhârî/g, 'al-Boukhârî'],
    [/Müslim/g, 'Mouslim'],
    [/Tirmizî/g, 'at-Tirmidhî'],
    [/Nesâî/g, 'an-Nasâ’î'],
    [/İbn Mâce/g, 'Ibn Mâjah'],
    [/Ahmed/g, 'Ahmad'],
    [/Mâlik/g, 'Mâlik'],
    [/Ebû Dâvûd/g, 'Abû Dâwûd'],
  ],
  de: [
    [/Buhârî/g, 'al-Buchārī'],
    [/Müslim/g, 'Muslim'],
    [/Tirmizî/g, 'at-Tirmidhī'],
    [/Nesâî/g, 'an-Nasāʾī'],
    [/İbn Mâce/g, 'Ibn Mādscha'],
    [/Ahmed/g, 'Aḥmad'],
    [/Mâlik/g, 'Mālik'],
    [/Ebû Dâvûd/g, 'Abū Dāwūd'],
  ],
  nl: [
    [/Buhârî/g, 'al-Boechari'],
    [/Müslim/g, 'Moeslim'],
    [/Tirmizî/g, 'at-Tirmidhi'],
    [/Nesâî/g, 'an-Nasa’i'],
    [/İbn Mâce/g, 'Ibn Madjah'],
    [/Ahmed/g, 'Ahmad'],
    [/Mâlik/g, 'Malik'],
    [/Ebû Dâvûd/g, 'Aboe Dawoed'],
  ],
  ar: [
    [/Buhârî/g, 'البخاري'],
    [/Müslim/g, 'مسلم'],
    [/Tirmizî/g, 'الترمذي'],
    [/Nesâî/g, 'النسائي'],
    [/İbn Mâce/g, 'ابن ماجه'],
    [/Ahmed/g, 'أحمد'],
    [/Mâlik/g, 'مالك'],
    [/Ebû Dâvûd/g, 'أبو داود'],
  ],
};

export function localizeTahricBadge(badge: string, lang: LanguageCode): string {
  if (lang === 'tr') return badge;
  let out = badge;
  for (const [pattern, replacement] of TAHRIC_SOURCE_MAP[lang]) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function formatPdfPage(page: number | string, lang: LanguageCode): string {
  switch (lang) {
    case 'de':
      return `PDF S. ${page}`;
    case 'fr':
    case 'nl':
      return `PDF p. ${page}`;
    case 'ar':
      return `ص ${page}`;
    case 'tr':
    default:
      return `PDF s. ${page}`;
  }
}

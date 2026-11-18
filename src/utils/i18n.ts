import type { Dictionary } from '../data/i18n/types';
import { TR_DICTIONARY } from '../data/i18n/tr';
import type { LanguageCode } from '../types';

export type { Dictionary };

const dictionaryCache: Partial<Record<LanguageCode, Dictionary>> = {
  tr: TR_DICTIONARY,
};

export function getCachedDictionary(lang: LanguageCode): Dictionary | null {
  return dictionaryCache[lang] ?? null;
}

export async function loadDictionary(lang: LanguageCode): Promise<Dictionary> {
  const cached = dictionaryCache[lang];
  if (cached) return cached;

  let loaded: Dictionary;
  switch (lang) {
    case 'fr': {
      const mod = await import('../data/i18n/fr');
      loaded = mod.FR_DICTIONARY;
      break;
    }
    case 'ar': {
      const mod = await import('../data/i18n/ar');
      loaded = mod.AR_DICTIONARY;
      break;
    }
    case 'de': {
      const mod = await import('../data/i18n/de');
      loaded = mod.DE_DICTIONARY;
      break;
    }
    case 'nl': {
      const mod = await import('../data/i18n/nl');
      loaded = mod.NL_DICTIONARY;
      break;
    }
    case 'tr':
    default:
      loaded = TR_DICTIONARY;
      break;
  }

  dictionaryCache[lang] = loaded;
  return loaded;
}

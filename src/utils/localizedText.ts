import type { LanguageCode, LocalizedText } from '../types';
import { stripTashkeel } from './arabic';

export type SupportedSpeechLang = 'tr-TR' | 'fr-FR' | 'ar-SA' | 'de-DE' | 'nl-NL';

export interface LanguageMeta {
  code: LanguageCode;
  shortLabel: string;
  nativeName: string;
  speechLang: SupportedSpeechLang;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'tr', shortLabel: 'TR', nativeName: 'Türkçe', speechLang: 'tr-TR', dir: 'ltr' },
  { code: 'fr', shortLabel: 'FR', nativeName: 'Français', speechLang: 'fr-FR', dir: 'ltr' },
  { code: 'ar', shortLabel: 'AR', nativeName: 'العربية', speechLang: 'ar-SA', dir: 'rtl' },
  { code: 'de', shortLabel: 'DE', nativeName: 'Deutsch', speechLang: 'de-DE', dir: 'ltr' },
  { code: 'nl', shortLabel: 'NL', nativeName: 'Nederlands', speechLang: 'nl-NL', dir: 'ltr' },
];

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function getSpeechLangForUi(code: LanguageCode): SupportedSpeechLang {
  return getLanguageMeta(code).speechLang;
}

/**
 * Returns the localized text for `lang`.
 * Strictly NEVER falls back to Turkish ('tr') when another language lacks a translation —
 * returns `missingFallback` (the "translation preparing" notice in the active language).
 */
export function getLocalizedText(
  map: LocalizedText | undefined | null,
  lang: LanguageCode,
  missingFallback: string
): string {
  if (!map) return missingFallback;
  const val = map[lang];
  if (typeof val === 'string' && val.trim().length > 0) {
    return val;
  }
  return missingFallback;
}

export function getBabDisplayTitle(
  bab: { titleTr: string; titleFr: string; titleAr: string },
  lang: LanguageCode
): string {
  if (lang === 'tr') return bab.titleTr;
  if (lang === 'fr') return bab.titleFr;
  return bab.titleAr;
}

/**
 * Normalizes scholarly transliterations, French/German/Dutch spellings, and Arabic text
 * so proper nouns (Ebû Dâvûd, Sicistân, el-Lü'lüî, Muâz, etc.) match across all 5 languages.
 */
export function normalizeTransliterationSearch(raw: string): string {
  if (!raw) return '';
  const strippedAr = stripTashkeel(
    raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
  );
  return strippedAr
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[‘’'ʻʼ`ʿʾ-]/g, '')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(
      /abu\s*dawud|abou\s*daoud|abu\s*daud|ebu\s*davud|ebudavud|abudawud|ابو\s*داود/g,
      'ebudavud'
    )
    .replace(
      /sicistan|sijistan|sejestan|sidschistan|sidzjistan|سجستان/g,
      'sicistan'
    )
    .replace(/lului|loulou|lulu|لؤلؤي/g, 'lului')
    .replace(/muaz|muadh|moadh|muad|معاذ/g, 'muaz')
    .replace(/hattabi|khattabi|chattabi|al-?khattabi|al-?chattabi|خطابي/g, 'hattabi')
    .replace(/ou/g, 'u')
    .replace(/dsch|dzj|dj/g, 'c')
    .replace(/sch/g, 's')
    .replace(/sh/g, 's')
    .replace(/kh/g, 'h')
    .replace(/\s+/g, ' ')
    .trim();
}

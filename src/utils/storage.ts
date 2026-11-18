import type { AppSettings, LanguageCode, SecondaryLanguageCode, UserProgress } from '../types';

export const SETTINGS_STORAGE_KEY = 'sunen_adab_settings_v1';
export const PROGRESS_STORAGE_KEY = 'sunen_adab_progress_v1';

const VALID_LANGUAGES: LanguageCode[] = ['tr', 'fr', 'ar', 'de', 'nl'];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'tr',
  secondaryLanguage: 'none',
  theme: 'light',
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
  alwaysShowRootColors: false,
  ttsRate: 0.9,
  ttsPitch: 0.85,
  ttsGenderPreference: 'male',
  ttsAudioSource: 'prebuilt',
  selectedVoiceAr: '',
  selectedVoiceTr: '',
  selectedVoices: {},
};

export const DEFAULT_PROGRESS: UserProgress = {
  readHadiths: [],
  listenedHadiths: [],
  memorizedHadiths: [],
  favoriteHadiths: [],
  notes: {},
};

export function clampFontScale(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(1.35, Math.max(0.85, Math.round(value * 100) / 100));
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const language: LanguageCode = VALID_LANGUAGES.includes(parsed.language as LanguageCode)
      ? (parsed.language as LanguageCode)
      : DEFAULT_SETTINGS.language;
    const rawSecondary = parsed.secondaryLanguage as SecondaryLanguageCode | undefined;
    const secondaryLanguage: SecondaryLanguageCode =
      rawSecondary &&
      (rawSecondary === 'none' || VALID_LANGUAGES.includes(rawSecondary as LanguageCode)) &&
      rawSecondary !== language
        ? rawSecondary
        : 'none';

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      language,
      secondaryLanguage,
      alwaysShowRootColors: Boolean(parsed.alwaysShowRootColors),
      fontScale: clampFontScale(parsed.fontScale ?? DEFAULT_SETTINGS.fontScale),
      ttsRate: typeof parsed.ttsRate === 'number' ? parsed.ttsRate : DEFAULT_SETTINGS.ttsRate,
      ttsPitch: typeof parsed.ttsPitch === 'number' ? parsed.ttsPitch : DEFAULT_SETTINGS.ttsPitch,
      ttsGenderPreference:
        parsed.ttsGenderPreference === 'male' ||
        parsed.ttsGenderPreference === 'female' ||
        parsed.ttsGenderPreference === 'auto'
          ? parsed.ttsGenderPreference
          : DEFAULT_SETTINGS.ttsGenderPreference,
      ttsAudioSource:
        parsed.ttsAudioSource === 'prebuilt' || parsed.ttsAudioSource === 'device'
          ? parsed.ttsAudioSource
          : DEFAULT_SETTINGS.ttsAudioSource,
      selectedVoices:
        parsed.selectedVoices && typeof parsed.selectedVoices === 'object'
          ? parsed.selectedVoices
          : {},
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      readHadiths: Array.isArray(parsed.readHadiths) ? parsed.readHadiths : [],
      listenedHadiths: Array.isArray(parsed.listenedHadiths) ? parsed.listenedHadiths : [],
      memorizedHadiths: Array.isArray(parsed.memorizedHadiths) ? parsed.memorizedHadiths : [],
      favoriteHadiths: Array.isArray(parsed.favoriteHadiths) ? parsed.favoriteHadiths : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function clearStoredProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      window.localStorage.removeItem('sunen_adab_srs_v1');
    } catch {
      // Ignore storage errors safely
    }
  }
  return { ...DEFAULT_PROGRESS, notes: {} };
}

export function toggleNumberInList(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

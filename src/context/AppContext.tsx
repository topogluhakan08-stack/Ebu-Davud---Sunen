import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  AppSettings,
  LanguageCode,
  SecondaryLanguageCode,
  UserProgress,
} from '../types';
import {
  DEFAULT_SETTINGS,
  clearStoredProgress,
  loadProgress,
  loadSettings,
  saveProgress,
  saveSettings,
  toggleNumberInList,
  clampFontScale,
} from '../utils/storage';
import { getCachedDictionary, loadDictionary, type Dictionary } from '../utils/i18n';
import { TR_DICTIONARY } from '../data/i18n/tr';

interface AppContextValue {
  settings: AppSettings;
  progress: UserProgress;
  t: Dictionary;
  secondaryT: Dictionary | null;
  setLanguage: (lang: LanguageCode) => void;
  setSecondaryLanguage: (lang: SecondaryLanguageCode) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontScale: (scale: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleAlwaysShowRootColors: () => void;
  updateTtsSettings: (
    patch: Partial<
      Pick<
        AppSettings,
        | 'ttsRate'
        | 'ttsPitch'
        | 'ttsGenderPreference'
        | 'ttsAudioSource'
        | 'selectedVoiceAr'
        | 'selectedVoiceTr'
        | 'selectedVoices'
      >
    >
  ) => void;
  toggleRead: (hadithId: number) => void;
  markListened: (hadithId: number) => void;
  toggleMemorized: (hadithId: number) => void;
  toggleFavorite: (hadithId: number) => void;
  setNote: (hadithId: number, note: string) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [primaryDict, setPrimaryDict] = useState<Dictionary>(
    () => getCachedDictionary(loadSettings().language) ?? TR_DICTIONARY
  );
  const [secondaryDict, setSecondaryDict] = useState<Dictionary | null>(() => {
    const s = loadSettings();
    return s.secondaryLanguage !== 'none' ? getCachedDictionary(s.secondaryLanguage) : null;
  });

  useEffect(() => {
    let cancelled = false;
    const cached = getCachedDictionary(settings.language);
    if (cached) {
      setPrimaryDict(cached);
    } else {
      void loadDictionary(settings.language).then((dict) => {
        if (!cancelled) setPrimaryDict(dict);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [settings.language]);

  useEffect(() => {
    let cancelled = false;
    if (settings.secondaryLanguage === 'none' || settings.secondaryLanguage === settings.language) {
      setSecondaryDict(null);
      return;
    }
    const cached = getCachedDictionary(settings.secondaryLanguage);
    if (cached) {
      setSecondaryDict(cached);
    } else {
      void loadDictionary(settings.secondaryLanguage).then((dict) => {
        if (!cancelled) setSecondaryDict(dict);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [settings.secondaryLanguage, settings.language]);

  useEffect(() => {
    saveSettings(settings);
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.style.setProperty('--app-font-scale', String(settings.fontScale));
    root.lang = settings.language;
    root.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
  }, [settings]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setLanguage = (language: LanguageCode) =>
    setSettings((prev) => ({
      ...prev,
      language,
      secondaryLanguage: prev.secondaryLanguage === language ? 'none' : prev.secondaryLanguage,
    }));

  const setSecondaryLanguage = (secondaryLanguage: SecondaryLanguageCode) =>
    setSettings((prev) => ({
      ...prev,
      secondaryLanguage: secondaryLanguage === prev.language ? 'none' : secondaryLanguage,
    }));

  const toggleTheme = () =>
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));

  const setTheme = (theme: 'light' | 'dark') =>
    setSettings((prev) => ({ ...prev, theme }));

  const setFontScale = (scale: number) =>
    setSettings((prev) => ({ ...prev, fontScale: clampFontScale(scale) }));

  const toggleHighContrast = () =>
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));

  const toggleReducedMotion = () =>
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));

  const toggleAlwaysShowRootColors = () =>
    setSettings((prev) => ({ ...prev, alwaysShowRootColors: !prev.alwaysShowRootColors }));

  const updateTtsSettings = (
    patch: Partial<
      Pick<
        AppSettings,
        | 'ttsRate'
        | 'ttsPitch'
        | 'ttsGenderPreference'
        | 'ttsAudioSource'
        | 'selectedVoiceAr'
        | 'selectedVoiceTr'
        | 'selectedVoices'
      >
    >
  ) => setSettings((prev) => ({ ...prev, ...patch }));

  const toggleRead = (hadithId: number) =>
    setProgress((prev) => ({ ...prev, readHadiths: toggleNumberInList(prev.readHadiths, hadithId) }));

  const markListened = (hadithId: number) =>
    setProgress((prev) => ({
      ...prev,
      listenedHadiths: prev.listenedHadiths.includes(hadithId)
        ? prev.listenedHadiths
        : [...prev.listenedHadiths, hadithId],
    }));

  const toggleMemorized = (hadithId: number) =>
    setProgress((prev) => ({
      ...prev,
      memorizedHadiths: toggleNumberInList(prev.memorizedHadiths, hadithId),
    }));

  const toggleFavorite = (hadithId: number) =>
    setProgress((prev) => ({
      ...prev,
      favoriteHadiths: toggleNumberInList(prev.favoriteHadiths, hadithId),
    }));

  const setNote = (hadithId: number, note: string) =>
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [hadithId]: note },
    }));

  const resetProgress = () => {
    const cleared = clearStoredProgress();
    setProgress(cleared);
  };

  return (
    <AppContext.Provider
      value={{
        settings: settings || DEFAULT_SETTINGS,
        progress,
        t: primaryDict,
        secondaryT: secondaryDict,
        setLanguage,
        setSecondaryLanguage,
        toggleTheme,
        setTheme,
        setFontScale,
        toggleHighContrast,
        toggleReducedMotion,
        toggleAlwaysShowRootColors,
        updateTtsSettings,
        toggleRead,
        markListened,
        toggleMemorized,
        toggleFavorite,
        setNote,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

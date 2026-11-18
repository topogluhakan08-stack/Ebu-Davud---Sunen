import React, { useEffect, useState } from 'react';
import { Download, Info, Moon, RotateCcw, Square, Sun, Trash2, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type {
  LanguageCode,
  SecondaryLanguageCode,
  TtsAudioSource,
  TtsGenderPreference,
} from '../types';
import { ManuscriptCard, EditorialDivider } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { useSpeech } from '../hooks/useSpeech';
import { SUPPORTED_LANGUAGES } from '../utils/localizedText';
import {
  cacheAvailableAudioFiles,
  clearAudioCache,
  getCachedAudioCount,
  getManifestStats,
} from '../utils/audioManifest';

const SAMPLE_ARABIC = 'قَالَ رَسُولُ اللَّهِ ﷺ: إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ';
const SAMPLE_TEXT_BY_LANG: Record<LanguageCode, string> = {
  tr: 'Ebû Dâvûd es-Sicistânî, es-Sünen müellifi büyük bir hadis âlimidir.',
  fr: 'Abû Dâwûd as-Sijistânî est le célèbre compilateur du Sunan.',
  ar: 'أبو داود السجستاني إمامٌ محدِّثٌ مصنِّفُ كتاب السنن.',
  de: 'Abū Dāwūd as-Siǧistānī ist ein bedeutender Hadithgelehrter und Verfasser der Sunan.',
  nl: 'Abū Dāwūd as-Sidzjistānī is een vooraanstaand hadithgeleerde en auteur van as-Sunan.',
};

export const SettingsPage: React.FC = () => {
  const {
    settings,
    t,
    setLanguage,
    setSecondaryLanguage,
    setTheme,
    setFontScale,
    toggleHighContrast,
    toggleReducedMotion,
    toggleAlwaysShowRootColors,
    updateTtsSettings,
    resetProgress,
  } = useApp();

  const {
    isSupported,
    arabicVoiceOptions,
    primaryLangVoiceOptions,
    primarySpeechLang,
    arResolution,
    primaryLangResolution,
    status,
    activeId,
    speak,
    stop,
  } = useSpeech();

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const manifestStats = getManifestStats();
  const [cacheState, setCacheState] = useState<{
    cachedCount: number;
    availableCount: number;
    cachedBytes: number;
  }>({ cachedCount: 0, availableCount: manifestStats.availableCount, cachedBytes: 0 });
  const [downloadingAudio, setDownloadingAudio] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number } | null>(
    null
  );

  useEffect(() => {
    void getCachedAudioCount().then(setCacheState);
  }, []);

  const handleDownloadOfflineAudio = async () => {
    setDownloadingAudio(true);
    setDownloadProgress({ done: 0, total: manifestStats.availableCount });
    await cacheAvailableAudioFiles((done, total) => {
      setDownloadProgress({ done, total });
    });
    const updated = await getCachedAudioCount();
    setCacheState(updated);
    setDownloadingAudio(false);
  };

  const handleClearOfflineAudio = async () => {
    await clearAudioCache();
    const updated = await getCachedAudioCount();
    setCacheState(updated);
    setDownloadProgress(null);
  };

  const secondaryChoices = SUPPORTED_LANGUAGES.filter((l) => l.code !== settings.language);

  const audioSourceOptions: { value: TtsAudioSource; label: string; desc: string }[] = [
    {
      value: 'prebuilt',
      label: t.tts.audioSourcePrebuilt,
      desc: t.tts.audioSourcePrebuiltDesc,
    },
    {
      value: 'device',
      label: t.tts.audioSourceDevice,
      desc: t.tts.audioSourceDeviceDesc,
    },
  ];

  const genderOptions: { value: TtsGenderPreference; label: string }[] = [
    { value: 'male', label: t.tts.genderMale },
    { value: 'female', label: t.tts.genderFemale },
    { value: 'auto', label: t.tts.genderAuto },
  ];

  const anyMaleWarning =
    settings.ttsGenderPreference === 'male'
      ? (arResolution.hasAnyVoiceForLang && !arResolution.hasMaleVoiceForLang) ||
        (primaryLangResolution.hasAnyVoiceForLang && !primaryLangResolution.hasMaleVoiceForLang)
        ? t.tts.noMaleVoice
        : null
      : null;

  const missingPrimaryLangVoice =
    settings.language !== 'ar' && !primaryLangResolution.hasAnyVoiceForLang;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 border-b border-[var(--border-hairline)] pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          {t.settings.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          {t.settings.subtitle}
        </p>
      </div>

      <ManuscriptCard className="p-6 sm:p-8 space-y-6">
        {/* Primary Language (5 Languages) */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t.settings.languageLabel}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={settings.language === lang.code}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                  settings.language === lang.code
                    ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Language (Optional, excludes active primary) */}
        <div className="space-y-2">
          <label
            htmlFor="settings-secondary-language"
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {t.settings.secondaryLanguageLabel}
          </label>
          <p className="text-xs text-[var(--text-secondary)]">
            {t.settings.secondaryLanguageDesc}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSecondaryLanguage('none')}
              aria-pressed={settings.secondaryLanguage === 'none'}
              className={`min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                settings.secondaryLanguage === 'none'
                  ? 'bg-[var(--accent-emerald)] text-white border-[var(--accent-emerald)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              {t.languagePicker.noneOption}
            </button>
            {secondaryChoices.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSecondaryLanguage(lang.code as SecondaryLanguageCode)}
                aria-pressed={settings.secondaryLanguage === lang.code}
                className={`min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                  settings.secondaryLanguage === lang.code
                    ? 'bg-[var(--accent-emerald)] text-white border-[var(--accent-emerald)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        <EditorialDivider />

        {/* Theme */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{t.settings.themeLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`min-h-[48px] px-4 py-3 rounded-xl border flex items-center gap-3 text-sm font-medium cursor-pointer ${
                settings.theme === 'light'
                  ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)]'
              }`}
            >
              <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.settings.light}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`min-h-[48px] px-4 py-3 rounded-xl border flex items-center gap-3 text-sm font-medium cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)]'
              }`}
            >
              <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.settings.dark}</span>
            </button>
          </div>
        </div>

        <EditorialDivider />

        {/* Font Size, Root Colors, & Accessibility */}
        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm font-semibold text-[var(--text-primary)]">
              <span>{t.settings.fontScaleLabel}</span>
              <span className="font-tabular">{Math.round(settings.fontScale * 100)}%</span>
            </span>
            <input
              type="range"
              min="0.85"
              max="1.35"
              step="0.05"
              value={settings.fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>

          <label className="flex items-start justify-between gap-4 min-h-[44px] cursor-pointer">
            <div className="space-y-0.5">
              <span className="block text-sm font-medium text-[var(--text-primary)]">
                {t.settings.alwaysShowRootColorsLabel}
              </span>
              <span className="block text-xs text-[var(--text-secondary)]">
                {t.settings.alwaysShowRootColorsDesc}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.alwaysShowRootColors}
              onChange={toggleAlwaysShowRootColors}
              className="w-5 h-5 mt-0.5 shrink-0 accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {t.settings.highContrastLabel}
            </span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={toggleHighContrast}
              className="w-5 h-5 accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {t.settings.reducedMotionLabel}
            </span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={toggleReducedMotion}
              className="w-5 h-5 accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>
        </div>

        <EditorialDivider />

        {/* TTS Preferences */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{t.settings.ttsTitle}</h2>

          {/* Audio Source selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">{t.tts.audioSourceLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {audioSourceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateTtsSettings({ ttsAudioSource: opt.value })}
                  aria-pressed={settings.ttsAudioSource === opt.value}
                  className={`min-h-[54px] px-3.5 py-2.5 rounded-xl text-start border transition-colors cursor-pointer space-y-0.5 ${
                    settings.ttsAudioSource === opt.value
                      ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold">{opt.label}</div>
                  <div
                    className={`text-[11px] leading-snug ${
                      settings.ttsAudioSource === opt.value
                        ? 'text-white/85'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gender preference */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">{t.tts.genderLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              {genderOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateTtsSettings({ ttsGenderPreference: opt.value })}
                  className={`min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                    settings.ttsGenderPreference === opt.value
                      ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {anyMaleWarning && (
            <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl px-3.5 py-2.5 border border-[var(--border-hairline)]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
              <span>{anyMaleWarning}</span>
            </p>
          )}

          {missingPrimaryLangVoice && (
            <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl px-3.5 py-2.5 border border-[var(--border-hairline)]">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
              <span>{t.tts.noLanguageVoice}</span>
            </p>
          )}

          {/* Rate & Pitch Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm">
              <span className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>{t.tts.rateLabel}</span>
                <span className="font-tabular">{settings.ttsRate.toFixed(2)}x</span>
              </span>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={settings.ttsRate}
                onChange={(e) => updateTtsSettings({ ttsRate: parseFloat(e.target.value) })}
                className="w-full accent-[var(--accent-navy)] cursor-pointer"
              />
            </label>

            <label className="space-y-1.5 text-sm">
              <span className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>{t.tts.pitchLabel}</span>
                <span className="font-tabular">{settings.ttsPitch.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min="0.65"
                max="1.25"
                step="0.05"
                value={settings.ttsPitch}
                onChange={(e) => updateTtsSettings({ ttsPitch: parseFloat(e.target.value) })}
                className="w-full accent-[var(--accent-navy)] cursor-pointer"
              />
            </label>
          </div>

          {/* Separate AR and Primary UI Language voice selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                {t.languagePicker.languageNames.ar} (ar-SA)
              </span>
              <select
                value={settings.selectedVoiceAr}
                onChange={(e) => updateTtsSettings({ selectedVoiceAr: e.target.value })}
                className="w-full min-h-[42px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-3 text-sm text-[var(--text-primary)]"
              >
                <option value="">
                  {arabicVoiceOptions.length > 0
                    ? `${t.tts.autoOption} (${arResolution.voice?.name || t.tts.autoOption})`
                    : t.tts.noVoiceInDevice}
                </option>
                {arabicVoiceOptions.map(({ voice, genderLabel }) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang} · {genderLabel})
                  </option>
                ))}
              </select>
            </label>

            {settings.language !== 'ar' && (
              <label className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  {t.languagePicker.languageNames[settings.language]} ({primarySpeechLang})
                </span>
                <select
                  value={settings.selectedVoices?.[settings.language] ?? settings.selectedVoiceTr}
                  onChange={(e) =>
                    updateTtsSettings({
                      ...(settings.language === 'tr' ? { selectedVoiceTr: e.target.value } : {}),
                      selectedVoices: {
                        ...(settings.selectedVoices ?? {}),
                        [settings.language]: e.target.value,
                      },
                    })
                  }
                  className="w-full min-h-[42px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-3 text-sm text-[var(--text-primary)]"
                >
                  <option value="">
                    {primaryLangVoiceOptions.length > 0
                      ? `${t.tts.autoOption} (${primaryLangResolution.voice?.name || t.tts.autoOption})`
                      : t.tts.noVoiceInDevice}
                  </option>
                  {primaryLangVoiceOptions.map(({ voice, genderLabel }) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang} · {genderLabel})
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {/* Test Voice */}
          {isSupported && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant={activeId === 'test-ar' && status === 'speaking' ? 'emerald' : 'primary'}
                size="sm"
                onClick={() => speak(SAMPLE_ARABIC, 'ar-SA', { id: 'test-ar' })}
                iconLeft={<Volume2 className="w-4 h-4" />}
              >
                {t.tts.testVoiceAr}
              </Button>
              {settings.language !== 'ar' && (
                <Button
                  variant={
                    activeId === 'test-primary' && status === 'speaking' ? 'emerald' : 'secondary'
                  }
                  size="sm"
                  onClick={() =>
                    speak(SAMPLE_TEXT_BY_LANG[settings.language], primarySpeechLang, {
                      id: 'test-primary',
                    })
                  }
                  iconLeft={<Volume2 className="w-4 h-4" />}
                >
                  {t.tts.testVoicePrimary}
                </Button>
              )}
              {(activeId === 'test-ar' || activeId === 'test-primary') && status !== 'idle' && (
                <Button variant="ghost" size="sm" onClick={stop} iconLeft={<Square className="w-4 h-4" />}>
                  {t.tts.stop}
                </Button>
              )}
            </div>
          )}

          {/* User-Triggered PWA Offline Audio Cache */}
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {t.tts.offlineCacheTitle}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {t.tts.offlineCacheDesc}
                </p>
              </div>
              <span className="text-xs font-tabular font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)]">
                {t.tts.offlineBadgePrebuilt}: {manifestStats.availableCount}/{manifestStats.totalCount} ·{' '}
                {t.tts.offlineBadgeCached}: {cacheState.cachedCount}
              </span>
            </div>

            {manifestStats.availableCount > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={downloadingAudio}
                  onClick={handleDownloadOfflineAudio}
                  iconLeft={<Download className="w-4 h-4" />}
                >
                  {downloadingAudio && downloadProgress
                    ? `${t.tts.offlineDownloading} (${downloadProgress.done}/${downloadProgress.total})...`
                    : t.tts.offlineDownloadBtn}
                </Button>
                {cacheState.cachedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingAudio}
                    onClick={handleClearOfflineAudio}
                    iconLeft={<Trash2 className="w-4 h-4" />}
                  >
                    {t.tts.offlineClearBtn}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                {t.tts.offlineUnavailableNote}
              </p>
            )}
          </div>
        </div>

        <EditorialDivider />

        {/* Reset Progress */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{t.settings.resetTitle}</h2>
          <p className="text-sm text-[var(--text-secondary)]">{t.settings.resetDesc}</p>

          {!confirmReset ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmReset(true);
                setResetDone(false);
              }}
              iconLeft={<RotateCcw className="w-4 h-4" />}
            >
              {t.settings.resetButton}
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                  setResetDone(true);
                }}
              >
                {t.settings.resetConfirm}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                {t.settings.resetCancel}
              </Button>
            </div>
          )}

          {resetDone && (
            <p className="text-xs font-medium text-[var(--accent-emerald)]">{t.settings.resetDone}</p>
          )}
        </div>

        <div className="pt-2">
          <PWAInstallButton />
        </div>
      </ManuscriptCard>
    </div>
  );
};

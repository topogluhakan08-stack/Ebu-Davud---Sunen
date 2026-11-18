import React, { useState } from 'react';
import {
  Volume2,
  Pause,
  Play,
  Square,
  SlidersHorizontal,
  Info,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useSpeech, type SpeechLang } from '../../hooks/useSpeech';
import { useApp } from '../../context/AppContext';
import { formatAudioTime, resolveAudioPlaybackPlan } from '../../utils/audioManifest';
import { getSpeechLangForUi } from '../../utils/localizedText';
import { Button } from '../ui/Button';

interface SpeechControlsProps {
  id: string;
  arabicText?: string;
  turkishText?: string;
  frenchText?: string;
  primaryText?: string;
  onListenStart?: () => void;
  onAudioFinished?: (lang: SpeechLang) => void;
  compact?: boolean;
}

const SPEED_PRESETS = [0.75, 0.9, 1.0, 1.25, 1.5];

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  id,
  arabicText,
  turkishText,
  frenchText,
  primaryText,
  onListenStart,
  onAudioFinished,
  compact = false,
}) => {
  const { settings, updateTtsSettings, t } = useApp();
  const {
    isSupported,
    arabicVoiceOptions,
    primaryLangVoiceOptions,
    hasArabicVoice,
    hasPrimaryLangVoice,
    arResolution,
    primaryLangResolution,
    status,
    playbackMode,
    activeId,
    activeLang,
    activeSentenceIndex,
    sentences,
    currentTimeSec,
    durationSec,
    speak,
    pause,
    resume,
    stop,
    seekTo,
    skipBy,
  } = useSpeech();
  const [showSliders, setShowSliders] = useState(false);
  const [compactInteracted, setCompactInteracted] = useState(false);

  const primarySpeechLang = getSpeechLangForUi(settings.language);
  const effectivePrimaryText =
    primaryText ??
    (settings.language === 'tr'
      ? turkishText
      : settings.language === 'fr'
        ? frenchText
        : undefined);

  const isThisPlaying = activeId === id && status !== 'idle';
  const showAmbientNotices = !compact || compactInteracted || isThisPlaying;

  const arPlan = resolveAudioPlaybackPlan(id, 'ar-SA', settings.ttsAudioSource);
  const primaryPlan = resolveAudioPlaybackPlan(id, primarySpeechLang, settings.ttsAudioSource);

  const maleWarningToShow =
    (arabicText && arPlan.mode === 'tts' && hasArabicVoice && arResolution.warning
      ? t.tts.noMaleVoice
      : null) ||
    (effectivePrimaryText &&
    primarySpeechLang !== 'ar-SA' &&
    primaryPlan.mode === 'tts' &&
    hasPrimaryLangVoice &&
    primaryLangResolution.warning
      ? t.tts.noMaleVoice
      : null);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{t.tts.unsupported}</span>
      </div>
    );
  }

  const startPlayback = (text: string, lang: SpeechLang) => {
    setCompactInteracted(true);
    onListenStart?.();
    speak(text, lang, {
      id,
      onEnd: () => onAudioFinished?.(lang),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {arabicText && (
          <Button
            variant={isThisPlaying && activeLang === 'ar-SA' ? 'emerald' : 'primary'}
            size={compact ? 'sm' : 'md'}
            onClick={() => startPlayback(arabicText, 'ar-SA')}
            iconLeft={<Volume2 className="w-4 h-4" />}
          >
            {t.tts.playAr}
          </Button>
        )}

        {effectivePrimaryText && settings.language !== 'ar' && (
          <Button
            variant={isThisPlaying && activeLang === primarySpeechLang ? 'emerald' : 'secondary'}
            size={compact ? 'sm' : 'md'}
            onClick={() => startPlayback(effectivePrimaryText, primarySpeechLang)}
            iconLeft={<Volume2 className="w-4 h-4" />}
          >
            {t.tts.playPrimary}
          </Button>
        )}

        <button
          type="button"
          onClick={() => setShowSliders((prev) => !prev)}
          aria-expanded={showSliders}
          aria-label={t.tts.rateLabel}
          className="min-h-[38px] min-w-[38px] px-2.5 inline-flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Active Player Bar: -5s / Play-Pause / +5s / Seekbar / Speed 0.75x-1.5x */}
      {isThisPlaying && (
        <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => skipBy(-5)}
                aria-label={t.tts.rewind5}
                className="min-h-[34px] px-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1 hover:bg-[var(--bg-surface-hover)] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>-5s</span>
              </button>

              {status === 'speaking' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pause}
                  iconLeft={<Pause className="w-3.5 h-3.5" />}
                >
                  {t.tts.pause}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resume}
                  iconLeft={<Play className="w-3.5 h-3.5" />}
                >
                  {t.tts.resume}
                </Button>
              )}

              <button
                type="button"
                onClick={() => skipBy(5)}
                aria-label={t.tts.forward5}
                className="min-h-[34px] px-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1 hover:bg-[var(--bg-surface-hover)] cursor-pointer"
              >
                <span>+5s</span>
                <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={stop}
                iconLeft={<Square className="w-3.5 h-3.5" />}
              >
                {t.tts.stop}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                {playbackMode === 'file' ? t.tts.prebuiltBadge : t.tts.deviceBadge}
              </span>
              <div className="flex items-center gap-0.5" role="group" aria-label={t.tts.rateLabel}>
                {SPEED_PRESETS.map((spd) => {
                  const active = Math.abs(settings.ttsRate - spd) < 0.03;
                  return (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => updateTtsSettings({ ttsRate: spd })}
                      className={`min-h-[28px] px-1.5 rounded-md text-[11px] font-tabular cursor-pointer transition-colors ${
                        active
                          ? 'bg-[var(--accent-navy)] text-white font-semibold'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
                      }`}
                    >
                      {spd}x
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seekbar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-tabular text-[var(--text-muted)] w-9 shrink-0">
              {formatAudioTime(currentTimeSec)}
            </span>
            <input
              type="range"
              aria-label={t.tts.seekAria}
              min={0}
              max={Math.max(1, durationSec)}
              step={0.2}
              value={Math.min(currentTimeSec, Math.max(1, durationSec))}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="flex-1 accent-[var(--accent-navy)] cursor-pointer"
            />
            <span className="text-[11px] font-tabular text-[var(--text-muted)] w-9 text-end shrink-0">
              {formatAudioTime(durationSec)}
            </span>
          </div>

          {/* Synchronized Active Sentence Highlight Strip */}
          {sentences.length > 0 && activeSentenceIndex >= 0 && sentences[activeSentenceIndex] && (
            <p
              dir={activeLang === 'ar-SA' ? 'rtl' : 'ltr'}
              className={`rounded-lg bg-[var(--accent-gold-soft)]/50 border border-[var(--accent-gold)]/35 px-3 py-1.5 text-[var(--text-primary)] ${
                activeLang === 'ar-SA' ? 'font-arabic-inline text-base leading-loose' : 'text-xs'
              }`}
            >
              {sentences[activeSentenceIndex]}
            </p>
          )}
        </div>
      )}

      {showAmbientNotices && arabicText && arPlan.mode === 'tts' && !hasArabicVoice && (
        <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl px-3 py-2 border border-[var(--border-hairline)]">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
          <span>{t.tts.noArabicVoice}</span>
        </p>
      )}

      {showAmbientNotices &&
        effectivePrimaryText &&
        primarySpeechLang !== 'ar-SA' &&
        primaryPlan.mode === 'tts' &&
        !hasPrimaryLangVoice && (
          <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl px-3 py-2 border border-[var(--border-hairline)]">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
            <span>{t.tts.noLanguageVoice}</span>
          </p>
        )}

      {showAmbientNotices && maleWarningToShow && (
        <p className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-xl px-3 py-2 border border-[var(--border-hairline)]">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-gold)]" aria-hidden="true" />
          <span>{maleWarningToShow}</span>
        </p>
      )}

      {showSliders && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
          <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center justify-between font-medium text-[var(--text-primary)]">
              <span>{t.tts.rateLabel}</span>
              <span className="font-tabular">{settings.ttsRate.toFixed(2)}x</span>
            </span>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={settings.ttsRate}
              onChange={(e) => updateTtsSettings({ ttsRate: parseFloat(e.target.value) })}
              className="accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center justify-between font-medium text-[var(--text-primary)]">
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
              className="accent-[var(--accent-navy)] cursor-pointer"
            />
          </label>

          {arabicVoiceOptions.length > 0 && (
            <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                {t.languagePicker.languageNames.ar} (ar-SA)
              </span>
              <select
                value={settings.selectedVoiceAr}
                onChange={(e) => updateTtsSettings({ selectedVoiceAr: e.target.value })}
                className="min-h-[38px] rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
              >
                <option value="">
                  {t.tts.autoOption} ({arResolution.voice?.name || t.tts.autoOption})
                </option>
                {arabicVoiceOptions.map(({ voice, genderLabel }) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({genderLabel})
                  </option>
                ))}
              </select>
            </label>
          )}

          {settings.language !== 'ar' && primaryLangVoiceOptions.length > 0 && (
            <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
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
                className="min-h-[38px] rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
              >
                <option value="">
                  {t.tts.autoOption} ({primaryLangResolution.voice?.name || t.tts.autoOption})
                </option>
                {primaryLangVoiceOptions.map(({ voice, genderLabel }) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({genderLabel})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
};

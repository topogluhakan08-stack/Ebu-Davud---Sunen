import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSpeechLangForUi } from '../utils/localizedText';
import {
  classifyVoiceGender,
  formatVoiceGenderLabel,
  getVoicesForLang,
  NO_MALE_VOICE_WARNING,
  speechService,
  type SpeechLang,
  type SpeechSnapshot,
} from '../utils/speechService';

export type { SpeechStatus, SpeechLang, VoiceGender, PlaybackMode } from '../utils/speechService';

export function useSpeech() {
  const { settings } = useApp();
  const [snapshot, setSnapshot] = useState<SpeechSnapshot>(() => speechService.getSnapshot());

  useEffect(() => {
    const unsubscribe = speechService.subscribe(setSnapshot);
    return unsubscribe;
  }, []);

  useEffect(() => {
    speechService.setRate(settings.ttsRate);
  }, [settings.ttsRate]);

  const primarySpeechLang: SpeechLang = getSpeechLangForUi(settings.language);

  const arResolution = useMemo(
    () =>
      speechService.resolveVoice(
        'ar-SA',
        settings.ttsGenderPreference,
        settings.selectedVoiceAr,
        settings.selectedVoiceTr,
        settings.selectedVoices
      ),
    [
      snapshot.voices,
      settings.ttsGenderPreference,
      settings.selectedVoiceAr,
      settings.selectedVoiceTr,
      settings.selectedVoices,
    ]
  );

  const trResolution = useMemo(
    () =>
      speechService.resolveVoice(
        'tr-TR',
        settings.ttsGenderPreference,
        settings.selectedVoiceAr,
        settings.selectedVoiceTr,
        settings.selectedVoices
      ),
    [
      snapshot.voices,
      settings.ttsGenderPreference,
      settings.selectedVoiceAr,
      settings.selectedVoiceTr,
      settings.selectedVoices,
    ]
  );

  const primaryLangResolution = useMemo(
    () =>
      speechService.resolveVoice(
        primarySpeechLang,
        settings.ttsGenderPreference,
        settings.selectedVoiceAr,
        settings.selectedVoiceTr,
        settings.selectedVoices
      ),
    [
      snapshot.voices,
      primarySpeechLang,
      settings.ttsGenderPreference,
      settings.selectedVoiceAr,
      settings.selectedVoiceTr,
      settings.selectedVoices,
    ]
  );

  const mapVoiceOptions = useCallback((list: SpeechSynthesisVoice[]) => {
    return list.map((v) => {
      const gender = classifyVoiceGender(v.name, v.lang);
      return {
        voice: v,
        gender,
        genderLabel: formatVoiceGenderLabel(gender),
      };
    });
  }, []);

  const arabicVoiceOptions = useMemo(
    () => mapVoiceOptions(snapshot.arabicVoices),
    [mapVoiceOptions, snapshot.arabicVoices]
  );

  const turkishVoiceOptions = useMemo(
    () => mapVoiceOptions(snapshot.turkishVoices),
    [mapVoiceOptions, snapshot.turkishVoices]
  );

  const primaryLangVoices = useMemo(
    () => getVoicesForLang(snapshot.voices, primarySpeechLang),
    [snapshot.voices, primarySpeechLang]
  );

  const primaryLangVoiceOptions = useMemo(
    () => mapVoiceOptions(primaryLangVoices),
    [mapVoiceOptions, primaryLangVoices]
  );

  const speak = useCallback(
    (text: string, lang: SpeechLang, options?: { id?: string; onEnd?: () => void }) => {
      void speechService.speak(text, lang, {
        id: options?.id,
        onEnd: options?.onEnd,
        rate: settings.ttsRate,
        pitch: settings.ttsPitch,
        genderPreference: settings.ttsGenderPreference,
        audioSource: settings.ttsAudioSource,
        selectedVoiceAr: settings.selectedVoiceAr,
        selectedVoiceTr: settings.selectedVoiceTr,
        selectedVoices: settings.selectedVoices,
      });
    },
    [
      settings.ttsRate,
      settings.ttsPitch,
      settings.ttsGenderPreference,
      settings.ttsAudioSource,
      settings.selectedVoiceAr,
      settings.selectedVoiceTr,
      settings.selectedVoices,
    ]
  );

  const pause = useCallback(() => speechService.pause(), []);
  const resume = useCallback(() => speechService.resume(), []);
  const stop = useCallback(() => speechService.stop(), []);
  const seekTo = useCallback((seconds: number) => speechService.seekTo(seconds), []);
  const skipBy = useCallback((deltaSeconds: number) => speechService.skipBy(deltaSeconds), []);

  return {
    isSupported: snapshot.isSupported,
    voices: snapshot.voices,
    arabicVoices: snapshot.arabicVoices,
    turkishVoices: snapshot.turkishVoices,
    primaryLangVoices,
    arabicVoiceOptions,
    turkishVoiceOptions,
    primaryLangVoiceOptions,
    hasArabicVoice: snapshot.arabicVoices.length > 0,
    hasTurkishVoice: snapshot.turkishVoices.length > 0,
    hasPrimaryLangVoice: primaryLangVoices.length > 0,
    primarySpeechLang,
    arResolution,
    trResolution,
    primaryLangResolution,
    noMaleVoiceWarning: NO_MALE_VOICE_WARNING,
    status: snapshot.status,
    playbackMode: snapshot.playbackMode,
    activeLang: snapshot.activeLang,
    activeTokenIndex: snapshot.activeTokenIndex,
    activeSentenceIndex: snapshot.activeSentenceIndex,
    sentences: snapshot.sentences,
    currentTimeSec: snapshot.currentTimeSec,
    durationSec: snapshot.durationSec,
    activeId: snapshot.activeId,
    activeManifestEntry: snapshot.activeManifestEntry,
    lastWarning: snapshot.lastWarning,
    speak,
    pause,
    resume,
    stop,
    seekTo,
    skipBy,
  };
}

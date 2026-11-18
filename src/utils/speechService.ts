import type { LanguageCode, TtsAudioSource, TtsGenderPreference } from '../types';
import {
  AUDIO_CACHE_NAME,
  estimateSentenceIndexAtTime,
  resolveAudioPlaybackPlan,
  splitIntoSentences,
  type AudioManifestEntry,
} from './audioManifest';

export type VoiceGender = 'male' | 'female' | 'unknown';
export type SpeechLang = 'ar-SA' | 'tr-TR' | 'fr-FR' | 'de-DE' | 'nl-NL';
export type SpeechStatus = 'idle' | 'speaking' | 'paused';
export type PlaybackMode = 'file' | 'tts';

export const NO_MALE_VOICE_WARNING =
  'Cihazınızda erkek ses bulunamadı. Hazır sesli anlatım yalnızca hadis ve ana bölümler için mevcuttur.';

export const NO_ARABIC_VOICE_WARNING =
  'Tarayıcınızda yerleşik Arapça (ar-SA) ses paketi bulunamadı. Sistem varsayılan sesiyle okunabilir veya cihaz ayarlarından Arapça ses ekleyebilirsiniz.';

export const NO_TURKISH_VOICE_WARNING =
  'Tarayıcınızda yerleşik Türkçe (tr-TR) ses paketi bulunamadı. Sistem varsayılan sesiyle okunabilir.';

const AR_MALE_PATTERNS = [
  'microsoft naayf',
  'microsoft hamed',
  'majed',
  'maged',
  'naayf',
  'hamed',
  'tariq',
  'bassel',
  'hamdan',
  'shakir',
  'fahed',
  'jamal',
];

const TR_MALE_PATTERNS = [
  'microsoft tolga',
  'microsoft cem',
  'tolga',
  'cem',
  'ahmet',
  'kerem',
];

const AR_FEMALE_PATTERNS = [
  'zariyah',
  'hoda',
  'laila',
  'salma',
  'zeina',
  'mariam',
  'amira',
  'fatima',
  'rana',
  'nour',
  'sana',
];

const TR_FEMALE_PATTERNS = [
  'filiz',
  'yelda',
  'emel',
  'seda',
  'aysel',
  'leyla',
];

const FR_MALE_PATTERNS = ['thomas', 'paul', 'henri', 'remy', 'rémy', 'alain', 'daniel'];
const FR_FEMALE_PATTERNS = ['amelie', 'amélie', 'hortense', 'denise', 'celine', 'céline', 'audrey'];

const DE_MALE_PATTERNS = ['stefan', 'conrad', 'florian', 'killian', 'markus', 'hans', 'klaus'];
const DE_FEMALE_PATTERNS = ['katja', 'hedda', 'amala', 'anna', 'petra', 'gisela'];

const NL_MALE_PATTERNS = ['maarten', 'frank', 'ruben', 'coen', 'daan'];
const NL_FEMALE_PATTERNS = ['fenna', 'colette', 'lotte', 'claire', 'ellen'];

const GENERIC_FEMALE_HINTS = ['female', 'woman', 'kadın', 'kadin', 'feminine', 'femme', 'frau', 'vrouw'];
const GENERIC_MALE_HINTS = ['male', 'man', 'erkek', 'masculine', 'homme', 'mann'];

export interface VoiceLike {
  name: string;
  lang: string;
  default?: boolean;
  localService?: boolean;
  voiceURI?: string;
}

export interface VoiceSelectionResult<T extends VoiceLike = VoiceLike> {
  voice: T | null;
  gender: VoiceGender | null;
  warning: string | null;
  hasAnyVoiceForLang: boolean;
  hasMaleVoiceForLang: boolean;
}

export interface SpeakOptions {
  id?: string;
  rate?: number;
  pitch?: number;
  genderPreference?: TtsGenderPreference;
  audioSource?: TtsAudioSource;
  selectedVoiceAr?: string;
  selectedVoiceTr?: string;
  selectedVoices?: Partial<Record<LanguageCode, string>>;
  onEnd?: () => void;
}

export interface SpeechSnapshot {
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  arabicVoices: SpeechSynthesisVoice[];
  turkishVoices: SpeechSynthesisVoice[];
  status: SpeechStatus;
  playbackMode: PlaybackMode;
  activeLang: SpeechLang | null;
  activeTokenIndex: number;
  activeSentenceIndex: number;
  sentences: string[];
  currentTimeSec: number;
  durationSec: number;
  activeId: string | null;
  activeManifestEntry: AudioManifestEntry | null;
  lastWarning: string | null;
}

export function classifyVoiceGender(name: string, lang: string): VoiceGender {
  const normalized = name.trim().toLowerCase();
  const normalizedLang = lang.trim().toLowerCase();

  if (!normalized) return 'unknown';

  for (const hint of GENERIC_FEMALE_HINTS) {
    if (normalized.includes(hint)) {
      return 'female';
    }
  }
  const femaleList = normalizedLang.startsWith('tr')
    ? TR_FEMALE_PATTERNS
    : normalizedLang.startsWith('ar')
      ? AR_FEMALE_PATTERNS
      : normalizedLang.startsWith('fr')
        ? FR_FEMALE_PATTERNS
        : normalizedLang.startsWith('de')
          ? DE_FEMALE_PATTERNS
          : normalizedLang.startsWith('nl')
            ? NL_FEMALE_PATTERNS
            : [...AR_FEMALE_PATTERNS, ...TR_FEMALE_PATTERNS, ...FR_FEMALE_PATTERNS, ...DE_FEMALE_PATTERNS, ...NL_FEMALE_PATTERNS];

  for (const pattern of femaleList) {
    if (normalized.includes(pattern)) {
      return 'female';
    }
  }

  const maleList = normalizedLang.startsWith('tr')
    ? TR_MALE_PATTERNS
    : normalizedLang.startsWith('ar')
      ? AR_MALE_PATTERNS
      : normalizedLang.startsWith('fr')
        ? FR_MALE_PATTERNS
        : normalizedLang.startsWith('de')
          ? DE_MALE_PATTERNS
          : normalizedLang.startsWith('nl')
            ? NL_MALE_PATTERNS
            : [...AR_MALE_PATTERNS, ...TR_MALE_PATTERNS, ...FR_MALE_PATTERNS, ...DE_MALE_PATTERNS, ...NL_MALE_PATTERNS];

  for (const pattern of maleList) {
    if (normalized.includes(pattern)) {
      return 'male';
    }
  }

  if (normalized.includes('google') && normalized.includes('العربية')) {
    if (
      normalized.includes('male') ||
      normalized.includes('erkek') ||
      normalized.includes('xa-b') ||
      normalized.includes('xa-d')
    ) {
      return 'male';
    }
    return 'unknown';
  }

  for (const hint of GENERIC_MALE_HINTS) {
    const regex = new RegExp(`\\b${hint}\\b`, 'i');
    if (regex.test(normalized)) {
      return 'male';
    }
  }

  return 'unknown';
}

export function formatVoiceGenderLabel(gender: VoiceGender): string {
  if (gender === 'male') return 'Erkek';
  if (gender === 'female') return 'Kadın';
  return 'Bilinmiyor';
}

function getLangPrefix(lang: SpeechLang): string {
  return lang.slice(0, 2).toLowerCase();
}

export function getVoicesForLang<T extends VoiceLike>(voices: T[], lang: SpeechLang): T[] {
  const prefix = getLangPrefix(lang);
  return voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
}

export function selectVoiceForLanguage<T extends VoiceLike>(
  voices: T[],
  lang: SpeechLang,
  options: {
    genderPreference: TtsGenderPreference;
    selectedVoiceName?: string;
  }
): VoiceSelectionResult<T> {
  const langVoices = getVoicesForLang(voices, lang);

  if (langVoices.length === 0) {
    return {
      voice: null,
      gender: null,
      warning:
        lang === 'ar-SA'
          ? NO_ARABIC_VOICE_WARNING
          : lang === 'tr-TR'
            ? NO_TURKISH_VOICE_WARNING
            : NO_MALE_VOICE_WARNING,
      hasAnyVoiceForLang: false,
      hasMaleVoiceForLang: false,
    };
  }

  const classified = langVoices.map((v) => ({
    voice: v,
    gender: classifyVoiceGender(v.name, v.lang),
  }));

  const maleVoices = classified.filter((item) => item.gender === 'male');
  const femaleVoices = classified.filter((item) => item.gender === 'female');
  const unknownVoices = classified.filter((item) => item.gender === 'unknown');

  if (options.selectedVoiceName) {
    const explicit = classified.find((item) => item.voice.name === options.selectedVoiceName);
    if (explicit) {
      const needsMaleWarn =
        options.genderPreference === 'male' &&
        explicit.gender !== 'male' &&
        maleVoices.length === 0;
      return {
        voice: explicit.voice,
        gender: explicit.gender,
        warning: needsMaleWarn ? NO_MALE_VOICE_WARNING : null,
        hasAnyVoiceForLang: true,
        hasMaleVoiceForLang: maleVoices.length > 0,
      };
    }
  }

  const pickExactOrFirst = (list: typeof classified) =>
    list.find((item) => item.voice.lang.toLowerCase() === lang.toLowerCase()) ?? list[0];

  if (options.genderPreference === 'male') {
    if (maleVoices.length > 0) {
      const picked = pickExactOrFirst(maleVoices);
      return {
        voice: picked.voice,
        gender: picked.gender,
        warning: null,
        hasAnyVoiceForLang: true,
        hasMaleVoiceForLang: true,
      };
    }

    const nonFemalePool = unknownVoices.length > 0 ? unknownVoices : femaleVoices;
    const picked = pickExactOrFirst(nonFemalePool);
    return {
      voice: picked.voice,
      gender: picked.gender,
      warning: NO_MALE_VOICE_WARNING,
      hasAnyVoiceForLang: true,
      hasMaleVoiceForLang: false,
    };
  }

  if (options.genderPreference === 'female') {
    if (femaleVoices.length > 0) {
      const picked = pickExactOrFirst(femaleVoices);
      return {
        voice: picked.voice,
        gender: picked.gender,
        warning: null,
        hasAnyVoiceForLang: true,
        hasMaleVoiceForLang: maleVoices.length > 0,
      };
    }
    const fallbackPool = unknownVoices.length > 0 ? unknownVoices : maleVoices;
    const picked = pickExactOrFirst(fallbackPool);
    return {
      voice: picked.voice,
      gender: picked.gender,
      warning: null,
      hasAnyVoiceForLang: true,
      hasMaleVoiceForLang: maleVoices.length > 0,
    };
  }

  const autoOrdered =
    maleVoices.length > 0
      ? maleVoices
      : unknownVoices.length > 0
        ? unknownVoices
        : femaleVoices;
  const picked = pickExactOrFirst(autoOrdered);
  return {
    voice: picked.voice,
    gender: picked.gender,
    warning: null,
    hasAnyVoiceForLang: true,
    hasMaleVoiceForLang: maleVoices.length > 0,
  };
}

class CentralSpeechService {
  private listeners = new Set<(snapshot: SpeechSnapshot) => void>();
  private voicesLoadedListenerAttached = false;
  private audioEl: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;
  private ttsSessionToken = 0;
  private activeTtsTimer: number | null = null;
  private currentSpeakPayload: {
    text: string;
    lang: SpeechLang;
    options: SpeakOptions;
    sentences: string[];
    sentenceDurationsSec: number[];
  } | null = null;

  private snapshot: SpeechSnapshot = {
    isSupported:
      typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window),
    voices: [],
    arabicVoices: [],
    turkishVoices: [],
    status: 'idle',
    playbackMode: 'tts',
    activeLang: null,
    activeTokenIndex: -1,
    activeSentenceIndex: -1,
    sentences: [],
    currentTimeSec: 0,
    durationSec: 0,
    activeId: null,
    activeManifestEntry: null,
    lastWarning: null,
  };

  private init() {
    if (typeof window === 'undefined' || this.voicesLoadedListenerAttached) return;
    if (!('speechSynthesis' in window)) return;
    this.voicesLoadedListenerAttached = true;
    this.refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', this.handleVoicesChanged);
  }

  private handleVoicesChanged = () => {
    this.refreshVoices();
  };

  public refreshVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const allVoices = window.speechSynthesis.getVoices();
    this.updateSnapshot({
      voices: allVoices,
      arabicVoices: getVoicesForLang(allVoices, 'ar-SA'),
      turkishVoices: getVoicesForLang(allVoices, 'tr-TR'),
    });
  }

  private updateSnapshot(patch: Partial<SpeechSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener(this.snapshot));
  }

  public getSnapshot(): SpeechSnapshot {
    this.init();
    return this.snapshot;
  }

  public subscribe(listener: (snapshot: SpeechSnapshot) => void): () => void {
    this.init();
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public resolveVoice(
    lang: SpeechLang,
    genderPreference: TtsGenderPreference,
    selectedVoiceAr?: string,
    selectedVoiceTr?: string,
    selectedVoices?: Partial<Record<LanguageCode, string>>
  ): VoiceSelectionResult<SpeechSynthesisVoice> {
    this.init();
    const uiCode = lang.slice(0, 2) as LanguageCode;
    const selectedVoiceName =
      selectedVoices?.[uiCode] ||
      (lang === 'ar-SA' ? selectedVoiceAr : lang === 'tr-TR' ? selectedVoiceTr : '');
    return selectVoiceForLanguage(this.snapshot.voices, lang, {
      genderPreference,
      selectedVoiceName,
    });
  }

  private cleanupMedia() {
    this.ttsSessionToken++;
    if (this.activeTtsTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.activeTtsTimer);
      this.activeTtsTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.ontimeupdate = null;
      this.audioEl.onloadedmetadata = null;
      this.audioEl.onended = null;
      this.audioEl.onerror = null;
      this.audioEl.removeAttribute('src');
      this.audioEl = null;
    }
    if (this.activeObjectUrl) {
      URL.revokeObjectURL(this.activeObjectUrl);
      this.activeObjectUrl = null;
    }
  }

  private finishPlayback(onEnd?: () => void) {
    this.cleanupMedia();
    this.currentSpeakPayload = null;
    this.updateSnapshot({
      status: 'idle',
      activeTokenIndex: -1,
      activeSentenceIndex: -1,
      sentences: [],
      currentTimeSec: 0,
      durationSec: 0,
      activeId: null,
      activeLang: null,
      activeManifestEntry: null,
    });
    onEnd?.();
  }

  private async playPrebuiltFile(
    entry: AudioManifestEntry,
    text: string,
    lang: SpeechLang,
    options: SpeakOptions
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !('Audio' in window)) return false;

    const sentences = splitIntoSentences(text);
    const rate = options.rate ?? 0.9;
    let srcUrl = entry.path;

    if ('caches' in window) {
      try {
        const cache = await window.caches.open(AUDIO_CACHE_NAME);
        const cachedRes = await cache.match(entry.path);
        if (cachedRes) {
          const blob = await cachedRes.blob();
          this.activeObjectUrl = URL.createObjectURL(blob);
          srcUrl = this.activeObjectUrl;
        }
      } catch {
        // Fallback to network URL cleanly
      }
    }

    return new Promise<boolean>((resolve) => {
      const audio = new Audio(srcUrl);
      audio.playbackRate = Math.min(2, Math.max(0.5, rate));
      this.audioEl = audio;

      let settled = false;

      audio.onloadedmetadata = () => {
        const dur = Number.isFinite(audio.duration) ? audio.duration : entry.durationSec ?? 0;
        this.updateSnapshot({ durationSec: dur });
      };

      audio.ontimeupdate = () => {
        const dur = Number.isFinite(audio.duration)
          ? audio.duration
          : this.snapshot.durationSec || entry.durationSec || 1;
        const cur = audio.currentTime;
        const sIdx = estimateSentenceIndexAtTime(sentences, cur, dur);
        this.updateSnapshot({
          currentTimeSec: cur,
          durationSec: dur,
          activeSentenceIndex: sIdx,
        });
      };

      audio.onended = () => {
        this.finishPlayback(options.onEnd);
      };

      audio.onerror = () => {
        if (!settled) {
          settled = true;
          this.cleanupMedia();
          resolve(false);
        } else {
          this.finishPlayback();
        }
      };

      audio
        .play()
        .then(() => {
          settled = true;
          this.updateSnapshot({
            status: 'speaking',
            playbackMode: 'file',
            activeLang: lang,
            activeId: options.id ?? null,
            activeManifestEntry: entry,
            sentences,
            activeSentenceIndex: 0,
            currentTimeSec: 0,
            durationSec: entry.durationSec ?? 0,
            lastWarning: null,
          });
          resolve(true);
        })
        .catch(() => {
          if (!settled) {
            settled = true;
            this.cleanupMedia();
            resolve(false);
          }
        });
    });
  }

  private playWebSpeechFromSentence(startIndex: number) {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !this.currentSpeakPayload
    ) {
      return;
    }

    const { text, lang, options, sentences, sentenceDurationsSec } = this.currentSpeakPayload;
    const rate = options.rate ?? 0.9;
    const pitch = options.pitch ?? 0.85;
    const genderPreference = options.genderPreference ?? 'male';

    const selection = this.resolveVoice(
      lang,
      genderPreference,
      options.selectedVoiceAr,
      options.selectedVoiceTr,
      options.selectedVoices
    );

    const totalDur = sentenceDurationsSec.reduce((a, b) => a + b, 0);
    const sessionToken = ++this.ttsSessionToken;
    window.speechSynthesis.cancel();

    if (this.activeTtsTimer !== null) {
      window.clearInterval(this.activeTtsTimer);
      this.activeTtsTimer = null;
    }

    const clampedStart = Math.max(0, Math.min(startIndex, sentences.length - 1));
    const offsetStartSec = sentenceDurationsSec
      .slice(0, clampedStart)
      .reduce((a, b) => a + b, 0);

    this.updateSnapshot({
      status: 'speaking',
      playbackMode: 'tts',
      activeLang: lang,
      activeId: options.id ?? null,
      activeManifestEntry: null,
      sentences,
      activeSentenceIndex: clampedStart,
      currentTimeSec: offsetStartSec,
      durationSec: totalDur,
      lastWarning: selection.warning,
    });

    const speakChunk = (idx: number) => {
      if (sessionToken !== this.ttsSessionToken) return;
      if (idx >= sentences.length) {
        this.finishPlayback(options.onEnd);
        return;
      }

      const sentence = sentences[idx];
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (selection.voice) {
        utterance.voice = selection.voice;
      }

      const chunkStartSec = sentenceDurationsSec.slice(0, idx).reduce((a, b) => a + b, 0);
      const chunkDur = Math.max(0.8, sentenceDurationsSec[idx] || 2);
      const startedAt = Date.now();

      if (this.activeTtsTimer !== null) {
        window.clearInterval(this.activeTtsTimer);
      }
      this.activeTtsTimer = window.setInterval(() => {
        if (sessionToken !== this.ttsSessionToken || this.snapshot.status !== 'speaking') return;
        const elapsed = (Date.now() - startedAt) / 1000;
        this.updateSnapshot({
          currentTimeSec: Math.min(totalDur, chunkStartSec + Math.min(elapsed, chunkDur)),
        });
      }, 250);

      utterance.onstart = () => {
        if (sessionToken !== this.ttsSessionToken) return;
        this.updateSnapshot({
          status: 'speaking',
          activeSentenceIndex: idx,
          activeTokenIndex: 0,
          currentTimeSec: chunkStartSec,
        });
      };

      utterance.onboundary = (event) => {
        if (sessionToken !== this.ttsSessionToken) return;
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          const prefix = text.slice(0, event.charIndex).trim();
          const tokIdx = prefix ? prefix.split(/\s+/).length : 0;
          this.updateSnapshot({ activeTokenIndex: tokIdx });
        }
      };

      utterance.onend = () => {
        if (sessionToken !== this.ttsSessionToken) return;
        if (this.activeTtsTimer !== null) {
          window.clearInterval(this.activeTtsTimer);
          this.activeTtsTimer = null;
        }
        speakChunk(idx + 1);
      };

      utterance.onerror = () => {
        if (sessionToken !== this.ttsSessionToken) return;
        this.finishPlayback();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakChunk(clampedStart);
  }

  public async speak(text: string, lang: SpeechLang, options: SpeakOptions = {}) {
    this.init();
    if (!text.trim()) return;

    this.cleanupMedia();

    const audioSource: TtsAudioSource = options.audioSource ?? 'prebuilt';
    const plan = resolveAudioPlaybackPlan(options.id, lang, audioSource);

    if (plan.mode === 'file' && plan.entry) {
      const ok = await this.playPrebuiltFile(plan.entry, text, lang, options);
      if (ok) return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const sentences = splitIntoSentences(text);
    const rate = options.rate ?? 0.9;
    const charsPerSec = (lang === 'ar-SA' ? 11 : 13.5) * Math.max(0.5, rate);
    const sentenceDurationsSec = sentences.map((s) => Math.max(1.2, s.length / charsPerSec));

    this.currentSpeakPayload = {
      text,
      lang,
      options,
      sentences,
      sentenceDurationsSec,
    };

    this.playWebSpeechFromSentence(0);
  }

  public seekTo(seconds: number) {
    if (this.snapshot.status === 'idle') return;
    if (this.snapshot.playbackMode === 'file' && this.audioEl) {
      const dur = Number.isFinite(this.audioEl.duration)
        ? this.audioEl.duration
        : this.snapshot.durationSec;
      const clamped = Math.max(0, Math.min(seconds, dur));
      this.audioEl.currentTime = clamped;
      const sIdx = estimateSentenceIndexAtTime(this.snapshot.sentences, clamped, dur);
      this.updateSnapshot({ currentTimeSec: clamped, activeSentenceIndex: sIdx });
      return;
    }

    if (this.snapshot.playbackMode === 'tts' && this.currentSpeakPayload) {
      const { sentenceDurationsSec } = this.currentSpeakPayload;
      const clamped = Math.max(0, Math.min(seconds, this.snapshot.durationSec));
      let acc = 0;
      let targetIdx = 0;
      for (let i = 0; i < sentenceDurationsSec.length; i++) {
        if (acc + sentenceDurationsSec[i] >= clamped) {
          targetIdx = i;
          break;
        }
        acc += sentenceDurationsSec[i];
        targetIdx = i;
      }
      this.playWebSpeechFromSentence(targetIdx);
    }
  }

  public skipBy(deltaSeconds: number) {
    this.seekTo(this.snapshot.currentTimeSec + deltaSeconds);
  }

  public setRate(rate: number) {
    if (this.audioEl) {
      this.audioEl.playbackRate = Math.min(2, Math.max(0.5, rate));
    }
    if (this.currentSpeakPayload) {
      this.currentSpeakPayload.options.rate = rate;
    }
  }

  public pause() {
    if (this.snapshot.status !== 'speaking') return;
    if (this.snapshot.playbackMode === 'file' && this.audioEl) {
      this.audioEl.pause();
      this.updateSnapshot({ status: 'paused' });
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.updateSnapshot({ status: 'paused' });
    }
  }

  public resume() {
    if (this.snapshot.status !== 'paused') return;
    if (this.snapshot.playbackMode === 'file' && this.audioEl) {
      void this.audioEl.play();
      this.updateSnapshot({ status: 'speaking' });
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.updateSnapshot({ status: 'speaking' });
    }
  }

  public stop() {
    this.cleanupMedia();
    this.currentSpeakPayload = null;
    this.updateSnapshot({
      status: 'idle',
      activeTokenIndex: -1,
      activeSentenceIndex: -1,
      sentences: [],
      currentTimeSec: 0,
      durationSec: 0,
      activeId: null,
      activeLang: null,
      activeManifestEntry: null,
    });
  }
}

export const speechService = new CentralSpeechService();

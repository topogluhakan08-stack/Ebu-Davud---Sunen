import manifestRaw from '../data/audio-manifest.json';
import type { TtsAudioSource } from '../types';

export const AUDIO_CACHE_NAME = 'kitabul-edeb-audio-v1';

export interface AudioManifestEntry {
  key: string;
  id: string;
  lang: 'ar-SA' | 'tr-TR';
  category: 'hadith' | 'section';
  hadithId?: number;
  title: string;
  path: string;
  voiceName: string;
  available: boolean;
  sizeBytes?: number;
  durationSec?: number;
}

export interface AudioManifest {
  version: number;
  model: string;
  defaultVoice: string;
  generatedCount: number;
  totalCount: number;
  totalBytes: number;
  entries: AudioManifestEntry[];
}

export const AUDIO_MANIFEST = manifestRaw as AudioManifest;

export interface AudioPlaybackPlan {
  mode: 'file' | 'tts';
  entry: AudioManifestEntry | null;
}

export type AnySpeechLang = 'ar-SA' | 'tr-TR' | 'fr-FR' | 'de-DE' | 'nl-NL';

export function getManifestEntry(
  id: string | undefined,
  lang: AnySpeechLang,
  manifest: AudioManifest = AUDIO_MANIFEST
): AudioManifestEntry | null {
  if (!id || (lang !== 'ar-SA' && lang !== 'tr-TR')) return null;
  return manifest.entries.find((e) => e.id === id && e.lang === lang) ?? null;
}

export function resolveAudioPlaybackPlan(
  id: string | undefined,
  lang: AnySpeechLang,
  audioSource: TtsAudioSource,
  manifest: AudioManifest = AUDIO_MANIFEST
): AudioPlaybackPlan {
  const entry = getManifestEntry(id, lang, manifest);
  if (audioSource === 'prebuilt' && entry?.available) {
    return { mode: 'file', entry };
  }
  return { mode: 'tts', entry };
}

export function getManifestStats(manifest: AudioManifest = AUDIO_MANIFEST): {
  totalCount: number;
  availableCount: number;
  totalBytes: number;
} {
  const availableEntries = manifest.entries.filter((e) => e.available);
  return {
    totalCount: manifest.entries.length,
    availableCount: availableEntries.length,
    totalBytes: availableEntries.reduce((sum, e) => sum + (e.sizeBytes ?? 0), 0),
  };
}

/**
 * Splits Arabic, Turkish, or French narration text into clean non-empty sentences/clauses
 * for synchronized highlighting and sentence-aware seeking.
 */
export function splitIntoSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  // Protect scholarly & honorific abbreviations (b., Hz., r.a., s., H., M., c., nr., vb.) from false splits
  const DOT_TOKEN = '\uE000';
  const protectedText = cleaned
    .replace(/\b(b|Hz|hz|r\.a|a\.s|s\.a\.v|s|H|M|c|krş|bk|vr|vb|nr|Dr|Prof|st|St)\./g, `$1${DOT_TOKEN}`)
    .replace(/\(([^)]+)\)/g, (m) => m.replace(/\./g, DOT_TOKEN));

  // Split after punctuation marks (. ! ? ؟ ؛) while keeping punctuation attached
  const parts = protectedText
    .split(/(?<=[.!؟؛?])\s+(?=[«"'(A-ZÂÎÛÇĞİÖŞÜ\u0600-\u06FF])/)
    .map((s) => s.replaceAll(DOT_TOKEN, '.').trim())
    .filter(Boolean);

  if (parts.length <= 1 && cleaned.length > 140) {
    // Fallback split on Arabic/Latin semicolon, colon or comma when single long clause exists
    const commaParts = cleaned
      .split(/(?<=[،؛:])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (commaParts.length > 1) return commaParts;
  }

  return parts.length > 0 ? parts : [cleaned];
}

/**
 * Estimates which sentence is currently spoken at elapsed time `currentTimeSec` / `durationSec`
 * proportional to character counts.
 */
export function estimateSentenceIndexAtTime(
  sentences: string[],
  currentTimeSec: number,
  durationSec: number
): number {
  if (sentences.length === 0) return -1;
  if (durationSec <= 0 || currentTimeSec <= 0) return 0;
  const ratio = Math.min(0.9999, Math.max(0, currentTimeSec / durationSec));
  const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
  if (totalChars === 0) return 0;

  const targetChar = ratio * totalChars;
  let acc = 0;
  for (let i = 0; i < sentences.length; i++) {
    acc += sentences[i].length;
    if (acc >= targetChar) return i;
  }
  return sentences.length - 1;
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function getCachedAudioCount(
  manifest: AudioManifest = AUDIO_MANIFEST
): Promise<{ cachedCount: number; availableCount: number; cachedBytes: number }> {
  const available = manifest.entries.filter((e) => e.available);
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { cachedCount: 0, availableCount: available.length, cachedBytes: 0 };
  }
  try {
    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    let cachedCount = 0;
    let cachedBytes = 0;
    for (const item of available) {
      const match = await cache.match(item.path);
      if (match) {
        cachedCount++;
        cachedBytes += item.sizeBytes ?? 0;
      }
    }
    return { cachedCount, availableCount: available.length, cachedBytes };
  } catch {
    return { cachedCount: 0, availableCount: available.length, cachedBytes: 0 };
  }
}

export async function cacheAvailableAudioFiles(
  onProgress?: (done: number, total: number) => void,
  manifest: AudioManifest = AUDIO_MANIFEST
): Promise<{ cached: number; failed: number }> {
  const available = manifest.entries.filter((e) => e.available);
  if (typeof window === 'undefined' || !('caches' in window) || available.length === 0) {
    return { cached: 0, failed: 0 };
  }

  const cache = await window.caches.open(AUDIO_CACHE_NAME);
  let cached = 0;
  let failed = 0;

  for (let i = 0; i < available.length; i++) {
    const item = available[i];
    try {
      const existing = await cache.match(item.path);
      if (!existing) {
        const res = await fetch(item.path);
        if (res.ok) {
          await cache.put(item.path, res);
          cached++;
        } else {
          failed++;
        }
      } else {
        cached++;
      }
    } catch {
      failed++;
    }
    onProgress?.(i + 1, available.length);
  }

  return { cached, failed };
}

export async function clearAudioCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    await window.caches.delete(AUDIO_CACHE_NAME);
  } catch {
    // Ignore safely
  }
}

#!/usr/bin/env node
/**
 * Pre-generates calm, clear male narration MP3 files for all 38 hadiths (ar + tr)
 * and main TDV sections using Gemini 3.8 Flash Lite TTS + ffmpeg mono compression.
 *
 * Usage:
 *   GEMINI_API_KEY="..." node scripts/generate-audio.mjs
 *   node scripts/generate-audio.mjs --manifest-only
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';

const ROOT = path.resolve(import.meta.dirname, '..');
const HADISLER_PATH = path.join(ROOT, 'src/data/hadisler.json');
const EBU_DAVUD_PATH = path.join(ROOT, 'src/data/ebu-davud.json');
const SUNEN_PATH = path.join(ROOT, 'src/data/sunen.json');
const AUDIO_DIR = path.join(ROOT, 'public/audio');
const MANIFEST_PATH = path.join(ROOT, 'src/data/audio-manifest.json');

// 'Charon' / 'Orus' / 'Fenrir' are male voices in Gemini prebuiltVoiceConfig
const MALE_VOICE_AR = process.env.TTS_VOICE_AR || 'Charon';
const MALE_VOICE_TR = process.env.TTS_VOICE_TR || 'Charon';
const TTS_MODEL = 'gemini-3.8-flash-lite-tts';

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildTargetItems() {
  const hadiths = loadJson(HADISLER_PATH);
  const ebuDavud = loadJson(EBU_DAVUD_PATH);
  const sunen = loadJson(SUNEN_PATH);

  const items = [];

  for (const h of hadiths) {
    items.push({
      id: `hadith-${h.id}`,
      lang: 'ar-SA',
      key: `hadith-${h.id}-ar`,
      category: 'hadith',
      hadithId: h.id,
      title: `Hadis #${h.id} (Arapça)`,
      path: `/audio/hadith-${h.id}-ar.mp3`,
      voiceName: MALE_VOICE_AR,
      style: 'Calm, reverent, articulate classical Arabic scholarly recitation with clear harakat',
      text: h.fullTextAr,
    });

    items.push({
      id: `hadith-${h.id}`,
      lang: 'tr-TR',
      key: `hadith-${h.id}-tr`,
      category: 'hadith',
      hadithId: h.id,
      title: `Hadis #${h.id} (Türkçe)`,
      path: `/audio/hadith-${h.id}-tr.mp3`,
      voiceName: MALE_VOICE_TR,
      style: 'Calm, dignified, clear Turkish academic narrator',
      text: h.translationTr,
    });
  }

  const mainSections = [
    {
      id: 'ebu-davud-hero',
      title: 'Ebû Dâvûd · Genel Tanıtım',
      text: `${ebuDavud.meta.fullTitleTr}. ${ebuDavud.biography.birthDeath}. ${ebuDavud.biography.sijistanNote}`,
    },
    {
      id: 'ebu-davud-bio',
      title: 'Ebû Dâvûd · Hayatı ve İlim Yolculuğu',
      text: `${ebuDavud.biography.earlyEducation} ${ebuDavud.biography.teachersCountNote} ${ebuDavud.biography.basraSettlementAndZanj} ${ebuDavud.biography.deathAndBurial}`,
    },
    {
      id: 'ebu-davud-hadith',
      title: 'Ebû Dâvûd · Hadis İlmindeki Yeri',
      text: ebuDavud.hadithScholarship.summaryTr,
    },
    {
      id: 'ebu-davud-fiqh',
      title: 'Ebû Dâvûd · Fıkhî Kimliği ve Mezhebi',
      text: `${ebuDavud.fiqhAndMethodology.fiqhAffiliationTr} ${ebuDavud.fiqhAndMethodology.selefiyyeAndZuhdTr}`,
    },
    {
      id: 'ebu-davud-works',
      title: 'Ebû Dâvûd · Eserleri',
      text: `Ebû Dâvûd'un başlıca 9 eseri: ${ebuDavud.works.mainWorks.map((w) => w.title).join(', ')}.`,
    },
    {
      id: 'sunen-hero',
      title: 'es-Sünen · Genel Tanıtım',
      text: `${sunen.meta.titleTr}. ${sunen.compilationAndPurpose.summaryTr}`,
    },
    {
      id: 'sunen-compilation',
      title: 'es-Sünen · Telif Amacı ve Risâle',
      text: `${sunen.compilationAndPurpose.summaryTr} ${sunen.compilationAndPurpose.ahmedBinHanbelNote}`,
    },
    {
      id: 'sunen-authenticity',
      title: 'es-Sünen · Sıhhat Değerlendirmesi',
      text: `${sunen.authenticityAndStructure.tiersSummaryTr} ${sunen.authenticityAndStructure.generalGradingAndRankTr}`,
    },
  ];

  for (const sec of mainSections) {
    items.push({
      id: sec.id,
      lang: 'tr-TR',
      key: `${sec.id}-tr`,
      category: 'section',
      title: sec.title,
      path: `/audio/${sec.id}-tr.mp3`,
      voiceName: MALE_VOICE_TR,
      style: 'Calm, clear, measured Turkish encyclopedia narrator',
      text: sec.text,
    });
  }

  return items;
}

function probeDurationSec(mp3Path) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mp3Path],
      { encoding: 'utf8' }
    ).trim();
    const num = Number(out);
    return Number.isFinite(num) ? Math.round(num * 10) / 10 : undefined;
  } catch {
    return undefined;
  }
}

function buildManifest(items) {
  const entries = items.map((item) => {
    const fileAbs = path.join(ROOT, 'public', item.path.replace(/^\/+/, ''));
    const exists = fs.existsSync(fileAbs);
    const stat = exists ? fs.statSync(fileAbs) : null;
    const available = Boolean(stat && stat.size > 100);
    return {
      key: item.key,
      id: item.id,
      lang: item.lang,
      category: item.category,
      ...(item.hadithId ? { hadithId: item.hadithId } : {}),
      title: item.title,
      path: item.path,
      voiceName: item.voiceName,
      available,
      ...(available ? { sizeBytes: stat.size, durationSec: probeDurationSec(fileAbs) } : {}),
    };
  });

  const availableEntries = entries.filter((e) => e.available);
  const totalBytes = availableEntries.reduce((sum, e) => sum + (e.sizeBytes || 0), 0);

  return {
    version: 1,
    model: TTS_MODEL,
    defaultVoice: MALE_VOICE_AR,
    generatedCount: availableEntries.length,
    totalCount: entries.length,
    totalBytes,
    entries,
  };
}

async function generateMp3ForItem(ai, item, tempDir) {
  const targetPath = path.join(ROOT, 'public', item.path.replace(/^\/+/, ''));
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 100) {
    return 'skipped';
  }

  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: item.text,
            speechMetadata: {
              style: item.style,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: item.voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error(`No audio returned for ${item.key}`);
  }

  const wavPath = path.join(tempDir, `${item.key}.wav`);
  fs.writeFileSync(wavPath, Buffer.from(base64Audio, 'base64'));

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  execFileSync('ffmpeg', [
    '-y',
    '-i',
    wavPath,
    '-ac',
    '1',
    '-ar',
    '24000',
    '-b:a',
    '48k',
    targetPath,
  ]);
  fs.unlinkSync(wavPath);
  return 'generated';
}

async function main() {
  const manifestOnly = process.argv.includes('--manifest-only');
  const items = buildTargetItems();

  if (manifestOnly) {
    const manifest = buildManifest(items);
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(
      `[audio-manifest] Synced ${manifest.totalCount} entries (${manifest.generatedCount} MP3s available, ${(manifest.totalBytes / 1024).toFixed(1)} KB).`
    );
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(
      '[generate-audio] GEMINI_API_KEY is not set. Updating manifest with currently present files only.'
    );
    const manifest = buildManifest(items);
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    return;
  }

  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edeb-tts-'));
  const ai = new GoogleGenAI({ apiKey });

  let generated = 0;
  let skipped = 0;
  try {
    for (const item of items) {
      const status = await generateMp3ForItem(ai, item, tempDir);
      if (status === 'generated') generated++;
      else skipped++;
      console.log(`[generate-audio] ${status}: ${item.key}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const manifest = buildManifest(items);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(
    `[generate-audio] Done. Generated: ${generated}, Skipped: ${skipped}, Total size: ${(manifest.totalBytes / (1024 * 1024)).toFixed(2)} MB`
  );
}

main().catch((err) => {
  console.error('[generate-audio] Failed:', err);
  process.exit(1);
});

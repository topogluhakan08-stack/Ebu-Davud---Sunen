import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AUDIO_MANIFEST,
  estimateSentenceIndexAtTime,
  formatAudioTime,
  getManifestEntry,
  getManifestStats,
  resolveAudioPlaybackPlan,
  splitIntoSentences,
} from './audioManifest';

test('audio-manifest covers all 38 hadiths (4740-4777) in both ar-SA and tr-TR plus TDV main sections', () => {
  assert.equal(AUDIO_MANIFEST.entries.length, 84);

  for (let id = 4740; id <= 4777; id++) {
    const ar = getManifestEntry(`hadith-${id}`, 'ar-SA');
    const tr = getManifestEntry(`hadith-${id}`, 'tr-TR');
    assert.ok(ar, `Missing ar-SA entry for hadith-${id}`);
    assert.ok(tr, `Missing tr-TR entry for hadith-${id}`);
    assert.equal(ar.path, `/audio/hadith-${id}-ar.mp3`);
    assert.equal(tr.path, `/audio/hadith-${id}-tr.mp3`);
  }

  const requiredSections = [
    'ebu-davud-hero',
    'ebu-davud-bio',
    'ebu-davud-hadith',
    'ebu-davud-fiqh',
    'ebu-davud-works',
    'sunen-hero',
    'sunen-compilation',
    'sunen-authenticity',
  ];
  for (const sectionId of requiredSections) {
    assert.ok(getManifestEntry(sectionId, 'tr-TR'), `Missing tr-TR section ${sectionId}`);
  }
});

test('resolveAudioPlaybackPlan prefers prebuilt file only when prebuilt source selected and file is available', () => {
  const customManifest = {
    ...AUDIO_MANIFEST,
    entries: AUDIO_MANIFEST.entries.map((entry) =>
      entry.id === 'hadith-4747' && entry.lang === 'ar-SA'
        ? { ...entry, available: true, sizeBytes: 24500, durationSec: 8.5 }
        : entry
    ),
  };

  const prebuiltAvailable = resolveAudioPlaybackPlan(
    'hadith-4747',
    'ar-SA',
    'prebuilt',
    customManifest
  );
  assert.equal(prebuiltAvailable.mode, 'file');
  assert.equal(prebuiltAvailable.entry?.path, '/audio/hadith-4747-ar.mp3');

  const deviceForced = resolveAudioPlaybackPlan(
    'hadith-4747',
    'ar-SA',
    'device',
    customManifest
  );
  assert.equal(deviceForced.mode, 'tts');

  const unavailableFallback = resolveAudioPlaybackPlan(
    'hadith-4740',
    'ar-SA',
    'prebuilt',
    customManifest
  );
  assert.equal(unavailableFallback.mode, 'tts');

  const stats = getManifestStats(customManifest);
  assert.equal(stats.totalCount, 84);
  assert.equal(stats.availableCount, 1);
  assert.equal(stats.totalBytes, 24500);
});

test('sentence splitting, proportional timing estimation, and audio time formatting work cleanly', () => {
  const sentences = splitIntoSentences(
    'İlk cümle burada biter. İkinci cümle biraz daha uzundur! Üçüncü cümle biter.'
  );
  assert.equal(sentences.length, 3);
  assert.equal(estimateSentenceIndexAtTime(sentences, 0, 10), 0);
  assert.equal(estimateSentenceIndexAtTime(sentences, 5, 10), 1);
  assert.equal(estimateSentenceIndexAtTime(sentences, 9.5, 10), 2);
  assert.equal(formatAudioTime(0), '0:00');
  assert.equal(formatAudioTime(65), '1:05');

  const hadithSentences = splitIntoSentences(
    'Muâz b. Cebel (r.a.) şöyle demiştir: İki kişi Resûlullah (s.a.v.) yanında sövüştü. Öfkesi arttı.'
  );
  assert.equal(hadithSentences.length, 2);
  assert.ok(hadithSentences[0].startsWith('Muâz b. Cebel'));
});

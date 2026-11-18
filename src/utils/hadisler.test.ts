import test from 'node:test';
import assert from 'node:assert/strict';
import hadislerRaw from '../data/hadisler.json';
import kelimelerRaw from '../data/kelimeler.json';
import fullWordLexiconRaw from '../data/fullWordLexicon.json';
import { getBabByHadithId } from '../data/babs';
import type { FullWordLexiconEntry, HadithItem } from '../types';
import { filterHadiths } from './hadithFilters';
import { getLexiconKey, segmentArabicWithLexicon, segmentMatnWithWords } from './arabic';

const hadiths = hadislerRaw as HadithItem[];
const fullLexicon = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;

test('hadisler.json contains all 38 continuous hadiths from 4740 to 4777 with complete fields', () => {
  assert.equal(hadiths.length, 38);

  for (let i = 0; i < 38; i++) {
    const expectedId = 4740 + i;
    const h = hadiths[i];
    assert.equal(h.id, expectedId, `Expected continuous ID ${expectedId}`);

    const bab = getBabByHadithId(h.id);
    assert.ok(bab, `Hadith ${h.id} must map to a bab`);
    assert.equal(h.babId, bab.id, `Hadith ${h.id} babId must match babs.ts`);

    assert.ok(h.pdfPage >= 264 && h.pdfPage <= 279, `Hadith ${h.id} PDF page out of range`);
    assert.ok(h.isnadAr.trim().length > 10, `Hadith ${h.id} isnadAr missing`);
    assert.ok(h.matnAr.trim().length > 10, `Hadith ${h.id} matnAr missing`);
    assert.equal(h.fullTextAr, `${h.isnadAr} ${h.matnAr}`, `Hadith ${h.id} fullTextAr mismatch`);
    assert.ok(h.translationTr.trim().length > 15, `Hadith ${h.id} translationTr missing`);
    assert.ok(h.translationFr.trim().length > 15, `Hadith ${h.id} translationFr missing`);
    assert.ok(h.words.length >= 2, `Hadith ${h.id} must include word analyses`);
    assert.ok(h.isnadChain.length >= 4, `Hadith ${h.id} must include isnadChain nodes`);
    assert.ok(h.footnotes.length >= 1, `Hadith ${h.id} must include footnotes`);
  }
});

test('kelimeler.json consolidates root families referencing valid hadith IDs', () => {
  assert.equal(kelimelerRaw.totalHadiths, 38);
  assert.ok(kelimelerRaw.totalRoots >= 90);
  assert.ok(kelimelerRaw.totalWords >= 100);
  for (const r of kelimelerRaw.roots) {
    assert.ok(r.root.trim().length > 0);
    assert.ok(r.hadithIds.length >= 1);
    for (const id of r.hadithIds) {
      assert.ok(id >= 4740 && id <= 4777);
    }
  }
});

test('segmentMatnWithWords highlights vocabulary tokens inside matnAr cleanly', () => {
  const h4740 = hadiths[0];
  const segments = segmentMatnWithWords(h4740.matnAr, h4740.words);
  const matchedIds = segments.filter((s) => s.word).map((s) => s.word!.id);
  assert.ok(matchedIds.length >= 3);

  const h4747 = hadiths.find((h) => h.id === 4747);
  assert.ok(h4747);
  const segs4747 = segmentMatnWithWords(h4747.matnAr, h4747.words);
  const mahikaSegment = segs4747.find((s) => s.word?.arabic === 'مَحِكَ');
  assert.ok(mahikaSegment, 'Expected مَحِكَ to match وَمَحِكَ، inside Hadis 4747');
});

test('segmentArabicWithLexicon achieves 100% token coverage across all 38 isnadAr and matnAr fields', () => {
  let totalAnalyzed = 0;

  for (const h of hadiths) {
    for (const kind of ['isnad', 'matn'] as const) {
      const text = kind === 'isnad' ? h.isnadAr : h.matnAr;
      const segs = segmentArabicWithLexicon(text, h, fullLexicon, kind);

      for (const tok of text.split(/\s+/)) {
        const key = getLexiconKey(tok);
        if (!key) continue;
        const matchingSeg = segs.find((s) => getLexiconKey(s.text) === key);
        assert.ok(
          matchingSeg?.word,
          `Missing lexicon analysis for token "${tok}" (key="${key}") in Hadith #${h.id} (${kind})`
        );
        const w = matchingSeg.word!;
        assert.ok(w.arabic.length > 0, `Missing arabic for ${key}`);
        assert.ok(w.transliteration.length > 0, `Missing transliteration for ${key}`);
        assert.ok(w.meaningTr.length > 0, `Missing meaningTr for ${key}`);
        assert.ok(w.meaningFr.length > 0, `Missing meaningFr for ${key}`);
        assert.ok(w.partOfSpeech.length > 0, `Missing partOfSpeech for ${key}`);
        assert.ok(w.sarf && w.sarf.root.length > 0, `Missing sarf for ${key}`);
        assert.ok(w.irab && w.irab.role.length > 0 && w.irab.caseState.length > 0, `Missing irab for ${key}`);
        assert.ok(
          Array.isArray(w.derivatives) && w.derivatives.length >= 5 && w.derivatives.length <= 8,
          `Expected 5-8 derivatives for ${key}, got ${w.derivatives?.length}`
        );
        totalAnalyzed++;
      }
    }
  }

  assert.ok(totalAnalyzed >= 2000, `Expected >=2000 analyzed tokens, got ${totalAnalyzed}`);
});

test('filterHadiths filters by babId, Arabic unvocalized query, ID, and status', () => {
  const emptyProgress = {
    readHadiths: [4740],
    listenedHadiths: [],
    memorizedHadiths: [4746],
    favoriteHadiths: [4775],
    notes: { 4752: 'kolaylık ilkesi' },
  };

  assert.equal(
    filterHadiths(hadiths, { babId: 4, query: '', statusFilter: 'all', progress: emptyProgress }).length,
    5
  );
  assert.equal(
    filterHadiths(hadiths, { babId: 'all', query: 'كظم غيظا', statusFilter: 'all', progress: emptyProgress })[0]?.id,
    4744
  );
  assert.equal(
    filterHadiths(hadiths, { babId: 'all', query: '', statusFilter: 'favorites', progress: emptyProgress })[0]?.id,
    4775
  );
  assert.equal(
    filterHadiths(hadiths, { babId: 'all', query: '', statusFilter: 'with_notes', progress: emptyProgress })[0]?.id,
    4752
  );
  assert.equal(
    filterHadiths(hadiths, { babId: 'all', query: '', statusFilter: 'unread', progress: emptyProgress }).length,
    37
  );
});


import test from 'node:test';
import assert from 'node:assert/strict';
import { stripTashkeel, normalizeArabicSearch, matchesArabicQuery } from './arabic';
import { getBabByHadithId, BABS } from '../data/babs';

test('stripTashkeel removes Arabic vowel diacritics cleanly', () => {
  const vocalized = 'كَانَ رَسُولُ اللَّهِ ﷺ مِنْ أَحْسَنِ النَّاسِ خُلُقاً';
  assert.equal(stripTashkeel(vocalized), 'كان رسول الله ﷺ من أحسن الناس خلقا');
});

test('normalizeArabicSearch normalizes alif variants and taa marbuta', () => {
  assert.equal(normalizeArabicSearch('أَحْسَنِ'), 'احسن');
  assert.equal(normalizeArabicSearch('الصُّرَعَةُ'), 'الصرعه');
});

test('matchesArabicQuery matches unvocalized input against vocalized text', () => {
  const hadithText = 'مَنْ كَظَمَ غَيْظاً وَهُوَ قَادِرٌ عَلَى أَنْ يُنْفِذَهُ';
  assert.equal(matchesArabicQuery(hadithText, 'كظم غيظا'), true);
  assert.equal(matchesArabicQuery(hadithText, 'ان ينفذه'), true);
  assert.equal(matchesArabicQuery(hadithText, 'الحياء'), false);
});

test('all 11 babs cover hadiths 4740 to 4777 continuously without gaps', () => {
  assert.equal(BABS.length, 11);
  let totalCount = 0;
  for (let id = 4740; id <= 4777; id++) {
    const bab = getBabByHadithId(id);
    assert.ok(bab, `Hadith ${id} must belong to a bab`);
  }
  for (const bab of BABS) {
    totalCount += bab.hadithCount;
  }
  assert.equal(totalCount, 38);
});

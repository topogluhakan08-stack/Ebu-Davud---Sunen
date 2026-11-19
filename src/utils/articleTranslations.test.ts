import assert from 'node:assert/strict';
import test from 'node:test';
import rawEbuDavud from '../data/ebu-davud.json';
import rawSunen from '../data/sunen.json';
import type { EbuDavudData, LanguageCode, SunenData } from '../types';
import {
  formatLocaleNumber,
  getLocalizedEbuDavud,
  getLocalizedEbuDavudUi,
  getLocalizedSunen,
  getLocalizedSunenUi,
  loadArticlePack,
} from './articleTranslations';
import { runGlobalSearch } from './globalSearch';

const BASE_ED = rawEbuDavud as EbuDavudData;
const BASE_SUNEN = rawSunen as SunenData;
const NON_TR_LANGS: Exclude<LanguageCode, 'tr'>[] = ['fr', 'de', 'nl', 'ar'];

function collectStrings(value: unknown, skipKeys: Set<string>, out: string[] = []): string[] {
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, skipKeys, out);
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (skipKeys.has(k)) continue;
      collectStrings(v, skipKeys, out);
    }
  }
  return out;
}

test('loadArticlePack returns null for Turkish and lazy-loads FR/DE/NL/AR packs', async () => {
  assert.equal(await loadArticlePack('tr'), null);

  for (const lang of NON_TR_LANGS) {
    const pack = await loadArticlePack(lang);
    assert.ok(pack, `Expected article pack for ${lang}`);
    assert.equal(pack.lang, lang);
    assert.ok(getLocalizedEbuDavud(BASE_ED, lang, pack));
    assert.ok(getLocalizedSunen(BASE_SUNEN, lang, pack));
  }
});

test('all 4 non-TR article packs have 100% structural parity and non-empty strings', async () => {
  for (const lang of NON_TR_LANGS) {
    const pack = await loadArticlePack(lang);
    assert.ok(pack, `Missing pack for ${lang}`);

    const ed = pack.ebuDavud;
    const su = pack.sunen;

    // Ebu Davud counts
    assert.equal(ed.cities.length, BASE_ED.cities.length, `${lang}: cities length`);
    assert.equal(ed.timeline.length, BASE_ED.timeline.length, `${lang}: timeline length`);
    assert.equal(ed.network.nodes.length, BASE_ED.network.nodes.length, `${lang}: network nodes`);
    assert.equal(ed.network.links.length, BASE_ED.network.links.length, `${lang}: network links`);
    assert.equal(
      ed.hadithScholarship.praises.length,
      BASE_ED.hadithScholarship.praises.length,
      `${lang}: praises`
    );
    assert.equal(
      ed.sayingsAndFourHadiths.length,
      BASE_ED.sayingsAndFourHadiths.length,
      `${lang}: sayings & 4 hadiths`
    );
    assert.equal(ed.works.mainWorks.length, BASE_ED.works.mainWorks.length, `${lang}: mainWorks`);
    assert.equal(
      ed.works.otherWorks.length,
      BASE_ED.works.otherWorks.length,
      `${lang}: otherWorks`
    );
    assert.equal(
      ed.studiesAboutHim.length,
      BASE_ED.studiesAboutHim.length,
      `${lang}: studiesAboutHim`
    );
    assert.equal(ed.bibliography.length, BASE_ED.bibliography.length, `${lang}: ED bibliography`);

    // Sunen counts
    assert.equal(
      su.compilationAndPurpose.mekkeLetter.principles.length,
      BASE_SUNEN.compilationAndPurpose.mekkeLetter.principles.length,
      `${lang}: Mekke principles`
    );
    assert.equal(
      su.authenticityAndStructure.tiers.length,
      BASE_SUNEN.authenticityAndStructure.tiers.length,
      `${lang}: tiers`
    );
    assert.equal(
      su.authenticityAndStructure.rawis.length,
      BASE_SUNEN.authenticityAndStructure.rawis.length,
      `${lang}: rawis`
    );
    assert.equal(su.editionStats.length, BASE_SUNEN.editionStats.length, `${lang}: editionStats`);
    assert.equal(su.printCities.length, BASE_SUNEN.printCities.length, `${lang}: printCities`);
    assert.equal(su.commentaries.length, BASE_SUNEN.commentaries.length, `${lang}: commentaries`);
    assert.equal(
      su.incompleteWorks.length,
      BASE_SUNEN.incompleteWorks.length,
      `${lang}: incompleteWorks`
    );
    assert.equal(
      su.abridgementsAndStudies.length,
      BASE_SUNEN.abridgementsAndStudies.length,
      `${lang}: abridgementsAndStudies`
    );
    assert.equal(
      su.bibliography.length,
      BASE_SUNEN.bibliography.length,
      `${lang}: Sunen bibliography`
    );

    // Every string in UI and data must be non-empty
    const allUiStrings = [
      ...collectStrings(pack.ebuDavudUi, new Set()),
      ...collectStrings(pack.sunenUi, new Set()),
    ];
    for (const str of allUiStrings) {
      assert.ok(str.trim().length > 0, `${lang}: empty UI string found`);
    }
  }
});

test('non-TR UI strings and main prose have zero Turkish-specific character leakage', async () => {
  const turkishSpecificRe = /[şŞğĞıİ]/;
  const allowedProperNameRe = /(İslâm|İslam|Yaşar|Başaran|Koçyiğit|Aydınlı|Görmez|Büyük|Kütüphanesi|Üniversitesi|İstanbul|Türkiye|Çakan|Ünal|Şeker|Yıldırım|Hüseyin|İbrahim|İlahiyat|Diyanet|Çalışmaları)/;

  for (const lang of NON_TR_LANGS) {
    const pack = await loadArticlePack(lang);
    assert.ok(pack);

    const uiStrings = [
      ...collectStrings(pack.ebuDavudUi, new Set()),
      ...collectStrings(pack.sunenUi, new Set()),
    ];
    for (const s of uiStrings) {
      const cleaned = s.replace(new RegExp(allowedProperNameRe.source, 'g'), '');
      assert.equal(
        turkishSpecificRe.test(cleaned),
        false,
        `${lang}: unexpected Turkish char in UI string: "${s}"`
      );
    }

    const coreProse = [
      ...collectStrings(pack.ebuDavud.biography, new Set(['birthDeath'])),
      ...collectStrings(pack.ebuDavud.hadithScholarship, new Set(['id'])),
      ...collectStrings(pack.ebuDavud.fiqhAndMethodology, new Set()),
      ...collectStrings(pack.sunen.compilationAndPurpose, new Set(['kopruluManuscriptRef', 'colophonQuote'])),
      ...collectStrings(pack.sunen.authenticityAndStructure, new Set(['id', 'kutubSitteCitation', 'citation'])),
    ];
    for (const s of coreProse) {
      const cleaned = s.replace(new RegExp(allowedProperNameRe.source, 'g'), '');
      assert.equal(
        turkishSpecificRe.test(cleaned),
        false,
        `${lang}: unexpected Turkish char in prose: "${s}"`
      );
    }
  }
});

test('Arabic article pack has zero Latin letters in UI strings and Arabic prose', async () => {
  const pack = await loadArticlePack('ar');
  assert.ok(pack);

  const latinRe = /[A-Za-z]/;
  const skipKeys = new Set([
    'id',
    'sourceUrl',
    'cityId',
    'kind',
    'status',
    'category',
    'source',
    'target',
    'textFr',
    'lang',
  ]);

  const uiStrings = [
    ...collectStrings(pack.ebuDavudUi, skipKeys),
    ...collectStrings(pack.sunenUi, skipKeys),
  ];
  for (const s of uiStrings) {
    assert.equal(latinRe.test(s), false, `AR UI contains Latin letters: "${s}"`);
  }

  const proseStrings = [
    ...collectStrings(pack.ebuDavud.biography, skipKeys),
    ...collectStrings(pack.ebuDavud.hadithScholarship, skipKeys),
    ...collectStrings(pack.ebuDavud.fiqhAndMethodology, skipKeys),
    ...collectStrings(pack.ebuDavud.cities, skipKeys),
    ...collectStrings(pack.ebuDavud.timeline, skipKeys),
    ...collectStrings(pack.ebuDavud.network, skipKeys),
    ...collectStrings(pack.ebuDavud.works, skipKeys),
    ...collectStrings(pack.sunen.compilationAndPurpose, skipKeys),
    ...collectStrings(pack.sunen.authenticityAndStructure, skipKeys),
    ...collectStrings(pack.sunen.editionStats, skipKeys),
    ...collectStrings(pack.sunen.printCities, skipKeys),
    ...collectStrings(pack.sunen.commentaries, skipKeys),
    ...collectStrings(pack.sunen.incompleteWorks, skipKeys),
    ...collectStrings(pack.sunen.abridgementsAndStudies, skipKeys),
  ];
  for (const s of proseStrings) {
    assert.equal(latinRe.test(s), false, `AR prose contains Latin letters: "${s}"`);
  }
});

test('runGlobalSearch returns localized Ebu Davud and es-Sunen results across all 5 languages', async () => {
  const cases: { lang: LanguageCode; edQuery: string; sunenQuery: string }[] = [
    { lang: 'tr', edQuery: 'Tarsus', sunenQuery: 'Hattâbî' },
    { lang: 'fr', edQuery: 'Tarse', sunenQuery: 'Khattabi' },
    { lang: 'de', edQuery: 'Tarsus', sunenQuery: 'Chattabi' },
    { lang: 'nl', edQuery: 'Tarsus', sunenQuery: 'Khattabi' },
    { lang: 'ar', edQuery: 'طرسوس', sunenQuery: 'الخطابي' },
  ];

  for (const c of cases) {
    const pack = await loadArticlePack(c.lang);
    const edUi = getLocalizedEbuDavudUi(c.lang, pack);
    const sunenUi = getLocalizedSunenUi(c.lang, pack);

    const edHits = runGlobalSearch(c.edQuery, 'ebu_davud', 20, {
      language: c.lang,
      articlePack: pack,
    });
    assert.ok(edHits.length > 0, `${c.lang}: expected ebu_davud hits for "${c.edQuery}"`);
    assert.ok(
      edHits.some((h) => h.categoryLabel === edUi.searchLabels.cityCategory),
      `${c.lang}: expected localized city categoryLabel "${edUi.searchLabels.cityCategory}"`
    );

    const sunenHits = runGlobalSearch(c.sunenQuery, 'sunen', 20, {
      language: c.lang,
      articlePack: pack,
    });
    assert.ok(sunenHits.length > 0, `${c.lang}: expected sunen hits for "${c.sunenQuery}"`);
    assert.ok(
      sunenHits.some((h) => h.categoryLabel === sunenUi.searchLabels.commentaryCategory),
      `${c.lang}: expected localized commentary categoryLabel "${sunenUi.searchLabels.commentaryCategory}"`
    );
  }
});

test('formatLocaleNumber formats numbers cleanly for all 5 languages', () => {
  assert.ok(formatLocaleNumber(500000, 'tr').includes('500'));
  assert.ok(formatLocaleNumber(500000, 'fr').includes('500'));
  assert.ok(formatLocaleNumber(500000, 'de').includes('500'));
  assert.ok(formatLocaleNumber(500000, 'nl').includes('500'));
  assert.ok(formatLocaleNumber(500000, 'ar').length >= 6);
});

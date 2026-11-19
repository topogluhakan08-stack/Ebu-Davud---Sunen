import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import hadislerRaw from '../data/hadisler.json';
import { BABS } from '../data/babs';
import type { HadithItem, LanguageCode } from '../types';
import type {
  HadithLanguagePack,
  LocalizedBabPackItem,
  LocalizedHadithPackItem,
} from '../data/translations/types';
import {
  getLocalizedBab,
  getLocalizedHadithContent,
  loadHadithPack,
} from './hadithTranslations';
import { filterHadiths } from './hadithFilters';
import { runGlobalSearch } from './globalSearch';
import { DEFAULT_PROGRESS } from './storage';

const HADITHS = hadislerRaw as HadithItem[];
const NON_TR_LANGS: Exclude<LanguageCode, 'tr'>[] = ['fr', 'de', 'nl', 'ar'];
const TURKISH_ONLY_CHARS = /[şŞğĞıİ]/;

describe('B2 Hadith Translation Packs (FR, DE, NL, AR)', () => {
  it('returns null for Turkish pack (uses base data) and lazy-loads all 4 non-TR packs', async () => {
    const trPack = await loadHadithPack('tr');
    assert.equal(trPack, null);

    for (const lang of NON_TR_LANGS) {
      const pack = await loadHadithPack(lang);
      assert.ok(pack, `Expected lazy-loaded pack for ${lang}`);
      if (!pack) throw new Error(`Missing pack for ${lang}`);
      assert.equal(Object.keys(pack.babs).length, 11);
      assert.equal(Object.keys(pack.hadiths).length, 38);
    }
  });

  it('covers 100% of 11 babs, 38 hadiths, 43 lessons, 5 context stories, and 70 footnotes per language with zero Turkish leakage', async () => {
    const expectedTotalLessons = HADITHS.reduce((sum, h) => sum + h.lessonsTr.length, 0);
    const expectedTotalStories = HADITHS.filter((h) => Boolean(h.contextStory)).length;
    const expectedTotalFootnotes = HADITHS.reduce((sum, h) => sum + h.footnotes.length, 0);

    assert.equal(BABS.length, 11);
    assert.equal(HADITHS.length, 38);
    assert.equal(expectedTotalLessons, 43);
    assert.equal(expectedTotalStories, 5);
    assert.equal(expectedTotalFootnotes, 70);

    for (const lang of NON_TR_LANGS) {
      const pack: HadithLanguagePack | null = await loadHadithPack(lang);
      if (!pack) throw new Error(`Missing pack for ${lang}`);

      // Verify all 11 Babs
      for (const bab of BABS) {
        const b: LocalizedBabPackItem | undefined = pack.babs[bab.id];
        if (!b) throw new Error(`[${lang}] Missing bab #${bab.id}`);
        assert.ok(b.numberLabel.trim().length > 0, `[${lang}] Empty bab numberLabel #${bab.id}`);
        assert.ok(b.title.trim().length > 0, `[${lang}] Empty bab title #${bab.id}`);
        assert.ok(b.subtitle.trim().length > 0, `[${lang}] Empty bab subtitle #${bab.id}`);
        assert.equal(
          TURKISH_ONLY_CHARS.test(`${b.numberLabel} ${b.title} ${b.subtitle}`),
          false,
          `[${lang}] Turkish character leaked in bab #${bab.id}`
        );

        const resolvedBab = getLocalizedBab(bab, lang, pack);
        assert.equal(resolvedBab.title, b.title);
      }

      // Verify all 38 Hadiths, 43 Lessons, 5 Context Stories, and 70 Footnotes
      let lessonCount = 0;
      let storyCount = 0;
      let footnoteCount = 0;

      for (const h of HADITHS) {
        const entry: LocalizedHadithPackItem | undefined = pack.hadiths[h.id];
        if (!entry) throw new Error(`[${lang}] Missing hadith #${h.id}`);
        assert.ok(
          entry.translation.trim().length > 15,
          `[${lang}] Too short/empty translation for #${h.id}`
        );
        assert.equal(
          TURKISH_ONLY_CHARS.test(entry.translation),
          false,
          `[${lang}] Turkish character leaked in translation #${h.id}: ${entry.translation}`
        );

        // Lessons parity
        assert.equal(
          entry.lessons.length,
          h.lessonsTr.length,
          `[${lang}] Lesson count mismatch for #${h.id}`
        );
        for (const lesson of entry.lessons) {
          assert.ok(lesson.trim().length > 8, `[${lang}] Empty lesson in #${h.id}`);
          assert.equal(
            TURKISH_ONLY_CHARS.test(lesson),
            false,
            `[${lang}] Turkish character leaked in lesson #${h.id}: ${lesson}`
          );
          lessonCount++;
        }

        // Context story parity
        if (h.contextStory) {
          const story: { title: string; summary: string } | undefined = entry.contextStory;
          if (!story) throw new Error(`[${lang}] Missing contextStory for #${h.id}`);
          assert.ok(story.title.trim().length > 0);
          assert.ok(story.summary.trim().length > 15);
          assert.equal(
            TURKISH_ONLY_CHARS.test(`${story.title} ${story.summary}`),
            false,
            `[${lang}] Turkish character leaked in contextStory #${h.id}`
          );
          storyCount++;
        }

        // Footnotes parity
        for (const fn of h.footnotes) {
          const fnSummary: string | undefined = entry.footnotes[fn.id];
          assert.ok(
            fnSummary && fnSummary.trim().length > 5,
            `[${lang}] Missing footnote '${fn.id}' in hadith #${h.id}`
          );
          assert.equal(
            TURKISH_ONLY_CHARS.test(fnSummary ?? ''),
            false,
            `[${lang}] Turkish character leaked in footnote '${fn.id}' (#${h.id}): ${fnSummary}`
          );
          footnoteCount++;
        }

        // Helper never reports missing when pack is loaded
        const resolved = getLocalizedHadithContent(h, lang, pack, 'PREPARING');
        assert.equal(resolved.isTranslationMissing, false);
        assert.notEqual(resolved.translation, 'PREPARING');
      }

      assert.equal(lessonCount, 43, `[${lang}] Total lessons mismatch`);
      assert.equal(storyCount, 5, `[${lang}] Total context stories mismatch`);
      assert.equal(footnoteCount, 70, `[${lang}] Total footnotes mismatch`);
    }
  });

  it('filters hadiths and runs global search across German, Dutch, French, and Arabic packs', async () => {
    const dePack = await loadHadithPack('de');
    const nlPack = await loadHadithPack('nl');
    const arPack = await loadHadithPack('ar');

    const deZorn = filterHadiths(HADITHS, {
      babId: 'all',
      query: 'Zorn',
      statusFilter: 'all',
      progress: DEFAULT_PROGRESS,
      hadithPack: dePack,
    });
    assert.ok(deZorn.some((h) => h.id === 4744 || h.id === 4747), 'German search for Zorn should match');

    const nlZacht = filterHadiths(HADITHS, {
      babId: 'all',
      query: 'zachtaardigheid',
      statusFilter: 'all',
      progress: DEFAULT_PROGRESS,
      hadithPack: nlPack,
    });
    assert.ok(
      nlZacht.some((h) => h.id === 4774 || h.id === 4775),
      'Dutch search for zachtaardigheid should match Bab 11'
    );

    const arSharh = filterHadiths(HADITHS, {
      babId: 'all',
      query: 'الاستعاذة',
      statusFilter: 'all',
      progress: DEFAULT_PROGRESS,
      hadithPack: arPack,
    });
    assert.ok(arSharh.some((h) => h.id === 4747), 'Arabic explanation search should match #4747');

    const deGlobal = runGlobalSearch('Zorn', 'hadith', 20, {
      language: 'de',
      hadithPack: dePack,
    });
    assert.ok(deGlobal.length > 0, 'Global search in German should return hadith results');
    assert.equal(
      TURKISH_ONLY_CHARS.test(deGlobal[0].snippet),
      false,
      'Global search snippet in German must not contain Turkish text'
    );
  });

  it('localizes tahric badges and PDF page indicators without Turkish leakage', async () => {
    const { localizeTahricBadge, formatPdfPage } = await import('./hadithTranslations');
    assert.equal(localizeTahricBadge('Müslim [4605]', 'de'), 'Muslim [4605]');
    assert.equal(localizeTahricBadge('Nesâî [4612]', 'ar'), 'النسائي [4612]');
    assert.equal(localizeTahricBadge('Buhârî', 'nl'), 'al-Boechari');
    assert.equal(localizeTahricBadge('Tirmizî', 'fr'), 'at-Tirmidhî');
    assert.equal(formatPdfPage(268, 'de'), 'PDF S. 268');
    assert.equal(formatPdfPage(268, 'ar'), 'ص 268');
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_BANK } from '../data/questionBank';
import { BADGE_DEFS, LEVEL_TIERS, selectQuizSession } from './learnEngine';
import { loadHadithPack } from './hadithTranslations';
import { loadGlossaryPack, loadWordLexiconPack } from './lexiconTranslations';
import { loadArticlePack } from './articleTranslations';
import {
  TR_LEARN_UI,
  buildLocalizedQuestionBank,
  formatLocalizedIntervalLabel,
  getLocalizedBadge,
  getLocalizedLearnUi,
  getLocalizedLevelTitle,
  loadLearnPack,
} from './learnTranslations';
import type { LanguageCode } from '../types';

const NON_TR_LANGS: Exclude<LanguageCode, 'tr'>[] = ['fr', 'de', 'nl', 'ar'];
const ALL_LANGS: LanguageCode[] = ['tr', 'fr', 'de', 'nl', 'ar'];

function collectStrings(obj: unknown, out: string[] = []): string[] {
  if (typeof obj === 'string') {
    out.push(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((v) => collectStrings(v, out));
  } else if (obj && typeof obj === 'object') {
    Object.values(obj).forEach((v) => collectStrings(v, out));
  }
  return out;
}

async function loadAllPacks(lang: Exclude<LanguageCode, 'tr'>) {
  const [hadithPack, wordLexiconPack, glossaryPack, articlePack, learnPack] =
    await Promise.all([
      loadHadithPack(lang),
      loadWordLexiconPack(lang),
      loadGlossaryPack(lang),
      loadArticlePack(lang),
      loadLearnPack(lang),
    ]);
  return { hadithPack, wordLexiconPack, glossaryPack, articlePack, learnPack };
}

test('loadLearnPack returns null for tr and valid lazy packs for fr/de/nl/ar', async () => {
  assert.equal(await loadLearnPack('tr'), null);

  for (const lang of NON_TR_LANGS) {
    const pack = await loadLearnPack(lang);
    assert.ok(pack, `Expected learn pack for ${lang}`);
    assert.equal(pack.lang, lang);

    // Every UI string in TR_LEARN_UI must have a non-empty counterpart
    const trStrings = collectStrings(TR_LEARN_UI);
    const locStrings = collectStrings(pack.ui);
    assert.equal(
      locStrings.length,
      trStrings.length,
      `UI string count mismatch in ${lang}: ${locStrings.length} vs ${trStrings.length}`
    );
    for (const s of locStrings) {
      assert.ok(s.trim().length > 0, `Empty UI string found in ${lang}`);
    }

    // All 6 levels and all 8 badges present
    for (const tier of LEVEL_TIERS) {
      const title = getLocalizedLevelTitle(tier.level, lang, pack);
      assert.ok(title.trim().length > 0, `Missing level ${tier.level} in ${lang}`);
      assert.notEqual(title, tier.titleTr, `Untranslated level ${tier.level} in ${lang}`);
    }

    for (const badge of BADGE_DEFS) {
      const locBadge = getLocalizedBadge(badge.id, lang, pack);
      assert.ok(locBadge.title.trim().length > 0, `Missing badge title ${badge.id} in ${lang}`);
      assert.ok(locBadge.desc.trim().length > 0, `Missing badge desc ${badge.id} in ${lang}`);
      assert.notEqual(locBadge.desc, badge.descTr, `Untranslated badge desc ${badge.id} in ${lang}`);
    }
  }
});

test('buildLocalizedQuestionBank preserves all 418 IDs, categories, types, and valid options in all 5 languages', async () => {
  assert.ok(QUESTION_BANK.length >= 300, `Expected >= 300 questions, got ${QUESTION_BANK.length}`);

  for (const lang of NON_TR_LANGS) {
    const packs = await loadAllPacks(lang);
    const bank = buildLocalizedQuestionBank(lang, {
      ...packs,
      fallbackText: 'TRANSLATION_MISSING',
    });

    assert.equal(
      bank.length,
      QUESTION_BANK.length,
      `Bank length mismatch in ${lang}: ${bank.length} vs ${QUESTION_BANK.length}`
    );

    const unresolvedTemplateRe = /\{[a-zA-Z0-9_]+\}/;

    for (let i = 0; i < QUESTION_BANK.length; i++) {
      const base = QUESTION_BANK[i];
      const q = bank[i];

      assert.equal(q.id, base.id, `ID mismatch at index ${i} in ${lang}`);
      assert.equal(q.category, base.category, `Category mismatch for ${q.id} in ${lang}`);
      assert.equal(q.gameType, base.gameType, `GameType mismatch for ${q.id} in ${lang}`);

      assert.ok(q.prompt.trim().length > 0, `Empty prompt for ${q.id} in ${lang}`);
      assert.ok(q.explanation.trim().length > 0, `Empty explanation for ${q.id} in ${lang}`);
      assert.ok(q.sourceRef.trim().length > 0, `Empty sourceRef for ${q.id} in ${lang}`);

      assert.ok(
        !q.prompt.includes('TRANSLATION_MISSING'),
        `Missing prompt translation for ${q.id} in ${lang}`
      );
      assert.ok(
        !q.explanation.includes('TRANSLATION_MISSING'),
        `Missing explanation translation for ${q.id} in ${lang}`
      );

      assert.ok(
        !unresolvedTemplateRe.test(q.prompt),
        `Unresolved placeholder in prompt for ${q.id} (${lang}): ${q.prompt}`
      );
      assert.ok(
        !unresolvedTemplateRe.test(q.explanation),
        `Unresolved placeholder in explanation for ${q.id} (${lang}): ${q.explanation}`
      );
      assert.ok(
        !unresolvedTemplateRe.test(q.sourceRef),
        `Unresolved placeholder in sourceRef for ${q.id} (${lang}): ${q.sourceRef}`
      );
      if (q.hint) {
        assert.ok(
          !unresolvedTemplateRe.test(q.hint),
          `Unresolved placeholder in hint for ${q.id} (${lang}): ${q.hint}`
        );
      }

      if (
        q.gameType === 'multiple_choice' ||
        q.gameType === 'which_bab' ||
        q.gameType === 'audio_listening' ||
        q.gameType === 'arabic_blank'
      ) {
        assert.ok(Array.isArray(q.options), `Missing options for ${q.id} in ${lang}`);
        assert.equal(
          q.options.length,
          4,
          `Expected 4 options for ${q.id} in ${lang}, got ${q.options.length}`
        );
        const uniqueOpts = new Set(q.options.map((o) => o.trim()));
        assert.equal(
          uniqueOpts.size,
          4,
          `Duplicate options for ${q.id} in ${lang}: ${JSON.stringify(q.options)}`
        );
        assert.ok(
          typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4,
          `Invalid correctIndex for ${q.id} in ${lang}`
        );
      }

      if (q.gameType === 'matching') {
        assert.ok(Array.isArray(q.pairs) && q.pairs.length >= 4, `Invalid pairs for ${q.id} in ${lang}`);
        for (const p of q.pairs) {
          assert.ok(p.left.trim().length > 0 && p.right.trim().length > 0, `Empty pair in ${q.id} (${lang})`);
        }
      }

      if (q.gameType === 'word_order' || q.gameType === 'isnad_order') {
        assert.ok(
          Array.isArray(q.orderedItems) && q.orderedItems.length >= 2,
          `Invalid orderedItems for ${q.id} in ${lang}`
        );
      }

      if (q.gameType === 'true_false') {
        assert.equal(typeof q.correctBool, 'boolean', `Invalid correctBool for ${q.id} in ${lang}`);
      }

      if (q.gameType === 'city_map') {
        assert.equal(q.targetCityId, base.targetCityId, `targetCityId mismatch for ${q.id} in ${lang}`);
      }
    }
  }
});

test('Zero Turkish-specific letters [şŞğĞıİ] leak into fr/de/nl/ar UI and quiz content', async () => {
  const turkishSpecificRe = /[şŞğĞıİ]/;
  // Explicit Turkish bibliographic book titles & Turkish library names legitimately cited in scholarly notes
  const allowedTurkishCitations = [
    /Süleymaniye[^,.;)»"]*/g,
    /Hekimoğlu[^,.;)»"]*/g,
    /AÜİFD/g,
    /Sünen-?i Ebî Dâvûd Terceme ve Şerhi/g,
    /İSAM/g,
    /TDV İslâm Ansiklopedisi/g,
    /TDV İA/g,
    /İstanbul/g,
    /İzmir/g,
    /İbrahim/g,
    /İsmail/g,
    /Şamil/g,
    /Necati Yeniel/g,
    /Hüseyin Kayapınar/g,
    /Koçyiğit/g,
    /Yaşar Kandemir/g,
    /Kırbaşoğlu/g,
  ];

  const stripAllowedCitations = (text: string) => {
    let cleaned = text;
    for (const re of allowedTurkishCitations) {
      cleaned = cleaned.replace(re, '');
    }
    return cleaned;
  };

  for (const lang of NON_TR_LANGS) {
    const packs = await loadAllPacks(lang);
    const uiStrings = collectStrings(packs.learnPack!.ui);
    for (const s of uiStrings) {
      assert.ok(
        !turkishSpecificRe.test(s),
        `Turkish-specific char in ${lang} learn UI: "${s}"`
      );
    }

    const bank = buildLocalizedQuestionBank(lang, packs);
    const violations: string[] = [];
    for (const q of bank) {
      const fields = [
        q.prompt,
        q.explanation,
        q.sourceRef,
        q.hint ?? '',
        q.orderDirectionLabel ?? '',
        ...(q.options ?? []),
        ...(q.orderedItems ?? []),
        ...(q.pairs?.flatMap((p) => [p.left, p.right]) ?? []),
      ];
      for (const f of fields) {
        const cleaned = stripAllowedCitations(f);
        if (turkishSpecificRe.test(cleaned)) {
          violations.push(`${q.id}: "${f}"`);
        }
      }
    }
    assert.equal(
      violations.length,
      0,
      `Turkish-specific chars leaked into ${lang} questions (${violations.length}):\n${violations.slice(0, 10).join('\n')}`
    );
  }
});

test('Zero Latin characters [A-Za-z] leak into Arabic (ar) UI, levels, badges, and all 418 questions', async () => {
  const latinRe = /[A-Za-z]/;
  const packs = await loadAllPacks('ar');
  const arPack = packs.learnPack!;

  // Exclude gen templates because they contain {placeholder} variable names
  const uiWithoutGen = {
    learnPage: arPack.ui.learnPage,
    quiz: arPack.ui.quiz,
    cityMap: arPack.ui.cityMap,
    flashcards: arPack.ui.flashcards,
    mastery: arPack.ui.mastery,
  };
  for (const s of collectStrings(uiWithoutGen)) {
    assert.ok(!latinRe.test(s), `Latin char in Arabic UI string: "${s}"`);
  }
  for (const lvl of Object.values(arPack.levels)) {
    assert.ok(!latinRe.test(lvl), `Latin char in Arabic level: "${lvl}"`);
  }
  for (const b of Object.values(arPack.badges)) {
    assert.ok(!latinRe.test(b.title), `Latin char in Arabic badge title: "${b.title}"`);
    assert.ok(!latinRe.test(b.desc), `Latin char in Arabic badge desc: "${b.desc}"`);
  }

  const bank = buildLocalizedQuestionBank('ar', packs);
  const violations: string[] = [];
  for (const q of bank) {
    const fields = [
      q.prompt,
      q.explanation,
      q.sourceRef,
      q.hint ?? '',
      q.orderDirectionLabel ?? '',
      ...(q.options ?? []),
      ...(q.orderedItems ?? []),
      ...(q.pairs?.flatMap((p) => [p.left, p.right]) ?? []),
    ];
    for (const f of fields) {
      if (latinRe.test(f)) {
        violations.push(`${q.id}: "${f}"`);
      }
    }
  }
  assert.equal(
    violations.length,
    0,
    `Latin characters leaked into Arabic questions (${violations.length}):\n${violations.slice(0, 15).join('\n')}`
  );
});

test('Mid-quiz language switch preserves exact session order and IDs across tr -> de -> ar', async () => {
  const dePacks = await loadAllPacks('de');
  const arPacks = await loadAllPacks('ar');

  const trBank = QUESTION_BANK;
  const deBank = buildLocalizedQuestionBank('de', dePacks);
  const arBank = buildLocalizedQuestionBank('ar', arPacks);

  const seed = 4242;
  const trSession = selectQuizSession(trBank, {
    category: 'all',
    gameType: 'all',
    length: 20,
    seed,
  });
  const deSession = selectQuizSession(deBank, {
    category: 'all',
    gameType: 'all',
    length: 20,
    seed,
  });
  const arSession = selectQuizSession(arBank, {
    category: 'all',
    gameType: 'all',
    length: 20,
    seed,
  });

  assert.equal(trSession.length, 20);
  assert.deepEqual(
    deSession.map((q) => q.id),
    trSession.map((q) => q.id)
  );
  assert.deepEqual(
    arSession.map((q) => q.id),
    trSession.map((q) => q.id)
  );
});

test('formatLocalizedIntervalLabel and getLocalizedLearnUi work across all 5 languages', async () => {
  for (const lang of ALL_LANGS) {
    const pack = await loadLearnPack(lang);
    const ui = getLocalizedLearnUi(lang, pack);
    assert.ok(ui.learnPage.tabs.quiz.trim().length > 0);
    for (const rating of ['again', 'good', 'easy'] as const) {
      const label = formatLocalizedIntervalLabel(rating, undefined, lang, pack);
      assert.ok(label.trim().length > 0, `Empty interval label for ${lang}/${rating}`);
      if (lang === 'ar') {
        assert.ok(!/[A-Za-z]/.test(label), `Latin char in Arabic interval label: ${label}`);
      }
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import ebuDavudRaw from '../data/ebu-davud.json';
import { getQuestionBankStats, QUESTION_BANK } from '../data/questionBank';
import type { EbuDavudData } from '../types';
import {
  createInitialGamificationState,
  getLevelForXp,
  recordQuizOutcome,
  selectQuizSession,
} from './learnEngine';

const EBU_DAVUD = ebuDavudRaw as EbuDavudData;

test('QUESTION_BANK contains >= 300 PDF-grounded questions meeting every category minimum', () => {
  const stats = getQuestionBankStats();
  assert.ok(stats.total >= 300, `Expected >= 300 total questions, got ${stats.total}`);
  assert.ok(stats.byCategory.hadisler >= 190, `Expected >= 190 hadith questions, got ${stats.byCategory.hadisler}`);
  assert.ok(stats.byCategory.ebu_davud >= 60, `Expected >= 60 Ebu Davud questions, got ${stats.byCategory.ebu_davud}`);
  assert.ok(stats.byCategory.sunen >= 50, `Expected >= 50 Sunen questions, got ${stats.byCategory.sunen}`);
  assert.ok(stats.byCategory.sozluk >= 30, `Expected >= 30 Glossary questions, got ${stats.byCategory.sozluk}`);
  assert.ok(stats.byCategory.bab_temalari >= 25, `Expected >= 25 Bab Theme questions, got ${stats.byCategory.bab_temalari}`);

  // All 38 hadiths (4740-4777) have >= 5 questions each
  for (let id = 4740; id <= 4777; id++) {
    const count = QUESTION_BANK.filter((q) => q.hadithId === id).length;
    assert.ok(count >= 5, `Hadith #${id} must have >= 5 questions, got ${count}`);
  }

  // All 14 cities have interactive city_map questions
  const cityQuestions = QUESTION_BANK.filter((q) => q.gameType === 'city_map');
  assert.equal(cityQuestions.length, EBU_DAVUD.cities.length);

  // Every single question has non-empty explanation, sourceRef, and valid answer payload
  for (const q of QUESTION_BANK) {
    assert.ok(q.prompt.trim().length > 5, `${q.id} prompt missing`);
    assert.ok(q.explanation.trim().length > 5, `${q.id} explanation missing`);
    assert.ok(q.sourceRef.trim().length > 3, `${q.id} sourceRef missing`);

    if (q.options) {
      assert.equal(q.options.length, 4, `${q.id} must have 4 options`);
      assert.ok(
        typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4,
        `${q.id} invalid correctIndex`
      );
      assert.equal(new Set(q.options).size, 4, `${q.id} has duplicate options`);
    }
    if (q.gameType === 'true_false') {
      assert.equal(typeof q.correctBool, 'boolean', `${q.id} missing correctBool`);
    }
    if (q.gameType === 'matching') {
      assert.ok(q.pairs && q.pairs.length >= 4, `${q.id} matching needs >=4 pairs`);
    }
    if (q.gameType === 'word_order' || q.gameType === 'isnad_order') {
      assert.ok(q.orderedItems && q.orderedItems.length >= 3, `${q.id} ordering needs >=3 items`);
    }
    if (q.gameType === 'city_map') {
      assert.ok(
        EBU_DAVUD.cities.some((c) => c.id === q.targetCityId),
        `${q.id} invalid targetCityId ${q.targetCityId}`
      );
    }
  }
});

test('selectQuizSession and recordQuizOutcome track XP, mistakes, bab stats, and badges cleanly', () => {
  const s10 = selectQuizSession(QUESTION_BANK, {
    category: 'all',
    gameType: 'all',
    length: 10,
    seed: 7,
  });
  assert.equal(s10.length, 10);

  let state = createInitialGamificationState();
  const sampleQ = s10[0];

  // Wrong answer adds to mistakeIds
  const wrongRes = recordQuizOutcome(state, sampleQ, false, 0, false, 1_700_000_000_000);
  state = wrongRes.nextState;
  assert.ok(state.mistakeIds.includes(sampleQ.id));
  assert.equal(state.totalAnswered, 1);
  assert.equal(state.totalCorrect, 0);

  // Correct answer clears from mistakeIds and grants XP + unlocks first-step
  const rightRes = recordQuizOutcome(state, sampleQ, true, 5, true, 1_700_000_000_000);
  state = rightRes.nextState;
  assert.equal(state.mistakeIds.includes(sampleQ.id), false);
  assert.ok(state.xp > 15);
  assert.ok(state.unlockedBadges.includes('first-step'));
  assert.ok(state.unlockedBadges.includes('combo-5'));
  assert.ok(getLevelForXp(state.xp).current.level >= 1);
});

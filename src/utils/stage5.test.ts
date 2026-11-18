import test from 'node:test';
import assert from 'node:assert/strict';
import hadislerRaw from '../data/hadisler.json';
import { BABS } from '../data/babs';
import { GLOSSARY_TERMS, extractNarratorDirectory } from '../data/glossaryData';
import type { HadithItem } from '../types';
import {
  buildQuizQuestions,
  createInitialSrsState,
  isCardDue,
  reviewSrsCard,
} from './learnEngine';
import { runGlobalSearch } from './globalSearch';

const hadiths = hadislerRaw as HadithItem[];

test('spaced repetition engine schedules again/good/easy intervals properly', () => {
  const baseNow = 1_700_000_000_000;
  const init = createInitialSrsState('w1', baseNow);
  assert.equal(isCardDue(init, baseNow), true);

  const afterGood1 = reviewSrsCard(init, 'w1', 'good', baseNow);
  assert.equal(afterGood1.repetitions, 1);
  assert.equal(afterGood1.intervalDays, 1);
  assert.equal(isCardDue(afterGood1, baseNow + 1000), false);
  assert.equal(isCardDue(afterGood1, afterGood1.dueAt + 1), true);

  const afterGood2 = reviewSrsCard(afterGood1, 'w1', 'good', afterGood1.dueAt);
  assert.equal(afterGood2.intervalDays, 3);

  const afterEasy = reviewSrsCard(afterGood2, 'w1', 'easy', afterGood2.dueAt);
  assert.ok(afterEasy.intervalDays >= 4);
  assert.ok(afterEasy.easeFactor > afterGood2.easeFactor);

  const afterAgain = reviewSrsCard(afterEasy, 'w1', 'again', afterEasy.dueAt);
  assert.equal(afterAgain.repetitions, 0);
  assert.equal(afterAgain.intervalDays, 0);
  assert.equal(afterAgain.lapses, 1);
});

test('buildQuizQuestions produces valid 4-option questions across all modes', () => {
  for (const mode of ['vocabulary', 'hadith_bab', 'encyclopedia', 'mixed'] as const) {
    const questions = buildQuizQuestions(mode, hadiths, BABS, 'tr', 42, 6);
    assert.equal(questions.length, 6);
    for (const q of questions) {
      assert.equal(q.options.length, 4);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
      assert.ok(q.explanation.length > 10);
    }
  }
});

test('glossaryData has comprehensive Usul terms and narrator directory aggregates all 38 hadiths', () => {
  assert.ok(GLOSSARY_TERMS.length >= 16);
  const narrators = extractNarratorDirectory(hadiths);
  assert.ok(narrators.length >= 50);

  const ebuDavud = narrators.find((n) => n.nameTr.includes('Ebû Dâvûd'));
  assert.ok(ebuDavud);
  assert.equal(ebuDavud.hadithIds.length, 38);

  const muaz = narrators.find((n) => n.nameTr.includes('Muâz'));
  assert.ok(muaz && muaz.hadithIds.includes(4747));
});

test('runGlobalSearch finds unvocalized Arabic, Hadith IDs, footnotes, TDV articles, and glossary terms', () => {
  // Unvocalized Arabic
  const ghadabResults = runGlobalSearch('غضب', 'all');
  assert.ok(ghadabResults.some((r) => r.category === 'hadith' && r.title.includes('#4747')));
  assert.ok(ghadabResults.some((r) => r.category === 'word'));

  // Hadith number
  const h4750 = runGlobalSearch('4750', 'hadith');
  assert.equal(h4750[0]?.title.includes('#4750'), true);

  // Commentary author (works with both plain 'Hattabi' and 'Hattâbî')
  const hattabi = runGlobalSearch('Hattabi', 'sunen');
  assert.ok(hattabi.some((r) => r.title.includes('Meʿâlim') || r.title.includes('Hattâbî')));

  const mealim = runGlobalSearch('Mealim', 'sunen');
  assert.ok(mealim.some((r) => r.title.includes('Meʿâlim')));

  // Scholarly city
  const tarsus = runGlobalSearch('Tarsus', 'ebu_davud');
  assert.ok(tarsus.length >= 1);

  // Glossary term
  const mursel = runGlobalSearch('Mürsel', 'glossary');
  assert.ok(mursel.some((r) => r.title.includes('Mürsel')));
});

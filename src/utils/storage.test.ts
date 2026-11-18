import test from 'node:test';
import assert from 'node:assert/strict';
import { clampFontScale, toggleNumberInList } from './storage';

test('clampFontScale clamps values within accessible bounds 0.85 - 1.35', () => {
  assert.equal(clampFontScale(0.5), 0.85);
  assert.equal(clampFontScale(1.15), 1.15);
  assert.equal(clampFontScale(2.0), 1.35);
  assert.equal(clampFontScale(Number.NaN), 1);
});

test('toggleNumberInList adds or removes item idempotently', () => {
  assert.deepEqual(toggleNumberInList([4740, 4741], 4742), [4740, 4741, 4742]);
  assert.deepEqual(toggleNumberInList([4740, 4741], 4740), [4741]);
});

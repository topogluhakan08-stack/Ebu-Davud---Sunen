import test from 'node:test';
import assert from 'node:assert/strict';
import hadislerRaw from '../data/hadisler.json';
import type { HadithItem } from '../types';
import {
  buildIsnadTree,
  extractTahammulSequence,
  findHadithsByNarrator,
} from './isnadTree';

const hadiths = hadislerRaw as HadithItem[];

test('buildIsnadTree produces valid vertical nodes and directional edges for all 38 hadiths', () => {
  assert.equal(hadiths.length, 38);

  for (const h of hadiths) {
    const tree = buildIsnadTree(h);
    assert.equal(tree.hadithId, h.id);
    assert.ok(tree.nodes.length >= 4, `Hadith ${h.id} must have >= 4 tree nodes`);
    assert.ok(tree.edges.length >= 3, `Hadith ${h.id} must have >= 3 tree edges`);

    const nodeIds = new Set(tree.nodes.map((n) => n.id));
    for (const n of tree.nodes) {
      assert.ok(n.bioTr.trim().length > 0, `Narrator bio must not be empty in #${h.id}`);
    }
    for (const e of tree.edges) {
      assert.ok(nodeIds.has(e.fromId), `Edge fromId ${e.fromId} missing in #${h.id}`);
      assert.ok(nodeIds.has(e.toId), `Edge toId ${e.toId} missing in #${h.id}`);
      assert.ok(e.tahammulAr.trim().length > 0, `Edge tahammulAr missing in #${h.id}`);
    }
  }
});

test('buildIsnadTree splits multi-branch tarîk chains and flags dashed caution nodes', () => {
  const branchIds = [4751, 4757, 4766, 4768, 4774, 4775, 4776];
  for (const id of branchIds) {
    const h = hadiths.find((x) => x.id === id)!;
    const tree = buildIsnadTree(h);
    assert.equal(tree.hasBranching, true, `Hadith ${id} must detect parallel branches`);
  }

  const cautionIds = [4745, 4746, 4750, 4756, 4757, 4777];
  for (const id of cautionIds) {
    const h = hadiths.find((x) => x.id === id)!;
    const tree = buildIsnadTree(h);
    assert.equal(tree.hasCaution, true, `Hadith ${id} must flag caution/mübhem/mürsel notes`);
    assert.ok(
      tree.edges.some((e) => e.dashed),
      `Hadith ${id} must have at least one dashed edge`
    );
  }
});

test('extractTahammulSequence and findHadithsByNarrator return accurate cross-references', () => {
  const h4740 = hadiths.find((x) => x.id === 4740)!;
  const seq = extractTahammulSequence(h4740.isnadAr);
  assert.ok(seq.length >= 2);

  const tree4740 = buildIsnadTree(h4740);
  const enesNode = tree4740.nodes.find((n) => /Enes|أَنَس/i.test(n.nameTr));
  assert.ok(enesNode, 'Enes b. Mâlik node should exist in Hadith 4740');
  const refs = findHadithsByNarrator(enesNode!, hadiths, 4740);
  assert.ok(refs.length >= 2, 'Enes b. Mâlik should appear in multiple hadiths');
  assert.ok(refs.every((r) => r.hadithId !== 4740));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import ebuDavudData from '../data/ebu-davud.json';
import type { EbuDavudData } from '../types';

const data = ebuDavudData as EbuDavudData;

test('ebu-davud.json contains all 14 cities, 9 main works, 10 other works, and 22 bibliography items', () => {
  assert.equal(data.cities.length, 14);
  assert.equal(data.works.mainWorks.length, 9);
  assert.equal(data.works.otherWorks.length, 10);
  assert.equal(data.studiesAboutHim.length, 5);
  assert.equal(data.bibliography.length, 22);
  assert.equal(data.sayingsAndFourHadiths.length, 7);
});

test('ebu-davud.json network links reference existing nodes', () => {
  const nodeIds = new Set(data.network.nodes.map((n) => n.id));
  assert.ok(nodeIds.has('ebu-davud'));
  for (const link of data.network.links) {
    assert.ok(nodeIds.has(link.source), `Missing source node: ${link.source}`);
    assert.ok(nodeIds.has(link.target), `Missing target node: ${link.target}`);
  }
});

test('ebu-davud.json preserves key historical figures and counts', () => {
  assert.equal(data.hadithScholarship.numbersComparison.totalWritten, 500000);
  assert.equal(data.hadithScholarship.numbersComparison.selectedInSunen, 4800);
  assert.equal(data.hadithScholarship.numbersComparison.memorizableDiscussed, 100000);
  assert.ok(data.biography.deathAndBurial.includes('16 Şevval 275'));
  assert.ok(data.biography.deathAndBurial.includes('21 Şubat 889'));
});

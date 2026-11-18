import test from 'node:test';
import assert from 'node:assert/strict';
import sunenRaw from '../data/sunen.json';
import type { SunenData } from '../types';

const data = sunenRaw as SunenData;

test('sunen.json preserves exact core statistics and Risale principles', () => {
  assert.equal(data.compilationAndPurpose.hadithTotals.totalWritten, 500000);
  assert.equal(data.compilationAndPurpose.hadithTotals.selectedInSunen, 4800);
  assert.equal(data.compilationAndPurpose.hadithTotals.murselApprox, 600);
  assert.equal(data.compilationAndPurpose.mekkeLetter.principles.length, 6);
  assert.ok(
    data.compilationAndPurpose.specialNotes.kopruluManuscriptRef.includes('Köprülü Ktp., nr. 363')
  );
});

test('sunen.json includes all 4 editions, 3 rawis, 8 print cities, 9 commentaries, 5 incomplete works, 9 studies, and 12 bibliography entries', () => {
  assert.equal(data.editionStats.length, 4);
  assert.equal(data.authenticityAndStructure.rawis.length, 3);
  assert.equal(data.printCities.length, 8);
  assert.equal(data.commentaries.length, 9);
  assert.equal(data.incompleteWorks.length, 5);
  assert.equal(data.abridgementsAndStudies.length, 9);
  assert.equal(data.bibliography.length, 12);
});

test('sunen.json edition comparison totals match TDV article exactly', () => {
  const byId = Object.fromEntries(data.editionStats.map((e) => [e.id, e]));
  assert.deepEqual(
    { books: byId.wensinck.books, babs: byId.wensinck.babs, hadiths: byId.wensinck.hadiths },
    { books: 40, babs: 1889, hadiths: 4800 }
  );
  assert.deepEqual(
    {
      books: byId.abdulhamid.books,
      babs: byId.abdulhamid.babs,
      hadiths: byId.abdulhamid.hadiths,
    },
    { books: 35, babs: 1871, hadiths: 5274 }
  );
  assert.deepEqual(
    { books: byId.avvame.books, babs: byId.avvame.babs, hadiths: byId.avvame.hadiths },
    { books: 36, babs: 1850, hadiths: 5232 }
  );
  assert.deepEqual(
    {
      books: byId.liechtenstein.books,
      babs: byId.liechtenstein.babs,
      hadiths: byId.liechtenstein.hadiths,
    },
    { books: 42, babs: 1885, hadiths: 5276 }
  );
});

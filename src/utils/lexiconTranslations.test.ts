import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fullWordLexiconRaw from '../data/fullWordLexicon.json';
import hadislerRaw from '../data/hadisler.json';
import kelimelerRaw from '../data/kelimeler.json';
import { GLOSSARY_TERMS, extractNarratorDirectory, type GlossaryCategory } from '../data/glossaryData';
import type { FullWordLexiconEntry, HadithItem, IsnadNode, LanguageCode } from '../types';
import { buildIsnadTree } from './isnadTree';
import {
  getLocalizedBranchLabel,
  getLocalizedCautionReason,
  getLocalizedDerivativeMeaning,
  getLocalizedGlossaryCategory,
  getLocalizedGlossaryTerm,
  getLocalizedIsnadNote,
  getLocalizedNarratorBio,
  getLocalizedNarratorLayer,
  getLocalizedRootWordMorphology,
  getLocalizedWordGrammar,
  getLocalizedWordMeaning,
  loadGlossaryPack,
  loadWordLexiconPack,
} from './lexiconTranslations';
import { runGlobalSearch } from './globalSearch';

const FULL_LEXICON = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;
const HADITHS = hadislerRaw as HadithItem[];
const ROOTS = (
  kelimelerRaw as {
    roots: Array<{
      id: string;
      root: string;
      words: Array<{
        id: string;
        arabic: string;
        meaningTr: string;
        meaningFr: string;
        partOfSpeech: string;
        morphology: string;
      }>;
      derivatives: Array<{ ar: string; tr: string; fr: string }>;
    }>;
  }
).roots;
const NARRATORS = extractNarratorDirectory(HADITHS);

const TARGET_LANGS: Array<Exclude<LanguageCode, 'tr'>> = ['fr', 'de', 'nl', 'ar'];
const FALLBACK_SENTINEL = '__MISSING__';
const TURKISH_ONLY_CHARS = /[şŞğĞıİ]/;
const LATIN_LETTERS = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

describe('B3 Lexicon, Glossary, Isnad & Sarf/Irab 5-language localization', () => {
  it('covers 100% of glossary terms, categories, layers, narrator bios, and isnad notes in fr/de/nl/ar', async () => {
    const categories: GlossaryCategory[] = ['sened_sihhat', 'telif_turleri', 'tahkik_hasiye'];
    const layers: IsnadNode['layer'][] = ['prophet', 'sahabi', 'tabiin', 'etba', 'musannif'];

    for (const lang of TARGET_LANGS) {
      const pack = await loadGlossaryPack(lang);
      if (!pack) {
        throw new Error(`Expected glossary pack for ${lang}`);
      }

      for (const cat of categories) {
        const label = getLocalizedGlossaryCategory(cat, lang, pack);
        assert.ok(label.length > 0, `Missing category ${cat} in ${lang}`);
        assert.equal(TURKISH_ONLY_CHARS.test(label), false, `Turkish char in category ${cat} (${lang}): ${label}`);
      }

      for (const layer of layers) {
        const label = getLocalizedNarratorLayer(layer, lang, pack);
        assert.ok(label.length > 0, `Missing layer ${layer} in ${lang}`);
        assert.equal(TURKISH_ONLY_CHARS.test(label), false, `Turkish char in layer ${layer} (${lang}): ${label}`);
      }

      for (const term of GLOSSARY_TERMS) {
        const loc = getLocalizedGlossaryTerm(term, lang, pack, FALLBACK_SENTINEL);
        assert.notEqual(loc.definition, FALLBACK_SENTINEL, `Missing glossary term ${term.id} in ${lang}`);
        assert.ok(loc.term.length > 0);
        assert.ok(loc.exampleInApp.length > 0);
        assert.ok(loc.relatedLabel.length > 0);
        for (const field of [loc.categoryLabel, loc.term, loc.definition, loc.exampleInApp, loc.relatedLabel]) {
          assert.equal(
            TURKISH_ONLY_CHARS.test(field),
            false,
            `Turkish char in glossary ${term.id} (${lang}): ${field}`
          );
          if (lang === 'ar') {
            assert.equal(
              LATIN_LETTERS.test(field),
              false,
              `Latin letter in Arabic glossary ${term.id}: ${field}`
            );
          }
        }
      }

      // Every narrator directory note must localize without fallback
      for (const n of NARRATORS) {
        for (const note of n.notes) {
          const locNote = getLocalizedIsnadNote(note, lang, pack, FALLBACK_SENTINEL);
          assert.notEqual(locNote, FALLBACK_SENTINEL, `Missing isnad note (${lang}): ${note}`);
          assert.equal(TURKISH_ONLY_CHARS.test(locNote), false, `Turkish char in isnad note (${lang}): ${locNote}`);
        }
      }

      // Every narrator bio, caution reason, and branch label across all 38 hadith trees must localize
      for (const h of HADITHS) {
        const tree = buildIsnadTree({ id: h.id, isnadChain: h.isnadChain, isnadAr: h.isnadAr });
        for (const node of tree.nodes) {
          const bio = getLocalizedNarratorBio(node.bioTr, lang, pack, FALLBACK_SENTINEL);
          assert.notEqual(bio, FALLBACK_SENTINEL, `Missing narrator bio in #${h.id} (${lang}): ${node.bioTr}`);
          assert.equal(TURKISH_ONLY_CHARS.test(bio), false, `Turkish char in narrator bio (${lang}): ${bio}`);
          if (node.uncertainReason) {
            const reason = getLocalizedCautionReason(node.uncertainReason, lang, pack);
            assert.equal(
              TURKISH_ONLY_CHARS.test(reason),
              false,
              `Turkish char in caution reason (${lang}): ${reason}`
            );
          }
          if (node.branchLabel) {
            const branch = getLocalizedBranchLabel(node.branchLabel, lang, pack);
            assert.equal(
              TURKISH_ONLY_CHARS.test(branch),
              false,
              `Turkish char in branch label (${lang}): ${branch}`
            );
          }
        }
      }
    }
  });

  it('covers 100% of fullWordLexicon (736), hadith words (125), root words (423), and derivatives (1,423) in fr/de/nl/ar', async () => {
    for (const lang of TARGET_LANGS) {
      const wordPack = await loadWordLexiconPack(lang);
      const glossaryPack = await loadGlossaryPack(lang);
      if (!wordPack || !glossaryPack) {
        throw new Error(`Expected word & glossary packs for ${lang}`);
      }

      // 1. All 736 fullWordLexicon entries: meaning, grammar, narratorBio, derivatives
      for (const [key, entry] of Object.entries(FULL_LEXICON)) {
        const meaning = getLocalizedWordMeaning(entry, lang, wordPack, FALLBACK_SENTINEL);
        assert.notEqual(meaning, FALLBACK_SENTINEL, `Missing meaning for ${key} (${lang}): ${entry.meaningTr}`);
        assert.equal(TURKISH_ONLY_CHARS.test(meaning), false, `Turkish char in meaning ${key} (${lang}): ${meaning}`);
        if (lang === 'ar') {
          assert.equal(LATIN_LETTERS.test(meaning), false, `Latin letter in AR meaning ${key}: ${meaning}`);
        }

        const grammar = getLocalizedWordGrammar(entry, lang, wordPack);
        for (const [fieldName, val] of Object.entries(grammar)) {
          assert.equal(
            TURKISH_ONLY_CHARS.test(val),
            false,
            `Turkish char in ${key}.${fieldName} (${lang}): ${val}`
          );
          if (lang === 'ar') {
            assert.equal(
              LATIN_LETTERS.test(val),
              false,
              `Latin letter in AR ${key}.${fieldName}: ${val}`
            );
          }
        }

        if (entry.narratorBioTr) {
          const bio = getLocalizedNarratorBio(entry.narratorBioTr, lang, glossaryPack, FALLBACK_SENTINEL);
          assert.notEqual(bio, FALLBACK_SENTINEL, `Missing lexicon narratorBio ${key} (${lang}): ${entry.narratorBioTr}`);
          assert.equal(TURKISH_ONLY_CHARS.test(bio), false, `Turkish char in lexicon narratorBio (${lang}): ${bio}`);
        }

        for (const d of entry.derivatives || []) {
          const deriv = getLocalizedDerivativeMeaning(d, lang, wordPack, FALLBACK_SENTINEL);
          assert.notEqual(deriv, FALLBACK_SENTINEL, `Missing derivative ${d.ar} (${lang})`);
          assert.equal(TURKISH_ONLY_CHARS.test(deriv), false, `Turkish char in derivative ${d.ar} (${lang}): ${deriv}`);
          if (lang === 'ar') {
            assert.equal(LATIN_LETTERS.test(deriv), false, `Latin letter in AR derivative ${d.ar}: ${deriv}`);
          }
        }
      }

      // 2. All 125 hadith key words
      for (const h of HADITHS) {
        for (const w of h.words) {
          const meaning = getLocalizedWordMeaning(w, lang, wordPack, FALLBACK_SENTINEL);
          assert.notEqual(meaning, FALLBACK_SENTINEL, `Missing hadith #${h.id} word meaning (${lang}): ${w.meaningTr}`);
          for (const d of w.derivatives || []) {
            const deriv = getLocalizedDerivativeMeaning(d, lang, wordPack, FALLBACK_SENTINEL);
            assert.notEqual(deriv, FALLBACK_SENTINEL, `Missing hadith #${h.id} deriv ${d.ar} (${lang})`);
          }
        }
      }

      // 3. All 275 roots / 423 kelimeler.json words & derivatives
      for (const r of ROOTS) {
        for (const w of r.words) {
          const meaning = getLocalizedWordMeaning(w, lang, wordPack, FALLBACK_SENTINEL);
          assert.notEqual(meaning, FALLBACK_SENTINEL, `Missing root word ${w.id} meaning (${lang}): ${w.meaningTr}`);
          const morph = getLocalizedRootWordMorphology(w, FULL_LEXICON, lang, wordPack, FALLBACK_SENTINEL);
          assert.notEqual(morph, FALLBACK_SENTINEL, `Missing root word ${w.id} morphology (${lang})`);
          assert.equal(TURKISH_ONLY_CHARS.test(morph), false, `Turkish char in root morph ${w.id} (${lang}): ${morph}`);
          if (lang === 'ar') {
            assert.equal(LATIN_LETTERS.test(morph), false, `Latin letter in AR root morph ${w.id}: ${morph}`);
          }
        }
        for (const d of r.derivatives) {
          const deriv = getLocalizedDerivativeMeaning(d, lang, wordPack, FALLBACK_SENTINEL);
          assert.notEqual(deriv, FALLBACK_SENTINEL, `Missing root deriv ${d.ar} (${lang})`);
        }
      }
    }
  });

  it('supports localized global search across DE, NL, and AR glossary and word packs', async () => {
    const [glossaryDe, wordsDe, glossaryNl, wordsNl, glossaryAr, wordsAr] = await Promise.all([
      loadGlossaryPack('de'),
      loadWordLexiconPack('de'),
      loadGlossaryPack('nl'),
      loadWordLexiconPack('nl'),
      loadGlossaryPack('ar'),
      loadWordLexiconPack('ar'),
    ]);

    const deHits = runGlobalSearch('Überliefererkette', 'glossary', 20, {
      language: 'de',
      glossaryPack: glossaryDe,
      wordLexiconPack: wordsDe,
      missingFallback: FALLBACK_SENTINEL,
    });
    assert.ok(deHits.some((r) => r.id === 'glossary-isnad'), 'DE glossary search should match isnad');

    const nlWordHits = runGlobalSearch('zachtmoedigheid', 'word', 20, {
      language: 'nl',
      glossaryPack: glossaryNl,
      wordLexiconPack: wordsNl,
      missingFallback: FALLBACK_SENTINEL,
    });
    assert.ok(nlWordHits.length > 0, 'NL word search should match localized Dutch words');

    const arGlossaryHits = runGlobalSearch('المنكر', 'glossary', 20, {
      language: 'ar',
      glossaryPack: glossaryAr,
      wordLexiconPack: wordsAr,
      missingFallback: FALLBACK_SENTINEL,
    });
    assert.ok(arGlossaryHits.some((r) => r.id === 'glossary-munker'), 'AR glossary search should match munker');
  });
});

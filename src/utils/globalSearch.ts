import hadislerRaw from '../data/hadisler.json';
import kelimelerRaw from '../data/kelimeler.json';
import fullWordLexiconRaw from '../data/fullWordLexicon.json';
import ebuDavudRaw from '../data/ebu-davud.json';
import sunenRaw from '../data/sunen.json';
import { BABS } from '../data/babs';
import { GLOSSARY_TERMS, extractNarratorDirectory } from '../data/glossaryData';
import type {
  EbuDavudData,
  FullWordLexiconEntry,
  HadithItem,
  LanguageCode,
  SunenData,
} from '../types';
import { matchesArabicQuery } from './arabic';
import { normalizeTransliterationSearch } from './localizedText';
import {
  formatPdfPage,
  getLocalizedBab,
  getLocalizedHadithContent,
  type HadithLanguagePack,
} from './hadithTranslations';
import {
  getLocalizedDerivativeMeaning,
  getLocalizedGlossaryTerm,
  getLocalizedIsnadNote,
  getLocalizedIsnadUi,
  getLocalizedNarratorLayer,
  getLocalizedPartOfSpeech,
  getLocalizedRootWordMorphology,
  getLocalizedWordMeaning,
  type GlossaryAndIsnadPack,
  type WordLexiconPack,
} from './lexiconTranslations';
import {
  getLocalizedEbuDavud,
  getLocalizedEbuDavudUi,
  getLocalizedSunen,
  getLocalizedSunenUi,
  type ArticleTranslationPack,
} from './articleTranslations';

export type SearchResultCategory =
  | 'all'
  | 'hadith'
  | 'word'
  | 'footnote'
  | 'narrator'
  | 'bab'
  | 'ebu_davud'
  | 'sunen'
  | 'glossary';

export interface GlobalSearchResult {
  id: string;
  category: Exclude<SearchResultCategory, 'all'>;
  categoryLabel: string;
  title: string;
  arabicSnippet?: string;
  snippet: string;
  meta: string;
  to: string;
}

interface KelimelerRootItem {
  id: string;
  root: string;
  rootNormalized: string;
  words: {
    id: string;
    hadithId: number;
    babId: number;
    arabic: string;
    transliteration: string;
    meaningTr: string;
    meaningFr: string;
    partOfSpeech: string;
    morphology: string;
  }[];
  hadithIds: number[];
  derivatives: { ar: string; tr: string; fr: string }[];
}

const HADITHS = hadislerRaw as HadithItem[];
const FULL_LEXICON = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;
const EBU_DAVUD = ebuDavudRaw as EbuDavudData;
const SUNEN = sunenRaw as SunenData;
const ROOTS = (kelimelerRaw as { roots: KelimelerRootItem[] }).roots;
const NARRATORS = extractNarratorDirectory(HADITHS);

function normalizeScholarText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ʿʾ’'‘`]/g, '')
    .replace(/ḥ/gi, 'h')
    .replace(/ṣ/gi, 's')
    .replace(/ḍ/gi, 'd')
    .replace(/ṭ/gi, 't')
    .replace(/ẓ/gi, 'z')
    .replace(/ẕ/gi, 'z')
    .replace(/ḫ/gi, 'h')
    .replace(/ī/gi, 'i')
    .replace(/ū/gi, 'u')
    .replace(/ā/gi, 'a')
    .toLocaleLowerCase('tr');
}

function includesQuery(text: string, q: string): boolean {
  if (!q) return false;
  if (normalizeScholarText(text).includes(normalizeScholarText(q))) return true;
  const normText = normalizeTransliterationSearch(text);
  const normQ = normalizeTransliterationSearch(q);
  if (normQ && normText.includes(normQ)) return true;
  if (/[\u0600-\u06FF]/.test(q)) {
    return matchesArabicQuery(text, q);
  }
  return false;
}

export interface GlobalSearchLocaleOptions {
  language?: LanguageCode;
  hadithPack?: HadithLanguagePack | null;
  secondaryHadithPack?: HadithLanguagePack | null;
  glossaryPack?: GlossaryAndIsnadPack | null;
  secondaryGlossaryPack?: GlossaryAndIsnadPack | null;
  wordLexiconPack?: WordLexiconPack | null;
  secondaryWordLexiconPack?: WordLexiconPack | null;
  articlePack?: ArticleTranslationPack | null;
  secondaryArticlePack?: ArticleTranslationPack | null;
  missingFallback?: string;
}

export function runGlobalSearch(
  rawQuery: string,
  categoryFilter: SearchResultCategory = 'all',
  limit = 80,
  locale?: GlobalSearchLocaleOptions
): GlobalSearchResult[] {
  const q = rawQuery.trim();
  if (!q) return [];

  const lang: LanguageCode = locale?.language ?? 'tr';
  const pack = locale?.hadithPack ?? null;
  const secondaryPack = locale?.secondaryHadithPack ?? null;
  const glossaryPack = locale?.glossaryPack ?? null;
  const secondaryGlossaryPack = locale?.secondaryGlossaryPack ?? null;
  const wordPack = locale?.wordLexiconPack ?? null;
  const secondaryWordPack = locale?.secondaryWordLexiconPack ?? null;
  const articlePack = locale?.articlePack ?? null;
  const secondaryArticlePack = locale?.secondaryArticlePack ?? null;
  const missingFallback = locale?.missingFallback ?? '';

  const results: GlobalSearchResult[] = [];
  const allow = (cat: Exclude<SearchResultCategory, 'all'>) =>
    categoryFilter === 'all' || categoryFilter === cat;

  // 1. Babs (11)
  if (allow('bab')) {
    for (const bab of BABS) {
      const locBab = getLocalizedBab(bab, lang, pack);
      const secBab = secondaryPack?.babs[bab.id];
      if (
        includesQuery(locBab.title, q) ||
        includesQuery(locBab.subtitle, q) ||
        (secBab && (includesQuery(secBab.title, q) || includesQuery(secBab.subtitle, q))) ||
        includesQuery(bab.titleTr, q) ||
        includesQuery(bab.titleFr, q) ||
        includesQuery(bab.titleAr, q) ||
        includesQuery(bab.subtitleTr, q) ||
        bab.keyArabicTerms.some((term) => includesQuery(term, q))
      ) {
        results.push({
          id: `bab-${bab.id}`,
          category: 'bab',
          categoryLabel: locBab.numberLabel,
          title: `${locBab.numberLabel}: ${locBab.title}`,
          arabicSnippet: bab.titleAr,
          snippet: locBab.subtitle,
          meta: `#${bab.hadithStart}–${bab.hadithEnd} · ${formatPdfPage(bab.pdfPages, lang)}`,
          to: `/hadisler?bab=${bab.id}`,
        });
      }
    }
  }

  // 2. Hadiths (38)
  if (allow('hadith')) {
    for (const h of HADITHS) {
      const locH = getLocalizedHadithContent(h, lang, pack, missingFallback);
      const secEntry = secondaryPack?.hadiths[h.id];
      const idMatch = String(h.id) === q || `#${h.id}` === q;
      const hit =
        idMatch ||
        includesQuery(h.fullTextAr, q) ||
        includesQuery(locH.translation, q) ||
        locH.lessons.some((l) => includesQuery(l, q)) ||
        (locH.contextStory &&
          (includesQuery(locH.contextStory.title, q) ||
            includesQuery(locH.contextStory.summary, q))) ||
        (secEntry &&
          (includesQuery(secEntry.translation, q) ||
            secEntry.lessons.some((l) => includesQuery(l, q)))) ||
        includesQuery(h.translationTr, q) ||
        includesQuery(h.translationFr, q) ||
        h.lessonsTr.some((l) => includesQuery(l, q)) ||
        h.tahricBadges.some((b) => includesQuery(b, q));

      if (hit) {
        const bab = BABS.find((b) => b.id === h.babId);
        const locBab = bab ? getLocalizedBab(bab, lang, pack) : null;
        results.push({
          id: `hadith-${h.id}`,
          category: 'hadith',
          categoryLabel: `#${h.id}`,
          title: `#${h.id} · ${locBab ? `${locBab.numberLabel}: ${locBab.title}` : ''}`,
          arabicSnippet: h.matnAr,
          snippet: locH.translation,
          meta: `${formatPdfPage(h.pdfPage, lang)} · ${h.tahricBadges.join(', ') || 'Sunan Abi Dawud'}`,
          to: `/hadisler?bab=${h.babId}&hadith=${h.id}`,
        });
      }
    }
  }

  // 3. Words & Roots (275 roots / 423 words)
  if (allow('word')) {
    for (const rootEntry of ROOTS) {
      const rootHit =
        includesQuery(rootEntry.root, q) ||
        includesQuery(rootEntry.rootNormalized, q) ||
        rootEntry.derivatives.some((d) => {
          const locDeriv = getLocalizedDerivativeMeaning(d, lang, wordPack, '');
          const secDeriv = secondaryWordPack?.derivatives[d.ar] ?? '';
          return (
            includesQuery(d.ar, q) ||
            includesQuery(d.tr, q) ||
            includesQuery(d.fr, q) ||
            includesQuery(locDeriv, q) ||
            includesQuery(secDeriv, q)
          );
        });

      for (const w of rootEntry.words) {
        const locMeaning = getLocalizedWordMeaning(w, lang, wordPack, missingFallback || w.transliteration);
        const secMeaning = secondaryWordPack?.meanings[w.meaningTr] ?? '';
        const wordHit =
          rootHit ||
          includesQuery(w.arabic, q) ||
          includesQuery(w.transliteration, q) ||
          includesQuery(w.meaningTr, q) ||
          includesQuery(w.meaningFr, q) ||
          includesQuery(locMeaning, q) ||
          includesQuery(secMeaning, q) ||
          includesQuery(w.morphology, q);

        if (wordHit) {
          const locPos = getLocalizedPartOfSpeech(w.partOfSpeech, lang, wordPack);
          const locMorph = getLocalizedRootWordMorphology(
            w,
            FULL_LEXICON,
            lang,
            wordPack,
            missingFallback
          );
          const bab = BABS.find((b) => b.id === w.babId);
          const locBab = bab ? getLocalizedBab(bab, lang, pack) : null;
          results.push({
            id: `word-${w.id}`,
            category: 'word',
            categoryLabel: rootEntry.root,
            title: `${w.arabic} (${w.transliteration}) — ${locMeaning}`,
            arabicSnippet: rootEntry.root,
            snippet: [locPos, locMorph].filter(Boolean).join(' · '),
            meta: `#${w.hadithId} · ${locBab ? locBab.numberLabel : `Bab ${w.babId}`}`,
            to: `/hadisler?bab=${w.babId}&hadith=${w.hadithId}`,
          });
        }
      }
    }
  }

  // 4. Footnotes / Hashiya
  if (allow('footnote')) {
    for (const h of HADITHS) {
      const locH = getLocalizedHadithContent(h, lang, pack, missingFallback);
      const secEntry = secondaryPack?.hadiths[h.id];
      for (const fn of h.footnotes) {
        const locSummary = locH.getFootnoteSummary(fn.id, fn.turkishSummary);
        const secSummary = secEntry?.footnotes[fn.id];
        const hit =
          includesQuery(fn.arabicText, q) ||
          includesQuery(locSummary, q) ||
          (secSummary ? includesQuery(secSummary, q) : false) ||
          includesQuery(fn.turkishSummary, q) ||
          (fn.tahricSources ?? []).some((s) => includesQuery(s, q));

        if (hit) {
          results.push({
            id: `fn-${h.id}-${fn.id}`,
            category: 'footnote',
            categoryLabel: `[${fn.marker}]`,
            title: `#${h.id} · [${fn.marker}]`,
            arabicSnippet: fn.arabicText,
            snippet: locSummary,
            meta: formatPdfPage(h.pdfPage, lang),
            to: `/hadisler?bab=${h.babId}&hadith=${h.id}`,
          });
        }
      }
    }
  }

  // 5. Narrators (Sahabe / Tabiin / Etba / Musannif)
  if (allow('narrator')) {
    const isnadUi = getLocalizedIsnadUi(lang, glossaryPack);
    for (const narrator of NARRATORS) {
      const locNotes = narrator.notes.map((n) =>
        getLocalizedIsnadNote(n, lang, glossaryPack, missingFallback)
      );
      const secNotes = secondaryGlossaryPack
        ? narrator.notes.map((n) => secondaryGlossaryPack.isnadNotes[n] ?? '')
        : [];
      const hit =
        includesQuery(narrator.nameTr, q) ||
        includesQuery(narrator.nameAr, q) ||
        narrator.notes.some((n) => includesQuery(n, q)) ||
        locNotes.some((n) => includesQuery(n, q)) ||
        secNotes.some((n) => includesQuery(n, q));

      if (hit) {
        const firstHadith = narrator.hadithIds[0];
        const layerLabel = getLocalizedNarratorLayer(narrator.layer, lang, glossaryPack);
        results.push({
          id: `narrator-${narrator.key}`,
          category: 'narrator',
          categoryLabel: layerLabel,
          title: lang === 'ar' ? narrator.nameAr : narrator.nameTr,
          arabicSnippet: lang === 'ar' ? undefined : narrator.nameAr,
          snippet: locNotes[0] || layerLabel,
          meta: `${narrator.hadithIds.length} ${isnadUi.otherHadithsUnit} (#${narrator.hadithIds.join(', #')})`,
          to: `/hadisler?hadith=${firstHadith}`,
        });
      }
    }
  }

  // 6. Ebu Davud TDV Encyclopedia
  if (allow('ebu_davud')) {
    const edData = getLocalizedEbuDavud(EBU_DAVUD, lang, articlePack);
    const edUi = getLocalizedEbuDavudUi(lang, articlePack);
    const secEd = secondaryArticlePack?.ebuDavud ?? null;

    if (edData) {
      edData.cities.forEach((city, idx) => {
        const baseCity = EBU_DAVUD.cities[idx];
        const secCity = secEd?.cities[idx];
        if (
          includesQuery(city.nameTr, q) ||
          includesQuery(city.nameAr, q) ||
          includesQuery(city.detailsTr, q) ||
          includesQuery(city.roleTr, q) ||
          city.teachersOrEvents.some((item) => includesQuery(item, q)) ||
          (secCity &&
            (includesQuery(secCity.nameTr, q) || includesQuery(secCity.detailsTr, q))) ||
          (baseCity &&
            (includesQuery(baseCity.nameTr, q) || includesQuery(baseCity.nameAr, q)))
        ) {
          results.push({
            id: `ed-city-${city.id}`,
            category: 'ebu_davud',
            categoryLabel: edUi.searchLabels.cityCategory,
            title: `${edUi.searchLabels.cityTitlePrefix} ${city.order}: ${city.nameTr} (${city.yearText})`,
            arabicSnippet: lang === 'ar' ? undefined : city.nameAr,
            snippet: city.detailsTr,
            meta: city.roleTr,
            to: '/ebu-davud#harita',
          });
        }
      });

      edData.works.mainWorks.forEach((work, idx) => {
        const baseWork = EBU_DAVUD.works.mainWorks[idx];
        const secWork = secEd?.works.mainWorks[idx];
        if (
          includesQuery(work.title, q) ||
          includesQuery(work.summaryTr, q) ||
          (work.altTitles ?? []).some((a) => includesQuery(a, q)) ||
          (secWork &&
            (includesQuery(secWork.title, q) || includesQuery(secWork.summaryTr, q))) ||
          (baseWork &&
            (includesQuery(baseWork.title, q) ||
              (baseWork.altTitles ?? []).some((a) => includesQuery(a, q))))
        ) {
          results.push({
            id: `ed-work-${work.order}`,
            category: 'ebu_davud',
            categoryLabel: edUi.searchLabels.workCategory,
            title: work.title,
            snippet: work.summaryTr,
            meta: edUi.searchLabels.workMeta,
            to: '/ebu-davud#eserleri',
          });
        }
      });

      edData.network.nodes.forEach((node, idx) => {
        const baseNode = EBU_DAVUD.network.nodes[idx];
        const secNode = secEd?.network.nodes[idx];
        if (
          includesQuery(node.label, q) ||
          includesQuery(node.nameAr ?? '', q) ||
          includesQuery(node.detailTr, q) ||
          includesQuery(node.roleTr, q) ||
          (secNode &&
            (includesQuery(secNode.label, q) || includesQuery(secNode.detailTr, q))) ||
          (baseNode &&
            (includesQuery(baseNode.label, q) || includesQuery(baseNode.nameAr ?? '', q)))
        ) {
          results.push({
            id: `ed-node-${node.id}`,
            category: 'ebu_davud',
            categoryLabel: edUi.searchLabels.nodeCategory,
            title: node.label,
            arabicSnippet: lang === 'ar' ? undefined : node.nameAr,
            snippet: node.detailTr,
            meta: `${node.roleTr}${node.city ? ` · ${node.city}` : ''}`,
            to: '/ebu-davud#ag',
          });
        }
      });
    }
  }

  // 7. es-Sunen TDV Encyclopedia
  if (allow('sunen')) {
    const sunenData = getLocalizedSunen(SUNEN, lang, articlePack);
    const sunenUi = getLocalizedSunenUi(lang, articlePack);
    const secSunen = secondaryArticlePack?.sunen ?? null;

    if (sunenData) {
      sunenData.compilationAndPurpose.mekkeLetter.principles.forEach((principle, idx) => {
        const basePrinc = SUNEN.compilationAndPurpose.mekkeLetter.principles[idx];
        const secPrinc = secSunen?.compilationAndPurpose.mekkeLetter.principles[idx];
        if (
          includesQuery(principle.titleTr, q) ||
          includesQuery(principle.detailTr, q) ||
          (secPrinc &&
            (includesQuery(secPrinc.titleTr, q) || includesQuery(secPrinc.detailTr, q))) ||
          (basePrinc && includesQuery(basePrinc.titleTr, q))
        ) {
          results.push({
            id: `sunen-princ-${principle.order}`,
            category: 'sunen',
            categoryLabel: sunenUi.searchLabels.methodCategory,
            title: `${sunenUi.searchLabels.principleTitlePrefix} ${principle.order}: ${principle.titleTr}`,
            snippet: principle.detailTr,
            meta: sunenUi.searchLabels.principleMeta,
            to: '/sunen#telif-metod',
          });
        }
      });

      sunenData.commentaries.forEach((comm, idx) => {
        const baseComm = SUNEN.commentaries[idx];
        const secComm = secSunen?.commentaries[idx];
        if (
          includesQuery(comm.title, q) ||
          includesQuery(comm.author, q) ||
          includesQuery(comm.summaryTr, q) ||
          (secComm &&
            (includesQuery(secComm.title, q) ||
              includesQuery(secComm.author, q) ||
              includesQuery(secComm.summaryTr, q))) ||
          (baseComm &&
            (includesQuery(baseComm.title, q) || includesQuery(baseComm.author, q)))
        ) {
          results.push({
            id: `sunen-comm-${comm.id}`,
            category: 'sunen',
            categoryLabel: sunenUi.searchLabels.commentaryCategory,
            title: `${comm.title} — ${comm.author}`,
            snippet: comm.summaryTr,
            meta: comm.madhhabOrScope,
            to: '/sunen#serh-kitapligi',
          });
        }
      });

      sunenData.abridgementsAndStudies.forEach((study, idx) => {
        const baseStudy = SUNEN.abridgementsAndStudies[idx];
        const secStudy = secSunen?.abridgementsAndStudies[idx];
        if (
          includesQuery(study.title, q) ||
          includesQuery(study.author, q) ||
          includesQuery(study.summaryTr, q) ||
          (secStudy &&
            (includesQuery(secStudy.title, q) ||
              includesQuery(secStudy.author, q) ||
              includesQuery(secStudy.summaryTr, q))) ||
          (baseStudy &&
            (includesQuery(baseStudy.title, q) || includesQuery(baseStudy.author, q)))
        ) {
          results.push({
            id: `sunen-study-${study.id}`,
            category: 'sunen',
            categoryLabel: study.kindLabelTr,
            title: `${study.title} — ${study.author}`,
            snippet: study.summaryTr,
            meta: study.publicationInfo,
            to: '/sunen#serh-kitapligi',
          });
        }
      });
    }
  }

  // 8. Hadis Usulu Glossary
  if (allow('glossary')) {
    for (const term of GLOSSARY_TERMS) {
      const loc = getLocalizedGlossaryTerm(term, lang, glossaryPack, missingFallback);
      const sec = secondaryGlossaryPack?.terms[term.id];
      if (
        includesQuery(loc.term, q) ||
        includesQuery(loc.definition, q) ||
        includesQuery(loc.exampleInApp, q) ||
        (sec && (includesQuery(sec.term, q) || includesQuery(sec.definition, q))) ||
        includesQuery(term.termTr, q) ||
        includesQuery(term.termAr, q) ||
        includesQuery(term.termFr, q) ||
        includesQuery(term.definitionTr, q) ||
        includesQuery(term.exampleInApp, q)
      ) {
        results.push({
          id: `glossary-${term.id}`,
          category: 'glossary',
          categoryLabel: loc.categoryLabel || term.categoryLabelTr,
          title: loc.term,
          arabicSnippet: lang === 'ar' ? undefined : term.termAr,
          snippet: loc.definition,
          meta: loc.categoryLabel || formatPdfPage('1', lang),
          to: `/sozluk?q=${encodeURIComponent(loc.term)}`,
        });
      }
    }
  }

  return results.slice(0, limit);
}

import hadislerRaw from '../data/hadisler.json';
import kelimelerRaw from '../data/kelimeler.json';
import ebuDavudRaw from '../data/ebu-davud.json';
import sunenRaw from '../data/sunen.json';
import { BABS } from '../data/babs';
import { GLOSSARY_TERMS, extractNarratorDirectory } from '../data/glossaryData';
import type { EbuDavudData, HadithItem, SunenData } from '../types';
import { matchesArabicQuery } from './arabic';
import { normalizeTransliterationSearch } from './localizedText';

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

export function runGlobalSearch(
  rawQuery: string,
  categoryFilter: SearchResultCategory = 'all',
  limit = 80
): GlobalSearchResult[] {
  const q = rawQuery.trim();
  if (!q) return [];

  const results: GlobalSearchResult[] = [];
  const allow = (cat: Exclude<SearchResultCategory, 'all'>) =>
    categoryFilter === 'all' || categoryFilter === cat;

  // 1. Babs (11)
  if (allow('bab')) {
    for (const bab of BABS) {
      if (
        includesQuery(bab.titleTr, q) ||
        includesQuery(bab.titleFr, q) ||
        includesQuery(bab.titleAr, q) ||
        includesQuery(bab.subtitleTr, q) ||
        bab.keyArabicTerms.some((term) => includesQuery(term, q))
      ) {
        results.push({
          id: `bab-${bab.id}`,
          category: 'bab',
          categoryLabel: 'Bab',
          title: `${bab.numberLabel}: ${bab.titleTr}`,
          arabicSnippet: bab.titleAr,
          snippet: bab.subtitleTr,
          meta: `Hadis ${bab.hadithStart}–${bab.hadithEnd} · PDF s. ${bab.pdfPages}`,
          to: `/hadisler?bab=${bab.id}`,
        });
      }
    }
  }

  // 2. Hadiths (38)
  if (allow('hadith')) {
    for (const h of HADITHS) {
      const idMatch = String(h.id) === q || `#${h.id}` === q;
      const hit =
        idMatch ||
        includesQuery(h.fullTextAr, q) ||
        includesQuery(h.translationTr, q) ||
        includesQuery(h.translationFr, q) ||
        h.lessonsTr.some((l) => includesQuery(l, q)) ||
        h.tahricBadges.some((b) => includesQuery(b, q));

      if (hit) {
        const bab = BABS.find((b) => b.id === h.babId);
        results.push({
          id: `hadith-${h.id}`,
          category: 'hadith',
          categoryLabel: 'Hadis',
          title: `Hadis #${h.id} · ${bab ? `${bab.numberLabel}: ${bab.titleTr}` : ''}`,
          arabicSnippet: h.matnAr,
          snippet: h.translationTr,
          meta: `PDF s. ${h.pdfPage} · ${h.tahricBadges.join(', ') || "Sünen-i Ebî Dâvûd"}`,
          to: `/hadisler?bab=${h.babId}&hadith=${h.id}`,
        });
      }
    }
  }

  // 3. Words & Roots (107 roots / 125 words)
  if (allow('word')) {
    for (const rootEntry of ROOTS) {
      const rootHit =
        includesQuery(rootEntry.root, q) ||
        includesQuery(rootEntry.rootNormalized, q) ||
        rootEntry.derivatives.some(
          (d) => includesQuery(d.ar, q) || includesQuery(d.tr, q) || includesQuery(d.fr, q)
        );

      for (const w of rootEntry.words) {
        const wordHit =
          rootHit ||
          includesQuery(w.arabic, q) ||
          includesQuery(w.transliteration, q) ||
          includesQuery(w.meaningTr, q) ||
          includesQuery(w.meaningFr, q) ||
          includesQuery(w.morphology, q);

        if (wordHit) {
          results.push({
            id: `word-${w.id}`,
            category: 'word',
            categoryLabel: 'Kelime & Kök',
            title: `${w.arabic} (${w.transliteration}) — ${w.meaningTr}`,
            arabicSnippet: `Kök: ${rootEntry.root}`,
            snippet: `${w.partOfSpeech} · ${w.morphology}`,
            meta: `Hadis #${w.hadithId} · Bab ${w.babId}`,
            to: `/hadisler?bab=${w.babId}&hadith=${w.hadithId}`,
          });
        }
      }
    }
  }

  // 4. Footnotes / Hashiya
  if (allow('footnote')) {
    for (const h of HADITHS) {
      for (const fn of h.footnotes) {
        const hit =
          includesQuery(fn.arabicText, q) ||
          includesQuery(fn.turkishSummary, q) ||
          (fn.tahricSources ?? []).some((s) => includesQuery(s, q));

        if (hit) {
          results.push({
            id: `fn-${h.id}-${fn.id}`,
            category: 'footnote',
            categoryLabel: 'Haşiye / Dipnot',
            title: `Hadis #${h.id} · Haşiye [${fn.marker}]`,
            arabicSnippet: fn.arabicText,
            snippet: fn.turkishSummary,
            meta: `PDF s. ${h.pdfPage}`,
            to: `/hadisler?bab=${h.babId}&hadith=${h.id}`,
          });
        }
      }
    }
  }

  // 5. Narrators (Sahabe / Tabiin / Etba / Musannif)
  if (allow('narrator')) {
    for (const narrator of NARRATORS) {
      const hit =
        includesQuery(narrator.nameTr, q) ||
        includesQuery(narrator.nameAr, q) ||
        narrator.notes.some((n) => includesQuery(n, q));

      if (hit) {
        const firstHadith = narrator.hadithIds[0];
        results.push({
          id: `narrator-${narrator.key}`,
          category: 'narrator',
          categoryLabel: 'Râvi',
          title: narrator.nameTr,
          arabicSnippet: narrator.nameAr,
          snippet: narrator.notes[0] || `Kitâbü’l-Edeb rivayet zincirinde yer alır.`,
          meta: `${narrator.hadithIds.length} hadiste geçer (#${narrator.hadithIds.join(', #')})`,
          to: `/hadisler?hadith=${firstHadith}`,
        });
      }
    }
  }

  // 6. Ebu Davud TDV Encyclopedia
  if (allow('ebu_davud')) {
    for (const city of EBU_DAVUD.cities) {
      if (
        includesQuery(city.nameTr, q) ||
        includesQuery(city.nameAr, q) ||
        includesQuery(city.detailsTr, q) ||
        city.teachersOrEvents.some((t) => includesQuery(t, q))
      ) {
        results.push({
          id: `ed-city-${city.id}`,
          category: 'ebu_davud',
          categoryLabel: 'Ebû Dâvûd',
          title: `${city.order}. İlim Durağı: ${city.nameTr} (${city.yearText})`,
          arabicSnippet: city.nameAr,
          snippet: city.detailsTr,
          meta: city.roleTr,
          to: '/ebu-davud#harita',
        });
      }
    }

    for (const work of EBU_DAVUD.works.mainWorks) {
      if (
        includesQuery(work.title, q) ||
        includesQuery(work.summaryTr, q) ||
        (work.altTitles ?? []).some((a) => includesQuery(a, q))
      ) {
        results.push({
          id: `ed-work-${work.title}`,
          category: 'ebu_davud',
          categoryLabel: 'Ebû Dâvûd Eseri',
          title: work.title,
          snippet: work.summaryTr,
          meta: 'Ebû Dâvûd’un Başlıca Eserleri',
          to: '/ebu-davud#eserleri',
        });
      }
    }

    for (const node of EBU_DAVUD.network.nodes) {
      if (
        includesQuery(node.label, q) ||
        includesQuery(node.nameAr ?? '', q) ||
        includesQuery(node.detailTr, q) ||
        includesQuery(node.roleTr, q)
      ) {
        results.push({
          id: `ed-node-${node.id}`,
          category: 'ebu_davud',
          categoryLabel: 'Âlim / Hoca-Talebe',
          title: node.label,
          arabicSnippet: node.nameAr,
          snippet: node.detailTr,
          meta: `${node.roleTr}${node.city ? ` · ${node.city}` : ''}`,
          to: '/ebu-davud#ag',
        });
      }
    }
  }

  // 7. es-Sunen TDV Encyclopedia
  if (allow('sunen')) {
    for (const principle of SUNEN.compilationAndPurpose.mekkeLetter.principles) {
      if (includesQuery(principle.titleTr, q) || includesQuery(principle.detailTr, q)) {
        results.push({
          id: `sunen-princ-${principle.order}`,
          category: 'sunen',
          categoryLabel: 'es-Sünen Metod',
          title: `Mekke Mektubu ${principle.order}. İlke: ${principle.titleTr}`,
          snippet: principle.detailTr,
          meta: 'Risâletü Ebî Dâvûd ilâ ehli Mekke',
          to: '/sunen#telif-metod',
        });
      }
    }

    for (const comm of SUNEN.commentaries) {
      if (
        includesQuery(comm.title, q) ||
        includesQuery(comm.author, q) ||
        includesQuery(comm.summaryTr, q)
      ) {
        results.push({
          id: `sunen-comm-${comm.id}`,
          category: 'sunen',
          categoryLabel: 'es-Sünen Şerhi',
          title: `${comm.title} — ${comm.author}`,
          snippet: comm.summaryTr,
          meta: comm.madhhabOrScope,
          to: '/sunen#serh-kitapligi',
        });
      }
    }

    for (const study of SUNEN.abridgementsAndStudies) {
      if (
        includesQuery(study.title, q) ||
        includesQuery(study.author, q) ||
        includesQuery(study.summaryTr, q)
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
    }
  }

  // 8. Hadis Usulu Glossary
  if (allow('glossary')) {
    for (const term of GLOSSARY_TERMS) {
      if (
        includesQuery(term.termTr, q) ||
        includesQuery(term.termAr, q) ||
        includesQuery(term.termFr, q) ||
        includesQuery(term.definitionTr, q) ||
        includesQuery(term.exampleInApp, q)
      ) {
        results.push({
          id: `glossary-${term.id}`,
          category: 'glossary',
          categoryLabel: 'Usûl Sözlüğü',
          title: term.termTr,
          arabicSnippet: term.termAr,
          snippet: term.definitionTr,
          meta: term.categoryLabelTr,
          to: `/sozluk?q=${encodeURIComponent(term.termTr)}`,
        });
      }
    }
  }

  return results.slice(0, limit);
}

import type { HadithItem, UserProgress } from '../types';
import type { HadithLanguagePack } from './hadithTranslations';
import { matchesArabicQuery } from './arabic';

export type HadithStatusFilter = 'all' | 'unread' | 'favorites' | 'memorized' | 'with_notes';

export interface HadithFilterOptions {
  babId: number | 'all';
  query: string;
  statusFilter: HadithStatusFilter;
  progress: UserProgress;
  hadithPack?: HadithLanguagePack | null;
  secondaryHadithPack?: HadithLanguagePack | null;
}

function matchesPackEntry(
  pack: HadithLanguagePack | null | undefined,
  hadithId: number,
  qLower: string,
  trimmed: string
): boolean {
  const entry = pack?.hadiths[hadithId];
  if (!entry) return false;
  if (
    entry.translation.toLowerCase().includes(qLower) ||
    matchesArabicQuery(entry.translation, trimmed)
  ) {
    return true;
  }
  if (
    entry.lessons.some(
      (l) => l.toLowerCase().includes(qLower) || matchesArabicQuery(l, trimmed)
    )
  ) {
    return true;
  }
  if (
    entry.contextStory &&
    (entry.contextStory.title.toLowerCase().includes(qLower) ||
      entry.contextStory.summary.toLowerCase().includes(qLower) ||
      matchesArabicQuery(entry.contextStory.title, trimmed) ||
      matchesArabicQuery(entry.contextStory.summary, trimmed))
  ) {
    return true;
  }
  return Object.values(entry.footnotes).some(
    (fnText) => fnText.toLowerCase().includes(qLower) || matchesArabicQuery(fnText, trimmed)
  );
}

export function filterHadiths(
  hadiths: HadithItem[],
  { babId, query, statusFilter, progress, hadithPack, secondaryHadithPack }: HadithFilterOptions
): HadithItem[] {
  const trimmed = query.trim();
  const qLower = trimmed.toLowerCase();

  return hadiths.filter((h) => {
    if (babId !== 'all' && h.babId !== babId) {
      return false;
    }

    if (statusFilter === 'unread' && progress.readHadiths.includes(h.id)) {
      return false;
    }
    if (statusFilter === 'favorites' && !progress.favoriteHadiths.includes(h.id)) {
      return false;
    }
    if (statusFilter === 'memorized' && !progress.memorizedHadiths.includes(h.id)) {
      return false;
    }
    if (statusFilter === 'with_notes' && !progress.notes[h.id]?.trim()) {
      return false;
    }

    if (!trimmed) return true;

    if (String(h.id).includes(trimmed) || String(h.pdfPage) === trimmed) {
      return true;
    }

    if (
      matchesPackEntry(hadithPack, h.id, qLower, trimmed) ||
      matchesPackEntry(secondaryHadithPack, h.id, qLower, trimmed)
    ) {
      return true;
    }

    if (
      h.translationTr.toLowerCase().includes(qLower) ||
      h.translationFr.toLowerCase().includes(qLower) ||
      h.lessonsTr.some((l) => l.toLowerCase().includes(qLower)) ||
      h.isnadChain.some(
        (n) => n.nameTr.toLowerCase().includes(qLower) || matchesArabicQuery(n.nameAr, trimmed)
      ) ||
      h.footnotes.some(
        (f) =>
          f.turkishSummary.toLowerCase().includes(qLower) ||
          matchesArabicQuery(f.arabicText, trimmed)
      ) ||
      h.words.some(
        (w) =>
          w.meaningTr.toLowerCase().includes(qLower) ||
          w.meaningFr.toLowerCase().includes(qLower) ||
          w.transliteration.toLowerCase().includes(qLower) ||
          matchesArabicQuery(w.arabic, trimmed) ||
          matchesArabicQuery(w.root, trimmed)
      )
    ) {
      return true;
    }

    return matchesArabicQuery(h.fullTextAr, trimmed);
  });
}

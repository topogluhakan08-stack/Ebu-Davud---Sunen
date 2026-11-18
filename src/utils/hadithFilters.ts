import type { HadithItem, UserProgress } from '../types';
import { matchesArabicQuery } from './arabic';

export type HadithStatusFilter = 'all' | 'unread' | 'favorites' | 'memorized' | 'with_notes';

export interface HadithFilterOptions {
  babId: number | 'all';
  query: string;
  statusFilter: HadithStatusFilter;
  progress: UserProgress;
}

export function filterHadiths(
  hadiths: HadithItem[],
  { babId, query, statusFilter, progress }: HadithFilterOptions
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

/**
 * Strips Arabic diacritics (tashkeel / hareke), tatweel, and normalizes hamza/alif
 * forms so learners can search Arabic text with or without harekes.
 */
const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL_REGEX = /\u0640/g;

export function stripTashkeel(input: string): string {
  return input.replace(TASHKEEL_REGEX, '').replace(TATWEEL_REGEX, '');
}

export function normalizeArabicSearch(input: string): string {
  return stripTashkeel(input)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .trim();
}

export function matchesArabicQuery(haystack: string, query: string): boolean {
  const cleanQuery = normalizeArabicSearch(query);
  if (!cleanQuery) return true;
  return normalizeArabicSearch(haystack).includes(cleanQuery);
}

export const ROOT_HIGHLIGHT_PALETTE = [
  {
    bg: 'rgba(29, 78, 137, 0.14)',
    border: '#1D4E89',
    text: '#1D4E89',
    darkBg: 'rgba(96, 165, 250, 0.16)',
    darkBorder: '#60A5FA',
    darkText: '#93C5FD',
  },
  {
    bg: 'rgba(15, 81, 50, 0.14)',
    border: '#0F5132',
    text: '#0F5132',
    darkBg: 'rgba(52, 211, 153, 0.15)',
    darkBorder: '#34D399',
    darkText: '#6EE7B7',
  },
  {
    bg: 'rgba(184, 134, 45, 0.16)',
    border: '#9A6B19',
    text: '#875C10',
    darkBg: 'rgba(251, 191, 36, 0.15)',
    darkBorder: '#FBBF24',
    darkText: '#FCD34D',
  },
  {
    bg: 'rgba(140, 59, 74, 0.14)',
    border: '#8C3B4A',
    text: '#8C3B4A',
    darkBg: 'rgba(244, 114, 182, 0.16)',
    darkBorder: '#F472B6',
    darkText: '#F9A8D4',
  },
  {
    bg: 'rgba(75, 63, 114, 0.14)',
    border: '#4B3F72',
    text: '#4B3F72',
    darkBg: 'rgba(167, 139, 250, 0.16)',
    darkBorder: '#A78BFA',
    darkText: '#C4B5FD',
  },
  {
    bg: 'rgba(31, 110, 108, 0.14)',
    border: '#1F6E6C',
    text: '#1F6E6C',
    darkBg: 'rgba(45, 212, 191, 0.15)',
    darkBorder: '#2DD4BF',
    darkText: '#5EEAD4',
  },
  {
    bg: 'rgba(162, 85, 42, 0.14)',
    border: '#9A4E22',
    text: '#8B4513',
    darkBg: 'rgba(251, 146, 60, 0.15)',
    darkBorder: '#FB923C',
    darkText: '#FDBA74',
  },
  {
    bg: 'rgba(54, 96, 40, 0.14)',
    border: '#366028',
    text: '#2E5422',
    darkBg: 'rgba(163, 230, 53, 0.15)',
    darkBorder: '#A3E635',
    darkText: '#BEF264',
  },
  {
    bg: 'rgba(122, 46, 114, 0.14)',
    border: '#7A2E72',
    text: '#7A2E72',
    darkBg: 'rgba(232, 121, 249, 0.15)',
    darkBorder: '#E879F9',
    darkText: '#F0ABFC',
  },
];

import type {
  FullWordLexiconEntry,
  HadithItem,
  IsnadNode,
  WordAnalysis,
} from '../types';

export interface MatnSegment<T extends { arabic: string }> {
  text: string;
  word?: T;
  isNeutralToken?: boolean;
}

const ARABIC_PUNCT_STRIP = /[«»"'()﴿﴾.,،؛:؟!ـ\s]/g;

const ARABIC_PROCLITICS = ['و', 'ف', 'ب', 'ل', 'ك'];

/**
 * Normalizes a single Arabic token into the exact lookup key used in fullWordLexicon.json.
 * Returns '' for whitespace or standalone punctuation / tatweel tokens like 'ـ'.
 */
export function getLexiconKey(token: string): string {
  return stripTashkeel(token).replace(ARABIC_PUNCT_STRIP, '').trim();
}

function isProcliticMatch(cleanToken: string, cleanWord: string): boolean {
  if (cleanWord.length < 2) return false;
  return ARABIC_PROCLITICS.some((prefix) => cleanToken === `${prefix}${cleanWord}`);
}

/**
 * Splits Arabic matn text by whitespace while attaching matching WordAnalysis items
 * (matching exact vocalized/unvocalized form or single-letter proclitic forms like وَمَحِكَ -> مَحِكَ).
 */
export function segmentMatnWithWords<T extends { arabic: string }>(
  matnAr: string,
  words: T[]
): MatnSegment<T>[] {
  if (!matnAr) return [];
  const tokens = matnAr.split(/(\s+)/);
  const used = new Set<number>();

  return tokens.map((token) => {
    if (!token || /^\s+$/.test(token)) {
      return { text: token };
    }
    const cleanToken = getLexiconKey(token);
    if (!cleanToken) return { text: token };

    const cleanWords = words.map((w) => getLexiconKey(w.arabic));

    // 1. Exact match among unused words
    let matchIdx = cleanWords.findIndex((cw, i) => !used.has(i) && cw === cleanToken);

    // 2. Proclitic-prefixed match among unused words (e.g. وَمَحِكَ -> مَحِكَ)
    if (matchIdx === -1) {
      matchIdx = cleanWords.findIndex(
        (cw, i) => !used.has(i) && isProcliticMatch(cleanToken, cw)
      );
    }

    // 3. Exact match among any words (for repeated occurrences)
    if (matchIdx === -1) {
      matchIdx = cleanWords.findIndex((cw) => cw === cleanToken);
    }

    // 4. Proclitic-prefixed match among any words
    if (matchIdx === -1) {
      matchIdx = cleanWords.findIndex((cw) => isProcliticMatch(cleanToken, cw));
    }

    if (matchIdx !== -1) {
      used.add(matchIdx);
      return { text: token, word: words[matchIdx] };
    }
    return { text: token };
  });
}

const SKIP_NARRATOR_LINK_KEYS = new Set([
  'بن',
  'ابن',
  'ابنا',
  'أبو',
  'وأبو',
  'أبي',
  'أباه',
  'أبيه',
  'أم',
  'عبد',
  'الله',
  'الرحمن',
  'الرحيم',
  'الرزاق',
  'الحميد',
  'الواحد',
  'الملك',
  'رسول',
  'نبي',
  'النبي',
  'ﷺ',
]);

export function findMatchingIsnadNodeId(
  tokenKey: string,
  isnadChain: IsnadNode[]
): string | undefined {
  if (!tokenKey || SKIP_NARRATOR_LINK_KEYS.has(tokenKey)) return undefined;
  const normKey = normalizeArabicSearch(tokenKey.replace(/^[وف]/, ''));
  if (normKey.length < 2) return undefined;

  for (const node of isnadChain) {
    if (node.layer === 'prophet' || node.layer === 'musannif') continue;
    const nodeTokens = node.nameAr
      .split(/\s+/)
      .map((t) => normalizeArabicSearch(getLexiconKey(t)))
      .filter((t) => t.length >= 2);
    if (nodeTokens.some((nt) => nt === normKey || nt === normalizeArabicSearch(tokenKey))) {
      return node.id;
    }
  }
  return undefined;
}

/**
 * Segments either `isnadAr` or `matnAr` into 100%-analyzed interactive WordAnalysis tokens.
 * - Guarantees every non-punctuation Arabic token resolves via `lexicon`.
 * - Assigns consistent intra-hadith `rootColorIndex` values so words sharing a root share the same highlight color.
 * - Marks particles/pronouns/connectors as `isNeutralToken` so the reading surface remains calm while 100% clickable.
 */
export function segmentArabicWithLexicon(
  arabicText: string,
  hadith: HadithItem,
  lexicon: Record<string, FullWordLexiconEntry>,
  kind: 'isnad' | 'matn'
): MatnSegment<WordAnalysis>[] {
  if (!arabicText) return [];

  // Build intra-hadith root -> palette index map across both isnadAr and matnAr
  const hadithRootColors = new Map<string, number>();
  let nextIdx = 0;

  const assignRootColor = (entry: FullWordLexiconEntry | undefined, fallbackIdx = 0): number => {
    if (!entry || entry.partOfSpeech === 'Harf' || entry.partOfSpeech === 'Zamir' || entry.root.startsWith('—')) {
      return fallbackIdx;
    }
    const cleanRoot = normalizeArabicSearch(entry.root).replace(/\s+/g, '');
    if (!cleanRoot) return fallbackIdx;
    if (!hadithRootColors.has(cleanRoot)) {
      hadithRootColors.set(cleanRoot, nextIdx % ROOT_HIGHLIGHT_PALETTE.length);
      nextIdx++;
    }
    return hadithRootColors.get(cleanRoot)!;
  };

  // Pre-seed colors from hadith's hand-annotated words and all matn+isnad tokens deterministically
  for (const w of hadith.words) {
    const cleanRoot = normalizeArabicSearch(w.root).replace(/\s+/g, '');
    if (cleanRoot && !hadithRootColors.has(cleanRoot)) {
      hadithRootColors.set(cleanRoot, nextIdx % ROOT_HIGHLIGHT_PALETTE.length);
      nextIdx++;
    }
  }
  for (const field of [hadith.matnAr, hadith.isnadAr]) {
    for (const tok of field.split(/\s+/)) {
      const k = getLexiconKey(tok);
      if (k && lexicon[k]) {
        assignRootColor(lexicon[k], lexicon[k].rootColorIndex);
      }
    }
  }

  // Lookup existing hand-annotated matn words by key so we preserve contextual nuances
  const handWordsByKey = new Map<string, WordAnalysis>();
  for (const hw of hadith.words) {
    const hk = getLexiconKey(hw.arabic);
    if (hk && !handWordsByKey.has(hk)) {
      handWordsByKey.set(hk, hw);
    }
  }

  const tokens = arabicText.split(/(\s+)/);
  return tokens.map((token, idx) => {
    if (!token || /^\s+$/.test(token)) {
      return { text: token };
    }
    const key = getLexiconKey(token);
    if (!key) {
      return { text: token };
    }

    const lex = lexicon[key];
    const handMatch =
      kind === 'matn'
        ? handWordsByKey.get(key) ||
          hadith.words.find((w) => isProcliticMatch(key, getLexiconKey(w.arabic)))
        : undefined;

    if (!lex && !handMatch) {
      return { text: token };
    }

    const baseLex = lex!;
    const rootColorIndex = baseLex
      ? assignRootColor(baseLex, baseLex.rootColorIndex)
      : (handMatch?.rootColorIndex ?? 0);

    const isNeutralToken =
      baseLex?.partOfSpeech === 'Harf' ||
      baseLex?.partOfSpeech === 'Zamir' ||
      (kind === 'isnad' && !baseLex?.isNarrator && (baseLex?.partOfSpeech === 'Fiil' || key === 'بن' || key === 'ابن' || key === 'أبي' || key === 'أبو' || key === 'أبيه' || key === 'أباه' || key === 'عبد'));

    const isnadNodeId =
      kind === 'isnad' || baseLex?.isNarrator
        ? findMatchingIsnadNodeId(key, hadith.isnadChain)
        : undefined;

    const mergedWord: WordAnalysis = {
      id: `${hadith.id}-${kind}-${idx}-${key}`,
      tokenKey: key,
      arabic: handMatch ? handMatch.arabic : baseLex.arabic,
      transliteration: handMatch ? handMatch.transliteration : baseLex.transliteration,
      meaningTr: handMatch ? handMatch.meaningTr : baseLex.meaningTr,
      meaningFr: handMatch ? handMatch.meaningFr : baseLex.meaningFr,
      root: handMatch ? handMatch.root : baseLex.root,
      rootColorIndex,
      partOfSpeech: handMatch ? handMatch.partOfSpeech : baseLex.partOfSpeech,
      morphology: handMatch ? handMatch.morphology : baseLex.morphology,
      derivatives:
        handMatch && handMatch.derivatives.length >= 5
          ? handMatch.derivatives
          : baseLex.derivatives,
      sarf: baseLex?.sarf ?? {
        root: handMatch?.root || '—',
        pattern: handMatch?.partOfSpeech || '—',
        tense: '—',
        number: '—',
        gender: '—',
      },
      irab: baseLex?.irab ?? {
        role: handMatch?.morphology || 'Bağlam içi öğe',
        caseState: '—',
        reason: handMatch?.morphology || '',
      },
      isNarrator: Boolean(baseLex?.isNarrator || isnadNodeId),
      narratorBioTr:
        baseLex?.narratorBioTr ||
        (isnadNodeId
          ? hadith.isnadChain.find((n) => n.id === isnadNodeId)?.note || "PDF'te bilgi yok"
          : undefined),
      isnadNodeId,
      needs_review: Boolean(handMatch?.needs_review || baseLex?.needs_review),
    };

    return {
      text: token,
      word: mergedWord,
      isNeutralToken,
    };
  });
}

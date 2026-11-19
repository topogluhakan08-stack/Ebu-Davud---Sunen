import type { WordLexiconPack } from './lexiconTypes';
import { buildGrammarPackForLang } from './grammarEngine';

/**
 * French word lexicon pack.
 * Note: All 736 fullWordLexicon entries, 125 hadith key words, and 1,423 Arabic derivatives
 * already have native French meanings (`meaningFr` and `derivatives[].fr`) in the primary JSON files.
 * This lazy pack supplies complete French Sarf & I'rab grammar localization.
 */
export const WORD_PACK_FR: WordLexiconPack = {
  meanings: {},
  derivatives: {},
  grammar: buildGrammarPackForLang('fr'),
};

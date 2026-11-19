import type { WordLexiconPack } from './lexiconTypes';
import { MEANINGS_NL } from './meanings.nl';
import { DERIVS_NL } from './derivs.nl';
import { buildGrammarPackForLang } from './grammarEngine';

export const WORD_PACK_NL: WordLexiconPack = {
  meanings: MEANINGS_NL,
  derivatives: DERIVS_NL,
  grammar: buildGrammarPackForLang('nl'),
};

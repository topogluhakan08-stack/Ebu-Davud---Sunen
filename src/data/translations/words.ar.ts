import type { WordLexiconPack } from './lexiconTypes';
import { MEANINGS_AR } from './meanings.ar';
import { DERIVS_AR } from './derivs.ar';
import { buildGrammarPackForLang } from './grammarEngine';

export const WORD_PACK_AR: WordLexiconPack = {
  meanings: MEANINGS_AR,
  derivatives: DERIVS_AR,
  grammar: buildGrammarPackForLang('ar'),
};

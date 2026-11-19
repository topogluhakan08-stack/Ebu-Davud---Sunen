import type { WordLexiconPack } from './lexiconTypes';
import { MEANINGS_DE } from './meanings.de';
import { DERIVS_DE } from './derivs.de';
import { buildGrammarPackForLang } from './grammarEngine';

export const WORD_PACK_DE: WordLexiconPack = {
  meanings: MEANINGS_DE,
  derivatives: DERIVS_DE,
  grammar: buildGrammarPackForLang('de'),
};

import type { GlossaryCategory } from '../glossaryData';
import type { IsnadNode } from '../../types';

export interface LocalizedGlossaryTerm {
  categoryLabel: string;
  term: string;
  definition: string;
  exampleInApp: string;
  relatedLabel: string;
}

export interface LocalizedIsnadUi {
  treeTitle: string;
  narratorNodeUnit: string;
  multiTarikBadge: string;
  cautionBadge: string;
  dirProphetToMusannif: string;
  dirMusannifToProphet: string;
  zoomInAria: string;
  zoomOutAria: string;
  resetZoomAria: string;
  collapseBtn: string;
  fullscreenBtn: string;
  tabakaSuffix: string;
  dragHint: string;
  closeBtn: string;
  closeNarratorAria: string;
  whoIsLabel: string;
  otherHadithsPrefix: string;
  otherHadithsUnit: string;
  noOtherHadiths: string;
  moreHadithsSuffix: string;
  fullArabicIsnadHeader: string;
  fullscreenDialogAria: string;
  exampleInAppLabel: string;
  noPdfBio: string;
  branchTarik: string;
  branchKol: string;
}

export interface GlossaryAndIsnadPack {
  categories: Record<GlossaryCategory, string>;
  layers: Record<IsnadNode['layer'], string>;
  terms: Record<string, LocalizedGlossaryTerm>;
  isnadUi: LocalizedIsnadUi;
  isnadNotes: Record<string, string>;
  narratorBios: Record<string, string>;
  cautionReasons: Record<string, string>;
  tdvKnownBios: Record<string, string>;
}

export interface GrammarReasonInput {
  rawReason?: string;
  partOfSpeech?: string;
  pattern?: string;
  tense?: string;
  role?: string;
  caseState?: string;
}

export interface GrammarPack {
  pos: Record<string, string>;
  tense: Record<string, string>;
  number: Record<string, string>;
  gender: Record<string, string>;
  caseState: Record<string, string>;
  patterns: Record<string, string>;
  roles: Record<string, string>;
  reasons: Record<string, string>;
  morphologies: Record<string, string>;
  translateFormula: (input: string) => string;
  localizeReason: (opts: GrammarReasonInput) => string;
}

export interface WordLexiconPack {
  /** Maps Turkish meaningTr -> localized meaning (for DE, NL, AR; FR uses native meaningFr) */
  meanings: Record<string, string>;
  /** Maps Arabic derivative d.ar -> localized gloss (for DE, NL, AR; FR uses native d.fr) */
  derivatives: Record<string, string>;
  /** Localized Sarf & I'rab grammar labels and explanations */
  grammar: GrammarPack;
}


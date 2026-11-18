export type LanguageCode = 'tr' | 'fr' | 'ar' | 'de' | 'nl';
export type SecondaryLanguageCode = LanguageCode | 'none';
export type LocalizedText = Partial<Record<LanguageCode, string>>;

export type TtsGenderPreference = 'male' | 'female' | 'auto';

export type BabIconType =
  | 'hilm'
  | 'vakar'
  | 'kazm'
  | 'ghadab_word'
  | 'teysir'
  | 'muaseret'
  | 'haya'
  | 'ahlak'
  | 'tevazu'
  | 'ovgu'
  | 'rifk';

export interface BabInfo {
  id: number;
  numberLabel: string;
  titleAr: string;
  titleTr: string;
  titleFr: string;
  subtitleTr: string;
  hadithStart: number;
  hadithEnd: number;
  hadithCount: number;
  pdfPages: string;
  colorHex: string;
  colorDarkHex: string;
  softBgHex: string;
  softBgDarkHex: string;
  iconType: BabIconType;
  keyArabicTerms: string[];
}

export interface WordDerivative {
  ar: string;
  tr: string;
  fr: string;
}

export interface SarfDetails {
  root: string;
  pattern?: string;
  tense?: string;
  number?: string;
  gender?: string;
}

export interface IrabDetails {
  role: string;
  caseState: string;
  reason: string;
}

export interface WordAnalysis {
  id: string;
  arabic: string;
  transliteration: string;
  meaningTr: string;
  meaningFr: string;
  root: string;
  rootColorIndex: number;
  partOfSpeech: string;
  morphology: string;
  derivatives: WordDerivative[];
  sarf?: SarfDetails;
  irab?: IrabDetails;
  isNarrator?: boolean;
  narratorBioTr?: string;
  isnadNodeId?: string;
  tokenKey?: string;
  needs_review?: boolean;
}

export interface FullWordLexiconEntry {
  arabic: string;
  transliteration: string;
  meaningTr: string;
  meaningFr: string;
  partOfSpeech: string;
  root: string;
  rootColorIndex: number;
  morphology: string;
  sarf: SarfDetails;
  irab: IrabDetails;
  derivatives: WordDerivative[];
  isNarrator?: boolean;
  narratorBioTr?: string;
  needs_review?: boolean;
}

export interface IsnadNode {
  id: string;
  nameAr: string;
  nameTr: string;
  layer: 'prophet' | 'sahabi' | 'tabiin' | 'etba' | 'musannif';
  note?: string;
  isExtraExplanation?: boolean;
}

export interface IsnadTreeNode {
  id: string;
  sourceChainNodeId: string;
  nameAr: string;
  nameTr: string;
  layer: IsnadNode['layer'];
  layerOrder: number;
  branchIndex: number;
  branchCount: number;
  branchLabel?: string;
  note?: string;
  bioTr: string;
  isUncertain?: boolean;
  uncertainReason?: string;
}

export interface IsnadTreeEdge {
  id: string;
  fromId: string;
  toId: string;
  tahammulAr: string;
  tahammulTr: string;
  dashed?: boolean;
  warningLabel?: string;
}

export interface IsnadTreeData {
  hadithId: number;
  nodes: IsnadTreeNode[];
  edges: IsnadTreeEdge[];
  hasBranching: boolean;
  hasCaution: boolean;
}

export interface FootnoteItem {
  id: string;
  marker: string;
  arabicText: string;
  turkishSummary: string;
  tahricSources?: string[];
  needs_review?: boolean;
}

export interface HadithItem {
  id: number;
  babId: number;
  pdfPage: number;
  isnadAr: string;
  matnAr: string;
  fullTextAr: string;
  translationTr: string;
  translationFr: string;
  words: WordAnalysis[];
  isnadChain: IsnadNode[];
  lessonsTr: string[];
  contextStory?: {
    titleTr: string;
    summaryTr: string;
    sceneType: BabIconType;
  };
  footnotes: FootnoteItem[];
  tahricBadges: string[];
  needs_review?: boolean;
}

export type TtsAudioSource = 'prebuilt' | 'device';

export interface AppSettings {
  language: LanguageCode;
  secondaryLanguage: SecondaryLanguageCode;
  theme: 'light' | 'dark';
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  alwaysShowRootColors: boolean;
  ttsRate: number;
  ttsPitch: number;
  ttsGenderPreference: TtsGenderPreference;
  ttsAudioSource: TtsAudioSource;
  selectedVoiceAr: string;
  selectedVoiceTr: string;
  selectedVoices?: Partial<Record<LanguageCode, string>>;
}

export interface UserProgress {
  readHadiths: number[];
  listenedHadiths: number[];
  memorizedHadiths: number[];
  favoriteHadiths: number[];
  notes: Record<number, string>;
}

export interface ScholarCity {
  id: string;
  order: number;
  nameTr: string;
  nameAr: string;
  region: string;
  yearText: string;
  roleTr: string;
  teachersOrEvents: string[];
  detailsTr: string;
  lat: number;
  lng: number;
  isExtraCoordinateNote?: boolean;
}

export interface TimelineEvent {
  id: string;
  yearLabel: string;
  titleTr: string;
  descriptionTr: string;
  cityId?: string;
  isExtraNote?: boolean;
}

export interface NetworkNode {
  id: string;
  label: string;
  nameAr?: string;
  category: 'center' | 'teacher' | 'fiqh_master' | 'student' | 'family';
  city?: string;
  roleTr: string;
  detailTr: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  relationTr: string;
}

export interface PraiseQuote {
  id: string;
  scholar: string;
  roleTr: string;
  textTr: string;
}

export interface ScholarQuoteItem {
  id: string;
  kind: 'saying' | 'four_hadiths';
  titleTr: string;
  textTr: string;
  textFr: string;
  textAr: string;
  isExtraArFr?: boolean;
}

export interface ScholarWork {
  order?: number;
  title: string;
  altTitles?: string[];
  summaryTr: string;
  manuscriptInfo?: string;
  editions?: string[];
  status: 'extant' | 'partial' | 'unknown';
}

export interface StudyAboutScholar {
  author: string;
  title: string;
  details: string;
}

export interface BibliographyEntry {
  id: number;
  citation: string;
}

export interface EbuDavudData {
  meta: {
    titleTr: string;
    titleAr: string;
    fullNameTr: string;
    subtitleTr: string;
    author: string;
    sourceNote: string;
    sourceUrl: string;
  };
  biography: {
    birthDeath: string;
    birthNote: string;
    sijistanNote: string;
    lineageNisbe: string;
    ancestry: string;
    familyWealth: string;
    earlyEducation: string;
    teachersCountNote: string;
    teachersListNote: string;
    sonAbdullah: string;
    brotherMuhammed: string;
    ahmedBinHanbelRelation: string;
    threeMastersEvaluation: {
      hadithMemorization: string;
      fiqhUnderstanding: string;
      ilalKnowledge: string;
    };
    tarsusAndLaterYears: string;
    basraSettlementAndZanj: string;
    deathAndBurial: string;
  };
  hadithScholarship: {
    summaryTr: string;
    numbersComparison: {
      totalWritten: number;
      selectedInSunen: number;
      memorizableDiscussed: number;
    };
    critiqueExamples: string[];
    praises: PraiseQuote[];
  };
  fiqhAndMethodology: {
    fiqhAffiliationTr: string;
    selefiyyeAndZuhdTr: string;
    emirMuvaffakStoryTr: string;
  };
  sayingsAndFourHadiths: ScholarQuoteItem[];
  cities: ScholarCity[];
  timeline: TimelineEvent[];
  network: {
    nodes: NetworkNode[];
    links: NetworkLink[];
  };
  works: {
    mainWorks: ScholarWork[];
    otherWorks: string[];
  };
  studiesAboutHim: StudyAboutScholar[];
  bibliography: BibliographyEntry[];
}

export interface SunenPrinciple {
  order: number;
  titleTr: string;
  detailTr: string;
}

export interface SunenRawi {
  id: string;
  nameTr: string;
  shortName: string;
  roleTr: string;
  detailTr: string;
  citation: string;
}

export interface SunenEditionStats {
  id: string;
  editionName: string;
  books: number;
  babs: number;
  hadiths: number;
  murselNote?: string;
  yearText: string;
  detailsTr: string;
}

export interface SunenPrintCity {
  id: string;
  order: number;
  cityTr: string;
  cityAr: string;
  countryTr: string;
  editions: string[];
  highlightTr: string;
  lat: number;
  lng: number;
  isExtraCoordinateNote: boolean;
}

export interface SunenCommentary {
  id: string;
  order: number;
  author: string;
  title: string;
  madhhabOrScope: string;
  summaryTr: string;
  editionsOrManuscripts: string[];
  subWorks?: string[];
}

export interface SunenIncompleteWork {
  id: string;
  order: number;
  author: string;
  title: string;
  extentOrNoteTr: string;
  manuscriptOrCitation: string;
}

export interface SunenRelatedStudy {
  id: string;
  order: number;
  kind: 'ihtisar' | 'hasiye_tashih' | 'tasnif_mustahrec' | 'tercume_arastirma';
  kindLabelTr: string;
  author: string;
  title: string;
  summaryTr: string;
  publicationInfo: string;
}

export interface SunenData {
  meta: {
    titleTr: string;
    titleAr: string;
    subtitleTr: string;
    author: string;
    sourceNote: string;
    sourceUrl: string;
  };
  compilationAndPurpose: {
    summaryTr: string;
    ahmedBinHanbelNote: string;
    hadithTotals: {
      totalWritten: number;
      selectedInSunen: number;
      murselApprox: number;
      elMerasilApprox: number;
    };
    mekkeLetter: {
      title: string;
      altTitle: string;
      editor: string;
      publication: string;
      introTr: string;
      principles: SunenPrinciple[];
    };
    specialNotes: {
      sufficeWithSunenTr: string;
      munkerAndSilenceRuleTr: string;
      ahkamScopeTr: string;
      elMerasilConnectionTr: string;
      kopruluManuscriptRef: string;
      colophonQuote: string;
    };
  };
  authenticityAndStructure: {
    tiersSummaryTr: string;
    tiers: {
      id: string;
      labelTr: string;
      detailTr: string;
      shareNote: string;
    }[];
    reyAndKiyasPreferenceTr: string;
    generalGradingAndRankTr: string;
    kutubSitteCitation: string;
    babNamingQuirkTr: string;
    rawis: SunenRawi[];
  };
  editionStats: SunenEditionStats[];
  printCities: SunenPrintCity[];
  commentaries: SunenCommentary[];
  incompleteWorks: SunenIncompleteWork[];
  abridgementsAndStudies: SunenRelatedStudy[];
  bibliography: BibliographyEntry[];
}


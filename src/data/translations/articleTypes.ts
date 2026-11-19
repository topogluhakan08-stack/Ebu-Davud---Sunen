import type {
  EbuDavudData,
  LanguageCode,
  NetworkNode,
  ScholarWork,
  SunenData,
} from '../../types';

export interface EbuDavudUiStrings {
  tdvHeaderBadge: string;
  kpiTeachers: string;
  kpiWritten: string;
  kpiSelected: string;
  kpiCities: string;
  jumpNavAria: string;
  sections: {
    bio: string;
    map: string;
    timeline: string;
    network: string;
    scholarship: string;
    fiqh: string;
    sayings: string;
    works: string;
    bibliography: string;
  };
  bioKicker: string;
  bioHeading: string;
  travelsHeading: string;
  familyBaghdadHeading: string;
  tarsusBasraHeading: string;
  threeMastersHeading: string;
  masterHadithLabel: string;
  masterFiqhLabel: string;
  masterIlalLabel: string;
  mapKicker: string;
  mapHeading: string;
  mapSubtitle: string;
  timelineKicker: string;
  timelineHeading: string;
  showOnMapBtn: string;
  networkKicker: string;
  networkHeading: string;
  networkSubtitle: string;
  scholarshipKicker: string;
  scholarshipHeading: string;
  ratioCardTitle: string;
  ratioWrittenLabel: string;
  ratioDiscussedLabel: string;
  ratioSelectedLabel: string;
  critiqueHeading: string;
  critiqueIntro: string;
  fiqhKicker: string;
  fiqhHeading: string;
  tabaqatCardTitle: string;
  selefiyyeCardTitle: string;
  emirCardTitle: string;
  sayingsKicker: string;
  sayingsHeading: string;
  sayingsExtraBadge: string;
  sayingsIntro: string;
  sayingsSubheading: string;
  fourHadithsSubheading: string;
  worksKicker: string;
  worksHeading: string;
  filterAll: string;
  filterExtant: string;
  filterPartial: string;
  filterUnknown: string;
  workSearchPlaceholder: string;
  workOrderPrefix: string;
  workAltTitlesLabel: string;
  workManuscriptLabel: string;
  workEditionsLabel: string;
  statusLabels: Record<ScholarWork['status'], string>;
  otherWorksHeading: string;
  otherWorksSubtitle: string;
  literatureKicker: string;
  literatureHeading: string;
  studiesSubheading: string;
  bibliographySubheading: string;
  tdvSourceLink: string;
  travelMap: {
    playJourney: string;
    pauseJourney: string;
    resetMap: string;
    coordBadge: string;
    mapAria: string;
    stopLabel: string;
    teachersEventsHeading: string;
  };
  networkGraph: {
    categories: Record<NetworkNode['category'], string>;
    filterAll: string;
    filterMasters: string;
    filterTeachers: string;
    filterFamily: string;
    filterStudents: string;
    svgAria: string;
    centerInitials: string;
    connectionsHeading: string;
  };
  searchLabels: {
    cityCategory: string;
    cityTitlePrefix: string;
    workCategory: string;
    workMeta: string;
    nodeCategory: string;
  };
}

export interface SunenUiStrings {
  tdvHeaderBadge: string;
  kutubSitteHeaderBadge: string;
  heroLeadExtra: string;
  kpiWritten: string;
  kpiSelected: string;
  kpiMursel: string;
  kpiRankValue: string;
  kpiRankSub: string;
  jumpNavAria: string;
  sections: {
    compilation: string;
    authenticity: string;
    stats: string;
    editionsMap: string;
    commentaries: string;
    bibliography: string;
  };
  compilationKicker: string;
  compilationHeading: string;
  altTitlePrefix: string;
  editorPrefix: string;
  principlePrefix: string;
  noteSufficeTitle: string;
  noteMunkerTitle: string;
  noteAhkamTitle: string;
  noteMerasilTitle: string;
  colophonLabel: string;
  authKicker: string;
  authHeading: string;
  tiersHeading: string;
  tierPrefix: string;
  reyCardTitle: string;
  kutubRankTag: string;
  hasenCardTitle: string;
  babQuirkCardTitle: string;
  rawisHeading: string;
  statsKicker: string;
  statsHeading: string;
  editionsMapKicker: string;
  editionsMapHeading: string;
  editionsMapSubtitle: string;
  commentariesKicker: string;
  commentariesHeading: string;
  commentariesSubtitle: string;
  bibKicker: string;
  bibHeading: string;
  tdvSourceLink: string;
  charts: {
    intro: string;
    funnelKicker: string;
    funnelHeading: string;
    funnelSubtitle: string;
    writtenRowLabel: string;
    totalAccumulationBar: string;
    selectedRowLabel: string;
    selectionRatioNote: string;
    murselRowLabel: string;
    murselRatioNote: string;
    manuscriptEvidenceLabel: string;
    manuscriptEvidenceBody: string;
    pieKicker: string;
    pieHeading: string;
    musnadSliceName: string;
    murselSliceName: string;
    tooltipCountLabel: string;
    barKicker: string;
    barHeading: string;
    metricGroupAria: string;
    metricHadiths: string;
    metricBabs: string;
    metricBooks: string;
    unitHadith: string;
    unitBab: string;
    unitBook: string;
    tableColEdition: string;
    tableColYear: string;
    tableColBooks: string;
    tableColBabs: string;
    tableColHadiths: string;
    shortLabels: Record<string, string>;
    narration: string;
  };
  editionsMap: {
    resetAllBtn: string;
    coordBadge: string;
    mapAria: string;
    centerLabel: string;
    editionsHeading: string;
    popupRecordsSuffix: string;
    stripEditionUnit: string;
    editionsSpeechPrefix: string;
  };
  shelf: {
    tablistAria: string;
    tabAll: string;
    tabCommentaries: string;
    tabIncomplete: string;
    tabStudies: string;
    searchPlaceholder: string;
    searchAria: string;
    emptyTitle: string;
    emptySubtitle: string;
    commentariesHeading: string;
    commentaryPrefix: string;
    manuscriptsEditionsLabel: string;
    subWorksLabel: string;
    incompleteHeading: string;
    incompleteBadge: string;
    sourceManuscriptLabel: string;
    studiesHeading: string;
  };
  searchLabels: {
    methodCategory: string;
    principleTitlePrefix: string;
    principleMeta: string;
    commentaryCategory: string;
  };
}

export interface ArticleTranslationPack {
  lang: Exclude<LanguageCode, 'tr'>;
  ebuDavud: EbuDavudData;
  sunen: SunenData;
  ebuDavudUi: EbuDavudUiStrings;
  sunenUi: SunenUiStrings;
}

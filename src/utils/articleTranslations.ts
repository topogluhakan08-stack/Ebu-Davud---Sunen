import type { EbuDavudData, LanguageCode, SunenData } from '../types';
import type {
  ArticleTranslationPack,
  EbuDavudUiStrings,
  SunenUiStrings,
} from '../data/translations/articleTypes';

export type { ArticleTranslationPack, EbuDavudUiStrings, SunenUiStrings };

export const TR_EBU_DAVUD_UI: EbuDavudUiStrings = {
  tdvHeaderBadge: 'TDV İslâm Ansiklopedisi · Cilt 10, s. 119–121',
  kpiTeachers: 'Hadis aldığı hoca (İbn Hacer)',
  kpiWritten: 'Hayatı boyunca yazdığı hadis',
  kpiSelected: 'es-Sünen’e seçtiği hadis',
  kpiCities: 'İlim yolculuğu şehri',
  jumpNavAria: 'Sayfa içi bölümler',
  sections: {
    bio: 'Hayatı & Kimliği',
    map: '14 Şehir Haritası',
    timeline: 'Zaman Çizelgesi',
    network: 'Hoca-Talebe Ağı',
    scholarship: 'Hadisçiliği & Övgüler',
    fiqh: 'Fıkıh, Selefiyye & Zühd',
    sayings: 'Sözleri & 4 Hadis',
    works: 'Eserleri (9 + 10)',
    bibliography: 'Çalışmalar & Bibliyografya',
  },
  bioKicker: 'Biyografi & İlim Tahsili',
  bioHeading: 'Kimliği, Ailesi ve Hayatı',
  travelsHeading: 'Seyahatleri ve Hocaları',
  familyBaghdadHeading: 'Ailesi ve Bağdat Meclisleri',
  tarsusBasraHeading: 'Tarsus, Basra’ya Yerleşme ve Vefatı',
  threeMastersHeading: 'Hocaları Hakkındaki Meşhur Değerlendirmesi',
  masterHadithLabel: 'Hadis Ezberi',
  masterFiqhLabel: 'Fıkıh Anlayışı',
  masterIlalLabel: 'İlel İlmi',
  mapKicker: 'İlim Coğrafyası · 14 Merkez',
  mapHeading: 'Ebû Dâvûd’un 14 Şehirlik Seyahat Haritası',
  mapSubtitle:
    '18 yaşında Bağdat ve Basra ile başlayan, Mekke’den Kûfe’ye, Şam ve Cezîre’den Horasan, Belh, Mısır, Tarsus ve Herat’a uzanan ilim duraklarını inceleyin veya yolculuğu adım adım oynatın.',
  timelineKicker: 'Kronoloji · 202–275 / 817–889',
  timelineHeading: 'Hayatının Zaman Çizelgesi',
  showOnMapBtn: 'Haritada Göster',
  networkKicker: 'İsnad ve İlim Zinciri',
  networkHeading: 'Hoca-Talebe İlim Ağı',
  networkSubtitle:
    'Düğümlere tıklayarak Ebû Dâvûd’un hocaları, ailesi ve başta Tirmizî, Lü’lüî, İbn Dâse, İbn Ebü’d-Dünyâ ve Hallâl olmak üzere talebeleri hakkındaki ayrıntıları görün.',
  scholarshipKicker: 'Cerh-Ta‘dîl & Rivayet Titizliği',
  scholarshipHeading: 'Hadisçiliği ve Âlimlerin Övgüleri',
  ratioCardTitle: 'Hadis Birikimi ve Seçme Oranı',
  ratioWrittenLabel: 'Hayatı boyunca yazdığı hadis',
  ratioDiscussedLabel: 'Rahatlıkla müzakere edebildiği hadis (Muhammed b. Mahled)',
  ratioSelectedLabel: 'es-Sünen’e seçtiği rivayet',
  critiqueHeading: 'Râvi Tenkidinde Tavizsiz Tutumu',
  critiqueIntro:
    'Yakını bile olsa hadis rivayetinde liyakatsiz bulduğu kimseleri eleştirmekten çekinmediğine dair Zehebî’nin Mîzânü’l-i‘tidâl’inde aktarılan örnekler:',
  fiqhKicker: 'Mezhep Nispeti, Metodoloji & İlim İzzeti',
  fiqhHeading: 'Fıkhî Kimliği, Selefiyye ve Zühdü',
  tabaqatCardTitle: 'Tabakat Eserlerindeki Yeri',
  selefiyyeCardTitle: 'Selefiyye Metodu ve Zühd',
  emirCardTitle: 'Emîr Muvaffak’a Verdiği Cevap',
  sayingsKicker: 'Hikmetli Sözleri & Hadis Özeti',
  sayingsHeading: 'Güzel Sözleri (3) ve Dört Hadis Seçkisi (4)',
  sayingsExtraBadge: 'Ek açıklama · Arapça orijinal metinler destek amaçlıdır',
  sayingsIntro:
    'Ebû Dâvûd, yazdığı hadisler içinden insanın dinî hayatını yaşayabilmesi için dört hadisi yeterli gördüğünü ifade etmiştir.',
  sayingsSubheading: 'Güzel Sözleri',
  fourHadithsSubheading: 'İnsan Hayatına Kâfi Gördüğü Dört Hadis',
  worksKicker: 'Telifatı · 9 Ana Eser & 10 Diğer Eser',
  worksHeading: 'Ebû Dâvûd’un Eserleri',
  filterAll: 'Tümü',
  filterExtant: 'Günümüze Ulaşanlar',
  filterPartial: 'Kısmen Ulaşanlar',
  filterUnknown: 'Durumu Bilinmeyen',
  workSearchPlaceholder: 'Eser, yazma veya neşir ara...',
  workOrderPrefix: 'Eser',
  workAltTitlesLabel: 'Diğer adları:',
  workManuscriptLabel: 'Yazma Nüsha:',
  workEditionsLabel: 'Baskılar / Neşirler',
  statusLabels: {
    extant: 'Günümüze ulaştı',
    partial: 'Kısmen ulaştı',
    unknown: 'Durumu bilinmiyor',
  },
  otherWorksHeading: 'Kaynaklarda Adı Geçen Diğer Eserleri',
  otherWorksSubtitle: 'Günümüze ulaşıp ulaşmadıkları bilinmeyen eserler',
  literatureKicker: 'Akademik Literatür',
  literatureHeading: 'Hakkındaki Çalışmalar ve Bibliyografya',
  studiesSubheading: 'Hakkında Yapılan Müstakil Çalışmalar',
  bibliographySubheading: 'Bibliyografya',
  tdvSourceLink: 'TDV İslâm Ansiklopedisi Kaynağı',
  travelMap: {
    playJourney: 'Yolculuğu Oynat (14 Şehir)',
    pauseJourney: 'Yolculuğu Duraklat',
    resetMap: 'Haritayı Sıfırla',
    coordBadge: 'Ek açıklama · Koordinatlar coğrafî konum içindir',
    mapAria: 'Ebû Dâvûd’un 14 şehirlik ilim yolculuğu haritası',
    stopLabel: 'Durak',
    teachersEventsHeading: 'Bu Şehirdeki Hocalar & Hadiseler',
  },
  networkGraph: {
    categories: {
      center: 'Merkez Müellif',
      fiqh_master: 'Üç Büyük Üstadı',
      teacher: 'Hadis Hocaları',
      family: 'Aile',
      student: 'Talebeleri',
    },
    filterAll: 'Tümü',
    filterMasters: 'Üç Büyük Üstadı',
    filterTeachers: 'Hocaları',
    filterFamily: 'Aile',
    filterStudents: 'Talebeleri',
    svgAria: 'Ebû Dâvûd Hoca-Talebe İlim Ağı',
    centerInitials: 'ED',
    connectionsHeading: 'Bağlantılar',
  },
  searchLabels: {
    cityCategory: 'Ebû Dâvûd',
    cityTitlePrefix: 'İlim Durağı',
    workCategory: 'Ebû Dâvûd Eseri',
    workMeta: 'Ebû Dâvûd’un Başlıca Eserleri',
    nodeCategory: 'Âlim / Hoca-Talebe',
  },
};

export const TR_SUNEN_UI: SunenUiStrings = {
  tdvHeaderBadge: 'TDV İslâm Ansiklopedisi · Cilt 38, s. 145–147',
  kutubSitteHeaderBadge: 'Kütüb-i Sitte · 3. Kitap',
  heroLeadExtra:
    'Ahmed b. Hanbel’e arz edilen, yalnız ahkâm hadislerini derleyen ve Risâle ilâ ehli Mekke ile usulü müellifi tarafından açıklanan temel hadis kaynağı.',
  kpiWritten: 'Hayatı boyunca yazdığı hadis',
  kpiSelected: 'es-Sünen’e seçilen ahkâm hadisi',
  kpiMursel: 'Mürsel rivayet (el-Merâsîl ile paralel)',
  kpiRankValue: '3. Sıra',
  kpiRankSub: 'Kütüb-i Sitte’deki yeri · 8 neşir merkezi',
  jumpNavAria: 'Sayfa içi bölümler',
  sections: {
    compilation: 'Telif & Risâle (6 İlke)',
    authenticity: 'Sıhhat, Bablar & Râviler',
    stats: 'Sayısal Veriler & Grafikler',
    editionsMap: 'Neşirler Haritası (8 Merkez)',
    commentaries: 'Şerh Kitaplığı (23 Eser)',
    bibliography: 'Bibliyografya (12)',
  },
  compilationKicker: 'Telif Usulü & Mekkelilere Mektup',
  compilationHeading: 'Telif Amacı ve Risâle ilâ ehli Mekke İlkeleri',
  altTitlePrefix: 'Diğer adıyla:',
  editorPrefix: 'nşr.',
  principlePrefix: 'İlke',
  noteSufficeTitle: 'Sünnet İçin Yeterlilik Beyanı',
  noteMunkerTitle: 'Münker / Zayıf İşareti ve Delil Kuralı',
  noteAhkamTitle: 'Yalnız Ahkâm Hadisleri & ~600 Mürsel',
  noteMerasilTitle: 'el-Merâsîl Tekmilesi',
  colophonLabel: 'Nüsha kaydı:',
  authKicker: 'İsnad Dereceleri, Tertip & Nakil Zinciri',
  authHeading: 'Sıhhat Yapısı, Bab Özellikleri ve Başlıca Râviler',
  tiersHeading: 'Rivayetlerin Beş Sıhhat Katmanı',
  tierPrefix: 'Katman',
  reyCardTitle: 'Re’y ve Kıyasa Tercih Ölçüsü',
  kutubRankTag: 'Kütüb-i Sitte Sırası',
  hasenCardTitle: 'Hasen Kabulü ve Üçüncü Sıra',
  babQuirkCardTitle: 'Özel Bab İsimlendirmeleri',
  rawisHeading: 'es-Sünen’in Üç Meşhur Râvisi',
  statsKicker: 'İstatistik & Karşılaştırma',
  statsHeading: 'Sayısal Veriler ve Neşir Karşılaştırmaları',
  editionsMapKicker: 'Basım Coğrafyası · 8 Şehir',
  editionsMapHeading: 'es-Sünen Baskı ve Neşir Merkezleri Haritası',
  editionsMapSubtitle:
    'Leknev’den Kahire ve Beyrut’a, Delhi, Haydarâbâd, Humus, Riyad ve Liechtenstein’a kadar es-Sünen’in önemli baskılarını şehir bazında inceleyin.',
  commentariesKicker: 'Şerh & İhtisar Literatürü',
  commentariesHeading: 'Şerhler (9), Yarım Kalan Çalışmalar (5) ve İhtisar / Araştırmalar (9)',
  commentariesSubtitle:
    'Hattâbî’nin ilk hadis şerhi Meʿâlimü’s-Sünen’den ʿAvnü’l-maʿbûd, Beẕlü’l-mechûd, el-Menhel, Münzirî, İbn Kayyim, Elbânî ve Türkçe çeviriye kadar 23 çalışmayı filtreleyin ve arayın.',
  bibKicker: 'Kaynakça',
  bibHeading: 'Bibliyografya',
  tdvSourceLink: 'TDV İslâm Ansiklopedisi Kaynağı',
  charts: {
    intro:
      '500.000 rivayetten 4.800 hadise süzülme oranını, mürsel dağılımını ve dört temel neşrin kitap–bab–hadis sayılarını etkileşimli grafiklerle karşılaştırın.',
    funnelKicker: 'Eleme ve Seçme Oranı · ~%0.96',
    funnelHeading: '500.000 Hadisten 4.800 Ahkâm Hadisine Süzülme',
    funnelSubtitle:
      'Senedinde kopukluk bulunmayan ve râvilerinin zayıflığında ittifak edilmeyen ahkâm rivayetlerinin seçimi.',
    writtenRowLabel: 'Hayatı boyunca yazdığı hadis',
    totalAccumulationBar: '%100 · Toplam Hadis Birikimi',
    selectedRowLabel: 'es-Sünen’e seçilen ahkâm hadisi',
    selectionRatioNote: '%0.96 seçki oranı (yaklaşık 104 rivayetten 1’i)',
    murselRowLabel: 'es-Sünen içindeki mürsel & el-Merâsîl ilişkisi',
    murselRatioNote: '4.800 içinde ~%12.5 mürsel · el-Merâsîl tekmilesi (~600)',
    manuscriptEvidenceLabel: 'Nüsha Delili:',
    manuscriptEvidenceBody:
      'Köprülü Ktp., nr. 363 ve bazı es-Sünen yazmalarının sonundaki “Hâzâ âhirü’l-merâsîl min Kitâbi’s-Sünen” kaydı, el-Merâsîl’in es-Sünen’in tamamlayıcısı (tekmilesi) olduğunu gösterir.',
    pieKicker: '4.800 İçinde Mürsel Dağılımı',
    pieHeading: 'Müsned ve Mürsel Rivayet Oranı',
    musnadSliceName: 'Müsned & Muttasıl Hadisler',
    murselSliceName: 'Mürsel Rivayetler (~600)',
    tooltipCountLabel: 'Sayı',
    barKicker: 'Neşirlere Göre Sayısal Farklar',
    barHeading: 'Dört Temel Neşirde Kitap, Bab ve Hadis Sayıları',
    metricGroupAria: 'Karşılaştırma ölçütü seçin',
    metricHadiths: 'Hadis Sayısı',
    metricBabs: 'Bab Sayısı',
    metricBooks: 'Kitap Sayısı',
    unitHadith: 'hadis',
    unitBab: 'bab',
    unitBook: 'kitap',
    tableColEdition: 'Neşir / Sayım',
    tableColYear: 'Tarih',
    tableColBooks: 'Kitap',
    tableColBabs: 'Bab',
    tableColHadiths: 'Hadis',
    shortLabels: {
      wensinck: 'Wensinck',
      abdulhamid: 'M. Abdülhamîd',
      avvame: 'M. Avvâme',
      liechtenstein: 'Liechtenstein',
    },
    narration:
      'Ebû Dâvûd hayatı boyunca yazdığı 500.000 hadisten 4.800 ahkâm hadisini es-Sünen’e seçmiştir; bu oran yaklaşık yüzde 0,96’dır. Seçilen 4.800 hadisten yaklaşık 600 tanesi mürseldir ve el-Merâsîl kitabındaki 600’e yakın rivayet es-Sünen’in tekmilesi niteliğindedir. Neşirlere göre Wensinck’te 40 kitap, 1.889 bab, 4.800 hadis; Muhammed Muhyiddin Abdülhamîd neşrinde 35 kitap, 1.871 bab, 5.274 hadis; Muhammed Avvâme neşrinde 36 kitap, 1.850 bab, 5.232 hadis; Cem‘iyyetü’l-merkezi’l-İslâmî Liechtenstein neşrinde ise 42 kitap, 1.885 bab ve 5.276 hadis yer alır.',
  },
  editionsMap: {
    resetAllBtn: 'Tüm 8 Merkezi Göster',
    coordBadge: 'Ek açıklama · Koordinatlar coğrafî konum içindir',
    mapAria: 'es-Sünen neşir ve baskı merkezleri haritası',
    centerLabel: 'Neşir Merkezi',
    editionsHeading: 'Baskılar ve Tahkikli Neşirler',
    popupRecordsSuffix: 'neşir kaydı',
    stripEditionUnit: 'baskı',
    editionsSpeechPrefix: 'Baskılar:',
  },
  shelf: {
    tablistAria: 'Şerh ve çalışma kategorileri',
    tabAll: 'Tümü',
    tabCommentaries: 'Başlıca Şerhler',
    tabIncomplete: 'Yarım Kalan & Zevâid',
    tabStudies: 'İhtisar, Tashih & Araştırma',
    searchPlaceholder: 'Şârih, eser, nüsha veya şehir ara...',
    searchAria: 'Şerh, yazma veya çalışma ara',
    emptyTitle: 'Aramanızla eşleşen eser bulunamadı',
    emptySubtitle: 'Filtreyi temizleyerek tüm eserleri görebilirsiniz.',
    commentariesHeading: 'Başlıca Şerhler',
    commentaryPrefix: 'Şerh',
    manuscriptsEditionsLabel: 'Yazma & Baskı Bilgileri',
    subWorksLabel: 'İlgili İhtisar / Tekmile / Fihrist',
    incompleteHeading: 'Yarım Kalmış Çalışmalar ve Zevâid Şerhi',
    incompleteBadge: 'Yarım Kalan / Zevâid',
    sourceManuscriptLabel: 'Kaynak / Nüsha:',
    studiesHeading: 'İhtisar, Tashih, Hâşiye, Müstahrec ve Modern Çalışmalar',
  },
  searchLabels: {
    methodCategory: 'es-Sünen Metod',
    principleTitlePrefix: 'Mekke Mektubu İlke',
    principleMeta: 'Risâletü Ebî Dâvûd ilâ ehli Mekke',
    commentaryCategory: 'es-Sünen Şerhi',
  },
};

const articleCache: Partial<Record<LanguageCode, ArticleTranslationPack | null>> = {
  tr: null,
};

export function getCachedArticlePack(lang: LanguageCode): ArticleTranslationPack | null {
  return articleCache[lang] ?? null;
}

export async function loadArticlePack(
  lang: LanguageCode
): Promise<ArticleTranslationPack | null> {
  if (lang === 'tr') return null;
  const existing = articleCache[lang];
  if (existing) return existing;

  let loaded: ArticleTranslationPack;
  switch (lang) {
    case 'fr':
      loaded = (await import('../data/translations/articles.fr')).ARTICLE_PACK_FR;
      break;
    case 'de':
      loaded = (await import('../data/translations/articles.de')).ARTICLE_PACK_DE;
      break;
    case 'nl':
      loaded = (await import('../data/translations/articles.nl')).ARTICLE_PACK_NL;
      break;
    case 'ar':
      loaded = (await import('../data/translations/articles.ar')).ARTICLE_PACK_AR;
      break;
    default:
      return null;
  }
  articleCache[lang] = loaded;
  return loaded;
}

export function getLocalizedEbuDavud(
  baseTr: EbuDavudData,
  lang: LanguageCode,
  pack: ArticleTranslationPack | null
): EbuDavudData | null {
  if (lang === 'tr') return baseTr;
  return pack?.ebuDavud ?? null;
}

export function getLocalizedSunen(
  baseTr: SunenData,
  lang: LanguageCode,
  pack: ArticleTranslationPack | null
): SunenData | null {
  if (lang === 'tr') return baseTr;
  return pack?.sunen ?? null;
}

export function getLocalizedEbuDavudUi(
  lang: LanguageCode,
  pack: ArticleTranslationPack | null
): EbuDavudUiStrings {
  if (lang === 'tr') return TR_EBU_DAVUD_UI;
  return pack?.ebuDavudUi ?? TR_EBU_DAVUD_UI;
}

export function getLocalizedSunenUi(
  lang: LanguageCode,
  pack: ArticleTranslationPack | null
): SunenUiStrings {
  if (lang === 'tr') return TR_SUNEN_UI;
  return pack?.sunenUi ?? TR_SUNEN_UI;
}

export function formatLocaleNumber(n: number, lang: LanguageCode): string {
  const localeMap: Record<LanguageCode, string> = {
    tr: 'tr-TR',
    fr: 'fr-FR',
    de: 'de-DE',
    nl: 'nl-NL',
    ar: 'ar-EG',
  };
  return n.toLocaleString(localeMap[lang]);
}

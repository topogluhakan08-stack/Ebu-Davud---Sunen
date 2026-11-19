import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Compass,
  ExternalLink,
  GitBranch,
  GraduationCap,
  History,
  Library,
  MapPin,
  Quote,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';
import rawEbuDavudData from '../data/ebu-davud.json';
import type { EbuDavudData, ScholarWork } from '../types';
import { useApp } from '../context/AppContext';
import { ManuscriptCard, EditorialDivider } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { SecondaryArticleBlock } from '../components/ui/SecondaryArticleBlock';
import { SpeechControls } from '../components/tts/SpeechControls';
import { TravelMap } from '../components/ebu-davud/TravelMap';
import { TeacherStudentGraph } from '../components/ebu-davud/TeacherStudentGraph';
import {
  formatLocaleNumber,
  getLocalizedEbuDavud,
  getLocalizedEbuDavudUi,
} from '../utils/articleTranslations';
import { matchesArabicQuery } from '../utils/arabic';

const RAW_TR = rawEbuDavudData as EbuDavudData;

type WorkStatusFilter = 'all' | ScholarWork['status'];

const STATUS_DOT_COLOR: Record<ScholarWork['status'], string> = {
  extant: 'var(--accent-emerald)',
  partial: 'var(--accent-gold)',
  unknown: 'var(--text-muted)',
};

const FULL_ARABIC_NAME =
  'أَبُو دَاوُدَ سُلَيْمَانُ بْنُ الْأَشْعَثِ بْنِ إِسْحَاقَ السِّجِسْتَانِيُّ الْأَزْدِيُّ';

export const EbuDavudPage: React.FC = () => {
  const { settings, t, articlePack, secondaryArticlePack } = useApp();
  const lang = settings.language;
  const isAr = lang === 'ar';
  const secondaryLang = settings.secondaryLanguage;

  const [activeCityId, setActiveCityId] = useState<string>('sicistan');
  const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatusFilter>('all');
  const [workSearch, setWorkSearch] = useState('');

  const data = getLocalizedEbuDavud(RAW_TR, lang, articlePack);
  const ui = getLocalizedEbuDavudUi(lang, articlePack);
  const secondaryData =
    secondaryLang !== 'none' && secondaryLang !== lang
      ? getLocalizedEbuDavud(RAW_TR, secondaryLang, secondaryArticlePack)
      : null;

  const filteredMainWorks = useMemo(() => {
    if (!data) return [];
    const qRaw = workSearch.trim();
    const q = qRaw.toLocaleLowerCase(lang === 'tr' ? 'tr' : undefined);
    const hasArabicQuery = /[\u0600-\u06FF]/.test(qRaw);
    return data.works.mainWorks.filter((work) => {
      const matchesStatus = workStatusFilter === 'all' || work.status === workStatusFilter;
      if (!matchesStatus) return false;
      if (!qRaw) return true;
      const haystack = [
        work.title,
        ...(work.altTitles ?? []),
        work.summaryTr,
        work.manuscriptInfo ?? '',
        ...(work.editions ?? []),
      ].join(' ');
      if (hasArabicQuery && matchesArabicQuery(haystack, qRaw)) return true;
      return haystack.toLocaleLowerCase(lang === 'tr' ? 'tr' : undefined).includes(q);
    });
  }, [data, workStatusFilter, workSearch, lang]);

  const sayings = useMemo(
    () => (data ? data.sayingsAndFourHadiths.filter((q) => q.kind === 'saying') : []),
    [data]
  );
  const fourHadiths = useMemo(
    () => (data ? data.sayingsAndFourHadiths.filter((q) => q.kind === 'four_hadiths') : []),
    [data]
  );

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-8 sm:p-12 text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.ebuDavudPage.kicker}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">{t.common.loading}</p>
        </ManuscriptCard>
      </div>
    );
  }

  const sectionLinks = [
    { id: 'kimlik-hayat', label: ui.sections.bio },
    { id: 'harita', label: ui.sections.map },
    { id: 'zaman-cizelgesi', label: ui.sections.timeline },
    { id: 'ag', label: ui.sections.network },
    { id: 'hadisciligi', label: ui.sections.scholarship },
    { id: 'fikih-zuhd', label: ui.sections.fiqh },
    { id: 'sozleri', label: ui.sections.sayings },
    { id: 'eserleri', label: ui.sections.works },
    { id: 'kaynakca', label: ui.sections.bibliography },
  ];

  const heroNarration = `${data.meta.fullNameTr}. ${data.meta.subtitleTr} ${data.biography.birthNote} ${data.biography.deathAndBurial}`;

  const bioNarration = [
    data.biography.birthNote,
    data.biography.sijistanNote,
    data.biography.lineageNisbe,
    data.biography.ancestry,
    data.biography.familyWealth,
    data.biography.earlyEducation,
    data.biography.teachersCountNote,
    data.biography.teachersListNote,
    data.biography.sonAbdullah,
    data.biography.brotherMuhammed,
    data.biography.ahmedBinHanbelRelation,
    data.biography.tarsusAndLaterYears,
    data.biography.basraSettlementAndZanj,
    data.biography.deathAndBurial,
  ].join(' ');

  const timelineNarration = data.timeline
    .map((item) => `${item.yearLabel}: ${item.titleTr}. ${item.descriptionTr}`)
    .join(' ');

  const hadithNarration = [
    data.hadithScholarship.summaryTr,
    ...data.hadithScholarship.critiqueExamples,
    ...data.hadithScholarship.praises.map((p) => `${p.scholar}: ${p.textTr}`),
  ].join(' ');

  const fiqhNarration = [
    data.fiqhAndMethodology.fiqhAffiliationTr,
    data.fiqhAndMethodology.selefiyyeAndZuhdTr,
    data.fiqhAndMethodology.emirMuvaffakStoryTr,
  ].join(' ');

  const worksNarration = data.works.mainWorks
    .map((w) => `${w.order}. ${w.title}. ${w.summaryTr}`)
    .join(' ');

  const studiesNarration = data.studiesAboutHim
    .map((s) => `${s.author}: ${s.title}. ${s.details}`)
    .join(' ');

  const handleSelectCityFromTimeline = (cityId?: string) => {
    if (!cityId) return;
    setActiveCityId(cityId);
    const el = document.getElementById('harita');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getSecondaryQuote = (id: string) =>
    secondaryData?.sayingsAndFourHadiths.find((q) => q.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Calligraphy Hero */}
      <section aria-labelledby="ebu-davud-hero-title">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)] font-tabular">
              <span>
                {ui.tdvHeaderBadge} · {data.meta.author}
              </span>
              <span>{data.biography.birthDeath}</span>
            </div>

            <div className="space-y-3">
              {isAr ? (
                <>
                  <h1
                    id="ebu-davud-hero-title"
                    className="font-arabic text-4xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
                    dir="rtl"
                  >
                    {data.meta.titleAr}
                  </h1>
                  <p className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                    {data.meta.fullNameTr}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="font-arabic text-3xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
                    dir="rtl"
                  >
                    {data.meta.titleAr}
                  </p>
                  <p
                    className="font-arabic-inline text-base sm:text-xl text-[var(--text-secondary)]"
                    dir="rtl"
                  >
                    {FULL_ARABIC_NAME}
                  </p>
                  <h1
                    id="ebu-davud-hero-title"
                    className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
                  >
                    {data.meta.titleTr}
                  </h1>
                  <p className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                    {data.meta.fullNameTr}
                  </p>
                </>
              )}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                {data.meta.subtitleTr}
              </p>
              {secondaryData && (
                <SecondaryArticleBlock
                  secondaryLang={secondaryLang}
                  primaryLang={lang}
                  paragraphs={[secondaryData.meta.fullNameTr, secondaryData.meta.subtitleTr]}
                />
              )}
            </div>

            {/* 4-Metric KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                  ~{formatLocaleNumber(300, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiTeachers}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-emerald)]">
                  {formatLocaleNumber(500000, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiWritten}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-gold)]">
                  {formatLocaleNumber(4800, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiSelected}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--text-primary)]">
                  {formatLocaleNumber(14, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiCities}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id="ebu-davud-hero"
                arabicText={isAr ? heroNarration : FULL_ARABIC_NAME}
                primaryText={isAr ? undefined : heroNarration}
              />
            </div>
          </div>
        </ManuscriptCard>
      </section>

      {/* Section Jump Bar */}
      <nav
        aria-label={ui.jumpNavAria}
        className="flex items-center md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible pb-2 border-b border-[var(--border-hairline)]"
      >
        {sectionLinks.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-hairline)] whitespace-nowrap shrink-0 inline-flex items-center transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* 2. Kimliği, Ailesi & Hayatı */}
      <section id="kimlik-hayat" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{ui.bioKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.bioHeading}
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-bio"
            compact
            arabicText={isAr ? bioNarration : undefined}
            primaryText={isAr ? undefined : bioNarration}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <p className="text-[var(--text-primary)] font-medium">{data.biography.birthNote}</p>
              <p>{data.biography.sijistanNote}</p>
              <p>{data.biography.lineageNisbe}</p>
              <p>{data.biography.ancestry}</p>
              <p>{data.biography.familyWealth}</p>
            </div>

            <EditorialDivider />

            <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.travelsHeading}</h3>
              <p>{data.biography.earlyEducation}</p>
              <p>{data.biography.teachersCountNote}</p>
              <p>{data.biography.teachersListNote}</p>
            </div>

            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[
                  secondaryData.biography.birthNote,
                  secondaryData.biography.sijistanNote,
                  secondaryData.biography.lineageNisbe,
                  secondaryData.biography.ancestry,
                  secondaryData.biography.familyWealth,
                  secondaryData.biography.earlyEducation,
                  secondaryData.biography.teachersCountNote,
                  secondaryData.biography.teachersListNote,
                ]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard className="lg:col-span-5 p-6 sm:p-8 space-y-5">
            <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {ui.familyBaghdadHeading}
              </h3>
              <p>{data.biography.sonAbdullah}</p>
              <p>{data.biography.brotherMuhammed}</p>
              <p>{data.biography.ahmedBinHanbelRelation}</p>
            </div>

            <EditorialDivider />

            <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {ui.tarsusBasraHeading}
              </h3>
              <p>{data.biography.tarsusAndLaterYears}</p>
              <p>{data.biography.basraSettlementAndZanj}</p>
              <p className="font-medium text-[var(--text-primary)]">
                {data.biography.deathAndBurial}
              </p>
            </div>

            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[
                  secondaryData.biography.sonAbdullah,
                  secondaryData.biography.brotherMuhammed,
                  secondaryData.biography.ahmedBinHanbelRelation,
                  secondaryData.biography.tarsusAndLaterYears,
                  secondaryData.biography.basraSettlementAndZanj,
                  secondaryData.biography.deathAndBurial,
                ]}
              />
            )}
          </ManuscriptCard>
        </div>

        {/* Üç Büyük Üstadı Karşılaştırma Kartları */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.threeMastersHeading}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ManuscriptCard accentColor="var(--accent-navy)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                {ui.masterHadithLabel}
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.hadithMemorization}
              </p>
            </ManuscriptCard>
            <ManuscriptCard accentColor="var(--accent-emerald)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-emerald)]">
                {ui.masterFiqhLabel}
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.fiqhUnderstanding}
              </p>
            </ManuscriptCard>
            <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-gold)]">
                {ui.masterIlalLabel}
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.ilalKnowledge}
              </p>
            </ManuscriptCard>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 3. 14 Şehirlik Seyahat Haritası */}
      <section id="harita" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>{ui.mapKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {ui.mapHeading}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{ui.mapSubtitle}</p>
        </div>

        <TravelMap
          cities={data.cities}
          activeCityId={activeCityId}
          onSelectCity={setActiveCityId}
        />
      </section>

      <EditorialDivider />

      {/* 4. Zaman Çizelgesi */}
      <section id="zaman-cizelgesi" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <History className="w-4 h-4" aria-hidden="true" />
              <span>{ui.timelineKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.timelineHeading}
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-timeline"
            compact
            arabicText={isAr ? timelineNarration : undefined}
            primaryText={isAr ? undefined : timelineNarration}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.timeline.map((event, idx) => (
            <ManuscriptCard
              key={event.id}
              accentColor={event.cityId === activeCityId ? 'var(--accent-emerald)' : undefined}
              className="p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-tabular text-[var(--accent-gold)]">
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  <span>{event.yearLabel}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{event.titleTr}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {event.descriptionTr}
                </p>
              </div>

              {event.cityId && (
                <button
                  type="button"
                  onClick={() => handleSelectCityFromTimeline(event.cityId)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5 self-start transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-emerald)]" aria-hidden="true" />
                  <span>{ui.showOnMapBtn}</span>
                </button>
              )}
            </ManuscriptCard>
          ))}
        </div>
      </section>

      <EditorialDivider />

      {/* 5. Hoca-Talebe İlim Ağı */}
      <section id="ag" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <GitBranch className="w-4 h-4" aria-hidden="true" />
            <span>{ui.networkKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {ui.networkHeading}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{ui.networkSubtitle}</p>
        </div>

        <TeacherStudentGraph nodes={data.network.nodes} links={data.network.links} />
      </section>

      <EditorialDivider />

      {/* 6. Hadisçiliği ve Âlimlerin Övgüleri */}
      <section id="hadisciligi" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              <span>{ui.scholarshipKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.scholarshipHeading}
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-hadith"
            compact
            arabicText={isAr ? hadithNarration : undefined}
            primaryText={isAr ? undefined : hadithNarration}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {data.hadithScholarship.summaryTr}
            </p>

            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secondaryData.hadithScholarship.summaryTr]}
              />
            )}

            {/* Sayısal Karşılaştırma Çubuğu */}
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 space-y-3">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                {ui.ratioCardTitle}
              </p>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>{ui.ratioWrittenLabel}</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {formatLocaleNumber(500000, lang)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full w-full bg-[var(--accent-navy)] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>{ui.ratioDiscussedLabel}</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {formatLocaleNumber(100000, lang)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full w-[20%] bg-[var(--accent-gold)] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>{ui.ratioSelectedLabel}</span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {formatLocaleNumber(4800, lang)}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-emerald)] rounded-full"
                      style={{ width: '2.5%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.critiqueHeading}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{ui.critiqueIntro}</p>
            <ul className="space-y-3">
              {data.hadithScholarship.critiqueExamples.map((example, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] leading-relaxed"
                >
                  {example}
                </li>
              ))}
            </ul>
            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={secondaryData.hadithScholarship.critiqueExamples}
              />
            )}
          </ManuscriptCard>
        </div>

        {/* 8 Scholar Praise Quotes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.hadithScholarship.praises.map((praise) => (
            <ManuscriptCard key={praise.id} className="p-5 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[var(--accent-gold)]">{praise.roleTr}</p>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{praise.scholar}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {praise.textTr}
                </p>
              </div>
            </ManuscriptCard>
          ))}
        </div>
      </section>

      <EditorialDivider />

      {/* 7. Fıkhî Kimliği, Selefiyye ve Zühdü */}
      <section id="fikih-zuhd" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              <Scale className="w-4 h-4" aria-hidden="true" />
              <span>{ui.fiqhKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.fiqhHeading}
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-fiqh"
            compact
            arabicText={isAr ? fiqhNarration : undefined}
            primaryText={isAr ? undefined : fiqhNarration}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.tabaqatCardTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.fiqhAffiliationTr}
            </p>
            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secondaryData.fiqhAndMethodology.fiqhAffiliationTr]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-emerald)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {ui.selefiyyeCardTitle}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.selefiyyeAndZuhdTr}
            </p>
            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secondaryData.fiqhAndMethodology.selefiyyeAndZuhdTr]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.emirCardTitle}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.emirMuvaffakStoryTr}
            </p>
            {secondaryData && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secondaryData.fiqhAndMethodology.emirMuvaffakStoryTr]}
              />
            )}
          </ManuscriptCard>
        </div>
      </section>

      <EditorialDivider />

      {/* 8. Güzel Sözleri ve Dört Hadis Seçkisi */}
      <section id="sozleri" className="scroll-mt-24 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
            <Quote className="w-4 h-4" aria-hidden="true" />
            <span>{ui.sayingsKicker}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.sayingsHeading}
            </h2>
            <StatusBadge variant="extra" label={ui.sayingsExtraBadge} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{ui.sayingsIntro}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.sayingsSubheading}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sayings.map((item) => {
                const secQuote = getSecondaryQuote(item.id);
                return (
                  <ManuscriptCard
                    key={item.id}
                    accentColor="var(--accent-gold)"
                    className="p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-[var(--accent-gold)] block">
                        {item.titleTr}
                      </span>
                      <p
                        className="font-arabic-inline text-xl leading-loose text-[var(--accent-navy)] dark:text-[var(--accent-gold)]"
                        dir="rtl"
                      >
                        {item.textAr}
                      </p>
                      {(!isAr || item.textTr !== item.textAr) && (
                        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                          “{item.textTr}”
                        </p>
                      )}
                      {secQuote && (
                        <SecondaryArticleBlock
                          secondaryLang={secondaryLang}
                          primaryLang={lang}
                          paragraphs={[secondaryLang === 'ar' ? secQuote.textAr : secQuote.textTr]}
                        />
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border-hairline)]">
                      <SpeechControls
                        id={item.id}
                        compact
                        arabicText={item.textAr}
                        primaryText={isAr ? undefined : item.textTr}
                      />
                    </div>
                  </ManuscriptCard>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {ui.fourHadithsSubheading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fourHadiths.map((item) => {
                const secQuote = getSecondaryQuote(item.id);
                return (
                  <ManuscriptCard
                    key={item.id}
                    accentColor="var(--accent-emerald)"
                    className="p-5 sm:p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-[var(--accent-emerald)] block">
                        {item.titleTr}
                      </span>
                      <p
                        className="font-arabic-inline text-2xl leading-loose text-[var(--accent-navy)] dark:text-[var(--accent-gold)]"
                        dir="rtl"
                      >
                        {item.textAr}
                      </p>
                      {(!isAr || item.textTr !== item.textAr) && (
                        <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed">
                          {item.textTr}
                        </p>
                      )}
                      {secQuote && (
                        <SecondaryArticleBlock
                          secondaryLang={secondaryLang}
                          primaryLang={lang}
                          paragraphs={[secondaryLang === 'ar' ? secQuote.textAr : secQuote.textTr]}
                        />
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border-hairline)]">
                      <SpeechControls
                        id={item.id}
                        compact
                        arabicText={item.textAr}
                        primaryText={isAr ? undefined : item.textTr}
                      />
                    </div>
                  </ManuscriptCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 9. Eserleri (9 Ana + 10 Diğer) */}
      <section id="eserleri" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              <Library className="w-4 h-4" aria-hidden="true" />
              <span>{ui.worksKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.worksHeading}
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-works"
            compact
            arabicText={isAr ? worksNarration : undefined}
            primaryText={isAr ? undefined : worksNarration}
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
            {(
              [
                { id: 'all', label: `${ui.filterAll} (${data.works.mainWorks.length})` },
                { id: 'extant', label: ui.filterExtant },
                { id: 'partial', label: ui.filterPartial },
                { id: 'unknown', label: ui.filterUnknown },
              ] as { id: WorkStatusFilter; label: string }[]
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setWorkStatusFilter(btn.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  workStatusFilter === btn.id
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <label className="relative flex items-center min-w-[240px] flex-1 sm:flex-initial">
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute start-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={workSearch}
              onChange={(e) => setWorkSearch(e.target.value)}
              placeholder={ui.workSearchPlaceholder}
              className="w-full min-h-[40px] ps-9 pe-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </label>
        </div>

        {/* 9 Main Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMainWorks.map((work) => {
            const dotColor = STATUS_DOT_COLOR[work.status];
            const statusLabel = ui.statusLabels[work.status];
            return (
              <ManuscriptCard
                key={work.order}
                accentColor={dotColor}
                className="p-5 sm:p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-tabular font-semibold text-[var(--text-secondary)]">
                      {ui.workOrderPrefix} {work.order}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: dotColor }}
                        aria-hidden="true"
                      />
                      <span>{statusLabel}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{work.title}</h3>
                    {work.altTitles && work.altTitles.length > 0 && (
                      <p className="text-xs italic text-[var(--text-secondary)] mt-1">
                        {ui.workAltTitlesLabel} {work.altTitles.join(' · ')}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {work.summaryTr}
                  </p>

                  {work.manuscriptInfo && (
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] leading-relaxed">
                      <span className="font-semibold">{ui.workManuscriptLabel} </span>
                      {work.manuscriptInfo}
                    </div>
                  )}

                  {work.editions && work.editions.length > 0 && (
                    <div className="text-xs text-[var(--text-secondary)] space-y-1">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {ui.workEditionsLabel}
                      </p>
                      <ul className="space-y-1">
                        {work.editions.map((ed, idx) => (
                          <li key={idx}>· {ed}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ManuscriptCard>
            );
          })}
        </div>

        {/* 10 Other Works */}
        <ManuscriptCard className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {ui.otherWorksHeading} ({data.works.otherWorks.length})
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">{ui.otherWorksSubtitle}</span>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.works.otherWorks.map((title, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] flex items-center gap-2.5"
              >
                <span className="font-tabular text-xs font-semibold text-[var(--accent-gold)]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{title}</span>
              </li>
            ))}
          </ol>
        </ManuscriptCard>
      </section>

      <EditorialDivider />

      {/* 10. Hakkındaki Çalışmalar & Bibliyografya */}
      <section id="kaynakca" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{ui.literatureKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.literatureHeading} ({data.studiesAboutHim.length} + {data.bibliography.length})
            </h2>
          </div>
          <SpeechControls
            id="ebu-davud-bib"
            compact
            arabicText={isAr ? studiesNarration : undefined}
            primaryText={isAr ? undefined : studiesNarration}
          />
        </div>

        <ManuscriptCard className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.studiesSubheading}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.studiesAboutHim.map((study, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1.5"
              >
                <p className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                  {study.author}
                </p>
                <p className="text-sm font-bold text-[var(--text-primary)]">{study.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{study.details}</p>
              </div>
            ))}
          </div>
        </ManuscriptCard>

        <ManuscriptCard className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {ui.bibliographySubheading}
          </h3>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-[var(--text-secondary)]">
            {data.bibliography.map((entry) => (
              <li key={entry.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="font-tabular text-xs font-semibold text-[var(--accent-gold)] mt-1 shrink-0">
                  {String(entry.id).padStart(2, '0')}.
                </span>
                <span>{entry.citation}</span>
              </li>
            ))}
          </ol>

          <EditorialDivider />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
            <span>{data.meta.sourceNote}</span>
            <a
              href={data.meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7] hover:underline"
            >
              <span>{ui.tdvSourceLink}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </ManuscriptCard>
      </section>

      <p className="text-xs text-center text-[var(--text-muted)]">{t.disclaimer}</p>
    </div>
  );
};

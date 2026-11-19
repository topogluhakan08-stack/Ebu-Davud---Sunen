import React from 'react';
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  Globe2,
  Library,
  Scale,
  ScrollText,
  Users,
} from 'lucide-react';
import rawSunenData from '../data/sunen.json';
import type { SunenData } from '../types';
import { useApp } from '../context/AppContext';
import { EditorialDivider, ManuscriptCard } from '../components/ui/Card';
import { SecondaryArticleBlock } from '../components/ui/SecondaryArticleBlock';
import { SpeechControls } from '../components/tts/SpeechControls';
import { SunenCharts } from '../components/sunen/SunenCharts';
import { EditionsMap } from '../components/sunen/EditionsMap';
import { CommentaryShelf } from '../components/sunen/CommentaryShelf';
import {
  formatLocaleNumber,
  getLocalizedSunen,
  getLocalizedSunenUi,
} from '../utils/articleTranslations';

const RAW_TR = rawSunenData as SunenData;
const SUNEN_ARABIC_SUBTITLE = 'سُنَنُ أَبِي دَاوُدَ السِّجِسْتَانِيِّ';

export const SunenPage: React.FC = () => {
  const { settings, t, articlePack, secondaryArticlePack } = useApp();
  const lang = settings.language;
  const isAr = lang === 'ar';
  const secondaryLang = settings.secondaryLanguage;

  const data = getLocalizedSunen(RAW_TR, lang, articlePack);
  const ui = getLocalizedSunenUi(lang, articlePack);
  const secondaryData =
    secondaryLang !== 'none' && secondaryLang !== lang
      ? getLocalizedSunen(RAW_TR, secondaryLang, secondaryArticlePack)
      : null;

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-8 sm:p-12 text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.sunenPage.kicker}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">{t.common.loading}</p>
        </ManuscriptCard>
      </div>
    );
  }

  const { compilationAndPurpose: comp, authenticityAndStructure: auth } = data;
  const secComp = secondaryData?.compilationAndPurpose ?? null;
  const secAuth = secondaryData?.authenticityAndStructure ?? null;

  const sectionLinks = [
    { id: 'telif-metod', label: ui.sections.compilation },
    { id: 'sihhat-raviler', label: ui.sections.authenticity },
    { id: 'sayisal-veriler', label: ui.sections.stats },
    { id: 'nesirler-haritasi', label: ui.sections.editionsMap },
    { id: 'serh-kitapligi', label: ui.sections.commentaries },
    { id: 'bibliyografya', label: ui.sections.bibliography },
  ];

  const heroNarration = `${data.meta.titleTr}. ${data.meta.subtitleTr} ${comp.summaryTr}`;
  const compilationNarration = [
    comp.summaryTr,
    comp.mekkeLetter.introTr,
    ...comp.mekkeLetter.principles.map((p) => `${p.order}. ${p.titleTr}: ${p.detailTr}`),
    comp.specialNotes.sufficeWithSunenTr,
    comp.specialNotes.munkerAndSilenceRuleTr,
    comp.specialNotes.ahkamScopeTr,
    comp.specialNotes.elMerasilConnectionTr,
  ].join(' ');

  const authenticityNarration = [
    auth.tiersSummaryTr,
    ...auth.tiers.map((tier) => `${tier.labelTr}: ${tier.detailTr}`),
    auth.reyAndKiyasPreferenceTr,
    auth.generalGradingAndRankTr,
    auth.babNamingQuirkTr,
    ...auth.rawis.map((r) => `${r.nameTr}: ${r.detailTr}`),
  ].join(' ');

  const bibNarration = data.bibliography.map((b) => `${b.id}. ${b.citation}`).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Calligraphy Hero */}
      <section aria-labelledby="sunen-hero-title">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)] font-tabular">
              <span>
                {ui.tdvHeaderBadge} · {data.meta.author}
              </span>
              <span>{ui.kutubSitteHeaderBadge}</span>
            </div>

            <div className="space-y-3">
              {isAr ? (
                <>
                  <h1
                    id="sunen-hero-title"
                    className="font-arabic text-4xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
                    dir="rtl"
                  >
                    {data.meta.titleAr}
                  </h1>
                  <p
                    className="font-arabic-inline text-lg sm:text-2xl font-medium text-[var(--text-primary)]"
                    dir="rtl"
                  >
                    {SUNEN_ARABIC_SUBTITLE}
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
                    {SUNEN_ARABIC_SUBTITLE}
                  </p>
                  <h1
                    id="sunen-hero-title"
                    className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
                  >
                    {data.meta.titleTr}
                  </h1>
                </>
              )}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                {data.meta.subtitleTr} {ui.heroLeadExtra}
              </p>
              {secondaryData && (
                <SecondaryArticleBlock
                  secondaryLang={secondaryLang}
                  primaryLang={lang}
                  paragraphs={[secondaryData.meta.subtitleTr]}
                />
              )}
            </div>

            {/* 4-Metric KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                  {formatLocaleNumber(comp.hadithTotals.totalWritten, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiWritten}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-emerald)]">
                  {formatLocaleNumber(comp.hadithTotals.selectedInSunen, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiSelected}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-gold)]">
                  ~{formatLocaleNumber(comp.hadithTotals.murselApprox, lang)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiMursel}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--text-primary)]">
                  {ui.kpiRankValue}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{ui.kpiRankSub}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id="sunen-hero"
                arabicText={isAr ? heroNarration : `السُّنَنُ، ${SUNEN_ARABIC_SUBTITLE}`}
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

      {/* 2. Telif Amacı & Risâle ilâ ehli Mekke (6 İlke) */}
      <section id="telif-metod" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <ScrollText className="w-4 h-4" aria-hidden="true" />
              <span>{ui.compilationKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.compilationHeading}
            </h2>
          </div>
          <SpeechControls
            id="sunen-compilation"
            compact
            arabicText={isAr ? compilationNarration : undefined}
            primaryText={isAr ? undefined : compilationNarration}
          />
        </div>

        <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 sm:p-8 space-y-6">
          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed max-w-4xl">
            {comp.summaryTr}
          </p>

          {secComp && (
            <SecondaryArticleBlock
              secondaryLang={secondaryLang}
              primaryLang={lang}
              paragraphs={[secComp.summaryTr, secComp.mekkeLetter.introTr]}
            />
          )}

          <EditorialDivider />

          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {comp.mekkeLetter.title}
              </h3>
              <span className="text-xs font-tabular text-[var(--text-secondary)]">
                {ui.altTitlePrefix} <em>{comp.mekkeLetter.altTitle}</em> · {ui.editorPrefix}{' '}
                {comp.mekkeLetter.editor}, {comp.mekkeLetter.publication}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{comp.mekkeLetter.introTr}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {comp.mekkeLetter.principles.map((p) => (
                <div
                  key={p.order}
                  className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-tabular text-[var(--accent-gold)]">
                    <span>
                      {ui.principlePrefix} 0{p.order}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{p.titleTr}</h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {p.detailTr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ManuscriptCard>

        {/* 4 Special Methodological Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ManuscriptCard accentColor="var(--accent-emerald)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-emerald)]">
              {ui.noteSufficeTitle}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.sufficeWithSunenTr}
            </p>
            {secComp && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secComp.specialNotes.sufficeWithSunenTr]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-gold)]">{ui.noteMunkerTitle}</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.munkerAndSilenceRuleTr}
            </p>
            {secComp && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secComp.specialNotes.munkerAndSilenceRuleTr]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-navy)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              {ui.noteAhkamTitle}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.ahkamScopeTr}
            </p>
            {secComp && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secComp.specialNotes.ahkamScopeTr]}
              />
            )}
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-gold)]">
              {ui.noteMerasilTitle} · {comp.specialNotes.kopruluManuscriptRef}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.elMerasilConnectionTr}
            </p>
            <p className="text-xs italic font-medium text-[var(--text-primary)] pt-1">
              {ui.colophonLabel} “{comp.specialNotes.colophonQuote}”
            </p>
            {secComp && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[secComp.specialNotes.elMerasilConnectionTr]}
              />
            )}
          </ManuscriptCard>
        </div>
      </section>

      <EditorialDivider />

      {/* 3. Sıhhat Yapısı, Bablar & 3 Meşhur Râvi */}
      <section id="sihhat-raviler" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
              <Scale className="w-4 h-4" aria-hidden="true" />
              <span>{ui.authKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.authHeading}
            </h2>
          </div>
          <SpeechControls
            id="sunen-authenticity"
            compact
            arabicText={isAr ? authenticityNarration : undefined}
            primaryText={isAr ? undefined : authenticityNarration}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{ui.tiersHeading}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {auth.tiersSummaryTr}
              </p>
            </div>

            <div className="space-y-3">
              {auth.tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-tabular font-semibold text-[var(--accent-gold)]">
                      {ui.tierPrefix} 0{idx + 1}
                    </span>
                    <span className="font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                      {tier.shareNote}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{tier.labelTr}</h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {tier.detailTr}
                  </p>
                </div>
              ))}
            </div>

            {secAuth && (
              <SecondaryArticleBlock
                secondaryLang={secondaryLang}
                primaryLang={lang}
                paragraphs={[
                  secAuth.tiersSummaryTr,
                  ...secAuth.tiers.map((tier) => `${tier.labelTr}: ${tier.detailTr}`),
                ]}
              />
            )}
          </ManuscriptCard>

          <div className="lg:col-span-5 space-y-4">
            <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{ui.reyCardTitle}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.reyAndKiyasPreferenceTr}
              </p>
              {secAuth && (
                <SecondaryArticleBlock
                  secondaryLang={secondaryLang}
                  primaryLang={lang}
                  paragraphs={[secAuth.reyAndKiyasPreferenceTr]}
                />
              )}
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-emerald)" className="p-6 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-tabular text-[var(--accent-emerald)]">
                <span>{ui.kutubRankTag}</span>
                <span>{auth.kutubSitteCitation}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{ui.hasenCardTitle}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.generalGradingAndRankTr}
              </p>
              {secAuth && (
                <SecondaryArticleBlock
                  secondaryLang={secondaryLang}
                  primaryLang={lang}
                  paragraphs={[secAuth.generalGradingAndRankTr]}
                />
              )}
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {ui.babQuirkCardTitle}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.babNamingQuirkTr}
              </p>
              {secAuth && (
                <SecondaryArticleBlock
                  secondaryLang={secondaryLang}
                  primaryLang={lang}
                  paragraphs={[secAuth.babNamingQuirkTr]}
                />
              )}
            </ManuscriptCard>
          </div>
        </div>

        {/* 3 Major Rawis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{ui.rawisHeading}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {auth.rawis.map((rawi) => (
              <ManuscriptCard
                key={rawi.id}
                accentColor="var(--accent-navy)"
                className="p-5 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[var(--accent-gold)]">
                      {rawi.shortName}
                    </span>
                    <span className="font-tabular text-[var(--text-muted)]">{rawi.citation}</span>
                  </div>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">{rawi.nameTr}</h4>
                  <p className="text-xs font-medium text-[var(--accent-emerald)]">{rawi.roleTr}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {rawi.detailTr}
                  </p>
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 4. Sayısal Veriler & Neşir Grafikleri */}
      <section id="sayisal-veriler" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            <span>{ui.statsKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {ui.statsHeading}
          </h2>
        </div>

        <SunenCharts
          totalWritten={comp.hadithTotals.totalWritten}
          selectedInSunen={comp.hadithTotals.selectedInSunen}
          murselApprox={comp.hadithTotals.murselApprox}
          elMerasilApprox={comp.hadithTotals.elMerasilApprox}
          editions={data.editionStats}
        />
      </section>

      <EditorialDivider />

      {/* 5. Baskı & Neşir Merkezleri Haritası */}
      <section id="nesirler-haritasi" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
            <Globe2 className="w-4 h-4" aria-hidden="true" />
            <span>{ui.editionsMapKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {ui.editionsMapHeading}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            {ui.editionsMapSubtitle}
          </p>
        </div>

        <EditionsMap cities={data.printCities} />
      </section>

      <EditorialDivider />

      {/* 6. Etkileşimli Şerh, Yarım Kalanlar & Araştırmalar Kitaplığı */}
      <section id="serh-kitapligi" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
            <Library className="w-4 h-4" aria-hidden="true" />
            <span>{ui.commentariesKicker}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {ui.commentariesHeading}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            {ui.commentariesSubtitle}
          </p>
        </div>

        <CommentaryShelf
          commentaries={data.commentaries}
          incompleteWorks={data.incompleteWorks}
          abridgementsAndStudies={data.abridgementsAndStudies}
        />
      </section>

      <EditorialDivider />

      {/* 7. Bibliyografya & Kaynak */}
      <section id="bibliyografya" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{ui.bibKicker}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {ui.bibHeading} ({data.bibliography.length})
            </h2>
          </div>
          <SpeechControls
            id="sunen-bibliography"
            compact
            arabicText={isAr ? bibNarration : undefined}
            primaryText={isAr ? undefined : bibNarration}
          />
        </div>

        <ManuscriptCard className="p-6 space-y-4">
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

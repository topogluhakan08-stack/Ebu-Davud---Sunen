import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Globe2, MapPin } from 'lucide-react';
import rawEbuDavudData from '../data/ebu-davud.json';
import rawSunenData from '../data/sunen.json';
import { BABS } from '../data/babs';
import type { EbuDavudData, SunenData } from '../types';
import { useApp } from '../context/AppContext';
import { formatPdfPage, getLocalizedBab } from '../utils/hadithTranslations';
import { getLocalizedEbuDavud, getLocalizedSunen } from '../utils/articleTranslations';
import { TravelMap } from '../components/ebu-davud/TravelMap';
import { EditionsMap } from '../components/sunen/EditionsMap';
import { ManuscriptCard } from '../components/ui/Card';
import { SymbolicBabIcon } from '../components/icons/SymbolicIllustrations';

const EBU_DAVUD_TR = rawEbuDavudData as EbuDavudData;
const SUNEN_TR = rawSunenData as SunenData;

type AtlasView = 'journey' | 'editions' | 'overview';

export const AtlasMapPage: React.FC = () => {
  const { settings, t, hadithPack, articlePack } = useApp();
  const isDark = settings.theme === 'dark';
  const [activeView, setActiveView] = useState<AtlasView>('journey');
  const [activeCityId, setActiveCityId] = useState<string>('sicistan');

  const ebuDavud = getLocalizedEbuDavud(EBU_DAVUD_TR, settings.language, articlePack);
  const sunen = getLocalizedSunen(SUNEN_TR, settings.language, articlePack);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.atlasPage.kicker}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            {t.atlasPage.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {t.atlasPage.subtitle}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={t.atlasPage.title}
          className="inline-flex flex-wrap gap-2 rounded-2xl bg-[var(--bg-surface)] p-1.5 border border-[var(--border-hairline)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'journey'}
            onClick={() => setActiveView('journey')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 cursor-pointer ${
              activeView === 'journey'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{t.atlasPage.tabJourney}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'editions'}
            onClick={() => setActiveView('editions')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 cursor-pointer ${
              activeView === 'editions'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe2 className="w-4 h-4" aria-hidden="true" />
            <span>{t.atlasPage.tabEditions}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'overview'}
            onClick={() => setActiveView('overview')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 cursor-pointer ${
              activeView === 'overview'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>{t.atlasPage.tabOverview}</span>
          </button>
        </div>
      </header>

      {activeView === 'journey' && (
        <section aria-label={t.atlasPage.tabJourney} className="space-y-4">
          {ebuDavud ? (
            <TravelMap
              cities={ebuDavud.cities}
              activeCityId={activeCityId}
              onSelectCity={setActiveCityId}
            />
          ) : (
            <ManuscriptCard className="p-8 text-center text-sm text-[var(--text-secondary)]">
              {t.common.loading}
            </ManuscriptCard>
          )}
          <div className="flex justify-end">
            <Link
              to="/ebu-davud"
              className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline inline-flex items-center gap-1"
            >
              <span>{t.nav.ebuDavud}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {activeView === 'editions' && (
        <section aria-label={t.atlasPage.tabEditions} className="space-y-4">
          {sunen ? (
            <EditionsMap cities={sunen.printCities} />
          ) : (
            <ManuscriptCard className="p-8 text-center text-sm text-[var(--text-secondary)]">
              {t.common.loading}
            </ManuscriptCard>
          )}
          <div className="flex justify-end">
            <Link
              to="/sunen"
              className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline inline-flex items-center gap-1"
            >
              <span>{t.nav.sunen}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {activeView === 'overview' && (
        <section aria-label={t.atlasPage.tabOverview} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ManuscriptCard accentColor="var(--accent-navy)" className="p-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                {t.entryCards.authorTag}
              </p>
              <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {t.entryCards.authorTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.entryCards.authorDesc}
              </p>
              <Link
                to="/ebu-davud"
                className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#93b8f9] inline-flex items-center gap-1 pt-1"
              >
                <span>{t.nav.ebuDavud}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-emerald)" className="p-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-emerald)]">
                {t.entryCards.workTag}
              </p>
              <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {t.entryCards.workTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.entryCards.workDesc}
              </p>
              <Link
                to="/sunen"
                className="text-xs font-semibold text-[var(--accent-emerald)] inline-flex items-center gap-1 pt-1"
              >
                <span>{t.nav.sunen}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                {t.entryCards.hadithTag}
              </p>
              <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {t.entryCards.hadithTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {t.entryCards.hadithDesc}
              </p>
              <Link
                to="/hadisler"
                className="text-xs font-semibold text-[var(--accent-gold)] inline-flex items-center gap-1 pt-1"
              >
                <span>{t.nav.hadisler}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </ManuscriptCard>
          </div>

          <ManuscriptCard className="p-5 sm:p-6 space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              {t.hadithsPage.babsDirectoryTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BABS.map((bab) => {
                const accent = isDark ? bab.colorDarkHex : bab.colorHex;
                const localizedBab = getLocalizedBab(bab, settings.language, hadithPack);
                return (
                  <Link
                    key={bab.id}
                    to={`/hadisler?bab=${bab.id}`}
                    className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/65 p-3.5 flex items-center justify-between gap-3 hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SymbolicBabIcon type={bab.iconType} color={accent} className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {localizedBab.numberLabel}: {localizedBab.title}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] font-tabular">
                          {bab.hadithStart}–{bab.hadithEnd} · {formatPdfPage(bab.pdfPages, settings.language)}
                        </p>
                      </div>
                    </div>
                    <BookOpen className="w-4 h-4 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </ManuscriptCard>
        </section>
      )}

      <p className="text-xs text-center text-[var(--text-muted)]">{t.disclaimer}</p>
    </div>
  );
};

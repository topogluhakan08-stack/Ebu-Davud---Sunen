import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookMarked, Search, Users, Volume2 } from 'lucide-react';
import hadislerRaw from '../data/hadisler.json';
import {
  GLOSSARY_TERMS,
  extractNarratorDirectory,
  type GlossaryCategory,
} from '../data/glossaryData';
import type { HadithItem, IsnadNode } from '../types';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { matchesArabicQuery } from '../utils/arabic';
import { ManuscriptCard } from '../components/ui/Card';

const HADITHS = hadislerRaw as HadithItem[];
const NARRATORS = extractNarratorDirectory(HADITHS);

type GlossaryTab = 'terms' | 'narrators';
type LayerFilter = 'all' | IsnadNode['layer'];

const LAYER_LABELS: Record<IsnadNode['layer'], string> = {
  prophet: 'Hz. Peygamber ﷺ',
  sahabi: 'Sahâbî',
  tabiin: 'Tâbiîn',
  etba: 'Etbâ‘ / Şeyh',
  musannif: 'Musannif (Ebû Dâvûd)',
};

export const GlossaryPage: React.FC = () => {
  const { settings, t } = useApp();
  const { speak } = useSpeech();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<GlossaryTab>('terms');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GlossaryCategory>('all');
  const [layerFilter, setLayerFilter] = useState<LayerFilter>('all');

  const filteredTerms = useMemo(() => {
    const q = query.trim();
    const lowerQ = q.toLocaleLowerCase('tr');
    return GLOSSARY_TERMS.filter((term) => {
      if (categoryFilter !== 'all' && term.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        term.termTr.toLocaleLowerCase('tr').includes(lowerQ) ||
        term.termFr.toLocaleLowerCase('tr').includes(lowerQ) ||
        term.definitionTr.toLocaleLowerCase('tr').includes(lowerQ) ||
        term.exampleInApp.toLocaleLowerCase('tr').includes(lowerQ) ||
        matchesArabicQuery(term.termAr, q)
      );
    });
  }, [query, categoryFilter]);

  const filteredNarrators = useMemo(() => {
    const q = query.trim();
    const lowerQ = q.toLocaleLowerCase('tr');
    return NARRATORS.filter((n) => {
      if (layerFilter !== 'all' && n.layer !== layerFilter) return false;
      if (!q) return true;
      return (
        n.nameTr.toLocaleLowerCase('tr').includes(lowerQ) ||
        matchesArabicQuery(n.nameAr, q) ||
        n.notes.some((note) => note.toLocaleLowerCase('tr').includes(lowerQ))
      );
    });
  }, [query, layerFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.glossaryPage.kicker}
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            {t.glossaryPage.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {t.glossaryPage.subtitle}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={t.glossaryPage.title}
          className="inline-flex flex-wrap gap-2 rounded-2xl bg-[var(--bg-surface)] p-1.5 border border-[var(--border-hairline)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terms'}
            onClick={() => setActiveTab('terms')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookMarked className="w-4 h-4" aria-hidden="true" />
            <span>
              {t.nav.sozluk} ({GLOSSARY_TERMS.length})
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'narrators'}
            onClick={() => setActiveTab('narrators')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'narrators'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>
              {t.hadithCard.tabs.isnad} ({NARRATORS.length})
            </span>
          </button>
        </div>
      </header>

      {/* Search & Category Strip */}
      <ManuscriptCard className="p-4 space-y-3">
        <div className="relative">
          <label htmlFor="glossary-search-input" className="sr-only">
            {t.searchPage.placeholder}
          </label>
          <Search
            className="w-4 h-4 text-[var(--text-muted)] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="glossary-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPage.placeholder}
            className="w-full min-h-[42px] ps-10 pe-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)]"
          />
        </div>

        {activeTab === 'terms' ? (
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all' as const, label: t.common.all },
              { id: 'sened_sihhat' as const, label: 'السند والصحة' },
              { id: 'telif_turleri' as const, label: 'التصنيف والسنن' },
              { id: 'tahkik_hasiye' as const, label: 'التحقيق والحاشية' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                aria-pressed={categoryFilter === cat.id}
                className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-medium border cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: t.common.all },
                { id: 'sahabi', label: 'الصحابي / Sahâbî' },
                { id: 'tabiin', label: 'التابعي / Tâbiîn' },
                { id: 'etba', label: 'أتباع التابعين / Etbâ‘' },
                { id: 'musannif', label: 'المصنّف / Musannif' },
              ] as const
            ).map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setLayerFilter(layer.id)}
                aria-pressed={layerFilter === layer.id}
                className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-medium border cursor-pointer ${
                  layerFilter === layer.id
                    ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        )}
      </ManuscriptCard>

      {/* Content List */}
      {activeTab === 'terms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTerms.map((term) => {
            const termTitle =
              settings.language === 'tr'
                ? term.termTr
                : settings.language === 'fr'
                  ? term.termFr
                  : term.termAr;
            return (
              <ManuscriptCard key={term.id} accentColor="var(--accent-gold)" className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    {settings.language === 'tr' && (
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                        {term.categoryLabelTr}
                      </span>
                    )}
                    <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                      {termTitle}
                    </h2>
                    {settings.language === 'tr' && (
                      <p className="text-xs text-[var(--text-muted)]">{term.termFr}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="font-arabic-inline text-xl font-bold text-[var(--text-primary)]" dir="rtl">
                      {term.termAr}
                    </span>
                    <button
                      type="button"
                      onClick={() => speak(term.termAr, 'ar-SA', { id: `glossary-${term.id}` })}
                      aria-label={t.tts.playAr}
                      className="min-h-[30px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[11px] font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" aria-hidden="true" />
                      <span>{t.tts.playAr}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                  {settings.language === 'tr' ? term.definitionTr : t.common.translationPreparing}
                </p>

                <div className="rounded-xl bg-[var(--bg-surface)]/75 border border-[var(--border-hairline)] p-3.5 text-xs text-[var(--text-secondary)] space-y-2">
                  {settings.language === 'tr' && (
                    <p>
                      <strong className="text-[var(--text-primary)]">Uygulamadaki Örneği:</strong>{' '}
                      {term.exampleInApp}
                    </p>
                  )}
                  <Link
                    to={term.relatedRoute}
                    className="inline-flex items-center gap-1 font-semibold text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline"
                  >
                    <span>{settings.language === 'tr' ? term.relatedLabel : t.searchPage.openResult}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </ManuscriptCard>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNarrators.map((n) => (
            <ManuscriptCard key={n.key} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-emerald)]">
                    {LAYER_LABELS[n.layer]}
                  </span>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    {settings.language === 'ar' ? n.nameAr : n.nameTr}
                  </h2>
                  <p className="font-arabic-inline text-base text-[var(--text-secondary)]" dir="rtl">
                    {n.nameAr}
                  </p>
                </div>
                <span className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-0.5 text-xs font-tabular font-semibold text-[var(--text-primary)] shrink-0">
                  {n.hadithIds.length} {t.hadithsPage.hadithUnit}
                </span>
              </div>

              {n.notes.length > 0 && (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {settings.language === 'tr' ? n.notes[0] : t.common.translationPreparing}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-hairline)]">
                {n.hadithIds.slice(0, 8).map((hid) => (
                  <Link
                    key={hid}
                    to={`/hadisler?hadith=${hid}`}
                    className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-0.5 text-[11px] font-tabular font-semibold text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline"
                  >
                    #{hid}
                  </Link>
                ))}
                {n.hadithIds.length > 8 && (
                  <span className="text-[11px] text-[var(--text-muted)] self-center">
                    +{n.hadithIds.length - 8} {t.hadithsPage.hadithUnit}
                  </span>
                )}
              </div>
            </ManuscriptCard>
          ))}
        </div>
      )}

      <p className="text-xs text-center text-[var(--text-muted)]">{t.disclaimer}</p>
    </div>
  );
};

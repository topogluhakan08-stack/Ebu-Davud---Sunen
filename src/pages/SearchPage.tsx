import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, RotateCcw, Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { runGlobalSearch, type SearchResultCategory } from '../utils/globalSearch';
import { ManuscriptCard } from '../components/ui/Card';

const SUGGESTIONS = [
  'غضب',
  'رفق',
  'أعوذ',
  'حلم',
  '4750',
  'Hattâbî',
  'Basra',
  'Mürsel',
  'Muâz',
];

export const SearchPage: React.FC = () => {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<SearchResultCategory>('all');

  const categories: { id: SearchResultCategory; label: string }[] = [
    { id: 'all', label: t.common.all },
    { id: 'hadith', label: t.nav.hadisler },
    { id: 'word', label: t.hadithCard.rootLabel },
    { id: 'footnote', label: t.hadithCard.tabs.footnotes },
    { id: 'narrator', label: t.hadithCard.tabs.isnad },
    { id: 'bab', label: t.hero.statBabs },
    { id: 'ebu_davud', label: t.nav.ebuDavud },
    { id: 'sunen', label: t.nav.sunen },
    { id: 'glossary', label: t.nav.sozluk },
  ];

  const updateQuery = (nextQ: string) => {
    setQuery(nextQ);
    const next = new URLSearchParams(searchParams);
    if (nextQ.trim()) {
      next.set('q', nextQ);
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const allMatches = useMemo(() => runGlobalSearch(query, 'all', 120), [query]);

  const results = useMemo(
    () => (category === 'all' ? allMatches : allMatches.filter((r) => r.category === category)),
    [allMatches, category]
  );

  const countForCategory = (cat: SearchResultCategory) => {
    if (cat === 'all') return allMatches.length;
    return allMatches.filter((r) => r.category === cat).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
          {t.searchPage.kicker}
        </p>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
          {t.searchPage.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          {t.searchPage.subtitle}
        </p>
      </header>

      {/* Search Input & Quick Suggestions */}
      <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 sm:p-6 space-y-4">
        <div className="relative">
          <label htmlFor="global-search-input" className="sr-only">
            {t.searchPage.title}
          </label>
          <Search
            className="w-5 h-5 text-[var(--text-muted)] absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="global-search-input"
            type="search"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder={t.searchPage.placeholder}
            className="w-full min-h-[48px] ps-12 pe-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm sm:text-base text-[var(--text-primary)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">{t.searchPage.suggestionsLabel}</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateQuery(s)}
              className="min-h-[30px] px-2.5 py-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)] cursor-pointer"
            >
              {s}
            </button>
          ))}
          {query.trim() && (
            <button
              type="button"
              onClick={() => {
                updateQuery('');
                setCategory('all');
              }}
              className="ms-auto text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.searchPage.clear}</span>
            </button>
          )}
        </div>

        {query.trim() && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-hairline)]">
            {categories.map((cat) => {
              const count = countForCategory(cat.id);
              const active = category === cat.id;
              if (cat.id !== 'all' && count === 0 && !active) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={active}
                  className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-medium border cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                  }`}
                >
                  {cat.label} <span className="font-tabular opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </ManuscriptCard>

      {/* Results Area */}
      {!query.trim() ? (
        <ManuscriptCard className="p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            {t.searchPage.startTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            {t.searchPage.startDesc}
          </p>
        </ManuscriptCard>
      ) : results.length === 0 ? (
        <ManuscriptCard className="p-8 text-center space-y-2">
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            “{query}” · {t.searchPage.noResults}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {t.searchPage.noResultsHint}
          </p>
        </ManuscriptCard>
      ) : (
        <section aria-label={t.searchPage.title} className="space-y-3">
          <p className="text-xs text-[var(--text-muted)]">
            <strong className="text-[var(--text-primary)] font-tabular">{results.length}</strong>{' '}
            {t.searchPage.resultsFound}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {results.map((item) => (
              <Link key={item.id} to={item.to} className="block group">
                <ManuscriptCard className="p-4 sm:p-5 space-y-2 group-hover:border-[var(--border-strong)] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-[var(--accent-navy-soft)] text-[var(--accent-navy)] dark:text-[#93b8f9] px-2.5 py-0.5 text-[11px] font-bold">
                        {item.categoryLabel}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:underline">
                        {item.title}
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] inline-flex items-center gap-1">
                      <span>{t.searchPage.openResult}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" />
                    </span>
                  </div>

                  {item.arabicSnippet && (
                    <p
                      className="font-arabic-inline text-base sm:text-lg text-[var(--text-primary)] leading-loose"
                      dir="rtl"
                    >
                      {item.arabicSnippet}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {item.snippet}
                  </p>

                  <p className="text-[11px] text-[var(--text-muted)] font-tabular">{item.meta}</p>
                </ManuscriptCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-center text-[var(--text-muted)]">{t.disclaimer}</p>
    </div>
  );
};

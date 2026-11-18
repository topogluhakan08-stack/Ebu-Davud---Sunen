import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Filter, RotateCcw, Search, SkipForward } from 'lucide-react';
import hadislerRaw from '../data/hadisler.json';
import { BABS, getBabById } from '../data/babs';
import type { HadithItem } from '../types';
import { useApp } from '../context/AppContext';
import { useSpeech, type SpeechLang } from '../hooks/useSpeech';
import { filterHadiths, type HadithStatusFilter } from '../utils/hadithFilters';
import { getBabDisplayTitle } from '../utils/localizedText';
import { ManuscriptCard } from '../components/ui/Card';
import { SymbolicBabIcon } from '../components/icons/SymbolicIllustrations';
import { HadithCard } from '../components/hadiths/HadithCard';

const HADITHS = hadislerRaw as HadithItem[];

const BAB_TITLE_FOOTNOTES: Record<number, string> = {
  1: '* Bab başlığındaki “[ve güzel hâl / gidişat (وحسن الهدي)]” ziyadesi yalnızca (ك) nüshasının hâşiyesinde yer almaktadır.',
  4: '* 4. Bab başlığı “[Öfke Anında Söylenecek Söz Babı]” yalnızca (ك) nüshasının hâşiyesinde bulunmaktadır.',
  9: '* 9. Bab başlığı “[Yüksek Makam Hırsından Kaçınma Babı]” (ص) dışındaki tüm ana nüshalarda yer alır.',
};

export const HadithsPage: React.FC = () => {
  const { settings, progress, markListened, t } = useApp();
  const { speak } = useSpeech();
  const [searchParams, setSearchParams] = useSearchParams();
  const isDark = settings.theme === 'dark';

  const babParam = searchParams.get('bab');
  const hadithParam = searchParams.get('hadith');

  const initialBab: number | 'all' = useMemo(() => {
    if (!babParam) return 'all';
    const parsed = Number(babParam);
    return parsed >= 1 && parsed <= 11 ? parsed : 'all';
  }, [babParam]);

  const targetHadithId = hadithParam ? Number(hadithParam) : null;

  const [selectedBab, setSelectedBab] = useState<number | 'all'>(initialBab);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HadithStatusFilter>('all');
  const [autoPlayNext, setAutoPlayNext] = useState(false);

  useEffect(() => {
    setSelectedBab(initialBab);
  }, [initialBab]);

  useEffect(() => {
    if (targetHadithId && !Number.isNaN(targetHadithId)) {
      const el = document.getElementById(`hadith-${targetHadithId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [targetHadithId, selectedBab]);

  const handleSelectBab = (babId: number | 'all') => {
    setSelectedBab(babId);
    const next = new URLSearchParams(searchParams);
    if (babId === 'all') {
      next.delete('bab');
    } else {
      next.set('bab', String(babId));
    }
    next.delete('hadith');
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    handleSelectBab('all');
  };

  const filteredHadiths = useMemo(
    () =>
      filterHadiths(HADITHS, {
        babId: selectedBab,
        query,
        statusFilter,
        progress,
      }),
    [selectedBab, query, statusFilter, progress]
  );

  const activeBab = selectedBab === 'all' ? undefined : getBabById(selectedBab);

  const handleAudioFinishedRef = useRef<((hadithId: number, lang: SpeechLang) => void) | null>(null);

  const handleAudioFinished = useCallback(
    (currentHadithId: number, lang: SpeechLang) => {
      if (!autoPlayNext) return;
      const idx = filteredHadiths.findIndex((h) => h.id === currentHadithId);
      if (idx < 0 || idx + 1 >= filteredHadiths.length) return;
      const nextHadith = filteredHadiths[idx + 1];
      const nextText =
        lang === 'ar-SA'
          ? nextHadith.fullTextAr
          : lang === 'fr-FR'
            ? nextHadith.translationFr
            : lang === 'tr-TR'
              ? nextHadith.translationTr
              : t.common.translationPreparing;

      const el = document.getElementById(`hadith-${nextHadith.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      markListened(nextHadith.id);
      speak(nextText, lang, {
        id: `hadith-${nextHadith.id}`,
        onEnd: () => handleAudioFinishedRef.current?.(nextHadith.id, lang),
      });
    },
    [autoPlayNext, filteredHadiths, markListened, speak]
  );

  handleAudioFinishedRef.current = handleAudioFinished;

  const statusFilterOptions: { id: HadithStatusFilter; label: string }[] = [
    { id: 'all', label: t.hadithsPage.filters.all },
    { id: 'unread', label: t.hadithsPage.filters.unread },
    { id: 'favorites', label: t.hadithsPage.filters.favorites },
    { id: 'memorized', label: t.hadithsPage.filters.memorized },
    { id: 'with_notes', label: t.hadithsPage.filters.withNotes },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
              {t.hadithsPage.kicker}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              {t.hadithsPage.title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              {t.hadithsPage.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-emerald)]">
                {progress.readHadiths.length}/38
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{t.hadithsPage.statRead}</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-navy)] dark:text-[#93b8f9]">
                {progress.memorizedHadiths.length}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{t.hadithsPage.statMem}</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-gold)]">
                {progress.favoriteHadiths.length}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{t.hadithsPage.statFav}</div>
            </div>
          </div>
        </div>
      </header>

      {/* 11-Bab Navigator */}
      <section aria-label={t.hadithsPage.babsDirectoryTitle} className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {t.hadithsPage.babsDirectoryTitle}
          </h2>
          {selectedBab !== 'all' && (
            <button
              type="button"
              onClick={() => handleSelectBab('all')}
              className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline cursor-pointer"
            >
              {t.hadithsPage.showAllBabs}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectBab('all')}
            aria-pressed={selectedBab === 'all'}
            className={`rounded-2xl border p-3 text-start transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              selectedBab === 'all'
                ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)] shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-tabular font-semibold opacity-80">
                38 {t.hadithsPage.hadithUnit}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold">{t.hadithsPage.allBabsLabel}</div>
              <div className="text-[11px] opacity-75 font-tabular">4740–4777</div>
            </div>
          </button>

          {BABS.map((bab) => {
            const isSelected = selectedBab === bab.id;
            const accent = isDark ? bab.colorDarkHex : bab.colorHex;
            const readInBab = HADITHS.filter(
              (h) => h.babId === bab.id && progress.readHadiths.includes(h.id)
            ).length;

            return (
              <button
                key={bab.id}
                type="button"
                onClick={() => handleSelectBab(bab.id)}
                aria-pressed={isSelected}
                style={
                  {
                    '--bab-bg-light': bab.softBgHex,
                    '--bab-bg-dark': bab.softBgDarkHex,
                    '--bab-accent-light': bab.colorHex,
                    '--bab-accent-dark': bab.colorDarkHex,
                  } as React.CSSProperties
                }
                className={`rounded-2xl border p-3 text-start transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bab-themed-surface ring-2 ring-[var(--accent-gold)] shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <SymbolicBabIcon type={bab.iconType} color={accent} className="w-5 h-5 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                      {bab.numberLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-tabular text-[var(--text-muted)] shrink-0">
                    {readInBab}/{bab.hadithCount}
                  </span>
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                    {getBabDisplayTitle(bab, settings.language)}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-tabular">
                    {bab.hadithStart === bab.hadithEnd
                      ? `#${bab.hadithStart}`
                      : `${bab.hadithStart}–${bab.hadithEnd}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Bab Banner */}
      {activeBab && (
        <ManuscriptCard
          className="p-5 sm:p-6 bab-themed-surface"
          accentColor="var(--bab-accent)"
          style={
            {
              '--bab-bg-light': activeBab.softBgHex,
              '--bab-bg-dark': activeBab.softBgDarkHex,
              '--bab-accent-light': activeBab.colorHex,
              '--bab-accent-dark': activeBab.colorDarkHex,
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-2.5 rounded-2xl bg-[var(--bg-card)]/90 border border-[var(--border-hairline)] shrink-0">
                <SymbolicBabIcon
                  type={activeBab.iconType}
                  color={isDark ? activeBab.colorDarkHex : activeBab.colorHex}
                  className="w-8 h-8"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <span>{activeBab.numberLabel}</span>
                  <span>·</span>
                  <span className="font-tabular">
                    {activeBab.hadithStart}–{activeBab.hadithEnd} ({activeBab.hadithCount} {t.hadithsPage.hadithUnit})
                  </span>
                  <span>·</span>
                  <span className="font-tabular">PDF s. {activeBab.pdfPages}</span>
                </div>
                <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                  {getBabDisplayTitle(activeBab, settings.language)}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {settings.language === 'tr' ? activeBab.subtitleTr : t.common.translationPreparing}
                </p>
                {BAB_TITLE_FOOTNOTES[activeBab.id] && (
                  <p className="text-xs text-[var(--text-secondary)] pt-1">
                    {settings.language === 'tr'
                      ? BAB_TITLE_FOOTNOTES[activeBab.id]
                      : t.common.translationPreparing}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <p className="font-arabic-inline text-xl sm:text-2xl font-bold text-[var(--text-primary)]" dir="rtl">
                {activeBab.titleAr}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeBab.keyArabicTerms.map((term) => (
                  <span
                    key={term}
                    className="font-arabic-inline text-sm px-2.5 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ManuscriptCard>
      )}

      {/* Search & Filter Controls */}
      <ManuscriptCard className="p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <label htmlFor="hadith-search-input" className="sr-only">
              {t.hadithsPage.searchPlaceholder}
            </label>
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="hadith-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hadithsPage.searchPlaceholder}
              className="w-full min-h-[42px] ps-10 pe-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.hadithsPage.babsDirectoryTitle}>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] me-1">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
            {statusFilterOptions.map((opt) => {
              const active = statusFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatusFilter(opt.id)}
                  aria-pressed={active}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] px-1">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              {t.hadithsPage.shownPrefix}{' '}
              <strong className="text-[var(--text-primary)] font-tabular">{filteredHadiths.length}</strong>{' '}
              {t.hadithsPage.shownSuffix}
            </span>
            <button
              type="button"
              onClick={() => setAutoPlayNext((p) => !p)}
              aria-pressed={autoPlayNext}
              className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                autoPlayNext
                  ? 'bg-[var(--accent-emerald)] text-white border-[var(--accent-emerald)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              <SkipForward className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.hadithsPage.autoPlayNext}</span>
            </button>
          </div>
          {(query.trim() || statusFilter !== 'all' || selectedBab !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[var(--accent-navy)] dark:text-[#93b8f9] font-medium hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.hadithsPage.resetFilters}</span>
            </button>
          )}
        </div>
      </ManuscriptCard>

      {/* Hadith Cards List */}
      {filteredHadiths.length > 0 ? (
        <section aria-label={t.nav.hadisler} className="space-y-6">
          {filteredHadiths.map((hadith, idx) => {
            const bab = getBabById(hadith.babId) || BABS[0];
            const shouldExpandWord =
              targetHadithId === hadith.id || (idx === 0 && targetHadithId === null);
            return (
              <HadithCard
                key={hadith.id}
                hadith={hadith}
                bab={bab}
                initiallyExpanded={shouldExpandWord}
                onAudioFinished={(lang) => handleAudioFinished(hadith.id, lang)}
              />
            );
          })}
        </section>
      ) : (
        <ManuscriptCard className="p-8 text-center space-y-3">
          <p className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            {t.hadithsPage.emptyTitle}
          </p>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {t.hadithsPage.emptyDesc}
          </p>
          <div>
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>{t.hadithsPage.showAllButton}</span>
            </button>
          </div>
        </ManuscriptCard>
      )}

      {/* Educational Disclaimer */}
      <p className="text-xs text-center text-[var(--text-muted)] pt-2">
        {t.disclaimer}
      </p>
    </div>
  );
};

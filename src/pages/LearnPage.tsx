import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  GitBranch,
  GraduationCap,
  Layers,
  Network,
  Search,
  Volume2,
} from 'lucide-react';
import hadislerRaw from '../data/hadisler.json';
import kelimelerRaw from '../data/kelimeler.json';
import { BABS } from '../data/babs';
import { getQuestionBankStats } from '../data/questionBank';
import type { HadithItem } from '../types';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { matchesArabicQuery, ROOT_HIGHLIGHT_PALETTE } from '../utils/arabic';
import { getBabDisplayTitle } from '../utils/localizedText';
import {
  createInitialGamificationState,
  getLevelForXp,
  isCardDue,
  loadGamificationState,
  loadSrsProgress,
  saveGamificationState,
  type GamificationState,
  type SrsProgressMap,
} from '../utils/learnEngine';
import { ManuscriptCard } from '../components/ui/Card';
import { KitabMindMap } from '../components/mindmap/KitabMindMap';
import { QuizArena } from '../components/learn/QuizArena';
import { FlashcardDeck } from '../components/learn/FlashcardDeck';
import { MasteryDashboard } from '../components/learn/MasteryDashboard';

const HADITHS = hadislerRaw as HadithItem[];

interface KelimelerRootItem {
  id: string;
  root: string;
  rootNormalized: string;
  words: {
    id: string;
    hadithId: number;
    babId: number;
    arabic: string;
    transliteration: string;
    meaningTr: string;
    meaningFr: string;
    partOfSpeech: string;
    morphology: string;
  }[];
  hadithIds: number[];
  babIds: number[];
  derivatives: { ar: string; tr: string; fr: string }[];
}

const ROOTS = (kelimelerRaw as { roots: KelimelerRootItem[] }).roots;

type LearnTab = 'quiz' | 'flashcards' | 'roots' | 'mindmap' | 'mastery';

export const LearnPage: React.FC = () => {
  const { settings, progress, t } = useApp();
  const { speak } = useSpeech();
  const [searchParams, setSearchParams] = useSearchParams();
  const isDark = settings.theme === 'dark';

  const initialTab = (searchParams.get('tab') as LearnTab) || 'quiz';
  const [activeTab, setActiveTab] = useState<LearnTab>(
    ['quiz', 'flashcards', 'roots', 'mindmap', 'mastery'].includes(initialTab)
      ? initialTab
      : 'quiz'
  );

  // Persistent SRS & Gamification States
  const [srsMap, setSrsMap] = useState<SrsProgressMap>(() => loadSrsProgress());
  const [gamification, setGamification] = useState<GamificationState>(() =>
    loadGamificationState()
  );
  const [mistakesTrigger, setMistakesTrigger] = useState(0);

  // Roots Explorer State
  const [rootQuery, setRootQuery] = useState(searchParams.get('q') || '');
  const [rootBab, setRootBab] = useState<number | 'all'>('all');

  const bankStats = useMemo(() => getQuestionBankStats(), []);
  const levelInfo = getLevelForXp(gamification.xp);

  const dueCount = useMemo(() => {
    const now = Date.now();
    const totalWordCards = HADITHS.flatMap((h) => h.words.map((w) => `word-${w.id}`));
    return totalWordCards.filter((id) => isCardDue(srsMap[id], now)).length;
  }, [srsMap]);

  const switchTab = (tab: LearnTab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  const handleGamificationChange = (next: GamificationState) => {
    setGamification(next);
    saveGamificationState(next);
  };

  const handleStartMistakePractice = () => {
    setMistakesTrigger((c) => c + 1);
    switchTab('quiz');
  };

  // Filtered Roots
  const filteredRoots = useMemo(() => {
    const q = rootQuery.trim();
    return ROOTS.filter((r) => {
      if (rootBab !== 'all' && !r.babIds.includes(rootBab)) return false;
      if (!q) return true;
      const lowerQ = q.toLocaleLowerCase('tr');
      if (
        r.root.includes(q) ||
        r.rootNormalized.includes(q) ||
        matchesArabicQuery(r.root, q) ||
        r.words.some(
          (w) =>
            matchesArabicQuery(w.arabic, q) ||
            w.transliteration.toLocaleLowerCase('tr').includes(lowerQ) ||
            w.meaningTr.toLocaleLowerCase('tr').includes(lowerQ) ||
            w.meaningFr.toLocaleLowerCase('tr').includes(lowerQ)
        ) ||
        r.derivatives.some(
          (d) =>
            matchesArabicQuery(d.ar, q) ||
            d.tr.toLocaleLowerCase('tr').includes(lowerQ) ||
            d.fr.toLocaleLowerCase('tr').includes(lowerQ)
        )
      ) {
        return true;
      }
      return false;
    });
  }, [rootQuery, rootBab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
              {t.learnPage.kicker}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
              {t.learnPage.title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              {t.learnPage.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-gold)]">
                {gamification.xp} XP
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Lv.{levelInfo.current.level}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-emerald)]">
                {dueCount}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">SRS</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-center">
              <div className="text-lg font-bold font-tabular text-[var(--accent-navy)] dark:text-[#93b8f9]">
                {progress.memorizedHadiths.length}/38
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">{t.progress.memorized}</div>
            </div>
          </div>
        </div>

        {/* 5 Learning Mode Tabs */}
        <div
          role="tablist"
          aria-label={t.learnPage.title}
          className="flex sm:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto rounded-2xl bg-[var(--bg-surface)] p-1.5 border border-[var(--border-hairline)]"
        >
          {[
            { id: 'quiz' as const, label: `Quiz (${bankStats.total})`, icon: GraduationCap },
            { id: 'flashcards' as const, label: 'SRS 3D', icon: Layers },
            { id: 'roots' as const, label: `${t.hadithCard.rootLabel} (${ROOTS.length})`, icon: Network },
            { id: 'mindmap' as const, label: t.mindMap.title, icon: GitBranch },
            {
              id: 'mastery' as const,
              label: `${t.progress.title} (${gamification.mistakeIds.length})`,
              icon: BarChart3,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => switchTab(tab.id)}
                className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* TAB 1: 9-MODE INTERACTIVE QUIZ ARENA */}
      {activeTab === 'quiz' && (
        <QuizArena
          gamification={gamification}
          onGamificationChange={handleGamificationChange}
          externalMistakesOnlyTrigger={mistakesTrigger}
        />
      )}

      {/* TAB 2: 3D FLIP & SWIPE SPACED REPETITION FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <FlashcardDeck hadiths={HADITHS} srsMap={srsMap} onSrsChange={setSrsMap} />
      )}

      {/* TAB 3: ROOT FAMILIES EXPLORER */}
      {activeTab === 'roots' && (
        <section aria-label={t.hadithCard.rootLabel} className="space-y-5">
          <ManuscriptCard className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <label htmlFor="root-search-input" className="sr-only">
                {t.searchPage.placeholder}
              </label>
              <Search
                className="w-4 h-4 text-[var(--text-muted)] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="root-search-input"
                type="search"
                value={rootQuery}
                onChange={(e) => setRootQuery(e.target.value)}
                placeholder={t.searchPage.placeholder}
                className="w-full min-h-[42px] ps-10 pe-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <select
              aria-label={t.hadithsPage.babsDirectoryTitle}
              value={rootBab}
              onChange={(e) => setRootBab(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="min-h-[42px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-3 text-xs sm:text-sm text-[var(--text-primary)]"
            >
              <option value="all">
                {t.hadithsPage.allBabsLabel} ({ROOTS.length})
              </option>
              {BABS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.numberLabel}: {getBabDisplayTitle(b, settings.language)}
                </option>
              ))}
            </select>
          </ManuscriptCard>

          <p className="text-xs text-[var(--text-muted)]">
            {t.hadithsPage.shownPrefix}{' '}
            <strong className="text-[var(--text-primary)] font-tabular">{filteredRoots.length}</strong> /{' '}
            {ROOTS.length}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoots.map((rootItem, idx) => {
              const p = ROOT_HIGHLIGHT_PALETTE[idx % ROOT_HIGHLIGHT_PALETTE.length];
              return (
                <ManuscriptCard
                  key={rootItem.id}
                  accentColor={isDark ? p.darkBorder : p.border}
                  className="p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t.hadithCard.rootLabel} · {rootItem.words.length}
                      </span>
                      <h2 className="font-arabic-inline text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mt-0.5">
                        {rootItem.root}
                      </h2>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {rootItem.hadithIds.map((hid) => (
                        <Link
                          key={hid}
                          to={`/hadisler?hadith=${hid}`}
                          className="rounded-lg px-2 py-0.5 text-xs font-tabular font-semibold bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline"
                        >
                          #{hid}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {rootItem.words.map((w) => (
                      <div
                        key={w.id}
                        className="rounded-xl bg-[var(--bg-surface)]/75 border border-[var(--border-hairline)] p-3 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-arabic-inline text-lg font-bold text-[var(--text-primary)]">
                              {w.arabic}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              [{w.transliteration}]
                            </span>
                            <span className="text-[11px] text-[var(--text-muted)]">
                              · {w.partOfSpeech}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                            {settings.language === 'tr'
                              ? w.meaningTr
                              : settings.language === 'fr'
                                ? w.meaningFr
                                : t.common.translationPreparing}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">{w.morphology}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speak(w.arabic, 'ar-SA', { id: `root-${w.id}` })}
                          aria-label={t.hadithCard.buttons.listenWord}
                          className="min-h-[34px] min-w-[34px] rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-navy)] dark:text-[#93b8f9] shrink-0 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {rootItem.derivatives.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border-hairline)] flex flex-wrap gap-1.5">
                      {rootItem.derivatives.slice(0, 6).map((d) => (
                        <span
                          key={d.ar}
                          className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2 py-0.5 text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"
                        >
                          <span className="font-arabic-inline font-semibold text-[var(--text-primary)]">
                            {d.ar}
                          </span>
                          <span>
                            {settings.language === 'tr'
                              ? d.tr
                              : settings.language === 'fr'
                                ? d.fr
                                : t.common.translationPreparing}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </ManuscriptCard>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: SHARED D3 RADIAL MIND MAP (SECTION A.3) */}
      {activeTab === 'mindmap' && <KitabMindMap />}

      {/* TAB 5: MASTERY DASHBOARD & MISTAKE NOTEBOOK */}
      {activeTab === 'mastery' && (
        <MasteryDashboard
          gamification={gamification}
          onStartMistakePractice={handleStartMistakePractice}
          onResetGamification={() => {
            const fresh = createInitialGamificationState();
            handleGamificationChange(fresh);
          }}
        />
      )}

      <p className="text-xs text-center text-[var(--text-muted)]">{t.disclaimer}</p>
    </div>
  );
};

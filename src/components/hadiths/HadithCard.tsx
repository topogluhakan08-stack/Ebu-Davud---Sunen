import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  Languages,
  Lightbulb,
  NotebookPen,
  Sparkles,
  Trash2,
  UserCheck,
  Volume2,
} from 'lucide-react';
import fullWordLexiconRaw from '../../data/fullWordLexicon.json';
import type {
  BabInfo,
  FullWordLexiconEntry,
  HadithItem,
  LanguageCode,
  WordAnalysis,
} from '../../types';
import { useApp } from '../../context/AppContext';
import { useSpeech, type SpeechLang } from '../../hooks/useSpeech';
import {
  normalizeArabicSearch,
  ROOT_HIGHLIGHT_PALETTE,
  segmentArabicWithLexicon,
} from '../../utils/arabic';
import { splitIntoSentences } from '../../utils/audioManifest';
import { getLanguageMeta, getSpeechLangForUi } from '../../utils/localizedText';
import {
  formatPdfPage,
  getLocalizedBab,
  getLocalizedHadithContent,
  localizeTahricBadge,
} from '../../utils/hadithTranslations';
import {
  getLocalizedDerivativeMeaning,
  getLocalizedNarratorBio,
  getLocalizedPartOfSpeech,
  getLocalizedWordGrammar,
  getLocalizedWordMeaning,
} from '../../utils/lexiconTranslations';
import { ManuscriptCard } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { SpeechControls } from '../tts/SpeechControls';
import { SymbolicBabIcon } from '../icons/SymbolicIllustrations';
import { IsnadFlowChart } from './IsnadFlowChart';

const FULL_LEXICON = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;

interface HadithCardProps {
  hadith: HadithItem;
  bab: BabInfo;
  initiallyExpanded?: boolean;
  onAudioFinished?: (lang: SpeechLang) => void;
}

type CardTab = 'text' | 'isnad' | 'footnotes' | 'note';

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  bab,
  onAudioFinished,
}) => {
  const {
    settings,
    progress,
    t,
    secondaryT,
    hadithPack,
    secondaryHadithPack,
    glossaryPack,
    wordLexiconPack,
    secondaryWordLexiconPack,
    toggleRead,
    markListened,
    toggleMemorized,
    toggleFavorite,
    setNote,
  } = useApp();
  const { speak, activeId, activeLang, status, sentences, activeSentenceIndex } = useSpeech();
  const navigate = useNavigate();

  const isnadSegments = useMemo(
    () => segmentArabicWithLexicon(hadith.isnadAr, hadith, FULL_LEXICON, 'isnad'),
    [hadith]
  );

  const matnSegments = useMemo(
    () => segmentArabicWithLexicon(hadith.matnAr, hadith, FULL_LEXICON, 'matn'),
    [hadith]
  );

  const allTokenWords = useMemo(() => {
    const map = new Map<string, WordAnalysis>();
    for (const seg of [...isnadSegments, ...matnSegments]) {
      if (seg.word) map.set(seg.word.id, seg.word);
    }
    return map;
  }, [isnadSegments, matnSegments]);

  const [activeTab, setActiveTab] = useState<CardTab>('text');
  const [showIsnadInline, setShowIsnadInline] = useState(true);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null);
  const [highlightedChainNodeId, setHighlightedChainNodeId] = useState<string | null>(null);
  const [showSecondaryTranslation, setShowSecondaryTranslation] = useState(true);
  const wordStudyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedWordId) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (wordStudyRef.current && !wordStudyRef.current.contains(e.target as Node)) {
        setSelectedWordId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWordId(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWordId]);

  const isRead = progress.readHadiths.includes(hadith.id);
  const isMemorized = progress.memorizedHadiths.includes(hadith.id);
  const isFavorite = progress.favoriteHadiths.includes(hadith.id);
  const savedNote = progress.notes[hadith.id] || '';
  const hasNote = Boolean(savedNote.trim());
  const isDark = settings.theme === 'dark';

  const babAccent = isDark ? bab.colorDarkHex : bab.colorHex;

  const selectedWord: WordAnalysis | undefined = useMemo(
    () => (selectedWordId ? allTokenWords.get(selectedWordId) : undefined),
    [allTokenWords, selectedWordId]
  );

  const hoveredWord: WordAnalysis | undefined = useMemo(
    () => (hoveredWordId ? allTokenWords.get(hoveredWordId) : undefined),
    [allTokenWords, hoveredWordId]
  );

  const selectedNormRoot = useMemo(() => {
    if (!selectedWord || !selectedWord.root || selectedWord.root.startsWith('—')) return '';
    return normalizeArabicSearch(selectedWord.root).replace(/\s+/g, '');
  }, [selectedWord]);

  const hasFootnoteNeedsReview = hadith.footnotes.some((f) => f.needs_review);
  const hasWordNeedsReview = Array.from(allTokenWords.values()).some((w) => w.needs_review);
  const showNeedsReview = Boolean(
    hadith.needs_review || hasFootnoteNeedsReview || hasWordNeedsReview
  );

  const getPaletteVars = (colorIdx: number): React.CSSProperties => {
    const p = ROOT_HIGHLIGHT_PALETTE[colorIdx % ROOT_HIGHLIGHT_PALETTE.length];
    return {
      '--hl-bg-light': p.bg,
      '--hl-border-light': p.border,
      '--hl-text-light': p.text,
      '--hl-bg-dark': p.darkBg,
      '--hl-border-dark': p.darkBorder,
      '--hl-text-dark': p.darkText,
    } as React.CSSProperties;
  };

  const getWordMeaningForLang = (w: WordAnalysis, lang: LanguageCode): string => {
    const pack = lang === settings.language ? wordLexiconPack : secondaryWordLexiconPack;
    const fallback =
      lang === settings.language
        ? t.common.translationPreparing
        : secondaryT?.common.translationPreparing || t.common.translationPreparing;
    return getLocalizedWordMeaning(w, lang, pack, fallback);
  };

  const renderClickableToken = (
    seg: { text: string; word?: WordAnalysis; isNeutralToken?: boolean },
    idx: number,
    scope: 'isnad' | 'matn'
  ) => {
    if (!seg.word) {
      return <React.Fragment key={`${scope}-txt-${idx}`}>{seg.text}</React.Fragment>;
    }
    const w = seg.word;
    const isSelected = selectedWordId === w.id;
    const wNormRoot =
      w.root && !w.root.startsWith('—')
        ? normalizeArabicSearch(w.root).replace(/\s+/g, '')
        : '';
    const sharesRootWithSelected = Boolean(
      selectedNormRoot && wNormRoot && wNormRoot === selectedNormRoot
    );

    const style = getPaletteVars(w.rootColorIndex);
    const meaning = getWordMeaningForLang(w, settings.language);

    const useColoredBadge =
      settings.alwaysShowRootColors
        ? !seg.isNeutralToken || isSelected || sharesRootWithSelected
        : isSelected || sharesRootWithSelected;

    return (
      <button
        key={`${w.id}-${idx}`}
        type="button"
        onClick={() => setSelectedWordId(isSelected ? null : w.id)}
        onMouseEnter={() => setHoveredWordId(w.id)}
        onMouseLeave={() => setHoveredWordId((prev) => (prev === w.id ? null : prev))}
        onFocus={() => setHoveredWordId(w.id)}
        onBlur={() => setHoveredWordId((prev) => (prev === w.id ? null : prev))}
        aria-expanded={isSelected}
        aria-label={`${w.arabic} (${meaning})`}
        title={`${w.arabic} [${w.transliteration}] · ${meaning}${w.root && !w.root.startsWith('—') ? ` · ${t.hadithCard.rootLabel}: ${w.root}` : ''}`}
        style={useColoredBadge ? style : undefined}
        className={`inline transition-all cursor-pointer ${
          useColoredBadge
            ? 'root-hl-token border rounded-lg px-1.5 py-0.5 mx-0.5'
            : 'rounded px-0.5 border border-transparent hover:bg-[var(--bg-surface)] focus-visible:bg-[var(--bg-surface)] hover:underline focus-visible:underline decoration-[var(--accent-gold)]/55 decoration-1 underline-offset-[6px]'
        } ${
          isSelected
            ? 'ring-2 ring-[var(--accent-gold)] font-semibold'
            : sharesRootWithSelected
              ? 'ring-1 ring-[var(--accent-gold)]/70 font-semibold'
              : ''
        }`}
      >
        {seg.text}
      </button>
    );
  };

  const primaryContent = getLocalizedHadithContent(
    hadith,
    settings.language,
    hadithPack,
    t.common.translationPreparing
  );
  const primaryTranslation = primaryContent.translation;

  const hasSecondaryLang =
    settings.secondaryLanguage !== 'none' && settings.secondaryLanguage !== settings.language;
  const secondaryLangMeta = hasSecondaryLang
    ? getLanguageMeta(settings.secondaryLanguage as LanguageCode)
    : null;
  const secondaryContent =
    hasSecondaryLang && secondaryLangMeta
      ? getLocalizedHadithContent(
          hadith,
          secondaryLangMeta.code,
          secondaryHadithPack,
          secondaryT?.common.translationPreparing || t.common.translationPreparing
        )
      : null;

  const primarySpeechCode = getSpeechLangForUi(settings.language);
  const isAudioActiveHere = status !== 'idle' && activeId === `hadith-${hadith.id}`;
  const translationSentences = useMemo(
    () => splitIntoSentences(primaryTranslation),
    [primaryTranslation]
  );
  const highlightTranslationSentence =
    isAudioActiveHere && activeLang === primarySpeechCode && activeLang !== 'ar-SA';
  const activeArabicSentence =
    isAudioActiveHere && activeLang === 'ar-SA' && activeSentenceIndex >= 0
      ? sentences[activeSentenceIndex] || null
      : null;

  const localizedBab = getLocalizedBab(bab, settings.language, hadithPack);

  return (
    <ManuscriptCard
      id={`hadith-${hadith.id}`}
      accentColor="var(--bab-accent)"
      style={
        {
          '--bab-bg-light': bab.softBgHex,
          '--bab-bg-dark': bab.softBgDarkHex,
          '--bab-accent-light': bab.colorHex,
          '--bab-accent-dark': bab.colorDarkHex,
        } as React.CSSProperties
      }
      className="scroll-mt-24 transition-shadow bab-themed-vars"
    >
      <div className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-5">
        {/* Card Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bab-themed-badge inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold font-tabular">
                <SymbolicBabIcon type={bab.iconType} color={babAccent} className="w-4 h-4 shrink-0" />
                <span>#{hadith.id}</span>
              </span>

              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {localizedBab.numberLabel}: {localizedBab.title}
              </span>

              <span className="text-xs font-tabular text-[var(--text-muted)]">
                · {formatPdfPage(hadith.pdfPage, settings.language)}
              </span>

              {showNeedsReview && (
                <StatusBadge variant="needs_review" label={t.hadithCard.needsReviewBadge} />
              )}
            </div>

            {hadith.tahricBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {hadith.tahricBadges.map((badge) => (
                  <StatusBadge
                    key={badge}
                    variant="tahric"
                    label={localizeTahricBadge(badge, settings.language)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Progress & Bookmark Toggles */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleRead(hadith.id)}
              aria-pressed={isRead}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isRead
                  ? 'bg-[var(--accent-emerald)] text-white border-[var(--accent-emerald)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{isRead ? t.hadithCard.buttons.readDone : t.hadithCard.buttons.markRead}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleMemorized(hadith.id)}
              aria-pressed={isMemorized}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isMemorized
                  ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {isMemorized ? t.hadithCard.buttons.memorized : t.hadithCard.buttons.memorize}
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(hadith.id)}
              aria-pressed={isFavorite}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-[var(--accent-gold)] text-[#1c1917] border-[var(--accent-gold)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Bookmark
                className="w-3.5 h-3.5 shrink-0"
                fill={isFavorite ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>
                {isFavorite ? t.hadithCard.buttons.favorited : t.hadithCard.buttons.favorite}
              </span>
            </button>
          </div>
        </div>

        {/* Audio Player Bar */}
        <SpeechControls
          id={`hadith-${hadith.id}`}
          arabicText={hadith.fullTextAr}
          turkishText={hadith.translationTr}
          frenchText={hadith.translationFr}
          primaryText={!primaryContent.isTranslationMissing ? primaryTranslation : undefined}
          onListenStart={() => markListened(hadith.id)}
          onAudioFinished={onAudioFinished}
          compact
        />

        {/* 4 Interactive Study Tabs */}
        <div
          role="tablist"
          aria-label={`#${hadith.id}`}
          className="flex flex-wrap gap-1.5 rounded-xl bg-[var(--bg-surface)] p-1.5 border border-[var(--border-hairline)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'text'}
            onClick={() => setActiveTab('text')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.hadithCard.tabs.text}</span>
            <span className="font-tabular text-[11px] opacity-75">({allTokenWords.size})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'isnad'}
            onClick={() => setActiveTab('isnad')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'isnad'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <GitBranch className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.hadithCard.tabs.isnad}</span>
            <span className="font-tabular text-[11px] opacity-75">({hadith.isnadChain.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'footnotes'}
            onClick={() => setActiveTab('footnotes')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'footnotes'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.hadithCard.tabs.footnotes}</span>
            <span className="font-tabular text-[11px] opacity-75">({hadith.footnotes.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'note'}
            onClick={() => setActiveTab('note')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'note'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <NotebookPen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.hadithCard.tabs.note}</span>
            {hasNote && <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" aria-hidden="true" />}
          </button>
        </div>

        {/* Tab 1: Text & 100% Word-by-Word Interactive Analysis */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Interactive Arabic Block + Inline Word Card wrapped in ref for outside-click dismissal */}
            <div ref={wordStudyRef} className="space-y-4">
              <div className="rounded-2xl bg-[var(--bg-surface)]/75 border border-[var(--border-hairline)] p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {t.hadithCard.wordAnalysisHint}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowIsnadInline((prev) => !prev)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-hairline)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {showIsnadInline ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.hadithCard.hideIsnad}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.hadithCard.showIsnad}</span>
                      </>
                    )}
                  </button>
                </div>

                {showIsnadInline && (
                  <p
                    className="font-arabic-inline text-lg sm:text-xl leading-[2.2] text-[var(--text-secondary)] border-b border-dashed border-[var(--border-hairline)] pb-3.5"
                    dir="rtl"
                  >
                    {isnadSegments.map((seg, i) => renderClickableToken(seg, i, 'isnad'))}
                  </p>
                )}

                <p className="font-arabic text-[var(--text-primary)] leading-[2.3]" dir="rtl">
                  {matnSegments.map((seg, i) => renderClickableToken(seg, i, 'matn'))}
                </p>

                {activeArabicSentence && (
                  <div
                    dir="rtl"
                    className="rounded-xl bg-[var(--accent-gold-soft)]/55 border border-[var(--accent-gold)]/45 px-3.5 py-2 text-base font-arabic-inline leading-loose text-[var(--text-primary)]"
                  >
                    {activeArabicSentence}
                  </div>
                )}

                {/* Live Hover Quick-Preview Strip */}
                <div className="pt-2.5 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-2 min-h-[32px] text-xs text-[var(--text-muted)]">
                  {hoveredWord ? (
                    <div className="flex flex-wrap items-center gap-2 text-[var(--text-primary)]">
                      <span className="font-arabic-inline text-base font-bold text-[var(--accent-navy)] dark:text-[#93b8f9]">
                        {hoveredWord.arabic}
                      </span>
                      <span className="text-[var(--text-secondary)]">[{hoveredWord.transliteration}]</span>
                      <span className="font-semibold">
                        {getWordMeaningForLang(hoveredWord, settings.language)}
                      </span>
                      <span className="text-[var(--text-muted)]">
                        ·{' '}
                        {getLocalizedPartOfSpeech(
                          hoveredWord.partOfSpeech,
                          settings.language,
                          wordLexiconPack
                        )}
                        {hoveredWord.root && !hoveredWord.root.startsWith('—')
                          ? ` · ${t.hadithCard.rootLabel}: ${hoveredWord.root}`
                          : ''}
                      </span>
                    </div>
                  ) : (
                    <span>{t.hadithCard.hoverHint}</span>
                  )}
                </div>
              </div>

              {/* Inline Selected Word Detail Card */}
              {selectedWord &&
                (() => {
                  const grammar = getLocalizedWordGrammar(
                    selectedWord,
                    settings.language,
                    wordLexiconPack
                  );
                  const numberGenderText = [grammar.number, grammar.gender]
                    .filter((x) => x && x !== '—')
                    .join(' · ');

                  return (
                    <div
                      className="root-hl-border rounded-2xl border-2 p-4 sm:p-5 bg-[var(--bg-card)] space-y-4 shadow-sm"
                      style={getPaletteVars(selectedWord.rootColorIndex)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-arabic-inline text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                              {selectedWord.arabic}
                            </span>
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                              [{selectedWord.transliteration}]
                            </span>
                            {grammar.partOfSpeech && (
                              <span className="rounded-lg px-2 py-0.5 text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)]">
                                {grammar.partOfSpeech}
                              </span>
                            )}
                            <span
                              className="root-hl-token rounded-lg px-2.5 py-0.5 text-xs font-bold border"
                              style={getPaletteVars(selectedWord.rootColorIndex)}
                            >
                              {t.hadithCard.rootLabel}:{' '}
                              <span className="font-arabic-inline text-sm">{selectedWord.root}</span>
                            </span>
                            {selectedWord.needs_review && (
                              <StatusBadge
                                variant="needs_review"
                                label={t.hadithCard.wordReviewBadge}
                              />
                            )}
                          </div>
                          <p className="text-base font-semibold text-[var(--text-primary)] pt-0.5">
                            {getWordMeaningForLang(selectedWord, settings.language)}
                          </p>
                          {hasSecondaryLang && secondaryLangMeta && (
                            <p
                              dir={secondaryLangMeta.dir}
                              className="text-xs text-[var(--text-secondary)]"
                            >
                              {secondaryLangMeta.shortLabel}:{' '}
                              {getWordMeaningForLang(selectedWord, secondaryLangMeta.code)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              speak(selectedWord.arabic, 'ar-SA', { id: `word-${selectedWord.id}` })
                            }
                            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-95 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t.hadithCard.buttons.listenWord}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedWordId(null)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] cursor-pointer"
                          >
                            {t.hadithCard.buttons.close}
                          </button>
                        </div>
                      </div>

                      {/* Sarf & Irab Structured Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[var(--bg-surface)] rounded-xl p-3.5 border border-[var(--border-hairline)] space-y-2">
                          <span className="font-semibold text-[var(--text-muted)] block uppercase tracking-wider">
                            {t.hadithCard.sarfTitle}
                          </span>
                          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[var(--text-primary)]">
                            <div>
                              <dt className="text-[11px] text-[var(--text-muted)]">
                                {t.hadithCard.rootLabel}
                              </dt>
                              <dd>
                                <span className="font-arabic-inline text-sm font-bold" dir="rtl">
                                  {selectedWord.sarf?.root || selectedWord.root}
                                </span>
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[11px] text-[var(--text-muted)]">
                                {t.hadithCard.patternLabel}
                              </dt>
                              <dd className="font-medium">{grammar.pattern}</dd>
                            </div>
                            <div>
                              <dt className="text-[11px] text-[var(--text-muted)]">
                                {t.hadithCard.tenseLabel}
                              </dt>
                              <dd className="font-medium">{grammar.tense}</dd>
                            </div>
                            <div>
                              <dt className="text-[11px] text-[var(--text-muted)]">
                                {t.hadithCard.numberGenderLabel}
                              </dt>
                              <dd className="font-medium">{numberGenderText || '—'}</dd>
                            </div>
                          </dl>
                        </div>

                        <div className="bg-[var(--bg-surface)] rounded-xl p-3.5 border border-[var(--border-hairline)] space-y-2">
                          <span className="font-semibold text-[var(--text-muted)] block uppercase tracking-wider">
                            {t.hadithCard.irabTitle}
                          </span>
                          <div className="space-y-1 text-[var(--text-primary)]">
                            <p>
                              <span className="text-[var(--text-muted)]">
                                {t.hadithCard.roleLabel}:{' '}
                              </span>
                              <strong>{grammar.role}</strong>
                            </p>
                            <p>
                              <span className="text-[var(--text-muted)]">
                                {t.hadithCard.caseLabel}:{' '}
                              </span>
                              <strong>{grammar.caseState}</strong>
                            </p>
                            {grammar.reason && (
                              <p className="text-[var(--text-secondary)] leading-relaxed">
                                <span className="text-[var(--text-muted)]">
                                  {t.hadithCard.reasonLabel}:{' '}
                                </span>
                                {grammar.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Narrator Bio & Direct Link to Isnad Tree */}
                      {(selectedWord.isNarrator || selectedWord.isnadNodeId) && (
                        <div className="rounded-xl bg-[var(--accent-navy-soft)]/50 border border-[var(--border-hairline)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 text-xs">
                            <div className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--accent-navy)] dark:text-[#93b8f9]">
                              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{t.hadithCard.narratorBioTitle}</span>
                            </div>
                            <p className="text-[var(--text-primary)] leading-relaxed">
                              {selectedWord.narratorBioTr
                                ? getLocalizedNarratorBio(
                                    selectedWord.narratorBioTr,
                                    settings.language,
                                    glossaryPack,
                                    t.common.translationPreparing
                                  )
                                : t.hadithCard.narratorBioMissing}
                            </p>
                          </div>
                          {selectedWord.isnadNodeId && (
                            <button
                              type="button"
                              onClick={() => {
                                setHighlightedChainNodeId(selectedWord.isnadNodeId!);
                                setActiveTab('isnad');
                              }}
                              className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 hover:opacity-95 cursor-pointer"
                            >
                              <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{t.hadithCard.showInIsnad}</span>
                            </button>
                          )}
                        </div>
                      )}

                      {selectedWord.derivatives.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            {t.hadithCard.derivativesTitle} ({selectedWord.derivatives.length})
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {selectedWord.derivatives.map((d) => {
                              const derivPrimary = getLocalizedDerivativeMeaning(
                                d,
                                settings.language,
                                wordLexiconPack,
                                t.common.translationPreparing
                              );
                              const derivSecondary =
                                hasSecondaryLang && secondaryLangMeta
                                  ? getLocalizedDerivativeMeaning(
                                      d,
                                      secondaryLangMeta.code,
                                      secondaryWordLexiconPack,
                                      secondaryT?.common.translationPreparing ||
                                        t.common.translationPreparing
                                    )
                                  : null;

                              return (
                                <div
                                  key={d.ar}
                                  className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/60 px-3 py-2 flex items-center justify-between gap-2"
                                >
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-[var(--text-primary)]">
                                      {derivPrimary}
                                    </p>
                                    {derivSecondary && (
                                      <p
                                        dir={secondaryLangMeta?.dir}
                                        className="text-[11px] text-[var(--text-muted)]"
                                      >
                                        {derivSecondary}
                                      </p>
                                    )}
                                  </div>
                                  <span className="font-arabic-inline text-lg font-bold text-[var(--text-primary)] shrink-0">
                                    {d.ar}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* Translation Block */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 sm:p-5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Languages className="w-4 h-4" aria-hidden="true" />
                    <span>{t.hadithCard.primaryTranslationTitle}</span>
                  </span>
                  {hasSecondaryLang && secondaryLangMeta && (
                    <button
                      type="button"
                      onClick={() => setShowSecondaryTranslation((p) => !p)}
                      className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] inline-flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>{secondaryLangMeta.nativeName}</span>
                      {showSecondaryTranslation ? (
                        <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">
                  {highlightTranslationSentence && translationSentences.length > 0
                    ? translationSentences.map((sent, sIdx) => (
                        <React.Fragment key={sIdx}>
                          {sIdx === activeSentenceIndex ? (
                            <mark className="rounded px-1 py-0.5 bg-[var(--accent-gold-soft)] text-[var(--text-primary)] font-medium">
                              {sent}
                            </mark>
                          ) : (
                            sent
                          )}
                          {sIdx < translationSentences.length - 1 ? ' ' : ''}
                        </React.Fragment>
                      ))
                    : primaryTranslation}
                </p>

                {hasSecondaryLang && secondaryContent && showSecondaryTranslation && (
                  <p
                    dir={secondaryLangMeta?.dir}
                    className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pt-2.5 border-t border-[var(--border-hairline)]"
                  >
                    {secondaryContent.translation}
                  </p>
                )}
              </div>

              {/* Lessons & Context Story */}
              {(hadith.lessonsTr.length > 0 || hadith.contextStory) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hadith.lessonsTr.length > 0 && (
                    <div className="rounded-xl bg-[var(--accent-emerald-soft)]/55 border border-[var(--border-hairline)] p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-emerald)]">
                        <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{t.hadithCard.lessonsTitle}</span>
                      </div>
                      {primaryContent.lessons.length > 0 ? (
                        <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                          {primaryContent.lessons.map((lesson, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-bold text-[var(--accent-emerald)]">•</span>
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic">
                          {t.common.translationPreparing}
                        </p>
                      )}
                      {hasSecondaryLang &&
                        showSecondaryTranslation &&
                        secondaryContent &&
                        secondaryContent.lessons.length > 0 && (
                          <ul
                            dir={secondaryLangMeta?.dir}
                            className="space-y-1 text-xs text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-hairline)]"
                          >
                            {secondaryContent.lessons.map((lesson, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-bold opacity-70">•</span>
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}

                  {hadith.contextStory && primaryContent.contextStory && (
                    <div className="rounded-xl bg-[var(--accent-gold-soft)]/60 border border-[var(--border-hairline)] p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#875C10] dark:text-[var(--accent-gold)]">
                        <SymbolicBabIcon
                          type={hadith.contextStory.sceneType}
                          color={babAccent}
                          className="w-4 h-4 shrink-0"
                        />
                        <span>
                          {t.hadithCard.contextStoryPrefix}
                          {primaryContent.contextStory.title
                            ? ` · ${primaryContent.contextStory.title}`
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                        {primaryContent.contextStory.summary}
                      </p>
                      {hasSecondaryLang &&
                        showSecondaryTranslation &&
                        secondaryContent?.contextStory?.summary && (
                          <p
                            dir={secondaryLangMeta?.dir}
                            className="text-xs text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-hairline)]"
                          >
                            {secondaryContent.contextStory.title
                              ? `${secondaryContent.contextStory.title}: `
                              : ''}
                            {secondaryContent.contextStory.summary}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* Educational Disclaimer per card in active language(s) */}
              <div className="text-[11px] text-[var(--text-muted)] space-y-0.5 px-1">
                <p>{t.disclaimer}</p>
                {hasSecondaryLang && secondaryT && (
                  <p dir={secondaryLangMeta?.dir} className="opacity-80">
                    {secondaryT.disclaimer}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Classical SVG/D3 Isnad Tree */}
        {activeTab === 'isnad' && (
          <IsnadFlowChart
            hadithId={hadith.id}
            nodes={hadith.isnadChain}
            isnadAr={hadith.isnadAr}
            highlightedChainNodeId={highlightedChainNodeId}
            onJumpToHadith={(targetId, targetBabId) => {
              navigate(`/hadisler?bab=${targetBabId}&hadith=${targetId}`);
            }}
          />
        )}

        {/* Tab 3: Complete Footnotes / Hashiya */}
        {activeTab === 'footnotes' && (
          <div className="space-y-3">
            {hadith.footnotes.map((fn) => (
              <div
                key={fn.id}
                className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/70 p-4 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] px-2.5 py-0.5 text-xs font-bold text-[var(--text-primary)]">
                    {t.hadithCard.footnotePrefix} [{fn.marker}]
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {fn.needs_review && (
                      <StatusBadge variant="needs_review" label={t.hadithCard.footnoteVerifyBadge} />
                    )}
                    {fn.tahricSources?.map((src) => (
                      <StatusBadge
                        key={src}
                        variant="tahric"
                        label={localizeTahricBadge(src, settings.language)}
                      />
                    ))}
                  </div>
                </div>

                <p
                  className="font-arabic-inline text-base sm:text-lg leading-loose text-[var(--text-primary)] whitespace-pre-line"
                  dir="rtl"
                >
                  {fn.arabicText}
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] pt-2 border-t border-[var(--border-hairline)]">
                  {primaryContent.getFootnoteSummary(fn.id, fn.turkishSummary)}
                </p>
                {hasSecondaryLang &&
                  showSecondaryTranslation &&
                  secondaryContent &&
                  !secondaryContent.isTranslationMissing && (
                    <p
                      dir={secondaryLangMeta?.dir}
                      className="text-xs leading-relaxed text-[var(--text-muted)] pt-1.5 border-t border-dashed border-[var(--border-hairline)]"
                    >
                      {secondaryContent.getFootnoteSummary(fn.id, fn.turkishSummary)}
                    </p>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Personal Persistent Study Note */}
        {activeTab === 'note' && (
          <div className="space-y-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/65 p-4">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`note-input-${hadith.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
              >
                #{hadith.id} · {t.hadithCard.noteLabelPrefix}
              </label>
              {hasNote && (
                <button
                  type="button"
                  onClick={() => setNote(hadith.id, '')}
                  className="text-xs text-[var(--text-secondary)] hover:text-[#8C3B4A] dark:hover:text-[#F472B6] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.hadithCard.clearNote}</span>
                </button>
              )}
            </div>
            <textarea
              id={`note-input-${hadith.id}`}
              rows={4}
              value={savedNote}
              onChange={(e) => setNote(hadith.id, e.target.value)}
              placeholder={t.hadithCard.notePlaceholder}
              className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.hadithCard.noteSavedHint}
            </p>
          </div>
        )}
      </div>
    </ManuscriptCard>
  );
};

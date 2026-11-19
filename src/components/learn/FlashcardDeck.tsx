import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import fullWordLexiconRaw from '../../data/fullWordLexicon.json';
import { BABS, getBabById } from '../../data/babs';
import type { FullWordLexiconEntry, HadithItem, LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import {
  isCardDue,
  reviewSrsCard,
  saveSrsProgress,
  type SrsProgressMap,
  type SrsRating,
} from '../../utils/learnEngine';
import { getLocalizedBab, getLocalizedHadithContent } from '../../utils/hadithTranslations';
import {
  getLocalizedPartOfSpeech,
  getLocalizedRootWordMorphology,
  getLocalizedWordMeaning,
} from '../../utils/lexiconTranslations';
import {
  formatLocalizedIntervalLabel,
  getLocalizedLearnUi,
} from '../../utils/learnTranslations';
import { getLanguageMeta } from '../../utils/localizedText';
import { ManuscriptCard } from '../ui/Card';

const FULL_LEXICON = fullWordLexiconRaw as Record<string, FullWordLexiconEntry>;

type FlashDeckKind = 'words' | 'hadiths';

interface FlashcardDeckProps {
  hadiths: HadithItem[];
  srsMap: SrsProgressMap;
  onSrsChange: (next: SrsProgressMap) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  hadiths,
  srsMap,
  onSrsChange,
}) => {
  const {
    settings,
    t,
    hadithPack,
    secondaryHadithPack,
    wordLexiconPack,
    secondaryWordLexiconPack,
    learnPack,
  } = useApp();
  const { speak } = useSpeech();

  const lang = settings.language;
  const ui = getLocalizedLearnUi(lang, learnPack).flashcards;
  const hasSecondaryLang =
    settings.secondaryLanguage !== 'none' && settings.secondaryLanguage !== lang;
  const secondaryCode = hasSecondaryLang ? (settings.secondaryLanguage as LanguageCode) : null;
  const secondaryMeta = secondaryCode ? getLanguageMeta(secondaryCode) : null;

  const [deck, setDeck] = useState<FlashDeckKind>('words');
  const [flashBab, setFlashBab] = useState<number | 'all'>('all');
  const [dueOnly, setDueOnly] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef<number | null>(null);

  const allFlashcards = useMemo(() => {
    if (deck === 'words') {
      return hadiths.flatMap((h) =>
        h.words.map((w) => {
          const meaning = getLocalizedWordMeaning(
            w,
            lang,
            wordLexiconPack,
            t.common.translationPreparing
          );
          const pos = getLocalizedPartOfSpeech(w.partOfSpeech, lang, wordLexiconPack);
          const morph = getLocalizedRootWordMorphology(
            w,
            FULL_LEXICON,
            lang,
            wordLexiconPack,
            ''
          );
          const secMeaning = secondaryCode
            ? getLocalizedWordMeaning(
                w,
                secondaryCode,
                secondaryWordLexiconPack,
                ''
              )
            : '';
          const frontSub =
            lang === 'ar'
              ? `${ui.rootLabel} ${w.root} · ${ui.hadithPrefix} #${h.id}`
              : `[${w.transliteration}] · ${ui.hadithPrefix} #${h.id}`;
          return {
            cardId: `word-${w.id}`,
            babId: h.babId,
            hadithId: h.id,
            frontAr: w.arabic,
            frontSub,
            backTitle: meaning,
            backSecondary: secMeaning,
            backMeta: `${ui.rootLabel} ${w.root} · ${pos}`,
            backDetail:
              morph && morph !== '—'
                ? `${ui.morphologyLabel} ${morph}${
                    w.derivatives.length > 0
                      ? ` · ${w.derivatives
                          .slice(0, 3)
                          .map((d) => d.ar)
                          .join(' · ')}`
                      : ''
                  }`
                : '',
            speechAr: w.arabic,
          };
        })
      );
    }

    return hadiths.map((h) => {
      const bab = getBabById(h.babId);
      const locBab = bab ? getLocalizedBab(bab, lang, hadithPack) : null;
      const locH = getLocalizedHadithContent(h, lang, hadithPack, t.common.translationPreparing);
      const secH = secondaryCode
        ? getLocalizedHadithContent(h, secondaryCode, secondaryHadithPack, '')
        : null;
      return {
        cardId: `hadith-${h.id}`,
        babId: h.babId,
        hadithId: h.id,
        frontAr: h.matnAr,
        frontSub: `${ui.hadithPrefix} #${h.id} · ${locBab ? `${locBab.numberLabel}: ${locBab.title}` : ''}`,
        backTitle: locH.translation,
        backSecondary: secH?.translation ?? '',
        backMeta: locBab ? `${locBab.numberLabel}: ${locBab.title}` : '',
        backDetail: locH.lessons[0] || '',
        speechAr: h.matnAr,
      };
    });
  }, [
    deck,
    hadiths,
    lang,
    wordLexiconPack,
    hadithPack,
    secondaryCode,
    secondaryWordLexiconPack,
    secondaryHadithPack,
    t.common.translationPreparing,
    ui.hadithPrefix,
    ui.morphologyLabel,
    ui.rootLabel,
  ]);

  const nowMs = Date.now();
  const filteredCards = useMemo(() => {
    return allFlashcards.filter((c) => {
      if (flashBab !== 'all' && c.babId !== flashBab) return false;
      if (dueOnly && !isCardDue(srsMap[c.cardId], nowMs)) return false;
      return true;
    });
  }, [allFlashcards, flashBab, dueOnly, srsMap, nowMs]);

  const safeIdx = filteredCards.length > 0 ? cardIndex % filteredCards.length : 0;
  const currentCard = filteredCards[safeIdx];
  const currentBab = currentCard ? getBabById(currentCard.babId) : undefined;
  const currentSrs = currentCard ? srsMap[currentCard.cardId] : undefined;

  const deckStats = useMemo(() => {
    const scope =
      flashBab === 'all' ? allFlashcards : allFlashcards.filter((c) => c.babId === flashBab);
    let due = 0;
    let learned = 0;
    let reviewed = 0;
    for (const c of scope) {
      const st = srsMap[c.cardId];
      if (st) {
        reviewed++;
        if (st.intervalDays >= 3) learned++;
      }
      if (isCardDue(st, nowMs)) due++;
    }
    return { total: scope.length, due, learned, reviewed };
  }, [allFlashcards, flashBab, srsMap, nowMs]);

  const handleRate = (rating: SrsRating) => {
    if (!currentCard) return;
    const updated = reviewSrsCard(srsMap[currentCard.cardId], currentCard.cardId, rating);
    const nextMap: SrsProgressMap = { ...srsMap, [currentCard.cardId]: updated };
    saveSrsProgress(nextMap);
    onSrsChange(nextMap);
    setIsFlipped(false);
    setDragOffset(0);
    if (filteredCards.length > 1) {
      setCardIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.code === 'Space' && currentCard) {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentCard]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    setDragOffset(Math.max(-140, Math.min(140, dx)));
  };

  const handlePointerUp = () => {
    if (startXRef.current === null) return;
    if (dragOffset > 75) {
      handleRate('good');
    } else if (dragOffset < -75) {
      handleRate('again');
    } else {
      setDragOffset(0);
    }
    startXRef.current = null;
  };

  return (
    <section aria-label={ui.deckWords} className="space-y-5">
      {/* Controls & Deck Stats */}
      <ManuscriptCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-[var(--bg-surface)] p-1 border border-[var(--border-hairline)]">
            <button
              type="button"
              onClick={() => {
                setDeck('words');
                setCardIndex(0);
                setIsFlipped(false);
              }}
              aria-pressed={deck === 'words'}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                deck === 'words'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {ui.deckWords}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeck('hadiths');
                setCardIndex(0);
                setIsFlipped(false);
              }}
              aria-pressed={deck === 'hadiths'}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                deck === 'hadiths'
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {ui.deckHadiths} (38)
            </button>
          </div>

          <select
            aria-label={ui.allBabs}
            value={flashBab}
            onChange={(e) => {
              setFlashBab(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className="min-h-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
          >
            <option value="all">{ui.allBabs}</option>
            {BABS.map((b) => {
              const loc = getLocalizedBab(b, lang, hadithPack);
              return (
                <option key={b.id} value={b.id}>
                  {loc.numberLabel}: {loc.title}
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={() => {
              setDueOnly((d) => !d);
              setCardIndex(0);
              setIsFlipped(false);
            }}
            aria-pressed={dueOnly}
            className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold border cursor-pointer ${
              dueOnly
                ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
            }`}
          >
            {dueOnly ? `${ui.dueOnly} (${deckStats.due})` : `${ui.allCards} (${deckStats.total})`}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-tabular text-[var(--text-muted)]">
          <span>
            {ui.reviewedLabel} <strong className="text-[var(--text-primary)]">{deckStats.reviewed}</strong>
          </span>
          <span>
            {ui.dueCountLabel}{' '}
            <strong className="text-[var(--accent-gold)]">{deckStats.due}</strong>
          </span>
          <span>
            {ui.learnedLabel}{' '}
            <strong className="text-[var(--accent-emerald)]">{deckStats.learned}</strong>
          </span>
        </div>
      </ManuscriptCard>

      {/* Main 3D Card Stage */}
      {!currentCard ? (
        <ManuscriptCard className="max-w-xl mx-auto p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <h3 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            {ui.emptyDueTitle}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{ui.emptyDueDesc}</p>
          <button
            type="button"
            onClick={() => {
              setDueOnly(false);
              setFlashBab('all');
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer"
          >
            {ui.showAllCardsBtn}
          </button>
        </ManuscriptCard>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Counter + Prev/Next */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-tabular font-semibold">
              {safeIdx + 1} / {filteredCards.length}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              {ui.swipeHintDesktop}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={ui.prevAria}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
                }}
                className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={ui.nextAria}
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) => (prev + 1) % filteredCards.length);
                }}
                className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 3D Flip Container */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative touch-pan-y select-none"
            style={{
              perspective: '1100px',
              transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.04}deg)`,
              transition: startXRef.current === null ? 'transform 220ms ease' : 'none',
            }}
          >
            {/* Swipe Cue Badges */}
            {dragOffset > 35 && (
              <div className="pointer-events-none absolute top-4 start-4 z-20 rounded-xl bg-[#2E6B5E] text-white px-3 py-1 text-xs font-bold shadow">
                {ui.swipeKnow}
              </div>
            )}
            {dragOffset < -35 && (
              <div className="pointer-events-none absolute top-4 end-4 z-20 rounded-xl bg-[#A03848] text-white px-3 py-1 text-xs font-bold shadow">
                {ui.swipeRepeat}
              </div>
            )}

            <div
              className="relative min-h-[300px] sm:min-h-[330px] w-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FRONT FACE */}
              <div
                onClick={() => setIsFlipped(true)}
                className="absolute inset-0 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-sm p-6 sm:p-8 flex flex-col justify-between cursor-pointer"
                style={{
                  backfaceVisibility: 'hidden',
                  borderTop: `4px solid ${currentBab?.colorHex || 'var(--accent-gold)'}`,
                }}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <span className="font-semibold">
                    {deck === 'words' ? ui.cardWordBadge : ui.cardHadithBadge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.speechAr, 'ar-SA', { id: currentCard.cardId });
                    }}
                    className="min-h-[34px] px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--accent-navy)] dark:text-[#93b8f9]" aria-hidden="true" />
                    <span>{ui.listenBtn}</span>
                  </button>
                </div>

                <div className="text-center space-y-3 my-auto py-4">
                  <p
                    dir="rtl"
                    className={`font-arabic-inline text-[var(--text-primary)] leading-loose ${
                      deck === 'words'
                        ? 'text-4xl sm:text-5xl font-bold'
                        : 'text-xl sm:text-2xl line-clamp-5'
                    }`}
                  >
                    {currentCard.frontAr}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                    {currentCard.frontSub}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{ui.showAnswerBtn}</span>
                  </button>
                </div>
              </div>

              {/* BACK FACE */}
              <div
                onClick={() => setIsFlipped(false)}
                className="absolute inset-0 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-sm p-6 sm:p-8 flex flex-col justify-between cursor-pointer overflow-y-auto"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderTop: `4px solid ${currentBab?.colorHex || 'var(--accent-gold)'}`,
                }}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <span className="font-semibold">
                    {deck === 'words' ? ui.backWordBadge : ui.backHadithBadge}
                  </span>
                  <Link
                    to={`/hadisler?hadith=${currentCard.hadithId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline font-medium"
                  >
                    {ui.hadithPrefix} #{currentCard.hadithId}
                  </Link>
                </div>

                <div className="space-y-3 my-auto py-3 text-center">
                  <p className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
                    {currentCard.backTitle}
                  </p>
                  {hasSecondaryLang && secondaryMeta && currentCard.backSecondary && (
                    <p
                      dir={secondaryMeta.dir}
                      className="text-xs sm:text-sm text-[var(--text-muted)] italic leading-relaxed border-t border-[var(--border-hairline)] pt-2"
                    >
                      <span className="not-italic font-semibold me-1.5">
                        [{secondaryMeta.shortLabel}]
                      </span>
                      {currentCard.backSecondary}
                    </p>
                  )}
                  <p className="text-xs text-[var(--accent-gold)] font-semibold">
                    {currentCard.backMeta}
                  </p>
                  {currentCard.backDetail && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {currentCard.backDetail}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(false);
                    }}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-secondary)] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{ui.showFrontBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SM-2 Rating Buttons */}
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 space-y-2.5">
            <p className="text-center text-xs text-[var(--text-muted)]">{ui.ratePrompt}</p>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  {
                    rating: 'again' as const,
                    label: ui.rateAgain,
                    cls: 'bg-[#F7EAED] dark:bg-[#361921] text-[#8C3B4A] dark:text-[#F9A8D4] border-[#8C3B4A]/35',
                  },
                  {
                    rating: 'good' as const,
                    label: ui.rateGood,
                    cls: 'bg-[#E6F2EC] dark:bg-[#132E22] text-[#0F5132] dark:text-[#6EE7B7] border-[#0F5132]/35',
                  },
                  {
                    rating: 'easy' as const,
                    label: ui.rateEasy,
                    cls: 'bg-[var(--accent-gold-soft)] text-[#875C10] dark:text-[var(--accent-gold)] border-[var(--accent-gold)]/45',
                  },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.rating}
                  type="button"
                  onClick={() => handleRate(btn.rating)}
                  className={`min-h-[52px] rounded-xl border px-3 py-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-transform active:scale-95 ${btn.cls}`}
                >
                  <span className="text-xs sm:text-sm font-bold">{btn.label}</span>
                  <span className="text-[11px] opacity-80 font-tabular">
                    {formatLocalizedIntervalLabel(btn.rating, currentSrs, lang, learnPack)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

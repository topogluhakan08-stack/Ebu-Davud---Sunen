import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  RotateCw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { BABS, getBabById } from '../../data/babs';
import type { HadithItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useSpeech } from '../../hooks/useSpeech';
import {
  formatIntervalLabel,
  isCardDue,
  reviewSrsCard,
  saveSrsProgress,
  type SrsProgressMap,
  type SrsRating,
} from '../../utils/learnEngine';
import { ManuscriptCard } from '../ui/Card';

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
  const { settings } = useApp();
  const { speak } = useSpeech();

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
        h.words.map((w) => ({
          cardId: `word-${w.id}`,
          babId: h.babId,
          hadithId: h.id,
          frontAr: w.arabic,
          frontSub: `[${w.transliteration}] · Hadis #${h.id}`,
          backTitle: settings.language === 'fr' ? w.meaningFr : w.meaningTr,
          backMeta: `Kök: ${w.root} · ${w.partOfSpeech}`,
          backDetail: `${w.morphology}${
            w.derivatives.length > 0
              ? ` · Türevler: ${w.derivatives.map((d) => `${d.ar} (${d.tr})`).join(', ')}`
              : ''
          }`,
        }))
      );
    }

    return hadiths.map((h) => ({
      cardId: `hadith-${h.id}`,
      babId: h.babId,
      hadithId: h.id,
      frontAr: h.matnAr,
      frontSub: `Hadis #${h.id} · PDF s. ${h.pdfPage}`,
      backTitle: settings.language === 'fr' ? h.translationFr : h.translationTr,
      backMeta: `${getBabById(h.babId)?.numberLabel || ''}: ${getBabById(h.babId)?.titleTr || ''}`,
      backDetail: h.lessonsTr[0] || '',
    }));
  }, [deck, hadiths, settings.language]);

  const filteredFlashcards = useMemo(() => {
    const now = Date.now();
    return allFlashcards.filter((c) => {
      if (flashBab !== 'all' && c.babId !== flashBab) return false;
      if (dueOnly && !isCardDue(srsMap[c.cardId], now)) return false;
      return true;
    });
  }, [allFlashcards, flashBab, dueOnly, srsMap]);

  const dueCount = useMemo(() => {
    const now = Date.now();
    return allFlashcards.filter(
      (c) => (flashBab === 'all' || c.babId === flashBab) && isCardDue(srsMap[c.cardId], now)
    ).length;
  }, [allFlashcards, flashBab, srsMap]);

  const safeCardIdx =
    filteredFlashcards.length > 0 ? cardIndex % filteredFlashcards.length : 0;
  const activeCard = filteredFlashcards[safeCardIdx];
  const activeCardSrs = activeCard ? srsMap[activeCard.cardId] : undefined;

  const handleRateCard = (rating: SrsRating) => {
    if (!activeCard) return;
    const updated = reviewSrsCard(srsMap[activeCard.cardId], activeCard.cardId, rating);
    const nextMap = { ...srsMap, [activeCard.cardId]: updated };
    onSrsChange(nextMap);
    saveSrsProgress(nextMap);
    setIsFlipped(false);
    setDragOffset(0);
    setCardIndex((prev) => prev + 1);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore swipe starts from interactive buttons/links
    if ((e.target as HTMLElement).closest('button, a')) return;
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    setDragOffset(Math.max(-130, Math.min(130, dx)));
  };

  const handlePointerEnd = () => {
    if (startXRef.current === null) return;
    const dx = dragOffset;
    startXRef.current = null;
    if (dx <= -75) {
      handleRateCard('again');
    } else if (dx >= 75) {
      handleRateCard('good');
    } else {
      setDragOffset(0);
    }
  };

  return (
    <section aria-label="3D Çevirmeli ve Kaydırmalı SM-2 Flash Kartlar" className="space-y-6">
      <ManuscriptCard className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDeck('words');
              setCardIndex(0);
              setIsFlipped(false);
            }}
            aria-pressed={deck === 'words'}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
              deck === 'words'
                ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
            }`}
          >
            Kelime & Kök Kartları ({hadiths.reduce((s, h) => s + h.words.length, 0)})
          </button>
          <button
            type="button"
            onClick={() => {
              setDeck('hadiths');
              setCardIndex(0);
              setIsFlipped(false);
            }}
            aria-pressed={deck === 'hadiths'}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
              deck === 'hadiths'
                ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
            }`}
          >
            Hadis Metni & Hüküm Kartları (38)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>Bab:</span>
            <select
              aria-label="Flash kart bab filtresi"
              value={flashBab}
              onChange={(e) => {
                const val = e.target.value;
                setFlashBab(val === 'all' ? 'all' : Number(val));
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className="min-h-[36px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-2.5 text-xs text-[var(--text-primary)]"
            >
              <option value="all">Tüm Bablar (1–11)</option>
              {BABS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.numberLabel}: {b.titleTr}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setDueOnly((d) => !d);
              setCardIndex(0);
              setIsFlipped(false);
            }}
            aria-pressed={dueOnly}
            className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-medium border cursor-pointer ${
              dueOnly
                ? 'bg-[var(--accent-gold)] text-[#1c1917] border-[var(--accent-gold)] font-semibold'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
            }`}
          >
            Sadece Tekrar Vakti Gelenler ({dueCount})
          </button>
        </div>
      </ManuscriptCard>

      {activeCard ? (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] px-1">
            <span className="font-tabular">
              Kart {safeCardIdx + 1} / {filteredFlashcards.length}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sağa kaydır: İyi · Sola kaydır: Tekrar</span>
            </span>
            <span>
              {activeCardSrs?.repetitions
                ? `Tekrar: ${activeCardSrs.repetitions} · Aralık: ${activeCardSrs.intervalDays} gün`
                : 'Yeni kart'}
            </span>
          </div>

          {/* 3D Perspective Card Container */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            style={{
              perspective: '1200px',
              transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.04}deg)`,
              transition: startXRef.current ? 'none' : 'transform 220ms ease',
            }}
            className="relative touch-pan-y select-none"
          >
            {/* Swipe cue badges */}
            {dragOffset <= -35 && (
              <div className="absolute top-4 right-4 z-20 rounded-xl bg-[#8C3B4A] text-white px-3 py-1 text-xs font-bold shadow">
                ← Tekrar (10 dk)
              </div>
            )}
            {dragOffset >= 35 && (
              <div className="absolute top-4 left-4 z-20 rounded-xl bg-[#0F5132] text-white px-3 py-1 text-xs font-bold shadow">
                İyi Hatırladım →
              </div>
            )}

            <div
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              className="relative min-h-[310px]"
            >
              {/* FRONT FACE */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="w-full min-h-[310px]"
              >
                <ManuscriptCard
                  accentColor="var(--accent-gold)"
                  className="p-6 sm:p-9 min-h-[310px] flex flex-col justify-between gap-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {activeCard.frontSub}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        speak(activeCard.frontAr, 'ar-SA', { id: `srs-${activeCard.cardId}` })
                      }
                      className="min-h-[36px] px-3 py-1 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Arapça Dinle</span>
                    </button>
                  </div>

                  <div className="py-3 text-center space-y-5">
                    <p
                      className={`font-arabic text-[var(--text-primary)] leading-loose ${
                        deck === 'words'
                          ? 'text-4xl sm:text-5xl font-bold'
                          : 'text-xl sm:text-2xl'
                      }`}
                      dir="rtl"
                    >
                      {activeCard.frontAr}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" aria-hidden="true" />
                      <span>Kartı Çevir (Cevabı Gör)</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-hairline)]">
                    <Link
                      to={`/hadisler?hadith=${activeCard.hadithId}`}
                      className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Hadis #{activeCard.hadithId} kartına git</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <span className="text-[11px] text-[var(--text-muted)]">SM-2 Aralıklı Tekrar</span>
                  </div>
                </ManuscriptCard>
              </div>

              {/* BACK FACE */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="absolute inset-0 w-full min-h-[310px]"
              >
                <ManuscriptCard
                  accentColor="var(--accent-emerald)"
                  className="p-6 sm:p-9 min-h-[310px] h-full flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-emerald)]">
                      {activeCard.backMeta}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        speak(activeCard.frontAr, 'ar-SA', { id: `srs-b-${activeCard.cardId}` })
                      }
                      className="min-h-[34px] px-2.5 py-1 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Dinle</span>
                    </button>
                  </div>

                  <div className="space-y-3 my-auto">
                    <p
                      className="font-arabic-inline text-xl text-[var(--text-secondary)] text-right border-b border-[var(--border-hairline)] pb-2"
                      dir="rtl"
                    >
                      {activeCard.frontAr}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
                      {activeCard.backTitle}
                    </p>
                    {activeCard.backDetail && (
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {activeCard.backDetail}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-hairline)]">
                    <Link
                      to={`/hadisler?hadith=${activeCard.hadithId}`}
                      className="text-xs font-medium text-[var(--accent-navy)] dark:text-[#93b8f9] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Hadis #{activeCard.hadithId} kartına git</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ön yüze çevir</span>
                    </button>
                  </div>
                </ManuscriptCard>
              </div>
            </div>
          </div>

          {/* SM-2 Rating Controls */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleRateCard('again')}
              className="min-h-[54px] px-3 py-2 rounded-2xl border border-[#8C3B4A]/40 bg-[#F7EAED] dark:bg-[#361921] text-[#8C3B4A] dark:text-[#F9A8D4] text-xs sm:text-sm font-semibold flex flex-col items-center justify-center cursor-pointer hover:opacity-90"
            >
              <span>Tekrar / Zor</span>
              <span className="text-[11px] opacity-80 font-tabular">
                {formatIntervalLabel('again', activeCardSrs)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleRateCard('good')}
              className="min-h-[54px] px-3 py-2 rounded-2xl border border-[#1D4E89]/40 bg-[#EBF2FA] dark:bg-[#182840] text-[#1D4E89] dark:text-[#93C5FD] text-xs sm:text-sm font-semibold flex flex-col items-center justify-center cursor-pointer hover:opacity-90"
            >
              <span>İyi Hatırladım</span>
              <span className="text-[11px] opacity-80 font-tabular">
                {formatIntervalLabel('good', activeCardSrs)}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleRateCard('easy')}
              className="min-h-[54px] px-3 py-2 rounded-2xl border border-[#0F5132]/40 bg-[#E6F2EC] dark:bg-[#132E22] text-[#0F5132] dark:text-[#6EE7B7] text-xs sm:text-sm font-semibold flex flex-col items-center justify-center cursor-pointer hover:opacity-90"
            >
              <span>Çok Kolay</span>
              <span className="text-[11px] opacity-80 font-tabular">
                {formatIntervalLabel('easy', activeCardSrs)}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <ManuscriptCard className="p-8 text-center space-y-3 max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-[var(--accent-gold)] mx-auto" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            Bu destedeki tüm tekrarlar tamamlandı
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Seçili bab veya tekrar vaktine göre bekleyen kart kalmadı. Tüm kartları serbestçe gözden geçirmek için filtreyi kaldırabilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setDueOnly(false);
              setFlashBab('all');
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs font-semibold cursor-pointer"
          >
            Tüm Kartları Göster
          </button>
        </ManuscriptCard>
      )}
    </section>
  );
};

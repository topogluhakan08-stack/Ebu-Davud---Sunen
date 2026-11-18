import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../utils/localizedText';
import type { SecondaryLanguageCode } from '../../types';

export const DualLanguagePicker: React.FC = () => {
  const { settings, t, setLanguage, setSecondaryLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const primaryShort = settings.language.toUpperCase();
  const secondaryShort =
    settings.secondaryLanguage !== 'none' ? settings.secondaryLanguage.toUpperCase() : null;

  const secondaryChoices = SUPPORTED_LANGUAGES.filter((l) => l.code !== settings.language);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t.nav.langButtonTitle}
        className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--accent-navy)] dark:text-[var(--accent-gold)] shrink-0" aria-hidden="true" />
        <span className="font-tabular">
          {primaryShort}
          {secondaryShort ? `+${secondaryShort}` : ''}
        </span>
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t.nav.langButtonTitle}
          className="absolute end-0 mt-2 w-72 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] shadow-xl p-4 space-y-4 z-50"
        >
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {t.languagePicker.primaryLabel}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const active = settings.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    aria-pressed={active}
                    className={`min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between gap-1.5 border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-navy)] text-white border-[var(--accent-navy)]'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span className="truncate">{lang.nativeName}</span>
                    {active && <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-[var(--border-hairline)]" />

          <div className="space-y-2">
            <label
              htmlFor="header-secondary-lang"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
            >
              {t.languagePicker.secondaryLabel}
            </label>
            <select
              id="header-secondary-lang"
              value={settings.secondaryLanguage}
              onChange={(e) => setSecondaryLanguage(e.target.value as SecondaryLanguageCode)}
              className="w-full min-h-[38px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-3 text-xs font-medium text-[var(--text-primary)]"
            >
              <option value="none">{t.languagePicker.noneOption}</option>
              {secondaryChoices.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.shortLabel})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

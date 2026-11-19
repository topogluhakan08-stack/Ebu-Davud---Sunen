import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LanguageCode, SecondaryLanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';

interface SecondaryArticleBlockProps {
  secondaryLang: SecondaryLanguageCode;
  primaryLang: LanguageCode;
  paragraphs: (string | undefined | null)[];
  title?: string;
}

export const SecondaryArticleBlock: React.FC<SecondaryArticleBlockProps> = ({
  secondaryLang,
  primaryLang,
  paragraphs,
  title,
}) => {
  const { t } = useApp();

  if (secondaryLang === 'none' || secondaryLang === primaryLang) {
    return null;
  }

  const cleanParagraphs = paragraphs.filter((p): p is string => Boolean(p && p.trim()));
  if (cleanParagraphs.length === 0) {
    return null;
  }

  const langLabel = t.languagePicker.languageNames[secondaryLang];
  const summaryLabel = title ? `${langLabel} · ${title}` : `${langLabel} · ${t.common.secondaryExpand}`;

  return (
    <details
      data-secondary-article-block="true"
      className="group mt-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/70 px-4 py-2.5"
    >
      <summary className="cursor-pointer select-none list-none flex items-center justify-between gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
        <span>{summaryLabel}</span>
        <ChevronDown
          className="w-3.5 h-3.5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div
        dir={secondaryLang === 'ar' ? 'rtl' : 'ltr'}
        className={`mt-2.5 pt-2.5 border-t border-[var(--border-hairline)] space-y-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed ${
          secondaryLang === 'ar' ? 'font-arabic-inline text-base leading-loose' : ''
        }`}
      >
        {cleanParagraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
};

import React from 'react';
import { AlertTriangle, BookMarked, Info, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  variant: 'needs_review' | 'extra' | 'tahric' | 'memorized';
  label: string;
}

/**
 * Functional-only semantic badges with explicit icon + text label (no hue-only signaling).
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label }) => {
  if (variant === 'needs_review') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium bg-[var(--status-review-bg)] text-[var(--status-review-text)] border border-[var(--status-review-border)] sm:whitespace-nowrap shrink-0 max-w-full">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'extra') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium bg-[var(--accent-navy-soft)] text-[var(--accent-navy)] dark:text-[#93b8f9] border border-[var(--border-hairline)] sm:whitespace-nowrap shrink-0 max-w-full">
        <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'memorized') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium bg-[var(--accent-emerald-soft)] text-[var(--accent-emerald)] border border-[var(--border-hairline)] sm:whitespace-nowrap shrink-0 max-w-full">
        <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-hairline)] sm:whitespace-nowrap shrink-0 max-w-full">
      <BookMarked className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

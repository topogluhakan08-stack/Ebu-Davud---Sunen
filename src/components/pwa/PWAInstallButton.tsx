import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <Button
        variant="secondary"
        size={compact ? 'sm' : 'md'}
        onClick={() => void install()}
        iconLeft={<Download className="w-4 h-4" />}
        aria-label={t.pwa.install}
      >
        {t.pwa.install}
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowIOSGuide(true)}
          iconLeft={<Share className="w-4 h-4" />}
          aria-label={t.pwa.iosInstall}
        >
          {t.pwa.iosInstall}
        </Button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-pwa-title"
          >
            <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border-hairline)] p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <h3 id="ios-pwa-title" className="text-xl font-semibold text-[var(--text-primary)]">
                  {t.pwa.iosTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] cursor-pointer"
                  aria-label={t.common.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-[var(--text-secondary)] list-decimal list-inside">
                <li>{t.pwa.iosStep1}</li>
                <li>{t.pwa.iosStep2}</li>
              </ol>
              <Button
                variant="primary"
                className="w-full mt-5"
                onClick={() => setShowIOSGuide(false)}
              >
                {t.pwa.iosOk}
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

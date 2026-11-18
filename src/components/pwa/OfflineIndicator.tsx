import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useApp } from '../../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-4 start-4 z-50 flex items-center gap-2 rounded-xl bg-[var(--accent-navy)] text-white px-3.5 py-2 text-xs font-medium shadow-lg border border-white/15"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{t.pwa.offlineBanner}</span>
    </div>
  );
};

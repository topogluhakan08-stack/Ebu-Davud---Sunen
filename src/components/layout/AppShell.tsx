import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  GraduationCap,
  Home,
  Library,
  MapPin,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SecondaryLanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../utils/localizedText';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { DualLanguagePicker } from './DualLanguagePicker';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, t, setLanguage, setSecondaryLanguage, toggleTheme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const primaryLinks = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/ebu-davud', label: t.nav.ebuDavud, icon: UserCheck },
    { to: '/sunen', label: t.nav.sunen, icon: Library },
    { to: '/hadisler', label: t.nav.hadisler, icon: BookOpen },
    { to: '/ogren', label: t.nav.ogren, icon: GraduationCap },
  ];

  const allLinks = [
    ...primaryLinks,
    { to: '/sozluk', label: t.nav.sozluk, icon: Compass },
    { to: '/harita', label: t.nav.harita, icon: MapPin },
    { to: '/ara', label: t.nav.ara, icon: Search },
    { to: '/ayarlar', label: t.nav.ayarlar, icon: Settings },
  ];

  const secondaryChoices = SUPPORTED_LANGUAGES.filter((l) => l.code !== settings.language);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop & Mobile Top Bar (Strictly 3 zones: Wordmark — 5 Nav Links — Compact Lang + Drawer Action) */}
      <header className="sticky top-0 z-30 h-[56px] md:h-[68px] bg-[var(--bg-canvas)]/92 backdrop-blur-md border-b border-[var(--border-hairline)]">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Single-element Wordmark */}
          <Link
            to="/"
            className="font-editorial text-lg sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] truncate min-w-0"
          >
            {t.brandTitle}
          </Link>

          {/* Zone 2: 5 Single-line text nav links (desktop) */}
          <nav
            aria-label={t.nav.allSections}
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {primaryLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-2 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[var(--accent-navy)] dark:text-[var(--accent-gold)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 start-0 end-0 h-0.5 bg-[var(--accent-gold)]"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Compact Dual-Language Switcher + Drawer Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <DualLanguagePicker />

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="navigation-drawer"
              aria-label={t.nav.menuLabel}
              className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 sm:gap-2 hover:bg-[var(--accent-navy-hover)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{t.nav.menuLabel}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Navigation, Tools, Dual-Language & Theme Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.allSections}
          id="navigation-drawer"
        >
          <div
            className="flex-1"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="w-full max-w-sm bg-[var(--bg-card)] ltr:border-l rtl:border-r border-[var(--border-hairline)] h-full overflow-y-auto p-6 flex flex-col justify-between gap-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
                <div>
                  <p className="font-editorial text-xl font-bold text-[var(--text-primary)]">
                    {t.brandTitle}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{t.brandSubtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] cursor-pointer"
                  aria-label={t.nav.closeMenu}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* All 9 Routes */}
              <nav aria-label={t.nav.allSections} className="grid grid-cols-1 gap-1.5">
                {allLinks.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.to === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-[var(--accent-navy)] text-white'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Dual Language & Theme Controls */}
              <div className="pt-4 border-t border-[var(--border-hairline)] space-y-4">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                    {t.settings.languageLabel}
                  </p>
                  <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        aria-pressed={settings.language === lang.code}
                        className={`min-h-[36px] rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          settings.language === lang.code
                            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {lang.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="drawer-secondary-lang"
                    className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
                  >
                    {t.languagePicker.secondaryLabel}
                  </label>
                  <select
                    id="drawer-secondary-lang"
                    value={settings.secondaryLanguage}
                    onChange={(e) => setSecondaryLanguage(e.target.value as SecondaryLanguageCode)}
                    className="w-full min-h-[40px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] px-3 text-xs font-medium text-[var(--text-primary)]"
                  >
                    <option value="none">{t.languagePicker.noneOption}</option>
                    {secondaryChoices.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {t.settings.themeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="min-h-[44px] px-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-medium inline-flex items-center gap-2 hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                  >
                    {settings.theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4 text-[var(--accent-gold)]" aria-hidden="true" />
                        <span>{t.settings.light}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-[var(--accent-navy)]" aria-hidden="true" />
                        <span>{t.settings.dark}</span>
                      </>
                    )}
                  </button>
                </div>

                <PWAInstallButton compact />
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-hairline)] pt-4">
              {t.disclaimer}
            </p>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-24 lg:pb-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]/50 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                {t.brandTitle}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {t.brandSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--text-secondary)]">
              {allLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-[var(--border-hairline)]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
            <p>{t.disclaimer}</p>
            <PWAInstallButton compact />
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Thumb-Zone Bottom Navigation */}
      <nav
        aria-label={t.nav.allSections}
        className="lg:hidden fixed bottom-0 start-0 end-0 z-40 h-[58px] pb-safe bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-hairline)] grid grid-cols-5 items-center"
      >
        {primaryLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `h-full flex flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--accent-navy)] dark:text-[var(--accent-gold)] font-semibold'
                    : 'text-[var(--text-secondary)]'
                }`
              }
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="truncate max-w-full">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <OfflineIndicator />
    </div>
  );
};

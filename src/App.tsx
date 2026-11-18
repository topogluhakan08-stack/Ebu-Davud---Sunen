import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';

const EbuDavudPage = lazy(() =>
  import('./pages/EbuDavudPage').then((m) => ({ default: m.EbuDavudPage }))
);
const SunenPage = lazy(() => import('./pages/SunenPage').then((m) => ({ default: m.SunenPage })));
const HadithsPage = lazy(() =>
  import('./pages/HadithsPage').then((m) => ({ default: m.HadithsPage }))
);
const LearnPage = lazy(() => import('./pages/LearnPage').then((m) => ({ default: m.LearnPage })));
const GlossaryPage = lazy(() =>
  import('./pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage }))
);
const AtlasMapPage = lazy(() =>
  import('./pages/AtlasMapPage').then((m) => ({ default: m.AtlasMapPage }))
);
const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

const LazyDesignSystemPage = import.meta.env.DEV
  ? lazy(() => {
      const devModule = './pages/' + 'DesignSystemPage.tsx';
      return import(/* @vite-ignore */ devModule);
    })
  : null;

const PageFallback = () => {
  const { t } = useApp();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
      <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-card)] px-6 py-4 text-sm text-[var(--text-secondary)]">
        {t.common.loading}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ebu-davud" element={<EbuDavudPage />} />
              <Route path="/sunen" element={<SunenPage />} />
              <Route path="/ayarlar" element={<SettingsPage />} />
              {import.meta.env.DEV && LazyDesignSystemPage && (
                <Route
                  path="/dev/tasarim-sistemi"
                  element={
                    <Suspense fallback={null}>
                      <LazyDesignSystemPage />
                    </Suspense>
                  }
                />
              )}
              <Route path="/hadisler" element={<HadithsPage />} />
              <Route path="/ogren" element={<LearnPage />} />
              <Route path="/sozluk" element={<GlossaryPage />} />
              <Route path="/harita" element={<AtlasMapPage />} />
              <Route path="/ara" element={<SearchPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}

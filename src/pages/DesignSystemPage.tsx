import React, { useState } from 'react';
import { Moon, Sun, Volume2 } from 'lucide-react';
import { BABS } from '../data/babs';
import { useApp } from '../context/AppContext';
import { SymbolicBabIcon } from '../components/icons/SymbolicIllustrations';
import { Button } from '../components/ui/Button';
import { ManuscriptCard, EditorialDivider } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { StatusBadge } from '../components/ui/Badge';
import { SpeechControls } from '../components/tts/SpeechControls';

export const DesignSystemPage: React.FC = () => {
  const { settings, toggleTheme } = useApp();
  const [activeTab, setActiveTab] = useState('colors');
  const [sampleTab, setSampleTab] = useState('tr');
  const isDark = settings.theme === 'dark';

  const coreSwatches = [
    { name: 'Parşömen Zemin (%60)', token: '--bg-canvas', hexLight: '#F7F3EA', hexDark: '#10151E' },
    { name: 'Kart Yüzeyi (%30)', token: '--bg-card', hexLight: '#FBF9F4', hexDark: '#171E2B' },
    { name: 'İkincil Yüzey', token: '--bg-surface', hexLight: '#EFE9DB', hexDark: '#1F2838' },
    { name: 'Derin Lacivert (%10)', token: '--accent-navy', hexLight: '#14284B', hexDark: '#3B67B0' },
    { name: 'Zümrüt Vurgu', token: '--accent-emerald', hexLight: '#0F5132', hexDark: '#2D9F6B' },
    { name: 'Altın Tezhip', token: '--accent-gold', hexLight: '#B8862D', hexDark: '#D9AD5B' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[var(--accent-gold)]">
            Aşama 1 · Tasarım Sistemi Dokümantasyonu &amp; Bileşen Vitrini
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Görsel Hafıza, Renk ve Bileşen Sistemi
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl">
            Sıcak krem parşömen zemini, derin lacivert ve zümrüt vurguları, 11 bab renk kodu, Naskh Arapça tipografisi ve erişilebilir arayüz bileşenleri.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={toggleTheme}
          iconLeft={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        >
          {isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        </Button>
      </div>

      <Tabs
        items={[
          { id: 'colors', label: 'Renk Paleti & 11 Bab' },
          { id: 'typography', label: 'Tipografi Kuralları' },
          { id: 'components', label: 'Temel UI Bileşenleri' },
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'colors' && (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Ana Renk Paleti (60-30-10 Kuralı)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreSwatches.map((swatch) => (
                <ManuscriptCard key={swatch.token} className="p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl border border-[var(--border-hairline)] shrink-0"
                    style={{ backgroundColor: `var(${swatch.token})` }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{swatch.name}</p>
                    <p className="font-tabular text-xs text-[var(--text-secondary)]">
                      {isDark ? swatch.hexDark : swatch.hexLight} · {swatch.token}
                    </p>
                  </div>
                </ManuscriptCard>
              ))}
            </div>
          </section>

          <EditorialDivider />

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              11 Bab Görsel Hafıza Renkleri ve Sembolik SVG İkonları
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BABS.map((bab) => {
                const color = isDark ? bab.colorDarkHex : bab.colorHex;
                const softBg = isDark ? bab.softBgDarkHex : bab.softBgHex;
                return (
                  <ManuscriptCard key={bab.id} accentColor={color} className="p-5 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: softBg }}
                    >
                      <SymbolicBabIcon type={bab.iconType} color={color} className="w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[var(--text-secondary)] font-tabular">
                        {bab.numberLabel} · {color} · s. {bab.pdfPages}
                      </p>
                      <p className="text-base font-bold text-[var(--text-primary)] truncate">
                        {bab.titleTr}
                      </p>
                    </div>
                  </ManuscriptCard>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="space-y-6">
          <ManuscriptCard className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-tabular text-[var(--text-secondary)]">
                Arapça Metin · Amiri / Noto Naskh Arabic · 28px–36px · line-height: 2.15 · RTL
              </p>
              <p className="font-arabic text-[var(--text-primary)]" dir="rtl">
                قَالَ رَسُولُ اللَّهِ ﷺ: «إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَيْهِ مَا لَا يُعْطِي عَلَى الْعُنْفِ»
              </p>
            </div>

            <EditorialDivider />

            <div className="space-y-2">
              <p className="text-xs font-tabular text-[var(--text-secondary)]">
                Editoryal Başlıklar · Cormorant Garamond · text-wrap: balance
              </p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                İmam Ebû Dâvûd es-Sicistânî ve Hadis İlmindeki Yeri
              </h3>
            </div>

            <EditorialDivider />

            <div className="space-y-2">
              <p className="text-xs font-tabular text-[var(--text-secondary)]">
                Gövde Metni · Plus Jakarta Sans · 16px · max-w-prose (65–75ch)
              </p>
              <p className="text-base text-[var(--text-secondary)] max-w-prose leading-relaxed">
                Ebû Dâvûd, hayatı boyunca yazdığı 500.000 hadis arasından senedinde kopukluk bulunmayan ve râvilerinin zayıflığı hakkında görüş birliğine varılmayan ahkâma dair 4.800 rivayeti seçerek es-Sünen&apos;i meydana getirmiştir.
              </p>
            </div>

            <EditorialDivider />

            <div className="space-y-2">
              <p className="text-xs font-tabular text-[var(--text-secondary)]">
                Sayısal Veriler · IBM Plex Mono · tabular-nums
              </p>
              <p className="font-tabular text-lg text-[var(--text-primary)]">
                Hadis No: 4740–4777 · Toplam: 38 Hadis · 11 Bab · 202/817–275/889
              </p>
            </div>
          </ManuscriptCard>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-6">
          <ManuscriptCard className="p-6 space-y-5">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Düğme Varyantları (44px+ Dokunma Hedefi)</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Birincil Lacivert</Button>
              <Button variant="emerald" iconLeft={<Volume2 className="w-4 h-4" />}>
                Zümrüt Ses
              </Button>
              <Button variant="gold">Altın Vurgu</Button>
              <Button variant="secondary">Parşömen İkincil</Button>
              <Button variant="outline">Çerçeveli</Button>
              <Button variant="ghost">Sade Metin</Button>
            </div>
          </ManuscriptCard>

          <ManuscriptCard className="p-6 space-y-5">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Sekmeler ve Fonksiyonel Durum Rozetleri</h2>
            <Tabs
              variant="underline"
              items={[
                { id: 'tr', label: 'Türkçe Tam Meal' },
                { id: 'fr', label: 'Fransızca Çeviri' },
                { id: 'words', label: 'Kelime Kelime Tablo', count: 14 },
              ]}
              activeId={sampleTab}
              onChange={setSampleTab}
            />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <StatusBadge variant="needs_review" label="needs_review · İnceleme Gerekiyor" />
              <StatusBadge variant="extra" label="Ek açıklama" />
              <StatusBadge variant="memorized" label="Ezberlendi" />
              <StatusBadge variant="tahric" label="Müslim [4605]" />
            </div>
          </ManuscriptCard>

          <ManuscriptCard className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Sesli Okuma (Web Speech API) Kontrol Çubuğu</h2>
            <SpeechControls
              id="ds-preview"
              arabicText="إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ"
              turkishText="Şüphesiz Allah refîktir, yumuşaklığı sever."
            />
          </ManuscriptCard>
        </div>
      )}
    </div>
  );
};

export default DesignSystemPage;

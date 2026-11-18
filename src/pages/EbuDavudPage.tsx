import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  ExternalLink,
  GitBranch,
  GraduationCap,
  History,
  Library,
  MapPin,
  Quote,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';
import rawEbuDavudData from '../data/ebu-davud.json';
import type { EbuDavudData, ScholarWork } from '../types';
import { useApp } from '../context/AppContext';
import { ManuscriptCard, EditorialDivider } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { SpeechControls } from '../components/tts/SpeechControls';
import { TravelMap } from '../components/ebu-davud/TravelMap';
import { TeacherStudentGraph } from '../components/ebu-davud/TeacherStudentGraph';

const data = rawEbuDavudData as EbuDavudData;

type WorkStatusFilter = 'all' | ScholarWork['status'];

const STATUS_META: Record<ScholarWork['status'], { label: string; dotColor: string }> = {
  extant: { label: 'Günümüze ulaştı', dotColor: 'var(--accent-emerald)' },
  partial: { label: 'Kısmen ulaştı', dotColor: 'var(--accent-gold)' },
  unknown: { label: 'Durumu bilinmiyor', dotColor: 'var(--text-muted)' },
};

const SECTION_LINKS = [
  { id: 'kimlik-hayat', label: 'Hayatı & Kimliği' },
  { id: 'harita', label: '14 Şehir Haritası' },
  { id: 'zaman-cizelgesi', label: 'Zaman Çizelgesi' },
  { id: 'ag', label: 'Hoca-Talebe Ağı' },
  { id: 'hadisciligi', label: 'Hadisçiliği & Övgüler' },
  { id: 'fikih-zuhd', label: 'Fıkıh, Selefiyye & Zühd' },
  { id: 'sozleri', label: 'Sözleri & 4 Hadis' },
  { id: 'eserleri', label: 'Eserleri (9 + 10)' },
  { id: 'kaynakca', label: 'Çalışmalar & Bibliyografya' },
];

export const EbuDavudPage: React.FC = () => {
  const { settings, t } = useApp();
  const [activeCityId, setActiveCityId] = useState<string>('sicistan');
  const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatusFilter>('all');
  const [workSearch, setWorkSearch] = useState('');

  const filteredMainWorks = useMemo(() => {
    const q = workSearch.trim().toLocaleLowerCase('tr');
    return data.works.mainWorks.filter((work) => {
      const matchesStatus = workStatusFilter === 'all' || work.status === workStatusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const haystack = [
        work.title,
        ...(work.altTitles ?? []),
        work.summaryTr,
        work.manuscriptInfo ?? '',
        ...(work.editions ?? []),
      ]
        .join(' ')
        .toLocaleLowerCase('tr');
      return haystack.includes(q);
    });
  }, [workStatusFilter, workSearch]);

  const heroNarrationTr = `${data.meta.fullNameTr}. ${data.meta.subtitleTr} ${data.biography.birthNote} ${data.biography.deathAndBurial}`;
  const fullArabicName =
    'أَبُو دَاوُدَ سُلَيْمَانُ بْنُ الْأَشْعَثِ بْنِ إِسْحَاقَ السِّجِسْتَانِيُّ الْأَزْدِيُّ';

  const bioNarrationTr = [
    data.biography.birthNote,
    data.biography.sijistanNote,
    data.biography.lineageNisbe,
    data.biography.ancestry,
    data.biography.familyWealth,
    data.biography.earlyEducation,
    data.biography.teachersCountNote,
    data.biography.teachersListNote,
    data.biography.sonAbdullah,
    data.biography.brotherMuhammed,
    data.biography.ahmedBinHanbelRelation,
    data.biography.tarsusAndLaterYears,
    data.biography.basraSettlementAndZanj,
    data.biography.deathAndBurial,
  ].join(' ');

  const timelineNarrationTr = data.timeline
    .map((item) => `${item.yearLabel}: ${item.titleTr}. ${item.descriptionTr}`)
    .join(' ');

  const hadithNarrationTr = [
    data.hadithScholarship.summaryTr,
    ...data.hadithScholarship.critiqueExamples,
    ...data.hadithScholarship.praises.map((p) => `${p.scholar}: ${p.textTr}`),
  ].join(' ');

  const fiqhNarrationTr = [
    data.fiqhAndMethodology.fiqhAffiliationTr,
    data.fiqhAndMethodology.selefiyyeAndZuhdTr,
    data.fiqhAndMethodology.emirMuvaffakStoryTr,
  ].join(' ');

  const worksNarrationTr = data.works.mainWorks
    .map((w) => `${w.order}. ${w.title}. ${w.summaryTr}`)
    .join(' ');

  const studiesNarrationTr = data.studiesAboutHim
    .map((s) => `${s.author}: ${s.title}. ${s.details}`)
    .join(' ');

  const sayings = useMemo(
    () => data.sayingsAndFourHadiths.filter((q) => q.kind === 'saying'),
    []
  );
  const fourHadiths = useMemo(
    () => data.sayingsAndFourHadiths.filter((q) => q.kind === 'four_hadiths'),
    []
  );

  const handleSelectCityFromTimeline = (cityId?: string) => {
    if (!cityId) return;
    setActiveCityId(cityId);
    const el = document.getElementById('harita');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (settings.language !== 'tr') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.ebuDavudPage.kicker}
          </p>
          <p
            className="font-arabic text-3xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
            dir="rtl"
          >
            {data.meta.titleAr}
          </p>
          <p className="font-arabic-inline text-base sm:text-xl text-[var(--text-secondary)]" dir="rtl">
            {fullArabicName}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {t.ebuDavudPage.title}
          </h1>
          <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 sm:p-5 space-y-3">
            <span className="inline-block rounded-lg bg-[var(--accent-gold-soft)] text-[#875C10] dark:text-[var(--accent-gold)] px-2.5 py-0.5 text-xs font-bold">
              {t.preparing.badge}
            </span>
            <p className="text-sm sm:text-base text-[var(--text-primary)]">
              {t.common.translationPreparing}
            </p>
            <div className="pt-1">
              <Link
                to="/"
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-[var(--accent-navy)] text-white text-xs sm:text-sm font-semibold hover:bg-[var(--accent-navy-hover)]"
              >
                {t.preparing.backHome}
              </Link>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{t.disclaimer}</p>
        </ManuscriptCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Calligraphy Hero */}
      <section aria-labelledby="ebu-davud-hero-title">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)] font-tabular">
              <span>TDV İslâm Ansiklopedisi · Cilt 10, s. 119–121 · {data.meta.author}</span>
              <span>{data.biography.birthDeath}</span>
            </div>

            <div className="space-y-3">
              <p
                className="font-arabic text-3xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
                dir="rtl"
              >
                {data.meta.titleAr}
              </p>
              <p
                className="font-arabic-inline text-base sm:text-xl text-[var(--text-secondary)]"
                dir="rtl"
              >
                {fullArabicName}
              </p>
              <h1
                id="ebu-davud-hero-title"
                className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                {data.meta.titleTr}
              </h1>
              <p className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                {data.meta.fullNameTr}
              </p>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                {data.meta.subtitleTr}
              </p>
            </div>

            {/* 4-Metric KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-navy)]">~300</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Hadis aldığı hoca (İbn Hacer)
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-emerald)]">
                  500.000
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Hayatı boyunca yazdığı hadis
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-gold)]">4.800</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  es-Sünen’e seçtiği hadis
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--text-primary)]">14</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  İlim yolculuğu şehri
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id="ebu-davud-hero"
                arabicText={fullArabicName}
                turkishText={heroNarrationTr}
              />
            </div>
          </div>
        </ManuscriptCard>
      </section>

      {/* Section Jump Bar */}
      <nav
        aria-label="Sayfa içi bölümler"
        className="flex items-center md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible pb-2 border-b border-[var(--border-hairline)]"
      >
        {SECTION_LINKS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-hairline)] whitespace-nowrap shrink-0 inline-flex items-center transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* 2. Kimliği, Ailesi & Hayatı */}
      <section id="kimlik-hayat" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Biyografi &amp; İlim Tahsili</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Kimliği, Ailesi ve Hayatı
            </h2>
          </div>
          <SpeechControls id="ebu-davud-bio" compact turkishText={bioNarrationTr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <p className="text-[var(--text-primary)] font-medium">{data.biography.birthNote}</p>
              <p>{data.biography.sijistanNote}</p>
              <p>{data.biography.lineageNisbe}</p>
              <p>{data.biography.ancestry}</p>
              <p>{data.biography.familyWealth}</p>
            </div>

            <EditorialDivider />

            <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Seyahatleri ve Hocaları
              </h3>
              <p>{data.biography.earlyEducation}</p>
              <p>{data.biography.teachersCountNote}</p>
              <p>{data.biography.teachersListNote}</p>
            </div>
          </ManuscriptCard>

          <ManuscriptCard className="lg:col-span-5 p-6 sm:p-8 space-y-5">
            <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Ailesi ve Bağdat Meclisleri
              </h3>
              <p>{data.biography.sonAbdullah}</p>
              <p>{data.biography.brotherMuhammed}</p>
              <p>{data.biography.ahmedBinHanbelRelation}</p>
            </div>

            <EditorialDivider />

            <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Tarsus, Basra’ya Yerleşme ve Vefatı
              </h3>
              <p>{data.biography.tarsusAndLaterYears}</p>
              <p>{data.biography.basraSettlementAndZanj}</p>
              <p className="font-medium text-[var(--text-primary)]">
                {data.biography.deathAndBurial}
              </p>
            </div>
          </ManuscriptCard>
        </div>

        {/* Üç Büyük Üstadı Karşılaştırma Kartları */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Hocaları Hakkındaki Meşhur Değerlendirmesi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ManuscriptCard accentColor="var(--accent-navy)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-navy)]">Hadis Ezberi</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.hadithMemorization}
              </p>
            </ManuscriptCard>
            <ManuscriptCard accentColor="var(--accent-emerald)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-emerald)]">Fıkıh Anlayışı</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.fiqhUnderstanding}
              </p>
            </ManuscriptCard>
            <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 space-y-2">
              <p className="text-xs font-medium text-[var(--accent-gold)]">İlel İlmi</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {data.biography.threeMastersEvaluation.ilalKnowledge}
              </p>
            </ManuscriptCard>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 3. 14 Şehirlik Seyahat Haritası */}
      <section id="harita" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>İlim Coğrafyası · 14 Merkez</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Ebû Dâvûd’un 14 Şehirlik Seyahat Haritası
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            18 yaşında Bağdat ve Basra ile başlayan, Mekke’den Kûfe’ye, Şam ve Cezîre’den
            Horasan, Belh, Mısır, Tarsus ve Herat’a uzanan ilim duraklarını inceleyin veya
            yolculuğu adım adım oynatın.
          </p>
        </div>

        <TravelMap
          cities={data.cities}
          activeCityId={activeCityId}
          onSelectCity={setActiveCityId}
        />
      </section>

      <EditorialDivider />

      {/* 4. Zaman Çizelgesi */}
      <section id="zaman-cizelgesi" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <History className="w-4 h-4" aria-hidden="true" />
              <span>Kronoloji · 202–275 / 817–889</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Hayatının Zaman Çizelgesi
            </h2>
          </div>
          <SpeechControls id="ebu-davud-timeline" compact turkishText={timelineNarrationTr} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.timeline.map((event, idx) => (
            <ManuscriptCard
              key={event.id}
              accentColor={
                event.cityId === activeCityId ? 'var(--accent-emerald)' : undefined
              }
              className="p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-tabular text-[var(--accent-gold)]">
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  <span>{event.yearLabel}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{event.titleTr}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {event.descriptionTr}
                </p>
              </div>

              {event.cityId && (
                <button
                  type="button"
                  onClick={() => handleSelectCityFromTimeline(event.cityId)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5 self-start transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-emerald)]" aria-hidden="true" />
                  <span>Haritada Göster</span>
                </button>
              )}
            </ManuscriptCard>
          ))}
        </div>
      </section>

      <EditorialDivider />

      {/* 5. Hoca-Talebe İlim Ağı */}
      <section id="ag" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)]">
            <GitBranch className="w-4 h-4" aria-hidden="true" />
            <span>İsnad ve İlim Zinciri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Hoca-Talebe İlim Ağı
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            Düğümlere tıklayarak Ebû Dâvûd’un hocaları, ailesi ve başta Tirmizî, Lü’lüî, İbn
            Dâse, İbn Ebü’d-Dünyâ ve Hallâl olmak üzere talebeleri hakkındaki ayrıntıları görün.
          </p>
        </div>

        <TeacherStudentGraph nodes={data.network.nodes} links={data.network.links} />
      </section>

      <EditorialDivider />

      {/* 6. Hadisçiliği ve Âlimlerin Övgüleri */}
      <section id="hadisciligi" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
              <span>Cerh-Ta‘dîl &amp; Rivayet Titizliği</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Hadisçiliği ve Âlimlerin Övgüleri
            </h2>
          </div>
          <SpeechControls id="ebu-davud-hadith" compact turkishText={hadithNarrationTr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {data.hadithScholarship.summaryTr}
            </p>

            {/* Sayısal Karşılaştırma Çubuğu */}
            <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4 space-y-3">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Hadis Birikimi ve Seçme Oranı
              </p>
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>Hayatı boyunca yazdığı hadis</span>
                    <span className="font-bold text-[var(--text-primary)]">500.000</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full w-full bg-[var(--accent-navy)] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>Rahatlıkla müzakere edebildiği hadis (Muhammed b. Mahled)</span>
                    <span className="font-bold text-[var(--text-primary)]">100.000</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div className="h-full w-[20%] bg-[var(--accent-gold)] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-tabular text-[var(--text-secondary)] mb-1">
                    <span>es-Sünen’e seçtiği rivayet</span>
                    <span className="font-bold text-[var(--text-primary)]">4.800</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-emerald)] rounded-full"
                      style={{ width: '2.5%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="lg:col-span-5 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Râvi Tenkidinde Tavizsiz Tutumu
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Yakını bile olsa hadis rivayetinde liyakatsiz bulduğu kimseleri eleştirmekten
              çekinmediğine dair Zehebî’nin <em>Mîzânü’l-i‘tidâl</em>’inde aktarılan örnekler:
            </p>
            <ul className="space-y-3">
              {data.hadithScholarship.critiqueExamples.map((example) => (
                <li
                  key={example}
                  className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] leading-relaxed"
                >
                  {example}
                </li>
              ))}
            </ul>
          </ManuscriptCard>
        </div>

        {/* 8 Scholar Praise Quotes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.hadithScholarship.praises.map((praise) => (
            <ManuscriptCard key={praise.id} className="p-5 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-[var(--accent-gold)]">{praise.roleTr}</p>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{praise.scholar}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {praise.textTr}
                </p>
              </div>
            </ManuscriptCard>
          ))}
        </div>
      </section>

      <EditorialDivider />

      {/* 7. Fıkhî Kimliği, Selefiyye ve Zühdü */}
      <section id="fikih-zuhd" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)]">
              <Scale className="w-4 h-4" aria-hidden="true" />
              <span>Mezhep Nispeti, Metodoloji &amp; İlim İzzeti</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Fıkhî Kimliği, Selefiyye ve Zühdü
            </h2>
          </div>
          <SpeechControls id="ebu-davud-fiqh" compact turkishText={fiqhNarrationTr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Tabakat Eserlerindeki Yeri
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.fiqhAffiliationTr}
            </p>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-emerald)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Selefiyye Metodu ve Zühd
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.selefiyyeAndZuhdTr}
            </p>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Emîr Muvaffak’a Verdiği Cevap
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.fiqhAndMethodology.emirMuvaffakStoryTr}
            </p>
          </ManuscriptCard>
        </div>
      </section>

      <EditorialDivider />

      {/* 8. Güzel Sözleri ve Dört Hadis Seçkisi */}
      <section id="sozleri" className="scroll-mt-24 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
            <Quote className="w-4 h-4" aria-hidden="true" />
            <span>Hikmetli Sözleri &amp; Hadis Özeti</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Güzel Sözleri (3) ve Dört Hadis Seçkisi (4)
            </h2>
            <StatusBadge
              variant="extra"
              label="Ek açıklama · Arapça ve Fransızca metinler destek amaçlıdır"
            />
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            Ebû Dâvûd, yazdığı hadisler içinden insanın dinî hayatını yaşayabilmesi için dört
            hadisi yeterli gördüğünü ifade etmiştir.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Güzel Sözleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sayings.map((item) => (
                <ManuscriptCard
                  key={item.id}
                  accentColor="var(--accent-gold)"
                  className="p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[var(--accent-gold)]">
                        {item.titleTr}
                      </span>
                      {item.isExtraArFr && <StatusBadge variant="extra" label="Ek açıklama AR/FR" />}
                    </div>
                    <p
                      className="font-arabic-inline text-xl leading-loose text-[var(--accent-navy)] dark:text-[var(--accent-gold)]"
                      dir="rtl"
                    >
                      {item.textAr}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                      “{item.textTr}”
                    </p>
                    <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                      {item.textFr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-hairline)]">
                    <SpeechControls
                      id={item.id}
                      compact
                      arabicText={item.textAr}
                      turkishText={item.textTr}
                      frenchText={item.textFr}
                    />
                  </div>
                </ManuscriptCard>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              İnsan Hayatına Kâfi Gördüğü Dört Hadis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fourHadiths.map((item) => (
                <ManuscriptCard
                  key={item.id}
                  accentColor="var(--accent-emerald)"
                  className="p-5 sm:p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[var(--accent-emerald)]">
                        {item.titleTr}
                      </span>
                      {item.isExtraArFr && <StatusBadge variant="extra" label="Ek açıklama AR/FR" />}
                    </div>
                    <p
                      className="font-arabic-inline text-2xl leading-loose text-[var(--accent-navy)] dark:text-[var(--accent-gold)]"
                      dir="rtl"
                    >
                      {item.textAr}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed">
                      {item.textTr}
                    </p>
                    <p className="text-xs italic text-[var(--text-secondary)] leading-relaxed">
                      {item.textFr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-hairline)]">
                    <SpeechControls
                      id={item.id}
                      compact
                      arabicText={item.textAr}
                      turkishText={item.textTr}
                      frenchText={item.textFr}
                    />
                  </div>
                </ManuscriptCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 9. Eserleri (9 Ana + 10 Diğer) */}
      <section id="eserleri" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)]">
              <Library className="w-4 h-4" aria-hidden="true" />
              <span>Telifatı · 9 Ana Eser &amp; 10 Diğer Eser</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Ebû Dâvûd’un Eserleri
            </h2>
          </div>
          <SpeechControls id="ebu-davud-works" compact turkishText={worksNarrationTr} />
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
            {(
              [
                { id: 'all', label: `Tümü (${data.works.mainWorks.length})` },
                { id: 'extant', label: 'Günümüze Ulaşanlar' },
                { id: 'partial', label: 'Kısmen Ulaşanlar' },
                { id: 'unknown', label: 'Durumu Bilinmeyen' },
              ] as { id: WorkStatusFilter; label: string }[]
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setWorkStatusFilter(btn.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  workStatusFilter === btn.id
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <label className="relative flex items-center min-w-[240px] flex-1 sm:flex-initial">
            <Search
              className="w-4 h-4 text-[var(--text-muted)] absolute start-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={workSearch}
              onChange={(e) => setWorkSearch(e.target.value)}
              placeholder="Eser, yazma veya neşir ara..."
              className="w-full min-h-[40px] ps-9 pe-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </label>
        </div>

        {/* 9 Main Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMainWorks.map((work) => {
            const statusInfo = STATUS_META[work.status];
            return (
              <ManuscriptCard
                key={work.title}
                accentColor={statusInfo.dotColor}
                className="p-5 sm:p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-tabular font-semibold text-[var(--text-secondary)]">
                      Eser {work.order}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: statusInfo.dotColor }}
                        aria-hidden="true"
                      />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{work.title}</h3>
                    {work.altTitles && work.altTitles.length > 0 && (
                      <p className="text-xs italic text-[var(--text-secondary)] mt-1">
                        Diğer adları: {work.altTitles.join(' · ')}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {work.summaryTr}
                  </p>

                  {work.manuscriptInfo && (
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] leading-relaxed">
                      <span className="font-semibold">Yazma Nüsha: </span>
                      {work.manuscriptInfo}
                    </div>
                  )}

                  {work.editions && work.editions.length > 0 && (
                    <div className="text-xs text-[var(--text-secondary)] space-y-1">
                      <p className="font-semibold text-[var(--text-primary)]">Baskılar / Neşirler</p>
                      <ul className="space-y-1">
                        {work.editions.map((ed) => (
                          <li key={ed}>· {ed}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ManuscriptCard>
            );
          })}
        </div>

        {/* 10 Other Works */}
        <ManuscriptCard className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Kaynaklarda Adı Geçen Diğer Eserleri ({data.works.otherWorks.length})
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              Günümüze ulaşıp ulaşmadıkları bilinmeyen eserler
            </span>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.works.otherWorks.map((title, idx) => (
              <li
                key={title}
                className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] flex items-center gap-2.5"
              >
                <span className="font-tabular text-xs font-semibold text-[var(--accent-gold)]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{title}</span>
              </li>
            ))}
          </ol>
        </ManuscriptCard>
      </section>

      <EditorialDivider />

      {/* 10. Hakkındaki Çalışmalar & Bibliyografya */}
      <section id="kaynakca" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Akademik Literatür</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Hakkındaki Çalışmalar ({data.studiesAboutHim.length}) ve Bibliyografya (
              {data.bibliography.length})
            </h2>
          </div>
          <SpeechControls id="ebu-davud-bib" compact turkishText={studiesNarrationTr} />
        </div>

        <ManuscriptCard className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Hakkında Yapılan Müstakil Çalışmalar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.studiesAboutHim.map((study) => (
              <div
                key={study.title}
                className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1.5"
              >
                <p className="text-xs font-semibold text-[var(--accent-navy)]">{study.author}</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">{study.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{study.details}</p>
              </div>
            ))}
          </div>
        </ManuscriptCard>

        <ManuscriptCard className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Bibliyografya</h3>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-[var(--text-secondary)]">
            {data.bibliography.map((entry) => (
              <li key={entry.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="font-tabular text-xs font-semibold text-[var(--accent-gold)] mt-1 shrink-0">
                  {String(entry.id).padStart(2, '0')}.
                </span>
                <span>{entry.citation}</span>
              </li>
            ))}
          </ol>

          <EditorialDivider />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
            <span>{data.meta.sourceNote}</span>
            <a
              href={data.meta.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-navy)] hover:underline"
            >
              <span>TDV İslâm Ansiklopedisi Kaynağı</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </ManuscriptCard>
      </section>
    </div>
  );
};

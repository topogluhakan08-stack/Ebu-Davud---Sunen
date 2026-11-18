import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  Globe2,
  Library,
  Scale,
  ScrollText,
  Users,
} from 'lucide-react';
import rawSunenData from '../data/sunen.json';
import type { SunenData } from '../types';
import { useApp } from '../context/AppContext';
import { EditorialDivider, ManuscriptCard } from '../components/ui/Card';
import { SpeechControls } from '../components/tts/SpeechControls';
import { SunenCharts } from '../components/sunen/SunenCharts';
import { EditionsMap } from '../components/sunen/EditionsMap';
import { CommentaryShelf } from '../components/sunen/CommentaryShelf';

const data = rawSunenData as SunenData;

const SECTION_LINKS = [
  { id: 'telif-metod', label: 'Telif & Risâle (6 İlke)' },
  { id: 'sihhat-raviler', label: 'Sıhhat, Bablar & Râviler' },
  { id: 'sayisal-veriler', label: 'Sayısal Veriler & Grafikler' },
  { id: 'nesirler-haritasi', label: 'Neşirler Haritası (8 Merkez)' },
  { id: 'serh-kitapligi', label: 'Şerh Kitaplığı (23 Eser)' },
  { id: 'bibliyografya', label: 'Bibliyografya (12)' },
];

export const SunenPage: React.FC = () => {
  const { settings, t } = useApp();
  const { compilationAndPurpose: comp, authenticityAndStructure: auth } = data;

  if (settings.language !== 'tr') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            {t.sunenPage.kicker}
          </p>
          <p
            className="font-arabic text-3xl sm:text-5xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)] leading-relaxed"
            dir="rtl"
          >
            {data.meta.titleAr}
          </p>
          <p className="font-arabic-inline text-base sm:text-xl text-[var(--text-secondary)]" dir="rtl">
            سُنَنُ أَبِي دَاوُدَ السِّجِسْتَانِيِّ
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {t.sunenPage.title}
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

  const heroNarrationTr = `${data.meta.titleTr}. ${data.meta.subtitleTr} ${comp.summaryTr}`;
  const compilationNarrationTr = [
    comp.summaryTr,
    comp.mekkeLetter.introTr,
    ...comp.mekkeLetter.principles.map((p) => `${p.order}. ${p.titleTr}: ${p.detailTr}`),
    comp.specialNotes.sufficeWithSunenTr,
    comp.specialNotes.munkerAndSilenceRuleTr,
    comp.specialNotes.ahkamScopeTr,
    comp.specialNotes.elMerasilConnectionTr,
  ].join(' ');

  const authenticityNarrationTr = [
    auth.tiersSummaryTr,
    ...auth.tiers.map((t) => `${t.labelTr}: ${t.detailTr}`),
    auth.reyAndKiyasPreferenceTr,
    auth.generalGradingAndRankTr,
    auth.babNamingQuirkTr,
    ...auth.rawis.map((r) => `${r.nameTr}: ${r.detailTr}`),
  ].join(' ');

  const bibNarrationTr = data.bibliography.map((b) => `${b.id}. ${b.citation}`).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Calligraphy Hero */}
      <section aria-labelledby="sunen-hero-title">
        <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)] font-tabular">
              <span>TDV İslâm Ansiklopedisi · Cilt 38, s. 145–147 · {data.meta.author}</span>
              <span>Kütüb-i Sitte · 3. Kitap</span>
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
                سُنَنُ أَبِي دَاوُدَ السِّجِسْتَانِيِّ
              </p>
              <h1
                id="sunen-hero-title"
                className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                {data.meta.titleTr}
              </h1>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                {data.meta.subtitleTr} Ahmed b. Hanbel’e arz edilen, yalnız ahkâm hadislerini
                derleyen ve <em>Risâle ilâ ehli Mekke</em> ile usulü müellifi tarafından açıklanan
                temel hadis kaynağı.
              </p>
            </div>

            {/* 4-Metric KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                  {comp.hadithTotals.totalWritten.toLocaleString('tr-TR')}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Hayatı boyunca yazdığı hadis
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-emerald)]">
                  {comp.hadithTotals.selectedInSunen.toLocaleString('tr-TR')}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  es-Sünen’e seçilen ahkâm hadisi
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--accent-gold)]">
                  ~{comp.hadithTotals.murselApprox}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Mürsel rivayet (el-Merâsîl ile paralel)
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-4">
                <p className="font-tabular text-2xl font-bold text-[var(--text-primary)]">3. Sıra</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Kütüb-i Sitte’deki yeri · {data.printCities.length} neşir merkezi
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)]">
              <SpeechControls
                id="sunen-hero"
                arabicText="السُّنَنُ، سُنَنُ أَبِي دَاوُدَ السِّجِسْتَانِيِّ"
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

      {/* 2. Telif Amacı & Risâle ilâ ehli Mekke (6 İlke) */}
      <section id="telif-metod" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
              <ScrollText className="w-4 h-4" aria-hidden="true" />
              <span>Telif Usulü &amp; Mekkelilere Mektup</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Telif Amacı ve <em>Risâle ilâ ehli Mekke</em> İlkeleri
            </h2>
          </div>
          <SpeechControls id="sunen-compilation" compact turkishText={compilationNarrationTr} />
        </div>

        <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 sm:p-8 space-y-6">
          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed max-w-4xl">
            {comp.summaryTr}
          </p>

          <EditorialDivider />

          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {comp.mekkeLetter.title}
              </h3>
              <span className="text-xs font-tabular text-[var(--text-secondary)]">
                Diğer adıyla: <em>{comp.mekkeLetter.altTitle}</em> · nşr.{' '}
                {comp.mekkeLetter.editor}, {comp.mekkeLetter.publication}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{comp.mekkeLetter.introTr}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {comp.mekkeLetter.principles.map((p) => (
                <div
                  key={p.order}
                  className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-tabular text-[var(--accent-gold)]">
                    <span>İlke 0{p.order}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{p.titleTr}</h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {p.detailTr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ManuscriptCard>

        {/* 4 Special Methodological Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ManuscriptCard accentColor="var(--accent-emerald)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-emerald)]">
              Sünnet İçin Yeterlilik Beyanı
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.sufficeWithSunenTr}
            </p>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-gold)]">
              Münker / Zayıf İşareti ve Delil Kuralı
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.munkerAndSilenceRuleTr}
            </p>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-navy)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              Yalnız Ahkâm Hadisleri &amp; ~600 Mürsel
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.ahkamScopeTr}
            </p>
          </ManuscriptCard>

          <ManuscriptCard accentColor="var(--accent-gold)" className="p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[var(--accent-gold)]">
              <em>el-Merâsîl</em> Tekmilesi · {comp.specialNotes.kopruluManuscriptRef}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {comp.specialNotes.elMerasilConnectionTr}
            </p>
            <p className="text-xs italic font-medium text-[var(--text-primary)] pt-1">
              Nüsha kaydı: “{comp.specialNotes.colophonQuote}”
            </p>
          </ManuscriptCard>
        </div>
      </section>

      <EditorialDivider />

      {/* 3. Sıhhat Yapısı, Bablar & 3 Meşhur Râvi */}
      <section id="sihhat-raviler" className="scroll-mt-24 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
              <Scale className="w-4 h-4" aria-hidden="true" />
              <span>İsnad Dereceleri, Tertip &amp; Nakil Zinciri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Sıhhat Yapısı, Bab Özellikleri ve Başlıca Râviler
            </h2>
          </div>
          <SpeechControls id="sunen-authenticity" compact turkishText={authenticityNarrationTr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ManuscriptCard className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Rivayetlerin Beş Sıhhat Katmanı
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {auth.tiersSummaryTr}
              </p>
            </div>

            <div className="space-y-3">
              {auth.tiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-tabular font-semibold text-[var(--accent-gold)]">
                      Katman 0{idx + 1}
                    </span>
                    <span className="font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                      {tier.shareNote}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{tier.labelTr}</h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {tier.detailTr}
                  </p>
                </div>
              ))}
            </div>
          </ManuscriptCard>

          <div className="lg:col-span-5 space-y-4">
            <ManuscriptCard accentColor="var(--accent-navy)" className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Re’y ve Kıyasa Tercih Ölçüsü
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.reyAndKiyasPreferenceTr}
              </p>
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-emerald)" className="p-6 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-tabular text-[var(--accent-emerald)]">
                <span>Kütüb-i Sitte Sırası</span>
                <span>{auth.kutubSitteCitation}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Hasen Kabulü ve Üçüncü Sıra
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.generalGradingAndRankTr}
              </p>
            </ManuscriptCard>

            <ManuscriptCard accentColor="var(--accent-gold)" className="p-6 space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Özel Bab İsimlendirmeleri
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {auth.babNamingQuirkTr}
              </p>
            </ManuscriptCard>
          </div>
        </div>

        {/* 3 Major Rawis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>es-Sünen’in Üç Meşhur Râvisi</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {auth.rawis.map((rawi) => (
              <ManuscriptCard
                key={rawi.id}
                accentColor="var(--accent-navy)"
                className="p-5 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[var(--accent-gold)]">
                      {rawi.shortName}
                    </span>
                    <span className="font-tabular text-[var(--text-muted)]">{rawi.citation}</span>
                  </div>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">{rawi.nameTr}</h4>
                  <p className="text-xs font-medium text-[var(--accent-emerald)]">{rawi.roleTr}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {rawi.detailTr}
                  </p>
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>
      </section>

      <EditorialDivider />

      {/* 4. Sayısal Veriler & Neşir Grafikleri */}
      <section id="sayisal-veriler" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
            <span>İstatistik &amp; Karşılaştırma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Sayısal Veriler ve Neşir Karşılaştırmaları
          </h2>
        </div>

        <SunenCharts
          totalWritten={comp.hadithTotals.totalWritten}
          selectedInSunen={comp.hadithTotals.selectedInSunen}
          murselApprox={comp.hadithTotals.murselApprox}
          elMerasilApprox={comp.hadithTotals.elMerasilApprox}
          editions={data.editionStats}
        />
      </section>

      <EditorialDivider />

      {/* 5. Baskı & Neşir Merkezleri Haritası */}
      <section id="nesirler-haritasi" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-emerald)]">
            <Globe2 className="w-4 h-4" aria-hidden="true" />
            <span>Basım Coğrafyası · 8 Şehir</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            es-Sünen Baskı ve Neşir Merkezleri Haritası
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            Leknev’den Kahire ve Beyrut’a, Delhi, Haydarâbâd, Humus, Riyad ve Liechtenstein’a kadar
            es-Sünen’in önemli baskılarını şehir bazında inceleyin.
          </p>
        </div>

        <EditionsMap cities={data.printCities} />
      </section>

      <EditorialDivider />

      {/* 6. Etkileşimli Şerh, Yarım Kalanlar & Araştırmalar Kitaplığı */}
      <section id="serh-kitapligi" className="scroll-mt-24 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-gold)]">
            <Library className="w-4 h-4" aria-hidden="true" />
            <span>Şerh &amp; İhtisar Literatürü</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Şerhler (9), Yarım Kalan Çalışmalar (5) ve İhtisar / Araştırmalar (9)
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-3xl">
            Hattâbî’nin ilk hadis şerhi <em>Meʿâlimü’s-Sünen</em>’den <em>ʿAvnü’l-maʿbûd</em>,{' '}
            <em>Beẕlü’l-mechûd</em>, <em>el-Menhel</em>, Münzirî, İbn Kayyim, Elbânî ve Türkçe
            çeviriye kadar 23 çalışmayı filtreleyin ve arayın.
          </p>
        </div>

        <CommentaryShelf
          commentaries={data.commentaries}
          incompleteWorks={data.incompleteWorks}
          abridgementsAndStudies={data.abridgementsAndStudies}
        />
      </section>

      <EditorialDivider />

      {/* 7. Bibliyografya & Kaynak */}
      <section id="bibliyografya" className="scroll-mt-24 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Kaynakça</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Bibliyografya ({data.bibliography.length})
            </h2>
          </div>
          <SpeechControls id="sunen-bibliography" compact turkishText={bibNarrationTr} />
        </div>

        <ManuscriptCard className="p-6 space-y-4">
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
              className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-navy)] dark:text-[#8cb3f7] hover:underline"
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

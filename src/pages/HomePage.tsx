import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Library, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ManuscriptCard, EditorialDivider } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { KitabMindMap } from '../components/mindmap/KitabMindMap';

export const HomePage: React.FC = () => {
  const { settings, progress, t } = useApp();

  const entryCards = [
    {
      to: '/ebu-davud',
      tag: t.entryCards.authorTag,
      title: t.entryCards.authorTitle,
      desc: t.entryCards.authorDesc,
      meta: t.entryCards.authorMeta,
      icon: UserCheck,
      accent: '#14284B',
    },
    {
      to: '/sunen',
      tag: t.entryCards.workTag,
      title: t.entryCards.workTitle,
      desc: t.entryCards.workDesc,
      meta: t.entryCards.workMeta,
      icon: Library,
      accent: '#0F5132',
    },
    {
      to: '/hadisler',
      tag: t.entryCards.hadithTag,
      title: t.entryCards.hadithTitle,
      desc: t.entryCards.hadithDesc,
      meta: t.entryCards.hadithMeta,
      icon: BookOpen,
      accent: '#B8862D',
    },
  ];

  const stats = [
    { label: t.progress.read, value: `${progress.readHadiths.length} / 38` },
    { label: t.progress.listened, value: `${progress.listenedHadiths.length} / 38` },
    { label: t.progress.memorized, value: `${progress.memorizedHadiths.length} / 38` },
    { label: t.progress.favorites, value: `${progress.favoriteHadiths.length}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Editorial Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <motion.div
          initial={settings.reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-7 flex flex-col justify-between gap-6"
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[var(--accent-gold)]">
              {t.hero.kicker}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[var(--text-primary)]">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/hadisler">
              <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4 rtl:rotate-180" />}>
                {t.hero.ctaPrimary}
              </Button>
            </Link>
            <Link to="/ebu-davud">
              <Button variant="outline" size="lg" iconLeft={<UserCheck className="w-4 h-4" />}>
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Calligraphic Manuscript Showcase Card */}
        <ManuscriptCard
          accentColor="var(--accent-gold)"
          className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-[var(--bg-card)]"
        >
          <div className="flex items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
            <span>{t.hero.showcaseEdition}</span>
            <span className="font-tabular">264–279</span>
          </div>

          <div className="text-center py-4 space-y-3" dir="rtl">
            <p className="font-arabic-inline text-3xl sm:text-4xl font-bold text-[var(--accent-navy)] dark:text-[var(--accent-gold)]">
              أَبُو دَاوُدَ السِّجِسْتَانِيّ
            </p>
            <p className="font-arabic-inline text-xl sm:text-2xl text-[var(--text-primary)]">
              كِتَابُ الْأَدَبِ مِنْ سُنَنِ أَبِي دَاوُدَ
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border-hairline)] text-center">
            <div>
              <p className="font-tabular text-xl font-bold text-[var(--text-primary)]">38</p>
              <p className="text-xs text-[var(--text-secondary)]">{t.hero.statHadiths}</p>
            </div>
            <div>
              <p className="font-tabular text-xl font-bold text-[var(--text-primary)]">11</p>
              <p className="text-xs text-[var(--text-secondary)]">{t.hero.statBabs}</p>
            </div>
            <div>
              <p className="font-tabular text-xl font-bold text-[var(--text-primary)]">14</p>
              <p className="text-xs text-[var(--text-secondary)]">{t.hero.statCities}</p>
            </div>
          </div>
        </ManuscriptCard>
      </section>

      {/* Progress Strip */}
      <section aria-label={t.progress.title}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-[var(--bg-surface)]/75 border border-[var(--border-hairline)] px-5 py-4 flex flex-col gap-1"
            >
              <span className="text-xs text-[var(--text-secondary)]">{stat.label}</span>
              <span className="font-tabular text-2xl font-bold text-[var(--text-primary)]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Three Primary Entry Cards */}
      <section aria-label={t.nav.allSections} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.to} to={card.to} className="group block focus:outline-none">
              <ManuscriptCard
                accentColor={card.accent}
                className="h-full p-6 flex flex-col justify-between gap-5 group-hover:border-[var(--border-strong)] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      {card.tag}
                    </span>
                    <Icon
                      className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-navy)] dark:group-hover:text-[var(--accent-gold)] transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">{card.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-4 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="font-tabular">{card.meta}</span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </ManuscriptCard>
            </Link>
          );
        })}
      </section>

      <EditorialDivider />

      {/* Interactive D3 Kitab al-Adab Mind Map (11 Babs & 38 Hadiths) */}
      <section aria-label={t.mindMap.title}>
        <KitabMindMap />
      </section>
    </div>
  );
};

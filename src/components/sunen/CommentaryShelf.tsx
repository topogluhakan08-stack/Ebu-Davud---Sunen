import React, { useMemo, useState } from 'react';
import { BookOpen, FileText, Layers, Search } from 'lucide-react';
import type {
  SunenCommentary,
  SunenIncompleteWork,
  SunenRelatedStudy,
} from '../../types';
import { ManuscriptCard } from '../ui/Card';
import { SpeechControls } from '../tts/SpeechControls';

interface CommentaryShelfProps {
  commentaries: SunenCommentary[];
  incompleteWorks: SunenIncompleteWork[];
  abridgementsAndStudies: SunenRelatedStudy[];
}

type ShelfTab = 'all' | 'commentaries' | 'incomplete' | 'studies';

export const CommentaryShelf: React.FC<CommentaryShelfProps> = ({
  commentaries,
  incompleteWorks,
  abridgementsAndStudies,
}) => {
  const [activeTab, setActiveTab] = useState<ShelfTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr');

  const filteredCommentaries = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'commentaries') return [];
    if (!normalizedQuery) return commentaries;
    return commentaries.filter((c) =>
      [
        c.author,
        c.title,
        c.madhhabOrScope,
        c.summaryTr,
        ...c.editionsOrManuscripts,
        ...(c.subWorks ?? []),
      ]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(normalizedQuery)
    );
  }, [activeTab, normalizedQuery, commentaries]);

  const filteredIncomplete = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'incomplete') return [];
    if (!normalizedQuery) return incompleteWorks;
    return incompleteWorks.filter((w) =>
      [w.author, w.title, w.extentOrNoteTr, w.manuscriptOrCitation]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(normalizedQuery)
    );
  }, [activeTab, normalizedQuery, incompleteWorks]);

  const filteredStudies = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'studies') return [];
    if (!normalizedQuery) return abridgementsAndStudies;
    return abridgementsAndStudies.filter((s) =>
      [s.author, s.title, s.kindLabelTr, s.summaryTr, s.publicationInfo]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(normalizedQuery)
    );
  }, [activeTab, normalizedQuery, abridgementsAndStudies]);

  const totalCount =
    commentaries.length + incompleteWorks.length + abridgementsAndStudies.length;
  const visibleCount =
    filteredCommentaries.length + filteredIncomplete.length + filteredStudies.length;

  return (
    <div className="space-y-6">
      {/* Interactive Filter Tabs + Search Input */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Şerh ve çalışma kategorileri"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]"
        >
          {(
            [
              { id: 'all', label: `Tümü (${totalCount})` },
              { id: 'commentaries', label: `Başlıca Şerhler (${commentaries.length})` },
              { id: 'incomplete', label: `Yarım Kalan & Zevâid (${incompleteWorks.length})` },
              {
                id: 'studies',
                label: `İhtisar, Tashih & Araştırma (${abridgementsAndStudies.length})`,
              },
            ] as { id: ShelfTab; label: string }[]
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <label className="relative flex items-center min-w-[240px] flex-1 sm:flex-initial">
          <Search
            className="w-4 h-4 text-[var(--text-muted)] absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şârih, eser, nüsha veya şehir ara..."
            aria-label="Şerh, yazma veya çalışma ara"
            className="w-full min-h-[40px] pl-9 pr-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </label>
      </div>

      {visibleCount === 0 && (
        <ManuscriptCard className="p-8 text-center space-y-2">
          <p className="text-base font-bold text-[var(--text-primary)]">
            Aramanızla eşleşen eser bulunamadı
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            “{searchQuery}” için sonuç yok. Filtreyi temizleyerek tüm {totalCount} eseri
            görebilirsiniz.
          </p>
        </ManuscriptCard>
      )}

      {/* 1. Başlıca Şerhler (9) */}
      {filteredCommentaries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Başlıca Şerhler ({filteredCommentaries.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCommentaries.map((item) => (
              <ManuscriptCard
                key={item.id}
                accentColor="var(--accent-navy)"
                className="p-5 sm:p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-tabular font-semibold text-[var(--accent-gold)]">
                      Şerh 0{item.order}
                    </span>
                    <span className="text-right truncate">{item.madhhabOrScope}</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                      {item.author}
                    </p>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.summaryTr}
                  </p>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-1.5 text-xs">
                    <p className="font-semibold text-[var(--text-primary)]">
                      Yazma &amp; Baskı Bilgileri
                    </p>
                    <ul className="space-y-1 text-[var(--text-secondary)]">
                      {item.editionsOrManuscripts.map((ed) => (
                        <li key={ed}>· {ed}</li>
                      ))}
                    </ul>
                  </div>

                  {item.subWorks && item.subWorks.length > 0 && (
                    <div className="space-y-1 text-xs text-[var(--text-primary)] pt-1">
                      <p className="font-semibold text-[var(--accent-emerald)]">
                        İlgili İhtisar / Tekmile / Fihrist
                      </p>
                      <ul className="space-y-1 text-[var(--text-secondary)]">
                        {item.subWorks.map((sub) => (
                          <li key={sub}>· {sub}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--border-hairline)]">
                  <SpeechControls
                    id={`commentary-${item.id}`}
                    compact
                    turkishText={`${item.author}, ${item.title}. ${item.summaryTr}`}
                  />
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>
      )}

      {/* 2. Yarım Kalan Şerhler & Zevâid (5) */}
      {filteredIncomplete.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-gold)]">
            <Layers className="w-4 h-4" aria-hidden="true" />
            <span>Yarım Kalmış Çalışmalar ve Zevâid Şerhi ({filteredIncomplete.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIncomplete.map((item) => (
              <ManuscriptCard
                key={item.id}
                accentColor="var(--accent-gold)"
                className="p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-tabular text-[var(--accent-gold)]">
                    <span>0{item.order}</span>
                    <span>Yarım Kalan / Zevâid</span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {item.author}
                  </p>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.extentOrNoteTr}
                  </p>
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs text-[var(--text-primary)]">
                    <span className="font-semibold">Kaynak / Nüsha: </span>
                    {item.manuscriptOrCitation}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-hairline)]">
                  <SpeechControls
                    id={`incomplete-${item.id}`}
                    compact
                    turkishText={`${item.author}, ${item.title}. ${item.extentOrNoteTr}`}
                  />
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>
      )}

      {/* 3. İhtisar, Tashih, Müstahrec & Araştırmalar (9) */}
      {filteredStudies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-emerald)]">
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>
              İhtisar, Tashih, Hâşiye, Müstahrec ve Modern Çalışmalar ({filteredStudies.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudies.map((item) => (
              <ManuscriptCard
                key={item.id}
                accentColor="var(--accent-emerald)"
                className="p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-tabular font-semibold text-[var(--accent-emerald)]">
                      0{item.order}
                    </span>
                    <span className="text-[var(--text-secondary)]">{item.kindLabelTr}</span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--accent-navy)] dark:text-[#8cb3f7]">
                    {item.author}
                  </p>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.summaryTr}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                    {item.publicationInfo}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-hairline)]">
                  <SpeechControls
                    id={`study-${item.id}`}
                    compact
                    turkishText={`${item.author}, ${item.title}. ${item.summaryTr}`}
                  />
                </div>
              </ManuscriptCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

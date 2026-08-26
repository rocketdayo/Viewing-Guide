import React, { useState } from 'react';
import { 
  Megaphone, 
  Radio, 
  Pin, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  AlertCircle, 
  Bell, 
  Info, 
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    // Default expand pinned announcements
    return announcements.filter(a => a.isPinned).map(a => a.id);
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = ['all', ...Array.from(new Set(announcements.map(a => a.category).filter(Boolean)))];

  const filteredAnnouncements = announcements.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const pinnedList = filteredAnnouncements.filter(a => a.isPinned);
  const normalList = filteredAnnouncements.filter(a => !a.isPinned);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case '重要':
      case '緊急':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case '混雑情報':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case '同窓会・企画':
        return 'bg-amber-100 text-amber-950 border-amber-400';
      default:
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    }
  };

  return (
    <section id="announcements-section" className="border-b border-slate-200 bg-[#FAFBFD] py-12 sm:py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
              <span>お知らせ・緊急速報 配信サービス</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              文化祭本部・各ステージからの最新アナウンス、プログラム変更、緊急連絡を掲載しています
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-mono text-slate-500 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> 絞り込み:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? `すべて (${announcements.length})` : cat}
              </button>
            ))}
          </div>
        )}

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="bg-white p-8 border border-slate-200 text-center space-y-3 shadow-2xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">現在、新しいお知らせはありません</p>
            <p className="text-xs text-slate-500">運営本部からの新しいアナウンスがあり次第、ここに自動表示されます。</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Pinned Announcements */}
            {pinnedList.map((item) => {
              const isExpanded = expandedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50/70 border-2 border-amber-300 shadow-2xs transition-all overflow-hidden"
                >
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-amber-50/90 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2.5 py-0.5 text-xs font-bold tracking-wider shadow-2xs">
                          <Pin className="w-3 h-3 fill-current" />
                          重要告知
                        </span>
                        <span className={`px-2.5 py-0.5 text-xs font-bold border ${getCategoryBadge(item.category)}`}>
                          {item.category || 'お知らせ'}
                        </span>
                        <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 self-end sm:self-auto">
                        <span>{isExpanded ? '折りたたむ' : '詳細を読む'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-950 leading-snug">
                      {item.title}
                    </h3>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-4 mt-3 border-t border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans"
                        >
                          {item.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

            {/* Standard Announcements */}
            {normalList.map((item) => {
              const isExpanded = expandedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-300 shadow-2xs hover:border-slate-400 transition-all overflow-hidden"
                >
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold border ${getCategoryBadge(item.category)}`}>
                          {item.category || 'お知らせ'}
                        </span>
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 self-end sm:self-auto">
                        <span>{isExpanded ? '折りたたむ' : '本文を表示'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-4 mt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans"
                        >
                          {item.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Bell, 
  Filter,
  ChevronDown,
  ChevronUp,
  WifiOff,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';
import { useI18n } from '../utils/i18n';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onOpenPwaModal?: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements = [],
  onOpenPwaModal,
}) => {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  
  const [expandedIds, setExpandedIds] = useState<string[]>(() => 
    announcements.filter(a => a.isPinned).map(a => a.id)
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    setExpandedIds(prev => {
      const pinnedIds = announcements.filter(a => a.isPinned).map(a => a.id);
      const unique = Array.from(new Set([...prev, ...pinnedIds]));
      return unique;
    });
  }, [announcements]);

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

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
              <span>{language === 'en' ? 'Announcements & News Flash' : 'お知らせ・緊急速報 配信サービス'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {language === 'en' 
                ? 'Latest official announcements, timetable changes, and alerts from the school' 
                : '各ステージ・学園からの最新アナウンス、プログラム変更、緊急連絡を掲載しています'}
            </p>
          </div>

          {onOpenPwaModal && (
            <button
              onClick={onOpenPwaModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>{language === 'en' ? 'How to Add to Home Screen' : 'ホーム画面追加・アプリ化の手順'}</span>
            </button>
          )}
        </div>

        {isOffline && (
          <div className="p-3.5 bg-amber-500/15 border border-amber-400/80 text-amber-950 text-xs font-bold flex items-center space-x-2.5 shadow-2xs">
            <WifiOff className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
            <span>
              {language === 'en' 
                ? 'Offline: Currently offline. Showing saved announcements and cached information.' 
                : 'オフラインです：電波が届かない場所でも、端末に保存された最新のお知らせと企画情報を表示しています。'}
            </span>
          </div>
        )}

        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-mono text-slate-500 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> {language === 'en' ? 'Filter:' : '絞り込み:'}
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
                {cat === 'all' ? (language === 'en' ? `All (${announcements.length})` : `すべて (${announcements.length})`) : cat}
              </button>
            ))}
          </div>
        )}

        {sortedAnnouncements.length === 0 ? (
          <div className="bg-white p-8 border border-slate-200 text-center space-y-3 shadow-2xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {language === 'en' ? 'No announcements at this time' : '現在、新しいお知らせはありません'}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'en' ? 'New updates will automatically appear here.' : '新しいアナウンスがあり次第、ここに自動表示されます。'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnnouncements.map((item) => {
              const isExpanded = expandedIds.includes(item.id);
              const hasContent = Boolean(item.content && item.content.trim());
              const isPwaGuideItem = item.id === 'ann-pwa-install-guide' || item.title.includes('ホーム画面');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`transition-all overflow-hidden border shadow-2xs ${
                    item.isPinned
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/50'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div 
                    onClick={() => hasContent && toggleExpand(item.id)}
                    className={`p-5 sm:p-6 space-y-2.5 ${hasContent ? 'cursor-pointer select-none hover:bg-slate-50/60' : ''} transition-colors`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 text-xs font-bold border ${getCategoryBadge(item.category)}`}>
                          {item.category || (language === 'en' ? 'Notice' : 'お知らせ')}
                        </span>
                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.timestamp}
                        </span>
                      </div>

                      {hasContent && (
                        <div className="flex items-center space-x-1 text-xs font-bold text-slate-500">
                          <span>{isExpanded ? (language === 'en' ? 'Close details' : '本文を閉じる') : (language === 'en' ? 'Read details' : '本文を開く')}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className={`font-serif font-bold text-slate-900 leading-snug ${
                      item.isPinned ? 'text-base sm:text-lg text-slate-950 font-bold' : 'text-base sm:text-lg'
                    }`}>
                      {item.title}
                    </h3>

                    <AnimatePresence initial={false}>
                      {hasContent && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-1 border-t border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans break-words space-y-3">
                            <div>{item.content}</div>

                            {isPwaGuideItem && onOpenPwaModal && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenPwaModal();
                                  }}
                                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xs transition-colors cursor-pointer shadow-sm"
                                >
                                  <Smartphone className="w-4 h-4" />
                                  <span>{language === 'en' ? 'Open Visual Guide (Step-by-Step)' : '分かりやすい手順図・モーダルで確認する'}</span>
                                </button>
                              </div>
                            )}
                          </div>
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

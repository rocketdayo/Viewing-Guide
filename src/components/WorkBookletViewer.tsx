import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Maximize2,
  Search,
  Filter,
  GraduationCap,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  AlertTriangle,
  MessageSquare,
  X,
  FileText,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../utils/i18n';
import {
  WORK_PDF_PAGES,
  ALUMNI_CAREER_PROFILES,
  AlumniCareerProfile
} from '../data/alumniCareerData';

export const WorkBookletViewer: React.FC = () => {
  const { language } = useI18n();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomPage, setZoomPage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'booklet' | 'roster'>('booklet');
  const [timeFilter, setTimeFilter] = useState<'all' | '午前' | '午後'>('all');
  const [roomFilter, setRoomFilter] = useState<'all' | '高3E' | '高3F' | '高3G'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const activePageObj = WORK_PDF_PAGES.find((p) => p.page === currentPage) || WORK_PDF_PAGES[0];

  const handleNextPage = () => {
    if (currentPage < WORK_PDF_PAGES.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const filteredProfiles = ALUMNI_CAREER_PROFILES.filter((profile) => {
    if (timeFilter !== 'all' && profile.timeSlot !== timeFilter) return false;
    if (roomFilter !== 'all' && profile.room !== roomFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = [
        profile.jobTitle,
        profile.gradInfo,
        profile.content,
        profile.reason,
        profile.funAspect,
        profile.toughAspect,
        profile.message,
        profile.category,
        profile.room,
        profile.timeSlot
      ]
        .join(' ')
        .toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredProfiles.map((p) => p.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-orange-50/60 border-2 border-amber-300 rounded-sm shadow-md p-3.5 sm:p-6 space-y-5 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/90 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-xs border border-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>{language === 'en' ? 'Official Career Booklet & 36 Alumni Roster' : '未来の仕事図鑑 公式パンフレット ＆ 参加全36人名鑑'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>{language === 'en' ? 'Future Career Guidebook (36 Alumni)' : '先輩に聞こう！未来の仕事図鑑'}</span>
          </h3>
          <p className="text-xs text-slate-600">
            {language === 'en'
              ? 'Browse the complete 7-page booklet or search all 36 participating graduates by room, time, or occupation.'
              : 'パンフレット全7ページの閲覧と、参加する全36名の卒業生データの検索・詳細表示が可能です。'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-amber-100 p-1 rounded-xs border border-amber-300 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('booklet')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'booklet'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/70'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '7-Page Booklet' : 'パンフレット閲覧 (7P)'}</span>
            </button>
            <button
              onClick={() => setViewMode('roster')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'roster'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Search 36 Alumni' : '参加先輩 36人名鑑'}</span>
            </button>
          </div>

          <a
            href="/alumni/work_guide.pdf"
            download="未来の仕事図鑑_全ページ.pdf"
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xs border border-amber-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'en' ? 'PDF Download' : 'PDF保存'}</span>
          </a>
        </div>
      </div>

      {viewMode === 'booklet' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xs border border-amber-200 shadow-2xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1.5 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-amber-50 text-amber-900 rounded-xs border border-amber-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-mono text-slate-800 bg-amber-50 px-2.5 py-1 rounded-xs border border-amber-200">
                Page {currentPage} / {WORK_PDF_PAGES.length}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === WORK_PDF_PAGES.length}
                className="p-1.5 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-amber-50 text-amber-900 rounded-xs border border-amber-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-amber-900 hidden sm:inline-block ml-2">
                {activePageObj.title}
              </span>
            </div>

            <button
              onClick={() => setZoomPage(currentPage)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Fullscreen Zoom' : '全画面拡大'}</span>
            </button>
          </div>

          <div className="relative group overflow-hidden border border-amber-300 rounded-xs bg-slate-900/5 shadow-inner flex justify-center items-center min-h-[300px] sm:min-h-[480px]">
            <img
              src={activePageObj.imageSrc}
              alt={activePageObj.title}
              className="max-h-[75vh] w-auto max-w-full object-contain cursor-pointer transition-transform duration-200"
              onClick={() => setZoomPage(currentPage)}
            />
            
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full opacity-80 group-hover:opacity-100 disabled:opacity-0 transition-opacity cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === WORK_PDF_PAGES.length}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full opacity-80 group-hover:opacity-100 disabled:opacity-0 transition-opacity cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {WORK_PDF_PAGES.map((p) => (
              <button
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`shrink-0 border-2 rounded-xs overflow-hidden transition-all cursor-pointer relative ${
                  currentPage === p.page
                    ? 'border-amber-600 scale-105 shadow-md'
                    : 'border-slate-300 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={p.imageSrc}
                  alt={p.title}
                  className="w-20 h-12 object-cover"
                />
                <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-mono px-1 font-bold">
                  P{p.page}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'roster' && (
        <div className="space-y-4 max-w-full">
          <div className="bg-white p-3 sm:p-4 rounded-xs border border-amber-200 shadow-2xs space-y-3 max-w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 w-full">
              <div className="relative flex-1 min-w-0 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search occupation, keyword...'
                      : '職種やキーワードで検索（例: 弁護士, エンジニア, 獣医師, 高3E...）'
                  }
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto min-w-0">
                <div className="flex items-center space-x-1.5 flex-1 sm:flex-none min-w-0">
                  <span className="text-slate-500 font-bold shrink-0">{language === 'en' ? 'Time:' : '時間：'}</span>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="w-full sm:w-auto px-2 py-1 border border-slate-300 rounded-xs bg-slate-50 font-bold text-slate-700 cursor-pointer min-w-0 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="all">{language === 'en' ? 'All Times' : 'すべての時間'}</option>
                    <option value="午前">{language === 'en' ? 'Morning (10:00-12:00)' : '午前 (10:00~12:00)'}</option>
                    <option value="午後">{language === 'en' ? 'Afternoon (12:30-14:30)' : '午後 (12:30~14:30)'}</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 flex-1 sm:flex-none min-w-0">
                  <span className="text-slate-500 font-bold shrink-0">{language === 'en' ? 'Room:' : '場所：'}</span>
                  <select
                    value={roomFilter}
                    onChange={(e) => setRoomFilter(e.target.value as any)}
                    className="w-full sm:w-auto px-2 py-1 border border-slate-300 rounded-xs bg-slate-50 font-bold text-slate-700 cursor-pointer min-w-0 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="all">{language === 'en' ? 'All Rooms' : 'すべての教室'}</option>
                    <option value="高3E">高3E</option>
                    <option value="高3F">高3F</option>
                    <option value="高3G">高3G</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <span>
                  {language === 'en' ? 'Showing ' : '該当件数：'}
                  <strong className="text-amber-800 font-mono text-sm">{filteredProfiles.length}</strong>
                  {language === 'en' ? ' / 36 graduates' : ' 名 / 全36名'}
                </span>
                {(timeFilter !== 'all' || roomFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setTimeFilter('all');
                      setRoomFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-amber-700 hover:text-amber-900 underline font-bold cursor-pointer ml-1"
                  >
                    {language === 'en' ? 'Reset Filters' : 'フィルターを解除'}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={expandAll}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold rounded-xs transition-colors cursor-pointer border border-amber-300"
                >
                  {language === 'en' ? 'Expand All' : 'すべて開く'}
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xs transition-colors cursor-pointer border border-slate-300"
                >
                  {language === 'en' ? 'Collapse All' : 'すべて閉じる'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredProfiles.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-amber-200/90 rounded-xs shadow-2xs hover:border-amber-400 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left p-3.5 bg-gradient-to-r from-white via-amber-50/20 to-orange-50/30 hover:bg-amber-100/30 transition-colors flex items-center justify-between gap-2.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="shrink-0 text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-xs">
                        No.{item.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {item.jobTitle}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium shrink-0">
                            ({item.gradInfo})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                          item.timeSlot === '午前'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                        }`}
                      >
                        {item.timeSlot}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded-xs">
                        {item.room}
                      </span>
                      <div className="p-1 text-slate-400 hover:text-amber-800 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-amber-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-amber-100 p-3.5 sm:p-4 bg-amber-50/30 space-y-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xs border border-slate-200 shadow-2xs">
                            <Briefcase className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block font-bold mb-0.5">
                                {language === 'en' ? 'Work Content:' : '仕事内容:'}
                              </strong>
                              <span>{item.content}</span>
                            </div>
                          </div>

                          {item.reason && (
                            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xs border border-rose-200/70 shadow-2xs">
                              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-rose-900 block font-bold mb-0.5">
                                  {language === 'en' ? 'Reason Chosen:' : '選んだ理由:'}
                                </strong>
                                <span>{item.reason}</span>
                              </div>
                            </div>
                          )}

                          {item.funAspect && (
                            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xs border border-amber-200/80 shadow-2xs">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-900 block font-bold mb-0.5">
                                  {language === 'en' ? 'Rewarding Aspect:' : '楽しいところ:'}
                                </strong>
                                <span>{item.funAspect}</span>
                              </div>
                            </div>
                          )}

                          {item.toughAspect && (
                            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xs border border-sky-200/80 shadow-2xs">
                              <AlertTriangle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-sky-900 block font-bold mb-0.5">
                                  {language === 'en' ? 'Challenging Aspect:' : '大変なところ:'}
                                </strong>
                                <span>{item.toughAspect}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {item.message && (
                          <div className="p-3 bg-amber-100/70 rounded-xs border border-amber-300/80 text-xs text-amber-950 font-bold flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">「{item.message}」</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {zoomPage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomPage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          >
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-xs">
                  Page {zoomPage} / {WORK_PDF_PAGES.length}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate">
                  {WORK_PDF_PAGES.find((p) => p.page === zoomPage)?.title}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href="/alumni/work_guide.pdf"
                  download="未来の仕事図鑑_全ページ.pdf"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Download PDF' : 'PDFを保存'}</span>
                </a>
                <button
                  onClick={() => setZoomPage(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 w-full flex items-center justify-center p-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={WORK_PDF_PAGES.find((p) => p.page === zoomPage)?.imageSrc}
                alt={`Work Page ${zoomPage}`}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xs shadow-2xl border border-slate-700 bg-white"
              />

              <button
                onClick={() => setZoomPage((prev) => (prev && prev > 1 ? prev - 1 : prev))}
                disabled={zoomPage === 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full disabled:opacity-20 transition-opacity cursor-pointer shadow-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setZoomPage((prev) => (prev && prev < WORK_PDF_PAGES.length ? prev + 1 : prev))}
                disabled={zoomPage === WORK_PDF_PAGES.length}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full disabled:opacity-20 transition-opacity cursor-pointer shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Click outside or close button to exit.' : '画面外または閉じるボタンで戻ります。'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

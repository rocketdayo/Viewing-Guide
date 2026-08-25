import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  MapPin, 
  Bookmark, 
  ChevronRight, 
  Ticket, 
  SlidersHorizontal,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassProject, CongestionLevel } from '../types';

interface ClassesViewProps {
  projects: ClassProject[];
  onSelectProject: (projectId: string) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onNavigateToCongestion: () => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  projects,
  onSelectProject,
  bookmarks,
  onToggleBookmark,
  onNavigateToCongestion,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedCongestion, setSelectedCongestion] = useState<string>('all');
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [onlyOnlineTickets, setOnlyOnlineTickets] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'waitTime' | 'title'>('default');

  const categories = [
    'all',
    '演劇・劇',
    'アトラクション・体験',
    '展示・研究',
    'カフェ・飲食',
    '縁日・ゲーム',
    'ステージ・音楽',
  ];

  const buildings = [
    'all',
    '本館',
    '新館',
    '特別棟',
    'チャペル',
    '体育館',
  ];

  const grades = ['all', '1年', '2年'];

  const congestionFilters = [
    { label: 'すべて', value: 'all' },
    { label: '🟢 空きあり', value: 'smooth' },
    { label: '🟡 やや混雑', value: 'moderate' },
    { label: '🔴 大混雑', value: 'crowded' },
    { label: '🎫 整理券制', value: 'ticket' },
  ];

  const onlineTicketClassIds = ['p-1b', 'p-1d', 'p-2a', 'p-2d', 'p-2e', 'p-2j'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Grade filter
      if (selectedGrade !== 'all' && p.grade !== selectedGrade) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Building filter
      if (selectedBuilding !== 'all' && p.building !== selectedBuilding) return false;

      // Congestion filter
      if (selectedCongestion !== 'all' && p.congestion.level !== selectedCongestion) return false;

      // Bookmarks only filter
      if (onlyBookmarks && !bookmarks.includes(p.id)) return false;

      // Online ticket only filter
      if (onlyOnlineTickets && !onlineTicketClassIds.includes(p.id) && !p.onlineTicketUrl && !p.onlineTicketNote) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.classNumber.toLowerCase().includes(q) ||
          p.catchphrase.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'waitTime') {
        return a.congestion.waitTimeMinutes - b.congestion.waitTimeMinutes;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ja');
      }
      return 0;
    });
  }, [
    projects,
    selectedGrade,
    selectedCategory,
    selectedBuilding,
    selectedCongestion,
    onlyBookmarks,
    onlyOnlineTickets,
    searchQuery,
    sortBy,
    bookmarks,
  ]);

  const renderCongestionBadge = (level: CongestionLevel, waitTime: number) => {
    switch (level) {
      case 'smooth':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>空きあり ({waitTime}分)</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>やや混雑 ({waitTime}分)</span>
          </span>
        );
      case 'crowded':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>大混雑 ({waitTime}分)</span>
          </span>
        );
      case 'ticket':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <Ticket className="w-3 h-3 text-purple-600" />
            <span>整理券制</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <span>休止中</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4"
      >
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xs bg-emerald-50 text-emerald-700">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              クラス企画一覧
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            高校1年・2年の全21企画の詳細情報とリアルタイム待機時間・整理券案内
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateToCongestion}
          className="flex items-center space-x-2 px-4 py-2 rounded-xs bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs self-start md:self-auto cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>リアルタイム混雑モニターへ</span>
        </motion.button>
      </motion.div>

      {/* Filter and Search Bar Controls */}
      <div className="p-4 sm:p-5 rounded-xs bg-white border border-slate-200 shadow-xs space-y-4">
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="classes-search-input"
              type="text"
              placeholder="企画名、クラス名、キーワードで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xs border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                クリア
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xs border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="default">並び順: クラス標準順</option>
              <option value="waitTime">並び順: 待ち時間が短い順</option>
              <option value="title">並び順: 企画名五十音順</option>
            </select>

            <button
              onClick={() => setOnlyOnlineTickets(!onlyOnlineTickets)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xs text-xs font-medium border transition-colors shrink-0 cursor-pointer ${
                onlyOnlineTickets
                  ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Ticket className={`w-3.5 h-3.5 ${onlyOnlineTickets ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>オンライン整理券</span>
            </button>

            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xs text-xs font-medium border transition-colors shrink-0 cursor-pointer ${
                onlyBookmarks
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarks ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>保存のみ</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
          {/* Grade Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-semibold text-slate-400 shrink-0">学年:</span>
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-emerald-900 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g === 'all' ? '全学年' : g}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-semibold text-slate-400 shrink-0">ジャンル:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-emerald-900 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'すべて' : c}
              </button>
            ))}
          </div>

          {/* Congestion & Building Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-400 shrink-0">校舎:</span>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
              >
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'すべての建物' : b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-400 shrink-0">混雑状況:</span>
              <select
                value={selectedCongestion}
                onChange={(e) => setSelectedCongestion(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
              >
                {congestionFilters.map((cf) => (
                  <option key={cf.value} value={cf.value}>
                    {cf.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedGrade !== 'all' ||
              selectedCategory !== 'all' ||
              selectedBuilding !== 'all' ||
              selectedCongestion !== 'all' ||
              onlyBookmarks ||
              onlyOnlineTickets ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGrade('all');
                  setSelectedCategory('all');
                  setSelectedBuilding('all');
                  setSelectedCongestion('all');
                  setOnlyBookmarks(false);
                  setOnlyOnlineTickets(false);
                  setSearchQuery('');
                }}
                className="text-emerald-600 hover:text-emerald-800 font-bold ml-auto cursor-pointer"
              >
                条件をクリア
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500">
            該当企画: {filteredProjects.length} 件 / 全 21 企画
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-xs bg-white border border-slate-200 space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">該当する企画が見つかりませんでした</p>
            <p className="text-xs text-slate-400">検索条件やフィルターを変更してお試しください</p>
            <button
              onClick={() => {
                setSelectedGrade('all');
                setSelectedCategory('all');
                setSelectedBuilding('all');
                setSelectedCongestion('all');
                setOnlyBookmarks(false);
                setOnlyOnlineTickets(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xs bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              すべての企画を表示
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredProjects.map((proj, idx) => {
                const isBookmarked = bookmarks.includes(proj.id);
                const isOnlineTicket = onlineTicketClassIds.includes(proj.id) || Boolean(proj.onlineTicketUrl || proj.onlineTicketNote);

                return (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-xs bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Grade/Class & Bookmark */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-emerald-50 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-xs border border-emerald-100">
                            {proj.classNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            {proj.category}
                          </span>
                          {isOnlineTicket && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-purple-200">
                              <Ticket className="w-3 h-3 text-purple-600" />
                              整理券
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleBookmark(proj.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isBookmarked
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title="ブックマーク"
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Main Title & Catchphrase */}
                      <div 
                        onClick={() => onSelectProject(proj.id)}
                        className="cursor-pointer space-y-1"
                      >
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {proj.catchphrase}
                        </p>
                      </div>

                      {/* Congestion Status */}
                      <div className="pt-1">
                        {renderCongestionBadge(proj.congestion.level, proj.congestion.waitTimeMinutes)}
                      </div>
                    </div>

                    {/* Bottom Meta & Action */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[150px]">{proj.location}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="flex items-center space-x-1 font-bold text-emerald-600 group-hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        <span>詳細を見る</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

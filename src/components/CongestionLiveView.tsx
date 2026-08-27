import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Clock, 
  Building,
  ChevronRight, 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Ticket,
  SlidersHorizontal,
  HelpCircle,
  Radio,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassProject, CongestionLevel } from '../types';

interface CongestionLiveViewProps {
  gasUrl?: string;
  projects: ClassProject[];
  onSelectProject: (projectId: string) => void;
  isSyncing?: boolean;
  lastSyncTime?: string | null;
  syncError?: string | null;
  syncedCount?: number;
  onSyncNow?: () => void;
}

export const CongestionLiveView: React.FC<CongestionLiveViewProps> = ({
  projects = [],
  onSelectProject,
  isSyncing = false,
  lastSyncTime = null,
  syncError = null,
  onSyncNow,
}) => {
  const safeProjects = projects || [];
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(60); // default 60s (1 minute)
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'waitAsc' | 'waitDesc'>('default');

  const onSyncNowRef = useRef(onSyncNow);
  onSyncNowRef.current = onSyncNow;

  // Auto reload countdown & trigger
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    setSecondsLeft(autoRefreshInterval);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimeout(() => {
            onSyncNowRef.current?.();
          }, 0);
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [autoRefreshInterval]);

  const handleManualSync = () => {
    if (onSyncNow) {
      onSyncNow();
    }
    setSecondsLeft(autoRefreshInterval || 60);
  };

  const floors = [
    { id: 'all', label: `全校舎・全企画 (${safeProjects.length})` },
    { id: 'high1', label: '本館 (高1 A〜J組 / 10クラス)' },
    { id: 'high2', label: '新館 (高2 A〜K組 / 11クラス)' },
  ];

  // Helper to check if a project uses tickets (either status level is 'ticket', ticketRequired is true, or has online ticket)
  const isTicketProject = (p: ClassProject) => {
    return (
      p.congestion?.level === 'ticket' ||
      p.congestion?.ticketRequired === true ||
      ['p-1b', 'p-1d', 'p-2a', 'p-2d', 'p-2e', 'p-2j'].includes(p.id) ||
      Boolean(p.onlineTicketUrl || p.onlineTicketNote)
    );
  };

  // Stats calculation
  const stats = useMemo(() => {
    let smooth = 0;
    let moderate = 0;
    let crowded = 0;
    let ticket = 0;
    let closed = 0;

    safeProjects.forEach((p) => {
      if (isTicketProject(p)) ticket++;
      
      if (p.congestion?.level === 'smooth') smooth++;
      else if (p.congestion?.level === 'moderate') moderate++;
      else if (p.congestion?.level === 'crowded') crowded++;
      else if (p.congestion?.level === 'closed') closed++;
    });

    return { smooth, moderate, crowded, ticket, closed, total: safeProjects.length };
  }, [safeProjects]);

  // Filtered and Sorted projects
  const filteredProjects = useMemo(() => {
    let list = safeProjects.filter((p) => {
      // Floor filter
      if (selectedFloor === 'high1' && p.grade !== '1年') return false;
      if (selectedFloor === 'high2' && p.grade !== '2年') return false;
      if (selectedFloor === 'clubs' && p.grade !== 'クラブ・有志') return false;

      // Status filter
      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'ticket') {
          if (!isTicketProject(p)) return false;
        } else {
          if (p.congestion.level !== selectedStatusFilter) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClass = p.classNumber.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchNote = p.congestion.statusNote?.toLowerCase().includes(q);
        const matchDetail = p.congestion.detailNote?.toLowerCase().includes(q);
        if (!matchTitle && !matchClass && !matchCat && !matchLoc && !matchNote && !matchDetail) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'waitAsc') {
      list = [...list].sort((a, b) => a.congestion.waitTimeMinutes - b.congestion.waitTimeMinutes);
    } else if (sortBy === 'waitDesc') {
      list = [...list].sort((a, b) => b.congestion.waitTimeMinutes - a.congestion.waitTimeMinutes);
    }

    return list;
  }, [projects, selectedFloor, selectedStatusFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5"
      >
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xs bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  リアルタイム混雑・待機状況
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                各企画の受付から最新の待機時間と整理券状況を配信中
              </p>
            </div>
          </div>
        </div>

        {/* Live Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Auto Refresh Selector with mini progress bar */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-2 rounded-xs text-xs font-medium text-slate-700 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>自動更新:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="bg-transparent font-bold text-emerald-900 focus:outline-none cursor-pointer"
            >
              <option value={30}>30秒</option>
              <option value={60}>1分</option>
              <option value={120}>2分</option>
              <option value={180}>3分</option>
              <option value={0}>手動のみ</option>
            </select>
            {autoRefreshInterval > 0 && (
              <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                {secondsLeft}s
              </span>
            )}
          </div>

          {/* Manual Refresh Button */}
          <motion.button
            id="congestion-manual-refresh-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '更新中...' : '最新状態に更新'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Status Breakdown Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'smooth' ? 'all' : 'smooth')}
          className={`p-3.5 rounded-xs border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedStatusFilter === 'smooth'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-emerald-300 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={selectedStatusFilter === 'smooth' ? 'text-white' : 'text-emerald-700'}>
              🟢 すぐ入れる
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedStatusFilter === 'smooth' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              0〜10分
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-2">
            {stats.smooth} <span className="text-xs font-normal opacity-80">企画</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'moderate' ? 'all' : 'moderate')}
          className={`p-3.5 rounded-xs border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedStatusFilter === 'moderate'
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-amber-300 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={selectedStatusFilter === 'moderate' ? 'text-white' : 'text-amber-700'}>
              🟡 やや混雑
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedStatusFilter === 'moderate' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
              15〜30分
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-2">
            {stats.moderate} <span className="text-xs font-normal opacity-80">企画</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'crowded' ? 'all' : 'crowded')}
          className={`p-3.5 rounded-xs border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedStatusFilter === 'crowded'
              ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-rose-300 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={selectedStatusFilter === 'crowded' ? 'text-white' : 'text-rose-700'}>
              🔴 大混雑
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedStatusFilter === 'crowded' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
              35分以上
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-2">
            {stats.crowded} <span className="text-xs font-normal opacity-80">企画</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'ticket' ? 'all' : 'ticket')}
          className={`p-3.5 rounded-xs border transition-all text-left flex flex-col justify-between cursor-pointer ${
            selectedStatusFilter === 'ticket'
              ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
              : 'bg-white border-slate-200/90 hover:border-purple-300 text-slate-800 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={selectedStatusFilter === 'ticket' ? 'text-white' : 'text-purple-700'}>
              🟣 整理券制
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedStatusFilter === 'ticket' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'}`}>
              オンライン/現地
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-2">
            {stats.ticket} <span className="text-xs font-normal opacity-80">企画</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedStatusFilter('all');
            setSelectedFloor('all');
            setSearchQuery('');
          }}
          className="p-3.5 rounded-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left flex flex-col justify-between text-slate-700 col-span-2 sm:col-span-1 cursor-pointer"
        >
          <div className="text-xs font-bold text-slate-500">
            全企画表示
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {stats.total} <span className="text-xs font-normal text-slate-500">件</span>
          </div>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xs border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Floor Selection Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {floors.map((fl) => (
              <button
                key={fl.id}
                onClick={() => setSelectedFloor(fl.id)}
                className={`px-3.5 py-2 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  selectedFloor === fl.id
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fl.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="企画名・クラス・場所..."
                className="w-full pl-9 pr-3 py-2 rounded-xs border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xs border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="default">標準順（クラス順）</option>
              <option value="waitAsc">待ち時間: 少ない順 🟢</option>
              <option value="waitDesc">待ち時間: 長い順 🔴</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedStatusFilter !== 'all' || searchQuery || selectedFloor !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-slate-400">絞り込み中:</span>
            {selectedFloor !== 'all' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                {floors.find((f) => f.id === selectedFloor)?.label}
              </span>
            )}
            {selectedStatusFilter !== 'all' && (
              <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                ステータス: {selectedStatusFilter}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                検索: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedFloor('all');
                setSelectedStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-emerald-600 hover:underline font-bold ml-1 cursor-pointer"
            >
              すべてクリア
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: All Class & Club Congestion Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-emerald-900" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              各フロア・教室別 混雑状況一覧 ({filteredProjects.length}件)
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            カードをタップして企画詳細・整理券情報を確認
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold">条件に該当する企画が見つかりませんでした。</p>
            <button
              onClick={() => {
                setSelectedFloor('all');
                setSelectedStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xs bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              すべての企画を表示
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredProjects.map((proj, index) => {
                let badgeColor = 'bg-emerald-50 border-emerald-200 text-emerald-900';
                let badgePill = 'bg-emerald-600 text-white';
                let waitTimeText = `${proj.congestion.waitTimeMinutes}分待ち`;
                let statusLabel = '空きあり (スムーズ)';
                let dotColor = 'bg-emerald-500';

                if (proj.congestion.level === 'moderate') {
                  badgeColor = 'bg-amber-50 border-amber-200 text-amber-900';
                  badgePill = 'bg-amber-600 text-white';
                  statusLabel = 'やや混雑';
                  dotColor = 'bg-amber-500';
                } else if (proj.congestion.level === 'crowded') {
                  badgeColor = 'bg-rose-50 border-rose-200 text-rose-900';
                  badgePill = 'bg-rose-600 text-white';
                  statusLabel = '大混雑';
                  dotColor = 'bg-rose-500 animate-pulse';
                } else if (proj.congestion.level === 'ticket') {
                  badgeColor = 'bg-purple-50 border-purple-200 text-purple-900';
                  badgePill = 'bg-purple-600 text-white';
                  statusLabel = '整理券配布制';
                  waitTimeText = '整理券受付';
                  dotColor = 'bg-purple-500';
                } else if (proj.congestion.level === 'closed') {
                  badgeColor = 'bg-slate-100 border-slate-200 text-slate-700';
                  badgePill = 'bg-slate-600 text-white';
                  statusLabel = '一時休止 / 終了';
                  waitTimeText = '受付休止';
                  dotColor = 'bg-slate-400';
                }

                return (
                  <motion.div
                    key={proj.id}
                    id={`congestion-card-${proj.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProject(proj.id)}
                    className="p-5 rounded-xs bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Top Tag & Location */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-100">
                            {proj.classNumber}
                          </span>
                          {proj.congestion.ticketRequired && (
                            <span className="text-[10px] bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                              <Ticket className="w-3 h-3 text-purple-600" />
                              <span>整理券</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{proj.location}</span>
                        </div>
                      </div>

                      {/* Title and Category */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {proj.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mt-0.5">
                          {proj.title}
                        </h3>
                      </div>

                      {/* Live Wait Time & Status Callout */}
                      <div className={`p-3.5 rounded-xs border ${badgeColor} space-y-1.5`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                            <span className="text-xs sm:text-sm font-bold tracking-tight">{statusLabel}</span>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badgePill}`}>
                            ⏱️ {waitTimeText}
                          </span>
                        </div>

                        {/* Detail Note (from detail text or status note) */}
                        {(proj.congestion.detailNote || proj.congestion.statusNote) && (
                          <div className="pt-1.5 border-t border-black/5 flex items-start space-x-1.5 text-xs">
                            <span className="shrink-0 font-bold px-1.5 py-0.2 rounded bg-black/10 text-[10px]">
                              案内
                            </span>
                            <span className="font-medium text-slate-700 line-clamp-2">
                              {proj.congestion.detailNote || proj.congestion.statusNote}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        更新: {proj.congestion.lastUpdated || '随時'}
                      </span>
                      <div className="flex items-center space-x-1 font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                        <span>詳細を見る</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
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

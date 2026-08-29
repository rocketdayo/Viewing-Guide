import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Megaphone
} from 'lucide-react';
import { AppDataState, ClassProject } from '../types';
import { LogoBadge } from './LogoBadge';
import { useI18n } from '../utils/i18n';

interface MonitorSignageViewProps {
  appData: AppDataState;
  onExit: () => void;
  onOpenGuide: () => void;
  onSelectProject: (projectId: string) => void;
  isSyncing?: boolean;
  lastSyncTime?: string | null;
  syncedCount?: number;
  onSyncNow?: () => void;
}

export const MonitorSignageView: React.FC<MonitorSignageViewProps> = ({
  appData,
  onExit,
  onOpenGuide,
  onSelectProject,
  isSyncing = false,
  lastSyncTime = null,
  onSyncNow,
}) => {
  const { language, t } = useI18n();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [autoRefreshInterval] = useState<number>(60);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'all' | 'high1' | 'high2' | 'ranking'>('all');
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    setSecondsLeft(autoRefreshInterval);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? autoRefreshInterval : prev - 1));
    }, 1000);

    const refreshInterval = setInterval(() => {
      if (onSyncNow) {
        onSyncNow();
      }
    }, autoRefreshInterval * 1000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [autoRefreshInterval, onSyncNow]);

  useEffect(() => {
    if (!isAutoCycling) return;
    const cycleInterval = setInterval(() => {
      setDisplayMode((prev) => {
        if (prev === 'all') return 'high1';
        if (prev === 'high1') return 'high2';
        if (prev === 'high2') return 'ranking';
        return 'all';
      });
    }, 12000);

    return () => clearInterval(cycleInterval);
  }, [isAutoCycling]);

  const handleRefresh = () => {
    if (onSyncNow) {
      onSyncNow();
    }
    setSecondsLeft(autoRefreshInterval || 15);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const month = currentTime.getMonth() + 1;
  const date = currentTime.getDate();
  const daysJa = ['日', '月', '火', '水', '木', '金', '土'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStr = language === 'en' ? daysEn[currentTime.getDay()] : daysJa[currentTime.getDay()];

  const projects = appData?.projects || [];
  const high1Projects = projects.filter((p) => p.grade === '1年');
  const high2Projects = projects.filter((p) => p.grade === '2年');
  const clubProjects = projects.filter((p) => p.grade === 'クラブ・有志');

  const rankingProjects = useMemo(() => {
    return [...projects].sort(
      (a, b) => a.congestion.waitTimeMinutes - b.congestion.waitTimeMinutes
    );
  }, [projects]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onExit}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            title={language === 'en' ? 'Back to Guide' : '通常の鑑賞ガイド画面に戻る'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'Back to Guide' : '鑑賞ガイドへ戻る'}</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <LogoBadge className="w-8 h-8" size={32} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded border border-sky-800/60">
                  {language === 'en' ? '2026 Seikyo' : '2026 清教学園'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
                  {language === 'en' ? 'Festival Live Signage' : '文化祭 デジタルサイネージ・大型モニター'}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>{language === 'en' ? 'Realtime Congestion & Wait Time Monitor' : 'リアルタイム混雑・待機時間モニター'}</span>
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {language === 'en' ? 'LIVE SYNC' : 'LIVE 同期中'}
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3.5 py-1 rounded-xs">
            <div className="text-[11px] text-slate-400 text-right leading-tight hidden sm:block">
              <div>{language === 'en' ? `${month}/${date}` : `${month}月${date}日`}</div>
              <div className="font-bold text-emerald-300">({dayStr})</div>
            </div>
            <div className="font-mono text-lg sm:text-2xl font-black text-white tracking-widest flex items-center">
              <span>{hours}</span>
              <span className="animate-pulse text-sky-400 mx-0.5">:</span>
              <span>{minutes}</span>
              <span className="text-xs sm:text-sm text-slate-400 ml-1">:{seconds}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xs border border-slate-700 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${secondsLeft <= 2 || isSyncing ? 'animate-spin' : ''}`} />
            <span className="text-slate-400">{language === 'en' ? 'Sync:' : '自動同期:'}</span>
            <span className="font-bold text-emerald-300 font-mono">{secondsLeft}{language === 'en' ? 's' : '秒'}</span>
            {lastSyncTime && (
              <span className="text-[10px] text-slate-400 font-mono">({lastSyncTime})</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden xl:flex items-center bg-slate-800 p-1 rounded-xs border border-slate-700 text-xs font-bold text-slate-300 space-x-1">
            <button
              onClick={() => setDisplayMode('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                displayMode === 'all' ? 'bg-emerald-600 text-white font-black' : 'hover:text-white'
              }`}
            >
              {language === 'en' ? 'All (25 Projects)' : '全館一覧（25企画）'}
            </button>
            <button
              onClick={() => setDisplayMode('high1')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                displayMode === 'high1' ? 'bg-emerald-600 text-white font-black' : 'hover:text-white'
              }`}
            >
              {language === 'en' ? 'Main Bldg / Gr.1 (10)' : '本館・高1（10組）'}
            </button>
            <button
              onClick={() => setDisplayMode('high2')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                displayMode === 'high2' ? 'bg-emerald-600 text-white font-black' : 'hover:text-white'
              }`}
            >
              {language === 'en' ? 'New Bldg / Gr.2 (11)' : '新館・高2（11組）'}
            </button>
            <button
              onClick={() => setDisplayMode('ranking')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                displayMode === 'ranking' ? 'bg-emerald-600 text-white font-black' : 'hover:text-white'
              }`}
            >
              {language === 'en' ? '🟢 Shortest Queue' : '🟢 空き順ランキング'}
            </button>
          </div>

          <button
            onClick={() => setIsAutoCycling(!isAutoCycling)}
            className={`px-2.5 py-1.5 rounded-xs border text-xs font-bold transition-all cursor-pointer ${
              isAutoCycling
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={language === 'en' ? 'Auto cycle display screens' : '一定時間ごとに画面を自動で切り替えます'}
          >
            {isAutoCycling ? (language === 'en' ? '🔄 Auto: ON' : '🔄 自動切替: ON') : (language === 'en' ? '🔄 Auto Cycle' : '🔄 自動切替')}
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            title={language === 'en' ? 'TV Connection Guide' : 'テレビやプロジェクターへの接続方法'}
          >
            <Tv className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{language === 'en' ? 'TV Guide' : 'TV接続'}</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title={language === 'en' ? 'Sync now' : '今すぐ再同期'}
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="F11"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? (language === 'en' ? 'Exit Fullscreen' : '全画面解除') : (language === 'en' ? 'Fullscreen (F11)' : '全画面 (F11)')}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 space-y-6">
        {displayMode === 'all' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <h2 className="text-lg font-black text-white tracking-wide">
                    {language === 'en' ? '[Main Bldg] Grade 1 (A-J / 10 classes)' : '【本館】高校1年 企画一覧（A〜J組 / 全10クラス）'}
                  </h2>
                </div>
                <span className="text-xs text-emerald-300 font-mono">
                  {language === 'en' ? 'Live Queue Data' : 'リアルタイム待機時間配信'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {high1Projects.map((p) => (
                  <SignageClassCard key={p.id} project={p} onClick={() => onSelectProject(p.id)} />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                  <h2 className="text-lg font-black text-white tracking-wide">
                    {language === 'en' ? '[New Bldg] Grade 2 (A-K / 11 classes)' : '【新館】高校2年 企画一覧（A〜K組 / 全11クラス）'}
                  </h2>
                </div>
                <span className="text-xs text-sky-300 font-mono">
                  {language === 'en' ? 'Live Queue Data' : 'リアルタイム待機時間配信'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {high2Projects.map((p) => (
                  <SignageClassCard key={p.id} project={p} onClick={() => onSelectProject(p.id)} />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <h2 className="text-lg font-black text-white tracking-wide">
                    {language === 'en' ? '[Special Wing / Gym] Clubs & Exhibits (4 projects)' : '【特別棟・体育館】クラブ・有志展示（全4企画）'}
                  </h2>
                </div>
                <span className="text-xs text-amber-300 font-mono">
                  {language === 'en' ? 'Clubs & Exhibits' : 'クラブ・有志'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {clubProjects.map((p) => (
                  <SignageClassCard key={p.id} project={p} onClick={() => onSelectProject(p.id)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {displayMode === 'high1' && (
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-white">
                {language === 'en' ? 'Main Bldg / Grade 1 (A-J) Queue Monitor' : '本館・高校1年（A〜J組） 混雑・待機状況'}
              </h2>
              <span className="text-sm text-emerald-400 font-bold">{language === 'en' ? '10 Classes' : '10クラス'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {high1Projects.map((p) => (
                <SignageClassCard key={p.id} project={p} isLarge onClick={() => onSelectProject(p.id)} />
              ))}
            </div>
          </div>
        )}

        {displayMode === 'high2' && (
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-white">
                {language === 'en' ? 'New Bldg / Grade 2 (A-K) Queue Monitor' : '新館・高校2年（A〜K組） 混雑・待機状況'}
              </h2>
              <span className="text-sm text-sky-400 font-bold">{language === 'en' ? '11 Classes' : '11クラス'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {high2Projects.map((p) => (
                <SignageClassCard key={p.id} project={p} isLarge onClick={() => onSelectProject(p.id)} />
              ))}
            </div>
          </div>
        )}

        {displayMode === 'ranking' && (
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>{language === 'en' ? '🟢 Shortest Waiting Time Ranking' : '🟢 今すぐ入りやすい企画ランキング'}</span>
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {language === 'en' ? 'Wait Time Order' : '待ち時間順'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'en' ? 'Sorted by lowest estimated wait time' : '待ち時間が短く空きのある企画順に表示しています'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rankingProjects.map((p, idx) => (
                <div key={p.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-xs font-black text-white">
                    {idx + 1}
                  </div>
                  <SignageClassCard project={p} onClick={() => onSelectProject(p.id)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2 text-amber-400 font-bold shrink-0">
          <Megaphone className="w-4 h-4 animate-bounce text-amber-400" />
          <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded uppercase text-[10px]">
            {language === 'en' ? 'NEWS FLASH' : '速報・ご案内'}
          </span>
        </div>

        <div className="flex-1 overflow-hidden mx-4">
          <div className="text-slate-200 text-xs truncate flex items-center space-x-6">
            <span>📢 {appData?.announcements?.[0]?.title || (language === 'en' ? 'Queue times are synchronized live via cloud GAS system.' : '各クラスの待機時間は自動集計システムによりリアルタイム同期されています。')}</span>
            <span className="text-slate-600">|</span>
            <span>💧 {language === 'en' ? 'Water stations available in Main Bldg 1F & Cafeteria.' : '【熱中症対策】本館1Fおよびカフェテリアに冷水給水所を設置しています。こまめな水分補給をお願いいたします。'}</span>
            <span className="text-slate-600">|</span>
            <span>🎭 {language === 'en' ? 'All 21 class exhibits open!' : '高1(A〜J組)・高2(A〜K組) 全21クラス企画開催中！'}</span>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2 text-slate-400 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden md:inline">{language === 'en' ? 'Live Signage Active' : '常時サイネージ配信中'}</span>
        </div>
      </footer>
    </div>
  );
};

interface SignageClassCardProps {
  project: ClassProject;
  isLarge?: boolean;
  onClick: () => void;
}

const SignageClassCard: React.FC<SignageClassCardProps> = ({ project, isLarge = false, onClick }) => {
  const { language, t } = useI18n();
  let badgeBg = 'bg-emerald-950/90 border-emerald-600/60 text-emerald-300';
  let dotColor = 'bg-emerald-400';
  let statusText = t.statusAvailable;
  let waitMinutes = `${project.congestion.waitTimeMinutes}${language === 'en' ? 'm' : '分'}`;

  if (project.congestion.level === 'moderate') {
    badgeBg = 'bg-amber-950/90 border-amber-600/60 text-amber-300';
    dotColor = 'bg-amber-400';
    statusText = t.statusModerate;
  } else if (project.congestion.level === 'crowded') {
    badgeBg = 'bg-rose-950/90 border-rose-600/60 text-rose-300';
    dotColor = 'bg-rose-500 animate-pulse';
    statusText = t.statusCrowded;
  } else if (project.congestion.level === 'ticket') {
    badgeBg = 'bg-purple-950/90 border-purple-600/60 text-purple-300';
    dotColor = 'bg-purple-400';
    statusText = t.statusTicket;
    waitMinutes = language === 'en' ? 'Ticket' : '整理券';
  } else if (project.congestion.level === 'closed') {
    badgeBg = 'bg-slate-900 border-slate-700 text-slate-400';
    dotColor = 'bg-slate-500';
    statusText = t.statusClosed;
    waitMinutes = language === 'en' ? 'Closed' : '休止';
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xs bg-slate-900/90 border border-slate-800 hover:border-emerald-500/80 hover:bg-slate-850 transition-all cursor-pointer flex flex-col justify-between shadow-xs group ${
        isLarge ? 'p-4' : 'p-3'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-black text-xs sm:text-sm text-white bg-emerald-900/80 border border-emerald-700/60 px-2 py-0.5 rounded-lg">
            {project.classNumber}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {project.location.split(' ')[0]}
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <div className={`p-2 rounded-xs border flex items-center justify-between ${badgeBg}`}>
          <div className="flex items-center space-x-1.5 text-xs font-black">
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span>{statusText}</span>
          </div>
          <span className="text-xs font-black font-mono">
            ⏱️ {waitMinutes}
          </span>
        </div>

        {(project.congestion.detailNote || project.congestion.statusNote) && (
          <div className="text-[11px] text-sky-200 bg-sky-950/60 px-2 py-1 rounded-lg border border-sky-800/60 flex items-start gap-1">
            <span className="shrink-0 text-sky-400 font-bold">💬</span>
            <span className="line-clamp-2 leading-tight">
              {project.congestion.detailNote || project.congestion.statusNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

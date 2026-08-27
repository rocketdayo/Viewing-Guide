import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Layers, 
  Activity, 
  MessageSquare, 
  ChevronRight, 
  Bookmark, 
  Megaphone,
  ListTree,
  Building,
  Radio,
  ExternalLink,
  Phone,
  ArrowRight,
  GraduationCap,
  HelpCircle,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppDataState, ClassProject } from '../types';
import { AlumniSection } from './AlumniSection';
import { AnnouncementsSection } from './AnnouncementsSection';
import { BloodDonationSection } from './BloodDonationSection';
import { useI18n } from '../utils/i18n';

interface HomeViewProps {
  appData: AppDataState;
  onNavigate: (page: string, anchor?: string) => void;
  onSelectProject: (projectId: string) => void;
  onOpenToc: () => void;
  bookmarks?: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  appData,
  onNavigate,
  onSelectProject,
  onOpenToc,
  bookmarks = [],
}) => {
  const { language, t } = useI18n();
  const [selectedGreetingTab, setSelectedGreetingTab] = useState<string>(
    appData?.greetings?.[0]?.id || ''
  );

  const projects = appData?.projects || [];
  const featuredProjects = projects.slice(0, 4);
  const activeGreeting =
    (appData?.greetings || []).find((g) => g.id === selectedGreetingTab) ||
    (appData?.greetings || [])[0];

  const smoothCount = projects.filter((p) => p.congestion.level === 'smooth').length;
  const pinnedAnnouncement = appData?.announcements?.find((a) => a.isPinned);

  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      if (!line.trim()) {
        return <div key={lIdx} className="h-3" />;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return (
                <strong
                  key={pIdx}
                  className="font-bold text-slate-950 underline decoration-emerald-500 decoration-2 underline-offset-4"
                >
                  {boldText}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-0 pb-20 bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. 桜十字病院スタイル プレミアム・ホワイト・エントランス（ luminous institutional hero） */}
      <section className="relative w-full bg-[#FAFBFD] border-b border-slate-200 overflow-hidden">
        {/* Subtle architectural grid lines */}
        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Top subtle emerald gradient wash */}
        <div className="absolute top-0 right-0 w-full lg:w-2/3 h-full bg-gradient-to-l from-emerald-50/60 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Brand, Title & Core Message */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2.5 bg-white px-3 py-1.5 border border-slate-300/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-slate-700 uppercase">
                  2026 SEIKYO FESTIVAL OFFICIAL PORTAL
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-slate-900 leading-[1.2]">
                  清教エナジー！<br />
                  <span className="text-emerald-800 font-medium">～1度しかない学園生活を楽しもう～</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl pt-1">
                  清教学園高等学校・中学校 文化祭公式ポータルサイトへようこそ。
                  生徒たちが情熱を注いで創り上げる各企画・ステージのタイムスケジュールやリアルタイム混雑状況をスムーズにご案内いたします。
                </p>
              </div>

              {/* Event Info Box (Institutional style) */}
              <div className="bg-white p-5 border border-slate-300/90 shadow-2xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between text-xs font-mono border-b border-slate-100 pb-2 gap-2">
                  <span className="text-emerald-800 font-bold uppercase tracking-wider">フェスティバル・インフォメーション</span>
                  <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-200 font-sans font-semibold text-[11px]">対象：本校生徒・保護者・招待者のみ</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong className="text-slate-900">開催日程：</strong>{appData.dates}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong className="text-slate-900">会場：</strong>清教学園</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('classes')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold tracking-wider transition-all shadow-sm cursor-pointer flex items-center space-x-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>クラス・クラブ企画一覧 ({projects.length})</span>
                </button>
                <button
                  onClick={() => onNavigate('congestion')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold tracking-wider transition-all border border-slate-300 shadow-2xs cursor-pointer flex items-center space-x-2"
                >
                  <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
                  <span>リアルタイム混雑状況</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Status & Quick Announcements */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-300/90 p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">本日のリアルタイム状況</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-mono font-bold">稼働中</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F8F9FA] border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">スムーズに入場可能</div>
                    <div className="text-3xl font-serif font-bold text-emerald-800 mt-1">
                      {smoothCount} <span className="text-xs font-sans font-normal text-slate-500">企画</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#F8F9FA] border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-medium">公開中の全企画数</div>
                    <div className="text-3xl font-serif font-bold text-slate-900 mt-1">
                      {projects.length} <span className="text-xs font-sans font-normal text-slate-500">件</span>
                    </div>
                  </div>
                </div>

                {pinnedAnnouncement && (
                  <div 
                    onClick={() => {
                      document.getElementById('announcements-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-4 bg-amber-50/80 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-800">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
                        【重要なお知らせ】
                      </span>
                      <span>{pinnedAnnouncement.timestamp || (pinnedAnnouncement as any).date}</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">{pinnedAnnouncement.title}</p>
                    <div className="text-[10px] text-amber-700 font-bold flex items-center justify-end">
                      <span>お知らせ一覧を見る ↓</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
                  <span className="text-[11px]">落とし物・お問い合わせ：本館1階 職員室</span>
                  <button 
                    onClick={() => onNavigate('map')}
                    className="text-emerald-800 hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>校内マップ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. クイックジャンプ・機能ナビゲーション (Clean institutional grid) */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">NAVIGATION DIRECTORY</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">サイト内クイックディレクトリ</h2>
            </div>
            <button
              onClick={onOpenToc}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-900 bg-white px-4 py-2.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ListTree className="w-4 h-4 text-emerald-700" />
              <span>すべての目次・索引を見る</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: t.navClasses,
                desc: '高1・高2の全企画、模擬店、演劇、展示の場所や詳細を一覧で検索',
                icon: Layers,
                action: () => onNavigate('classes'),
                tag: '全企画掲載',
              },
              {
                title: t.navCongestion,
                desc: '各教室・劇場の待ち時間と混雑度をリアルタイム配信',
                icon: Activity,
                action: () => onNavigate('congestion'),
                tag: 'リアルタイム',
              },
              {
                title: 'よくある質問＆来場マナー',
                desc: '土足禁止・整理券・飲食・撮影/プライバシー配慮・ゴミ分別ガイド',
                icon: HelpCircle,
                action: () => onNavigate('faq'),
                tag: '必読案内',
              },
              {
                title: 'マイタイムライン＆共有',
                desc: '気になる企画をクリップして当日巡回計画を作成・LINEやSNSで共有',
                icon: Bookmark,
                action: () => onNavigate('bookmarks'),
                tag: '便利ツール',
              },
              {
                title: t.navSchedule,
                desc: '各ステージ・イベントの公演タイムテーブル（制作中）',
                icon: Calendar,
                action: () => onNavigate('schedule'),
                tag: '制作中',
              },
              {
                title: t.navMap,
                desc: '清教学園校内の配置図・フロアマップ（制作中）',
                icon: MapPin,
                action: () => onNavigate('map'),
                tag: '制作中',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.action}
                  className="bg-[#FAFBFD] p-6 border border-slate-200 hover:border-emerald-700 transition-all cursor-pointer group flex flex-col justify-between space-y-5 shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 font-bold bg-slate-200 text-slate-700">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-emerald-800 pt-3 border-t border-slate-200/80 group-hover:translate-x-1 transition-transform">
                    <span>詳細を確認する</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.3 ごあいさつセクション (Institutional Greetings Tabs - Text Only) */}
      <section id="greetings-section" className="py-14 bg-[#FAFBFD] border-b border-slate-200 transition-opacity duration-700 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">GREETINGS & MESSAGES</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">ごあいさつ</h2>
            </div>

            {/* Greeting Tabs */}
            <div className="flex flex-wrap gap-1 bg-white p-1 border border-slate-300">
              {(appData?.greetings || []).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGreetingTab(g.id)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedGreetingTab === g.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {g.role} {g.name}
                </button>
              ))}
            </div>
          </div>

          {activeGreeting && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeGreeting.id}
              className="bg-white p-6 sm:p-10 border border-slate-300 shadow-2xs space-y-6"
            >
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-mono text-emerald-800 font-bold">{activeGreeting.role}</div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                    {activeGreeting.themeTitle || (activeGreeting as any).title || `${activeGreeting.role}からのごあいさつ`}
                  </h3>
                  <div className="text-sm font-bold text-slate-700 mt-1">{activeGreeting.name}</div>
                </div>
                {activeGreeting.message.includes('確認中') && (
                  <span className="self-start sm:self-auto px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold rounded-xs">
                    内容確認中
                  </span>
                )}
              </div>

              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                {renderFormattedMessage(activeGreeting.message)}
              </div>

              {activeGreeting.profileNote && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 font-mono">
                  {activeGreeting.profileNote}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* 2.4 お知らせ・緊急速報 配信サービス (Live Announcements Feed) */}
      <AnnouncementsSection announcements={appData?.announcements || []} />

      {/* 2.5 清教学園同窓会（清教会）特別企画 特設セクション (PDF 1P: 未来の仕事図鑑 / PDF 2P: 先輩グルメ) */}
      <AlumniSection />

      {/* 2.6 文化祭 献血（食堂前・オンライン整理券受付） */}
      <BloodDonationSection />

      {/* 4. 注目のピックアップ企画 (Featured Projects Section with progressive fade-out styling) */}
      <section className="py-14 bg-white opacity-95 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">PICKUP EXHIBITIONS</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">注目のクラス・部活企画</h2>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              すべての企画一覧を見る →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProjects.map((proj) => {
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="bg-[#FAFBFD] p-6 border border-slate-200 hover:border-emerald-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-2xs group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-b border-slate-200/80 pb-2.5">
                      <span className="bg-white px-2 py-0.5 border border-slate-300 font-bold text-slate-900">{proj.classNumber}</span>
                      <span className="text-emerald-800 font-bold">{proj.category}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="text-[11px] text-slate-600 pt-1 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{proj.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>詳細を確認</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

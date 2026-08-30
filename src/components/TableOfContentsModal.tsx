import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  Calendar, 
  MessageSquare, 
  Activity, 
  MapPin, 
  Shield, 
  ChevronRight, 
  BookOpen, 
  GraduationCap, 
  Radio, 
  Heart,
  Compass,
  Home,
  Bookmark,
  Search,
  Sparkles,
  HelpCircle,
  Smartphone,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppDataState } from '../types';
import { LogoBadge } from './LogoBadge';
import { useI18n } from '../utils/i18n';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
  appData: AppDataState;
  onNavigate: (page: string, anchor?: string) => void;
  onSelectProject: (projectId: string) => void;
  onOpenSearch?: () => void;
  onOpenPwaModal?: () => void;
  bookmarksCount?: number;
  isAdminLoggedIn?: boolean;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  currentPage = 'home',
  appData,
  onNavigate,
  onSelectProject,
  onOpenSearch,
  onOpenPwaModal,
  bookmarksCount = 0,
  isAdminLoggedIn = false,
}) => {
  const { language, toggleLanguage, t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleJump = (page: string, anchor?: string) => {
    document.body.style.overflow = '';
    onNavigate(page, anchor);
    onClose();
  };

  const handleProjectClick = (projectId: string) => {
    onSelectProject(projectId);
    onClose();
  };

  const primaryNavItems = [
    { 
      id: 'home', 
      label: t.navHome, 
      desc: language === 'en' ? 'Main Portal, Overview, News' : '総合トップ・開催概要・速報', 
      icon: Home, 
      color: 'emerald' 
    },
    { 
      id: 'schedule', 
      label: t.navSchedule, 
      desc: language === 'en' ? 'Stage performances & Timetable' : 'チャペル・体育館・ステージ公演', 
      icon: Calendar, 
      isDraft: true, 
      color: 'sky' 
    },
    { 
      id: 'classes', 
      label: t.navClasses, 
      desc: language === 'en' ? `Grade 10 & 11 (${appData?.projects?.length || 21} projects)` : `高1・高2 全${appData?.projects?.length || 21}企画の詳細・展示`, 
      icon: Layers, 
      color: 'emerald' 
    },
    { 
      id: 'congestion', 
      label: t.navCongestion, 
      desc: language === 'en' ? 'Live wait times & status' : '各教室の待ち時間・現在の状況', 
      icon: Activity, 
      color: 'amber' 
    },
    { 
      id: 'map', 
      label: t.navMap, 
      desc: language === 'en' ? 'Main & New building campus maps' : '本館・新館・特別棟・チャペル', 
      icon: MapPin, 
      isDraft: true, 
      color: 'rose' 
    },
    { 
      id: 'bookmarks', 
      label: t.navBookmarks, 
      desc: language === 'en' ? `Saved bookmarks (${bookmarksCount} items)` : `保存した企画・巡回スケジュール（${bookmarksCount}件）`, 
      icon: Bookmark, 
      color: 'indigo' 
    },
    { 
      id: 'faq', 
      label: t.navFaq, 
      desc: language === 'en' ? 'Shoes policy, Tickets, Food, Privacy' : '土足禁止・整理券・飲食・プライバシー/撮影・職員室', 
      icon: HelpCircle, 
      color: 'teal' 
    },
    ...(isAdminLoggedIn ? [{ 
      id: 'admin', 
      label: t.navAdmin, 
      desc: language === 'en' ? 'Admin console & updates' : '混雑度・お知らせ・企画編集', 
      icon: Shield, 
      color: 'slate' 
    }] : []),
  ];

  const specialSections = [
    {
      title: language === 'en' ? 'FAQ & Visitor Etiquette Guide' : 'よくある質問＆来場者マナーガイド',
      desc: language === 'en' ? 'Indoor shoes, ticketing, food areas, photography rules, first aid' : '土足禁止・整理券・飲食エリア・撮影/SNSプライバシー・救護・落とし物（職員室）',
      icon: HelpCircle,
      color: 'text-teal-800 bg-teal-50 border-teal-200',
      action: () => handleJump('faq'),
    },
    {
      title: language === 'en' ? 'Official Greetings' : 'ご挨拶（学校長・生徒会・実行委員長）',
      desc: language === 'en' ? 'Messages from Principal and Student Council' : '文化祭開催にあたってのメッセージとテーマ発表',
      icon: MessageSquare,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      action: () => handleJump('home', 'greetings-section'),
    },
    {
      title: language === 'en' ? 'Official News & Alerts' : 'お知らせ・緊急速報 配信サービス',
      desc: language === 'en' ? 'Schedule updates and important announcements' : 'タイムテーブル変更や学園からの重要なお知らせ・緊急連絡',
      icon: Radio,
      color: 'text-emerald-800 bg-emerald-50/80 border-emerald-200',
      action: () => handleJump('home', 'announcements-section'),
    },
    {
      title: language === 'en' ? 'Student Portal (@stu.seikyo.ed.jp)' : '生徒専用：携帯ルール・日程・業務連絡',
      desc: language === 'en' ? 'Internal operations, mobile guidelines, and grade timelines' : '【@stu.seikyo.ed.jp専用】携帯電話使用ルール、前日・1日目・2日目の全行程連絡',
      icon: ShieldCheck,
      color: 'text-emerald-800 bg-emerald-100/70 border-emerald-300',
      action: () => handleJump('home', 'student-portal-section'),
    },
    {
      title: language === 'en' ? 'Alumni Association Special Features' : '清教学園同窓会 特別企画',
      desc: language === 'en' ? 'Career Guidebook & Alumni Food Stall features' : '特設案内：『未来の仕事図鑑』＆『先輩グルメ』',
      icon: GraduationCap,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      action: () => handleJump('home', 'alumni-section'),
    },
    {
      title: language === 'en' ? 'School Tour for Alumni & Prospective Students' : 'OB・入試希望者向け 校内ツアー',
      desc: language === 'en' ? '10:00 / 12:00 / 14:00 Meet at Gym 1 Entrance' : '10:00〜 / 12:00〜 / 14:00〜 集合：第一体育館前（景品あり）',
      icon: Compass,
      color: 'text-teal-900 bg-teal-50 border-teal-200',
      action: () => handleJump('home', 'campus-tour-section'),
    },
    {
      title: language === 'en' ? 'Festival Blood Donation Drive' : '文化祭 献血コーナー（食堂前）',
      desc: language === 'en' ? 'In front of cafeteria, Online tickets accepted' : '食堂前にて実施・オンライン整理券受付のご案内',
      icon: Heart,
      color: 'text-rose-800 bg-rose-50 border-rose-200',
      action: () => handleJump('home', 'blood-donation-section'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            id="menu-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            onTouchEnd={(e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
            aria-label={t.close}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
            <motion.div
              id="menu-modal-drawer"
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ 
                type: 'spring', 
                damping: 28, 
                stiffness: 280,
                mass: 0.8
              }}
              className="w-screen max-w-lg md:max-w-xl bg-white shadow-2xl flex flex-col pointer-events-auto border-l border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center space-x-3">
                <LogoBadge className="w-9 h-9 shrink-0" size={36} />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.2 rounded">{t.academicYear}</span>
                    <span className="text-[11px] text-slate-300">{t.schoolName}</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    {language === 'en' ? 'Table of Contents & Navigation' : 'メニュー・全ページ目次'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {onOpenSearch && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSearch();
                    }}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
                    title={t.search}
                    aria-label={t.search}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
                <button
                  id="close-menu-drawer-btn"
                  onClick={onClose}
                  className="p-2 rounded-xs text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                  aria-label={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-800">
              {onOpenSearch && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xs transition-all text-left text-xs sm:text-sm text-slate-500 cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                    <span>{language === 'en' ? 'Search by project name, class, keyword...' : '企画名・クラス番号・キーワードで検索...'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 border border-slate-200 rounded">{t.search}</span>
                </button>
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'en' ? 'Main Pages' : 'メインページ'}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">{language === 'en' ? 'Tap to navigate' : 'タップで移動'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleJump(item.id)}
                        className={`p-3 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                          isActive 
                            ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/40 text-emerald-950' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-600'}`} />
                            <span className={isActive ? 'text-emerald-950 font-black' : 'text-slate-800'}>{item.label}</span>
                          </span>
                          {item.isDraft ? (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">{language === 'en' ? 'Draft' : '制作中'}</span>
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'en' ? 'Special Features & Sections' : '特設案内・各種コーナー（目次）'}</span>
                </h3>

                <div className="space-y-2">
                  {specialSections.map((sec, idx) => {
                    const Icon = sec.icon;
                    return (
                      <button
                        key={idx}
                        onClick={sec.action}
                        className={`w-full p-3 rounded-xs border text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs ${sec.color} hover:brightness-95`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-xs sm:text-sm block">{sec.title}</span>
                            <span className="text-[11px] opacity-80 block">{sec.desc}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'en' ? 'Class Projects Directory' : '学年別クラス企画 索引'}</span>
                  </h3>
                  <button
                    onClick={() => handleJump('classes')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{language === 'en' ? 'View all' : '全企画を見る'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {['1年', '2年'].map((grade) => {
                    const gradeProjects = appData?.projects?.filter((p) => p.grade === grade) || [];
                    if (gradeProjects.length === 0) return null;
                    return (
                      <div key={grade} className="rounded-xs p-3 border bg-slate-50/80 border-slate-200">
                        <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-3 bg-emerald-600 rounded-full inline-block"></span>
                            <span>{language === 'en' ? (grade === '1年' ? 'Grade 10 (HS 1st Year)' : 'Grade 11 (HS 2nd Year)') : `高校 ${grade}`}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">{gradeProjects.length} {language === 'en' ? 'projects' : '企画'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5">
                          {gradeProjects.map((proj) => (
                            <button
                              key={proj.id}
                              onClick={() => handleProjectClick(proj.id)}
                              className="px-2 py-1.5 rounded-xs border text-left transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 group overflow-hidden"
                            >
                              <span className="font-bold text-emerald-900 text-xs shrink-0 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                                {proj.classNumber}
                              </span>
                              <span className="text-xs text-slate-700 truncate group-hover:text-emerald-950 font-medium">
                                {proj.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'ja' ? 'English' : '日本語'}</span>
                </button>
                {onOpenPwaModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPwaModal();
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Install App (PWA)' : 'アプリ化・PWA'}</span>
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.close}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  );
};

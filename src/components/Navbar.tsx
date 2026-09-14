import React from 'react';
import { 
  Home, 
  Calendar, 
  Layers, 
  Activity, 
  MapPin, 
  Shield, 
  Menu, 
  Search, 
  ChevronRight,
  Bookmark,
  Globe,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppDataState } from '../types';
import { LogoBadge } from './LogoBadge';
import { useI18n } from '../utils/i18n';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string, anchor?: string) => void;
  appData: AppDataState;
  isAdminLoggedIn: boolean;
  onOpenSearch: () => void;
  onOpenToc: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  appData,
  isAdminLoggedIn,
  onOpenSearch,
  onOpenToc,
  bookmarksCount,
}) => {
  const { language, toggleLanguage, t } = useI18n();

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'schedule', label: t.navSchedule, icon: Calendar, isDraft: true },
    { id: 'classes', label: t.navClasses, icon: Layers },
    { id: 'congestion', label: t.navCongestion, icon: Activity },
    { id: 'map', label: t.navMap, icon: MapPin, isDraft: true },
    { id: 'faq', label: language === 'en' ? 'FAQ & Manners' : 'FAQ・マナー', icon: HelpCircle },
    ...(isAdminLoggedIn ? [{ id: 'admin', label: t.navAdmin, icon: Shield, isAdmin: true }] : []),
  ];

  const handleNav = (id: string, anchor?: string) => {
    setCurrentPage(id, anchor);
  };

  const pinnedAnnouncement = appData?.announcements?.find(
    (a) => a.isPinned && a.id !== 'ann-pwa-install-guide' && !a.title?.includes('ホーム画面')
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {pinnedAnnouncement && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          id="pinned-announcement-bar"
          onClick={() => {
            handleNav('home', 'announcements-section');
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-2 max-w-5xl mx-auto overflow-hidden">
            <span className="bg-white text-amber-600 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide shrink-0">
              {language === 'en' ? 'ALERT' : '速報'}
            </span>
            <span className="truncate">{pinnedAnnouncement.title}</span>
          </div>
          <div className="flex items-center space-x-1 shrink-0 text-xs font-bold text-amber-100">
            <span>{language === 'en' ? 'View' : '開く'}</span>
            <ChevronRight className="w-4 h-4 opacity-80" />
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <LogoBadge className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" size={40} />
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-bold tracking-widest text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded-xs font-brand shrink-0">
                  {t.academicYear}
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:inline shrink-0">
                  {t.schoolName}
                </span>
                <h1 className="font-cormorant font-bold tracking-wide text-lg sm:text-xl text-slate-900 group-hover:text-emerald-900 transition-colors leading-none">
                  SGfes公式サイト
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block truncate max-w-xs lg:max-w-md mt-1">
                {appData?.festivalTheme ? appData.festivalTheme : t.themeLabel}
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`relative p-2 rounded-full transition-all cursor-pointer group ${
                    isActive 
                      ? 'text-emerald-900 bg-white shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-emerald-700' : ''}`} />
                  {item.isDraft && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-xs shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                    {item.isDraft && ` (${language === 'en' ? 'Draft' : '制作中'})`}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xs text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
              aria-label="Language switch"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-mono uppercase">{language === 'ja' ? 'EN' : '日本語'}</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
              title={t.search}
              aria-label={t.search}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNav('bookmarks')}
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xs transition-colors relative cursor-pointer"
              title={t.navBookmarks}
              aria-label={t.navBookmarks}
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            
            <button
              id="hamburger-menu-btn"
              onClick={onOpenToc}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xs bg-emerald-50/90 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 transition-colors cursor-pointer"
              title={t.navToc}
              aria-label={t.navToc}
            >
              <Menu className="w-5 h-5 text-emerald-800" />
              <span className="text-xs font-bold hidden sm:inline">{t.navToc}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

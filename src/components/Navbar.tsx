import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Layers, 
  Activity, 
  MapPin, 
  Shield, 
  Menu, 
  X, 
  Sparkles, 
  Search, 
  ChevronRight,
  Bookmark,
  ListTree,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppDataState } from '../types';
import { LogoBadge } from './LogoBadge';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'schedule', label: 'タイムテーブル', icon: Calendar, isDraft: true },
    { id: 'classes', label: 'クラス企画', icon: Layers },
    { id: 'congestion', label: '混雑状況', icon: Activity },
    { id: 'map', label: '校内マップ', icon: MapPin, isDraft: true },
    ...(isAdminLoggedIn ? [{ id: 'admin', label: '管理パネル', icon: Shield, isAdmin: true }] : []),
  ];

  const handleNav = (id: string) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pinnedAnnouncement = appData?.announcements?.find((a) => a.isPinned);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Pinned News Banner if exists */}
      {pinnedAnnouncement && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          id="pinned-announcement-bar"
          onClick={() => handleNav('home')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-2 max-w-5xl mx-auto overflow-hidden">
            <span className="bg-white text-amber-600 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide shrink-0">
              速報
            </span>
            <span className="truncate">{pinnedAnnouncement.title}</span>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0 opacity-80" />
        </motion.div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Branding */}
          <div 
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <LogoBadge className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" size={40} />
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  2026年度
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  清教学園高等学校
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                文化祭鑑賞ガイド
                <span className="text-xs font-normal text-slate-500 hidden md:inline">
                  「{appData?.festivalTheme ? appData.festivalTheme.replace(/^「|」$/g, '') : '清教エナジー！～1度しかない学園生活を楽しもう～'}」
                </span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xs transition-all relative text-xs font-bold cursor-pointer ${
                    isActive 
                      ? 'text-emerald-900 bg-emerald-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.label}</span>
                  {item.isDraft && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1 py-0.2 rounded-xs ml-0.5">制作中</span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="navbarIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
              title="サイト内検索"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNav('bookmarks')}
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xs transition-colors relative cursor-pointer"
              title="ブックマーク"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={onOpenToc}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xs transition-colors cursor-pointer"
              title="目次一覧"
            >
              <ListTree className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`flex items-center space-x-2.5 p-3 rounded-xs transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold">{item.label}</span>
                      {item.isDraft && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1 py-0.2 rounded-xs ml-auto">制作中</span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={onOpenToc}
                  className="flex items-center space-x-1 text-emerald-700 font-bold py-1 cursor-pointer"
                >
                  <ListTree className="w-4 h-4" />
                  <span>全ページ目次</span>
                </button>
                <span>清教学園文化祭実行委員会</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

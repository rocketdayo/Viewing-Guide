import React from 'react';
import { Home, Calendar, Layers, Activity, MapPin, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../utils/i18n';

interface BottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  bookmarksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  setCurrentPage,
  bookmarksCount,
}) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'classes', label: t.navClasses, icon: Layers },
    { id: 'congestion', label: t.navCongestion, icon: Activity },
    { id: 'bookmarks', label: t.navBookmarks, icon: Bookmark },
    { id: 'map', label: t.navMap, icon: MapPin },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => {
                setCurrentPage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xs transition-all cursor-pointer"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-emerald-900 scale-110'
                      : 'text-slate-400'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight transition-colors ${
                  isActive
                    ? 'text-emerald-900'
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-6 h-0.5 rounded-full bg-emerald-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

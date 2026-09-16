import React, { useState, useRef } from 'react';
import { MapPin, ExternalLink, RefreshCw, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ClassProject } from '../types';
import { useI18n } from '../utils/i18n';

interface CampusMapViewProps {
  projects?: ClassProject[];
  onSelectProject?: (projectId: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = () => {
  const { language, t } = useI18n();
  const [currentPath, setCurrentPath] = useState<string>('/map/index.html');
  const [key, setKey] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const floors = [
    { label: language === 'en' ? 'Main Map' : '全体マップ', path: '/map/index.html' },
    { label: language === 'en' ? 'B1F' : '地下1階', path: '/map/floor地下.html' },
    { label: language === 'en' ? '1F' : '1階', path: '/map/floor1.html' },
    { label: language === 'en' ? '2F' : '2階', path: '/map/floor2.html' },
    { label: language === 'en' ? '3F' : '3階', path: '/map/floor3.html' },
    { label: language === 'en' ? '4F' : '4階', path: '/map/floor4.html' },
  ];

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    window.open(currentPath, '_blank');
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xs p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-xs bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.navMap}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              {t.mapTitle}
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {t.mapSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-2 rounded-xs border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title={language === 'en' ? 'Reload Map' : 'マップ再読み込み'}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'Reload' : '再読み込み'}</span>
            </button>

            <button
              onClick={handleOpenNewTab}
              className="px-3 py-2 rounded-xs border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title={language === 'en' ? 'Open in new tab' : '別タブで拡大表示'}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'New Tab' : '別タブで開く'}</span>
            </button>

            <button
              onClick={handleFullscreen}
              className="px-3 py-2 rounded-xs bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title={language === 'en' ? 'Fullscreen' : '全画面表示'}
            >
              <Maximize2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Fullscreen' : '全画面'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          {floors.map((floor) => {
            const isActive = currentPath === floor.path;
            return (
              <button
                key={floor.path}
                onClick={() => setCurrentPath(floor.path)}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {floor.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div
        ref={containerRef}
        className="bg-white border border-slate-200 rounded-xs shadow-xs overflow-hidden relative"
      >
        <iframe
          key={`${currentPath}-${key}`}
          src={currentPath}
          title="校内マップ"
          className="w-full h-[75vh] min-h-[500px] max-h-[900px] border-0"
          allow="fullscreen"
        />
      </div>
    </div>
  );
};


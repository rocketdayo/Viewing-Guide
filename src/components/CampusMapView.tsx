import React from 'react';
import { MapPin, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { ClassProject } from '../types';
import { useI18n } from '../utils/i18n';

interface CampusMapViewProps {
  projects?: ClassProject[];
  onSelectProject?: (projectId: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = () => {
  const { language, t } = useI18n();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
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
        </div>
      </motion.div>

      <div className="bg-white border border-slate-200 rounded-xs p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.mapUnderConstruction}</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {language === 'en'
            ? 'The illustrated campus map and interactive classroom links are currently being prepared. Please check back soon.'
            : 'クリスタ（CLIP STUDIO PAINT）等で作成したマップ画像の配置、および各クラスへのリンク設定作業を行っています。公開まで今しばらくお待ちください。'}
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar, Wrench, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ScheduleEvent } from '../types';

interface ScheduleViewProps {
  schedules: ScheduleEvent[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = () => {
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
            <div className="p-2 rounded-xs bg-sky-50 text-sky-700">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ステージ・タイムスケジュール
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            チャペル大講堂、体育館、中庭特設ステージでの公演・LIVE・セレモニーの全日程
          </p>
        </div>
      </motion.div>

      {/* Under Construction Banner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-300 p-8 sm:p-12 text-center shadow-xs rounded-xs my-8 space-y-6"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center mx-auto shadow-2xs">
          <Wrench className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest rounded-xs">
            只今、プログラム作成中
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            タイムスケジュールは現在制作中です
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            ステージ発表・イベントの最新タイムテーブルは現在調整を行っております。<br className="hidden sm:inline" />
            詳細なプログラム確定まで今しばらくお待ちください。
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>最新発表は本サイトで順次更新</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>清教学園 文化祭実行委員会</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Users, 
  Filter, 
  Star, 
  Music, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScheduleEvent } from '../types';

interface ScheduleViewProps {
  schedules: ScheduleEvent[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules }) => {
  const [selectedDay, setSelectedDay] = useState<'Day1' | 'Day2'>('Day1');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const venues = ['all', 'チャペル大講堂', '体育館アリーナ', '中庭特設ウッドステージ', '特別棟'];
  const categories = ['all', 'セレモニー', 'ステージ', 'ライブ', 'コンテスト'];

  const filteredSchedules = schedules
    .filter((s) => {
      if (s.day !== selectedDay && s.day !== '両日') return false;
      if (selectedVenue !== 'all' && !s.venue.includes(selectedVenue)) return false;
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
              ステージ・タイムテーブル
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            チャペル大講堂、体育館、中庭特設ステージでの公演・LIVE・セレモニーの全日程
          </p>
        </div>

        {/* Day 1 / Day 2 Big Toggle */}
        <div className="flex p-1.5 bg-slate-100 rounded-xs space-x-1.5 self-start md:self-auto">
          <button
            id="schedule-day1-tab"
            onClick={() => setSelectedDay('Day1')}
            className={`px-5 py-2 rounded-xs text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedDay === 'Day1'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Day 1（9月19日・土）
          </button>
          <button
            id="schedule-day2-tab"
            onClick={() => setSelectedDay('Day2')}
            className={`px-5 py-2 rounded-xs text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedDay === 'Day2'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Day 2（9月20日・日）
          </button>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-xs bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Venue filter */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400">会場:</span>
            {venues.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVenue(v)}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                  selectedVenue === v
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v === 'all' ? '全会場' : v}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center space-x-1.5 flex-wrap border-l border-slate-200 pl-3">
            <span className="text-xs font-semibold text-slate-400">種類:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'すべて' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Events Timeline List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{selectedDay} プログラム一覧: {filteredSchedules.length}件</span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-2">
            <p className="text-sm font-bold">条件に該当するプログラムが見つかりませんでした。</p>
            <button
              onClick={() => {
                setSelectedVenue('all');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xs bg-sky-600 text-white text-xs font-bold cursor-pointer"
            >
              絞り込みを解除
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredSchedules.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-xs bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Time Box */}
                    <div className="px-3 py-2 bg-sky-50 border border-sky-100 rounded-xs text-center shrink-0 min-w-[90px]">
                      <span className="block text-sm font-black text-sky-950 font-mono">
                        {item.startTime}
                      </span>
                      <span className="block text-[10px] text-sky-600 font-medium">
                        〜 {item.endTime}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-xs text-rose-500 font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.venue}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600">
                        出演・主催: <strong className="text-slate-800">{item.performer}</strong>
                      </p>

                      <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xs border border-sky-100">
                      鑑賞自由
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

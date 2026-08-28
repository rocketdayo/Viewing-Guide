import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Sparkles, 
  Music, 
  Users, 
  Radio, 
  ChevronRight, 
  HelpCircle,
  Tag,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Copy,
  Check,
  Building,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScheduleEvent } from '../types';

interface ScheduleViewProps {
  schedules?: ScheduleEvent[];
  onNavigate?: (page: string, anchor?: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  schedules = [],
  onNavigate
}) => {
  const [selectedVenue, setSelectedVenue] = useState<'all' | '第一体育館' | 'レクチャールーム'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Time state for live indicator
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((event) => {
      // Venue filter
      if (selectedVenue !== 'all' && event.venue !== selectedVenue) {
        return false;
      }
      // Type filter (部活, 有志, クラス)
      if (selectedType !== 'all') {
        if (event.performerType !== selectedType) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = event.title?.toLowerCase().includes(query);
        const matchPerformer = event.performer?.toLowerCase().includes(query);
        const matchVenue = event.venue?.toLowerCase().includes(query);
        const matchDesc = event.description?.toLowerCase().includes(query);
        const matchCategory = event.category?.toLowerCase().includes(query);
        const matchPos = event.stagePosition?.toLowerCase().includes(query);
        return matchTitle || matchPerformer || matchVenue || matchDesc || matchCategory || matchPos;
      }
      return true;
    });
  }, [schedules, selectedVenue, selectedType, searchQuery]);

  // Venue counts
  const gymCount = useMemo(() => schedules.filter(s => s.venue === '第一体育館').length, [schedules]);
  const lectureCount = useMemo(() => schedules.filter(s => s.venue === 'レクチャールーム').length, [schedules]);

  // Copy share handler
  const handleCopyEvent = (event: ScheduleEvent) => {
    const text = `【${event.venue} タイムテーブル】\n${event.startTime}〜${event.endTime} (${event.duration || ''})\n出演: ${event.performer} (${event.performerType || ''})\n内容: ${event.title}\n場所: ${event.stagePosition ? `舞台 ${event.stagePosition}` : event.venue}\n#清教学園文化祭 #SGfes2026`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Helper to determine status based on current time
  const getEventStatus = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 'upcoming';
    if (currentTimeStr >= startTime && currentTimeStr <= endTime) return 'current';
    if (currentTimeStr < startTime) return 'upcoming';
    return 'finished';
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xs p-6 sm:p-8 shadow-xs relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/50 via-teal-50/30 to-transparent -mr-16 -mt-16 rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-xs bg-sky-50 text-sky-800 border border-sky-200/80 text-xs font-bold mb-2.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>ステージタイムスケジュール</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              公演・発表タイムテーブル
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              第一体育館およびレクチャールームで行われるステージ発表・演奏・パフォーマンスのタイムスケジュールです。
            </p>
          </div>

          {/* Quick venue summary badges */}
          <div className="flex items-center gap-2 sm:self-end">
            <div className="px-3 py-2 rounded-xs bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">第一体育館</div>
              <div className="text-base font-bold text-sky-800">{gymCount} <span className="text-xs font-normal text-slate-600">演目</span></div>
            </div>
            <div className="px-3 py-2 rounded-xs bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">レクチャールーム</div>
              <div className="text-base font-bold text-purple-800">{lectureCount} <span className="text-xs font-normal text-slate-600">演目</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Venue Switcher Tabs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedVenue('all')}
            className={`p-3.5 rounded-xs border text-left transition-all flex items-center justify-between cursor-pointer ${
              selectedVenue === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Building className={`w-4 h-4 ${selectedVenue === 'all' ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className="font-bold text-sm">全会場を表示</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              selectedVenue === 'all' ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {schedules.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedVenue('第一体育館')}
            className={`p-3.5 rounded-xs border text-left transition-all flex items-center justify-between cursor-pointer ${
              selectedVenue === '第一体育館'
                ? 'bg-sky-700 border-sky-800 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <MapPin className={`w-4 h-4 ${selectedVenue === '第一体育館' ? 'text-sky-200' : 'text-sky-600'}`} />
              <div>
                <div className="font-bold text-sm">第一体育館</div>
                <div className={`text-[11px] ${selectedVenue === '第一体育館' ? 'text-sky-100' : 'text-slate-500'}`}>
                  合唱・ダンス・吹奏楽 ほか
                </div>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              selectedVenue === '第一体育館' ? 'bg-sky-800 text-sky-100' : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}>
              {gymCount}演目
            </span>
          </button>

          <button
            onClick={() => setSelectedVenue('レクチャールーム')}
            className={`p-3.5 rounded-xs border text-left transition-all flex items-center justify-between cursor-pointer ${
              selectedVenue === 'レクチャールーム'
                ? 'bg-purple-700 border-purple-800 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <MapPin className={`w-4 h-4 ${selectedVenue === 'レクチャールーム' ? 'text-purple-200' : 'text-purple-600'}`} />
              <div>
                <div className="font-bold text-sm">レクチャールーム</div>
                <div className={`text-[11px] ${selectedVenue === 'レクチャールーム' ? 'text-purple-100' : 'text-slate-500'}`}>
                  有志演奏・聖研 ほか
                </div>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              selectedVenue === 'レクチャールーム' ? 'bg-purple-800 text-purple-100' : 'bg-purple-50 text-purple-800 border border-purple-200'
            }`}>
              {lectureCount}演目
            </span>
          </button>
        </div>

        {/* Venue Information Notices */}
        {selectedVenue === '第一体育館' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-sky-50/80 border border-sky-200 rounded-xs p-4 text-xs text-sky-900 space-y-1.5"
          >
            <div className="font-bold flex items-center space-x-1.5 text-sky-900">
              <Info className="w-4 h-4 text-sky-700 shrink-0" />
              <span>第一体育館 鑑賞にあたっての案内</span>
            </div>
            <p className="leading-relaxed text-sky-800">
              ・会場内は土足厳禁です。入口にてスリッパ・靴袋をご利用ください。<br />
              ・プログラム記載の「舞台下」はアリーナフロア面、「舞台上」はメインステージ上、「舞台上・下」は両面を使用したパフォーマンスとなります。
            </p>
          </motion.div>
        )}

        {selectedVenue === 'レクチャールーム' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-purple-50/80 border border-purple-200 rounded-xs p-4 text-xs text-purple-900 space-y-1.5"
          >
            <div className="font-bold flex items-center space-x-1.5 text-purple-900">
              <Info className="w-4 h-4 text-purple-700 shrink-0" />
              <span>レクチャールーム 案内・進行について</span>
            </div>
            <p className="leading-relaxed text-purple-800">
              ・朝礼（〜8:50終了）、昼休憩（11:00〜12:30）を挟んで午前の部・午後の部に分かれて進行します。<br />
              ・各団体の詳細な演奏曲目・公演内容は現在確認中です。確定次第、本アプリ上にて随時公開されます。
            </p>
          </motion.div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xs p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="団体名、演目、内容、楽器などで検索..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                クリア
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              区分:
            </span>
            {[
              { id: 'all', label: 'すべて' },
              { id: '部活', label: '部活動' },
              { id: '有志', label: '有志' },
              { id: 'クラス', label: 'クラス' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1.5 rounded-xs text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters count summary */}
        {(searchQuery || selectedType !== 'all' || selectedVenue !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>該当演目: <strong className="text-slate-800">{filteredSchedules.length}</strong> 件</span>
            <button
              onClick={() => {
                setSelectedVenue('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="text-sky-700 hover:underline font-medium"
            >
              条件をリセット
            </button>
          </div>
        )}
      </div>

      {/* Main Timetable Content */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xs p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">条件に一致する公演が見つかりませんでした</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            検索キーワードや絞り込み条件を変更して再度ご確認ください。
          </p>
          <button
            onClick={() => {
              setSelectedVenue('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xs transition-colors"
          >
            すべての公演を表示
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lecture Room Break Indicator if Lecture Room or All is selected */}
          {filteredSchedules.map((event, idx) => {
            const status = getEventStatus(event.startTime, event.endTime);
            const isGym = event.venue === '第一体育館';

            return (
              <React.Fragment key={event.id}>
                {/* Special break visual insert for Lecture Room when in Lecture or All view */}
                {event.id === 'sch-lec-3' && (selectedVenue === 'レクチャールーム' || selectedVenue === 'all') && (
                  <div className="bg-amber-50/70 border border-dashed border-amber-300 rounded-xs p-3 text-center text-xs text-amber-800 my-3 flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold">【レクチャールーム 昼休憩】 11:00 〜 12:30</span>
                    <span className="text-amber-700 hidden sm:inline">（午後の部は12:30より再開）</span>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`bg-white border rounded-xs shadow-2xs overflow-hidden transition-all hover:shadow-xs ${
                    status === 'current' 
                      ? 'border-sky-500 ring-2 ring-sky-500/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Time & Venue Column */}
                    <div className="flex items-start sm:items-center space-x-3.5 shrink-0">
                      {/* Program Number Box */}
                      <div className={`w-11 h-11 rounded-xs flex flex-col items-center justify-center font-bold shrink-0 border ${
                        isGym 
                          ? 'bg-sky-50 text-sky-800 border-sky-200' 
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
                          {typeof event.programNumber === 'number' ? 'PN' : 'No.'}
                        </span>
                        <span className="text-sm font-black leading-none">
                          {typeof event.programNumber === 'number' 
                            ? event.programNumber 
                            : String(event.programNumber || idx + 1).replace(/[^\d①-⑨]/g, '') || idx + 1}
                        </span>
                      </div>

                      {/* Time Details */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                            {event.startTime}
                          </span>
                          <span className="text-slate-400 text-xs">〜</span>
                          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                            {event.endTime}
                          </span>
                          {event.duration && (
                            <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-600 text-[11px] font-bold">
                              {event.duration}
                            </span>
                          )}
                        </div>

                        {/* Venue Tag & Stage Position */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-xs ${
                            isGym 
                              ? 'bg-sky-100/80 text-sky-900 border border-sky-200/80' 
                              : 'bg-purple-100/80 text-purple-900 border border-purple-200/80'
                          }`}>
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.venue}
                          </span>

                          {event.stagePosition && (
                            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700 border border-slate-200">
                              場所: <strong className="ml-1 text-slate-900 font-bold">{event.stagePosition}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Performer & Performance Info */}
                    <div className="flex-1 md:px-4 md:border-l md:border-slate-100 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Performer Type Badge */}
                        {event.performerType && (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-xs ${
                            event.performerType === '部活'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : event.performerType === '有志'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          }`}>
                            {event.performerType}
                          </span>
                        )}

                        {/* Category */}
                        {event.category && (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-xs border border-slate-200">
                            {event.category}
                          </span>
                        )}

                        {/* Important badge */}
                        {event.isImportant && (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-xs">
                            注目演目
                          </span>
                        )}
                      </div>

                      {/* Performer Name */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>{event.performer}</span>
                      </h3>

                      {/* Content / Title */}
                      <div className="flex items-center space-x-2 text-sm text-slate-700">
                        <span className="font-semibold text-slate-500 text-xs">内容:</span>
                        <span className={`font-bold ${event.title === '内容確認中' ? 'text-purple-700 italic bg-purple-50 px-2 py-0.5 rounded-xs border border-purple-200/60' : 'text-slate-800'}`}>
                          {event.title}
                        </span>
                      </div>

                      {/* Description if available */}
                      {event.description && event.title !== '内容確認中' && (
                        <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Right: Actions / Share */}
                    <div className="flex items-center justify-end space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <button
                        onClick={() => handleCopyEvent(event)}
                        title="この演目の情報をコピー"
                        className="px-2.5 py-1.5 rounded-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === event.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">コピー完了</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>共有</span>
                          </>
                        )}
                      </button>

                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('map')}
                          title="校内マップで場所を確認"
                          className="px-2.5 py-1.5 rounded-xs bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>マップ</span>
                        </button>
                      )}
                    </div>

                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Footer Notes Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xs p-5 space-y-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
          <Info className="w-4 h-4 text-sky-700" />
          <span>タイムテーブルに関するご案内・注意事項</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
          <li>当日の進行状況・機材セッティング等により、開始・終了時刻が前後する可能性がございます。</li>
          <li>第一体育館・レクチャールームともに、満員の場合は入場制限を行う場合がございますので、お早めにお越しください。</li>
          <li>レクチャールームの演目内容など、未確定の項目につきましては確定次第随時更新いたします。</li>
          <li>会場内でのフラッシュ撮影や三脚使用、他のお客様のご鑑賞の妨げとなる行為はご遠慮ください。</li>
        </ul>
      </div>
    </div>
  );
};

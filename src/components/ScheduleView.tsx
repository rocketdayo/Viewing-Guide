import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Sparkles, 
  Music, 
  SlidersHorizontal,
  Share2, 
  Copy, 
  Check, 
  Building, 
  Info,
  MessageCircle,
  X,
  Compass,
  Award,
  Shield,
  PartyPopper,
  Radio,
  BookOpen,
  Bookmark,
  ChevronRight,
  ListFilter,
  Columns
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScheduleEvent } from '../types';
import { useI18n, translateVenue, translatePerformerType, translateCategory } from '../utils/i18n';
import { PosterImage } from './PosterImage';

interface ScheduleViewProps {
  schedules?: ScheduleEvent[];
  onNavigate?: (page: string, anchor?: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ 
  schedules = [],
  onNavigate
}) => {
  const { language } = useI18n();
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<'all' | 'Day1' | 'Day2'>('Day1');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'venues'>('timeline');
  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'upcoming'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('schedule_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [detailModalEvent, setDetailModalEvent] = useState<ScheduleEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && schedules.some(s => s.id === hash)) {
      setHighlightedId(hash);
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const timeout = setTimeout(() => {
        setHighlightedId(null);
      }, 3500);
      return () => clearTimeout(timeout);
    }
  }, [schedules]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('schedule_bookmarks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const venueOptions = [
    { id: 'all', labelJa: 'すべての会場', labelEn: 'All Venues', icon: Building },
    { id: '第一体育館', labelJa: '第一体育館', labelEn: 'Gym 1 (Arena)', icon: Music },
    { id: 'レクチャールーム', labelJa: 'レクチャールーム', labelEn: 'Lecture Room', icon: Radio },
    { id: 'グラウンド', labelJa: 'グラウンド', labelEn: 'Ground', icon: Shield },
    { id: 'ラーニングコモンズ', labelJa: 'ラーニングコモンズ', labelEn: 'Learning Commons', icon: BookOpen },
    { id: '校舎内', labelJa: '校舎内', labelEn: 'School Building', icon: MapPin },
    { id: '清教学園ツアー', labelJa: '清教学園ツアー', labelEn: 'School Tour', icon: Compass },
  ];

  const venueCounts = useMemo(() => {
    const counts: Record<string, number> = { all: schedules.length };
    venueOptions.forEach(v => {
      if (v.id !== 'all') {
        counts[v.id] = schedules.filter(s => {
          if (s.published === false) return false;
          if (selectedDay !== 'all') {
            if (s.day !== '両日' && s.day !== selectedDay) return false;
          }
          return s.venue === v.id;
        }).length;
      }
    });
    return counts;
  }, [schedules, selectedDay]);

  const getEventStatus = (startTime: string, endTime: string, day: string) => {
    if (!startTime || !endTime) return 'upcoming';
    if (currentTimeStr >= startTime && currentTimeStr <= endTime) return 'current';
    if (currentTimeStr < startTime) return 'upcoming';
    return 'finished';
  };

  const filteredSchedules = useMemo(() => {
    const list = schedules.filter((event) => {
      if (event.published === false) return false;
      if (selectedVenue !== 'all' && event.venue !== selectedVenue) return false;
      if (selectedDay !== 'all') {
        if (event.day !== '両日' && event.day !== selectedDay) return false;
      }
      if (selectedType !== 'all') {
        if (event.performerType !== selectedType) return false;
      }
      if (statusFilter !== 'all') {
        const status = getEventStatus(event.startTime, event.endTime, event.day);
        if (status !== statusFilter) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = event.title?.toLowerCase().includes(query);
        const matchPerformer = event.performer?.toLowerCase().includes(query);
        const matchVenue = event.venue?.toLowerCase().includes(query);
        const matchDesc = event.description?.toLowerCase().includes(query);
        const matchCategory = event.category?.toLowerCase().includes(query);
        const matchPos = event.stagePosition?.toLowerCase().includes(query);
        const matchLoc = event.locationDetail?.toLowerCase().includes(query);
        return matchTitle || matchPerformer || matchVenue || matchDesc || matchCategory || matchPos || matchLoc;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (a.day !== b.day) {
        if (a.day === 'Day1') return -1;
        if (b.day === 'Day1') return 1;
        if (a.day === '両日' && b.day === 'Day2') return -1;
        if (a.day === 'Day2' && b.day === '両日') return 1;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [schedules, selectedVenue, selectedDay, selectedType, statusFilter, searchQuery, currentTimeStr]);

  const groupedByHour = useMemo(() => {
    const groups: { hourLabel: string; events: ScheduleEvent[] }[] = [];
    const map = new Map<string, ScheduleEvent[]>();

    filteredSchedules.forEach((ev) => {
      const hour = ev.startTime.split(':')[0] || '09';
      const hourLabel = `${hour}:00`;
      if (!map.has(hourLabel)) {
        map.set(hourLabel, []);
      }
      map.get(hourLabel)!.push(ev);
    });

    const sortedHours = Array.from(map.keys()).sort();
    sortedHours.forEach((hour) => {
      groups.push({
        hourLabel: hour,
        events: map.get(hour)!
      });
    });

    return groups;
  }, [filteredSchedules]);

  const venuesColumns = useMemo(() => {
    const distinctVenues = ['第一体育館', 'レクチャールーム', 'グラウンド', 'ラーニングコモンズ', '清教学園ツアー'];
    return distinctVenues.map((venueName) => {
      const venueEvents = filteredSchedules.filter((e) => e.venue === venueName);
      return {
        venueName,
        events: venueEvents
      };
    }).filter((col) => col.events.length > 0 || selectedVenue === 'all');
  }, [filteredSchedules, selectedVenue]);

  const nowPlayingEvents = useMemo(() => {
    return schedules.filter((event) => {
      if (event.published === false) return false;
      if (selectedDay !== 'all') {
        if (event.day !== '両日' && event.day !== selectedDay) return false;
      }
      return getEventStatus(event.startTime, event.endTime, event.day) === 'current';
    });
  }, [schedules, selectedDay, currentTimeStr]);

  const formatShareTextSingle = (event: ScheduleEvent) => {
    const venueLabel = translateVenue(event.venue, language);
    const dayLabel = event.day === 'Day1' ? '9/18(金) 1日目' : event.day === 'Day2' ? '9/19(土) 2日目' : '9/18・19 両日';
    const locationInfo = event.locationDetail ? `\n📍 場所詳細: ${event.locationDetail}` : `\n📍 会場: ${venueLabel} ${event.stagePosition ? `(${event.stagePosition})` : ''}`;
    return `✨【清教学園 文化祭 SGfes 2026】✨\n🎪 企画名: ${event.title}\n👤 出演・主催: ${event.performer} (${event.performerType || '企画'})\n🗓 日程: ${dayLabel}\n⏰ 時間: ${event.startTime}〜${event.endTime} (${event.duration || ''})${locationInfo}\n\n📝 内容:\n${event.description}\n\n#清教学園 #SGfes #文化祭`;
  };

  const handleCopySingle = (event: ScheduleEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = formatShareTextSingle(event);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(event.id);
        showToast(language === 'en' ? 'Event copied to clipboard!' : '演目情報をコピーしました！');
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  const handleLineShare = (event: ScheduleEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = formatShareTextSingle(event);
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const generateTimetableSummary = () => {
    const dayHeader = selectedDay === 'Day1' ? '9/18(金) 1日目' : selectedDay === 'Day2' ? '9/19(土) 2日目' : '9/18・19 全日程';
    const venueHeader = selectedVenue === 'all' ? '全会場' : translateVenue(selectedVenue, language);
    
    let summary = `🎉【清教学園 文化祭 SGfes 2026 タイムテーブル】🎉\n🗓 日程: ${dayHeader}\n📍 エリア: ${venueHeader}\n━━━━━━━━━━━━━━━━━━\n`;
    
    filteredSchedules.slice(0, 15).forEach((ev, i) => {
      summary += `${i + 1}. [${ev.startTime}〜${ev.endTime}] ${ev.title}\n   出演: ${ev.performer} (場所: ${ev.venue})\n`;
    });

    if (filteredSchedules.length > 15) {
      summary += `…他 全${filteredSchedules.length}件の演目・企画\n`;
    }

    summary += `━━━━━━━━━━━━━━━━━━\n学校祭公式アプリで詳細をチェック！\n#清教学園 #SGfes2026 #文化祭`;
    return summary;
  };

  const handleCopyAllSummary = () => {
    const text = generateTimetableSummary();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(language === 'en' ? 'Timetable summary copied to clipboard!' : 'タイムテーブル一覧をコピーしました！');
      });
    }
  };

  const handleLineShareAll = () => {
    const text = generateTimetableSummary();
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getVenueColor = (venue: string) => {
    switch (venue) {
      case '第一体育館':
        return {
          badge: 'bg-sky-100 text-sky-900 border-sky-300',
          accent: 'border-l-sky-500',
          lightBg: 'bg-sky-50/40',
          dot: 'bg-sky-500'
        };
      case 'レクチャールーム':
        return {
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
          accent: 'border-l-purple-500',
          lightBg: 'bg-purple-50/40',
          dot: 'bg-purple-500'
        };
      case 'グラウンド':
        return {
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          accent: 'border-l-emerald-500',
          lightBg: 'bg-emerald-50/40',
          dot: 'bg-emerald-500'
        };
      case 'ラーニングコモンズ':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          accent: 'border-l-amber-500',
          lightBg: 'bg-amber-50/40',
          dot: 'bg-amber-500'
        };
      case '清教学園ツアー':
        return {
          badge: 'bg-teal-100 text-teal-900 border-teal-300',
          accent: 'border-l-teal-500',
          lightBg: 'bg-teal-50/40',
          dot: 'bg-teal-500'
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          accent: 'border-l-slate-400',
          lightBg: 'bg-slate-50/40',
          dot: 'bg-slate-500'
        };
    }
  };

  const getEventIcon = (category: string) => {
    switch (category) {
      case '音楽・演奏':
        return Music;
      case 'ダンス':
        return Sparkles;
      case '特別企画':
        return Award;
      case 'パフォーマンス':
        return PartyPopper;
      default:
        return Calendar;
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-6xl mx-auto px-3 sm:px-4">
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xs text-xs font-bold shadow-lg border border-slate-700 flex items-center space-x-2 pointer-events-none animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200/90 rounded-xs p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-xs bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5 text-sky-700" />
              <span>{language === 'en' ? 'Festival Timetable' : '清教学園 文化祭 タイムテーブル'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Performance & Stage Schedule' : '公演・ステージ・企画 タイムスケジュール'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {language === 'en' 
                ? 'Check performance times for Gym 1, Lecture Room, Ground, and Tours. Tap any event for details.' 
                : '第一体育館、レクチャールーム、グラウンド、在校生ツアー等の公演を時間軸で確認できます。カード全体をタップして詳細が開きます。'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 rounded-xs bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-700" />
              <span>{language === 'en' ? 'Share' : '友達にシェア'}</span>
            </button>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xs border border-slate-200">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={language === 'en' ? 'Timeline View' : '時系列タイムライン'}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'en' ? 'Timeline' : 'タイムライン'}</span>
              </button>
              <button
                onClick={() => setViewMode('venues')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'venues'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={language === 'en' ? 'Venue Matrix View' : '会場別比較'}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'en' ? 'By Venue' : '会場別'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xs">
            <span className="text-xs text-slate-600 font-bold px-2 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {language === 'en' ? 'Day:' : '日程:'}
            </span>
            {[
              { id: 'Day1', label: language === 'en' ? 'Day 1 (9/18 Fri)' : '1日目 9/18(金)' },
              { id: 'Day2', label: language === 'en' ? 'Day 2 (9/19 Sat)' : '2日目 9/19(土)' },
              { id: 'all', label: language === 'en' ? 'All Days' : '全日程' },
            ].map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id as any)}
                className={`px-3 py-1 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                  selectedDay === day.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xs text-emerald-950 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{language === 'en' ? 'Now:' : '現在時刻:'}</span>
              <span className="font-mono text-emerald-900">{currentTimeStr}</span>
            </div>
            {nowPlayingEvents.length > 0 && (
              <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                {language === 'en' ? `${nowPlayingEvents.length} in progress` : `現在 ${nowPlayingEvents.length} 件が進行中`}
              </span>
            )}
          </div>
        </div>
      </div>

      {nowPlayingEvents.length > 0 && (
        <div className="bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300 rounded-xs p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                <span>{language === 'en' ? 'HAPPENING NOW' : '現在進行中の公演・企画'}</span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-800">
              {currentTimeStr}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {nowPlayingEvents.map((ev) => (
              <div
                key={`now-${ev.id}`}
                onClick={() => setDetailModalEvent(ev)}
                className="bg-white p-3 rounded-xs border border-emerald-300/80 hover:border-emerald-500 shadow-2xs cursor-pointer hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.2 rounded-xs">
                      {ev.startTime} 〜 {ev.endTime}
                    </span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                      {translateVenue(ev.venue, language)}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {ev.performer}
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                  <span>{language === 'en' ? 'Tap for details' : '詳細を見る'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-sky-700" />
            <span>{language === 'en' ? 'Filter by Area / Venue' : '会場・エリアで絞り込み'}</span>
          </span>
          <span className="text-[11px] text-slate-500 font-bold">
            {filteredSchedules.length} {language === 'en' ? 'events' : '件表示中'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {venueOptions.map((v) => {
            const isSelected = selectedVenue === v.id;
            const Icon = v.icon;
            const count = venueCounts[v.id] || 0;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(v.id)}
                className={`p-2.5 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between h-16 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-300' : 'text-slate-600'}`} />
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                    isSelected ? 'bg-slate-800 text-sky-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </div>
                <div className="font-bold text-[11px] sm:text-xs leading-tight line-clamp-1">
                  {language === 'en' ? v.labelEn : v.labelJa}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xs p-3 space-y-2.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search by title, performer, or keyword...' : '企画名、出演者、会場、キーワードで検索...'}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            <span className="text-xs text-slate-600 font-bold whitespace-nowrap mr-0.5 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {language === 'en' ? 'Status:' : '進行:'}
            </span>
            {[
              { id: 'all', label: language === 'en' ? 'All' : 'すべて' },
              { id: 'current', label: language === 'en' ? 'Now' : '進行中' },
              { id: 'upcoming', label: language === 'en' ? 'Upcoming' : 'これから' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-2 py-1 rounded-xs text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}

            <span className="text-slate-300 mx-1">|</span>

            {[
              { id: 'all', label: language === 'en' ? 'All Types' : '全区分' },
              { id: '部活', label: language === 'en' ? 'Clubs' : '部活' },
              { id: '有志', label: language === 'en' ? 'Volunteers' : '有志' },
              { id: '特別', label: language === 'en' ? 'Special' : '特別企画' },
            ].map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setSelectedType(tItem.id)}
                className={`px-2 py-1 rounded-xs text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === tItem.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>
        </div>

        {(searchQuery || selectedType !== 'all' || selectedVenue !== 'all' || statusFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1.5 border-t border-slate-100">
            <span>
              {language === 'en' ? 'Active filters result:' : '該当公演:'} <strong className="text-slate-900 font-bold">{filteredSchedules.length}</strong> {language === 'en' ? 'events' : '件'}
            </span>
            <button
              onClick={() => {
                setSelectedVenue('all');
                setSelectedType('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-sky-700 hover:underline font-bold cursor-pointer"
            >
              {language === 'en' ? 'Reset Filters' : 'フィルター解除'}
            </button>
          </div>
        )}
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xs p-10 text-center space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            {language === 'en' ? 'No events found matching your filter' : '条件に一致する公演・企画が見つかりませんでした'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'en' ? 'Try changing the venue, day, or search keywords.' : '日程や会場の絞り込みを変更するか、検索キーワードを見直してください。'}
          </p>
          <button
            onClick={() => {
              setSelectedVenue('all');
              setSelectedType('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xs transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Show All Events' : 'すべての企画を表示'}
          </button>
        </div>
      ) : viewMode === 'venues' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venuesColumns.map((col) => {
            const venueColor = getVenueColor(col.venueName);
            return (
              <div 
                key={col.venueName}
                className="bg-white border border-slate-200 rounded-xs overflow-hidden flex flex-col shadow-2xs"
              >
                <div className={`px-4 py-2.5 border-b border-slate-200 font-bold text-xs flex items-center justify-between ${venueColor.lightBg}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${venueColor.dot}`} />
                    <span className="text-slate-900">{translateVenue(col.venueName, language)}</span>
                  </div>
                  <span className="text-slate-600 bg-white px-2 py-0.2 rounded-xs border border-slate-200 text-[11px]">
                    {col.events.length} {language === 'en' ? 'events' : '公演'}
                  </span>
                </div>

                <div className="p-2 space-y-2 flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[700px]">
                  {col.events.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {language === 'en' ? 'No events scheduled for this day.' : 'この日程の予定はありません'}
                    </div>
                  ) : (
                    col.events.map((ev) => {
                      const status = getEventStatus(ev.startTime, ev.endTime, ev.day);
                      return (
                        <div
                          key={`col-${ev.id}`}
                          onClick={() => setDetailModalEvent(ev)}
                          className={`pt-2 first:pt-0 p-2.5 rounded-xs transition-colors cursor-pointer hover:bg-slate-50 border-l-4 ${venueColor.accent} ${
                            status === 'current' ? 'bg-emerald-50/50 ring-1 ring-emerald-300' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                              {ev.startTime} 〜 {ev.endTime}
                            </span>
                            {status === 'current' && (
                              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs animate-pulse">
                                NOW
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                            {ev.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {ev.performer} {ev.stagePosition ? `(${ev.stagePosition})` : ''}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByHour.map((group) => (
            <div key={group.hourLabel} className="space-y-2.5">
              <div className="flex items-center space-x-2 sticky top-14 z-10 bg-slate-50/95 backdrop-blur-xs py-1.5">
                <span className="font-mono font-black text-xs sm:text-sm bg-slate-900 text-white px-2.5 py-1 rounded-xs shadow-2xs">
                  {group.hourLabel}
                </span>
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] font-bold text-slate-500">
                  {group.events.length} {language === 'en' ? 'events' : '件'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.events.map((event) => {
                  const status = getEventStatus(event.startTime, event.endTime, event.day);
                  const isHighlighted = highlightedId === event.id;
                  const isBookmarked = bookmarkedIds.includes(event.id);
                  const venueColor = getVenueColor(event.venue);
                  const Icon = getEventIcon(event.category);

                  return (
                    <motion.div
                      key={event.id}
                      id={event.id}
                      onClick={() => setDetailModalEvent(event)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      className={`bg-white border rounded-xs shadow-2xs transition-all cursor-pointer flex flex-col justify-between overflow-hidden border-l-4 ${venueColor.accent} ${
                        isHighlighted 
                          ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/20' 
                          : status === 'current' 
                          ? 'border-emerald-400 ring-1 ring-emerald-400/40 bg-emerald-50/20' 
                          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-600" />
                              {event.startTime} 〜 {event.endTime}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-xs border ${venueColor.badge}`}>
                              {translateVenue(event.venue, language)}
                            </span>
                            {event.stagePosition && (
                              <span className="text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs">
                                {event.stagePosition}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {status === 'current' && (
                              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-xs animate-pulse">
                                NOW
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleBookmark(event.id, e)}
                              className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                              title={isBookmarked ? 'お気に入り解除' : 'お気に入り登録'}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          {event.needsPoster !== false && (event.posterImage || event.image || event.posterFile) && (
                            <div className="w-16 h-20 shrink-0 rounded-xs overflow-hidden border border-slate-200 bg-slate-100">
                              <PosterImage
                                posterFile={event.posterFile}
                                posterImage={event.posterImage}
                                image={event.image}
                                title={event.title}
                                className="w-full h-full object-cover"
                                allowZoom={false}
                              />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              {event.performerType && (
                                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                                  {translatePerformerType(event.performerType, language)}
                                </span>
                              )}
                              {event.category && (
                                <span>{translateCategory(event.category, language)}</span>
                              )}
                            </div>

                            <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-1 group-hover:text-sky-700">
                              {event.title}
                            </h3>

                            <div className="text-xs text-slate-700 font-bold truncate">
                              {event.performer || event.title}
                            </div>

                            {event.description && (
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="text-slate-500 text-[11px] truncate flex items-center gap-1 max-w-[200px] sm:max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{event.locationDetail || event.venue}</span>
                        </div>

                        <div className="flex items-center space-x-1 text-sky-700 font-bold text-xs">
                          <span>{language === 'en' ? 'Details' : '詳細'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {detailModalEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setDetailModalEvent(null)}
        >
          <div 
            className="bg-white rounded-xs border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailModalEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-slate-900 text-white">
                  {detailModalEvent.startTime} 〜 {detailModalEvent.endTime}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-xs border ${getVenueColor(detailModalEvent.venue).badge}`}>
                  {translateVenue(detailModalEvent.venue, language)}
                </span>
                {detailModalEvent.stagePosition && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700">
                    {detailModalEvent.stagePosition}
                  </span>
                )}
                <span className="text-xs font-bold px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700">
                  {detailModalEvent.officialDates || (detailModalEvent.day === 'Day1' ? '9/18 1日目' : detailModalEvent.day === 'Day2' ? '9/19 2日目' : '9/18・19 両日')}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {detailModalEvent.officialTitle || detailModalEvent.title}
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {language === 'en' ? 'Performer / Host:' : '出演・主催:'} <span className="text-slate-900 font-black">{detailModalEvent.performer || detailModalEvent.officialTitle || detailModalEvent.title}</span>
              </p>
            </div>

            {detailModalEvent.needsPoster !== false && (detailModalEvent.posterFile || detailModalEvent.posterImage || detailModalEvent.image || detailModalEvent.title) && (
              <div className="w-full">
                <PosterImage
                  posterFile={detailModalEvent.posterFile}
                  posterImage={detailModalEvent.posterImage}
                  image={detailModalEvent.image}
                  title={detailModalEvent.officialTitle || detailModalEvent.title}
                  className="w-full max-h-72 rounded-xs"
                  allowZoom={true}
                />
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xs p-3.5 text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {detailModalEvent.department && (
                  <div>
                    <span className="text-slate-500 font-medium block">{language === 'en' ? 'Department:' : '部署名:'}</span>
                    <span className="font-bold text-slate-900">{detailModalEvent.department}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Dates:' : '実施日程:'}</span>
                  <span className="font-bold text-slate-900">{detailModalEvent.officialDates || (detailModalEvent.day === 'Day1' ? '9/18' : detailModalEvent.day === 'Day2' ? '9/19' : '9/18, 9/19')}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Experience / Duration:' : '体験・閲覧時間:'}</span>
                  <span className="font-bold text-slate-900">{detailModalEvent.experienceTime || `${detailModalEvent.startTime}〜${detailModalEvent.endTime}`}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Category:' : 'ジャンル:'}</span>
                  <span className="font-bold text-slate-900">{translateCategory(detailModalEvent.category, language)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium block">{language === 'en' ? 'Location:' : '活動場所:'}</span>
                <span className="font-bold text-slate-900">{detailModalEvent.officialLocation || detailModalEvent.locationDetail || detailModalEvent.venue}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'en' ? 'Activity & Performance Details' : '活動・演目内容'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xs border border-slate-200">
                {detailModalEvent.activityContent || detailModalEvent.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleLineShare(detailModalEvent)}
                className="flex-1 py-2 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Send via LINE' : 'LINEで送る'}</span>
              </button>
              <button
                onClick={() => handleCopySingle(detailModalEvent)}
                className="flex-1 py-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{language === 'en' ? 'Copy Info' : '情報をコピー'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-xs border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 text-sky-700 text-xs font-bold mb-1">
                <Share2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Share Timetable with Friends' : '友達にスケジュールをシェア'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {language === 'en' ? 'Send Timetable Summary' : 'タイムテーブルをLINE・メモで共有'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en'
                  ? 'Share the current filtered schedule list directly with friends so you won\'t miss any performances together!'
                  : '現在選択中の日程・会場の演目一覧をメッセージとして友達に送ることができます。'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xs p-3.5 text-xs text-slate-700 max-h-56 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed select-all">
              {generateTimetableSummary()}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleLineShareAll}
                className="flex-1 py-2.5 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Send via LINE' : 'LINEで送信する'}</span>
              </button>
              <button
                onClick={handleCopyAllSummary}
                className="flex-1 py-2.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{language === 'en' ? 'Copy to Clipboard' : 'クリップボードにコピー'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xs p-4 sm:p-5 space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-sky-700" />
          <span>{language === 'en' ? 'Stage & Event Guidelines' : 'タイムテーブル・観覧に関するご案内・注意事項'}</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
          {language === 'en' ? (
            <>
              <li>Event times may adjust slightly depending on live performance flow and equipment changeovers.</li>
              <li>Admission restrictions may apply to Gym 1 and Lecture Room when capacity is reached.</li>
              <li>For School Tours, please assemble in front of Gym 1 near the welcome sign 5 minutes before departure.</li>
              <li>For the Stamp Rally, complete all 5 checkpoints and claim your prize at the Learning Commons.</li>
            </>
          ) : (
            <>
              <li>当日の進行状況・機材セッティング等により、開始・終了時刻が前後する可能性がございます。</li>
              <li>第一体育館・レクチャールームともに、満員の場合は入場制限を行う場合がございますので、お早めにお越しください。</li>
              <li>清教学園ツアーにご参加の方は、各回開始5分前に第一体育館前の看板前にお集まりください。</li>
              <li>SGfesスタンプラリーは校内5箇所のスタンプを集めてラーニングコモンズへお越しいただくことで景品と交換できます。</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

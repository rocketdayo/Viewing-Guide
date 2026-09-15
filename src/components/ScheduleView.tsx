import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Sparkles, 
  Music, 
  Users, 
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
  Footprints,
  Shield,
  Utensils,
  PartyPopper,
  Radio,
  BookOpen,
  Image as ImageIcon
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
  const { language, t } = useI18n();
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<'all' | 'Day1' | 'Day2'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
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
    { id: 'グラウンド', labelJa: 'グラウンド・中庭', labelEn: 'Ground & Courtyard', icon: Shield },
    { id: 'ラーニングコモンズ', labelJa: 'ラーニングコモンズ', labelEn: 'Learning Commons', icon: BookOpen },
    { id: '清教学園ツアー', labelJa: '清教学園ツアー', labelEn: 'School Tour', icon: Compass },
  ];

  const venueCounts = useMemo(() => {
    const counts: Record<string, number> = { all: schedules.length };
    venueOptions.forEach(v => {
      if (v.id !== 'all') {
        counts[v.id] = schedules.filter(s => s.venue === v.id).length;
      }
    });
    return counts;
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    const list = schedules.filter((event) => {
      if (event.published === false) {
        return false;
      }
      if (selectedVenue !== 'all' && event.venue !== selectedVenue) {
        return false;
      }
      if (selectedDay !== 'all') {
        if (event.day !== '両日' && event.day !== selectedDay) {
          return false;
        }
      }
      if (selectedType !== 'all') {
        if (event.performerType !== selectedType) return false;
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
  }, [schedules, selectedVenue, selectedDay, selectedType, searchQuery]);

  const getEventStatus = (startTime: string, endTime: string, day: string) => {
    if (!startTime || !endTime) return 'upcoming';
    if (currentTimeStr >= startTime && currentTimeStr <= endTime) return 'current';
    if (currentTimeStr < startTime) return 'upcoming';
    return 'finished';
  };

  const formatShareTextSingle = (event: ScheduleEvent) => {
    const venueLabel = translateVenue(event.venue, language);
    const dayLabel = event.day === 'Day1' ? '9/18(金) 1日目' : event.day === 'Day2' ? '9/19(土) 2日目' : '9/18・19 両日';
    const locationInfo = event.locationDetail ? `\n📍 場所詳細: ${event.locationDetail}` : `\n📍 会場: ${venueLabel} ${event.stagePosition ? `(${event.stagePosition})` : ''}`;
    return `✨【清教学園 文化祭 SGfes 2026】✨\n🎪 企画名: ${event.title}\n👤 出演・主催: ${event.performer} (${event.performerType || '企画'})\n🗓 日程: ${dayLabel}\n⏰ 時間: ${event.startTime}〜${event.endTime} (${event.duration || ''})${locationInfo}\n\n📝 内容:\n${event.description}\n\n#清教学園 #SGfes #文化祭`;
  };

  const handleCopySingle = (event: ScheduleEvent) => {
    const text = formatShareTextSingle(event);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(event.id);
        showToast(language === 'en' ? 'Event details copied to clipboard!' : '演目情報をコピーしました！LINEやSNSで友達に共有できます。');
        setTimeout(() => setCopiedId(null), 2500);
      });
    }
  };

  const handleLineShare = (event: ScheduleEvent) => {
    const text = formatShareTextSingle(event);
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWebShareSingle = async (event: ScheduleEvent) => {
    const text = formatShareTextSingle(event);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} | 清教学園文化祭`,
          text: text,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      handleCopySingle(event);
    }
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
      case 'セレモニー':
        return StarIcon;
      default:
        return Calendar;
    }
  };

  function StarIcon(props: React.SVGProps<SVGSVGElement>) {
    return <Sparkles {...props} />;
  }

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-3 sm:px-4">
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg border border-slate-700 flex items-center space-x-2 pointer-events-none animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-sm p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-sm bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'en' ? 'Festival Timetable' : '清教学園 文化祭 タイムテーブル'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              {language === 'en' ? 'Event & Performance Timetable' : '公演・企画 タイムテーブル'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {language === 'en' 
                ? 'Check out all stage shows, club performances, student tours, and special events across campus.' 
                : '第一体育館、レクチャールーム、グラウンド、ラーニングコモンズなど全エリアの公演・企画をまとめて確認できます。'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2 rounded-sm bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-sky-700" />
              <span>{language === 'en' ? 'Share with Friends' : '友達に共有する'}</span>
            </button>
            <div className="px-3 py-2 rounded-sm bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] text-slate-500 font-medium">{language === 'en' ? 'Total Events' : '総企画数'}</div>
              <div className="text-sm font-black text-slate-900">{schedules.length} <span className="text-[11px] font-normal text-slate-500">{language === 'en' ? 'items' : '件'}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-sm">
            <span className="text-xs text-slate-500 font-bold px-2 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {language === 'en' ? 'Day:' : '日程:'}
            </span>
            {[
              { id: 'all', label: language === 'en' ? 'All Days' : '全日程' },
              { id: 'Day1', label: language === 'en' ? 'Day 1 (9/18)' : '1日目 (9/18)' },
              { id: 'Day2', label: language === 'en' ? 'Day 2 (9/19)' : '2日目 (9/19)' },
            ].map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id as any)}
                className={`px-3 py-1 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                  selectedDay === day.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{language === 'en' ? 'Current Time:' : '現在時刻:'}</span>
            <strong className="font-mono text-slate-900 font-bold">{currentTimeStr}</strong>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 flex items-center justify-between px-1">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'en' ? 'Select Venue / Area' : '会場・エリアを選択'}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {language === 'en' ? 'Tap to filter' : 'タップで切り替え'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {venueOptions.map((v) => {
            const isSelected = selectedVenue === v.id;
            const Icon = v.icon;
            const count = venueCounts[v.id] || 0;

            return (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(v.id)}
                className={`p-3 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-300' : 'text-slate-500'}`} />
                  <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-800 text-sky-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight line-clamp-1">
                    {language === 'en' ? v.labelEn : v.labelJa}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVenue === '第一体育館' && (
        <div className="bg-sky-50 border border-sky-200 rounded-sm p-4 text-xs text-sky-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Info className="w-4 h-4 text-sky-700 shrink-0" />
            <span>{language === 'en' ? 'Gym 1 (Main Arena) Admission Notes' : '第一体育館 鑑賞にあたっての案内'}</span>
          </div>
          <p className="leading-relaxed text-sky-800 pl-5">
            {language === 'en'
              ? 'Outdoor shoes are strictly prohibited inside the gym. Please use indoor slippers/shoe bags at the entrance. "Floor" indicates the arena floor, and "Stage" indicates the elevated stage. Night Fes 2026 will also take place here on Day 1 (16:00~).'
              : '会場内は土足厳禁です。入口にてスリッパ・靴袋をご利用ください。「舞台下」はアリーナフロア面、「舞台上」はメインステージ上となります。9/18(金)16:00〜の後夜祭 (Seikyo Night Fes) も第一体育館で開催されます！'}
          </p>
        </div>
      )}

      {selectedVenue === 'レクチャールーム' && (
        <div className="bg-purple-50 border border-purple-200 rounded-sm p-4 text-xs text-purple-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-purple-700 shrink-0" />
            <span>{language === 'en' ? 'Lecture Room Information & Break' : 'レクチャールーム 案内・進行について'}</span>
          </div>
          <p className="leading-relaxed text-purple-800 pl-5">
            {language === 'en'
              ? 'Morning session features That\'s BRASS (10:20~) and Brass S (10:40~). Afternoon session features Twin Leaf (12:00~/12:10~) and Gospel Live (12:20~/12:30~). Lunch break is scheduled around 11:00-12:00.'
              : '午前の部ではThat\'s BRASS（10:20〜）、Brass S（10:40〜）のアンサンブル。午後の部では有志Twin Leaf、聖書研究会ゴスペル部門による現代版ワーシップLIVEをお届けします！'}
          </p>
        </div>
      )}

      {selectedVenue === 'グラウンド' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 text-xs text-emerald-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{language === 'en' ? 'Ground Special Event & Food Trucks' : 'グラウンド・中庭エリアのご案内'}</span>
          </div>
          <p className="leading-relaxed text-emerald-800 pl-5">
            {language === 'en'
              ? '9/19(Sat) 10:00-12:00 features Police & Firefighter experience with patrol cars and batting clinics. Food trucks are also open nearby throughout both festival days!'
              : '2日目(9/19) 10:00〜12:00はパトカー展示・指紋採取・防火服試着・野球教室を開催！また食堂前・グラウンド横中庭では大人気キッチンカーが常設オープンしています！'}
          </p>
        </div>
      )}

      {selectedVenue === 'ラーニングコモンズ' && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{language === 'en' ? 'Stamp Rally & Photo Spots' : 'SGfesスタンプラリー＆特設フォトスポット'}</span>
          </div>
          <p className="leading-relaxed text-amber-800 pl-5">
            {language === 'en'
              ? 'Collect 5 stamps placed at various school spots (Ground, Gym 1, Cafeteria, Library, Lecture Room, Learning Commons) and bring your sheet to Learning Commons for gifts! Photo spot & class T-shirt exhibits are also here.'
              : '校内5箇所のスタンプを集めてラーニングコモンズへ持参すると景品をプレゼント！各クラスTシャツ展示や思い出に残せる特設フォトスポットも設置されています。'}
          </p>
        </div>
      )}

      {selectedVenue === '清教学園ツアー' && (
        <div className="bg-teal-50 border border-teal-200 rounded-sm p-4 text-xs text-teal-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{language === 'en' ? 'School Tour for Alumni & Prospective Students' : '在校生による清教学園ツアー（景品あり）'}</span>
          </div>
          <p className="leading-relaxed text-teal-800 pl-5">
            {language === 'en'
              ? 'Day 2 (9/19) Tours start at 10:00, 12:00, and 14:00 (approx. 15 min). Meeting point is at the Gym 1 Entrance signpost. Free gifts available for participants!'
              : '文化祭2日目(9/19) 10:00〜 / 12:00〜 / 14:00〜の計3回開催（約15分）。集合場所は受付通過後の第一体育館前看板前です。入試検討中の方もOB・OGも気軽にご参加ください！'}
          </p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-sm p-3.5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search by title, performer, venue, or keyword...' : '企画名、出演者、会場、キーワードで検索...'}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 transition-colors"
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

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              {language === 'en' ? 'Type:' : '区分:'}
            </span>
            {[
              { id: 'all', label: language === 'en' ? 'All' : 'すべて' },
              { id: '部活', label: language === 'en' ? 'Club' : '部活' },
              { id: '有志', label: language === 'en' ? 'Volunteer' : '有志' },
              { id: '特別', label: language === 'en' ? 'Special' : '特別企画' },
            ].map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setSelectedType(tItem.id)}
                className={`px-2.5 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === tItem.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>
        </div>

        {(searchQuery || selectedType !== 'all' || selectedVenue !== 'all' || selectedDay !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              {language === 'en' ? 'Filtered Results:' : '表示中企画:'} <strong className="text-slate-900 font-bold">{filteredSchedules.length}</strong> {language === 'en' ? 'events' : '件'}
            </span>
            <button
              onClick={() => {
                setSelectedVenue('all');
                setSelectedDay('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="text-sky-700 hover:underline font-bold cursor-pointer"
            >
              {language === 'en' ? 'Reset Filters' : 'フィルターをリセット'}
            </button>
          </div>
        )}
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-3">
          <Info className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm sm:text-base font-bold text-slate-700">
            {language === 'en' ? 'No events found matching your criteria' : '条件に一致する公演・企画が見つかりませんでした'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'en' ? 'Try changing the venue, day, or search keywords.' : '日程や会場の絞り込みを変更するか、検索キーワードを見直してください。'}
          </p>
          <button
            onClick={() => {
              setSelectedVenue('all');
              setSelectedDay('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Show All Events' : 'すべての企画を表示'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSchedules.map((event, idx) => {
            const status = getEventStatus(event.startTime, event.endTime, event.day);
            const isGym = event.venue === '第一体育館';
            const isHighlighted = highlightedId === event.id;
            const Icon = getEventIcon(event.category);

            return (
              <motion.div
                key={event.id}
                id={event.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.2) }}
                className={`bg-white border rounded-sm shadow-2xs overflow-hidden transition-all ${
                  isHighlighted 
                    ? 'ring-2 ring-sky-500 border-sky-400 bg-sky-50/20' 
                    : status === 'current' 
                    ? 'border-emerald-400 ring-1 ring-emerald-400/30' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-xs sm:text-sm font-black text-sky-900 bg-sky-100/80 border border-sky-200 px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-700" />
                      {event.startTime} 〜 {event.endTime}
                    </span>
                    {event.duration && (
                      <span className="px-2 py-0.5 rounded-sm bg-white text-slate-600 border border-slate-200 text-xs font-bold">
                        {event.duration}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-slate-200/70 text-slate-700">
                      {event.day === 'Day1' ? (language === 'en' ? 'Day 1 (9/18)' : '1日目(9/18)') : event.day === 'Day2' ? (language === 'en' ? 'Day 2 (9/19)' : '2日目(9/19)') : (language === 'en' ? 'Both Days' : '両日(9/18・19)')}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-white text-slate-800 border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {translateVenue(event.venue, language)}
                      {event.stagePosition && <span className="text-slate-500 font-normal">({event.stagePosition})</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {status === 'current' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>NOW</span>
                      </span>
                    )}
                    {event.isImportant && (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-sm flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{language === 'en' ? 'Featured' : '注目'}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
                  {event.needsPoster !== false && (
                    <div 
                      onClick={() => setDetailModalEvent(event)} 
                      className="shrink-0 w-24 sm:w-28 h-32 sm:h-38 rounded-sm overflow-hidden border border-slate-200 shadow-2xs cursor-pointer group hover:scale-[1.02] transition-transform self-center sm:self-start"
                      title={language === 'en' ? 'Click to view poster' : 'クリックしてポスターを拡大'}
                    >
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

                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {event.department && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {event.department}
                        </span>
                      )}
                      {event.performerType && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                          {translatePerformerType(event.performerType, language)}
                        </span>
                      )}
                      {event.category && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200">
                          {translateCategory(event.category, language)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug break-words">
                      {event.title}
                    </h3>

                    <div className="text-xs font-bold text-slate-700 flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500">{language === 'en' ? 'Project Name (Organizer):' : '企画名（出演・主催）:'}</span>
                      <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200 font-bold">{event.performer || event.title}</span>
                    </div>

                    {event.description && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 pt-0.5">
                        {event.description}
                      </p>
                    )}

                    {event.experienceTime && (
                      <div className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{language === 'en' ? 'Duration / Hours: ' : '体験・閲覧時間: '}{event.experienceTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-xs sm:max-w-md">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.locationDetail || event.venue}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setDetailModalEvent(event)}
                      className="px-3 py-1.5 rounded-sm bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      {language === 'en' ? 'Details' : '詳細を見る'}
                    </button>

                    <button
                      onClick={() => handleCopySingle(event)}
                      title={language === 'en' ? 'Copy text' : 'テキストをコピー'}
                      className="p-1.5 rounded-sm bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                    >
                      {copiedId === event.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    </button>

                    <button
                      onClick={() => handleLineShare(event)}
                      title={language === 'en' ? 'Send via LINE' : 'LINEで送る'}
                      className="p-1.5 rounded-sm bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleWebShareSingle(event)}
                      title={language === 'en' ? 'Share event' : '友達にシェア'}
                      className="p-1.5 rounded-sm bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('map')}
                        title={language === 'en' ? 'View Map' : 'マップで確認'}
                        className="px-2.5 py-1.5 rounded-sm bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">{language === 'en' ? 'Map' : '地図'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {detailModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModalEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {detailModalEvent.department && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {language === 'en' ? 'Dept: ' : '部署: '}{detailModalEvent.department}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-sky-50 text-sky-800 border border-sky-200">
                  {translateVenue(detailModalEvent.venue, language)}
                </span>
                {detailModalEvent.stagePosition && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                    {detailModalEvent.stagePosition}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                  {detailModalEvent.officialDates || (detailModalEvent.day === 'Day1' ? '9/18 1日目' : detailModalEvent.day === 'Day2' ? '9/19 2日目' : '9/18・19 両日')}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {detailModalEvent.officialTitle || detailModalEvent.title}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                {language === 'en' ? 'Project Name (Organizer):' : '企画名（出演・主催）:'} <span className="text-slate-900 font-bold">{detailModalEvent.performer || detailModalEvent.officialTitle || detailModalEvent.title}</span>
              </p>
            </div>

            {detailModalEvent.needsPoster !== false && (detailModalEvent.posterFile || detailModalEvent.posterImage || detailModalEvent.image || detailModalEvent.title) && (
              <div className="w-full">
                <PosterImage
                  posterFile={detailModalEvent.posterFile}
                  posterImage={detailModalEvent.posterImage}
                  image={detailModalEvent.image}
                  title={detailModalEvent.officialTitle || detailModalEvent.title}
                  className="w-full max-h-72 rounded-sm"
                  allowZoom={true}
                />
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {detailModalEvent.department && (
                  <div>
                    <span className="text-slate-500 font-medium block">{language === 'en' ? 'Department:' : '部署名:'}</span>
                    <span className="font-bold text-slate-900">{detailModalEvent.department}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Event Name:' : '企画名:'}</span>
                  <span className="font-bold text-slate-900">{detailModalEvent.officialTitle || detailModalEvent.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Dates:' : '実施日程:'}</span>
                  <span className="font-bold text-slate-900">{detailModalEvent.officialDates || (detailModalEvent.day === 'Day1' ? '9/18' : detailModalEvent.day === 'Day2' ? '9/19' : '9/18, 9/19')}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">{language === 'en' ? 'Experience / Duration:' : '体験・閲覧時間:'}</span>
                  <span className="font-bold text-slate-900">{detailModalEvent.experienceTime || `${detailModalEvent.startTime}〜${detailModalEvent.endTime}`}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70">
                <span className="text-slate-500 font-medium block">{language === 'en' ? 'Location:' : '活動場所:'}</span>
                <span className="font-bold text-slate-900">{detailModalEvent.officialLocation || detailModalEvent.locationDetail || detailModalEvent.venue}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'en' ? 'Activity & Performance Details' : '活動・演目内容'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3.5 rounded-sm border border-slate-200">
                {detailModalEvent.activityContent || detailModalEvent.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleLineShare(detailModalEvent)}
                className="flex-1 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Send via LINE' : 'LINEで友達に送る'}</span>
              </button>
              <button
                onClick={() => handleCopySingle(detailModalEvent)}
                className="flex-1 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{language === 'en' ? 'Copy Text' : 'テキストをコピー'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
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

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 text-xs text-slate-700 max-h-56 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed select-all">
              {generateTimetableSummary()}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleLineShareAll}
                className="flex-1 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Send via LINE' : 'LINEで送信する'}</span>
              </button>
              <button
                onClick={handleCopyAllSummary}
                className="flex-1 py-2.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{language === 'en' ? 'Copy to Clipboard' : 'クリップボードにコピー'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 space-y-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
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

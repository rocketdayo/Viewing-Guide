import React, { useState, useEffect } from 'react';
import { ClassProject, CongestionLevel } from '../types';
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  QrCode,
  FileText,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../utils/i18n';

export interface CustomTimelineEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  note: string;
  location: string;
}

export interface ProjectScheduleMeta {
  startTime: string;
  endTime: string;
  note: string;
}

interface MyTimelineViewProps {
  bookmarkedProjects: ClassProject[];
  allProjects: ClassProject[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onSelectProject: (id: string) => void;
  onNavigate: (page: string) => void;
  onImportTimelineData?: (bookmarks: string[], customEvents: CustomTimelineEvent[], meta: Record<string, ProjectScheduleMeta>) => void;
}

export const SCHEDULE_META_KEY = 'seikyo_fes_2026_project_schedules_v1';
export const CUSTOM_EVENTS_KEY = 'seikyo_fes_2026_custom_events_v1';

export const MyTimelineView: React.FC<MyTimelineViewProps> = ({
  bookmarkedProjects = [],
  allProjects = [],
  bookmarks = [],
  onToggleBookmark,
  onSelectProject,
  onNavigate,
}) => {
  const { language, t } = useI18n();

  const [projectMeta, setProjectMeta] = useState<Record<string, ProjectScheduleMeta>>(() => {
    try {
      const saved = localStorage.getItem(SCHEDULE_META_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  const [customEvents, setCustomEvents] = useState<CustomTimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_EVENTS_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : [
        { id: 'c-1', title: language === 'en' ? 'Lunch Break at Cafeteria' : 'お昼休憩・模擬店ランチ', startTime: '12:00', endTime: '12:45', note: language === 'en' ? 'Quick bite at cafeteria or courtyard' : 'カフェテリアまたは中庭で軽食', location: language === 'en' ? 'Cafeteria' : 'カフェテリア' },
      ];
    } catch {
      return [];
    }
  });

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('13:00');
  const [newEndTime, setNewEndTime] = useState('13:30');
  const [newLocation, setNewLocation] = useState('本館中庭');
  const [newNote, setNewNote] = useState('');

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState('10:00');
  const [editEnd, setEditEnd] = useState('10:30');
  const [editNote, setEditNote] = useState('');

  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULE_META_KEY, JSON.stringify(projectMeta));
    } catch (e) {
      console.error('Failed to save project schedule meta:', e);
    }
  }, [projectMeta]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(customEvents));
    } catch (e) {
      console.error('Failed to save custom events:', e);
    }
  }, [customEvents]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveProjectMeta = (projectId: string) => {
    setProjectMeta(prev => ({
      ...prev,
      [projectId]: {
        startTime: editStart,
        endTime: editEnd,
        note: editNote,
      }
    }));
    setEditingProjectId(null);
  };

  const startEditingProject = (proj: ClassProject) => {
    const existing = projectMeta[proj.id] || { startTime: '10:00', endTime: '10:30', note: proj.scheduleNote || '' };
    setEditStart(existing.startTime);
    setEditEnd(existing.endTime);
    setEditNote(existing.note);
    setEditingProjectId(proj.id);
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: CustomTimelineEvent = {
      id: `ce-${Date.now()}`,
      title: newTitle.trim(),
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation.trim() || (language === 'en' ? 'Campus' : '校内'),
      note: newNote.trim(),
    };

    setCustomEvents(prev => [...(Array.isArray(prev) ? prev : []), item]);
    setNewTitle('');
    setNewNote('');
    setIsAddingCustom(false);
  };

  const handleDeleteCustomEvent = (id: string) => {
    setCustomEvents(prev => (Array.isArray(prev) ? prev : []).filter(e => e.id !== id));
  };

  const safeBookmarkedProjects = Array.isArray(bookmarkedProjects) ? bookmarkedProjects : [];
  const safeCustomEvents = Array.isArray(customEvents) ? customEvents : [];

  const combinedTimelineItems = [
    ...safeBookmarkedProjects.map(proj => {
      const meta = projectMeta[proj.id] || { startTime: '09:30', endTime: '10:00', note: proj.scheduleNote || '' };
      return {
        type: 'project' as const,
        id: proj.id,
        startTime: meta.startTime || '09:30',
        endTime: meta.endTime || '10:00',
        title: proj.title,
        subtitle: `${proj.classNumber}・${proj.category}`,
        location: proj.location,
        note: meta.note,
        congestion: proj.congestion,
        project: proj,
      };
    }),
    ...safeCustomEvents.map(ce => ({
      type: 'custom' as const,
      id: ce.id,
      startTime: ce.startTime,
      endTime: ce.endTime,
      title: ce.title,
      subtitle: language === 'en' ? 'Personal Event / Break' : '自由スケジュール・休憩',
      location: ce.location,
      note: ce.note,
      congestion: null,
      project: null,
    }))
  ].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const generateShareUrl = () => {
    const payload = {
      b: bookmarks,
      c: customEvents.map(e => ({ t: e.title, s: e.startTime, e: e.endTime, l: e.location, n: e.note })),
      m: projectMeta,
    };
    try {
      const jsonStr = JSON.stringify(payload);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}?shared_timeline=${encoded}#bookmarks`;
    } catch {
      return window.location.href;
    }
  };

  const generateFormattedTextSummary = () => {
    let text = language === 'en' 
      ? `✨【My Seikyo Gakuen Culture Festival Schedule】✨\n\n`
      : `✨【私の清教学園文化祭タイムスケジュール】✨\n\n`;
    if (combinedTimelineItems.length === 0) {
      text += language === 'en' ? `(No plans scheduled yet)\n` : `（予定はまだ登録されていません）\n`;
    } else {
      combinedTimelineItems.forEach((item) => {
        text += `⏰ ${item.startTime}〜${item.endTime}\n`;
        text += `📍 ${item.title} (${item.location})\n`;
        if (item.note) text += `   💬 ${language === 'en' ? 'Note:' : 'メモ:'} ${item.note}\n`;
        text += `\n`;
      });
    }
    text += `${t.schoolName} ${t.academicYear} ${t.guideTitle}\n${generateShareUrl()}`;
    return text;
  };

  const handleCopyShareLink = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      showToast(t.linkCopied);
    } catch {
      prompt(language === 'en' ? 'Copy this share URL:' : '以下の共有URLをコピーしてください:', url);
    }
  };

  const handleCopyTextSummary = async () => {
    const text = generateFormattedTextSummary();
    try {
      await navigator.clipboard.writeText(text);
      showToast(language === 'en' ? 'Schedule copied to clipboard!' : 'テキストサマリーをクリップボードにコピーしました！LINEやメモに貼り付けられます。');
    } catch {
      prompt(language === 'en' ? 'Copy this text:' : '以下のテキストをコピーしてください:', text);
    }
  };

  const handleShareLine = () => {
    const text = generateFormattedTextSummary();
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareX = () => {
    const text = `清教学園高校文化祭「清教エナジー！」私の巡回スケジュールを作りました！ #清教学園 #文化祭2026`;
    const shareUrl = generateShareUrl();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const getCongestionBadge = (level: CongestionLevel) => {
    switch (level) {
      case 'smooth':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">🟢 {t.statusSmooth}</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">🟡 {t.statusModerate}</span>;
      case 'crowded':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">🔴 {t.statusCrowded}</span>;
      case 'ticket':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">🎫 {t.statusTicket}</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">⛔ {t.statusClosed}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xs shadow-2xl flex items-center space-x-2 border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 rounded-xs bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xs bg-white/10 backdrop-blur-md shadow-inner">
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{t.timelineTitle}</h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              {t.timelineSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={() => setIsAddingCustom(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addCustomSchedule}</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xs bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-200" />
            <span>{t.shareTimeline}</span>
          </button>
          <button
            onClick={() => onNavigate('congestion')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>{t.checkCongestion} →</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-emerald-900">
                  <Share2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base">
                    {language === 'en' ? 'Share Timeline with Friends & Family' : 'タイムラインを友達・家族と共有'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <p className="text-slate-600 text-xs">
                  {language === 'en' 
                    ? 'Share your planned schedule, bookmarked exhibits, visiting times, and notes with anyone via link or message.' 
                    : 'あなたが作成したタイムスケジュール（保存した企画・時間・メモ）をURLやテキストで送ることができます。'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xs bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{language === 'en' ? 'Copy Share Link URL' : '共有リンクURLをコピー'}</span>
                  </button>
                  <button
                    onClick={handleCopyTextSummary}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xs bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === 'en' ? 'Copy Text Summary' : 'スケジュール文章をコピー'}</span>
                  </button>
                  <button
                    onClick={handleShareLine}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xs bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === 'en' ? 'Send via LINE' : 'LINEで友達に送る'}</span>
                  </button>
                  <button
                    onClick={handleShareX}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xs bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-sm font-black">𝕏</span>
                    <span>{language === 'en' ? 'Share on X (Twitter)' : 'X (Twitter) でシェア'}</span>
                  </button>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="block text-[11px] font-bold text-slate-500">
                    {language === 'en' ? 'Share Link URL' : '共有リンクURL'}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={generateShareUrl()}
                      className="w-full px-3 py-2 bg-slate-100 rounded-xs border border-slate-300 text-xs font-mono text-slate-700 select-all truncate"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className="px-3 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold rounded-xs shrink-0 cursor-pointer"
                    >
                      {language === 'en' ? 'Copy' : 'コピー'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xs border border-slate-200 flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'en' ? 'In-Person Smartphone QR Code' : '対面でスマホカメラから読み取るQRコード'}</span>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generateShareUrl())}`}
                    alt="Timeline QR Code"
                    className="w-32 h-32 bg-white p-1 rounded-xs border border-slate-300 shadow-xs"
                    loading="lazy"
                  />
                  <p className="text-[10px] text-slate-500">
                    {language === 'en' ? 'Scan with your camera to open this schedule immediately' : '友達のスマホのカメラでかざすとスケジュールが一発で開きます'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isAddingCustom && (
        <form onSubmit={handleAddCustomEvent} className="p-5 bg-white rounded-xs border border-emerald-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'Add Custom Schedule Item' : 'オリジナルのスケジュール項目を追加'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ {t.close}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {language === 'en' ? 'Event Name / Details' : 'イベント名 / 内容'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'en' ? 'e.g. Cafeteria Lunch, Meetup in courtyard' : '例: カフェテリアでランチ、中庭で友達と合流'}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {language === 'en' ? 'Location' : '場所'}
              </label>
              <input
                type="text"
                placeholder={language === 'en' ? 'e.g. Cafeteria, New Bldg 2F' : '例: 食堂・新館2F'}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {language === 'en' ? 'Start Time' : '開始時刻'}
              </label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {language === 'en' ? 'End Time' : '終了時刻'}
              </label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {language === 'en' ? 'Personal Note' : 'メモ・注意点'}
            </label>
            <input
              type="text"
              placeholder={language === 'en' ? 'e.g. Bring meal ticket' : '例: 食券を忘れずに持っていく'}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-4 py-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'キャンセル'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Add Item' : '追加する'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'en' ? 'Chronological Schedule' : 'タイムライン順スケジュール'} ({combinedTimelineItems.length} {language === 'en' ? 'items' : '件'})
          </h3>
          <span className="text-[11px] text-slate-400">
            {language === 'en' ? 'Automatically sorted by time' : '※時間順に自動並び替えされます'}
          </span>
        </div>

        {combinedTimelineItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xs bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">{t.emptyTimeline}</p>
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Bookmark projects from the Class Projects list or add custom events above to craft your itinerary.' : 'クラス企画一覧からブックマークするか、上記の「自由スケジュールを追加」ボタンを押して予定を組み立ててください。'}
            </p>
            <button
              onClick={() => onNavigate('classes')}
              className="mt-2 px-5 py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              {t.findProjects}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {combinedTimelineItems.map((item) => {
              const isProject = item.type === 'project';
              const proj = item.project;
              const isEditing = isProject && editingProjectId === item.id;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-4 sm:p-5 rounded-xs bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all space-y-3 relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isProject ? 'bg-emerald-600' : 'bg-emerald-500'}`} />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 pl-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xs font-mono text-xs font-black shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.startTime} 〜 {item.endTime}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">📍 {item.location}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isProject && proj && getCongestionBadge(proj.congestion.level)}
                      {!isProject && (
                        <button
                          onClick={() => handleDeleteCustomEvent(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="自由スケジュールを削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isProject && proj && (
                        <button
                          onClick={() => onToggleBookmark(proj.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="ブックマークを解除"
                        >
                          <Bookmark className="w-4 h-4 fill-rose-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pl-2 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{item.subtitle}</span>
                        <h4 
                          onClick={() => isProject && proj && onSelectProject(proj.id)}
                          className={`text-base font-black text-slate-900 ${isProject ? 'cursor-pointer hover:text-emerald-700 transition-colors' : ''}`}
                        >
                          {item.title} {isProject && ' →'}
                        </h4>
                      </div>

                      {isProject && proj && !isEditing && (
                        <button
                          onClick={() => startEditingProject(proj)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Edit Visit Time' : '訪問時間を変更'}</span>
                        </button>
                      )}
                    </div>

                    {isEditing && (
                      <div className="p-3 bg-emerald-50/70 rounded-xs border border-emerald-200 space-y-3 mt-2">
                        <div className="text-xs font-bold text-emerald-900">
                          {language === 'en' ? 'Edit Visit Time & Personal Note' : '訪問時間とメモの編集'}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                              {language === 'en' ? 'Start' : '開始時刻'}
                            </label>
                            <input
                              type="time"
                              value={editStart}
                              onChange={(e) => setEditStart(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                              {language === 'en' ? 'End' : '終了時刻'}
                            </label>
                            <input
                              type="time"
                              value={editEnd}
                              onChange={(e) => setEditEnd(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                            {language === 'en' ? 'Personal Note' : '個人メモ'}
                          </label>
                          <input
                            type="text"
                            placeholder={language === 'en' ? 'e.g. Pick up morning tickets' : '例: 11時回の整理券を10時に取りに行く'}
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingProjectId(null)}
                            className="px-3 py-1 rounded-lg bg-white text-slate-600 text-xs font-bold border border-slate-200"
                          >
                            {language === 'en' ? 'Cancel' : 'キャンセル'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProjectMeta(proj!.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-900 text-white text-xs font-bold shadow-2xs cursor-pointer"
                          >
                            {language === 'en' ? 'Save' : '保存'}
                          </button>
                        </div>
                      </div>
                    )}

                    {item.note && !isEditing && (
                      <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xs border border-slate-100 flex items-start space-x-2">
                        <span className="font-bold text-emerald-700 shrink-0">{language === 'en' ? 'Note:' : 'メモ:'}</span>
                        <span>{item.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

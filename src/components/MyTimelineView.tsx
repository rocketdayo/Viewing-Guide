import React, { useState, useEffect } from 'react';
import { ClassProject, CongestionLevel } from '../types';
import { Bookmark, Clock, MapPin, Plus, Trash2, Edit3, Check, AlertCircle, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface CustomTimelineEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  note: string;
  location: string;
}

interface ProjectScheduleMeta {
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
}

const SCHEDULE_META_KEY = 'seikyo_fes_2026_project_schedules_v1';
const CUSTOM_EVENTS_KEY = 'seikyo_fes_2026_custom_events_v1';

export const MyTimelineView: React.FC<MyTimelineViewProps> = ({
  bookmarkedProjects,
  allProjects,
  bookmarks,
  onToggleBookmark,
  onSelectProject,
  onNavigate,
}) => {
  // Project-specific schedule metadata (startTime, endTime, note)
  const [projectMeta, setProjectMeta] = useState<Record<string, ProjectScheduleMeta>>(() => {
    try {
      const saved = localStorage.getItem(SCHEDULE_META_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom user events (e.g. Lunch, Meetup)
  const [customEvents, setCustomEvents] = useState<CustomTimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_EVENTS_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 'c-1', title: 'お昼休憩・模擬店ランチ', startTime: '12:00', endTime: '12:45', note: 'カフェテリアまたは中庭で軽食', location: 'カフェテリア' },
      ];
    } catch {
      return [];
    }
  });

  // Modal / Form state for adding custom event
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('13:00');
  const [newEndTime, setNewEndTime] = useState('13:30');
  const [newLocation, setNewLocation] = useState('本館中庭');
  const [newNote, setNewNote] = useState('');

  // Editing project time inline
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState('10:00');
  const [editEnd, setEditEnd] = useState('10:30');
  const [editNote, setEditNote] = useState('');

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
      location: newLocation.trim() || '校内',
      note: newNote.trim(),
    };

    setCustomEvents(prev => [...prev, item]);
    setNewTitle('');
    setNewNote('');
    setIsAddingCustom(false);
  };

  const handleDeleteCustomEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  // Combine bookmarked projects and custom events into a unified chronological timeline
  const combinedTimelineItems = [
    ...bookmarkedProjects.map(proj => {
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
    ...customEvents.map(ce => ({
      type: 'custom' as const,
      id: ce.id,
      startTime: ce.startTime,
      endTime: ce.endTime,
      title: ce.title,
      subtitle: '自由スケジュール・休憩',
      location: ce.location,
      note: ce.note,
      congestion: null,
      project: null,
    }))
  ].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getCongestionBadge = (level: CongestionLevel) => {
    switch (level) {
      case 'smooth':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">🟢 空きあり</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">🟡 やや混雑</span>;
      case 'crowded':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">🔴 大混雑</span>;
      case 'ticket':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">🎫 整理券制</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">⛔ 一時休止</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-xs bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xs bg-white/10 backdrop-blur-md shadow-inner">
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">マイタイムスケジュール作成</h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              保存した企画の訪問時間を自由に設定したり、休憩・ランチなどの独自スケジュールを追加して、あなただけの完璧な文化祭タイムラインを作れます！
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setIsAddingCustom(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>自由スケジュールを追加</span>
          </button>
          <button
            onClick={() => onNavigate('congestion')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>現在の混雑状況を確認 →</span>
          </button>
        </div>
      </div>

      {/* Add Custom Event Modal Form */}
      {isAddingCustom && (
        <form onSubmit={handleAddCustomEvent} className="p-5 bg-white rounded-xs border border-emerald-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>オリジナルのスケジュール項目を追加</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ 閉じる
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">イベント名 / 内容</label>
              <input
                type="text"
                required
                placeholder="例: カフェテリアでランチ、中庭で友達と合流"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">場所</label>
              <input
                type="text"
                placeholder="例: 食堂・新館2F"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">開始時刻</label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">終了時刻</label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">メモ・注意点</label>
            <input
              type="text"
              placeholder="例: 食券を忘れずに持っていく"
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
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow-md transition-colors"
            >
              追加する
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-800">
            タイムライン順スケジュール ({combinedTimelineItems.length}件)
          </h3>
          <span className="text-[11px] text-slate-400">※時間順に自動並び替えされます</span>
        </div>

        {combinedTimelineItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xs bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">まだマイタイムラインに項目がありません</p>
            <p className="text-xs text-slate-400">クラス企画一覧からブックマークするか、上記の「自由スケジュールを追加」ボタンを押して予定を組み立ててください。</p>
            <button
              onClick={() => onNavigate('classes')}
              className="mt-2 px-5 py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              クラス企画一覧から探す
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {combinedTimelineItems.map((item, index) => {
              const isProject = item.type === 'project';
              const proj = item.project;
              const isEditing = isProject && editingProjectId === item.id;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-4 sm:p-5 rounded-xs bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all space-y-3 relative overflow-hidden"
                >
                  {/* Left Accent Bar */}
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

                  {/* Main Content */}
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
                          <span>訪問時間を変更</span>
                        </button>
                      )}
                    </div>

                    {/* Inline Editor for Project Time */}
                    {isEditing && (
                      <div className="p-3 bg-emerald-50/70 rounded-xs border border-emerald-200 space-y-3 mt-2">
                        <div className="text-xs font-bold text-emerald-900">訪問時間とメモの編集</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">開始時刻</label>
                            <input
                              type="time"
                              value={editStart}
                              onChange={(e) => setEditStart(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">終了時刻</label>
                            <input
                              type="time"
                              value={editEnd}
                              onChange={(e) => setEditEnd(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">個人メモ</label>
                          <input
                            type="text"
                            placeholder="例: 11時回の整理券を10時に取りに行く"
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
                            キャンセル
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProjectMeta(proj!.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-900 text-white text-xs font-bold shadow-2xs"
                          >
                            保存
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Note display if not editing */}
                    {item.note && !isEditing && (
                      <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xs border border-slate-100 flex items-start space-x-2">
                        <span className="font-bold text-emerald-700 shrink-0">メモ:</span>
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

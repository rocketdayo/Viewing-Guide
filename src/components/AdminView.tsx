import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Megaphone, 
  MessageSquare, 
  Layers, 
  Calendar, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Activity,
  LogOut,
  ExternalLink,
  KeyRound,
  Copy,
  Send,
  Pin,
  Radio
} from 'lucide-react';
import { AppDataState, Announcement, Greeting, ClassProject, ScheduleEvent, CongestionLevel } from '../types';
import { ANNOUNCEMENT_PORTAL_URL } from '../data/defaultData';

interface AdminViewProps {
  appData: AppDataState;
  onUpdateAppData: (newData: AppDataState) => void;
  onResetData: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  appData,
  onUpdateAppData,
  onResetData,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'announcements' | 'greetings' | 'projects' | 'schedules' | 'settings'>('announcements');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedPortalUrl, setCopiedPortalUrl] = useState(false);

  // Editing state copies
  const [formData, setFormData] = useState<AppDataState>(appData);

  useEffect(() => {
    setFormData(appData);
  }, [appData]);

  // Editing items
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // New Announcement Form State
  const [newAnn, setNewAnn] = useState<{
    category: '重要' | '混雑情報' | 'プログラム変更' | '一般案内';
    title: string;
    content: string;
    isPinned: boolean;
  }>({
    category: '重要',
    title: '',
    content: '',
    isPinned: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcode: seikyo2026
    if (password.trim().toLowerCase() === 'seikyo2026' || password === 'admin') {
      setIsAdminLoggedIn(true);
      setLoginError(false);
      setPassword('');
      setFormData(appData);
    } else {
      setLoginError(true);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveAll = (updated: AppDataState) => {
    setFormData(updated);
    onUpdateAppData(updated);
    showNotification('変更内容を正常に保存・更新しました！');
  };

  // 1. Announcement operations
  const handleAddAnnouncement = () => {
    if (!newAnn.title.trim() || !newAnn.content.trim()) return;
    const now = new Date();
    const timeStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const created: Announcement = {
      id: `ann-${Date.now()}`,
      timestamp: timeStr,
      category: newAnn.category,
      title: newAnn.title,
      content: newAnn.content,
      isPinned: newAnn.isPinned,
    };

    const updated: AppDataState = {
      ...formData,
      announcements: [created, ...formData.announcements],
    };
    handleSaveAll(updated);
    setNewAnn({ category: '重要', title: '', content: '', isPinned: false });
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated: AppDataState = {
      ...formData,
      announcements: formData.announcements.filter((a) => a.id !== id),
    };
    handleSaveAll(updated);
  };

  const handleTogglePinAnnouncement = (id: string) => {
    const updated: AppDataState = {
      ...formData,
      announcements: formData.announcements.map((a) =>
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      ),
    };
    handleSaveAll(updated);
  };

  // 2. Greetings operations
  const handleGreetingChange = (id: string, field: keyof Greeting, val: string) => {
    const updated: AppDataState = {
      ...formData,
      greetings: formData.greetings.map((g) =>
        g.id === id ? { ...g, [field]: val } : g
      ),
    };
    setFormData(updated);
  };

  const handleSaveGreetings = () => {
    handleSaveAll(formData);
  };

  // 3. Project operations
  const handleProjectCongestionUpdate = (
    id: string,
    level: CongestionLevel,
    waitTime: number,
    statusNote: string
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated: AppDataState = {
      ...formData,
      projects: formData.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              congestion: {
                ...p.congestion,
                level,
                waitTimeMinutes: waitTime,
                statusNote,
                lastUpdated: timeStr,
              },
            }
          : p
      ),
    };
    handleSaveAll(updated);
  };

  // 4. Gas URL update
  const handleSaveGasUrl = (url: string, announcementUrl?: string) => {
    const updated: AppDataState = {
      ...formData,
      gasCongestionUrl: url,
        gasAnnouncementUrl: announcementUrl !== undefined ? announcementUrl : appData.gasAnnouncementUrl,
    };
    handleSaveAll(updated);
  };

  // Login Screen if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6 animate-in fade-in duration-200">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-900 text-white rounded-xs flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            文化祭 管理者ログイン
          </h1>
          <p className="text-xs text-slate-500">
            実行委員会および教職員用の情報更新管理パネルです
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="p-6 bg-white rounded-xs border border-slate-200 shadow-md space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>管理者パスワード</span>
            </label>
            <input
              id="admin-password-input"
              type="password"
              placeholder="パスワードを入力..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              autoFocus
            />
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>パスワードが正しくありません。再度お試しください。</span>
            </div>
          )}

          <div className="p-3 bg-emerald-50/60 rounded-xs border border-emerald-100 text-xs text-emerald-900">
            <p className="font-bold mb-0.5">※ デモ用初期パスワード:</p>
            <code className="bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold text-emerald-700">
              seikyo2026
            </code>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              id="admin-login-submit-btn"
              type="submit"
              className="flex-1 py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm transition-colors shadow-xs"
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => {
                setPassword('seikyo2026');
                setIsAdminLoggedIn(true);
              }}
              className="px-3 py-2.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              ワンクリック入力
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Top Header */}
      <div className="p-5 sm:p-6 rounded-xs bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              管理者モード有効
            </span>
            <span className="text-xs text-slate-300">2026 清教学園高校文化祭</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            イベント情報 総合更新パネル
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-xs bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center space-x-2 animate-in fade-in duration-150">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-xs space-x-1 overflow-x-auto text-xs font-bold">
        {[
          { id: 'announcements', label: 'お知らせ・緊急速報', icon: Megaphone },
          { id: 'projects', label: 'クラス企画・混雑手動更新', icon: Layers },
          { id: 'schedules', label: 'スケジュール', icon: Calendar },
          { id: 'settings', label: 'GAS連携 & システム設定', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xs flex items-center space-x-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      
      {/* TAB 1: Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          {/* Main Announcement Distribution GAS Portal Box */}
          <div className="p-6 rounded-xs bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-emerald-950/10 border-2 border-amber-400/50 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500 text-white rounded-xs shadow-md">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      公式 配信システム
                    </span>
                    <span className="text-xs font-bold text-amber-900">Google Apps Script 連携</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    お知らせ・緊急速報 配信ポータル
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={ANNOUNCEMENT_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xs bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>配信サイトを開く</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ANNOUNCEMENT_PORTAL_URL);
                    setCopiedPortalUrl(true);
                    setTimeout(() => setCopiedPortalUrl(false), 2500);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xs bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold text-xs border border-slate-300 shadow-xs transition-all cursor-pointer"
                >
                  {copiedPortalUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">コピー完了</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>URLコピー</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              このサイト（Google Apps Script Web App）からお知らせを送信・配信してください。
              送信された速報やお知らせは、全生徒・来場者の鑑賞ガイド画面へ即時に自動同期されます。
            </p>

            <div className="p-3 bg-slate-900 rounded-xs border border-slate-800 text-sky-300 font-mono text-xs break-all flex items-center justify-between gap-3">
              <span className="truncate">{ANNOUNCEMENT_PORTAL_URL}</span>
              <a
                href={ANNOUNCEMENT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline shrink-0 text-xs font-sans font-bold flex items-center gap-1"
              >
                <span>直接アクセス</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Current Active Announcements List */}
          <div className="p-6 rounded-xs bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>現在配信中のお知らせ一覧 ({formData.announcements.length}件)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  アプリ上で全校生徒・来場者に公開されているお知らせです
                </p>
              </div>
            </div>

            {formData.announcements.length === 0 ? (
              <div className="p-6 rounded-xs bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                現在配信中のお知らせはありません。上の配信ポータルから送信するか、下の手動フォームから追加してください。
              </div>
            ) : (
              <div className="space-y-3">
                {formData.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-xs border transition-all ${
                      ann.isPinned
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            ann.category === '重要'
                              ? 'bg-rose-500 text-white'
                              : ann.category === '混雑情報'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span className="text-xs text-slate-500">{ann.timestamp}</span>
                        {ann.isPinned && (
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-current" />
                            ピン留め中
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePinAnnouncement(ann.id)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          {ann.isPinned ? 'ピン解除' : 'ピン留め'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fallback Manual Create Form */}
          <div className="p-6 rounded-xs bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                緊急用 手動お知らせ即時追加
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              GASポータルが開けない場合の予備として、管理画面から直接即時投稿も可能です。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">カテゴリ</label>
                <select
                  value={newAnn.category}
                  onChange={(e) =>
                    setNewAnn({ ...newAnn, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value="重要">重要（赤バッジ）</option>
                  <option value="混雑情報">混雑情報（オレンジバッジ）</option>
                  <option value="プログラム変更">プログラム変更（青バッジ）</option>
                  <option value="一般案内">一般案内（通常）</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnn.isPinned}
                    onChange={(e) => setNewAnn({ ...newAnn, isPinned: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>最上部にピン留めする</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">タイトル</label>
              <input
                type="text"
                placeholder="例: 【重要】本日のステージプログラム順序の変更について"
                value={newAnn.title}
                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">内容</label>
              <textarea
                rows={3}
                placeholder="お知らせの詳細内容を入力してください..."
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xs border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleAddAnnouncement}
              disabled={!newAnn.title.trim() || !newAnn.content.trim()}
              className="px-5 py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 disabled:bg-slate-300 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>お知らせを即時配信</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Projects & GAS Links */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>クラス企画・各クラス専用GAS編集画面リンク一覧</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              ガイド目次と同様に高1・高2の各クラスごとに整理しています。各クラスの「〇〇のGASを開く」ボタンをクリックすると、対応するクラスコード（1A〜2K）がセットされたGAS入力ページが別タブで開きます。
            </p>
          </div>

          {/* Grouped by Grade */}
          {(['1年', '2年'] as const).map((gradeName) => {
            const gradeProjects = formData.projects.filter(p => p.grade === gradeName);
            if (gradeProjects.length === 0) return null;

            return (
              <div key={gradeName} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <span className="px-3 py-1 rounded-xs bg-emerald-900 text-white font-black text-xs">
                    {gradeName === '1年' ? '高校1年生 (1A〜1J)' : '高校2年生 (2A〜2K)'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">全{gradeProjects.length}クラス</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gradeProjects.map((proj) => {
                    // Extract precise class code like "1A", "1B", ..., "2K"
                    const idMatch = proj.id.match(/p-([12])([a-k])/i);
                    let classCode = '1A';
                    if (idMatch) {
                      classCode = `${idMatch[1]}${idMatch[2].toUpperCase()}`;
                    } else {
                      const gradeNum = proj.grade.includes('2') ? '2' : '1';
                      const letterMatch = proj.classNumber.match(/([A-K])/i);
                      const letter = letterMatch ? letterMatch[1].toUpperCase() : 'A';
                      classCode = `${gradeNum}${letter}`;
                    }

                    const gasUrl = `https://script.google.com/a/macros/stu.seikyo.ed.jp/s/AKfycbyv4N5J-H6SdqnzUrGErypC89TnpwPJ2tW7FpnZwmHg_cCD7-0ImMHUjrSLZ5GIis4xpA/exec?class=${classCode}`;

                    return (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xs bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-emerald-300 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                              {proj.classNumber}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              class={classCode}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{proj.title}</h3>
                          <p className="text-[11px] text-slate-500">📍 {proj.location}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <a
                            href={gasUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2 px-3 rounded-xs shadow-2xs transition-colors"
                            title={`${proj.classNumber}専用GAS編集画面を開く`}
                          >
                            <span>{proj.classNumber}のGASを開く</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">登録済みスケジュール一覧</h3>
          <div className="space-y-2.5">
            {formData.schedules.map((sch) => (
              <div
                key={sch.id}
                className="p-3.5 rounded-xs bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded">
                      {sch.day} {sch.startTime}〜{sch.endTime}
                    </span>
                    <span className="font-bold text-slate-800">{sch.title}</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    出演: {sch.performer} | 📍 {sch.venue}
                  </p>
                </div>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                  {sch.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-xs bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              リアルタイム混雑・配信データ連携設定
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              文化祭の混雑状況およびお知らせデータを常時受信するデータソースURLです。
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  各クラス混雑状況（データ配信URL）:
                </label>
                <input
                  type="text"
                  value={formData.gasCongestionUrl}
                  onChange={(e) => setFormData({ ...formData, gasCongestionUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 font-mono text-xs text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  全校お知らせ配信（データ配信URL）:
                </label>
                <input
                  type="text"
                  value={formData.gasAnnouncementUrl}
                  onChange={(e) => setFormData({ ...formData, gasAnnouncementUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 font-mono text-xs text-slate-800"
                />
              </div>

              <button
                onClick={() => handleSaveGasUrl(formData.gasCongestionUrl, formData.gasAnnouncementUrl)}
                className="px-4 py-2 rounded-xs bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-950 transition-colors cursor-pointer"
              >
                URL設定を保存
              </button>
            </div>

          </div>

          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">データ初期化</h3>
            <p className="text-xs text-slate-500">
              ブラウザ内の変更キャッシュを初期化し、文化祭公式プリセットデータに戻します。
            </p>
            <button
              onClick={() => {
                if (confirm('すべての変更をリセットして初期データに戻しますか？')) {
                  onResetData();
                  showNotification('初期データにリセットしました');
                }
              }}
              className="px-4 py-2 rounded-xs border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
            >
              初期データに復元
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

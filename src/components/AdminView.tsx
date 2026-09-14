import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Megaphone, 
  Layers, 
  Calendar, 
  Settings, 
  Check, 
  AlertCircle, 
  Activity,
  LogOut,
  ExternalLink,
  KeyRound,
  Copy,
  Send,
  Radio
} from 'lucide-react';
import { AppDataState } from '../types';
import { ANNOUNCEMENT_PORTAL_URL, getClassCongestionInputUrl } from '../data/defaultData';
import { useI18n } from '../utils/i18n';

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
  const { language } = useI18n();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'announcements' | 'projects' | 'schedules' | 'settings'>('announcements');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedPortalUrl, setCopiedPortalUrl] = useState(false);

  const [formData, setFormData] = useState<AppDataState>(appData);

  useEffect(() => {
    setFormData(appData);
  }, [appData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SeikyoAdmin2026') {
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

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6 animate-in fade-in duration-200">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-900 text-white rounded-xs flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'en' ? 'Festival Admin Login' : '文化祭 管理者ログイン'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'en' 
              ? 'Control panel for committee members and faculty staff' 
              : '実行委員会および教職員用の情報更新管理パネルです'}
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="p-6 bg-white rounded-xs border border-slate-200 shadow-md space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Admin Password' : '管理者パスワード'}</span>
            </label>
            <input
              id="admin-password-input"
              type="password"
              placeholder={language === 'en' ? 'Enter password...' : 'パスワードを入力...'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xs border border-slate-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              autoFocus
            />
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{language === 'en' ? 'Incorrect password. Please try again.' : 'パスワードが正しくありません。再度お試しください。'}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer"
            >
              {language === 'en' ? 'Login' : 'ログイン'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="p-5 sm:p-6 rounded-xs bg-gradient-to-r from-slate-900 via-emerald-950 to-emerald-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              {language === 'en' ? 'Admin Mode Active' : '管理者モード有効'}
            </span>
            <span className="text-xs text-slate-300">{language === 'en' ? '2026 Seikyo High School Festival' : '2026 清教学園高校文化祭'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {language === 'en' ? 'Event Information Management Panel' : 'イベント情報 総合更新パネル'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Logout' : 'ログアウト'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-xs bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center space-x-2 animate-in fade-in duration-150">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="flex p-1.5 bg-slate-100 rounded-xs space-x-1 overflow-x-auto text-xs font-bold">
        {[
          { id: 'announcements', label: language === 'en' ? 'Announcements Portal' : 'お知らせ配信ポータル', icon: Megaphone },
          { id: 'projects', label: language === 'en' ? 'Class Projects & GAS Links' : 'クラス企画・混雑入力リンク', icon: Layers },
          { id: 'schedules', label: language === 'en' ? 'Schedule Overview' : 'スケジュール', icon: Calendar },
          { id: 'settings', label: language === 'en' ? 'System Reset' : 'システム設定・初期化', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xs flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
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

      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xs bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-emerald-950/10 border-2 border-amber-400/50 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500 text-white rounded-xs shadow-md">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {language === 'en' ? 'Official Portal' : '公式 配信システム'}
                    </span>
                    <span className="text-xs font-bold text-amber-900">Google Apps Script</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    {language === 'en' ? 'Announcements & News Flash Portal' : 'お知らせ・緊急速報 配信ポータル'}
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
                  <span>{language === 'en' ? 'Open Portal' : '配信サイトを開く'}</span>
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
                      <span className="text-emerald-700">{language === 'en' ? 'Copied' : 'コピー完了'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>{language === 'en' ? 'Copy URL' : 'URLコピー'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {language === 'en' 
                ? 'Send announcements through this Google Apps Script Web App. Messages will instantly synchronize across all attendee devices.' 
                : 'このサイト（Google Apps Script Web App）からお知らせを送信・配信してください。送信された速報やお知らせは、全生徒・来場者の鑑賞ガイド画面へ即時に自動同期されます。'}
            </p>

            <div className="p-3 bg-slate-900 rounded-xs border border-slate-800 text-sky-300 font-mono text-xs break-all flex items-center justify-between gap-3">
              <span className="truncate">{ANNOUNCEMENT_PORTAL_URL}</span>
              <a
                href={ANNOUNCEMENT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline shrink-0 text-xs font-sans font-bold flex items-center gap-1"
              >
                <span>{language === 'en' ? 'Direct Access' : '直接アクセス'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-xs bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'en' ? `Active Announcements (${(formData?.announcements || []).length})` : `現在配信中のお知らせ一覧 (${(formData?.announcements || []).length}件)`}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'en' ? 'Currently published announcements' : 'アプリ上で全校生徒・来場者に公開されているお知らせです'}
                </p>
              </div>
            </div>

            {(formData?.announcements || []).length === 0 ? (
              <div className="p-6 rounded-xs bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                {language === 'en' ? 'No active announcements.' : '現在配信中のお知らせはありません。上の配信ポータルから送信してください。'}
              </div>
            ) : (
              <div className="space-y-3">
                {(formData?.announcements || []).map((ann) => (
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
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            {language === 'en' ? 'Pinned' : '最上部固定中'}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'en' ? 'Class Project GAS Portal Links' : 'クラス企画・各クラス専用GAS編集画面リンク一覧'}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'Organized by grade (1st and 2nd years). Click the corresponding button to open the designated GAS update portal in a new tab.'
                : 'ガイド目次と同様に高1・高2の各クラスごとに整理しています。各クラスの「〇〇のGASを開く」ボタンをクリックすると、対応するクラスコード（1A〜2K）がセットされたGAS入力ページが別タブで開きます。'}
            </p>
          </div>

          {(['1年', '2年'] as const).map((gradeName) => {
            const gradeProjects = (formData?.projects || []).filter(p => p.grade === gradeName);
            if (gradeProjects.length === 0) return null;

            return (
              <div key={gradeName} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <span className="px-3 py-1 rounded-xs bg-emerald-900 text-white font-black text-xs">
                    {gradeName === '1年' 
                      ? (language === 'en' ? 'Grade 1 (1A - 1J)' : '高校1年生 (1A〜1J)') 
                      : (language === 'en' ? 'Grade 2 (2A - 2K)' : '高校2年生 (2A〜2K)')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {language === 'en' ? `${gradeProjects.length} classes` : `全${gradeProjects.length}クラス`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gradeProjects.map((proj) => {
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

                    const gasUrl = getClassCongestionInputUrl(classCode);

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
                              {classCode}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{proj.title}</h3>
                          <p className="text-[11px] text-slate-500">📍 {proj.location}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <a
                            href={gasUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 py-2 px-3 rounded-xs shadow-2xs transition-colors"
                            title={`${proj.classNumber} GAS`}
                          >
                            <span>{language === 'en' ? `Open ${proj.classNumber} GAS` : `${proj.classNumber}の入力サイトを開く`}</span>
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

      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">
            {language === 'en' ? 'Registered Timetable Schedule' : '登録済みスケジュール一覧'}
          </h3>
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
                    {language === 'en' ? `Performer: ${sch.performer}` : `出演: ${sch.performer}`} | 📍 {sch.venue}
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

      {activeTab === 'settings' && (
        <div className="p-6 rounded-xs bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{language === 'en' ? 'Reset Data' : 'データ初期化'}</h3>
            <p className="text-xs text-slate-500">
              {language === 'en' 
                ? 'Restore local cached data back to default festival preset.' 
                : 'ブラウザ内の変更キャッシュを初期化し、文化祭公式プリセットデータに戻します。'}
            </p>
            <button
              onClick={() => {
                if (confirm(language === 'en' ? 'Reset all changes back to initial state?' : 'すべての変更をリセットして初期データに戻しますか？')) {
                  onResetData();
                  showNotification(language === 'en' ? 'Reset to initial data' : '初期データにリセットしました');
                }
              }}
              className="px-4 py-2 rounded-xs border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Restore Initial Preset' : '初期データに復元'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

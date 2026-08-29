import React, { useState } from 'react';
import { 
  Tv, 
  X, 
  Monitor, 
  Cast, 
  Cable, 
  CheckCircle2, 
  Laptop, 
  Smartphone,
  Info,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface MonitorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchMonitorMode: () => void;
}

export const MonitorGuideModal: React.FC<MonitorGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchMonitorMode,
}) => {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'hdmi' | 'wireless' | 'signage'>('hdmi');

  if (!isOpen) return null;

  return (
    <div 
      id="monitor-guide-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="monitor-guide-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xs shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/30 rounded-xs text-emerald-300">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {language === 'en' ? 'Monitor / TV / Projector Output' : 'モニター・TV・プロジェクター出力'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                {language === 'en' ? 'Campus Monitor Connection & Digital Signage Guide' : '校内モニター接続＆デジタルサイネージ投影ガイド'}
              </h2>
            </div>
          </div>
          <button
            id="close-monitor-guide-btn"
            onClick={onClose}
            className="p-2 rounded-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={t.close}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('hdmi')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition-all ${
              activeTab === 'hdmi'
                ? 'bg-white text-emerald-900 border-slate-200 shadow-2xs -mb-px'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Cable className="w-4 h-4 text-emerald-600" />
            <span>{language === 'en' ? '① HDMI Cable (Recommended)' : '① HDMIケーブル接続 (推奨)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('wireless')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition-all ${
              activeTab === 'wireless'
                ? 'bg-white text-emerald-900 border-slate-200 shadow-2xs -mb-px'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Cast className="w-4 h-4 text-sky-600" />
            <span>{language === 'en' ? '② Wireless Cast' : '② ワイヤレス投影 (キャスト)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('signage')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-t border-x transition-all ${
              activeTab === 'signage'
                ? 'bg-white text-emerald-900 border-slate-200 shadow-2xs -mb-px'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4 text-emerald-600" />
            <span>{language === 'en' ? '③ Signage Kiosk Setup' : '③ 廊下・受付の常時サイネージ化'}</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 flex-1">
          {activeTab === 'hdmi' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xs bg-emerald-50 border border-emerald-100 flex items-start space-x-3 text-xs sm:text-sm text-emerald-950">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    {language === 'en' ? 'Most stable and reliable connection method!' : '一番安定して確実な接続方法です！'}
                  </strong>
                  <p className="mt-0.5 text-emerald-800">
                    {language === 'en'
                      ? 'Simply connect an HDMI cable from your laptop to hallway TVs, auditorium projectors, or reception displays.'
                      : '学校の廊下TV、チャペル・体育館の大型プロジェクター、職員室・受付モニターにPCからHDMIケーブルを直接つなぐだけで大画面投影できます。'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-black">1</span>
                  <span>{language === 'en' ? 'Connect PC & TV/Monitor with HDMI cable' : 'PCとTV/モニターをHDMIケーブルで接続'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-1">
                  <p>{language === 'en' ? '・Plug the HDMI cable into your computer and the TV input.' : '・ノートPCや教卓PCのHDMI端子と、テレビ側の「HDMI 1」等の入力端子をケーブルでつなぎます。'}</p>
                  <p>{language === 'en' ? '・Switch TV input source to HDMI using the remote.' : '・テレビのリモコンで入力切替を「HDMI」に合わせます。'}</p>
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pt-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-black">2</span>
                  <span>{language === 'en' ? 'Select display mode (Duplicate or Extend)' : '画面表示モードを選択 (複製 または 拡張)'}</span>
                </h3>
                <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">{language === 'en' ? '[Windows]' : '【Windowsの場合】'}</strong>
                    <p className="text-slate-600">
                      {language === 'en' ? 'Press ' : 'キーボードの '}
                      <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold">Win</kbd> + <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono font-bold">P</kbd>
                    </p>
                    <p className="text-slate-600">
                      {language === 'en' ? 'Choose Duplicate or Extend.' : '→「複製」（PCと同じ画面）または「拡張」（TV側専用画面）を選択。'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">{language === 'en' ? '[Mac / iPad]' : '【Mac / iPadの場合】'}</strong>
                    <p className="text-slate-600">
                      {language === 'en' ? 'Open System Settings -> Displays.' : '「システム設定」→「ディスプレイ」を開きます。'}
                    </p>
                    <p className="text-slate-600">
                      {language === 'en' ? 'Set TV to Mirroring or Extended display.' : '→ 接続したTVを「ミラーリング」または「拡張ディスプレイ」に設定します。'}
                    </p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pt-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-black">3</span>
                  <span>{language === 'en' ? 'Launch Fullscreen Signage Mode' : '「サイネージ全画面モード」を起動'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-1">
                  <p>
                    {language === 'en' 
                      ? '・Click "Open Large Monitor Signage Mode" below or press F11 for fullscreen.' 
                      : '・下の「今すぐ大画面モニターモードを開く」ボタンを押すか、F11 キーを押して全画面表示にします。'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wireless' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xs bg-sky-50 border border-sky-100 flex items-start space-x-3 text-xs sm:text-sm text-sky-950">
                <Cast className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    {language === 'en' ? 'No cables needed! Wireless cast via Wi-Fi' : 'ケーブル不要！Wi-Fi経由でテレビにワイヤレス投影'}
                  </strong>
                  <p className="mt-0.5 text-sky-800">
                    {language === 'en'
                      ? 'Supports Chromecast, Apple TV, Google TV, and AirPlay smart TVs on campus Wi-Fi.'
                      : 'Chromecast、Google TV、Fire TV Stick、Apple TV、またはスマートTVが校内Wi-Fiに接続されている場合、無線で画面をキャストできます。'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xs border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'en' ? 'Cast from Google Chrome' : 'Google Chromeからキャスト'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                    <li>{language === 'en' ? 'Open Chrome on PC' : 'PCでGoogle Chromeを開く'}</li>
                    <li>{language === 'en' ? 'Click menu (3 dots) in top right' : '画面右上の「︙（メニュー）」をクリック'}</li>
                    <li>{language === 'en' ? 'Select "Cast / Share screen"' : '「キャスト / 画面共有」を選択'}</li>
                    <li>{language === 'en' ? 'Choose the target TV display' : 'テレビに表示されているキャスト先を選択'}</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xs border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center space-x-2 text-sky-900 font-bold">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    <span>{language === 'en' ? 'iPhone / iPad / Mac (AirPlay)' : 'iPhone / iPad / Mac (AirPlay)'}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs leading-relaxed">
                    <li>{language === 'en' ? 'Open Control Center' : '右上からスワイプして「コントロールセンター」を開く'}</li>
                    <li>{language === 'en' ? 'Tap Screen Mirroring' : '「画面ミラーリング (2つの重なる四角)」をタップ'}</li>
                    <li>{language === 'en' ? 'Select Apple TV or AirPlay display' : 'Apple TV または対応スマートテレビを選択'}</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'signage' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xs bg-emerald-50 border border-emerald-100 flex items-start space-x-3 text-xs sm:text-sm text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    {language === 'en' ? 'Tips for Unattended Kiosk Signage' : '昇降口・受付・渡り廊下に置く無人サイネージのコツ'}
                  </strong>
                  <p className="mt-0.5 text-emerald-800">
                    {language === 'en'
                      ? 'Best practices for running an all-day festival display without interruption.'
                      : '文化祭期間中、無人で1日中画面を表示し続けるための設定ポイントです。'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-slate-900 font-bold">
                      {language === 'en' ? 'Disable sleep & screen turn-off' : 'PCのスリープ・画面消灯を「オフ」にする'}
                    </strong>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {language === 'en' ? 'Set power and sleep timeouts to "Never".' : 'Windows:「電源とスリープの設定」→「スリープ：なし」/ Mac:「ディスプレイがオフのときに自動でスリープさせない」'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xs bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-slate-900 font-bold">
                      {language === 'en' ? 'Automatic refresh synchronization' : '自動更新を「15秒」または「30秒」に設定'}
                    </strong>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {language === 'en' ? 'Realtime GAS queue updates are pulled automatically.' : 'Google Apps Scriptの各クラス待機時間が自動で常に最新に更新されます。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xs border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {t.close}
          </button>

          <button
            id="launch-monitor-mode-btn"
            onClick={() => {
              onLaunchMonitorMode();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xs bg-gradient-to-r from-emerald-900 to-emerald-800 hover:from-emerald-950 hover:to-emerald-900 text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Tv className="w-4 h-4 text-emerald-400" />
            <span>{language === 'en' ? 'Launch Big Screen Signage Mode' : '今すぐ「大画面モニター・サイネージモード」を開く'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

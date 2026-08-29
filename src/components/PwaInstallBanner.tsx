import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, WifiOff, CheckCircle2, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../utils/i18n';

interface PwaInstallBannerProps {
  forceShowModal?: boolean;
  onCloseModal?: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  forceShowModal = false,
  onCloseModal
}) => {
  const { language, t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('seikyo_pwa_banner_dismissed') === 'true';
  });
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const standalone = (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
    return standalone || localStorage.getItem('seikyo_pwa_installed') === 'true';
  });
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  useEffect(() => {
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);
    if (checkStandalone) {
      setIsInstalled(true);
      localStorage.setItem('seikyo_pwa_installed', 'true');
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsStandalone(true);
      setDeferredPrompt(null);
      localStorage.setItem('seikyo_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
        localStorage.setItem('seikyo_pwa_installed', 'true');
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('seikyo_pwa_banner_dismissed', 'true');
  };

  const isModalOpen = forceShowModal || showIOSModal;
  const handleCloseInternalModal = () => {
    setShowIOSModal(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-center space-x-2 z-50 sticky top-0 shadow-md"
          >
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>{t.offlineMode} ({t.offlineDesc})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isInstalled && !isStandalone && !isDismissed && (deferredPrompt || isIOS) && (
        <aside 
          aria-label={t.pwaInstallTitle}
          className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-emerald-950/95 backdrop-blur-md text-white p-3.5 rounded-xs border border-emerald-700/60 shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xs bg-emerald-700/80 text-emerald-100 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-emerald-100">
                  {t.pwaInstallTitle}
                </p>
                <p className="text-[11px] text-emerald-300 leading-snug">
                  {t.pwaInstallDesc}
                </p>
                <div className="pt-1.5 flex items-center space-x-2">
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black shadow-md cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.installBtn}</span>
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-2.5 py-1.5 text-[11px] text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Later' : 'あとで'}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-emerald-400 hover:text-white p-1 rounded-xs cursor-pointer"
              title={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-emerald-900">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm sm:text-base">
                    {language === 'en' ? 'Add to Home Screen for best experience' : 'ホーム画面に追加して快適に利用'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseInternalModal}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-xs cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-emerald-50 rounded-xs border border-emerald-200 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">{language === 'en' ? 'Benefits' : 'メリット'}</span>
                    <ul className="list-disc list-inside text-emerald-800 text-xs mt-1 space-y-0.5">
                      <li>{language === 'en' ? 'Fast launch even with weak mobile signal' : '校内の電波が不安定でも即座に起動'}</li>
                      <li>{language === 'en' ? 'Full-screen app view without browser bars' : 'ブラウザの検索バーが消えて全画面で広々表示'}</li>
                      <li>{language === 'en' ? '1-tap instant access to map & live queues' : 'ワンタップでいつでも混雑度・地図を確認'}</li>
                    </ul>
                  </div>
                </div>

                {isIOS ? (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xs border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{language === 'en' ? 'iPhone / iPad (Safari) instructions:' : 'iPhone / iPad (Safari) での手順:'}</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700">
                      <li className="flex items-center space-x-1.5">
                        <span>{language === 'en' ? '1. Tap ' : '1. 画面下の'}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-bold">
                          <Share className="w-3.5 h-3.5 mr-1" /> {language === 'en' ? 'Share' : '共有ボタン'}
                        </span>
                        <span>{language === 'en' ? ' button' : 'をタップ'}</span>
                      </li>
                      <li>
                        {language === 'en' ? '2. Scroll and select ' : '2. メニューをスクロールし '}
                        <span className="font-bold text-emerald-800">{language === 'en' ? '"Add to Home Screen"' : '「ホーム画面に追加」'}</span>
                      </li>
                      <li>
                        {language === 'en' ? '3. Tap ' : '3. 右上の '}
                        <span className="font-bold text-emerald-800">{language === 'en' ? '"Add"' : '「追加」'}</span>
                        {language === 'en' ? ' in top right to finish!' : ' をタップして完了！'}
                      </li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xs border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900">{language === 'en' ? 'Android / PC (Chrome / Edge):' : 'Android / PC (Chrome / Edge) の場合:'}</p>
                    <p className="text-slate-600">
                      {language === 'en'
                        ? 'Tap "Add to Home Screen" below or choose "Install app" from your browser menu (⋮).'
                        : '下の「ホーム画面に追加」ボタンを押すか、ブラウザ右上のメニュー（︙）から「アプリをインストール」または「ホーム画面に追加」を選択してください。'}
                    </p>
                    {deferredPrompt && (
                      <button
                        onClick={handleInstallClick}
                        className="w-full py-2.5 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white font-bold flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.installBtn}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCloseInternalModal}
                  className="px-4 py-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

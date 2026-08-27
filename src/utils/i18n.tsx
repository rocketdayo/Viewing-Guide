import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ja' | 'en';

export interface I18nTranslations {
  // Navigation
  navHome: string;
  navSchedule: string;
  navClasses: string;
  navCongestion: string;
  navMap: string;
  navBookmarks: string;
  navFaq: string;
  navAdmin: string;
  navToc: string;
  search: string;
  
  // Festival Branding
  schoolName: string;
  academicYear: string;
  guideTitle: string;
  themeLabel: string;
  
  // Status & Congestion
  statusSmooth: string;
  statusModerate: string;
  statusCrowded: string;
  statusTicket: string;
  statusClosed: string;
  waitTime: string;
  minutes: string;
  autoRefresh: string;
  manualRefresh: string;
  lastUpdated: string;
  
  // Timeline & Bookmarks
  timelineTitle: string;
  timelineSubtitle: string;
  addCustomSchedule: string;
  checkCongestion: string;
  shareTimeline: string;
  exportText: string;
  copyShareLink: string;
  shareToLine: string;
  shareToX: string;
  importedSuccess: string;
  linkCopied: string;
  emptyTimeline: string;
  findProjects: string;
  
  // FAQ & Manners
  faqTitle: string;
  faqSubtitle: string;
  faqSearchPlaceholder: string;
  mannersTitle: string;
  allCategories: string;
  
  // PWA / Offline
  pwaInstallTitle: string;
  pwaInstallDesc: string;
  installBtn: string;
  iosInstallGuide: string;
  offlineMode: string;
  offlineDesc: string;
  close: string;
}

const translations: Record<Language, I18nTranslations> = {
  ja: {
    navHome: 'ホーム',
    navSchedule: 'タイムテーブル',
    navClasses: 'クラス企画',
    navCongestion: '混雑状況',
    navMap: '校内マップ',
    navBookmarks: 'マイタイムライン',
    navFaq: 'よくある質問・マナー',
    navAdmin: '管理パネル',
    navToc: 'メニュー・目次',
    search: 'サイト内検索',
    
    schoolName: '清教学園高等学校',
    academicYear: '2026年度',
    guideTitle: '文化祭鑑賞ガイド',
    themeLabel: '清教エナジー！～1度しかない学園生活を楽しもう～',
    
    statusSmooth: '空きあり',
    statusModerate: 'やや混雑',
    statusCrowded: '大混雑',
    statusTicket: '整理券制',
    statusClosed: '一時休止',
    waitTime: '待ち時間',
    minutes: '分',
    autoRefresh: '自動更新',
    manualRefresh: '今すぐ更新',
    lastUpdated: '最終更新',
    
    timelineTitle: 'マイタイムスケジュール',
    timelineSubtitle: '保存した企画の訪問時間を設定したり、休憩・ランチなどの独自スケジュールを追加して、あなただけの文化祭タイムラインを作成・共有できます！',
    addCustomSchedule: '自由スケジュールを追加',
    checkCongestion: '現在の混雑状況を確認',
    shareTimeline: 'スケジュールを共有する',
    exportText: 'テキストサマリーをコピー',
    copyShareLink: '共有リンクをコピー',
    shareToLine: 'LINEで友達に送る',
    shareToX: 'Xでシェア',
    importedSuccess: '友達のタイムラインを読み込みました！',
    linkCopied: '共有リンクをクリップボードにコピーしました！',
    emptyTimeline: 'まだマイタイムラインに項目がありません',
    findProjects: 'クラス企画一覧から探す',
    
    faqTitle: 'よくある質問 ＆ 来場者マナーガイド',
    faqSubtitle: '校内土足禁止ルール、整理券取得方法、飲食・撮影・プライバシー配慮、保健室や落とし物（職員室）など、文化祭を安全・快適に楽しむためのご案内です。',
    faqSearchPlaceholder: '質問やキーワードを検索 (例: 整理券, 飲食, 撮影, スリッパ, 土足)...',
    mannersTitle: '来場者の皆様へのお願い・重要マナー',
    allCategories: 'すべて',
    
    pwaInstallTitle: 'ホーム画面に追加してアプリとして使う',
    pwaInstallDesc: '電波が混雑しやすい校内でも、オフラインで快適にマップやタイムテーブルを閲覧できます。',
    installBtn: 'ホーム画面に追加',
    iosInstallGuide: 'Safariの共有ボタン (四角から矢印) を押し、「ホーム画面に追加」を選択してください。',
    offlineMode: 'オフライン表示中',
    offlineDesc: '保存済みのキャッシュデータで表示しています',
    close: '閉じる',
  },
  en: {
    navHome: 'Home',
    navSchedule: 'Timetable',
    navClasses: 'Projects',
    navCongestion: 'Congestion',
    navMap: 'Campus Map',
    navBookmarks: 'My Timeline',
    navFaq: 'FAQ & Manners',
    navAdmin: 'Admin',
    navToc: 'Menu & Index',
    search: 'Search Site',
    
    schoolName: 'Seikyo Gakuen High School',
    academicYear: '2026',
    guideTitle: 'Festival Guide',
    themeLabel: 'Seikyo Energy! Enjoy your one-and-only school life',
    
    statusSmooth: 'Smooth',
    statusModerate: 'Moderate',
    statusCrowded: 'Crowded',
    statusTicket: 'Ticket Req.',
    statusClosed: 'Suspended',
    waitTime: 'Wait Time',
    minutes: 'min',
    autoRefresh: 'Auto Refresh',
    manualRefresh: 'Refresh Now',
    lastUpdated: 'Last Updated',
    
    timelineTitle: 'My Custom Timeline',
    timelineSubtitle: 'Plan your festival day! Add custom plans (lunch, meetup), manage class visits, and share your personalized schedule with friends.',
    addCustomSchedule: 'Add Custom Plan',
    checkCongestion: 'Check Live Congestion',
    shareTimeline: 'Share Schedule',
    exportText: 'Copy Summary Text',
    copyShareLink: 'Copy Share Link',
    shareToLine: 'Share via LINE',
    shareToX: 'Share on X',
    importedSuccess: 'Imported schedule successfully!',
    linkCopied: 'Share link copied to clipboard!',
    emptyTimeline: 'No events in your timeline yet',
    findProjects: 'Explore Class Projects',
    
    faqTitle: 'FAQ & Visitor Guidelines',
    faqSubtitle: 'Indoor shoes policy, tickets, dining & privacy/photo rules, health room, and lost & found (Faculty Office) to ensure a safe festival.',
    faqSearchPlaceholder: 'Search FAQs (e.g., tickets, cafeteria, photography, shoes)...',
    mannersTitle: 'Visitor Etiquette & Guidelines',
    allCategories: 'All Categories',
    
    pwaInstallTitle: 'Install App on Home Screen',
    pwaInstallDesc: 'Access timetables and campus maps even with weak school Wi-Fi or offline.',
    installBtn: 'Add to Home Screen',
    iosInstallGuide: 'Tap the Share button in Safari, then select "Add to Home Screen".',
    offlineMode: 'Offline Mode',
    offlineDesc: 'Displaying cached festival information',
    close: 'Close',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: I18nTranslations;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_LANG_KEY = 'seikyo_fes_language_v1';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'ja' || saved === 'en') return saved;
      // Auto-detect browser language
      const browserLang = navigator.language?.toLowerCase() || '';
      return browserLang.startsWith('en') ? 'en' : 'ja';
    } catch {
      return 'ja';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ja' ? 'en' : 'ja');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};

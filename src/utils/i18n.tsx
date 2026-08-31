import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ja' | 'en';

export interface I18nTranslations {
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

  schoolName: string;
  academicYear: string;
  guideTitle: string;
  themeLabel: string;

  statusSmooth: string;
  statusAvailable: string;
  statusModerate: string;
  statusCrowded: string;
  statusTicket: string;
  statusClosed: string;
  waitTime: string;
  minutes: string;
  autoRefresh: string;
  manualRefresh: string;
  refreshNow: string;
  lastUpdated: string;
  liveBadge: string;

  heroPortalBadge: string;
  heroTitle: string;
  heroTheme: string;
  heroLead: string;
  heroInfoLabel: string;
  heroAudience: string;
  heroDateLabel: string;
  heroVenueLabel: string;
  heroClassesBtn: string;
  heroLiveCongestionBtn: string;
  heroTodayStatus: string;
  heroOperating: string;
  heroSmoothAvailable: string;
  heroExhibitionsCount: string;
  heroTotalProjectsCount: string;
  heroLostAndFound: string;
  navDirectory: string;
  viewAllIndex: string;
  navClassesDesc: string;
  navClassesTag: string;
  navCongestionDesc: string;
  navCongestionTag: string;
  navFaqDesc: string;
  navFaqTag: string;
  navBookmarksDesc: string;
  navBookmarksTag: string;
  navScheduleDesc: string;
  navScheduleTag: string;
  navMapDesc: string;
  navMapTag: string;
  pickupTitle: string;
  viewAllProjects: string;

  congestionTitle: string;
  congestionSubtitle: string;
  allBuildings: string;
  mainBuilding1F: string;
  newBuilding2F: string;
  filterSmooth: string;
  filterModerate: string;
  filterCrowded: string;
  filterTicket: string;
  allProjects: string;
  searchPlaceholder: string;
  sortDefault: string;
  sortWaitAsc: string;
  sortWaitDesc: string;
  noMatchingProjects: string;

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

  faqTitle: string;
  faqSubtitle: string;
  faqSearchPlaceholder: string;
  mannersTitle: string;
  allCategories: string;

  pwaInstallTitle: string;
  pwaInstallDesc: string;
  installBtn: string;
  iosInstallGuide: string;
  offlineMode: string;
  offlineDesc: string;
  close: string;

  classesTitle: string;
  classesSubtitle: string;
  classesSearchPlaceholder: string;
  sortByDefault: string;
  sortByWaitTime: string;
  sortByTitle: string;
  onlineTicketsOnly: string;
  bookmarksOnly: string;
  gradeLabel: string;
  genreLabel: string;
  buildingLabel: string;
  congestionLabel: string;
  clearFilter: string;
  matchingProjects: string;
  totalProjects: string;
  noProjectsFound: string;
  tryChangingFilters: string;
  showAllProjects: string;
  viewDetails: string;
  liveCongestionMonitor: string;

  detailTitle: string;
  detailLocation: string;
  detailWaiting: string;
  detailRules: string;
  detailShare: string;
  detailCopied: string;
  detailBookmarkAdd: string;
  detailBookmarkRemove: string;
  detailOnlineTicketNotice: string;
  detailGetOnlineTicket: string;

  scheduleTitle: string;
  scheduleSubtitle: string;
  allVenues: string;
  gym1: string;
  lectureRoom: string;
  allTypes: string;
  typeClub: string;
  typeVolunteer: string;
  typeClass: string;
  scheduleSearchPlaceholder: string;
  eventStatusNow: string;
  eventStatusUpcoming: string;
  eventStatusFinished: string;
  eventCopied: string;
  stagePosStage: string;
  stagePosFloor: string;
  stagePosScreen: string;

  mapTitle: string;
  mapSubtitle: string;
  mapUnderConstruction: string;
  floor1: string;
  floor2: string;
  floor3: string;
  floor4: string;
  facilityRestroom: string;
  facilityFirstAid: string;
  facilityFacultyOffice: string;
  facilityCafeteria: string;
  facilityTrash: string;
  facilityWater: string;

  tourBadge: string;
  tourTitle: string;
  tourSubtitle: string;
  tourGiftBadge: string;
  tourHighlightTitle: string;
  tourHighlightDesc: string;
  tourMeetingPointLabel: string;
  tourMeetingPointVal: string;
  tourMeetingPointNote: string;
  tourMorningBadge: string;
  tourNoonBadge: string;
  tourAfternoonBadge: string;
  tourMorningDesc: string;
  tourNoonDesc: string;
  tourAfternoonDesc: string;
  tourGiftIncluded: string;
  tourNoReservation: string;
  tourNoticeTitle: string;
  tourFlyerTitle: string;
  tourFlyerDesc: string;
  tourOpenPdf: string;
  tourZoomFlyer: string;

  bloodTitle: string;
  bloodSubtitle: string;
  bloodDonationTitle: string;
  bloodDonationSubtitle: string;
  bloodDonationTicket: string;
  bloodAgeBadge: string;
  bloodLocation: string;
  bloodHours: string;
  bloodTicketNote: string;
  bloodOnlineTicketBtn: string;
  bloodOpenPdf: string;
  bloodZoomPoster: string;

  alumniBadge: string;
  alumniTitle: string;
  alumniSubtitle: string;
  alumniTab1: string;
  alumniTab2: string;
  alumniCareerDesc: string;
  alumniGourmetDesc: string;
  alumniOpenPdf: string;
  alumniZoomFlyer: string;

  announcementsTitle: string;
  announcementsSubtitle: string;
  announcementsEmergency: string;
  announcementsImportant: string;
  announcementsNormal: string;
  announcementsEmpty: string;

  greetingsTitle: string;
  greetingsSubtitle: string;
  greetingPrincipal: string;
  greetingCouncilPres: string;
  greetingCommitteeChair: string;

  searchPlaceholderGlobal: string;
  searchFilterAll: string;
  searchFilterProjects: string;
  searchFilterSchedules: string;
  searchFilterInfo: string;
  searchResultsCount: string;
  noSearchResults: string;

  tocTitle: string;
  tocSubtitle: string;
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
    statusAvailable: '空きあり',
    statusModerate: 'やや混雑',
    statusCrowded: '大混雑',
    statusTicket: '整理券制',
    statusClosed: '一時休止',
    waitTime: '待ち時間',
    minutes: '分',
    autoRefresh: '自動更新',
    manualRefresh: '今すぐ更新',
    refreshNow: '今すぐ更新',
    lastUpdated: '最終更新',
    liveBadge: 'LIVE',

    heroPortalBadge: '2026年度 清教学園高等学校 文化祭',
    heroTitle: 'SG fes 鑑賞ガイド',
    heroTheme: '清教エナジー！～1度しかない学園生活を楽しもう～',
    heroLead: '2026年度 清教学園中高合同文化祭の公式鑑賞ガイドです。9月18日・19日の2日間にわたり清教学園にて開催されます。全21クラス企画のリアルタイム混雑・待機時間や整理券情報、ステージタイムテーブル、校内マップなどを確認できます。',
    heroInfoLabel: '開催案内',
    heroAudience: '在校生・保護者・卒業生・受験生',
    heroDateLabel: '開催日程',
    heroVenueLabel: '開催場所',
    heroClassesBtn: 'クラス企画一覧を見る',
    heroLiveCongestionBtn: 'リアルタイム混雑モニター',
    heroTodayStatus: '本日の開催ステータス',
    heroOperating: '企画開催中',
    heroSmoothAvailable: '空きあり・すぐ入れる企画',
    heroExhibitionsCount: '企画',
    heroTotalProjectsCount: '全クラス・有志企画数',
    heroLostAndFound: '落とし物・お困りごとは職員室（本部）までお越しください',
    navDirectory: 'メインメニュー・機能一覧',
    viewAllIndex: '全メニュー・目次を見る',
    navClassesDesc: '高1・高2の全21クラス企画と展示・体験',
    navClassesTag: '全21企画',
    navCongestionDesc: '各教室のリアルタイム待ち時間と整理券状況',
    navCongestionTag: 'リアルタイム同期',
    navFaqDesc: '土足禁止・撮影マナー・よくある質問',
    navFaqTag: '来場案内',
    navBookmarksDesc: '行きたい企画を保存してカスタム予定を作成',
    navBookmarksTag: '自分用リスト',
    navScheduleDesc: '体育館・レクチャールームの公演予定',
    navScheduleTag: '全公演一覧',
    navMapDesc: '本館・新館の教室配置と施設案内',
    navMapTag: 'フロア別地図',
    pickupTitle: '注目のクラス企画ピックアップ',
    viewAllProjects: 'すべての企画を見る',

    congestionTitle: 'リアルタイム混雑・待機時間モニター',
    congestionSubtitle: '各クラスの混雑度と待ち時間をリアルタイムで配信中。空いている企画から効率よく回れます。',
    allBuildings: '全校舎一覧',
    mainBuilding1F: '本館（高校1年）',
    newBuilding2F: '新館（高校2年）',
    filterSmooth: '空きあり（0〜15分）',
    filterModerate: 'やや混雑（16〜30分）',
    filterCrowded: '混雑中（31分〜）',
    filterTicket: '整理券配布中',
    allProjects: '全企画',
    searchPlaceholder: 'クラス名・企画名・キーワードで検索...',
    sortDefault: '標準順（クラス番号）',
    sortWaitAsc: '待ち時間が短い順',
    sortWaitDesc: '待ち時間が長い順',
    noMatchingProjects: '条件に一致する企画がありません',

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

    classesTitle: 'クラス企画一覧',
    classesSubtitle: '高校1年・2年の全21企画の詳細情報とリアルタイム待機時間・整理券案内',
    classesSearchPlaceholder: '企画名、クラス名、キーワードで検索...',
    sortByDefault: '並び順: クラス標準順',
    sortByWaitTime: '並び順: 待ち時間が短い順',
    sortByTitle: '並び順: 企画名五十音順',
    onlineTicketsOnly: 'オンライン整理券',
    bookmarksOnly: '保存のみ',
    gradeLabel: '学年',
    genreLabel: 'ジャンル',
    buildingLabel: '校舎',
    congestionLabel: '混雑状況',
    clearFilter: '条件をクリア',
    matchingProjects: '該当企画',
    totalProjects: '全企画',
    noProjectsFound: '該当する企画が見つかりませんでした',
    tryChangingFilters: '検索条件やフィルターを変更してお試しください',
    showAllProjects: 'すべての企画を表示',
    viewDetails: '詳細を見る',
    liveCongestionMonitor: 'リアルタイム混雑モニターへ',

    detailTitle: '企画詳細',
    detailLocation: '場所',
    detailWaiting: '待ち時間',
    detailRules: '参加上の注意・ルール',
    detailShare: '友達に共有',
    detailCopied: 'コピー完了！',
    detailBookmarkAdd: 'マイタイムラインに追加',
    detailBookmarkRemove: 'マイタイムラインから削除',
    detailOnlineTicketNotice: 'オンライン整理券の配付対象企画です',
    detailGetOnlineTicket: 'オンライン整理券を取得する',

    scheduleTitle: 'ステージタイムテーブル',
    scheduleSubtitle: '第一体育館・レクチャールームの部活動・有志・クラス公演スケジュール',
    allVenues: 'すべての会場',
    gym1: '第一体育館',
    lectureRoom: 'レクチャールーム',
    allTypes: 'すべての出演種別',
    typeClub: '部活動',
    typeVolunteer: '有志',
    typeClass: 'クラス公演',
    scheduleSearchPlaceholder: '演目、出演団体、会場で検索...',
    eventStatusNow: '公演中',
    eventStatusUpcoming: '上演予定',
    eventStatusFinished: '終了',
    eventCopied: '共有テキストをコピーしました！',
    stagePosStage: '舞台',
    stagePosFloor: 'フロア',
    stagePosScreen: 'スクリーン',

    mapTitle: '校内マップ＆施設案内',
    mapSubtitle: '各校舎のフロア別クラス配置・お手洗い・救護室・給水所の場所',
    mapUnderConstruction: '校内マップデータを読み込み中...',
    floor1: '1F',
    floor2: '2F',
    floor3: '3F',
    floor4: '4F',
    facilityRestroom: 'お手洗い',
    facilityFirstAid: '保健室・救護所',
    facilityFacultyOffice: '職員室・本部',
    facilityCafeteria: '食堂・カフェテリア',
    facilityTrash: 'エコステーション（ゴミ箱）',
    facilityWater: '給水機',

    tourBadge: '特別案内・みんなで巡るツアー',
    tourTitle: 'OB・入試希望者向け 校内ツアー',
    tourSubtitle: '文化祭の賑やかな見どころや話題の企画を、ガイドと一緒にワイワイ楽しく回る校内ツアー！卒業生（OB・OG）の皆様も、受験生・保護者の皆様もお気軽にご参加ください。',
    tourGiftBadge: '参加特典：特製景品プレゼントあり！',
    tourHighlightTitle: 'みんなで回って文化祭を100%楽しむおすすめツアー',
    tourHighlightDesc: '校内の見どころスポットやおすすめの展示・模擬店をみんなで楽しく巡るガイド付きツアーです。懐かしい学校の雰囲気を感じたい同窓生の方も、学校生活を知りたい受験生・保護者の方も一緒に文化祭を満喫しましょう！',
    tourMeetingPointLabel: 'ツアー集合場所',
    tourMeetingPointVal: '第一体育館前',
    tourMeetingPointNote: '※各回開始時刻の5分前までに「第一体育館前」にお集まりください。',
    tourMorningBadge: '午前の部',
    tourNoonBadge: '昼の部',
    tourAfternoonBadge: '午後の部',
    tourMorningDesc: '文化祭オープニング直後！主要スポットや展示をわくわく巡る朝のコース',
    tourNoonDesc: '模擬店やクラス企画で賑わうピーク時の熱気と一緒に楽しむコース',
    tourAfternoonDesc: '文化祭のフィナーレに向けてみんなで盛り上がるおすすめコース',
    tourGiftIncluded: '景品あり',
    tourNoReservation: '予約不要・直接集合ok',
    tourNoticeTitle: 'ツアーご参加の案内・注意事項',
    tourFlyerTitle: '校内ツアー 案内チラシ（縦型PDF）',
    tourFlyerDesc: 'チラシデータをPDFで確認・ダウンロードできます。',
    tourOpenPdf: 'PDFチラシをダウンロード・表示',
    tourZoomFlyer: 'チラシを拡大表示',

    bloodTitle: '文化祭 献血コーナー',
    bloodSubtitle: '食堂前特設会場にて実施。命をつなぐ献血へのご協力をお願いいたします。',
    bloodDonationTitle: '文化祭 献血コーナー',
    bloodDonationSubtitle: '食堂前特設会場にて実施。命をつなぐ献血へのご協力をお願いいたします。',
    bloodDonationTicket: '整理券配布中',
    bloodAgeBadge: '16歳以上対象（体重等基準あり）',
    bloodLocation: '食堂前 特設スペース',
    bloodHours: '10:00〜16:00',
    bloodTicketNote: 'オンライン整理券でスムーズにご案内可能です。',
    bloodOnlineTicketBtn: '献血オンライン整理券を取得',
    bloodOpenPdf: '献血案内ポスターPDFを開く',
    bloodZoomPoster: 'ポスターを拡大表示',

    alumniBadge: '清教学園同窓会（清教会）特別企画',
    alumniTitle: '同窓会特別企画・未来の仕事図鑑 ＆ 先輩グルメ',
    alumniSubtitle: '卒業生によるキャリアガイドと特製グルメ企画！先輩たちの熱いメッセージをお届けします。',
    alumniTab1: '1P: 未来の仕事図鑑',
    alumniTab2: '2P: 先輩グルメ',
    alumniCareerDesc: '様々な業界で活躍する清教OB・OGからのキャリアアドバイスと職業紹介',
    alumniGourmetDesc: '同窓生おすすめの絶品グルメ＆カフェコーナー',
    alumniOpenPdf: '同窓会パンフレットPDFを開く',
    alumniZoomFlyer: 'パンフレットを拡大',

    announcementsTitle: '重要なお知らせ・速報',
    announcementsSubtitle: '文化祭運営本部からの最新情報や緊急案内を随時更新',
    announcementsEmergency: '緊急速報',
    announcementsImportant: '重要',
    announcementsNormal: 'お知らせ',
    announcementsEmpty: '現在、新しいお知らせはありません。',

    greetingsTitle: 'ごあいさつ',
    greetingsSubtitle: '文化祭開催にあたってのメッセージ',
    greetingPrincipal: '校長',
    greetingCouncilPres: '生徒会長',
    greetingCommitteeChair: '文化祭実行委員長',

    searchPlaceholderGlobal: '企画名、タイムテーブル、場所、マナーを検索...',
    searchFilterAll: 'すべて',
    searchFilterProjects: 'クラス企画',
    searchFilterSchedules: 'タイムテーブル',
    searchFilterInfo: 'インフォメーション',
    searchResultsCount: '件の検索結果',
    noSearchResults: '検索条件に一致する情報は見つかりませんでした',

    tocTitle: 'メニュー・目次',
    tocSubtitle: '文化祭ガイドの全機能とセクション一覧',
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
    statusAvailable: 'Smooth',
    statusModerate: 'Moderate',
    statusCrowded: 'Crowded',
    statusTicket: 'Ticket Req.',
    statusClosed: 'Suspended',
    waitTime: 'Wait Time',
    minutes: 'min',
    autoRefresh: 'Auto Refresh',
    manualRefresh: 'Refresh Now',
    refreshNow: 'Refresh Now',
    lastUpdated: 'Last Updated',
    liveBadge: 'LIVE',

    heroPortalBadge: '2026 Seikyo Gakuen High School Festival',
    heroTitle: 'SG fes Festival Guide',
    heroTheme: 'Seikyo Energy! Enjoy your one-and-only school life',
    heroLead: 'Official guide for the 2026 Seikyo Gakuen Culture Festival, held across 2 days on September 18 & 19 at Seikyo Gakuen. Explore 21 class exhibits with real-time queue times, stage schedules, and campus map.',
    heroInfoLabel: 'Event Details',
    heroAudience: 'Students, Parents, Alumni & Prospective Students',
    heroDateLabel: 'Dates',
    heroVenueLabel: 'Venue',
    heroClassesBtn: 'Explore Class Projects',
    heroLiveCongestionBtn: 'Live Congestion Monitor',
    heroTodayStatus: 'Today\'s Festival Status',
    heroOperating: 'Exhibits Open',
    heroSmoothAvailable: 'Smooth & Available Now',
    heroExhibitionsCount: 'exhibits',
    heroTotalProjectsCount: 'Total Exhibits & Projects',
    heroLostAndFound: 'Lost & Found / Inquiries: Visit Faculty Headquarters',
    navDirectory: 'Main Navigation & Features',
    viewAllIndex: 'View All Menu & Index',
    navClassesDesc: 'All 21 class exhibits across Grade 1 & Grade 2',
    navClassesTag: '21 Projects',
    navCongestionDesc: 'Real-time estimated wait times and ticket statuses',
    navCongestionTag: 'Live Sync',
    navFaqDesc: 'Indoor shoes rules, photo etiquette, FAQs',
    navFaqTag: 'Visitor Guide',
    navBookmarksDesc: 'Save favorite exhibits to build your custom schedule',
    navBookmarksTag: 'Personal List',
    navScheduleDesc: 'Stage performances at Gym 1 & Lecture Room',
    navScheduleTag: 'Full Timetable',
    navMapDesc: 'Floor plans, classroom locations & facilities',
    navMapTag: 'Floor Maps',
    pickupTitle: 'Featured Class Exhibits',
    viewAllProjects: 'View All Projects',

    congestionTitle: 'Realtime Congestion & Wait Time Monitor',
    congestionSubtitle: 'Live waiting time estimates for all class attractions to help you plan an efficient visit.',
    allBuildings: 'All Buildings',
    mainBuilding1F: 'Main Bldg (Grade 1)',
    newBuilding2F: 'New Bldg (Grade 2)',
    filterSmooth: 'Available (0-15m)',
    filterModerate: 'Moderate (16-30m)',
    filterCrowded: 'Crowded (31m+)',
    filterTicket: 'Ticket Distributed',
    allProjects: 'All Projects',
    searchPlaceholder: 'Search by class, title, keyword...',
    sortDefault: 'Default (Class Order)',
    sortWaitAsc: 'Shortest Wait Time',
    sortWaitDesc: 'Longest Wait Time',
    noMatchingProjects: 'No matching projects found',

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

    classesTitle: 'Class Projects',
    classesSubtitle: 'Explore all 21 high school projects with real-time wait times & ticket guides',
    classesSearchPlaceholder: 'Search by project name, class, keywords...',
    sortByDefault: 'Sort: Class Order',
    sortByWaitTime: 'Sort: Shortest Wait Time',
    sortByTitle: 'Sort: Alphabetical',
    onlineTicketsOnly: 'Online Tickets',
    bookmarksOnly: 'Saved Only',
    gradeLabel: 'Grade',
    genreLabel: 'Genre',
    buildingLabel: 'Building',
    congestionLabel: 'Congestion',
    clearFilter: 'Clear Filters',
    matchingProjects: 'Matching Projects',
    totalProjects: 'Total Projects',
    noProjectsFound: 'No matching projects found',
    tryChangingFilters: 'Try adjusting your search query or filters',
    showAllProjects: 'Show All Projects',
    viewDetails: 'View Details',
    liveCongestionMonitor: 'Live Congestion Monitor',

    detailTitle: 'Project Details',
    detailLocation: 'Location',
    detailWaiting: 'Wait Time',
    detailRules: 'Guidelines & Rules',
    detailShare: 'Share with Friends',
    detailCopied: 'Copied to clipboard!',
    detailBookmarkAdd: 'Add to Timeline',
    detailBookmarkRemove: 'Remove from Timeline',
    detailOnlineTicketNotice: 'This project offers digital tickets',
    detailGetOnlineTicket: 'Get Digital Ticket',

    scheduleTitle: 'Stage Timetable',
    scheduleSubtitle: 'Live performances in Gym 1 and Lecture Room (Clubs, Volunteers, Classes)',
    allVenues: 'All Venues',
    gym1: 'Gym 1 (Main Arena)',
    lectureRoom: 'Lecture Room',
    allTypes: 'All Types',
    typeClub: 'Clubs',
    typeVolunteer: 'Volunteers',
    typeClass: 'Class Stage',
    scheduleSearchPlaceholder: 'Search by performance, group, venue...',
    eventStatusNow: 'Live Now',
    eventStatusUpcoming: 'Upcoming',
    eventStatusFinished: 'Ended',
    eventCopied: 'Schedule text copied!',
    stagePosStage: 'Stage',
    stagePosFloor: 'Floor',
    stagePosScreen: 'Screen',

    mapTitle: 'Campus Map & Facilities',
    mapSubtitle: 'Floor directory, restrooms, first aid, cafeteria, and water stations',
    mapUnderConstruction: 'Loading campus map data...',
    floor1: '1F',
    floor2: '2F',
    floor3: '3F',
    floor4: '4F',
    facilityRestroom: 'Restrooms',
    facilityFirstAid: 'First Aid Room',
    facilityFacultyOffice: 'Headquarters / Faculty',
    facilityCafeteria: 'Cafeteria & Dining',
    facilityTrash: 'Eco Trash Station',
    facilityWater: 'Water Station',

    tourBadge: 'Guided School Tour',
    tourTitle: 'School Tour for Alumni & Prospective Students',
    tourSubtitle: 'A fun, friendly guided tour exploring festival highlights and top attractions! Open to alumni, prospective students, and families.',
    tourGiftBadge: 'Bonus: Special Gift for All Participants!',
    tourHighlightTitle: 'Explore and Enjoy the Festival Together',
    tourHighlightDesc: 'Join our friendly student guides on a fun walk through high-energy classrooms, exhibitions, and food stalls. Connect with school life and create wonderful memories!',
    tourMeetingPointLabel: 'Meeting Point',
    tourMeetingPointVal: 'In front of Gym 1',
    tourMeetingPointNote: '* Please arrive in front of Gym 1 at least 5 minutes before each start time.',
    tourMorningBadge: 'Morning Session',
    tourNoonBadge: 'Noon Session',
    tourAfternoonBadge: 'Afternoon Session',
    tourMorningDesc: 'Right after opening! Discover top attractions and vibrant morning energy',
    tourNoonDesc: 'Experience the festival at its peak with busy stalls and performances',
    tourAfternoonDesc: 'Enjoy the exciting afternoon atmosphere leading up to the finale',
    tourGiftIncluded: 'Gift Included',
    tourNoReservation: 'No reservation required',
    tourNoticeTitle: 'Tour Guidelines & Info',
    tourFlyerTitle: 'Tour Flyer (Vertical PDF)',
    tourFlyerDesc: 'View and download the vertical tour flyer in PDF format.',
    tourOpenPdf: 'Download / View PDF Flyer',
    tourZoomFlyer: 'Zoom Flyer Image',

    bloodTitle: 'Festival Blood Donation Drive',
    bloodSubtitle: 'Located in front of the cafeteria. Join our community support initiative.',
    bloodDonationTitle: 'Festival Blood Donation Drive',
    bloodDonationSubtitle: 'Located in front of the cafeteria. Join our community support initiative.',
    bloodDonationTicket: 'Ticket Distributed',
    bloodAgeBadge: 'Ages 16+ (Standard criteria apply)',
    bloodLocation: 'In front of Cafeteria',
    bloodHours: '10:00 - 16:00',
    bloodTicketNote: 'Digital tickets are available for fast check-in.',
    bloodOnlineTicketBtn: 'Get Digital Queue Ticket',
    bloodOpenPdf: 'Open Blood Donation PDF',
    bloodZoomPoster: 'Zoom Poster Image',

    alumniBadge: 'Seikyo Alumni Association Special Project',
    alumniTitle: 'Alumni Project: Career Guidebook & Gourmet Corner',
    alumniSubtitle: 'Career guidance from experienced graduates and delicious special food stalls!',
    alumniTab1: 'Page 1: Career Guidebook',
    alumniTab2: 'Page 2: Alumni Gourmet',
    alumniCareerDesc: 'Career advice and insights from graduates across various professional industries',
    alumniGourmetDesc: 'Special alumni gourmet recommendations and cafe corner',
    alumniOpenPdf: 'Open Alumni Booklet PDF',
    alumniZoomFlyer: 'Zoom Booklet',

    announcementsTitle: 'Announcements & News',
    announcementsSubtitle: 'Latest updates and emergency notices from festival headquarters',
    announcementsEmergency: 'EMERGENCY',
    announcementsImportant: 'Important',
    announcementsNormal: 'Notice',
    announcementsEmpty: 'No announcements at this time.',

    greetingsTitle: 'Greetings & Messages',
    greetingsSubtitle: 'Official welcome messages from school leaders',
    greetingPrincipal: 'Principal',
    greetingCouncilPres: 'Student Council President',
    greetingCommitteeChair: 'Festival Committee Chair',

    searchPlaceholderGlobal: 'Search projects, timetables, venues, rules...',
    searchFilterAll: 'All',
    searchFilterProjects: 'Projects',
    searchFilterSchedules: 'Timetables',
    searchFilterInfo: 'Information',
    searchResultsCount: 'results found',
    noSearchResults: 'No matching results found',

    tocTitle: 'Menu & Index',
    tocSubtitle: 'Complete list of festival guide sections and shortcuts',
  },
};

export const translateCategory = (category: string, lang: Language): string => {
  if (lang !== 'en') return category;
  const map: Record<string, string> = {
    '演劇・劇': 'Drama & Play',
    'アトラクション・体験': 'Attraction & Games',
    '展示・研究': 'Exhibition & Research',
    'カフェ・飲食': 'Food & Cafe',
    '縁日・ゲーム': 'Carnival & Games',
    'ステージ・音楽': 'Stage & Music',
    'その他': 'Other',
    'all': 'All',
  };
  return map[category] || category;
};

export const translateBuilding = (building: string, lang: Language): string => {
  if (lang !== 'en') return building;
  const map: Record<string, string> = {
    '本館': 'Main Building',
    '新館': 'New Building',
    '特別棟': 'Special Building',
    'チャペル': 'Chapel',
    '体育館': 'Gymnasium',
    '中庭・屋外': 'Courtyard & Outdoor',
    'カフェテリア': 'Cafeteria',
    'キャンパス前・屋外': 'Outdoor Area',
    'all': 'All Buildings',
  };
  return map[building] || building;
};

export const translateGrade = (grade: string, lang: Language): string => {
  if (lang !== 'en') return grade;
  const map: Record<string, string> = {
    '1年': 'Grade 10 (H1)',
    '2年': 'Grade 11 (H2)',
    '3年': 'Grade 12 (H3)',
    'all': 'All Grades',
  };
  return map[grade] || grade;
};

export const translateVenue = (venue: string, lang: Language): string => {
  if (lang !== 'en') return venue;
  const map: Record<string, string> = {
    '第一体育館': 'Gym 1 (Main Arena)',
    'レクチャールーム': 'Lecture Room',
    'チャペル': 'Chapel',
    '中庭特設ステージ': 'Courtyard Stage',
    'all': 'All Venues',
  };
  return map[venue] || venue;
};

export const translatePerformerType = (type: string, lang: Language): string => {
  if (lang !== 'en') return type;
  const map: Record<string, string> = {
    '部活': 'Club',
    '有志': 'Volunteer',
    'クラス': 'Class',
    'all': 'All Types',
  };
  return map[type] || type;
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

export type CongestionLevel = 'smooth' | 'moderate' | 'crowded' | 'ticket' | 'closed';

export interface ClassProject {
  id: string;
  grade: '1年' | '2年' | '3年' | 'クラブ・有志' | '同窓会・特別企画';
  classNumber: string;
  title: string;
  catchphrase: string;
  category: '演劇・劇' | 'アトラクション・体験' | '展示・研究' | 'カフェ・飲食' | '縁日・ゲーム' | 'ステージ・音楽' | '特別企画・進路';
  rawCategory?: string;
  location: string;
  building: '本館' | '新館' | '特別棟' | 'チャペル' | '体育館' | '中庭・屋外' | '食堂' | 'カフェテリア' | 'キャンパス前・屋外';
  floor: string;
  description: string;
  fullDetails: string;
  highlights: string[];
  imageUrl?: string;
  organizer?: string;
  targetAudience?: string;
  timeSlot?: string;
  menuItems?: string[];
  duration?: string;
  capacity?: string;
  menuPrice?: string;
  ticketText?: string;
  congestion: {
    level: CongestionLevel;
    waitTimeMinutes: number;
    ticketRequired: boolean;
    ticketDistributionTime?: string;
    lastUpdated?: string;
    statusNote?: string;
    detailNote?: string;
  };
  scheduleNote?: string;
  rules?: string[];
  onlineTicketUrl?: string;
  onlineTicketNote?: string;
}

export interface ScheduleEvent {
  id: string;
  day: 'Day1' | 'Day2' | '両日';
  programNumber?: number | string;
  startTime: string;
  endTime: string;
  duration?: string;
  title: string;
  performer: string;
  performerType?: '部活' | '有志' | 'クラス' | '一般' | '特別';
  venue: string;
  stagePosition?: '舞台上' | '舞台下' | '舞台上・下' | 'フロア' | string;
  category: 'ステージ' | 'セレモニー' | 'ライブ' | '特別企画' | 'コンテスト' | 'ダンス' | '音楽・演奏' | '演劇' | 'パフォーマンス';
  description: string;
  isImportant?: boolean;
  image?: string;
  posterImage?: string;
  posterFile?: string;
  experienceTime?: string;
  locationDetail?: string;
  department?: string;
  officialTitle?: string;
  officialDates?: string;
  officialLocation?: string;
  activityContent?: string;
  needsPoster?: boolean;
  published?: boolean;
}

export interface Greeting {
  id: string;
  role: string;
  name: string;
  themeTitle: string;
  message: string;
  profileNote?: string;
}

export interface Announcement {
  id: string;
  timestamp: string;
  category: '重要' | '混雑情報' | 'プログラム変更' | '一般案内';
  title: string;
  content: string;
  isPinned?: boolean;
}

export interface AppDataState {
  festivalTitle: string;
  festivalTheme: string;
  dates: string;
  gasCongestionUrl: string;
  gasAnnouncementUrl?: string;
  greetings: Greeting[];
  announcements: Announcement[];
  projects: ClassProject[];
  schedules: ScheduleEvent[];
}

export type CongestionLevel = 'smooth' | 'moderate' | 'crowded' | 'ticket' | 'closed';

export interface ClassProject {
  id: string;
  grade: '1年' | '2年' | '3年' | 'クラブ・有志';
  classNumber: string; // e.g. '1年A組', '2年C組', '吹奏楽部'
  title: string;
  catchphrase: string;
  category: '演劇・劇' | 'アトラクション・体験' | '展示・研究' | 'カフェ・飲食' | '縁日・ゲーム' | 'ステージ・音楽';
  location: string;
  building: '本館' | '新館' | '特別棟' | 'チャペル' | '体育館' | '中庭・屋外' | 'カフェテリア';
  floor: string; // '1F', '2F', '3F', '4F' etc.
  description: string;
  fullDetails: string;
  highlights: string[];
  imageUrl?: string;
  congestion: {
    level: CongestionLevel;
    waitTimeMinutes: number; // e.g. 5, 20, 45
    ticketRequired: boolean;
    ticketDistributionTime?: string;
    lastUpdated?: string;
    statusNote?: string;
    detailNote?: string; // 待ち時間の隣の詳細欄（GAS連携）
  };
  scheduleNote?: string;
  rules?: string[];
  onlineTicketUrl?: string; // オンライン整理券URL (1B, 1D, 2A, 2D, 2E, 2J 等)
  onlineTicketNote?: string; // 整理券に関する案内・注意事項
}

export interface ScheduleEvent {
  id: string;
  day: 'Day1' | 'Day2' | '両日';
  startTime: string; // '09:30'
  endTime: string;   // '10:15'
  title: string;
  performer: string; // '吹奏楽部', '高2有志ダンス', '生徒会企画'
  venue: string;     // 'チャペル', '体育館ステージ', '中庭特設ステージ'
  category: 'ステージ' | 'セレモニー' | 'ライブ' | '特別企画' | 'コンテスト';
  description: string;
  isImportant?: boolean;
}

export interface Greeting {
  id: string;
  role: string;      // '学校長' | '生徒会長' | '文化祭実行委員長'
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

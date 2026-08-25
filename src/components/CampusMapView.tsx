import React, { useState } from 'react';
import { 
  MapPin, 
  Building, 
  Layers, 
  Info, 
  ChevronRight, 
  Sparkles,
  Compass,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassProject } from '../types';

interface CampusMapViewProps {
  projects: ClassProject[];
  onSelectProject: (projectId: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('本館');

  const buildingFacilities = [
    {
      id: '本館',
      name: '本館 (Main Building)',
      desc: '1年生クラス企画 (1A〜1J組 全10クラス)、救護室・冷水給水所',
      floors: [
        '1F: 救護室 / 冷水給水所',
        '2F: 1年A〜E組教室 (人形教室・1-B出口・パニックZoo・釣りスピアクアリウム・福山パラダイス)',
        '3F: 1年F〜J組教室 (WADARASHI・G組カフェ・人間カーリング・角には気を付けろ・かき氷始めました)',
      ],
      color: 'from-emerald-950 via-slate-900 to-emerald-900',
    },
    {
      id: '新館',
      name: '新館 (East Wing)',
      desc: '2年生クラス企画 (2A〜2K組 全11クラス)、体験型ゲーム・脱出・ホラー・ミステリー・ケバブ',
      floors: [
        '2F: 2年J組 (密室殺人の謎) / 2年K組 (惑星朝日脱出)',
        '3F: 2年A〜D組 (動物デビュー・サスケットモンスター・SGクエスト・モジャオサバイバル)',
        '4F: 2年E〜I組 (静かにして下さい・見極め道場・宿題チャレンジ・巨大人生ゲーム・ケバブやさん)',
      ],
      color: 'from-sky-950 via-slate-900 to-sky-900',
    },
    {
      id: '特別棟',
      name: '特別棟 (Special Wing)',
      desc: '特別視聴覚ホール (演劇部公演) & 実験室・作法室',
      floors: [
        '1F: 作法室',
        '2F: 化学実験室',
        '3F: 視聴覚ホール (演劇部 秋季特別公演「星巡りの切符」)',
      ],
      color: 'from-emerald-950 via-slate-900 to-emerald-900',
    },
    {
      id: 'チャペル',
      name: 'チャペル大講堂 (Chapel)',
      desc: '開会式・吹奏楽部コンサート・合唱部＆ハンドベル',
      floors: ['1F: 音楽室', '2F: チャペル礼拝堂ステージ'],
      color: 'from-amber-950 via-slate-900 to-amber-900',
    },
    {
      id: '体育館',
      name: '体育館アリーナ (Gymnasium)',
      desc: 'ダンス部ショーケース、パフォーマンス王座決定戦、グランドフィナーレ',
      floors: ['1F: アリーナ特設メインステージ'],
      color: 'from-rose-950 via-slate-900 to-rose-900',
    },
    {
      id: '中庭・屋外',
      name: '中庭ステージ & カフェテリア',
      desc: '青空有志バンドLIVE、軽音楽部フェス、食堂休憩スペース',
      floors: ['屋外: ウッドデッキ特設ステージ', '1F: カフェテリア休憩所'],
      color: 'from-purple-950 via-slate-900 to-purple-900',
    },
  ];

  const currentBuildingProjects = projects.filter((p) => {
    if (selectedBuilding === '中庭・屋外') {
      return p.building === '中庭・屋外' || p.building === 'カフェテリア';
    }
    return p.building === selectedBuilding;
  });

  const activeBuildingInfo =
    buildingFacilities.find((b) => b.id === selectedBuilding) || buildingFacilities[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-200 pb-4"
      >
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xs bg-amber-50 text-amber-700">
            <MapPin className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            校内マップ・フロア案内
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          本館（1年）、新館（2年）、特別棟、チャペル、体育館、中庭の場所と設備配置
        </p>
      </motion.div>

      {/* Building Tabs */}
      <div className="flex flex-wrap gap-2">
        {buildingFacilities.map((b) => (
          <button
            key={b.id}
            id={`map-building-tab-${b.id}`}
            onClick={() => setSelectedBuilding(b.id)}
            className={`px-4 py-2.5 rounded-xs text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedBuilding === b.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {b.id}
          </button>
        ))}
      </div>

      {/* Active Building Hero Details */}
      <motion.div 
        key={activeBuildingInfo.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 sm:p-8 rounded-xs bg-gradient-to-br ${activeBuildingInfo.color} text-white shadow-xl space-y-4`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xs bg-white/10 backdrop-blur-xs">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{activeBuildingInfo.name}</h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">{activeBuildingInfo.desc}</p>
          </div>
        </div>

        {/* Floor Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {activeBuildingInfo.floors.map((floor, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xs bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-slate-100"
            >
              {floor}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Projects within this building */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>{selectedBuilding}の企画一覧 ({currentBuildingProjects.length}件)</span>
          </h3>
          <span className="text-xs text-slate-400">タップして詳細表示</span>
        </div>

        {currentBuildingProjects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xs border border-slate-200 text-slate-500 text-xs sm:text-sm">
            この棟で開催されている固定クラス企画はありません（タイムテーブルのステージ公演をご覧ください）。
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {currentBuildingProjects.map((p, idx) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  whileHover={{ y: -2 }}
                  onClick={() => onSelectProject(p.id)}
                  className="p-4 rounded-xs bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-50 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-lg border border-emerald-100">
                        {p.classNumber}
                      </span>
                      <span className="text-xs text-slate-500">{p.floor}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {p.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">{p.catchphrase}</p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{p.location}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Facilities & Amenities Info Box */}
      <div className="p-6 rounded-xs bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>校内施設・バリアフリー・設備案内</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-white rounded-xs border border-slate-200/80">
            <strong className="block text-slate-800 mb-1">🚹🚺 お手洗い</strong>
            本館各階東側、新館各階中央、体育館1階にございます。多目的トイレは本館1階です。
          </div>
          <div className="p-3 bg-white rounded-xs border border-slate-200/80">
            <strong className="block text-slate-800 mb-1">🏥 救護室</strong>
            本館1階保健室に設置。体調不良や怪我の際はお近くの係生徒または教員までお声がけください。
          </div>
          <div className="p-3 bg-white rounded-xs border border-slate-200/80">
            <strong className="block text-slate-800 mb-1">💧 冷水給水所</strong>
            本館1階昇降口、新館2階エレベーター横に設置されています。マイボトルをご利用いただけます。
          </div>
          <div className="p-3 bg-white rounded-xs border border-slate-200/80">
            <strong className="block text-slate-800 mb-1">🗑️ ゴミステーション</strong>
            本館前広場および新館中庭に分別回収エコステーションを設置しています。美化にご協力ください。
          </div>
        </div>
      </div>
    </div>
  );
};

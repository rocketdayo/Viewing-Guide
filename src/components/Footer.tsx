import React from 'react';
import { MapPin, Phone, ShieldCheck, Heart, Sparkles, ChevronUp, ListTree } from 'lucide-react';
import { AppDataState } from '../types';
import { LogoBadge } from './LogoBadge';

interface FooterProps {
  appData?: AppDataState;
  onNavigate?: (page: string) => void;
  onOpenToc?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ appData, onNavigate, onOpenToc }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Theme */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <LogoBadge className="w-10 h-10" size={40} />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {appData?.festivalTitle || '2026 清教学園 中高合同文化祭 SG fes'}
                </h3>
                <p className="text-xs text-sky-400 font-medium">
                  {appData?.festivalTheme ? `テーマ「${appData.festivalTheme.replace(/^「|」$/g, '')}」` : '鑑賞ガイド'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              キリスト教精神に基づく「神を愛し、人を愛し、真理を愛する」教育のもと、生徒が創り上げる2日間の祭典。各クラスの熱演と展示、リアルタイム混雑モニターでお楽しみください。
            </p>
            <div className="text-xs text-slate-400 pt-1 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>大阪府河内長野市末広町380-1（南海高野線・近鉄長野線 河内長野駅より徒歩約10分）</span>
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ページ案内
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {onNavigate && (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('home')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      ホーム（ご挨拶・速報）
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('schedule')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      タイムテーブル・ステージ
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('classes')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      クラス企画一覧 ({appData?.projects?.length || 25}企画)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('congestion')}
                      className="hover:text-white text-emerald-400 font-bold transition-colors cursor-pointer"
                    >
                      リアルタイム混雑状況
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('map')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      校内マップ・フロア案内
                    </button>
                  </li>
                </>
              )}
              {onOpenToc && (
                <li>
                  <button
                    onClick={onOpenToc}
                    className="hover:text-sky-300 transition-colors flex items-center gap-1 text-sky-400 cursor-pointer"
                  >
                    <ListTree className="w-3.5 h-3.5" />
                    <span>全ページ目次一覧</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Guidelines & Admin */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ご来場の皆様へのお願い
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              校内は全面禁煙・土足厳禁箇所（上履き・スリッパ・靴袋をご持参ください）です。写真・動画のSNS投稿の際は他の方のお顔の写り込みにご配慮ください。
            </p>
            {onNavigate && (
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>管理者・実行委員ログイン</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Seikyo Gakuen High School Culture Festival. All Rights Reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>ページ上部へ戻る</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

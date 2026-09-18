import React, { useState } from 'react';
import { 
  Stamp, 
  MapPin, 
  Clock, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Maximize2, 
  X, 
  Sparkles,
  Calendar,
  Compass,
  Award
} from 'lucide-react';
import { useI18n } from '../utils/i18n';
import { PosterImage } from './PosterImage';

interface StampRallySectionProps {
  onNavigate?: (page: string, anchor?: string) => void;
}

export const StampRallySection: React.FC<StampRallySectionProps> = ({ onNavigate }) => {
  const { language } = useI18n();
  const [showPosterModal, setShowPosterModal] = useState(false);

  const steps = language === 'en' ? [
    {
      step: 'STEP 1',
      title: 'Pick up your rally sheet',
      desc: 'Stamp rally cards are placed at each stamp checkpoint around the school building.',
    },
    {
      step: 'STEP 2',
      title: 'Explore & collect 5 stamps',
      desc: 'Tour through the school exhibits and find all 5 stamp checkpoints on campus.',
    },
    {
      step: 'STEP 3',
      title: 'Visit Learning Commons',
      desc: 'Bring your completed sheet with all 5 stamps to the Learning Commons goal counter.',
    },
    {
      step: 'STEP 4',
      title: 'Claim your special prize!',
      desc: 'Show your stamps to the staff to receive exclusive commemorative SGfes gifts.',
    },
  ] : [
    {
      step: 'STEP 1',
      title: 'スタンプ台紙をゲット',
      desc: 'スタンプ設置場所（校内各所）にスタンプ台紙が置かれています。どこからでもスタートOK！',
    },
    {
      step: 'STEP 2',
      title: '校内をめぐって5個集める',
      desc: '展示や企画を楽しみながら、校舎内に設置された合計5箇所のスタンプを集めましょう。',
    },
    {
      step: 'STEP 3',
      title: 'ラーニングコモンズへ',
      desc: '5個すべてのスタンプが集まったら、ゴール地点の「ラーニングコモンズ」へ向かいます。',
    },
    {
      step: 'STEP 4',
      title: '特製景品をプレゼント！',
      desc: 'スタッフに台紙を提示すると、素敵なSGfes特製景品をプレゼントいたします！',
    },
  ];

  return (
    <section id="stamprally-section" className="py-14 bg-[#FAFBFD] border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-amber-800 tracking-wider uppercase">
                CAMPUS STAMP RALLY &bull; DAY 2 SPECIAL
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {language === 'en' ? 'Prizes for All Completers' : '景品プレゼント企画'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              {language === 'en' ? 'SGfes Campus Stamp Rally' : 'SGfesスタンプラリー'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'en'
                ? 'Explore campus exhibits, collect 5 stamps, and bring them to Learning Commons for prizes!'
                : '校内をめぐりながら5つのスタンプを集めよう！すべて集めてラーニングコモンズに来れば景品をプレゼント！'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 border border-amber-300 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>{language === 'en' ? 'View in Timetable' : 'タイムテーブルで確認'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('map')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-4 py-2.5 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-slate-600" />
                  <span>{language === 'en' ? 'Campus Map' : '校内マップ'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div 
              onClick={() => setShowPosterModal(true)}
              className="group relative bg-white border border-slate-300 p-2 shadow-2xs cursor-pointer overflow-hidden transition-all hover:border-amber-700 hover:shadow-md"
            >
              <div className="relative w-full aspect-[3/4] max-h-[420px] bg-slate-100 flex items-center justify-center overflow-hidden">
                <PosterImage
                  posterFile="SGfesFile.jpeg"
                  posterImage="/SGfes/SGfesFile.jpeg"
                  image="/SGfes/SGfesFile.jpeg"
                  title="SGfesスタンプラリー"
                  className="w-full h-full object-contain"
                  allowZoom={false}
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-900 text-xs font-bold shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-800" />
                    {language === 'en' ? 'Click to Enlarge Poster' : 'ポスターを拡大表示'}
                  </span>
                </div>
              </div>
              <div className="p-2 text-center text-xs text-slate-600 font-medium">
                {language === 'en' ? 'Official Stamp Rally Poster (Tap to expand)' : 'SGfesスタンプラリー 公式ポスター（タップで拡大）'}
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-2 text-amber-950 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-700" />
                <span>{language === 'en' ? 'Free Souvenir for Completing!' : 'クリア賞：特製景品プレゼント！'}</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {language === 'en'
                  ? 'Anyone can participate freely. Simply pick up a stamp sheet at any stamp checkpoint and enjoy touring the school!'
                  : 'どなたでも自由にご参加いただけます。台紙を見つけたらぜひスタンプ集めにチャレンジしてみてください！'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-300 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900">
                    {language === 'en' ? 'Event Overview' : '開催概要・引換場所'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
                  {language === 'en' ? 'Day 2 (Sep 19)' : '9月19日（2日目）'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-3.5 bg-[#FAFBFD] border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {language === 'en' ? 'HOURS' : '開催時間'}
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-900 mt-1">
                    09:30 〜 15:00
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'en' ? 'Open throughout Day 2' : '文化祭2日目 終日開催'}
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAFBFD] border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {language === 'en' ? 'DURATION' : '所要時間目安'}
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-900 mt-1">
                    {language === 'en' ? 'Approx. 30 mins' : '約30分'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'en' ? 'Enjoy while exploring' : '企画を巡りながら参加'}
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAFBFD] border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {language === 'en' ? 'STAMPS' : 'スタンプ数'}
                  </div>
                  <div className="text-lg font-serif font-bold text-amber-800 mt-1">
                    {language === 'en' ? '5 Checkpoints' : '全5箇所'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'en' ? 'Hidden across school' : '校舎内各所に設置'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>{language === 'en' ? 'Prize Redemption & Goal Location' : '景品引換場所（ゴール）'}</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">
                    {language === 'en'
                      ? 'Learning Commons (ラーニングコモンズ)'
                      : 'ラーニングコモンズ（本館エリア）'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en'
                      ? '5 stamps completed sheet exchange counter is located inside the Learning Commons.'
                      : '5つのスタンプを集めた台紙をお持ちいただくと、特設カウンターにて景品とお引き換えいたします。'}
                  </p>
                </div>
                {onNavigate && (
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('map')}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline decoration-amber-600 underline-offset-4 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Check Learning Commons on Campus Map' : '校内マップでラーニングコモンズの場所を確認'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{language === 'en' ? 'How to Participate' : 'スタンプラリーの進め方'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {steps.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-200">
                        {item.step}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 pt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPosterModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowPosterModal(false)}
        >
          <div 
            className="relative bg-white border border-slate-300 max-w-2xl w-full p-4 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                {language === 'en' ? 'SGfes Stamp Rally Poster' : 'SGfesスタンプラリー ポスター'}
              </h3>
              <button
                onClick={() => setShowPosterModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-50 p-2">
              <img 
                src="/SGfes/SGfesFile.jpeg"
                alt="SGfesスタンプラリーポスター"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{language === 'en' ? 'Day 2 (Sep 19) 09:30 - 15:00 Goal: Learning Commons' : '9/19(文化祭2日目) 09:30〜15:00 ゴール：ラーニングコモンズ'}</span>
              <button
                onClick={() => setShowPosterModal(false)}
                className="px-3 py-1 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Close' : '閉じる'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

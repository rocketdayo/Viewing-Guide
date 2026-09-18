import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Gift, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Maximize2, 
  X,
  Footprints
} from 'lucide-react';
import { useI18n } from '../utils/i18n';
import { PosterImage } from './PosterImage';

interface CampusTourSectionProps {
  onNavigate?: (page: string, anchor?: string) => void;
}

export const CampusTourSection: React.FC<CampusTourSectionProps> = ({ onNavigate }) => {
  const { language } = useI18n();
  const [showPosterModal, setShowPosterModal] = useState(false);

  const tourSlots = [
    {
      round: language === 'en' ? 'Session 1' : '第1回',
      time: '10:00 〜 10:15',
      duration: language === 'en' ? '15 mins' : '所要約15分',
      targetLabel: language === 'en' ? 'Morning Tour' : '午前の部',
    },
    {
      round: language === 'en' ? 'Session 2' : '第2回',
      time: '12:00 〜 12:15',
      duration: language === 'en' ? '15 mins' : '所要約15分',
      targetLabel: language === 'en' ? 'Midday Tour' : 'お昼の部',
    },
    {
      round: language === 'en' ? 'Session 3' : '第3回',
      time: '14:00 〜 14:15',
      duration: language === 'en' ? '15 mins' : '所要約15分',
      targetLabel: language === 'en' ? 'Afternoon Tour' : '午後の部',
    },
  ];

  const highlights = language === 'en' ? [
    {
      title: 'Guided by Current Students',
      desc: 'Friendly student guides will lead you through campus while sharing real school life stories.',
    },
    {
      title: 'Iconic Campus Spots',
      desc: 'Tour the Chapel, 1st Gymnasium, Libraria (library), Learning Commons, and more.',
    },
    {
      title: 'Welcome Examinees & Alumni',
      desc: 'Perfect for prospective students to feel the atmosphere and alumni to reminisce.',
    },
    {
      title: 'Free Souvenir Gifts',
      desc: 'All tour participants receive special commemorative gifts and prizes!',
    },
  ] : [
    {
      title: '在校生がリアルをご案内',
      desc: '清教生自らがツアーガイドとなり、日々の学校生活や魅力的なスポットを楽しく紹介します。',
    },
    {
      title: '充実の学園施設を巡る',
      desc: '第一体育館、チャペル、リブラリア（図書館）、ラーニングコモンズなど見どころ満載です。',
    },
    {
      title: '受験生・卒業生大歓迎',
      desc: '入試を考えている方は学校のリアルな雰囲気を知れ、OB・OGの皆様は想い出の地を巡れます。',
    },
    {
      title: '参加者全員にプレゼント景品',
      desc: 'ツアーにご参加いただいた皆様全員に、嬉しい特製景品をご用意しています。気軽にご参加ください！',
    },
  ];

  return (
    <section id="campus-tour-section" className="py-14 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase">
                CAMPUS TOUR &bull; TIMETABLE SPECIAL
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {language === 'en' ? 'Day 2 Special' : '文化祭2日目限定'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              {language === 'en' ? 'Seikyo Gakuen Campus Tour' : '清教学園ツアー'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {language === 'en' 
                ? 'Join our student-led tour around iconic campus facilities. Free gifts for all participants!' 
                : '在校生が学園内をご案内！第一体育館・チャペル・リブラリアなど人気スポットを巡る特別企画'}
            </p>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('schedule')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 border border-emerald-300 transition-colors cursor-pointer self-start md:self-auto"
            >
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>{language === 'en' ? 'View in Timetable' : 'タイムテーブルで確認する'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div 
              onClick={() => setShowPosterModal(true)}
              className="group relative bg-slate-50 border border-slate-300 p-2 shadow-2xs cursor-pointer overflow-hidden transition-all hover:border-emerald-700 hover:shadow-md"
            >
              <div className="relative w-full aspect-[3/4] max-h-[420px] bg-slate-100 flex items-center justify-center overflow-hidden">
                <PosterImage
                  posterFile="清教学園ツアー.png"
                  posterImage="/SGfes/清教学園ツアー.png"
                  image="/SGfes/清教学園ツアー.png"
                  title="清教学園ツアー"
                  className="w-full h-full object-contain"
                  allowZoom={false}
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 text-slate-900 text-xs font-bold shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-800" />
                    {language === 'en' ? 'Click to Enlarge Poster' : 'ポスターを拡大表示'}
                  </span>
                </div>
              </div>
              <div className="p-2 text-center text-xs text-slate-600 font-medium">
                {language === 'en' ? 'Official Campus Tour Poster (Tap to expand)' : '清教学園ツアー 公式ポスター（タップで拡大）'}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold">
                <Gift className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Participant Bonus Prize' : '参加者全員に景品プレゼント！'}</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {language === 'en'
                  ? 'All participants joining the tour will receive special gifts. Advance registration is not required—just come to the meeting point on time!'
                  : 'ツアーに参加していただいた方には特製景品をご用意しています。事前予約は不要ですので、各回の集合時間に直接集合場所へお越しください！'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FAFBFD] border border-slate-300 p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900">
                    {language === 'en' ? 'Tour Schedule (Day 2: Sep 19)' : '実施タイムテーブル（文化祭2日目・9/19）'}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-600">
                  {language === 'en' ? '3 sessions total' : '全3回実施'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {tourSlots.map((slot, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 shadow-2xs hover:border-emerald-600 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pb-1 border-b border-slate-100">
                      <span className="font-bold text-emerald-800">{slot.round}</span>
                      <span className="text-[10px] text-slate-400">{slot.targetLabel}</span>
                    </div>
                    <div className="text-lg font-serif font-bold text-slate-900 mt-2">
                      {slot.time}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                      <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{slot.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? 'Meeting Location' : '集合場所'}</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">
                    {language === 'en'
                      ? 'In front of the 1st Gymnasium (Signboard set up right past admission reception)'
                      : '第一体育館前（受付を通った場所に「清教学園ツアー」の看板を設置しています）'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en'
                      ? 'Please gather near the signboard 5 minutes before each tour starts.'
                      : '各回開始時刻の5分前までに、看板周辺にお集まりください。'}
                  </p>
                </div>
                {onNavigate && (
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('map')}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-600 underline-offset-4 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Check meeting point on Campus Map' : '校内マップで集合場所を確認'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>{language === 'en' ? 'Tour Highlights' : 'ツアーの見どころ・ポイント'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {highlights.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-[#FAFBFD] border border-slate-200 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
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
                {language === 'en' ? 'Seikyo Gakuen Campus Tour Poster' : '清教学園ツアー ポスター'}
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
                src="/SGfes/清教学園ツアー.png"
                alt="清教学園ツアーポスター"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{language === 'en' ? 'Day 2 (Sep 19) Sessions: 10:00 / 12:00 / 14:00' : '9/19(文化祭2日目) 10:00 / 12:00 / 14:00 集合：第一体育館前'}</span>
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

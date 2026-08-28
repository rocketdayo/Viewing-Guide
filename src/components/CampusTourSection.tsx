import React, { useState } from 'react';
import {
  Compass,
  Clock,
  Gift,
  GraduationCap,
  Users,
  FileText,
  ExternalLink,
  ZoomIn,
  Sparkles,
  MapPin,
  X,
  ChevronRight,
  Info,
  Download,
  Smile
} from 'lucide-react';
import tourPosterPlaceholder from '../assets/images/blood_donation_poster.png';

export const CampusTourSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 10:00~, 12:00~, 14:00~
  const tourSchedules = [
    {
      time: '10:00 〜',
      label: '第1回ツアー',
      badge: '午前の部',
      desc: '文化祭オープニング直後！主要スポットや展示をわくわく巡る朝のコース',
      status: '受付中'
    },
    {
      time: '12:00 〜',
      label: '第2回ツアー',
      badge: '昼の部',
      desc: '模擬店やクラス企画で賑わうピーク時の熱気と一緒に楽しむコース',
      status: '受付中'
    },
    {
      time: '14:00 〜',
      label: '第3回ツアー',
      badge: '午後の部',
      desc: '文化祭のフィナーレに向けてみんなで盛り上がるおすすめコース',
      status: '受付中'
    }
  ];

  return (
    <section
      id="campus-tour-section"
      className="border-b border-teal-200/80 bg-gradient-to-b from-teal-50/60 via-white to-teal-50/40 py-12 sm:py-16 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-teal-200/90 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-teal-100/90 text-teal-900 px-3 py-1 text-xs font-bold font-mono tracking-wider rounded-xs border border-teal-300 shadow-2xs">
              <Compass className="w-4 h-4 text-teal-800" />
              <span>特別案内・みんなで巡るツアー</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center flex-wrap gap-2.5">
              <span>OB・入試希望者向け キャンパスツアー</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                <span>参加特典：特製景品プレゼントあり！</span>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              文化祭の賑やかな見どころや話題の企画を、ガイドと一緒にワイワイ楽しく回るキャンパスツアー！卒業生（OB・OG）の皆様も、受験生・保護者の皆様もお気軽にご参加ください。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <a
              href="./blooddonation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-teal-950 border border-teal-300 text-xs font-bold rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-800" />
              <span>チラシPDFを開く</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4 text-teal-200" />
              <span>チラシを拡大表示</span>
            </button>
          </div>
        </div>

        {/* Highlight Summary Box - Clean Light Palette matching AlumniSection */}
        <div className="bg-white border-2 border-teal-200/90 rounded-xs shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-teal-100 pb-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold border border-teal-200">
                <Smile className="w-3.5 h-3.5 text-amber-600" />
                <span>ガイドと一緒に盛り上がろう！</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
                みんなで回って文化祭を100%楽しむおすすめツアー
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                校内の見どころスポットやおすすめの展示・模擬店をみんなで楽しく巡るガイド付きツアーです。懐かしい学校の雰囲気を感じたい同窓生の方も、学校生活を知りたい受験生・保護者の方も一緒に文化祭を満喫しましょう！
              </p>
            </div>

            {/* Meeting Point Highlight Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-xs border-2 border-amber-300/90 text-slate-800 shrink-0 w-full lg:w-72 shadow-2xs space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 border-b border-amber-200/80 pb-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>ツアー集合場所</span>
              </div>
              <div className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs">必須</span>
                <span className="text-amber-950 font-serif">第一体育館前</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                ※各回開始時刻の5分前までに「第一体育館前」にお集まりください。
              </p>
            </div>
          </div>

          {/* Quick Target Audience Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="bg-teal-50 text-teal-900 px-3 py-1.5 rounded-xs border border-teal-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-teal-700" />
              <strong>OB・卒業生：</strong> 懐かしい校内を仲間と楽しく再発見！
            </span>
            <span className="bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xs border border-emerald-200 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <strong>入試希望者：</strong> 受験生・保護者様も実際の雰囲気を体験！
            </span>
            <span className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xs border border-amber-200 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-700" />
              <strong>豪華特典：</strong> 参加者全員に特製景品プレゼント！
            </span>
          </div>
        </div>

        {/* Schedule & PDF Poster Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: 3 Tour Sessions Detail (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-teal-200/90 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-teal-700" />
                <span>ツアー開催時間（1日3回開催）</span>
              </h3>
              <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded border border-teal-200">
                集合：第一体育館前
              </span>
            </div>

            <div className="space-y-3">
              {tourSchedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 hover:border-teal-300 rounded-xs p-5 shadow-2xs transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded bg-teal-800 text-white font-black text-lg font-mono tracking-tight shadow-2xs">
                        {schedule.time}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          {schedule.label}
                        </span>
                        <span className="text-[11px] text-teal-700 font-medium">
                          {schedule.badge}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      景品あり
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {schedule.desc}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>集合場所：<strong>第一体育館前</strong></span>
                    </span>
                    <span className="text-teal-800 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>予約不要・直接集合ok</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Target Audience & Notice Box */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-xs p-4 sm:p-5 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-teal-950 flex items-center space-x-1.5 text-sm">
                <Info className="w-4 h-4 text-teal-700 shrink-0" />
                <span>ツアーご参加の案内・注意事項</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-800">集合場所：</strong> 各回の出発時刻5分前に<strong>「第一体育館前」</strong>にお集まりください。
                </li>
                <li>
                  <strong className="text-slate-800">対象：</strong> 卒業生（OB・OG）、受験生・中学生・小学生・保護者様をはじめ、どなたでも歓迎です！
                </li>
                <li>
                  <strong className="text-slate-800">景品：</strong> 各回ご参加いただいた方に特製景品・ノベルティをお渡しします。
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: PDF & Flyer Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-teal-200/90 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <span>キャンパスツアー 案内チラシ（縦型PDF）</span>
              </h3>
            </div>

            {/* PDF Vertical Poster Preview Card */}
            <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-2xs space-y-4">
              <div
                onClick={() => setIsModalOpen(true)}
                className="relative cursor-pointer group rounded-xs overflow-hidden border border-slate-200 bg-slate-100 aspect-[1/1.4] flex items-center justify-center shadow-inner"
              >
                {/* Vertical Flyer Image (Currently using vertical PDF placeholder) */}
                <img
                  src={tourPosterPlaceholder}
                  alt="キャンパスツアー 案内チラシ（縦型PDF）"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Overlay with Zoom Button */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
                  <span className="px-4 py-2 bg-white/95 text-slate-900 rounded-xs text-xs font-bold shadow-lg flex items-center space-x-2">
                    <ZoomIn className="w-4 h-4 text-teal-700" />
                    <span>クリックで拡大表示</span>
                  </span>
                </div>

                {/* PDF Badge */}
                <div className="absolute top-2.5 left-2.5 bg-teal-800/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-teal-300" />
                  <span>縦型PDFチラシ</span>
                </div>
              </div>

              {/* PDF Actions */}
              <div className="space-y-2">
                <a
                  href="./blooddonation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xs shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-teal-200" />
                  <span>PDFチラシをダウンロード・表示</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-300" />
                </a>

                <div className="bg-slate-50 p-3 rounded text-[11px] text-slate-500 border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-700 block mb-0.5">💡 チラシデータについて</span>
                  ※チラシは献血ポスターと同じ縦型仕様です。完成版チラシが届き次第、本エリアのデータが順次自動更新されます。
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Poster Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xs max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col border border-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-teal-400" />
                <span className="font-serif font-bold text-sm sm:text-base">
                  キャンパスツアー 案内チラシ（縦型ポスター）
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable Image */}
            <div className="p-4 overflow-y-auto max-h-[75vh] bg-slate-950 flex justify-center">
              <img
                src={tourPosterPlaceholder}
                alt="キャンパスツアー 案内チラシ 拡大画像"
                className="max-w-full h-auto object-contain rounded border border-slate-800"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>※縦型PDFチラシ</span>
              <a
                href="./blooddonation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-teal-700 text-white font-bold rounded-xs flex items-center space-x-1 hover:bg-teal-800 transition-colors"
              >
                <span>PDFを開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

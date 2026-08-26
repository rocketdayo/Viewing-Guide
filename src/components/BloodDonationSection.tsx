import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Calendar,
  MapPin,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Ticket,
  Sparkles,
  ZoomIn,
  AlertCircle,
  X,
  ChevronRight,
  Info,
  Scale,
  Moon,
  Utensils,
  FileText
} from 'lucide-react';
import posterImage from '../assets/images/blood_donation_poster.png';

const TICKET_FORM_URL =
  'https://script.google.com/a/macros/stu.seikyo.ed.jp/s/AKfycbzibdXigUx0B1JDH1bn6yoVuH8Iwm7jDtpJ2SkTD0FEAShLw85YKi7oGOOPBNNQBX-4/exec';

export const BloodDonationSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="blood-donation-section"
      className="border-b border-rose-100/80 bg-gradient-to-b from-rose-50/50 via-white to-slate-50/60 py-12 sm:py-16 scroll-mt-16 transition-opacity duration-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-rose-100 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-800 px-3 py-1 text-xs font-bold font-mono tracking-wider rounded-xs border border-rose-200/80 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
              <span>特別企画・社会貢献</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight flex items-center flex-wrap gap-2.5">
              <span>文化祭 献血</span>
              <span className="text-xs sm:text-sm font-sans font-medium text-rose-700 bg-rose-50/80 border border-rose-200 px-3 py-1 rounded-full">
                食堂前にて実施
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              あなたの行動が、誰かの命を支えます。文化祭当日は食堂前にて献血バスが来校します。混雑緩和のため、オンライン整理券の取得が可能です。
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <a
              href="./blooddonation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs sm:text-sm rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>PDFポスターを開く</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href={TICKET_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100/80 text-rose-800 border border-rose-200 font-bold text-xs sm:text-sm rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-rose-600" />
              <span>オンライン整理券を取得</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
            </a>
          </div>
        </div>

        {/* Online Ticket Gentle Callout Banner */}
        <div className="bg-gradient-to-r from-rose-50/90 via-pink-50/40 to-slate-50 border border-rose-200/70 rounded-xl p-5 sm:p-6 text-slate-800 shadow-2xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-rose-800 border border-rose-200/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>スマートフォンから事前・当日受付</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                オンラインで整理券が取得できます
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                文化祭当日の待ち時間を短縮し、スムーズにご案内できるようオンライン整理券システムを導入しています。下記リンクより整理券を取得いただけます。
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={TICKET_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200/80 font-bold text-sm rounded-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-rose-600" />
                <span>整理券の取得ページへ進む</span>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Poster Visual on Left, Structured Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Poster Image Card with Zoom */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-rose-100/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-rose-500" />
                  案内ポスター
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> タップで拡大
                </button>
              </div>

              {/* Poster Image preview */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in"
              >
                <img
                  src={posterImage}
                  alt="2026年度 文化祭 献血 案内ポスター"
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
                    <ZoomIn className="w-3.5 h-3.5 text-rose-600" />
                    <span>ポスターを拡大</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-medium text-slate-500 hover:text-rose-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>画像をタップすると全画面でポスターを確認できます</span>
                </button>
              </div>
            </div>

            {/* Poster Slogan Card */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-xs text-slate-700 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-800">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
                あなたの行動が、誰かの命を支えます
              </p>
              <p className="text-slate-600">
                献血は、今できる身近な社会貢献です。特別な準備や知識は必要ありません。少しの時間で、多くの人の助けになります。
              </p>
            </div>
          </div>

          {/* Right Column: Structured Overview, Criteria, Requirements, and Notes */}
          <div className="lg:col-span-7 space-y-5">
            {/* Quick Info Grid (Date & Location) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>実施日時</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  文化祭当日
                </div>
                <p className="text-xs text-slate-500">
                  各日程の開催時間中に食堂前にて実施
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>実施場所</span>
                </div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>食堂前</span>
                  <span className="text-xs font-normal text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    献血バス
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  キャンパス内 食堂入口前の専用スペース
                </p>
              </div>
            </div>

            {/* Criteria & Requirements Card */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>参加基準・準備</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs">
                  健康・安全基準
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Info className="w-3.5 h-3.5 text-rose-500" />
                    <span>年齢</span>
                  </div>
                  <div className="text-slate-900 font-bold text-sm">
                    16歳以上
                  </div>
                  <div className="text-[11px] text-rose-700 font-medium">
                    ※ 15歳の方はご参加いただけません
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Scale className="w-3.5 h-3.5 text-rose-500" />
                    <span>体重</span>
                  </div>
                  <div className="text-slate-900 font-bold text-sm">
                    男性 45kg以上 / 女性 40kg以上
                  </div>
                  <div className="text-[11px] text-slate-500">
                    安全基準を満たしている必要があります
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Moon className="w-3.5 h-3.5 text-rose-500" />
                    <span>睡眠</span>
                  </div>
                  <div className="text-slate-900 font-bold text-sm">
                    前日 5時間以上
                  </div>
                  <div className="text-[11px] text-slate-500">
                    十分な睡眠をとってお越しください
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Utensils className="w-3.5 h-3.5 text-rose-500" />
                    <span>食事</span>
                  </div>
                  <div className="text-slate-900 font-bold text-sm">
                    当日の朝・昼食を摂取
                  </div>
                  <div className="text-[11px] text-slate-500">
                    空腹状態での献血はできません
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes & Warnings Card */}
            <div className="bg-amber-50/40 rounded-xl p-5 sm:p-6 border border-amber-200/60 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm sm:text-base border-b border-amber-200/50 pb-3">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>重要注意事項</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-amber-200/50">
                  <div className="p-2 bg-amber-100/70 text-amber-800 rounded-md shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">
                      保護者承諾書が必要です
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      未成年（高校生）の方の献血には、所定の保護者同意・承諾書が必要となります。事前にご確認をお願いいたします。
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-rose-100">
                  <div className="p-2 bg-rose-50 text-rose-700 rounded-md shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">
                      運動部の方は献血後、部活動に参加できません
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      献血後の激しい運動は体調不良の原因となるため、当日の部活動やハードな運動への参加はお控えください。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Ticket Link Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-mono text-rose-700 font-semibold tracking-wider">
                  ONLINE TICKET / 整理券受付
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  スムーズなご案内のため整理券をご活用ください
                </div>
                <div className="text-xs text-slate-500">
                  Google Workspace 連携フォームより取得いただけます
                </div>
              </div>

              <a
                href={TICKET_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100/90 text-rose-800 border border-rose-200 font-bold text-xs sm:text-sm rounded-xs transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <Ticket className="w-4 h-4 text-rose-600" />
                <span>整理券を取得する</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal for High-Resolution Poster Viewing */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 text-slate-900">
              <div className="flex items-center space-x-2.5">
                <span className="bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-2 py-0.5 rounded-xs">
                  献血案内ポスター
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-md">
                  2026年度 文化祭 献血（食堂前）
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto bg-slate-100/50 p-2 sm:p-4 flex items-center justify-center">
              <img
                src={posterImage}
                alt="2026年度 文化祭 献血 ポスター拡大"
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-sm border border-slate-200"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                場所：食堂前（文化祭当日）
              </span>

              <div className="flex items-center gap-2">
                <a
                  href="./blooddonation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>PDFを開く</span>
                </a>
                <a
                  href={TICKET_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5 text-rose-600" />
                  <span>整理券を取得</span>
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xs transition-colors cursor-pointer"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


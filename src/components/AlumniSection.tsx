import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  UtensilsCrossed,
  MapPin,
  Clock,
  Maximize2,
  Download,
  ExternalLink,
  Info,
  X,
  ZoomIn,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CAREER_GUIDE_BASE64,
  GOURMET_BASE64,
  CLASS_REUNION_PDF_BASE64,
} from '../assets/alumniData';
import { useI18n } from '../utils/i18n';

interface AlumniSectionProps {
  onOpenClassDetail?: (projectId: string) => void;
}

export const AlumniSection: React.FC<AlumniSectionProps> = () => {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'both' | 'career' | 'gourmet'>('both');
  const [modalPage, setModalPage] = useState<1 | 2 | null>(null);

  const pdfUrl = CLASS_REUNION_PDF_BASE64;

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const byteCharacters = atob(CLASS_REUNION_PDF_BASE64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      window.open(CLASS_REUNION_PDF_BASE64, '_blank');
    }
  };

  const careerData = {
    pageNumber: 1,
    id: 'career',
    title: language === 'en' ? 'Ask Alumni! Future Career Guidebook' : '先輩に聞こう！未来の仕事図鑑',
    subheading: language === 'en' ? '~From this classroom to individual futures~' : '～この教室からそれぞれの未来へ～',
    catchphrase: language === 'en' 
      ? 'Hear directly from graduates about university life and real-world career paths!' 
      : '清教学園を卒業した先輩方から進学・仕事のリアルな話を個別で聞けます！',
    date: language === 'en' ? 'Sep 19, 2026 (Sat)' : '2026年9月19日(土)',
    timeSlot: language === 'en' ? '①10:00-12:00 / ②12:30-14:30' : '①10:00〜12:00 / ②12:30〜14:30',
    location: language === 'en' ? 'Main Bldg 3rd Year E, F, G Classrooms' : '本館 高3E・F・G教室',
    organizer: language === 'en' ? 'Seikyo Gakuen Alumni Association' : '清教学園同窓会（清教会）',
    target: language === 'en' ? 'High School & JHS Students, Parents, Visitors' : '高校生・中学生・保護者・一般来場者',
    imageSrc: CAREER_GUIDE_BASE64,
    features: language === 'en' ? [
      'Many alumni working on the frontlines will visit and advise',
      'Consult one-on-one about university majors and careers',
      'Scan the on-site QR code for the complete roster of participating alumni',
    ] : [
      '第一線で活躍する清教OB・OGが多数来校',
      '大学生活・学問・職業のリアルを個別ブースでじっくり相談',
      '参加先輩の職業一覧は会場内QRコードから即時確認可能',
    ],
  };

  const gourmetData = {
    pageNumber: 2,
    id: 'gourmet',
    title: language === 'en' ? 'Taste Alumni Gourmet Treats!' : '先輩グルメを食べつくせ！',
    subheading: language === 'en' ? '~Find your favorite gourmet specialty~' : '～あなたの推しグルメ、見つけよう～',
    catchphrase: language === 'en'
      ? 'Delicious food stalls operated by our esteemed graduates!'
      : '清教学園を卒業した先輩方が出店！美味しい推しグルメを販売しています(^^♪',
    date: language === 'en' ? 'Sep 19, 2026 (Sat)' : '2026年9月19日(土)',
    timeSlot: '10:00〜14:30',
    location: language === 'en' ? 'In front of Campus & International Exchange Room' : '清教キャンパス前 ＆ 国際交流室前',
    organizer: language === 'en' ? 'Seikyo Gakuen Alumni Association' : '清教学園同窓会（清教会）',
    target: language === 'en' ? 'All visitors, students, and parents' : '高校生・一般来場者・保護者・在校生',
    imageSrc: GOURMET_BASE64,
    menuItems: language === 'en' ? [
      'Sausages',
      'Waffles',
      'Coffee',
      'S’mores',
      'Naan & Curry',
      'Cotton Candy',
      'Rice Balls (Onigiri)',
      'Various snacks & treats',
    ] : [
      'ウインナー',
      'ワッフル',
      'コーヒー',
      'スモア',
      'ナンカレー',
      '綿菓子',
      'おにぎり',
      'その他各種お惣菜',
    ],
    features: language === 'en' ? [
      'Special gourmet market cooked and served by graduates',
      'Diverse delicious menu including naan curry, s’mores, and fresh waffles',
      'Located across two convenient campus outdoor spots',
    ] : [
      '卒業生の先輩方が腕を振るう特設グルメマーケット',
      'ナンカレー・スモア・焼きたてワッフルなど多彩なメニュー',
      'キャンパス前と国際交流室前の2箇所で展開',
    ],
  };

  return (
    <section id="alumni-section" className="border-b border-amber-200/90 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/50 py-12 sm:py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-200/90 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-100/90 text-amber-900 px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider rounded-xs border border-amber-300 shadow-2xs">
              <GraduationCap className="w-4 h-4 text-amber-800" />
              <span>{language === 'en' ? 'Alumni Association Special Features' : '清教学園同窓会（清教会）特別企画'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {t.alumniTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.alumniSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <a
              href={pdfUrl}
              download="清教学園同窓会_特別企画案内.pdf"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-amber-950 border border-amber-300 text-xs font-bold rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-800" />
              <span>{language === 'en' ? 'Download Flyer PDF' : 'チラシPDFを保存'}</span>
            </a>
            <button
              onClick={handleOpenPdf}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xs shadow-2xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{language === 'en' ? 'Open in New Tab' : '別タブで開く'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-amber-100/60 p-1.5 rounded-xs border border-amber-200 max-w-xl">
          <button
            onClick={() => setActiveTab('both')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'both'
                ? 'bg-white text-amber-950 shadow-2xs border border-amber-300'
                : 'text-amber-900/80 hover:text-amber-950 hover:bg-white/50'
            }`}
          >
            <span>{language === 'en' ? '📑 View Both Events' : '📑 2企画を並べて見る'}</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'career'
                ? 'bg-white text-amber-950 shadow-2xs border border-amber-300'
                : 'text-amber-900/80 hover:text-amber-950 hover:bg-white/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-700" />
            <span>{language === 'en' ? '① Career Guide' : '① 未来の仕事図鑑'}</span>
          </button>
          <button
            onClick={() => setActiveTab('gourmet')}
            className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'gourmet'
                ? 'bg-white text-amber-950 shadow-2xs border border-amber-300'
                : 'text-amber-900/80 hover:text-amber-950 hover:bg-white/50'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-700" />
            <span>{language === 'en' ? '② Alumni Gourmet' : '② 先輩グルメ'}</span>
          </button>
        </div>

        <div className={`grid gap-8 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          
          {(activeTab === 'both' || activeTab === 'career') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-2 border-sky-200/90 rounded-xs shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 border-b border-sky-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xs">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-sky-800 tracking-wider">
                        {language === 'en' ? 'Alumni Feature 1' : '同窓会 企画 1'}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {careerData.title}
                      </h3>
                    </div>
                  </div>
                  <span className="bg-sky-100 text-sky-900 text-xs font-bold font-mono px-2.5 py-1 rounded-xs border border-sky-200">
                    {language === 'en' ? 'Career & Guidance' : '進路・相談'}
                  </span>
                </div>

                <p className="text-xs font-bold text-sky-800 bg-sky-50/70 p-2.5 rounded-xs border border-sky-100">
                  {careerData.subheading} {careerData.catchphrase}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>{language === 'en' ? 'Time: ' : '時間：'}</strong>{careerData.timeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span><strong>{language === 'en' ? 'Location: ' : '場所：'}</strong>{careerData.location}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{language === 'en' ? 'Official Flyer' : '案内チラシ'}</span>
                    <span className="text-sky-700 font-bold flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> {language === 'en' ? 'Tap to Zoom' : 'タップで拡大'}
                    </span>
                  </div>
                  
                  <div
                    onClick={() => setModalPage(1)}
                    className="relative group cursor-pointer overflow-hidden border border-slate-300 rounded-xs bg-slate-100 shadow-inner"
                  >
                    <img
                      src={careerData.imageSrc}
                      alt={careerData.title}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-4 py-2 bg-slate-900/85 text-white text-xs font-bold rounded-xs shadow-md flex items-center gap-2 backdrop-blur-xs">
                        <Maximize2 className="w-4 h-4 text-amber-400" />
                        {language === 'en' ? 'View High-Res Fullscreen' : '全画面で高画質拡大表示'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    {language === 'en' ? 'Highlights:' : '企画のポイント：'}
                  </span>
                  {careerData.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-sky-50/50 border-t border-sky-100 flex items-center justify-between">
                <span className="text-xs text-sky-900 font-medium">
                  {language === 'en' ? 'Organizer: ' : '主催：'}{careerData.organizer}
                </span>
                <button
                  onClick={() => setModalPage(1)}
                  className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Enlarge Flyer' : 'チラシを拡大表示'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {(activeTab === 'both' || activeTab === 'gourmet') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white border-2 border-orange-200/90 rounded-xs shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 border-b border-orange-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xs">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-orange-800 tracking-wider">
                        {language === 'en' ? 'Alumni Feature 2' : '同窓会 企画 2'}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {gourmetData.title}
                      </h3>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-900 text-xs font-bold font-mono px-2.5 py-1 rounded-xs border border-orange-200">
                    {language === 'en' ? 'Special Gourmet' : '特設グルメ'}
                  </span>
                </div>

                <p className="text-xs font-bold text-orange-800 bg-orange-50/70 p-2.5 rounded-xs border border-orange-100">
                  {gourmetData.subheading} {gourmetData.catchphrase}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>{language === 'en' ? 'Time: ' : '時間：'}</strong>{gourmetData.timeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span><strong>{language === 'en' ? 'Location: ' : '場所：'}</strong>{gourmetData.location}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">{language === 'en' ? 'Official Flyer' : '案内チラシ'}</span>
                    <span className="text-orange-700 font-bold flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> {language === 'en' ? 'Tap to Zoom' : 'タップで拡大'}
                    </span>
                  </div>
                  
                  <div
                    onClick={() => setModalPage(2)}
                    className="relative group cursor-pointer overflow-hidden border border-slate-300 rounded-xs bg-slate-100 shadow-inner"
                  >
                    <img
                      src={gourmetData.imageSrc}
                      alt={gourmetData.title}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-4 py-2 bg-slate-900/85 text-white text-xs font-bold rounded-xs shadow-md flex items-center gap-2 backdrop-blur-xs">
                        <Maximize2 className="w-4 h-4 text-amber-400" />
                        {language === 'en' ? 'View High-Res Fullscreen' : '全画面で高画質拡大表示'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    {language === 'en' ? '🍴 Food & Menu Items:' : '🍴 販売メニュー・商品：'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gourmetData.menuItems.map((item, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-xs bg-orange-50 text-orange-950 px-2.5 py-1 rounded-full border border-orange-200 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between">
                <span className="text-xs text-orange-900 font-medium">
                  {language === 'en' ? 'Organizer: ' : '主催：'}{gourmetData.organizer}
                </span>
                <button
                  onClick={() => setModalPage(2)}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Enlarge Flyer' : 'チラシを拡大表示'}</span>
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      <AnimatePresence>
        {modalPage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col justify-between p-2 sm:p-6 overflow-y-auto"
            onClick={() => setModalPage(null)}
          >
            <div
              className="flex items-center justify-between text-white max-w-5xl mx-auto w-full py-2 px-3 bg-slate-900/80 rounded-xs border border-slate-700 mb-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-xs">
                  {modalPage === 1 ? (language === 'en' ? 'Feature 1' : '企画 1') : (language === 'en' ? 'Feature 2' : '企画 2')}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {modalPage === 1 ? careerData.title : gourmetData.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setModalPage(1)}
                  className={`px-2.5 py-1 rounded-xs text-xs font-bold cursor-pointer transition-colors ${
                    modalPage === 1 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'en' ? '1. Careers' : '1. 仕事図鑑'}
                </button>
                <button
                  onClick={() => setModalPage(2)}
                  className={`px-2.5 py-1 rounded-xs text-xs font-bold cursor-pointer transition-colors ${
                    modalPage === 2 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {language === 'en' ? '2. Gourmet' : '2. 先輩グルメ'}
                </button>

                <a
                  href={pdfUrl}
                  download="清教学園同窓会_特別企画案内.pdf"
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xs transition-colors"
                  title="PDF"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setModalPage(null)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xs transition-colors cursor-pointer"
                  title={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              className="max-w-5xl mx-auto w-full my-auto flex items-center justify-center p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalPage === 1 ? careerData.imageSrc : gourmetData.imageSrc}
                alt={modalPage === 1 ? careerData.title : gourmetData.title}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-xs shadow-2xl border border-slate-700 bg-white"
              />
            </div>

            <div
              className="text-center text-xs text-slate-400 max-w-5xl mx-auto w-full py-2 bg-slate-900/80 rounded-xs border border-slate-700 mt-2 shrink-0 flex flex-col sm:flex-row items-center justify-between px-4 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2 text-slate-300">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {modalPage === 1
                    ? (language === 'en' ? 'Sep 19 (Sat) ①10:00-12:00 / ②12:30-14:30 (Main Bldg 3F)' : '9月19日(土) ①10:00〜12:00 / ②12:30〜14:30（本館 高3E・F・G教室）')
                    : (language === 'en' ? 'Sep 19 (Sat) 10:00-14:30 (In front of Campus & Int. Room)' : '9月19日(土) 10:00〜14:30（清教キャンパス前＆国際交流室前）')}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleOpenPdf}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Open PDF Flyer' : 'チラシPDFを開く'}
                </button>
                <button
                  onClick={() => setModalPage(null)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xs text-xs font-bold cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

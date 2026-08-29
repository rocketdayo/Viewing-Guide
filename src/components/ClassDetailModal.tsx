import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Ticket, 
  Sparkles, 
  Layers, 
  Info,
  ExternalLink,
  QrCode,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassProject, CongestionLevel } from '../types';
import { useI18n, translateCategory, translateBuilding, translateGrade } from '../utils/i18n';

interface ClassDetailModalProps {
  project: ClassProject | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onNavigateToCongestion: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  project,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onNavigateToCongestion,
}) => {
  const { language, t } = useI18n();
  const [copied, setCopied] = useState(false);

  const isOnlineTicketClass = project
    ? ['p-1b', 'p-1d', 'p-2a', 'p-2d', 'p-2e', 'p-2j'].includes(project.id) || 
      Boolean(project.onlineTicketUrl || project.onlineTicketNote)
    : false;

  const handleShare = () => {
    if (project && navigator.clipboard) {
      navigator.clipboard.writeText(
        `【2026 Seikyo Festival】${project.classNumber} "${project.title}"\n${project.catchphrase}\n${t.detailLocation}: ${project.location}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderCongestionBadge = (level: CongestionLevel, waitTime: number) => {
    switch (level) {
      case 'smooth':
        return (
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.statusSmooth} ({t.waitTime}: {waitTime}{t.minutes})</span>
          </div>
        );
      case 'moderate':
        return (
          <div className="flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{t.statusModerate} ({t.waitTime}: {waitTime}{t.minutes})</span>
          </div>
        );
      case 'crowded':
        return (
          <div className="flex items-center space-x-2 bg-rose-50 text-rose-800 border border-rose-200 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce"></span>
            <span>{t.statusCrowded} ({t.waitTime}: {waitTime}{t.minutes})</span>
          </div>
        );
      case 'ticket':
        return (
          <div className="flex items-center space-x-2 bg-purple-50 text-purple-800 border border-purple-200 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-bold">
            <Ticket className="w-4 h-4 text-purple-600" />
            <span>{t.detailOnlineTicketNotice}</span>
          </div>
        );
      case 'closed':
        return (
          <div className="flex items-center space-x-2 bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xs text-xs sm:text-sm font-bold">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            <span>{t.statusClosed}</span>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          id="class-detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="class-detail-modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xs shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
          >
            <div className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 max-w-[85%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-white text-emerald-950 font-black px-2.5 py-0.5 rounded-lg text-xs sm:text-sm tracking-wide shadow-xs">
                      {project.classNumber}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-md font-medium">
                      {translateGrade(project.grade, language)}
                    </span>
                    <span className="bg-sky-500/80 text-white text-xs px-2.5 py-0.5 rounded-md font-medium">
                      {translateCategory(project.category, language)}
                    </span>
                    {isOnlineTicketClass && (
                      <span className="bg-purple-500 text-white text-xs px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 shadow-xs">
                        <Ticket className="w-3.5 h-3.5" />
                        {language === 'en' ? 'Digital Ticket' : 'オンライン整理券対象'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                    {project.title}
                  </h2>
                </div>
                <button
                  id="close-class-detail-btn"
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sky-200 text-xs sm:text-sm mt-3 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{project.catchphrase}</span>
              </p>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
              {isOnlineTicketClass && (
                <div className="p-4 rounded-xs bg-gradient-to-r from-purple-900 to-emerald-900 text-white shadow-md border border-purple-700/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <QrCode className="w-3 h-3" /> Online Ticket
                        </span>
                        <span className="text-xs font-bold text-purple-200">
                          {language === 'en' ? 'Digital Queue Ticket' : 'オンライン整理券受付'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {language === 'en' ? 'Digital tickets available for this project' : 'この企画はオンライン整理券を発行してご参加いただけます'}
                      </h4>
                      <p className="text-xs text-purple-100/90 leading-relaxed mt-1">
                        {project.onlineTicketNote || (language === 'en' ? 'Digital time slots are implemented to reduce wait times.' : '混雑緩和のため、オンライン整理券による時間帯指定入場を実施しています。')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-purple-700/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[11px] text-purple-200 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-purple-300" />
                      <span>{language === 'en' ? 'Proceed to ticket reservation to pick a time slot' : '整理券の取得画面へ進んで時間枠をご選択ください'}</span>
                    </div>
                    {project.onlineTicketUrl ? (
                      <a
                        href={project.onlineTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xs bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>{t.detailGetOnlineTicket}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xs bg-purple-800/80 text-purple-200 text-xs font-medium border border-purple-600/40">
                        <Ticket className="w-3.5 h-3.5 text-purple-300" />
                        <span>{language === 'en' ? 'Ticket system coming soon' : '整理券システム準備中（順次受付開始）'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xs bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'en' ? 'Current Wait Time & Status' : '現在の待ち時間・混雑状況'}
                  </span>
                  {renderCongestionBadge(project.congestion.level, project.congestion.waitTimeMinutes)}
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCongestion();
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xs border border-emerald-200 transition-colors shrink-0 cursor-pointer"
                >
                  {t.liveCongestionMonitor} →
                </button>
              </div>

              {(project.congestion.detailNote || project.congestion.statusNote) && (
                <div className="p-3.5 rounded-xs bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-amber-800">
                    <Info className="w-3.5 h-3.5" /> {language === 'en' ? 'Latest Notice from Class' : 'クラスからの最新連絡'}
                  </span>
                  <p className="leading-relaxed">
                    {project.congestion.detailNote || project.congestion.statusNote}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xs border border-slate-200/80">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-bold text-slate-800">{translateBuilding(project.building, language)}</span>
                <span>・</span>
                <span>{project.floor}</span>
                <span>（{project.location}）</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  {language === 'en' ? 'Project Overview' : '企画概要・アピールポイント'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xs border border-slate-200 shadow-2xs whitespace-pre-line">
                  {project.fullDetails || project.description}
                </p>
              </div>

              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {language === 'en' ? 'Highlights' : '見どころ・特徴'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xs bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.rules && project.rules.length > 0 && (
                <div className="p-4 rounded-xs bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-1">{t.detailRules}</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {project.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleBookmark(project.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xs text-xs font-bold transition-colors cursor-pointer border ${
                    isBookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isBookmarked ? t.detailBookmarkRemove : t.detailBookmarkAdd}</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xs bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={t.detailShare}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? t.detailCopied : t.detailShare}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

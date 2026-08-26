import React from 'react';
import { 
  X, 
  Layers, 
  Calendar, 
  MessageSquare, 
  Activity, 
  MapPin, 
  Shield, 
  ChevronRight,
  BookOpen,
  GraduationCap,
  Radio,
  Megaphone,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppDataState } from '../types';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
  appData: AppDataState;
  onNavigate: (page: string, anchor?: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  appData,
  onNavigate,
  onSelectProject,
}) => {
  if (!isOpen) return null;

  const handleJump = (page: string, anchor?: string) => {
    onNavigate(page, anchor);
    onClose();
  };

  const handleProjectClick = (projectId: string) => {
    onSelectProject(projectId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        id="toc-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          id="toc-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xs shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xs">
                <BookOpen className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">2026清教学園文化祭 ガイド目次</h2>
                <p className="text-xs text-sky-200">各ページ・各クラス企画へダイレクトに移動できます</p>
              </div>
            </div>
            <button
              id="close-toc-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => handleJump('home', 'greetings-section')}
                className="p-4 rounded-xs border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>各ご挨拶（学校長・生徒会・実行委員長）</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">文化祭開催にあたってのメッセージとテーマ発表</p>
              </div>

              <div 
                onClick={() => handleJump('schedule')}
                className="p-4 rounded-xs border border-sky-100 bg-sky-50/50 hover:bg-sky-100/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-sky-900 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>タイムテーブル・ステージ</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">各ステージの公演タイムテーブル（制作中）</p>
              </div>

              <div 
                onClick={() => handleJump('classes')}
                className="p-4 rounded-xs border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>全クラス企画一覧（{appData?.projects?.length || 0}企画）</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">高1（10クラス）・高2（11クラス）・クラブ企画詳細</p>
              </div>

              <div 
                onClick={() => handleJump('congestion')}
                className="p-4 rounded-xs border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>リアルタイム混雑状況</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">各教室からの最新の待機時間と混雑度</p>
              </div>

              <div 
                onClick={() => handleJump('map')}
                className="p-4 rounded-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>校内マップ・フロア案内</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">本館・新館・特別棟・チャペル・体育館の場所確認</p>
              </div>

              <div 
                onClick={() => {
                  onClose();
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('announcements-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="p-4 rounded-xs border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
                    <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span>お知らせ・緊急速報 配信サービス</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-emerald-900/80">本部からの最新アナウンス・プログラム変更の速報</p>
              </div>

              <div 
                onClick={() => {
                  onClose();
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('alumni-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="p-4 rounded-xs border border-amber-300 bg-amber-50/70 hover:bg-amber-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-amber-950 font-bold text-sm">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                    <span>清教学園同窓会 特別企画</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-amber-900/80">特設案内：『未来の仕事図鑑』＆『先輩グルメ』</p>
              </div>

              <div 
                onClick={() => {
                  onClose();
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('blood-donation-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="p-4 rounded-xs border border-rose-300 bg-rose-50/70 hover:bg-rose-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center space-x-2 text-rose-950 font-bold text-sm">
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
                    <span>文化祭 献血（食堂前）</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-rose-900/80">食堂前にて実施・オンライン整理券受付中</p>
              </div>
            </div>

            {/* Quick Jump to Class Projects by Grade */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                クラス企画へのクイックアクセス
              </h3>
              
              <div className="space-y-3">
                {['1年', '2年'].map((grade) => {
                  const gradeProjects = appData?.projects?.filter((p) => p.grade === grade) || [];
                  if (gradeProjects.length === 0) return null;
                  return (
                    <div key={grade} className="rounded-xs p-3.5 border bg-slate-50 border-slate-200/70">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>高校 {grade}</span>
                        <span className="text-[11px] text-slate-500 font-normal">{gradeProjects.length} 企画</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {gradeProjects.map((proj) => (
                          <button
                            key={proj.id}
                            onClick={() => handleProjectClick(proj.id)}
                            className="px-2.5 py-1.5 rounded-xs border text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                          >
                            <span className="font-bold text-emerald-900">{proj.classNumber}</span>
                            <span className="text-slate-600 max-w-[140px] truncate">{proj.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>清教学園高等学校 文化祭 2026</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xs bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

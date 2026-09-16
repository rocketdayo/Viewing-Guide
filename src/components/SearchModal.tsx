import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Layers, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppDataState } from '../types';
import { useI18n } from '../utils/i18n';
import { matchProjectSearch } from '../utils/classSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppDataState;
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: string, anchor?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  appData,
  onSelectProject,
  onNavigate,
}) => {
  const { language, t } = useI18n();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        projects: [],
        schedules: [],
        greetings: [],
        specialEvents: []
      };
    }
    const q = query.toLowerCase().trim();

    const matchedProjects = (appData?.projects || []).filter((p) =>
      matchProjectSearch(p, query)
    );

    const matchedSchedules = (appData?.schedules || []).filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.performer.toLowerCase().includes(q) ||
        s.venue.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q)) ||
        (s.stagePosition && s.stagePosition.toLowerCase().includes(q)) ||
        (s.locationDetail && s.locationDetail.toLowerCase().includes(q))
    );

    const matchedGreetings = (appData?.greetings || []).filter(
      (g) =>
        g.role.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.themeTitle.toLowerCase().includes(q) ||
        g.message.toLowerCase().includes(q)
    );

    const specialEvents = [];
    if ('同窓会 清教会 未来の仕事図鑑 先輩グルメ 盲導犬 日本ライトハウス 訓練所 グッズ 先輩 卒業生 フライヤー チラシ alumni guide dog'.toLowerCase().includes(q) || q.includes('同窓会') || q.includes('alumni') || q.includes('清教') || q.includes('グルメ') || q.includes('仕事図鑑') || q.includes('盲導犬') || q.includes('ライトハウス') || q.includes('dog')) {
      specialEvents.push({
        id: 'special-alumni',
        title: language === 'en' ? 'Alumni Special Events & Guide Dog Booth' : '清教学園同窓会 特別企画 ＆ 盲導犬訓練所',
        desc: language === 'en' ? 'Career Guide, Alumni Gourmet & Nippon Lighthouse Guide Dog Center' : '『未来の仕事図鑑』・『先輩グルメ』＆『日本ライトハウス盲導犬訓練所』特設案内',
        tag: language === 'en' ? 'Alumni' : '同窓会企画',
        targetId: 'alumni-section'
      });
    }

    return {
      projects: matchedProjects,
      schedules: matchedSchedules,
      greetings: matchedGreetings,
      specialEvents
    };
  }, [query, appData, language]);

  const totalResults =
    (searchResults?.projects?.length || 0) +
    (searchResults?.schedules?.length || 0) +
    (searchResults?.greetings?.length || 0) +
    (searchResults?.specialEvents?.length || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="search-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-3 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="search-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xs shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200"
          >
            <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50/80">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                id="search-input-field"
                type="text"
                placeholder={language === 'en' ? 'Search projects, classes, stage schedules...' : '企画名、クラス、演劇、お化け屋敷、吹奏楽、スケジュール等...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  {language === 'en' ? 'Clear' : 'クリア'}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xs text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto max-h-[65vh] space-y-5">
              {!query.trim() ? (
                <div className="py-8 text-center text-slate-400 space-y-3">
                  <Search className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs sm:text-sm">
                    {language === 'en' ? 'Type keywords to search projects, stages, and events' : 'キーワードを入力して企画やスケジュールを検索できます'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                    <span className="text-[11px] text-slate-400">{language === 'en' ? 'Popular searches:' : '人気の検索ワード:'}</span>
                    {(language === 'en' ? ['Drama', 'Haunted House', 'Brass Band', 'Cafe', 'Dance', 'VR'] : ['演劇', 'お化け屋敷', '吹奏楽部', 'カフェ', 'ダンス', 'VR']).map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : totalResults === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-bold text-slate-600">
                    {language === 'en' ? `No results found for "${query}"` : `「${query}」に一致する結果は見つかりませんでした`}
                  </p>
                  <p className="text-xs">
                    {language === 'en' ? 'Please try searching with different keywords.' : '別のキーワードやひらがな・漢字を変えてお試しください。'}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {searchResults.specialEvents && searchResults.specialEvents.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-rose-600" /> {language === 'en' ? 'Special Events' : '特設・特別企画'} ({searchResults.specialEvents.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.specialEvents.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              document.body.style.overflow = '';
                              onNavigate('home', item.targetId);
                              onClose();
                            }}
                            className="p-3 rounded-xs bg-rose-50/40 hover:bg-rose-50 border border-rose-200/80 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-md">
                                  {item.tag}
                                </span>
                                <span className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                                  {item.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">
                                {item.desc}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(searchResults?.projects || []).length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" /> {t.navClasses} ({searchResults.projects.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.projects.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectProject(p.id);
                              onClose();
                            }}
                            className="p-3 rounded-xs bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  {p.classNumber}
                                </span>
                                <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                  {p.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">{p.catchphrase}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(searchResults?.schedules || []).length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" /> {t.navSchedule} ({searchResults.schedules.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.schedules.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => {
                              onNavigate('schedule', s.id);
                              onClose();
                            }}
                            className="p-3 rounded-xs bg-white hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-200 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md">
                                  {s.day} {s.startTime}〜{s.endTime}
                                </span>
                                <span className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                                  {s.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {language === 'en' ? 'Performer:' : '出演:'} {s.performer} | 📍 {s.venue} {s.locationDetail ? `(${s.locationDetail})` : ''}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(searchResults?.greetings || []).length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600" /> {language === 'en' ? 'Greetings' : 'ご挨拶・寄稿'} ({searchResults.greetings.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.greetings.map((g) => (
                          <div
                            key={g.id}
                            onClick={() => {
                              document.body.style.overflow = '';
                              onNavigate('home', 'greetings-section');
                              onClose();
                            }}
                            className="p-3 rounded-xs bg-white hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md">
                                  {g.role}
                                </span>
                                <span className="text-sm font-bold text-slate-800">
                                  {g.name}「{g.themeTitle}」
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{g.message}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

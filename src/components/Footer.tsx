import React from 'react';
import { MapPin, ShieldCheck, ChevronUp, ListTree, HelpCircle, Globe } from 'lucide-react';
import { AppDataState } from '../types';
import { LogoBadge } from './LogoBadge';
import { useI18n } from '../utils/i18n';

interface FooterProps {
  appData?: AppDataState;
  onNavigate?: (page: string) => void;
  onOpenToc?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ appData, onNavigate, onOpenToc }) => {
  const { language, toggleLanguage, t } = useI18n();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <LogoBadge className="w-10 h-10" size={40} />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {appData?.festivalTitle || '2026 清教学園 中高合同文化祭 SG fes'}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {appData?.festivalTheme ? `テーマ「${appData.festivalTheme.replace(/^「|」$/g, '')}」` : t.guideTitle}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {language === 'en' 
                ? 'Seikyo Gakuen High School Culture Festival 2026. Enjoy student stage performances, innovative classroom exhibitions, food stalls, and real-time waiting times.'
                : '中高総勢1,700名を超える生徒たちが合同で創り上げる学園の一大イベント。テーマ「清教エナジー！～1度しかない学園生活を楽しもう～」のもと、生徒たちの自主性とエネルギーがあふれる各企画・展示をどうぞお楽しみください。'}
            </p>
            <div className="text-xs text-slate-400 pt-1 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{language === 'en' ? '380-1 Suehirocho, Kawachinagano, Osaka (10 min walk from Kawachinagano Station)' : '大阪府河内長野市末広町380-1（南海高野線・近鉄長野線 河内長野駅より徒歩約10分）'}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Quick Links' : 'ページ案内'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {onNavigate && (
                <>
                  <li>
                    <button
                      onClick={() => onNavigate('home')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {t.navHome} ({language === 'en' ? 'Greetings & News' : 'ご挨拶・速報'})
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('schedule')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {t.navSchedule}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('classes')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {t.navClasses} ({appData?.projects?.length || 21} {language === 'en' ? 'projects' : '企画'})
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('congestion')}
                      className="hover:text-white text-emerald-400 font-bold transition-colors cursor-pointer"
                    >
                      {t.navCongestion}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('map')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {t.navMap}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('faq')}
                      className="hover:text-teal-300 text-teal-400 font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{t.navFaq}</span>
                    </button>
                  </li>
                </>
              )}
              {onOpenToc && (
                <li>
                  <button
                    onClick={onOpenToc}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-emerald-400 cursor-pointer"
                  >
                    <ListTree className="w-3.5 h-3.5" />
                    <span>{t.navToc}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Etiquette & Guidelines' : '来場者マナー＆重要事項'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'en'
                ? 'Campus is strictly indoor shoes only (please bring slippers & shoe bags). Strictly non-smoking. Please respect the privacy of all students & visitors by avoiding social media photo/video posts.'
                : '校内は原則土足禁止です（スリッパ・上履き・靴袋をご持参ください）。敷地内全面禁煙。生徒・来場者のプライバシー保護のためSNSへの写真・動画投稿はお控えください。'}
            </p>
            
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Language / 言語切替: {language === 'ja' ? 'English' : '日本語'}</span>
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.navAdmin}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Seikyo Gakuen High School Culture Festival. All Rights Reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>{language === 'en' ? 'Back to top' : 'ページ上部へ戻る'}</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

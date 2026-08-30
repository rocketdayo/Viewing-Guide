import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  Info, 
  ChevronRight, 
  Calendar, 
  Smartphone, 
  Briefcase,
  Copy,
  Check
} from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface StudentInfoSectionProps {
  initialEmail?: string;
  onEmailChange?: (email: string) => void;
}

export const StudentInfoSection: React.FC<StudentInfoSectionProps> = () => {
  const { language } = useI18n();
  const [copied, setCopied] = useState<boolean>(false);
  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1f-zz17oYryqgRMMwCztH0W0oiK9eoD6WLEdb3zK1ysY/edit?gid=0#gid=0';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(spreadsheetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="student-portal-section" className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-emerald-200 p-6 sm:p-8 rounded-xs shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>SEIKYO ONLY</span>
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  清教学園 生徒・教職員限定スプレッドシート
                </span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-700 shrink-0" />
                <span>{language === 'en' ? 'SGfes Internal Operations & Schedule Sheet' : '清教学園 生徒専用連絡・日程・ルール共有シート'}</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'en' 
                  ? 'Access the official Google Spreadsheet for internal regulations, mobile phone rules, preparation timeline, and festival operations. Restricted to @stu.seikyo.ed.jp / @seikyo.ed.jp accounts.'
                  : '学園祭の校内携帯使用ルール、クラス企画連絡、前日準備および当日の全行程スケジュール・荷物置場等は、以下のGoogleスプレッドシートにて清教学園関係者（@stu.seikyo.ed.jp / @seikyo.ed.jp）限定で公開・更新されています。'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>校内携帯利用ルール</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>準備・当日進行表</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>荷物置場・生活部連絡</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto bg-slate-50 p-5 border border-slate-200 rounded-xs shrink-0 max-w-md space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'en' ? 'Google Sheets (Restricted Access)' : 'Google スプレッドシートを開く'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'Only accounts with school domain permissions can view the document.'
                    : '※清教学園のアカウントでログインしたブラウザでリンクを開いてください。'}
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded-xs transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer text-center"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>{language === 'en' ? 'Open Google Spreadsheet' : '生徒専用スプレッドシートを開く'}</span>
                  <ExternalLink className="w-4 h-4 text-emerald-200 shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{language === 'en' ? 'URL Copied!' : 'シートのURLをコピーしました'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'en' ? 'Copy Sheet URL' : 'スプレッドシートのURLをコピー'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  閲覧権限エラーが出る場合は、ブラウザで学校のアカウント（@stu.seikyo.ed.jp）に切り替えてアクセスしてください。
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

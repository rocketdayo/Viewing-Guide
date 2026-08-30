import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  LogOut, 
  Briefcase, 
  Trash2, 
  ShoppingBag, 
  Shirt,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../utils/i18n';

interface StudentInfoSectionProps {
  initialEmail?: string;
  onEmailChange?: (email: string) => void;
}

export const StudentInfoSection: React.FC<StudentInfoSectionProps> = ({
  initialEmail = '',
  onEmailChange,
}) => {
  const { language } = useI18n();
  const [studentEmail, setStudentEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seikyo_student_email');
      if (saved) return saved;
    }
    return initialEmail || '';
  });

  const [activeTab, setActiveTab] = useState<'rules' | 'day2prep' | 'day0' | 'day1' | 'day2'>('rules');

  const isStudentDomain = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    return trimmed.endsWith('@stu.seikyo.ed.jp') || trimmed === 'admin@stu.seikyo.ed.jp';
  };

  const isAuthorized = isStudentDomain(studentEmail);

  const handleLogout = () => {
    setStudentEmail('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('seikyo_student_email');
    }
    if (onEmailChange) {
      onEmailChange('');
    }
  };

  if (!isAuthorized) {
    return (
      <section id="student-portal-section" className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                    STUDENT ONLY
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    @stu.seikyo.ed.jp
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <span>{language === 'en' ? 'Student Portal (Restricted)' : '生徒専用：携帯ルール・日程・業務連絡'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'en' 
                    ? 'This section contains internal guidelines, baggage storage, mobile rules, and operation schedules for Seikyo Gakuen students.'
                    : 'このエリアは清教学園の生徒向け専用ポータル（携帯電話使用規定、クラス企画注意点、前日・1日目・2日目の全行程日程・荷物置場）です。'}
                </p>
              </div>

              <div className="w-full md:w-auto bg-white p-5 border border-slate-200 shadow-xs rounded-xs shrink-0 max-w-sm">
                <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-sm mb-2">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                  <span>{language === 'en' ? 'Student Account Required' : '生徒用アカウントでログインしてください'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'en'
                    ? 'Please log in to the website with your school account (@stu.seikyo.ed.jp) to view internal festival regulations and schedules.'
                    : '学校指定の生徒用Googleアカウント（@stu.seikyo.ed.jp）でサイトにログインしている場合のみ表示されます。一般来校者・保護者の方は閲覧できません。'}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Protected by @stu.seikyo.ed.jp</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="student-portal-section" className="py-12 bg-white text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="bg-slate-50 border border-emerald-200 p-5 sm:p-6 rounded-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-xs uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>STUDENT PORTAL (@stu.seikyo.ed.jp)</span>
              </span>
              <span className="text-xs text-emerald-900 font-mono font-bold bg-white px-2 py-0.5 border border-emerald-200 rounded-xs truncate max-w-[220px] sm:max-w-xs">
                {studentEmail}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight flex items-center gap-2">
              <span>{language === 'en' ? 'Student Guidelines & Day Operations' : '生徒専用：携帯使用ルール・準備と当日の流れ'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'en' 
                ? 'Internal festival operations, regulations, and class schedules for SG fes.' 
                : '清教学園生徒向けの携帯電話使用規定、クラス企画注意点、前日準備および1日目・2日目の全行程連絡です'}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xs border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              title="サインアウト"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'Sign out' : '生徒ログアウト'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xs transition-colors shrink-0 cursor-pointer border ${
              activeTab === 'rules'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>{language === 'en' ? 'Mobile Rules' : '携帯使用のルール'}</span>
          </button>

          <button
            onClick={() => setActiveTab('day2prep')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xs transition-colors shrink-0 cursor-pointer border ${
              activeTab === 'day2prep'
                ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{language === 'en' ? 'Day 2 Prep & Alerts' : '2日目に向けて・生活部'}</span>
          </button>

          <button
            onClick={() => setActiveTab('day0')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xs transition-colors shrink-0 cursor-pointer border ${
              activeTab === 'day0'
                ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{language === 'en' ? 'Day 0 Prep (9/18)' : '前日の流れ 9/18【準備】'}</span>
          </button>

          <button
            onClick={() => setActiveTab('day1')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xs transition-colors shrink-0 cursor-pointer border ${
              activeTab === 'day1'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{language === 'en' ? 'Day 1 (9/19)' : '1日目の流れ 9/19【校内】'}</span>
          </button>

          <button
            onClick={() => setActiveTab('day2')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xs transition-colors shrink-0 cursor-pointer border ${
              activeTab === 'day2'
                ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>{language === 'en' ? 'Day 2 (9/20)' : '2日目の流れ 9/20【一般】'}</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          {activeTab === 'rules' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    ＜携帯使用のルール＞
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-xs font-bold">
                  全学年生徒共通遵守事項
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>使用用途</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    写真・動画撮影、連絡手段、鑑賞ガイド閲覧、模擬店での支払いとして使用可能
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>使用可能時間帯</span>
                  </div>
                  <ul className="text-slate-700 space-y-1 list-disc list-inside">
                    <li><strong className="text-slate-900">高1・高2：</strong> 前日準備、1日目、2日目のすべての時間帯で使用可能</li>
                    <li><strong className="text-slate-900">高3：</strong> 1日目のみ使用可能</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xs space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>場所・禁止エリア</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    <strong className="text-amber-950 underline">中学エリアでは使用しない</strong>（見学中も含めスマートフォン操作禁止）
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xs space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>撮影・肖像権とSNS公開の禁止</span>
                  </div>
                  <ul className="text-amber-900 space-y-1 leading-relaxed">
                    <li>・人物が明確に写る場合は、必ず事前に本人の同意を得る</li>
                    <li>・<strong className="text-amber-950">撮影した写真・動画を SNS 等で公開しない。撮影対象者に無断で他者と共有しない</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 space-y-2 rounded-xs">
                <div className="font-bold text-red-900 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-700" />
                  <span>安全への配慮と禁止事項</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li><strong>歩きスマホは禁止。</strong> 写真・動画撮影の際は、撮影場所に配慮する</li>
                  <li><strong>ゲームや SNS 等、行事と関係のない使用は禁止</strong></li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'day2prep' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    ＜２日目に向けて＞
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-xs font-bold">
                  来場者対応・環境美化
                </span>
              </div>

              <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-xs space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  <span>【クラス企画について】</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
                  <p>
                    明日は来場者のお客様をおもてなしする日です。
                    明日の来場者（1日目の約5倍予想）に向けて、クラス企画設備の安全面の確認と補修、担当と業務の改善内容の確認を行ってください。
                  </p>
                  
                  <div className="p-3.5 bg-white border border-amber-200 rounded-xs space-y-1.5 text-slate-800 shadow-2xs">
                    <p>・<strong>通路確保の徹底：</strong> 通路に傘立てや雑巾がけ、不要な机椅子、聖書などが置いてあるクラスは通路を確保するように移動してください。（傘は持ち帰るように）</p>
                    <p>・<strong>並び列の管理：</strong> クラス企画入り口の並ぶ方向を再度確認し、通路は必ず確保して下さい。並んでいるお客様も来場者優先の配慮をお願いします。</p>
                  </div>

                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 font-bold text-xs space-y-1 rounded-xs">
                    <p className="text-red-800 flex items-center gap-1.5 text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
                      <span>※呼び出しです！</span>
                    </p>
                    <p>
                      <strong>高1CD・高2EG</strong> の実行委員2名は、このあとすぐに生活部前に集合してください。テント配置を変えます。
                    </p>
                  </div>

                  <p className="text-slate-800">
                    明日も事故やケガ人を出すことなく、皆が笑顔で楽しんで頂ける運営をお願いします。
                  </p>
                  <p className="text-amber-900 text-xs bg-amber-100/70 p-3 border border-amber-300 rounded-xs">
                    ※クラス企画実行委員さん！ 事業計画書・決算書の提出は、担任の先生に提出です。期限は <strong>9/24（水）提出締め切り</strong> です。それぞれが持っている領収書の清算を進めておいてください。
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xs space-y-3">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                  <Trash2 className="w-4 h-4 text-emerald-700" />
                  <span>【生活部・環境美化から】</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li>・携帯の使用、PayPayのチャージトラブルは本日同様です。厳守をお願いします。</li>
                  <li>・落とし物は生活部室まで届けてください。</li>
                  <li>・ゴミの分別と落ちているごみも全員できれいにする意識で回収をお願いします。</li>
                  <li>・化粧、頭髪など、生活部におけるルールは普段と同じです。お互いに不快な思いをせず、快適に楽しめる学園祭にしてください。</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'day0' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    SGfes 前日の流れ 9/18（木）【 準備 】
                  </h3>
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-xs font-bold">
                  貴重品は身につけるか、ロッカー施錠保管
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-blue-800 text-sm">08:25</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900">読書・教室礼拝・HR / 机・椅子総移動</p>
                    <p className="text-slate-600 text-xs">
                      高2Eは講座室2（講座室1から机椅子を4セット移動）、高2Kは高2E教室をともに9/20(土)まで使用。
                    </p>
                    <div className="text-slate-700 text-xs space-y-1 pt-1.5 border-t border-slate-200">
                      <p>・<strong>高1・高2：</strong> 終日準備・リハーサル（※高1・高2生は、4限終了まで高3教室前廊下の通行禁止。椅子移動時は静かに！）</p>
                      <p>・<strong>更衣が必要な生徒：</strong> 男子：総体男子更衣室 ／ 女子：第一体育館更衣室入り口側</p>
                      <p>・<strong>高３：</strong> 午前中授業 ～ 終礼 ～ 下校（自習室は無し）</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-blue-800 text-sm">09:00 ~ 14:25</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1">
                    <p className="font-bold text-slate-900">係集合・舞台リハーサル</p>
                    <p className="text-slate-700 text-xs">
                      ・09:00 高1・高2建設委員：第一体育館集合 ／ 高1･2美化委員：ゴミ箱設置<br />
                      ・舞台リハーサル（第一体育館・レクチャールーム） ※レクチャールームは高３授業の為、12:40以降に
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-blue-800 text-sm">10:00</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1">
                    <p className="font-bold text-slate-900">冷蔵庫・冷凍庫搬入 / 食堂営業 & 昼食（11:00〜14:00）</p>
                    <p className="text-slate-700 text-xs">
                      ・冷却時間を経て午後から使用可能（※模擬店の要冷蔵食材は午後に配達する）<br />
                      ・食堂営業時間：11:00～14:00<br />
                      ・昼食は 11:00～14:00 各HR教室・食堂・ウッドデッキ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-blue-800 text-sm">13:30 ~ 15:30</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-700" />
                      <span>SGfesクラス企画準備・買い出し規定</span>
                    </p>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      ・急遽、買い出しが必要となった場合は清教キャンパスで購入。<br />
                      ・購入できない時は、担任の許可を得て「イズミヤ、ノバティながの」に限り可能（基本的なルールは平常通り）。その際、担任（副担任）による「外出許可証」を正門の警備員に渡す。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-blue-800 text-sm">15:40 ~ 19:00</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900">15:40 教室集合・終礼 ／ 16:00〜17:45 準備・リハ延長可能</p>
                    <p className="text-slate-700 text-xs">
                      ・天候不順によるキッチンカーの可否判断は 17:00 に行う予定。<br />
                      ・<strong className="text-slate-900">18:00 完全下校</strong><br />
                      ・<strong className="text-slate-900">19:00 延長届提出時の完全下校</strong>（18:45まで活動可）<br />
                      ・<strong>スクールバス：</strong> 13:30 [高3用] ／ 16:30 ／ 18:00
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'day1' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    SGfes 当日の流れ 9/19（金）【１日目】 校内向け・高３参加AM必須
                  </h3>
                </div>
                <span className="text-xs font-mono bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-xs font-bold">
                  貴重品は身につけるか、ロッカー施錠保管
                </span>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm rounded-xs">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
                  <Briefcase className="w-4 h-4 text-indigo-700" />
                  <span>荷物置き場 & 服装規定</span>
                </div>
                <p className="text-slate-700 text-xs">
                  高1・高2の服装は制服、大きなカバンは持ってこない！小さなポーチなどで各自貴重品管理！荷物置き場に置くのは弁当くらいにして下さい！荷物置き場には十分なスペースがありません！
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xs shadow-2xs">
                    <p className="font-bold text-slate-900 mb-1">荷物置場 高１</p>
                    <p className="text-slate-700">・ABCDEF → 第１生物室<br />・GHIJK → 第２生物室</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xs shadow-2xs">
                    <p className="font-bold text-slate-900 mb-1">荷物置場 高２</p>
                    <p className="text-slate-700">・ABCD → 高３G教室<br />・EFGH → 高３F教室<br />・IJKL → 高３E教室</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xs shadow-2xs">
                    <p className="font-bold text-slate-900 mb-1">荷物置場 高３</p>
                    <p className="text-slate-700">・ABCD → 小会議室B（体育館前）<br />・EFG → 応接室E（保健室横）<br />・HIJK → 小会議室A（校長室隣）</p>
                  </div>
                </div>
                <p className="text-slate-500 text-xs">
                  ※荷物置き場に貴重品は置かない。基本的に持参したお弁当や着替えなど（施錠なし）。
                </p>
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1 rounded-xs">
                  <p><strong>※高3は 8:50〜9:20 第一体育館前で点呼後、ゲストとして12:00まで参加。</strong> その後は希望制で最終14:30まで参加可能。（弁当持参者は各荷物置場へ。後夜祭までの待機場所は第一体育館、自習室なし）</p>
                  <p><strong>※高3の服装：</strong> ①制服、②登校後に制服の上からクラスＴシャツ着用、③制服の下にＴシャツを着て登校し登校後シャツを脱ぐ。帰宅時は制服で帰宅。</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-indigo-800 text-sm">08:25 ~ 08:40</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1">
                    <p className="font-bold text-slate-900">08:25 登校・点呼 ／ 08:40 放送開会礼拝式（校長・生徒会長）</p>
                    <p className="text-slate-700 text-xs">
                      ・自教室内～周辺で担任の点呼（飲食模擬店クラスは健康チェックシートを確認・押印）、担当場所へ移動して最終準備。<br />
                      ・※聖書・讃美歌の歌詞はオンライン鑑賞ガイドを参照。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-indigo-800 text-sm">09:00 ~ 14:30</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900">SGfes 開催（1日目の実施内容については両日とも同じ場所と内容、スケジュール）</p>
                    <div className="text-slate-700 text-xs space-y-1">
                      <p>・<strong>＜クラス企画＞：</strong> 基本的には各教室</p>
                      <p>・<strong>＜飲食模擬店＞：</strong> 家庭科室付近（準備ができ次第販売開始〜14:00ラストオーダー、14:30閉店）</p>
                      <p>・<strong>＜部活動・有志発表＞：</strong> 第一体育館、レクチャールーム</p>
                      <p>・<strong>＜展示企画＞（教科、GS、クラスTシャツ）：</strong> ラーニングコモンズ、物理室１</p>
                      <p>・※昼食時間は特別に設定しない。食堂営業時間：11:00～14:00（昼食場所：高3ABCD・HIJK教室、ウッドデッキ、食堂〜前テラス）</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-indigo-800 text-sm">13:30 ~ 19:00</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1.5">
                    <p className="font-bold text-slate-900">13:30 高3バス ／ 14:40 終礼・解散 ／ 16:00 後夜祭</p>
                    <div className="text-slate-700 text-xs space-y-1">
                      <p>・<strong>13:30 高3用スクールバス(1台)：</strong> 生活部前バス乗り場</p>
                      <p>・明日の来場者に向けて、安全面の確認と補修、担当と業務の改善内容の確認。</p>
                      <p>・<strong>14:40 教室集合・放送連絡・終礼・解散</strong>（後夜祭参加希望の高3は休憩所[高3ABCDHIJK]で待機）</p>
                      <p>・<strong>14:40〜17:45 翌日準備：</strong> 清教会準備（食堂前付近）は15:00～、天候不順によるグラウンド判断は17:00予定。</p>
                      <p>・<strong>16:00〜17:30 後夜祭（第一体育館）</strong></p>
                      <p>・<strong className="text-slate-900">18:00 完全下校</strong>（スクールバス 16:30 / 18:00 テニスコート下のバス駐車場）</p>
                      <p>・<strong className="text-slate-900">19:00 延長届提出時の完全下校</strong>（18:45まで活動可）</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'day2' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    SGfes 当日の流れ 9/20（土）【２日目】 来校者（保護者・入試関係・卒業生・友人）
                  </h3>
                </div>
                <span className="text-xs font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-xs font-bold">
                  8:00 登校時施錠
                </span>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm rounded-xs">
                <div className="font-bold text-purple-900 flex items-center gap-1.5 text-sm">
                  <Shirt className="w-4 h-4 text-purple-700" />
                  <span>服装規定 & 荷物管理（2日目）</span>
                </div>
                <p className="text-slate-700 text-xs">
                  生徒の服装は①,②のいずれか。①登校後に制服の上からクラスＴシャツ着用、②制服の下にＴシャツを着て登校し登校後シャツを脱ぐ。帰宅時は制服で帰宅する。荷物は１日目と同じで大きなカバンは持ってこない！小さいポーチなどで自分の貴重品を管理すること！
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xs shadow-2xs">
                    <p className="font-bold text-slate-900 mb-1">荷物置場（1日目と同じ場所）</p>
                    <p className="text-slate-700">
                      ・高１：ABCDEF→第１生物室、GHIJK→第２生物室<br />
                      ・高２：ABCD→高３G教室、EFGH→高３F教室、IJKL→高３E教室<br />
                      ※荷物置き場に貴重品は置かない（持参弁当や着替えなど施錠なし）
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xs shadow-2xs">
                    <p className="font-bold text-slate-900 mb-1">代議員受付担当</p>
                    <p className="text-slate-700">
                      受付担当の代議員で一番最初の時間を担当している生徒は校門で待機してください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-purple-800 text-sm">08:00 ~ 08:50</div>
                  <div className="md:col-span-3 text-slate-800 space-y-1">
                    <p className="font-bold text-slate-900">08:00 施錠 ／ 08:25 登校・点呼 ／ 08:30 放送連絡 ／ 08:50 受付開始</p>
                    <p className="text-slate-700 text-xs">
                      ・08:00 登校時に貴重品は身につけるか、ロッカーに入れて施錠する。<br />
                      ・08:25 登校・自教室内～周辺で担任の点呼（飲食模擬店クラスは健康チェックシートを確認・回収）、担当場所へ移動して最終準備。<br />
                      ・08:50 来校者受付開始
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-purple-800 text-sm">09:00 ~ 14:30</div>
                  <div className="md:col-span-3 text-slate-800 space-y-2">
                    <p className="font-bold text-slate-900">SGfes 開催（一般公開）</p>
                    <div className="text-slate-700 text-xs space-y-1">
                      <p>・<strong>＜クラス企画＞：</strong> 基本的には各教室</p>
                      <p>・<strong>＜飲食模擬店＞：</strong> 家庭科室付近（準備ができ次第販売開始～14:00ラストオーダー、14:30閉店）</p>
                      <p>・<strong>＜部活動・有志発表＞：</strong> 第一体育館、レクチャールーム</p>
                      <p>・<strong>＜展示企画＞：</strong> ラーニングコモンズ、物理室１、高2K教室（警察体験 10:00～）</p>
                      <p>・<strong>＜清教会・同窓会企画（食堂付近）・グラウンド企画＞：</strong> ※２日目のみ（警察は10:00～12:00のみ）</p>
                      <p>・※昼食時間は特別に設定しない。食堂営業時間：11:00～14:00（昼食場所：高3ABCD・HIJK教室、ウッドデッキ、食堂〜前テラス）</p>
                    </div>

                    <div className="p-3.5 bg-purple-50 border border-purple-200 space-y-1 text-purple-900 text-xs rounded-xs">
                      <p className="font-bold text-purple-950">【中学エリアの利用・見学について】</p>
                      <p>・中学エリアの模擬店は高校生も利用できます。利用する場合は、中学エリアであらかじめ現金で食券を買い求めてください。</p>
                      <p>・高校生も中学エリア見学可能です。ただし、<strong className="text-purple-950 underline">中学エリアではスマートフォン使用不可</strong>です。</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xs">
                  <div className="font-mono font-bold text-purple-800 text-sm">14:40 ~ 18:00</div>
                  <div className="md:col-span-3 text-slate-800 space-y-2">
                    <p className="font-bold text-slate-900">14:40〜 撤収作業・机椅子片付け ／ 15:00 アンケート ／ 16:00 閉会式</p>
                    <div className="text-slate-700 text-xs space-y-1.5">
                      <p>・<strong>14:40〜 各担当場所の撤収作業、机椅子の片付け（各ＨＲへ）</strong></p>
                      <p>・<strong>高1・高2 建設委員：</strong> 第一体育館・受付・グランド撤収（テント、椅子、長机）</p>
                      <p>・<strong>美化委員：</strong> ゴミ収集所周辺で段ボールの分別作業 👉</p>
                      <p>・窓のテープ跡、床や机のペンキ、教室周辺の廊下やベランダ、エレベーター前、外分担など清掃を徹底</p>
                      <div className="p-2.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xs">
                        15:00 生徒向アンケート配信 ！！締め切り9/24（水）！！
                      </div>
                      <p>・<strong>16:00 HR放送閉会式・終礼</strong>（理事長～実行委員長～諸連絡）。さらに片付けが必要な団体は終礼後に継続</p>
                      <p>・<strong>スクールバス：</strong> 17:00 ／ 18:00</p>
                      <p>・<strong className="text-slate-900">18:00 完全下校</strong></p>
                      <p className="text-emerald-800 font-bold">※月曜日は通常授業です！</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
};

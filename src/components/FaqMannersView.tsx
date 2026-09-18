import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Ticket, 
  HeartHandshake, 
  Ban, 
  Sparkles, 
  MapPin, 
  PhoneCall,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface FaqItem {
  id: string;
  category: 'admission' | 'tickets' | 'safety' | 'manners';
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  tag: string;
}

export const FaqMannersView: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['faq-access', 'faq-shoes', 'faq-sns']));

  const categories = [
    { id: 'all', label: 'すべて', labelEn: 'All', icon: Sparkles },
    { id: 'admission', label: 'アクセス・履物', labelEn: 'Access & Shoes', icon: MapPin },
    { id: 'tickets', label: '整理券・観覧', labelEn: 'Tickets & Viewing', icon: Ticket },
    { id: 'safety', label: '救護・AED・落とし物', labelEn: 'First Aid, AED & Lost Items', icon: HeartHandshake },
    { id: 'manners', label: '禁止事項・マナー・分別', labelEn: 'Rules & Trash Sorting', icon: Ban },
  ];

  const faqList: FaqItem[] = [
    {
      id: 'faq-access',
      category: 'admission',
      question: '登校用の通学路「しらかしの径」の来校者利用可能時間帯を教えてください。',
      questionEn: 'What are the visitor hours for the "Shirakashi-no-Michi" path?',
      answer: '登校用の通学路 『しらかしの径』 の来校者利用可能時間帯は午前7時～午後4時30分です。',
      answerEn: 'Visitor access hours for the school path "Shirakashi-no-Michi" are 7:00 AM – 4:30 PM.',
      tag: 'アクセス・通学路'
    },
    {
      id: 'faq-shoes',
      category: 'admission',
      question: 'スリッパや上履きは必要ですか？（校内の履物ルール）',
      questionEn: 'Do I need indoor shoes or slippers? (Footwear rules)',
      answer: '校内は土足のままご入場いただけます。上履きやスリッパへの履き替えは不要です。',
      answerEn: 'Outdoor shoes are permitted inside school buildings. You do not need to bring or change into indoor slippers or shoes.',
      tag: '履物・土足OK'
    },
    {
      id: 'faq-parking',
      category: 'admission',
      question: '駐車場や駐輪場はありますか？',
      questionEn: 'Is there parking for cars or bicycles?',
      answer: '校内および周辺に一般来場者用の駐車場・駐輪場は一切ございません。近隣住民の皆様のご迷惑となりますので、お車および自転車でのご来校は固くお断りいたします。公共交通機関（南海高野線・近鉄長野線 河内長野駅より徒歩）をご利用ください。',
      answerEn: 'There is no visitor car or bicycle parking on campus or nearby. Visiting by car or bicycle is strictly prohibited. Please use public transportation (walking from Kawachinagano Station).',
      tag: '駐車場・駐輪場なし'
    },
    {
      id: 'faq-tickets-identify',
      category: 'tickets',
      question: '整理券が必要な企画はどのように見分けますか？',
      questionEn: 'How do I know which projects require tickets?',
      answer: '本アプリの「クラス企画一覧」または「リアルタイム混雑状況」画面で「🎫 整理券制」のバッジが表示されている企画が対象です。各クラス（教室）の近くにQRコードが掲示されており、そちらをスキャンして整理券を取得できます。',
      answerEn: 'Projects marked with the "🎫 Ticket Required" badge on the Projects or Live Congestion page require tickets. A QR code is posted near each classroom—scan it with your phone to obtain your ticket.',
      tag: '整理券対象'
    },
    {
      id: 'faq-tickets-distribution',
      category: 'tickets',
      question: '整理券はどこで・どのように取得できますか？',
      questionEn: 'Where and how do I get a numbered ticket?',
      answer: '整理券対象クラスの近くにQRコードが掲示されています。スマートフォンのカメラでQRコードをスキャンして整理券を取得できます。なお、混雑状況や定員に達した場合は一時発券が停止・終了することがあります。',
      answerEn: 'Numbered tickets can be obtained by scanning the QR code posted near each classroom with your smartphone camera. Please note that ticket distribution may be temporarily suspended if capacity is reached.',
      tag: 'QRコード整理券'
    },
    {
      id: 'faq-trash',
      category: 'manners',
      question: 'ゴミの分別はどうすればいいですか？',
      questionEn: 'How should trash be sorted on campus?',
      answer: '校内のゴミ箱をご利用の際は、可燃ごみとペットボトルの分別回収にご協力をお願いいたします。',
      answerEn: 'When disposing of trash on campus, please cooperate by sorting garbage into burnable trash and PET bottles.',
      tag: 'ゴミ分別'
    },
    {
      id: 'faq-sns',
      category: 'manners',
      question: '写真や動画の撮影およびSNSへの投稿に関するルールは？',
      questionEn: 'What are the rules regarding photography and social media posting?',
      answer: '生徒および来場者のプライバシー・肖像権保護のため、写真や動画のSNS投稿は絶対にやめてください。また、無断での特定個人の撮影や盗撮行為は固く禁止されています。',
      answerEn: 'To protect the privacy and portrait rights of students and visitors, posting photos or videos to social media is strictly prohibited. Filming individuals without permission is also forbidden.',
      tag: 'SNS投稿禁止'
    },
    {
      id: 'faq-firstaid',
      category: 'safety',
      question: '体調が悪くなった場合や怪我をした場合はどうすればいいですか？',
      questionEn: 'What should I do if I feel unwell or get injured?',
      answer: '本館1階の「保健室（救護所）」に養護教諭が常駐しています。また、お近くの教職員にお声がけいただければ、迅速に救護室へご案内・手配いたします。',
      answerEn: 'A first-aid station is located in the Health Room (Main Building 1F) with a school nurse on duty. You can also alert any nearby faculty member.',
      tag: '救護室・体調不良'
    },
    {
      id: 'faq-aed',
      category: 'safety',
      question: 'AED（自動体外式除細動器）の設置場所はどこですか？',
      questionEn: 'Where are the AED units located on campus?',
      answer: 'AEDの設置場所は本アプリの「校内マップ」をご参照ください。万一の緊急時には、直ちにお近くの教職員へお知らせください。',
      answerEn: 'Please refer to the "Campus Map" in this app for AED locations. In an emergency, alert the nearest faculty member immediately.',
      tag: 'AED・マップ参照'
    },
    {
      id: 'faq-lostfound',
      category: 'safety',
      question: '落とし物・忘れ物をした／拾った場合は？',
      questionEn: 'Where is the Lost and Found located?',
      answer: '落とし物は、B棟1階の生活部までお願いします。校内での落とし物・お忘れ物はすべて「B棟1階の生活部」に集約・保管されます。お心当たりのある方や拾得された方は、B棟1階の生活部またはお近くの教職員までお届け・お越しください。',
      answerEn: 'All lost and found items on campus are collected and kept at the Life Department on the 1st floor of Building B (B棟1階 生活部). Please visit B Building 1F Life Department or notify nearby faculty.',
      tag: '落とし物・生活部'
    },
    {
      id: 'faq-offlimits',
      category: 'manners',
      question: '立ち入り禁止エリアについて教えてください。',
      questionEn: 'Which areas are off-limits to visitors?',
      answer: '使用されていない教室、屋上、立ち入り禁止の表示がある場所への立ち入りは禁止です。',
      answerEn: 'Entry into unused classrooms, rooftops, and any locations with "Off Limits / Keep Out" signs is strictly prohibited.',
      tag: '立入禁止'
    },
    {
      id: 'faq-smoke-alcohol',
      category: 'manners',
      question: '校内での喫煙や飲酒は可能ですか？',
      questionEn: 'Is smoking or alcohol allowed on campus?',
      answer: '学校教育施設につき、敷地内および学校周辺は「全面禁煙（加熱式タバコ・電子タバコ含む）」です。また、酒類の持ち込みおよび飲酒状態でのご入場は固くお断りいたします。',
      answerEn: 'The entire campus and surroundings are strictly non-smoking (including e-cigarettes/vapes). Alcoholic beverages and intoxicated entry are strictly prohibited.',
      tag: '禁煙・禁酒'
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = faqList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query) ||
      item.questionEn.toLowerCase().includes(query) ||
      item.answerEn.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{t.faqTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-3xl">
              {t.faqSubtitle}
            </p>
          </div>
        </div>

        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faqSearchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-black text-slate-900">{t.mannersTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-teal-600" />
            <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>{language === 'en' ? 'Outdoor Shoes Allowed' : '校内は土足入場OK'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? 'Outdoor shoes permitted. No indoor shoes or slippers required.' : '校内は土足のままご入場いただけます。上履きへの履き替えは不要です。'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-rose-600" />
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
              <Camera className="w-4 h-4" />
              <span>{language === 'en' ? 'No Social Media Posts' : 'SNS投稿は絶対に禁止'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? 'Posting photos or videos to social media is strictly prohibited.' : '生徒・来場者のプライバシー保護のため、写真や動画のSNS投稿は絶対にやめてください。'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-amber-500" />
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <Trash2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Trash Sorting Cooperation' : '可燃ごみ・ペットボトル分別'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? 'Please separate trash into burnables and PET bottles.' : 'ゴミは可燃ごみとペットボトルの分別回収にご協力をお願いいたします。'}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-slate-700" />
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <Ban className="w-4 h-4 text-slate-700" />
              <span>{language === 'en' ? 'Off-Limits & Prohibitions' : '立入禁止区域・敷地内禁煙'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en' ? 'Unused rooms and rooftops are off-limits. Entire campus is non-smoking.' : '使用されていない教室や屋上、表示のある場所への立ち入りは禁止です。完全禁煙。'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xs text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'en' ? cat.labelEn : cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
          <span>{filteredFaqs.length} {language === 'en' ? 'questions' : '件の質問'}</span>
          <button
            onClick={() => {
              if (expandedIds.size === filteredFaqs.length) {
                setExpandedIds(new Set());
              } else {
                setExpandedIds(new Set(filteredFaqs.map(f => f.id)));
              }
            }}
            className="text-emerald-700 hover:underline cursor-pointer"
          >
            {expandedIds.size === filteredFaqs.length ? (language === 'en' ? 'Collapse all' : 'すべて閉じる') : (language === 'en' ? 'Expand all' : 'すべて開く')}
          </button>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-2">
            <p className="text-sm font-bold text-slate-800">{language === 'en' ? 'No matching questions found' : '該当する質問が見つかりませんでした'}</p>
            <p className="text-xs">{language === 'en' ? 'Try searching with different keywords or switch categories.' : '別のキーワードで検索するか、カテゴリーを変更してお試しください。'}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedIds.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xs border border-slate-200 shadow-2xs hover:border-emerald-200 transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        Q
                      </span>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 font-bold">
                            {faq.tag}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          {language === 'en' ? faq.questionEn : faq.question}
                        </h4>
                      </div>
                    </div>
                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 pl-12 space-y-2">
                      <div className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          A
                        </span>
                        <div className="space-y-1">
                          <p>{language === 'en' ? faq.answerEn : faq.answer}</p>
                          {language === 'en' && (
                            <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/50">{faq.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 rounded-xs bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xs bg-emerald-100 text-emerald-800 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black">
              {language === 'en' ? 'Questions & Lost Items: Visit 1F Administrative Office' : 'ご不明な点・落とし物は1階の事務室へ'}
            </p>
            <p className="text-[11px] text-emerald-800">
              {language === 'en' 
                ? 'For lost and found or inquiries, please visit the Administrative Office (Main Building 1F) or ask nearby staff.' 
                : '落とし物や各種お問い合わせは「本館1階の事務室」またはお近くの教職員までお気軽にお声がけください。'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('map')}
          className="px-4 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition-colors"
        >
          {language === 'en' ? 'Check Campus Map →' : '校内マップで場所を確認 →'}
        </button>
      </div>
    </div>
  );
};

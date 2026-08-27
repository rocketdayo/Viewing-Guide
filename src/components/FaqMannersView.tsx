import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Utensils, 
  Ticket, 
  HeartHandshake, 
  Ban, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  Clock, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useI18n } from '../utils/i18n';

interface FaqItem {
  id: string;
  category: 'admission' | 'tickets' | 'food' | 'photos' | 'safety' | 'manners';
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['faq-1', 'faq-4', 'faq-7']));

  const categories = [
    { id: 'all', label: 'すべて', labelEn: 'All', icon: Sparkles },
    { id: 'admission', label: '入場・アクセス', labelEn: 'Admission & Access', icon: MapPin },
    { id: 'tickets', label: '整理券・観覧', labelEn: 'Tickets & Viewing', icon: Ticket },
    { id: 'food', label: '飲食・カフェテリア', labelEn: 'Food & Cafeteria', icon: Utensils },
    { id: 'photos', label: '撮影・SNSルール', labelEn: 'Photo & Social Media', icon: Camera },
    { id: 'safety', label: '救護・AED・落とし物', labelEn: 'First Aid & Lost Items', icon: HeartHandshake },
    { id: 'manners', label: '禁止事項・マナー', labelEn: 'Prohibitions & Etiquette', icon: Ban },
  ];

  const faqList: FaqItem[] = [
    // Admission
    {
      id: 'faq-1',
      category: 'admission',
      question: 'スリッパや上履きは必要ですか？（校内の履物ルール）',
      questionEn: 'Do I need indoor shoes or slippers? (Footwear rules)',
      answer: '校内は【原則土足禁止】となっております。ご来場の際は、スリッパ・上履き、および脱いだ靴を持ち歩くための下足袋（ビニール袋等）を必ずご持参いただきますようご協力をお願いいたします。',
      answerEn: 'The campus is strictly INDOOR SHOES ONLY (outdoor shoes are prohibited inside school buildings). Please bring your own slippers/indoor shoes and a plastic shoe bag to carry your outdoor shoes.',
      tag: '履物・土足禁止'
    },
    {
      id: 'faq-2',
      category: 'admission',
      question: '一度退場した後の再入場は可能ですか？',
      questionEn: 'Is re-entry allowed after leaving the campus?',
      answer: 'はい、可能です。正門受付でお渡しする「来場者パンフレット」または受付証明をご提示いただくことで、当日は何度でも再入場いただけます。',
      answerEn: 'Yes, re-entry is permitted. Please show your official festival brochure or visitor proof at the front gate reception.',
      tag: '再入場'
    },
    {
      id: 'faq-3',
      category: 'admission',
      question: '駐車場や駐輪場はありますか？',
      questionEn: 'Is there parking for cars or bicycles?',
      answer: '校内および周辺に一般来場者用の駐車場はございません。近隣の迷惑となりますので、お車でのご来校は固くお断りいたします。公共交通機関（南海高野線・近鉄長野線 河内長野駅よりバスまたは徒歩）をご利用ください。なお、自転車用の臨時駐輪スペースは正門脇に設けております。',
      answerEn: 'No visitor car parking is available on campus or nearby. Please use public transportation (Nankai Koya Line / Kintetsu Nagano Line to Kawachinagano Station). Bicycle parking is located near the main gate.',
      tag: 'アクセス・駐車場'
    },

    // Tickets
    {
      id: 'faq-4',
      category: 'tickets',
      question: '整理券が必要な企画はどのように見分けますか？',
      questionEn: 'How do I know which projects require tickets?',
      answer: '本アプリの「クラス企画一覧」または「リアルタイム混雑状況」画面で「🎫 整理券制」のバッジが表示されている企画が対象です。各企画の詳細ページに配布時間やオンライン整理券の取得リンクが掲載されています。',
      answerEn: 'Projects marked with the "🎫 Ticket Req." badge on the Projects or Live Congestion page require tickets. Check project details for distribution times and online pass links.',
      tag: '整理券対象'
    },
    {
      id: 'faq-5',
      category: 'tickets',
      question: '整理券はどこで・何時に配られますか？',
      questionEn: 'Where and when are tickets distributed?',
      answer: '整理券は「各クラスの教室前」または「オンライン整理券（指定クラス）」にて配布されます。午前の部（9:30〜）と午後の部（12:30〜）に分けて配布される場合が多いため、アプリ内の企画詳細や混雑状況の備考欄をご確認ください。',
      answerEn: 'Tickets are distributed outside each classroom or through online ticketing links. Distribution typically occurs in morning (9:30~) and afternoon (12:30~) batches.',
      tag: '配布時間'
    },

    // Food & Cafeteria
    {
      id: 'faq-6',
      category: 'food',
      question: '飲食ができる場所（飲食可能エリア）はどこですか？',
      questionEn: 'Where are eating and drinking allowed?',
      answer: '飲食可能エリアは「カフェテリア（食堂）」「中庭特設ベンチエリア」「一部の指定飲食可能教室（縁日・カフェ企画等）」に限定されています。廊下での食べ歩きや、展示・演劇教室内での飲食は衛生・安全管理のためご遠慮ください。',
      answerEn: 'Dining is restricted to the cafeteria, courtyard picnic benches, and designated food stall classrooms. Walking and eating in hallways or exhibition rooms is prohibited.',
      tag: '飲食エリア'
    },
    {
      id: 'faq-7',
      category: 'food',
      question: 'カフェテリア（食堂）の営業時間とメニューは？',
      questionEn: 'What are the cafeteria hours and menu?',
      answer: 'カフェテリアは 11:00〜14:00 まで営業しています（うどん、カレー、丼もの、軽食、ドリンク等を販売）。数に限りがあり、人気メニューは早期完売となる場合がございますのでお早めにご利用ください。',
      answerEn: 'The cafeteria is open from 11:00 AM to 2:00 PM (offering curry, udon noodles, snacks, and drinks). Quantities are limited and popular items may sell out early.',
      tag: '食堂利用'
    },
    {
      id: 'faq-8',
      category: 'food',
      question: 'ゴミの分別はどうすればいいですか？',
      questionEn: 'How should trash be sorted?',
      answer: '校内各所に「エコステーション（ゴミ回収所）」を設置しています。「①可燃ゴミ」「②プラスチック・容器包装」「③ペットボトル（キャップ・ラベルを外す）」「④空き缶」の4分別にご協力をお願いいたします。',
      answerEn: 'Please dispose of garbage at designated Eco Stations by sorting into Burnables, Plastics, PET Bottles (caps/labels removed), and Cans.',
      tag: 'ゴミ分別'
    },

    // Photos & Social Media
    {
      id: 'faq-9',
      category: 'photos',
      question: '写真や動画の撮影に関するルール・注意点は？',
      questionEn: 'What are the rules for photos and videos?',
      answer: 'ご家族・ご友人同士での個人鑑賞用としての記念撮影は可能ですが、生徒および他のお客様のプライバシー保護を最優先としてください。無断での特定個人の撮影や盗撮行為は固く禁止されています。また、チャペルや体育館のステージ企画において「撮影禁止」のアナウンス・掲示がある場合は必ず指示に従ってください。',
      answerEn: 'Personal photo-taking with family and friends for private memories is permitted. However, filming other students without consent is strictly prohibited. Please follow all "No Photography" rules at performances.',
      tag: '撮影ルール'
    },
    {
      id: 'faq-10',
      category: 'photos',
      question: 'SNS（Instagram, X, TikTok, YouTube等）への投稿はできますか？',
      questionEn: 'Can I post photos/videos to social media?',
      answer: '生徒および来場者のプライバシー・肖像権保護のため、SNSへの写真や動画の投稿はお控えいただきますようお願いいたします。やむを得ず掲載される場合であっても、他の方の顔が絶対に特定されないようスタンプや強力なぼかし加工等のプライバシー保護措置を徹底し、個人情報の保護にご協力をお願いいたします。',
      answerEn: 'To protect the privacy and portrait rights of all students and visitors, please REFRAIN from posting photos or videos taken at the festival to social media. If you must share, you are strictly required to blur or conceal all identifiable faces.',
      tag: 'SNS・プライバシー'
    },

    // Safety & First Aid
    {
      id: 'faq-11',
      category: 'safety',
      question: '体調が悪くなった場合や怪我をした場合はどうすればいいですか？',
      questionEn: 'What should I do if I feel unwell or get injured?',
      answer: '本館1階の「保健室（救護所）」に養護教諭および救護スタッフが常駐しています。また、お近くの教職員にお声がけいただければ、迅速に救護室へご案内・手配いたします。',
      answerEn: 'A first-aid station is located in the Health Room (Main Building 1F) with medical staff. You can also alert any nearby faculty member.',
      tag: '救護室・体調不良'
    },
    {
      id: 'faq-12',
      category: 'safety',
      question: 'AED（自動体外式除細動器）の設置場所はどこですか？',
      questionEn: 'Where are the AED devices located?',
      answer: 'AEDの詳細な設置場所につきましては、現在確認・調整中です（後ほど確定次第更新いたします）。万一緊急の救急事態が発生した場合は、直ちにお近くの教職員、または本館1階の職員室・保健室へお知らせください。',
      answerEn: 'Exact AED locations are currently pending confirmation and will be announced soon. In an emergency, please immediately alert the nearest faculty member, the Faculty Office, or the Health Room (Main Building 1F).',
      tag: 'AED・緊急時'
    },
    {
      id: 'faq-13',
      category: 'safety',
      question: '落とし物・忘れ物をした／拾った場合は？',
      questionEn: 'Where is the Lost and Found located?',
      answer: '本校では生徒会・文化祭実行本部は設置されておりません。校内での落とし物・お忘れ物はすべて「本館1階 職員室」に集約・保管されます。お心当たりのある方や拾得された方は、職員室またはお近くの教職員までお届け・お声がけください。',
      answerEn: 'Please note there is no Student Council or Executive Headquarters booth. All lost and found items are handled at the Faculty Office (Staff Room, Main Building 1F). Please visit the Faculty Office or notify faculty members.',
      tag: '落とし物・職員室'
    },

    // Prohibitions & Manners
    {
      id: 'faq-14',
      category: 'manners',
      question: '校内での喫煙や飲酒は可能ですか？',
      questionEn: 'Is smoking or alcohol allowed on campus?',
      answer: '学校教育施設につき、敷地内および学校周辺は「全面禁煙（加熱式タバコ・電子タバコ含む）」です。また、酒類の持ち込みおよび飲酒状態でのご入場は固くお断りいたします。',
      answerEn: 'The entire campus is strictly non-smoking (including e-cigarettes/vapes). Alcoholic beverages and intoxicated entry are strictly prohibited.',
      tag: '禁煙・禁酒'
    },
    {
      id: 'faq-15',
      category: 'manners',
      question: '立ち入り禁止エリアについて教えてください。',
      questionEn: 'Which areas are off-limits to visitors?',
      answer: '文化祭企画に使用されていない特別教室、中学校舎、屋上、立ち入り禁止テープが貼られている区域への立ち入りは安全管理上固く禁止されています。',
      answerEn: 'Junior High buildings, rooftops, and areas marked with yellow hazard tape are strictly off-limits.',
      tag: '立入禁止'
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
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-xs bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xs bg-white/10 backdrop-blur-md shadow-inner">
            <HelpCircle className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">{t.faqTitle}</h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-3xl">
              {t.faqSubtitle}
            </p>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.faqSearchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xs bg-white/95 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Crucial Visitor Manners Card Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-black text-slate-900">{t.mannersTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: 土足禁止 */}
          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-teal-600" />
            <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
              <Ban className="w-4 h-4 text-teal-700" />
              <span>校内は原則土足禁止</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              校内は土足禁止です。スリッパ・上履きと靴袋をご持参ください。
            </p>
          </div>

          {/* Card 2: 撮影・SNS */}
          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-emerald-600" />
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
              <Camera className="w-4 h-4" />
              <span>プライバシー尊重・SNS配慮</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              生徒や他の方のプライバシーを最優先に。SNSへの写真・動画投稿はお控えください。
            </p>
          </div>

          {/* Card 3: 飲食・ゴミ */}
          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-amber-500" />
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <Utensils className="w-4 h-4" />
              <span>指定エリア飲食・ゴミ分別</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              飲食は食堂や中庭等の指定エリアで。廊下の食べ歩きは禁止です。
            </p>
          </div>

          {/* Card 4: 禁煙・禁酒 */}
          <div className="p-4 bg-white rounded-xs border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden">
            <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-rose-600" />
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
              <Ban className="w-4 h-4" />
              <span>敷地内全面禁煙・飲酒禁止</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              学校敷地内・周辺は完全禁煙です。酒類の持ち込みも固く禁止されています。
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
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

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
          <span>{filteredFaqs.length} 件の質問</span>
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
            {expandedIds.size === filteredFaqs.length ? 'すべて閉じる' : 'すべて開く'}
          </button>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xs border border-slate-200 text-slate-500 space-y-2">
            <p className="text-sm font-bold text-slate-800">該当する質問が見つかりませんでした</p>
            <p className="text-xs">別のキーワードで検索するか、カテゴリーを変更してお試しください。</p>
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

      {/* Bottom Help Contact Strip */}
      <div className="p-4 sm:p-5 rounded-xs bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xs bg-emerald-100 text-emerald-800 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black">ご不明な点・落とし物は職員室へ</p>
            <p className="text-[11px] text-emerald-800">
              落とし物や各種お問い合わせは「本館1階 職員室」またはお近くの教職員までお気軽にお声がけください。（※生徒会・実行本部ブースはございません）
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('map')}
          className="px-4 py-2 rounded-xs bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer transition-colors"
        >
          校内マップで場所を確認 →
        </button>
      </div>
    </div>
  );
};

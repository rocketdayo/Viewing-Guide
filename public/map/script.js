// ========================================
// 校内マップ 共通JavaScript
// 1階・2階・3階・4階・地下 対応
// ========================================


// ========================================
// クリスタで測った元画像のサイズ
// ※ここが違う場合は変更
// ========================================

const ORIGINAL_WIDTH = 2480;
const ORIGINAL_HEIGHT = 3508;


// ========================================
// 1階
// ========================================

const floor1Places = [

{ name: "清教キャンパス",
 x: 825,
 y: 905,
 width: 220,
 height: 65,
 image: "images/seikyocampus.png.jpg",
 detail: true,
 description: "文房具の他、制服・体操服・制靴・上靴・体育館シューズなどの学校指定物品をいつでもお買い求めいただけるよう取り揃えております。お気軽にお立ち寄りください。",
 location: "1階",
 time: "18日 9:00〜17:00　19日 9:00～15:30"
},
{ name: "食堂",
 x: 994,
 y: 1025,
 width: 160,
 height: 65,
 image:"images/facility_img15.jpg",
 detail: true,
 description: "お食事や休憩にご利用いただけるほか、パンなどの軽食も販売しております。ぜひお気軽にお立ち寄りください。",
 location: "1階",
 time: "11:00〜14:00"
},
{ name: "同窓会 模擬店",
 x: 1177,
 y: 431,
 width: 160,
 height: 65,
 detail: true,
 description: "同窓会主催の模擬店にて、フランクフルト・綿菓子・スモアなどを販売しております。ぜひお楽しみください。",
 location: "1階",
 time: "19日 9:00〜14:30"
},
{name: "献血",
 x: 1409,
 y: 604,
 width: 160,
 height: 65,
 detail: true,
 description: "献血を行っております。皆さまのご協力をお願いいたします。",
 location: "1階",
 time: "19日 9:00〜14:30"
},
{ name: "同窓会本部 食品物販",
 x: 1432,
 y: 968,
 width: 160,
 height: 65,
 detail: true,
 description: "同窓会本部では、食品の販売を行っております。ぜひお立ち寄りください。",
 location: "1階",
 time: "19日 9:00〜14:30"
},
{ name: "国際交流委員会",
 x: 1317,
 y: 1387,
 width: 220,
 height: 65
},
{ name: "生活部 特活部",
 x: 1437,
 y: 1506,
 width: 220,
 height: 65
},
{ name: "進路部室",
 x: 1738,
 y: 1795,
 width: 180,
 height: 65
},
{ name: "進路相談室",
 x: 1792,
 y: 1936,
 width: 200,
 height: 65
},
{ name: "事務室",
 x: 1744,
 y: 2291,
 width: 160,
 height: 65
},
{ name: "保健室",
 x: 974,
 y: 2501,
 width: 160,
 height: 65,
 detail: true,
 description: "養護教諭が常駐しております。体調が優れない際などにご利用ください。"
},
{ name: "高1G 角谷ずキッチン", 
 x: 1964,
 y: 1978,
 width: 140,
 height: 60,
 image:"images/1-G~2.jpg",
 detail: true,
 description: "テントにて、いろんな味付けのできるホットケーキ・ワッフル・カステラなど、甘くておいしいスイーツを販売しております。ぜひお楽しみください。※高1G教室はイートインスペースとなっており、販売はしておりません。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "高2I ケバブ屋さん",
 x: 1967,
 y: 2110,
 width: 140,
 height: 60,
 image:"images/2-I.png",
 detail: true,
 description: "テントにて、キャベツとジューシーなチキンをトルティーヤで包んだ、食べ応え抜群のケバブサンドを販売しております。ぜひお楽しみください。※高2I教室では販売しておりません。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "高2I ケバブ屋さん",
 x: 2325,
 y: 2144,
 width: 140,
 height: 60,
 image:"images/2-I.png",
 detail: true,
 description: "高2I教室では販売を行っておらず、外のテントにて販売しております。ご購入の際は、お間違えのないようご注意ください。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "第1体育館",
 x: 1235,
 y: 2845,
 width: 500,
 height: 90,
 image:"images/facility_img06.jpg",
 detail: true,
 description: "合唱部・ハンドベル部・演劇部・書道部・ダンス部・吹奏楽部による公演をはじめ、有志によるステージや特別企画も開催しております。ぜひお楽しみください。",
 location: "1階",
 time: "9:00〜17:30"
},
{ name: "第2体育館",
 x: 602,
 y: 2851,
 width: 200,
 height: 65
},
{ name: "清教会館",
 x: 188,
 y: 2920,
 width: 180,
 height: 65
},
{ name: "英語科準備室",
 x: 2043,
 y: 2500,
 width: 220,
 height: 65
},
{ name: "数学科準備室",
 x: 2180,
 y: 2500,
 width: 220,
 height: 65
},
{ name: "高2K 今日、迷子になりました。惑星朝日編",
 x: 2320,
 y: 2496,
 width: 140,
 height: 60,
 image:"images/2-K.png",
 detail: true,
 description: "宇宙をテーマにした本格的な迷路や謎解き、写真映えするフォトスポットをご用意しております。ぜひお楽しみください。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "高2H 巨大すごろく", 
 x: 2323,
 y: 1992,
 width: 140,
 height: 60,
 image:"images/2-H.png",
 detail: true,
 description: "巨大なすごろく形式の人生ゲームを開催しております。ぜひ挑戦して、ゴールを目指してみてください。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "高2G ばれずに宿題チャレンジ",
 x: 2321,
 y: 1848,
 width: 140,
 height: 60,
 image:"images/2-G.png",
 detail: true,
 description: "授業中の「内職」をテーマにした、スリル満点の体験企画を開催しております。ぜひ挑戦してみてください。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "同窓会企画 盲導犬イベント",
 x: 1167,
 y: 2589,
 width: 220,
 height: 65,
 detail: true,
 description: "同窓会主催の盲導犬の役割や視覚障がいについて楽しく学べるイベントを開催しております。ぜひお立ち寄りください。",
 location: "1階",
 time: "19日 8:30〜17:00"
},
{ name: "第2体育館",
 x: 595,
 y: 2856,
 width: 180,
 height: 65
}

];


// ========================================
// 2階
// ========================================

const floor2Places = [

{ name: "美術工作室",
 x: 618,
 y: 847,
 width: 180,
 height: 65,
},
{ name: "技術科室",
 x: 880,
 y: 1022,
 width: 160,
 height: 65
},
{ name: "講座室2",
 x: 1014,
 y: 1143,
 width: 160,
 height: 60
},
{ name: "講座室1",
 x: 1190,
 y: 1315,
 width: 160,
 height: 60
},
{ name: "高1E 福山パラダイス",
 x: 1317,
 y: 1438,
 width: 140,
 height: 60,
 image:"images/1-E.png",
 detail: true,
 description: "スーパーボールすくい・恋御籤（こいみくじ）・射的・輪投げなど、さまざまな縁日をお楽しみいただけます。ぜひお立ち寄りください。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "高1F WADARASHI",
 x: 1442,
 y: 1559,
 width: 140,
 height: 60,
 image:"images/1-F.png",
 detail: true,
 description: "ボールを蹴って次々と現れるターゲットを狙い、得点を競うゲームです。高得点を目指して、ぜひ挑戦してみてください。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "第1化学室",
 x: 1839,
 y: 1743,
 width: 180,
 height: 65
},
{ name: "化学準備室",
 x: 2007,
 y: 1744,
 width: 200,
 height: 65
},
{ name: "第2化学室",
 x: 2172,
 y: 1744,
 width: 180,
 height: 65
},
{ name: "高1G 角谷ずキッチン", 
 x: 1964,
 y: 1978,
 width: 140,
 height: 60,
 image:"images/1-G~2.jpg",
 detail: true,
 description: "高1G教室はおしゃれに装飾された居心地の良いカフェ空間になっており、販売は行っておりません。ご購入の際は、お間違えのないようご注意ください。",
 location: "1階",
 time: "9:00〜14:30"
},
{ name: "高1H 人間カーリング",
 x: 1672,
 y: 2158,
 width: 140,
 height: 60,
 image:"images/1-H.png",
 detail: true,
 description: "人が乗った台車を押して、進んだ距離を競うゲームです。どこまで進むことができるのか。ぜひ挑戦してみてください。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "高1I 角には気をつけろ ~この先自己責任~",
 x: 1674,
 y: 2333,
 width: 140,
 height: 60,
 image:"images/1-I.png",
 detail: true,
 description: "恐怖に挑戦できるスリル満点の企画を開催しております。怖いものが苦手な方もぜひ挑戦してみてください。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "高1J かき氷はじめました",
 x: 1673,
 y: 2510,
 width: 140,
 height: 60,
 image:"images/1-G~2.jpg",
 detail:true,
 description:"氷の冷たさと鮮やかなシロップの甘さが広がる、定番のかき氷を販売しております。暑さを吹き飛ばすひんやりスイーツで、夏の涼をお楽しみください。",
 location:"2階",
 time:"9:00～14:30"
},
{ name: "高校職員室",
 x: 2214,
 y: 2706,
 width: 200,
 height: 65
},
{ name: "校長室",
 x: 1296,
 y: 2737,
 width: 160,
 height: 65
},
{ name: "企画室",
 x: 1145,
 y: 2734,
 width: 160,
 height: 65
},
{ name: "入試部",
 x: 996,
 y: 2737,
 width: 160,
 height: 65
},
{ name: "教務室",
 x: 708,
 y: 2735,
 width: 160,
 height: 65
},
{ name: "宗教部",
 x: 560,
 y: 2732,
 width: 160,
 height: 65
},
{ name: "理事・理事長室",
 x: 158,
 y: 2702,
 width: 220,
 height: 65
}

];


// ========================================
// 3階
// ========================================

const floor3Places = [

{ name: "トレーニングルーム",
 x: 171,
 y: 1096,
 width: 260,
 height: 65
},
{ name: "柔道場",
 x: 414,
 y: 1007,
 width: 160,
 height: 65
},
{ name: "体育科準備室",
 x: 260, 
 y: 1454,
 width: 220,
 height: 65
},
{ name: "総合体育館",
 x: 514,
 y: 1437,
 width: 200,
 height: 65
},
{ name: "書道科教室",
 x: 1106,
 y: 1098,
 width: 200,
 height: 65
},
{ name: "書道科準備室",
 x: 1152,
 y: 1153,
 width: 240,
 height: 65
},
{ name: "第2美術室",
 x: 1249,
 y: 1232,
 width: 180,
 height: 65 
},
{ name: "第1美術室",
 x: 1350,
 y: 1327,
 width: 180,
 height: 65
},
{ name: "アトリエ",
 x: 1447,
 y: 1427,
 width: 160,
 height: 65
},
{ name: "高3C 飲食スペース",
 x: 1628,
 y: 1599,
 width: 140,
 height: 60,
 image:"images/1-I.png",
 detail:true,
 description:"お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location:"3階",
 time:"9:00～14:30"
},
{ name: "高3D 飲食スペース",
 x: 1726, 
 y: 1684,
 width: 140,
 height: 60,
 detail:true,
 description:"お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location:"3階",
 time:"9:00～14:30"
},
{ name: "第1生物室",
 x: 2028, 
 y: 1828,
 width: 180,
 height: 65
},
{ name: "生物準備室", 
 x: 2155, 
 y: 1826, 
 width: 200,
 height: 65 
},
{ name: "第2生物室",
 x: 2284, 
 y: 1826, 
 width: 180, 
 height: 65
},
{ name: "高1A 人形教室", 
 x: 1898, 
 y: 2012, 
 width: 140, 
 height: 60,
 image:"images/1-A.png",
 detail: true,
 description: "人形「エリーちゃん」が封印されたC棟3階の教室。「エリーちゃん遊ぼ」と言わないこと、決して振り向かないこと。掟を破ったあなたを待つものとは……？ぜひお楽しみください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "高1B", 
 x: 1897, 
 y: 2146, 
 width: 140, 
 height: 60,
 image:"images/1-B.png",
 detail: true,
 description: "舞台は空港のターミナル。違和感を探し、制限時間内にどこまでターミナルを進むことができるのか。ぜひ挑戦してみてください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "高1C",
 x: 1898, 
 y: 2281,
 width: 140,
 height: 60,
 image:"images/1-C.png",
 detail: true,
 description: "動物になりきって、謎解きしながら動物園の檻から脱出するゲームです。ぜひチャレンジしてみてください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "高1D",
 x: 1897,
 y: 2413,
 width: 140,
 height: 60 ,
 image:"images/1-D.png",
 detail: true,
 description: "海のようなきれいな空間で、個性豊かな魚や人間を釣ることができます。ぜひお楽しみください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "ピロティ",
 x: 1478,
 y: 2182,
 width: 160,
 height: 65 
},
{ name: "中3C",
 x: 1266, 
 y: 2030,
 width: 140, 
 height: 60,
 image:"images/④１A.jpg",
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中3A",
 x: 1146, 
 y: 2032, 
 width: 140,
 height: 60,
 image:"images/IMG_6224.jpeg",
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、高校生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "イングリッシュルーム",
 x: 1244,
 y: 2322,
 width: 280,
 height: 65,
 image:"images/facility_img03.jpg",
 detail: true,
 description:"ネイティブ教師と塗り絵などを楽しみながら、楽しく英語を学べる企画を実地しております。ぜひお楽しみください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "チャペル",
 x: 724,
 y: 2214,
 width: 160,
 height: 65,
 image:"images/facility_img01.jpg",
 detail: true,
 description: "吹奏楽部・ハンドベル部・合唱部による公演をはじめ、有志によるステージや文化祭実行委員企画も開催しております。ぜひお楽しみください。",
 location: "3階",
 time: "9:15〜15:05"
},
{ name: "中1D",
 x: 824,
 y: 2582,
 width: 140,
 height: 60,
 image:"images/792A5980.JPG",
 detail: true,
 description: "テーマに沿って書いた英作文や、英語スピーチコンテスト出場者による寄せ書き等を展示しております。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中1C",
 x: 956,
 y: 2580,
 width: 140,
 height: 60,
 detail: true,
 description: "思い出の写真を動画にまとめ、放映しております。ぜひご覧ください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中1B",
 x: 1090,
 y: 2582, 
 width: 140, 
 height: 60,
 image:"images/④１A.jpg",
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、高校生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中1A",
 x: 1224,
 y: 2584,
 width: 140,
 height: 60,
 image:"images/④１A.jpg",
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、高校生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中3B", 
 x: 1454, 
 y: 2582,
 width: 140,
 height: 60,
 image:"images/7Q2A2026.JPG",
 detail: true,
 description: "技術科で制作したフォトフレームや、家庭科で制作した聖書・讃美歌カバー等を展示しております。ぜひお楽しみください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中3D",
 x: 1586,
 y: 2580, 
 width: 140,
 height: 60,
 image:"images/⑨2B.JPG",
 detail: true,
 description: "社会科の調べ学習、国語科の俳句、理科の植物・海藻標本等を展示しています。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中学講座室",
 x: 1716,
 y: 2578,
 width: 200,
 height: 65,
 image:"images/",
 detail: true,
 description: "家庭科部によるUVレジン体験を行っております。ぜひお越しください。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "国語科準備室",
 x: 2023,
 y: 2587,
 width: 220,
 height: 65
},
{ name: "高3A",
 x: 2141, 
 y: 2585, 
 width: 140,
 height: 60
},
{ name: "高3B",
 x: 2258,
 y: 2584,
 width: 140,
 height: 60 
},
{ name: "高3L",
 x: 2377,
 y: 2582,
 width: 140,
 height: 60
}

];


// ========================================
// 4階
// ========================================

const floor4Places = [

{ name: "総合体育館",
 x: 372, 
 y: 1191,
 width: 200, 
 height: 65
},
{ name: "第2音楽室",
 x: 1026,
 y: 1194,
 width: 180,
 height: 65
},
{ name: "音楽練習室",
 x: 1165, 
 y: 1335, 
 width: 220,
 height: 65
},
{ name: "第1音楽室",
 x: 1280,
 y: 1428,
 width: 180,
 height: 65
},
{ name: "物理室2", 
 x: 1415,
 y: 1579,
 width: 160,
 height: 60,
 detail: true,
 description: "中学理科部の展示や発表が行われます。ぜひお立ち寄りください。",
 location: "4階",
 time: "9:00〜14:30"
},
{ name: "物理準備室",
 x: 1552,
 y: 1669, 
 width: 200,
 height: 65
},
{ name: "物理室1", 
 x: 1641,
 y: 1764,
 width: 160, 
 height: 60,
 detail: true,
 description: "高校理科部の展示や発表が行われます。ぜひお立ち寄りください。",
 location: "4階",
 time: "9:00〜14:30"
},
{ name: "レクチャールーム",
 x: 2155,
 y: 1801, 
 width: 240,
 height: 65,
 detail: true,
 description: "聖書研究会ゴスペル部や有志の生徒による公演も開催しております。ぜひお楽しみください。",
 location: "4階",
 time: "10:20〜12:40"
},
{ name: "高3E",
 x: 1891,
 y: 1974, 
 width: 140,
 height: 60,
 image:"images/④１A.jpg",
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "4階",
 time: "19日 9:00〜14:30"
},
{ name: "高3F",
 x: 1895, 
 y: 2111,
 width: 140, 
 height: 60,
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "4階",
 time: "19日 9:00〜14:30"
},
{ name: "高3G",
 x: 1897,
 y: 2242, 
 width: 140, 
 height: 60,
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "4階",
 time: "19日 9:00〜14:30"
},
{ name: "高3H", 
 x: 1897,
 y: 2377, 
 width: 140,
 height: 60,
 detail: true,
 description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。",
 location: "4階",
 time: "19日 9:00〜14:30"
},
{ name: "高3K",
 x: 2368, 
 y: 2555,
 width: 140, 
 height: 60,
 image:"images/police.jpeg",
 detail: true,
 description: "ドラマで見るような指紋採取や、犯人を逮捕する際の術、モンタージュという犯人のおおよその顔を特定するという体験を実施しています。ぜひお越しください。",
 location: "4階",
 time: "19日 10:00〜12:30"
},
{ name: "高3J",
 x: 2254, 
 y: 2554, 
 width: 140,
 height: 60,
 image:"images/police.jpeg",
 detail: true,
 description: "ドラマで見るような指紋採取や、犯人を逮捕する際の術、モンタージュという犯人のおおよその顔を特定するという体験を実施しています。ぜひお越しください。",
 location: "4階",
 time: "19日 10:00〜12:30"
},
{ name: "高3I",
 x: 2134,
 y: 2554,
 width: 140,
 height: 60,
 image:"images/police.jpeg",
 detail: true,
 description: "ドラマで見るような指紋採取や、犯人を逮捕する際の術、モンタージュという犯人のおおよその顔を特定するという体験を実施しています。ぜひお越しください。",
 location: "4階",
 time: "19日 10:00〜12:30"
},
{ name: "社会科準備室",
 x: 2014,
 y: 2552, 
 width: 220,
 height: 65
},
{ name: "ラーニングコモンズ",
 x: 1580,
 y: 2534,
 width: 240,
 height: 65,
 detail: true,
 image: "images/DSC01171.jpg",
 description: "高校美術部・インターアクト部・高1家庭科・有志生徒などによる展示を行っております。",
 location: "4階",
 time: "9:00〜14:30"
},
{ name: "中2A",
 x: 1219,
 y: 2552,
 width: 140,
 height: 60,
 detail: true,
 description: "部活動壁新聞の展示をしています。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "中2B",
 x: 1081,
 y: 2552,
 width: 140,
 height: 60,
 detail: true,
 description: "PTAの方の控室です。",
 location: "3階",
 time: "9:00〜14:30"
},
{ name: "中2C",
 x: 957,
 y: 2552, 
 width: 140, 
 height: 60 
},
{ name: "中2D", 
 x: 822,
 y: 2554,
 width: 140,
 height: 60 
},
{ name: "チャペル", 
 x: 724,
 y: 2194,
 width: 160,
 height: 65,
 image:"images/facility_img01.jpg",
 detail: true,
 description: "吹奏楽部・ハンドベル部・合唱部による公演をはじめ、有志によるステージや文化祭実行委員企画も開催しております。ぜひお楽しみください。",
 location: "4階",
 time: "9:15〜15:05"
},
{ name: "中学職員室",
 x: 1174,
 y: 2124,
 width: 200,
 height: 65
},
{ name: "副校長室",
 x: 1296,
 y: 2286,
 width: 180,
 height: 65
},
{ name: "総合学習室",
 x: 1459,
 y: 1974,
 width: 200,
 height: 65,
 image:"images/⑫総合学習室.jpg",
 detail: true,
 description: "美術部・中学美術科による作品の展示をしております。ぜひお立ち寄りください。",
 location: "4階",
 time: "9:00〜14:30"
},
{ name: "図書館 リブラリア",
 x: 1506, 
 y: 2116,
 width: 160, 
 height: 65,
 image:"images/facility_img11.jpg",
 detail: true,
 description: "蔵書数8万冊を突破している図書館です。ぜひご利用ください。",
 location: "4階",
 time: "18日 9:00～18:00　19日 9:00～15:00"
},
{ name: "スタディホール",
 x: 1508,
 y: 2232,
 width: 220,
 height: 65
}

];


// ========================================
// 地下
// ========================================

const basementPlaces = [

{ name: "情報科室",
 x: 634,
 y: 1209,
 width: 160,
 height: 65
},
{ name: "高2D モジャサバイバー",
 x: 642,
 y: 1636,
 width: 140,
 height: 60,
 image:"images/2-D.png",
 detail: true,
 description: "実験をきっかけに謎のウイルスが発生！感染した生徒は未知の生物「もじゃ」へと変貌してしまう。高二DクラスM棟地下1階で、みんなの助けを待っています。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "高2E 静かにして下さい。",
 x: 642,
 y: 1819,
 width: 140,
 height: 60,
 image:"images/2-E.png",
 detail: true,
 description: "音を出すと怪異が現れる呪われた学校。沈黙だけが唯一の安全――。静けさに支配された恐怖を、ぜひ体感してください。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "高2F まさしの見極め道場",
 x: 642,
 y: 2004,
 width: 140,
 height: 60,
 image:"images/2-F.png",
 detail: true,
 description: "五感を駆使して、本物と偽物、高額なのはどちらかを見極めよう！正答率に応じて、一流・二流のランクが決まります。ぜひお楽しみください。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "高2J 事件は2年J組で起きている",
 x: 623,
 y: 2363,
 width: 140,
 height: 60,
 image:"images/2-J.png",
 detail: true,
 description: "文化祭準備中に発生した事件を、教室内にあるヒントを見つけながら容疑者のアリバイを聞き、事件の謎を解き明かしていただきます。ぜひお楽しみください。",
 location: "2階",
 time: "9:00〜14:30"
},
{ name: "生徒会室 学園祭準備室",
 x: 395,
 y: 2571,
 width: 300,
 height: 70
},
{ name: "高2A 今日から動物デビュー。",
 x: 1343,
 y: 1441,
 width: 140,
 height: 60,
 image:"images/2-A.png",
 detail: true,
 description: "普段はなかなか味わえない「動物園の世界」を文化祭ならではの形で味わうことができます。ぜひお楽しみください。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "高2B",
 x: 1343,
 y: 1626,
 width: 140,
 height: 60,
 image:"images/2-B.png",
 detail: true,
 description: "風邪気味の担任・東サスケの体内を探索し、悪い菌を倒して健康な体にしましょう。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "高2C SGクエスト 2C",
 x: 1343,
 y: 1818,
 width: 140,
 height: 60,
 image:"images/2-C.png",
 detail: true,
 description: "勇者の皆さん、2Cギルド直属の優秀な案内人とともに2Cダンジョンに潜り、モンスターを討伐しましょう。",
 location: "地下階",
 time: "9:00〜14:30"
},
{ name: "教育相談室",
 x: 1287,
 y: 2170,
 width: 200,
 height: 65
},
{ name: "人権啓発委員会",
 x: 1287,
 y: 2289,
 width: 240,
 height: 65
}
 
];


// ========================================
// 今いるページが何階か判定
// ========================================

const path = decodeURIComponent(window.location.pathname);

let places = [];
let floorName = "";

if (path.includes("floor地下")) {
    places = basementPlaces;
    floorName = "地下階";
} else if (path.includes("floor1")) {
    places = floor1Places;
    floorName = "1階";
} else if (path.includes("floor2")) {
    places = floor2Places;
    floorName = "2階";
} else if (path.includes("floor3")) {
    places = floor3Places;
    floorName = "3階";
} else if (path.includes("floor4")) {
    places = floor4Places;
    floorName = "4階";
}


// ========================================
// HTML要素取得
// ========================================

const mapButtons = document.getElementById("map-buttons");

const popupOverlay = document.getElementById("popup-overlay");
const closeButton = document.getElementById("close-button");

const popupCategory = document.getElementById("popup-category");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupLocation = document.getElementById("popup-location");
const popupTime = document.getElementById("popup-time");
const popupImage = document.getElementById("popup-image");


// ========================================
// タップ領域を作成
// ========================================

if (mapButtons) {

    places.forEach(place => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "map-button";

        // 詳細情報がある場所
        if (place.detail === true) {
            button.classList.add("has-popup");
        }

        // 地図画像に文字があるため、ボタン上には文字を表示しない
        button.textContent = "";

        button.setAttribute(
            "aria-label",
            `${place.name}を開く`
        );

        // ========================================
        // クリスタ座標をパーセントに変換
        // ========================================

        const xPercent =
            (place.x / ORIGINAL_WIDTH) * 100;

        const yPercent =
            (place.y / ORIGINAL_HEIGHT) * 100;

        const widthPercent =
            ((place.width || 160) / ORIGINAL_WIDTH) * 100;

        const heightPercent =
            ((place.height || 65) / ORIGINAL_HEIGHT) * 100;


        // ========================================
        // タップ領域の位置・大きさ
        // ========================================

        button.style.left = `${xPercent}%`;
        button.style.top = `${yPercent}%`;

        button.style.width = `${widthPercent}%`;
        button.style.height = `${heightPercent}%`;

        // x・yを中心座標として扱う
        button.style.transform =
            "translate(-50%, -50%)";


       // ========================================
     　// タップ領域は透明にする
     　// ========================================
     button.style.background = "transparent";
     button.style.border = "none";

        // ========================================
        // クリック・タップ時の処理
        // ========================================

        button.addEventListener("click", () => {
            openPopup(place);
        });


        mapButtons.appendChild(button);

    });

}


// ========================================
// ポップアップを開く
// ========================================

function openPopup(place) {

    if (!popupOverlay) {
        return;
    }

    // カテゴリー
    popupCategory.textContent =
        place.detail === true
            ? "施設情報"
            : "校内マップ";


    // タイトル
    popupTitle.textContent =
        place.name;


    // 画像
    if (popupImage) {

        if (place.image) {

            // HTMLと同じフォルダに画像がある場合
            popupImage.src = place.image;
            popupImage.alt = place.name;
            popupImage.style.display = "block";

        } else {

            popupImage.removeAttribute("src");
            popupImage.alt = "";
            popupImage.style.display = "none";

        }

    }


    // 詳細情報がある場所
    if (place.detail === true) {

        popupDescription.textContent =
            place.description || "説明は準備中です。";

        popupLocation.textContent =
            place.location || floorName;

        popupTime.textContent =
            place.time || "―";

    } else {

        popupDescription.textContent =
            `${place.name}の場所です。`;

        popupLocation.textContent =
            floorName;

        popupTime.textContent =
            "―";

    }


    // ポップアップを表示
    popupOverlay.classList.add("active");

}


// ========================================
// ×ボタンで閉じる
// ========================================

if (closeButton && popupOverlay) {

    closeButton.addEventListener("click", () => {
        popupOverlay.classList.remove("active");
    });

}


// ========================================
// 背景をクリックして閉じる
// ========================================

if (popupOverlay) {

    popupOverlay.addEventListener("click", event => {

        if (event.target === popupOverlay) {
            popupOverlay.classList.remove("active");
        }

    });

}


// ========================================
// Escキーで閉じる
// ========================================

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        popupOverlay &&
        popupOverlay.classList.contains("active")
    ) {
        popupOverlay.classList.remove("active");
    }

});

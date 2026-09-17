const ORIGINAL_WIDTH = 2480;
const ORIGINAL_HEIGHT = 3508;

const floor1Places = [
  { name: "清教キャンパス", x: 825, y: 905, width: 220, height: 65, image: "images/seikyocampus.png.jpg", detail: true, description: "文房具の他、制服・体操服・制靴・上靴・体育館シューズなどの学校指定物品をいつでもお買い求めいただけるよう取り揃えております。", location: "1階", time: "1日目 9:00〜17:00　2日目 9:00～15:30" },
  { name: "食堂", x: 994, y: 1025, width: 160, height: 65, image: "", detail: true, description: "お食事や休憩にご利用いただけるほか、パンなどの軽食も販売しております。ぜひお気軽にお立ち寄りください。", location: "1階", time: "9:00〜14:30" },
  { name: "同窓会 模擬店", x: 1177, y: 431, width: 160, height: 65, detail: true, description: "同窓会主催の模擬店にて、フランクフルト・綿菓子・スモアなどを販売しております。ぜひお楽しみください。", location: "1階", time: "9:00〜14:30" },
  { name: "献血", x: 1409, y: 604, width: 160, height: 65, detail: true, description: "献血を行っております。皆さまのご協力をお願いいたします。", location: "1階", time: "9:00〜14:30" },
  { name: "同窓会本部 食品物販", x: 1432, y: 968, width: 160, height: 65, detail: true, description: "同窓会本部では、食品の販売を行っております。ぜひお立ち寄りください。", location: "1階", time: "9:00〜14:30" },
  { name: "国際交流委員会", x: 1317, y: 1387, width: 220, height: 65 },
  { name: "生活部 特活部", x: 1437, y: 1506, width: 220, height: 65 },
  { name: "進路部室", x: 1738, y: 1795, width: 180, height: 65 },
  { name: "進路相談室", x: 1792, y: 1936, width: 200, height: 65 },
  { name: "事務室", x: 1744, y: 2291, width: 160, height: 65 },
  { name: "保健室", x: 974, y: 2501, width: 160, height: 65, detail: true, description: "養護教諭が常駐しております。体調が優れない際などにご利用ください。" },
  { name: "高1G 角谷ずキッチン", x: 1964, y: 1978, width: 140, height: 60, image: "images/1-G.png", detail: true, description: "テントにて、ホットケーキ・ワッフル・カステラなど、甘くておいしいスイーツを販売しております。※高1G教室はイートインスペースとなっており、販売はしておりません。", location: "1階", time: "9:00〜14:30" },
  { name: "高2I ケバブ屋さん", x: 1967, y: 2110, width: 140, height: 60, image: "images/2-I.png", detail: true, description: "キャベツとジューシーなチキンをトルティーヤで包んだ、食べ応え抜群のケバブサンドを販売しております。※高2I教室では販売しておりません。", location: "1階", time: "9:00〜14:30" },
  { name: "第1体育館 ステージイベント", x: 1235, y: 2845, width: 500, height: 90, image: "", detail: true, description: "合唱部・ハンドベル部・演劇部・書道部・ダンス部・吹奏楽部による公演をはじめ、有志によるステージや特別企画も開催しております。ぜひお楽しみください。", location: "1階", time: "9:00〜17:30" },
  { name: "第2体育館", x: 602, y: 2851, width: 200, height: 65 },
  { name: "清教会館", x: 188, y: 2920, width: 180, height: 65 },
  { name: "英語科準備室", x: 2043, y: 2500, width: 220, height: 65 },
  { name: "数学科準備室", x: 2180, y: 2500, width: 220, height: 65 },
  { name: "高2K 今日、迷子になりました。惑星朝日編", x: 2320, y: 2496, width: 140, height: 60, image: "images/2-K.png", detail: true, description: "宇宙をテーマにした本格的な迷路や謎解き、写真映えするフォトスポットをご用意しております。ぜひお楽しみください。", location: "1階", time: "9:00〜14:30" },
  { name: "高2H 巨大すごろく", x: 2323, y: 1992, width: 140, height: 60, image: "images/2-H.png", detail: true, description: "巨大なすごろく形式の人生ゲームを開催しております。ぜひ挑戦して、ゴールを目指してください。", location: "1階", time: "9:00〜14:30" },
  { name: "高2G ばれずに宿題チャレンジ", x: 2321, y: 1848, width: 140, height: 60, image: "images/2-G.png", detail: true, description: "授業中の「内職」をテーマにした、スリル満点の体験企画を開催しております。ぜひ挑戦してみてください。", location: "1階", time: "9:00〜14:30" },
  { name: "同窓会企画 盲導犬イベント", x: 1167, y: 2589, width: 220, height: 65, detail: true, description: "同窓会主催の盲導犬の役割や視覚障がいについて楽しく学べるイベントを開催しております。ぜひお立ち寄りください。", location: "1階", time: "8:30〜17:00" },
  { name: "第2体育館", x: 595, y: 2856, width: 180, height: 65 }
];

const floor2Places = [
  { name: "美術工作室", x: 618, y: 847, width: 180, height: 65 },
  { name: "技術科室", x: 880, y: 1022, width: 160, height: 65 },
  { name: "講座室2", x: 1014, y: 1143, width: 160, height: 60 },
  { name: "講座室1", x: 1190, y: 1315, width: 160, height: 60 },
  { name: "高1E 福山パラダイス", x: 1317, y: 1438, width: 140, height: 60, image: "images/1-E.png", detail: true, description: "スーパーボールすくい・恋御籤（こいみくじ）・射的・輪投げなど、さまざまな縁日をお楽しみいただけます。ぜひお立ち寄りください。", location: "2階", time: "9:00〜14:30" },
  { name: "高1F WADARASHI", x: 1442, y: 1559, width: 140, height: 60, image: "images/1-F.png", detail: true, description: "ボールを蹴ってターゲットを狙い、得点を競うゲームです。高得点を目指して、ぜひ挑戦してみてください。", location: "2階", time: "9:00〜14:30" },
  { name: "第1化学室", x: 1839, y: 1743, width: 180, height: 65 },
  { name: "化学準備室", x: 2007, y: 1744, width: 200, height: 65 },
  { name: "第2化学室", x: 2172, y: 1744, width: 180, height: 65 },
  { name: "高1H 人間カーリング", x: 1672, y: 2158, width: 140, height: 60, image: "images/1-H.png", detail: true, description: "人が乗った台車を押して、進んだ距離を競うゲームです。どこまで進めるか、ぜひ挑戦してみてください。", location: "2階", time: "9:00〜14:30" },
  { name: "高1I 角には気をつけろ ~この先自己責任~", x: 1674, y: 2333, width: 140, height: 60, image: "images/1-I.png", detail: true, description: "恐怖に挑戦できるスリル満点の企画を開催しております。怖いものが苦手な方もぜひ挑戦してみてください。", location: "2階", time: "9:00〜14:30" },
  { name: "高1J かき氷はじめました", x: 1673, y: 2510, width: 140, height: 60, image: "images/1-J.png", detail: true, description: "氷の冷たさと鮮やかなシロップの甘さが広がる、定番のかき氷です。暑さを吹き飛ばすひんやりスイーツで、夏の涼をお楽しみください。", location: "2階", time: "9:00～14:30" },
  { name: "高校職員室", x: 2214, y: 2706, width: 200, height: 65 },
  { name: "校長室", x: 1296, y: 2737, width: 160, height: 65 },
  { name: "企画室", x: 1145, y: 2734, width: 160, height: 65 },
  { name: "入試部", x: 996, y: 2737, width: 160, height: 65 },
  { name: "教務室", x: 708, y: 2735, width: 160, height: 65 },
  { name: "宗教部", x: 560, y: 2732, width: 160, height: 65 },
  { name: "理事・理事長室", x: 158, y: 2702, width: 220, height: 65 }
];

const floor3Places = [
  { name: "トレーニングルーム", x: 171, y: 1096, width: 260, height: 65 },
  { name: "柔道場", x: 414, y: 1007, width: 160, height: 65 },
  { name: "体育科準備室", x: 260, y: 1454, width: 220, height: 65 },
  { name: "総合体育館", x: 514, y: 1437, width: 200, height: 65 },
  { name: "書道科教室", x: 1106, y: 1098, width: 200, height: 65 },
  { name: "書道科準備室", x: 1152, y: 1153, width: 240, height: 65 },
  { name: "第2美術室", x: 1249, y: 1232, width: 180, height: 65 },
  { name: "第1美術室", x: 1350, y: 1327, width: 180, height: 65 },
  { name: "アトリエ", x: 1447, y: 1427, width: 160, height: 65 },
  { name: "高3C 飲食スペース", x: 1628, y: 1599, width: 140, height: 60, image: "images/1-I.png", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00～14:30" },
  { name: "高3D 飲食スペース", x: 1726, y: 1684, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00～14:30" },
  { name: "第1生物室", x: 2028, y: 1828, width: 180, height: 65 },
  { name: "生物準備室", x: 2155, y: 1826, width: 200, height: 65 },
  { name: "第2生物室", x: 2284, y: 1826, width: 180, height: 65 },
  { name: "高1A 人形教室", x: 1898, y: 2012, width: 140, height: 60, image: "images/1-A.png", detail: true, description: "人形「エリーちゃん」が封印されたC棟3階の教室。「エリーちゃん遊ぼ」と言わないこと、決して振り向かないこと。掟を破ったあなたを待つものとは……？ぜひお楽しみください。", location: "3階", time: "9:00〜14:30" },
  { name: "高1B", x: 1897, y: 2146, width: 140, height: 60, image: "images/1-B.png", detail: true, description: "舞台は空港のターミナル。違和感を探し、制限時間内にどこまでターミナルを進むことができるのか。ぜひ挑戦してみてください。", location: "3階", time: "9:00〜14:30" },
  { name: "高1C", x: 1898, y: 2281, width: 140, height: 60, image: "images/1-C.png", detail: true, description: "動物になりきって、謎解きしながら動物園の檻から脱出するゲームです。ぜひチャレンジしてみてください。", location: "3階", time: "9:00〜14:30" },
  { name: "高1D", x: 1897, y: 2413, width: 140, height: 60, image: "images/1-D.png", detail: true, description: "海のような空間で、個性豊かな魚や人間を釣ることができます。ぜひお楽しみください。", location: "3階", time: "9:00〜14:30" },
  { name: "ピロティ", x: 1478, y: 2182, width: 160, height: 65 },
  { name: "中3C", x: 1266, y: 2030, width: 140, height: 60, image: "images/1-A.png", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00〜14:30" },
  { name: "中3A", x: 1146, y: 2032, width: 140, height: 60, image: "images/IMG_6224.jpeg", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00〜14:30" },
  { name: "イングリッシュルーム", x: 1244, y: 2322, width: 280, height: 65, image: "", detail: true, description: "展示コーナー", location: "3階", time: "9:00〜14:30" },
  { name: "チャペル", x: 724, y: 2214, width: 160, height: 65, image: "", detail: true, description: "吹奏楽部・ハンドベル部・合唱部による公演をはじめ、有志によるステージや文化祭実行委員企画も開催しております。ぜひお楽しみください。", location: "3階", time: "9:15〜15:05" },
  { name: "中1D", x: 824, y: 2582, width: 140, height: 60, image: "images/7Q2A6026.JPG", detail: true, description: "", location: "3階", time: "9:00〜14:30" },
  { name: "中1C", x: 956, y: 2580, width: 140, height: 60 },
  { name: "中1B", x: 1090, y: 2582, width: 140, height: 60, image: "images/1-B.png", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00〜14:30" },
  { name: "中1A", x: 1224, y: 2584, width: 140, height: 60, image: "images/1-A.png", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "3階", time: "9:00〜14:30" },
  { name: "中3B", x: 1454, y: 2582, width: 140, height: 60, image: "images/7Q2A6026.JPG", detail: true, description: "", location: "3階", time: "9:00〜14:30" },
  { name: "中3D", x: 1586, y: 2580, width: 140, height: 60, image: "images/2-B.png", detail: true, description: "社会科・国語科の調べ学習等の展示", location: "3階", time: "9:00〜14:30" },
  { name: "中学講座室", x: 1716, y: 2578, width: 200, height: 65, image: "", detail: true, description: "社会科・国語科の調べ学習等の展示", location: "3階", time: "9:00〜14:30" },
  { name: "国語科準備室", x: 2023, y: 2587, width: 220, height: 65 },
  { name: "高3A", x: 2141, y: 2585, width: 140, height: 60 },
  { name: "高3B", x: 2258, y: 2584, width: 140, height: 60 },
  { name: "高3L", x: 2377, y: 2582, width: 140, height: 60 }
];

const floor4Places = [
  { name: "総合体育館", x: 372, y: 1191, width: 200, height: 65 },
  { name: "第2音楽室", x: 1026, y: 1194, width: 180, height: 65 },
  { name: "音楽練習室", x: 1165, y: 1335, width: 220, height: 65 },
  { name: "第1音楽室", x: 1280, y: 1428, width: 180, height: 65 },
  { name: "物理室2", x: 1415, y: 1579, width: 160, height: 60 },
  { name: "物理準備室", x: 1552, y: 1669, width: 200, height: 65 },
  { name: "物理室1", x: 1641, y: 1764, width: 160, height: 60 },
  { name: "レクチャールーム", x: 2155, y: 1801, width: 240, height: 65 },
  { name: "高3E", x: 1891, y: 1974, width: 140, height: 60, image: "images/1-A.png", detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3F", x: 1895, y: 2111, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3G", x: 1897, y: 2242, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3H", x: 1897, y: 2377, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3K", x: 2368, y: 2555, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3J", x: 2254, y: 2554, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "高3I", x: 2134, y: 2554, width: 140, height: 60, detail: true, description: "お食事や休憩にご利用いただけます。来校者の方はもちろん、中学生もご利用いただけますので、ぜひお立ち寄りください。", location: "4階", time: "9:00〜14:30" },
  { name: "社会科準備室", x: 2014, y: 2552, width: 220, height: 65 },
  { name: "ラーニングコモンズ", x: 1580, y: 2534, width: 240, height: 65, detail: true, image: "images/DSC01171.jpg", description: "展示", location: "4階", time: "9:00〜14:30" },
  { name: "中2A", x: 1219, y: 2552, width: 140, height: 60, image: "", detail: true, description: "部活動壁新聞の展示をしています。", location: "2階", time: "9:00〜14:30" },
  { name: "中2B", x: 1081, y: 2552, width: 140, height: 60, detail: true, description: "PTAの方の控室です。", location: "3階", time: "9:00〜14:30" },
  { name: "中2C", x: 957, y: 2552, width: 140, height: 60 },
  { name: "中2D", x: 822, y: 2554, width: 140, height: 60 },
  { name: "チャペル", x: 724, y: 2194, width: 160, height: 65 },
  { name: "中学職員室", x: 1174, y: 2124, width: 200, height: 65 },
  { name: "副校長室", x: 1296, y: 2286, width: 180, height: 65 },
  { name: "総合学習室", x: 1459, y: 1974, width: 200, height: 65, image: "", detail: true, description: "作品展示コーナー", location: "4階", time: "9:00〜14:30" },
  { name: "図書館", x: 1506, y: 2116, width: 160, height: 65, image: "", detail: true, description: "卒論等展示コーナー", location: "4階", time: "9:00〜14:30" },
  { name: "スタディホール", x: 1508, y: 2232, width: 220, height: 65 }
];

const basementPlaces = [
  { name: "情報科室", x: 634, y: 1209, width: 160, height: 65 },
  { name: "高2D", x: 642, y: 1636, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "高2E", x: 642, y: 1819, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "高2F", x: 642, y: 2004, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "高2J", x: 623, y: 2363, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "生徒会室 学園祭準備室", x: 395, y: 2571, width: 300, height: 70 },
  { name: "高2A", x: 1343, y: 1441, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "高2B", x: 1343, y: 1626, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "高2C", x: 1343, y: 1818, width: 140, height: 60, image: "", detail: true, description: "展示・催し物", location: "地下階", time: "9:00〜14:30" },
  { name: "教育相談室", x: 1287, y: 2170, width: 200, height: 65 },
  { name: "人権啓発委員会", x: 1287, y: 2289, width: 240, height: 65 }
];

let rawPath = window.location.pathname;
let decodedPath = rawPath;
try {
  decodedPath = decodeURIComponent(rawPath);
  try {
    decodedPath = decodeURIComponent(decodedPath);
  } catch {}
} catch {}

let places = [];
let floorName = "";

const pLower = decodedPath.toLowerCase();
const rawLower = rawPath.toLowerCase();

if (pLower.includes("floor1") || rawLower.includes("floor1")) {
  places = floor1Places;
  floorName = "1階";
} else if (pLower.includes("floor2") || rawLower.includes("floor2")) {
  places = floor2Places;
  floorName = "2階";
} else if (pLower.includes("floor3") || rawLower.includes("floor3")) {
  places = floor3Places;
  floorName = "3階";
} else if (pLower.includes("floor4") || rawLower.includes("floor4")) {
  places = floor4Places;
  floorName = "4階";
} else if (pLower.includes("floorb1") || rawLower.includes("floorb1")) {
  places = basementPlaces;
  floorName = "地下階";
} else {
  places = basementPlaces;
  floorName = "地下階";
}

const mapButtons = document.getElementById("map-buttons");
const popupOverlay = document.getElementById("popup-overlay");
const closeButton = document.getElementById("close-button");
const popupCategory = document.getElementById("popup-category");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupLocation = document.getElementById("popup-location");
const popupTime = document.getElementById("popup-time");
const popupImage = document.getElementById("popup-image");

if (popupImage) {
  popupImage.onerror = () => {
    popupImage.style.display = "none";
  };
}

if (mapButtons) {
  places.forEach(place => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-button";

    if (place.detail === true) {
      button.classList.add("has-popup");
    }

    button.textContent = "";
    button.setAttribute("aria-label", `${place.name}を開く`);

    const xPercent = (place.x / ORIGINAL_WIDTH) * 100;
    const yPercent = (place.y / ORIGINAL_HEIGHT) * 100;
    const widthPercent = ((place.width || 160) / ORIGINAL_WIDTH) * 100;
    const heightPercent = ((place.height || 65) / ORIGINAL_HEIGHT) * 100;

    button.style.left = `${xPercent}%`;
    button.style.top = `${yPercent}%`;
    button.style.width = `${widthPercent}%`;
    button.style.height = `${heightPercent}%`;
    button.style.transform = "translate(-50%, -50%)";
    button.style.background = "transparent";
    button.style.border = "none";

    button.addEventListener("click", () => {
      openPopup(place);
    });

    mapButtons.appendChild(button);
  });
}

function openPopup(place) {
  if (!popupOverlay) {
    return;
  }

  popupCategory.textContent = place.detail === true ? "施設情報" : "校内マップ";
  popupTitle.textContent = place.name;

  if (popupImage) {
    if (place.image && place.image.trim() !== "" && place.image !== "images/") {
      popupImage.src = place.image;
      popupImage.alt = place.name;
      popupImage.style.display = "block";
    } else {
      popupImage.removeAttribute("src");
      popupImage.alt = "";
      popupImage.style.display = "none";
    }
  }

  if (place.detail === true) {
    popupDescription.textContent = place.description || "説明は準備中です。";
    popupLocation.textContent = place.location || floorName;
    popupTime.textContent = place.time || "―";
  } else {
    popupDescription.textContent = `${place.name}の場所です。`;
    popupLocation.textContent = floorName;
    popupTime.textContent = "―";
  }

  popupOverlay.classList.add("active");
}

if (closeButton && popupOverlay) {
  closeButton.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });
}

if (popupOverlay) {
  popupOverlay.addEventListener("click", event => {
    if (event.target === popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  });
}

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    popupOverlay &&
    popupOverlay.classList.contains("active")
  ) {
    popupOverlay.classList.remove("active");
  }
});

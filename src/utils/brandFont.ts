export interface BrandFontOption {
  id: string;
  name: string;
  nameEn: string;
  displayText: string;
  fontClass: string;
  letterSpacing: string;
  fontWeight: string;
  tagline: string;
  taglineEn: string;
  accentNote: string;
}

export const BRAND_FONT_OPTIONS: BrandFontOption[] = [
  {
    id: 'cormorant-serif',
    name: 'Cormorant Garamond (文芸・美術セリフ)',
    nameEn: 'Cormorant Garamond (Editorial Serif)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-cormorant',
    letterSpacing: 'tracking-wide',
    fontWeight: 'font-semibold',
    tagline: '上質な学術・芸術誌を思わせるクラシックで知的なセリフ体',
    taglineEn: 'Refined classical serif with artistic and academic elegance',
    accentNote: 'Refined Serif / Intellectual Composure',
  },
  {
    id: 'cinzel-roman',
    name: 'Cinzel Roman (伝統・碑文クラシック)',
    nameEn: 'Cinzel Roman (Classic Monumental)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-cinzel',
    letterSpacing: 'tracking-[0.25em]',
    fontWeight: 'font-semibold',
    tagline: 'ローマ碑文骨格による格調高い重厚感と知性',
    taglineEn: 'Monumental roman serif with dignified composure',
    accentNote: 'All Caps / Wide Tracking',
  },
  {
    id: 'syne-studio',
    name: 'Syne Contemporary (現代ギャラリー・建築)',
    nameEn: 'Syne Contemporary (Modern Gallery)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-syne',
    letterSpacing: 'tracking-tight',
    fontWeight: 'font-bold',
    tagline: '現代アートや建築スタジオのような洗練された個性の佇まい',
    taglineEn: 'Architectural display sans with refined edge',
    accentNote: 'Modern Edge / Studio',
  },
  {
    id: 'dm-minimal',
    name: 'DM Sans Monochrome (アーバン・ミニマル)',
    nameEn: 'DM Sans Monochrome (Urban Minimal)',
    displayText: 'SGfes · 公式サイト',
    fontClass: 'font-dm',
    letterSpacing: 'tracking-[0.2em]',
    fontWeight: 'font-bold',
    tagline: '過度な装飾を削ぎ落とした、大人びた都会派の直線美',
    taglineEn: 'Sharp, disciplined modern sans with separator',
    accentNote: 'Dot Separator / Sharp',
  },
  {
    id: 'shippori-dignified',
    name: 'Shippori Mincho (凛・和モダン明朝)',
    nameEn: 'Shippori Mincho (Dignified Japanese/Latin)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-shippori',
    letterSpacing: 'tracking-widest',
    fontWeight: 'font-semibold',
    tagline: '墨の落ち着きと端正な活字の伝統を継承する明朝スタイル',
    taglineEn: 'Serene calligraphic typography with deep calm',
    accentNote: 'Serene Serif / Japanese Craft',
  },
  {
    id: 'outfit-clean',
    name: 'Outfit Clean (端正なモダンサンセリフ)',
    nameEn: 'Outfit Clean (Clean Modern Sans)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-outfit',
    letterSpacing: 'tracking-tight',
    fontWeight: 'font-bold',
    tagline: '派手さを抑え、ニュートラルで日常に溶け込む上質感',
    taglineEn: 'Neutral, unpretentious modern elegance',
    accentNote: 'Understated / Clean',
  },
  {
    id: 'cinzel-mixed',
    name: 'Cinzel Clean (格調高いセリフ小文字混在)',
    nameEn: 'Cinzel Mixed (Serif Mixed-Case)',
    displayText: 'SGfes公式サイト',
    fontClass: 'font-cinzel',
    letterSpacing: 'tracking-widest',
    fontWeight: 'font-bold',
    tagline: 'トラディショナルなセリフ体をコンパクトに配した大人の知性',
    taglineEn: 'Academic serif paired with balanced rhythm',
    accentNote: 'Academic / Structured',
  }
];

const STORAGE_KEY = 'seikyo_brand_font_id';

export function getSelectedBrandFont(): BrandFontOption {
  if (typeof window === 'undefined') {
    return BRAND_FONT_OPTIONS[0];
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  const found = BRAND_FONT_OPTIONS.find(f => f.id === saved);
  return found || BRAND_FONT_OPTIONS[0];
}

export function saveSelectedBrandFont(id: string): BrandFontOption {
  const target = BRAND_FONT_OPTIONS.find(f => f.id === id) || BRAND_FONT_OPTIONS[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, target.id);
    window.dispatchEvent(new CustomEvent('brand-font-changed', { detail: target }));
  }
  return target;
}

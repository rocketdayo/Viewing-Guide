import { ClassProject } from '../types';
import { fetchRawTextDirect, parseFullCSV } from './gasClientFetcher';

export const CLASS_PROJECTS_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1RgOhPj3OjILxv1oGNzfDxLucK68WbX0T2eNGXpHjdjI/edit?gid=0#gid=0';

export interface ClassProjectSheetItem {
  classId: string;
  className: string;
  title: string;
  catchphrase: string;
  category: string;
  location: string;
  description: string;
  duration: string;
  capacity: string;
  rules: string;
  ticket: string;
  menuPrice: string;
}

const CLASS_METADATA_MAP: Record<
  string,
  {
    grade: '1年' | '2年';
    classNumber: string;
    building: '本館' | '新館';
    floor: string;
    defaultLocation: string;
  }
> = {
  '1A': { grade: '1年', classNumber: '1年A組', building: '本館', floor: '2F', defaultLocation: '本館 2F 1-A教室' },
  '1B': { grade: '1年', classNumber: '1年B組', building: '本館', floor: '2F', defaultLocation: '本館 2F 1-B教室' },
  '1C': { grade: '1年', classNumber: '1年C組', building: '本館', floor: '2F', defaultLocation: '本館 2F 1-C教室' },
  '1D': { grade: '1年', classNumber: '1年D組', building: '本館', floor: '2F', defaultLocation: '本館 2F 1-D教室' },
  '1E': { grade: '1年', classNumber: '1年E組', building: '本館', floor: '2F', defaultLocation: '本館 2F 1-E教室' },
  '1F': { grade: '1年', classNumber: '1年F組', building: '本館', floor: '3F', defaultLocation: '本館 3F 1-F教室' },
  '1G': { grade: '1年', classNumber: '1年G組', building: '本館', floor: '3F', defaultLocation: '本館 3F 1-G教室' },
  '1H': { grade: '1年', classNumber: '1年H組', building: '本館', floor: '3F', defaultLocation: '本館 3F 1-H教室' },
  '1I': { grade: '1年', classNumber: '1年I組', building: '本館', floor: '3F', defaultLocation: '本館 3F 1-I教室' },
  '1J': { grade: '1年', classNumber: '1年J組', building: '本館', floor: '3F', defaultLocation: '本館 3F 1-J教室' },
  '2A': { grade: '2年', classNumber: '2年A組', building: '新館', floor: '3F', defaultLocation: '新館 3F 2-A教室' },
  '2B': { grade: '2年', classNumber: '2年B組', building: '新館', floor: '3F', defaultLocation: '新館 3F 2-B教室' },
  '2C': { grade: '2年', classNumber: '2年C組', building: '新館', floor: '3F', defaultLocation: '新館 3F 2-C教室' },
  '2D': { grade: '2年', classNumber: '2年D組', building: '新館', floor: '3F', defaultLocation: '新館 3F 2-D教室' },
  '2E': { grade: '2年', classNumber: '2年E組', building: '新館', floor: '4F', defaultLocation: '新館 4F 2-E教室' },
  '2F': { grade: '2年', classNumber: '2年F組', building: '新館', floor: '4F', defaultLocation: '新館 4F 2-F教室' },
  '2G': { grade: '2年', classNumber: '2年G組', building: '新館', floor: '4F', defaultLocation: '新館 4F 2-G教室' },
  '2H': { grade: '2年', classNumber: '2年H組', building: '新館', floor: '4F', defaultLocation: '新館 4F 2-H教室' },
  '2I': { grade: '2年', classNumber: '2年I組', building: '新館', floor: '4F', defaultLocation: '新館 4F 2-I教室' },
  '2J': { grade: '2年', classNumber: '2年J組', building: '新館', floor: '2F', defaultLocation: '新館 2F 2-J教室' },
  '2K': { grade: '2年', classNumber: '2年K組', building: '新館', floor: '2F', defaultLocation: '新館 2F 2-K教室' },
};

function normalizeStandardCategory(
  raw: string
): '演劇・劇' | 'アトラクション・体験' | '展示・研究' | 'カフェ・飲食' | '縁日・ゲーム' | 'ステージ・音楽' | '特別企画・進路' {
  const val = raw || '';
  if (
    val.includes('カフェ') ||
    val.includes('飲食') ||
    val.includes('キッチン') ||
    val.includes('かき氷') ||
    val.includes('ケバブ')
  ) {
    return 'カフェ・飲食';
  }
  if (
    val.includes('縁日') ||
    val.includes('ゲーム') ||
    val.includes('祭り') ||
    val.includes('すごろく') ||
    val.includes('スポーツ')
  ) {
    return '縁日・ゲーム';
  }
  if (
    val.includes('脱出') ||
    val.includes('ホラー') ||
    val.includes('お化け屋敷') ||
    val.includes('アトラクション') ||
    val.includes('体験') ||
    val.includes('RPG') ||
    val.includes('探索') ||
    val.includes('サバイバル') ||
    val.includes('ステルス') ||
    val.includes('謎解き') ||
    val.includes('格付け')
  ) {
    return 'アトラクション・体験';
  }
  if (val.includes('展示') || val.includes('研究') || val.includes('フォト')) {
    return '展示・研究';
  }
  if (val.includes('劇') || val.includes('演劇')) {
    return '演劇・劇';
  }
  if (val.includes('ステージ') || val.includes('音楽')) {
    return 'ステージ・音楽';
  }
  return 'アトラクション・体験';
}

function parseRulesList(rulesRaw: string): string[] {
  if (!rulesRaw || !rulesRaw.trim()) return [];
  const text = rulesRaw.trim();
  const lines = text
    .split(/\r?\n|　{2,}|、(?=[^\d])/)
    .map((s) => s.trim().replace(/^[・\-\*]\s*/, ''))
    .filter((s) => s.length > 0);
  return lines.length > 0 ? lines : [text];
}

export function parseClassProjectsCsv(rawText: string): Record<string, ClassProjectSheetItem> {
  const rows = parseFullCSV(rawText);
  if (!rows || rows.length === 0) return {};

  const result: Record<string, ClassProjectSheetItem> = {};

  let startRow = 0;
  if (rows.length > 0 && rows[0][0] && rows[0][0].toLowerCase().includes('id')) {
    startRow = 1;
  }

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const rawId = (row[0] || '').trim().toUpperCase().replace(/[\s\-_]/g, '');
    if (!rawId) continue;

    const matchedKey = Object.keys(CLASS_METADATA_MAP).find(
      (k) => k.toUpperCase() === rawId
    );

    if (!matchedKey) continue;

    const className = (row[1] || '').trim();
    const title = (row[2] || '').trim();
    const catchphrase = (row[3] || '').trim();
    const category = (row[4] || '').trim();
    const locationRaw = (row[5] || '').trim();
    const description = (row[6] || '').trim();
    const duration = (row[7] || '').trim();
    const capacity = (row[8] || '').trim();
    const rules = (row[9] || '').trim();
    const ticket = (row[10] || '').trim();
    const menuPrice = (row[11] || '').trim();

    result[matchedKey] = {
      classId: matchedKey,
      className: className || CLASS_METADATA_MAP[matchedKey].classNumber,
      title,
      catchphrase,
      category,
      location: locationRaw,
      description,
      duration,
      capacity,
      rules,
      ticket,
      menuPrice,
    };
  }

  return result;
}

export function applyClassProjectsSync(
  existingProjects: ClassProject[],
  sheetData: Record<string, ClassProjectSheetItem>
): { updatedProjects: ClassProject[]; syncedCount: number } {
  if (!sheetData || Object.keys(sheetData).length === 0) {
    return { updatedProjects: existingProjects, syncedCount: 0 };
  }

  let count = 0;

  const updatedProjects = existingProjects.map((proj) => {
    const classKey = Object.keys(CLASS_METADATA_MAP).find((k) => {
      const pIdNorm = proj.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const kNorm = k.toLowerCase();
      if (pIdNorm === `p${kNorm}` || pIdNorm === kNorm) return true;
      if (proj.classNumber && proj.classNumber.replace(/\s+/g, '').includes(k)) return true;
      return false;
    });

    if (!classKey || !sheetData[classKey]) {
      return proj;
    }

    const item = sheetData[classKey];
    count++;

    const meta = CLASS_METADATA_MAP[classKey];

    const standardCat = item.category ? normalizeStandardCategory(item.category) : proj.category;
    const rawCat = item.category || proj.rawCategory || proj.category;

    let finalLocation = meta.defaultLocation;
    if (item.location && item.location.length > 0 && item.location.length < 35) {
      if (item.location.includes(meta.building) || item.location.includes('教室')) {
        finalLocation = item.location;
      } else {
        finalLocation = `${meta.defaultLocation}（${item.location}）`;
      }
    }

    const parsedRules = item.rules ? parseRulesList(item.rules) : proj.rules || [];

    const isTicketRequired =
      item.ticket.includes('あり') ||
      item.ticket.toLowerCase().includes('yes') ||
      item.ticket.includes('要') ||
      proj.congestion.ticketRequired;

    let updatedLevel = proj.congestion.level;
    if (isTicketRequired && updatedLevel === 'smooth') {
      updatedLevel = 'ticket';
    }

    const menuItemsList: string[] = proj.menuItems ? [...proj.menuItems] : [];
    if (item.menuPrice && !menuItemsList.some((m) => m.includes(item.menuPrice))) {
      menuItemsList.unshift(`${item.title || proj.title}：${item.menuPrice}`);
    }

    return {
      ...proj,
      title: item.title || proj.title,
      catchphrase: item.catchphrase || proj.catchphrase,
      category: standardCat,
      rawCategory: rawCat,
      classNumber: meta.classNumber,
      location: finalLocation,
      building: meta.building,
      floor: meta.floor,
      description: item.description || proj.description,
      fullDetails: item.description || proj.fullDetails || proj.description,
      duration: item.duration || proj.duration,
      capacity: item.capacity || proj.capacity,
      rules: parsedRules.length > 0 ? parsedRules : proj.rules,
      ticketText: item.ticket || (isTicketRequired ? 'あり' : 'なし'),
      menuPrice: item.menuPrice || proj.menuPrice,
      menuItems: menuItemsList.length > 0 ? menuItemsList : proj.menuItems,
      congestion: {
        ...proj.congestion,
        level: updatedLevel,
        ticketRequired: isTicketRequired,
      },
    };
  });

  return { updatedProjects, syncedCount: count };
}

export async function fetchLiveClassProjects(
  sheetUrl: string = CLASS_PROJECTS_SHEET_URL
): Promise<{
  success: boolean;
  data?: Record<string, ClassProjectSheetItem>;
  error?: string;
}> {
  try {
    const isStaticHost =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
        window.location.protocol === 'file:');

    if (!isStaticHost) {
      try {
        const res = await fetch(
          `/api/class-projects-live?url=${encodeURIComponent(sheetUrl)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            return { success: true, data: json.data };
          }
        }
      } catch {}
    }

    const rawText = await fetchRawTextDirect(sheetUrl);
    if (!rawText) {
      return { success: false, error: 'Empty text from sheet' };
    }

    const parsed = parseClassProjectsCsv(rawText);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch class projects' };
  }
}

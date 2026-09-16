import { ClassProject } from '../types';

export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[ー－―‐－֊‑‒–—―〜～]/g, '-')
    .replace(/([0-9])\s*[-_]\s*([a-zA-Z])/g, '$1-$2')
    .replace(/([0-9])\s+([a-zA-Z])/g, '$1$2')
    .toLowerCase()
    .trim();
}

export function getProjectClassCodes(project: ClassProject): string[] {
  const codes: string[] = [];
  const classNumNorm = normalizeSearchText(project.classNumber || '');
  if (classNumNorm) {
    codes.push(classNumNorm);
  }

  const m = classNumNorm.match(/([0-9])(?:年)?[-_]?([a-z])(?:組)?/);
  let grade = '';
  let letter = '';
  if (m) {
    grade = m[1];
    letter = m[2].toLowerCase();
  } else {
    const idM = (project.id || '').match(/^p-([0-9])([a-z])$/i);
    if (idM) {
      grade = idM[1];
      letter = idM[2].toLowerCase();
    }
  }

  if (grade && letter) {
    codes.push(`${grade}${letter}`);
    codes.push(`${grade}-${letter}`);
    codes.push(`${grade} ${letter}`);
    codes.push(`${grade}_${letter}`);
    codes.push(`${grade}年${letter}組`);
    codes.push(`${grade}年${letter}`);
    codes.push(`${grade}年-${letter}組`);
    codes.push(`${grade}年-${letter}`);
    codes.push(`${grade}${letter}組`);
    codes.push(`${grade}-${letter}組`);
    codes.push(`p-${grade}${letter}`);
  }

  return codes;
}

export function matchProjectSearch(project: ClassProject, query: string): boolean {
  if (!query) return true;
  const rawQuery = query.trim();
  if (!rawQuery) return true;

  const normalizedQuery = normalizeSearchText(rawQuery);
  const classCodes = getProjectClassCodes(project);

  const tokens = normalizedQuery.split(/[\s,、]+/).filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    const classMatch = token.match(/^([0-9])[-_年\s]*([a-z])(?:年)?(?:組)?$/);
    if (classMatch) {
      const targetGrade = classMatch[1];
      const targetLetter = classMatch[2];
      const targetCode = `${targetGrade}${targetLetter}`;
      return classCodes.some((c) => {
        const cClean = c.replace(/[\s\-_年組]/g, '');
        return cClean === targetCode || c.includes(token);
      });
    }

    if (classCodes.some((code) => code.includes(token))) {
      return true;
    }

    const title = normalizeSearchText(project.title || '');
    const catchphrase = normalizeSearchText(project.catchphrase || '');
    const description = normalizeSearchText(project.description || '');
    const location = normalizeSearchText(project.location || '');
    const category = normalizeSearchText(project.category || '');
    const organizer = normalizeSearchText(project.organizer || '');
    const fullDetails = normalizeSearchText(project.fullDetails || '');
    const statusNote = normalizeSearchText(project.congestion?.statusNote || '');
    const detailNote = normalizeSearchText(project.congestion?.detailNote || '');
    const menuItems = (project.menuItems || []).map((m) => normalizeSearchText(m));

    return (
      title.includes(token) ||
      catchphrase.includes(token) ||
      description.includes(token) ||
      location.includes(token) ||
      category.includes(token) ||
      organizer.includes(token) ||
      fullDetails.includes(token) ||
      statusNote.includes(token) ||
      detailNote.includes(token) ||
      menuItems.some((m) => m.includes(token))
    );
  });
}

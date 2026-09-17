import { ClassProject } from '../types';

export const normalizeClassCode = (input: string | null | undefined): string => {
  if (!input) return '';
  const half = input
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/ー|—|–/g, '-')
    .trim();

  const match = half.match(/([1-3])\s*(?:年)?\s*[-_/\s]?\s*([A-Za-z])(?:\s*組)?/i);
  if (match) {
    return `${match[1]}-${match[2].toUpperCase()}`;
  }

  const idMatch = half.match(/p-([1-3])([a-z])/i);
  if (idMatch) {
    return `${idMatch[1]}-${idMatch[2].toUpperCase()}`;
  }

  return '';
};

export const getClassPosterFileName = (project: ClassProject | string | null | undefined): string | null => {
  if (!project) return null;
  if (typeof project === 'string') {
    const directCode = normalizeClassCode(project);
    if (directCode) return `${directCode}.pdf`;
    const clean = project.replace(/^.*[/\\]/, '');
    if (clean.endsWith('.pdf')) {
      const stem = clean.replace(/\.pdf$/i, '');
      const code = normalizeClassCode(stem);
      return code ? `${code}.pdf` : clean;
    }
    return null;
  }

  if (project.posterPdf) {
    const parts = project.posterPdf.split('/');
    const file = parts[parts.length - 1];
    if (file) {
      const code = normalizeClassCode(file.replace(/\.pdf$/i, ''));
      if (code) return `${code}.pdf`;
      return file;
    }
  }

  if (project.classNumber) {
    const code = normalizeClassCode(project.classNumber);
    if (code) return `${code}.pdf`;
  }

  if (project.id) {
    const code = normalizeClassCode(project.id);
    if (code) return `${code}.pdf`;
  }

  if (project.location) {
    const code = normalizeClassCode(project.location);
    if (code) return `${code}.pdf`;
  }

  return null;
};

export const getClassPosterStem = (project: ClassProject | string | null | undefined): string | null => {
  const fileName = getClassPosterFileName(project);
  if (!fileName) return null;
  return fileName.replace(/\.pdf$/i, '');
};

export const getClassPosterUrl = (project: ClassProject | string | null | undefined): string | null => {
  const fileName = getClassPosterFileName(project);
  if (fileName) {
    return `/classposter/${fileName}`;
  }
  return null;
};

export const getClassPosterImageUrl = (project: ClassProject | string | null | undefined): string | null => {
  const stem = getClassPosterStem(project);
  if (stem) {
    return `/classposter/${stem}.png`;
  }
  return null;
};


import { ClassProject } from '../types';

export const getClassPosterFileName = (project: ClassProject | null): string | null => {
  if (!project) return null;
  if (project.posterPdf) {
    const parts = project.posterPdf.split('/');
    return parts[parts.length - 1] || null;
  }

  const numMatch = project.classNumber?.match(/([123])\s*年\s*([A-Za-z])\s*組/);
  if (numMatch) {
    return `${numMatch[1]}-${numMatch[2].toUpperCase()}.pdf`;
  }

  const shortMatch = project.classNumber?.match(/([123])\s*([A-Za-z])/);
  if (shortMatch) {
    return `${shortMatch[1]}-${shortMatch[2].toUpperCase()}.pdf`;
  }

  const idMatch = project.id?.match(/^p-([123])([a-z])$/i);
  if (idMatch) {
    return `${idMatch[1]}-${idMatch[2].toUpperCase()}.pdf`;
  }

  return null;
};

export const getClassPosterUrl = (project: ClassProject | null): string | null => {
  if (!project) return null;
  if (project.posterPdf) return project.posterPdf;
  const fileName = getClassPosterFileName(project);
  if (fileName) {
    return `/classposter/${fileName}`;
  }
  return null;
};

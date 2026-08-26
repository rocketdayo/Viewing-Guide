import { AppDataState } from '../types';
import { INITIAL_APP_DATA } from '../data/defaultData';

const STORAGE_KEY = 'seikyo_fes_2026_data_v12';
const BOOKMARKS_KEY = 'seikyo_fes_2026_bookmarks';

export function sanitizeAppData(parsed: any): AppDataState {
  if (!parsed || typeof parsed !== 'object') {
    return { ...INITIAL_APP_DATA };
  }

  // Filter projects to only active class projects (filter out any alumni- ids if previously cached)
  let mergedProjects = Array.isArray(parsed.projects)
    ? parsed.projects.filter((p: any) => !p.id.startsWith('alumni-'))
    : INITIAL_APP_DATA.projects;
  
  if (mergedProjects.length !== INITIAL_APP_DATA.projects.length) {
    mergedProjects = INITIAL_APP_DATA.projects;
  }

  // Filter announcements
  let cleanAnnouncements = parsed.announcements;
  if (Array.isArray(cleanAnnouncements)) {
    cleanAnnouncements = cleanAnnouncements.filter((a: any) => 
      !a.title?.includes("熱中症対策") && 
      !a.title?.includes("静かにして下さい") &&
      !a.title?.includes("同窓会特別企画") &&
      a.id !== 'ann-alumni-special'
    );
    INITIAL_APP_DATA.announcements.forEach((initA) => {
      if (!cleanAnnouncements.some((a: any) => a.id === initA.id)) {
        cleanAnnouncements.push(initA);
      }
    });
  } else {
    cleanAnnouncements = INITIAL_APP_DATA.announcements;
  }

  const isOldCongestionUrl = !parsed.gasCongestionUrl || parsed.gasCongestionUrl.includes("2PACX-1vTBKmXAMNiZq6cWlBGWzq93VhPJNl6kK2A7G3jzjT9kOUXzX0REBwkC0ACBNHox4q1mQVW0zBMLPbBR");
  const isOldAnnouncementUrl = !parsed.gasAnnouncementUrl || parsed.gasAnnouncementUrl.includes("2PACX-1v") || parsed.gasAnnouncementUrl.includes("141285595");

  return {
    ...INITIAL_APP_DATA,
    ...parsed,
    festivalTitle: INITIAL_APP_DATA.festivalTitle,
    festivalTheme: INITIAL_APP_DATA.festivalTheme,
    gasCongestionUrl: isOldCongestionUrl ? INITIAL_APP_DATA.gasCongestionUrl : parsed.gasCongestionUrl,
    gasAnnouncementUrl: isOldAnnouncementUrl ? INITIAL_APP_DATA.gasAnnouncementUrl : parsed.gasAnnouncementUrl,
    projects: mergedProjects,
    // Always use official greetings and schedules
    greetings: INITIAL_APP_DATA.greetings,
    schedules: INITIAL_APP_DATA.schedules,
    announcements: cleanAnnouncements,
  };
}

export function loadAppData(): AppDataState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sanitizeAppData(parsed);
    }
  } catch (e) {
    console.error('Failed to load local app data:', e);
  }
  return { ...INITIAL_APP_DATA };
}

export function saveAppData(data: AppDataState): void {
  try {
    const sanitized = sanitizeAppData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    
    // Skip backend server sync if running on static hosts like GitHub Pages
    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.protocol === 'file:'
    );
    if (isStaticHost) {
      return;
    }

    // Also sync to server for cross-user online persistence if backend exists
    fetch('/api/app-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    }).catch(() => {
      // Quietly ignore if backend is unavailable
    });
  } catch (e) {
    console.error('Failed to save app data:', e);
  }
}

export async function fetchServerAppData(): Promise<AppDataState | null> {
  // Skip on static hosts like GitHub Pages
  const isStaticHost = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.protocol === 'file:'
  );
  if (isStaticHost) {
    return null;
  }

  try {
    const res = await fetch('/api/app-data');
    if (!res.ok) {
      return null;
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }
    const json = await res.json();
    if (json && json.success && json.data) {
      return sanitizeAppData(json.data);
    }
  } catch {
    // Quietly ignore backend fetch errors
  }
  return null;
}

export function saveBookmarks(bookmarks: string[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // ignore
  }
}

export function resetAppDataToDefault(): AppDataState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset app data:', e);
  }
  return { ...INITIAL_APP_DATA };
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): string[] {
  try {
    const current = getBookmarks();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

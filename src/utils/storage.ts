import { AppDataState } from '../types';
import { INITIAL_APP_DATA } from '../data/defaultData';

const STORAGE_KEY = 'seikyo_fes_2026_data_v7';
const BOOKMARKS_KEY = 'seikyo_fes_2026_bookmarks';

export function loadAppData(): AppDataState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('seikyo_fes_2026_data_v6');
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // Upgrade any old spreadsheet URLs to current official URLs
      const isOldCongestionUrl = !parsed.gasCongestionUrl || parsed.gasCongestionUrl.includes("2PACX-1vTBKmXAMNiZq6cWlBGWzq93VhPJNl6kK2A7G3jzjT9kOUXzX0REBwkC0ACBNHox4q1mQVW0zBMLPbBR");
      const isOldAnnouncementUrl = !parsed.gasAnnouncementUrl || parsed.gasAnnouncementUrl.includes("2PACX-1v") || parsed.gasAnnouncementUrl.includes("141285595");

      // Filter out old dummy announcements
      let cleanAnnouncements = parsed.announcements;
      if (Array.isArray(cleanAnnouncements)) {
        cleanAnnouncements = cleanAnnouncements.filter((a: any) => 
          !a.title?.includes("熱中症対策") && !a.title?.includes("静かにして下さい")
        );
      } else {
        cleanAnnouncements = INITIAL_APP_DATA.announcements;
      }

      // Ensure principal greeting is updated if it contains old placeholder
      let cleanGreetings = parsed.greetings;
      if (Array.isArray(cleanGreetings)) {
        cleanGreetings = cleanGreetings.map((g: any) => {
          if (g.id === 'greet-principal' && (g.name === '清教 学' || !g.message.includes('森野章二'))) {
            return INITIAL_APP_DATA.greetings[0];
          }
          return g;
        });
      } else {
        cleanGreetings = INITIAL_APP_DATA.greetings;
      }

      return {
        ...INITIAL_APP_DATA,
        ...parsed,
        festivalTitle: INITIAL_APP_DATA.festivalTitle,
        festivalTheme: INITIAL_APP_DATA.festivalTheme,
        gasCongestionUrl: isOldCongestionUrl ? INITIAL_APP_DATA.gasCongestionUrl : parsed.gasCongestionUrl,
        gasAnnouncementUrl: isOldAnnouncementUrl ? INITIAL_APP_DATA.gasAnnouncementUrl : parsed.gasAnnouncementUrl,
        projects: parsed.projects || INITIAL_APP_DATA.projects,
        greetings: cleanGreetings,
        announcements: cleanAnnouncements,
        schedules: parsed.schedules || INITIAL_APP_DATA.schedules,
      };
    }
  } catch (e) {
    console.error('Failed to load local app data:', e);
  }
  return { ...INITIAL_APP_DATA };
}

export function saveAppData(data: AppDataState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Also sync to server for cross-user online persistence
    fetch('/api/app-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(err => {
      console.warn('Background server sync failed:', err);
    });
  } catch (e) {
    console.error('Failed to save app data:', e);
  }
}

export async function fetchServerAppData(): Promise<AppDataState | null> {
  try {
    const res = await fetch('/api/app-data');
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (e) {
    console.warn('Failed to fetch server app data:', e);
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

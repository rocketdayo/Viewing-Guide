import { GasSyncResult, GasParsedItem } from './congestionSync';
import { AnnouncementSyncResult } from './announcementSync';
import { Announcement } from '../types';

export const DEFAULT_CONGESTION_URL =
  "https://docs.google.com/spreadsheets/d/154F3vcdcOSyMc55VbY9qPCey4JtL7mW1pCOWBrDVuZc/edit?gid=0#gid=0";
export const DEFAULT_ANNOUNCEMENT_URL =
  "https://docs.google.com/spreadsheets/d/1Ajv5ErGHjhIz740IaB-IqhywYkV66dREwOdk7G3EiEg/edit?gid=0#gid=0";

export function getGoogleSpreadsheetGvizUrl(targetUrl: string): string {
  const fetchUrl = targetUrl.trim();
  const match = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1] !== "e") {
    const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }
  return getGoogleSpreadsheetCsvUrl(targetUrl);
}

/**
 * Convert Google Spreadsheet view/edit/pub URLs to a direct CSV export URL
 */
export function getGoogleSpreadsheetCsvUrl(targetUrl: string): string {
  let fetchUrl = targetUrl.trim();
  if (!fetchUrl.includes("docs.google.com/spreadsheets")) {
    return fetchUrl;
  }
  if (fetchUrl.includes("/pub") && !fetchUrl.includes("output=csv")) {
    return fetchUrl + (fetchUrl.includes("?") ? "&" : "?") + "output=csv";
  }
  const match = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1] !== "e") {
    const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
  }
  return fetchUrl;
}

/**
 * Robust CSV line parser to handle quotes and commas inside cells
 */
export function parseCSVLine(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse raw CSV text from Google Spreadsheet into Congestion data
 */
export function parseGasCongestionCsv(rawText: string): Record<string, GasParsedItem> {
  if (!rawText || typeof rawText !== 'string') return {};
  const lines = rawText.split(/\r?\n/);
  const results: Record<string, GasParsedItem> = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    const rawClassCode = parts[0]?.trim() || "";

    // Normalize class code: e.g. "1A", "1-A", "1年A組", "1a" -> "1A"
    const cleaned = rawClassCode.replace(/[\s\-_]/g, "").toUpperCase();
    const classMatch = cleaned.match(/^([0-9])(?:年)?([A-Z])(?:組)?$/);
    if (!classMatch) continue;
    const classCode = `${classMatch[1]}${classMatch[2]}`;

    const statusText = parts[1]?.trim() || "";
    const waitRaw = parts[2]?.trim() || "0";
    const detailText = parts[3]?.trim() || "";

    const waitNumMatch = waitRaw.match(/(\d+)/);
    const waitMinutes = waitNumMatch ? parseInt(waitNumMatch[1], 10) : 0;

    let level: "smooth" | "moderate" | "crowded" | "ticket" | "closed" = "smooth";
    if (statusText.includes("大混") || statusText.includes("混んでいる") || statusText.includes("混雑") || waitMinutes >= 35) {
      level = "crowded";
    } else if (statusText.includes("普通") || statusText.includes("やや") || waitMinutes >= 15) {
      level = "moderate";
    } else if (statusText.includes("券") || statusText.includes("整理券")) {
      level = "ticket";
    } else if (
      statusText.includes("休") ||
      statusText.includes("終了") ||
      statusText.includes("閉") ||
      statusText.includes("準備")
    ) {
      level = "closed";
    } else if (statusText.includes("空") || statusText.includes("スムーズ") || statusText.includes("なし") || waitMinutes <= 5) {
      level = "smooth";
    }

    results[classCode] = {
      classCode,
      statusText,
      waitTimeMinutes: waitMinutes,
      detailText,
      level,
      rawWait: waitRaw,
    };
  }

  return results;
}

/**
 * Parse raw CSV or JSON text into Announcements
 */
export function parseAnnouncementCsvOrJson(rawText: string): Announcement[] {
  if (!rawText || typeof rawText !== 'string') return [];
  const trimmed = rawText.trim();

  // Try parsing JSON if GAS Web App returns JSON
  if (trimmed.startsWith("[") || (trimmed.startsWith("{") && !trimmed.startsWith("<!DOCTYPE"))) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : (parsed.announcements || parsed.data || []);
      if (Array.isArray(items)) {
        return items.map((item: any, i: number) => {
          let cat: "重要" | "混雑情報" | "プログラム変更" | "一般案内" = "一般案内";
          const catStr = (item.category || item.type || "").toString();
          if (catStr.includes("重要")) cat = "重要";
          else if (catStr.includes("混雑")) cat = "混雑情報";
          else if (catStr.includes("プログラム")) cat = "プログラム変更";

          return {
            id: item.id || `ann-${i + 1}`,
            timestamp: item.timestamp || item.date || item.time || new Date().toLocaleString("ja-JP"),
            category: cat,
            title: (item.title || item.name || "").trim(),
            content: (item.content || item.detail || item.body || "").trim(),
            isPinned: Boolean(item.isPinned || item.pinned),
          };
        }).filter((a: Announcement) => a.title);
      }
    } catch {
      // Not JSON, continue to CSV parsing
    }
  }

  const lines = rawText.split(/\r?\n/);
  const announcements: Announcement[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    const dateRaw = parts[0]?.trim();
    const categoryRaw = parts[1]?.trim();
    const titleRaw = parts[2]?.trim();
    const contentRaw = parts[3]?.trim();
    const isPinnedRaw = (parts[4] || "").trim().toLowerCase();

    if (!titleRaw) continue;

    let category: "重要" | "混雑情報" | "プログラム変更" | "一般案内" = "一般案内";
    if (categoryRaw && categoryRaw.includes("重要")) category = "重要";
    else if (categoryRaw && categoryRaw.includes("混雑")) category = "混雑情報";
    else if (categoryRaw && categoryRaw.includes("プログラム")) category = "プログラム変更";

    const isPinned = isPinnedRaw === "true" || isPinnedRaw === "1" || isPinnedRaw === "yes" || isPinnedRaw.includes("ピン");

    announcements.push({
      id: `ann-${i}`,
      timestamp: dateRaw || new Date().toLocaleString("ja-JP"),
      category,
      title: titleRaw,
      content: contentRaw || "",
      isPinned,
    });
  }

  return announcements;
}

/**
 * Fetch raw text with direct fetch (gviz/export) and fallback to CORS proxies
 */
export async function fetchRawTextDirect(targetUrl: string): Promise<string> {
  const gvizUrl = getGoogleSpreadsheetGvizUrl(targetUrl);
  const csvUrl = getGoogleSpreadsheetCsvUrl(targetUrl);

  // Attempt 1: Direct gviz fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(gvizUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const text = await response.text();
      if (text && !text.trim().startsWith("<!DOCTYPE")) {
        return text;
      }
    }
  } catch {
    // Direct gviz failed, try other methods
  }

  // Attempt 2: Direct CSV export fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(csvUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const text = await response.text();
      if (text && !text.trim().startsWith("<!DOCTYPE")) {
        return text;
      }
    }
  } catch {
    // Direct CSV export failed, try proxy
  }

  // Attempt 3: CORS Proxy via allorigins
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(csvUrl)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const text = await response.text();
      if (text && !text.trim().startsWith("<!DOCTYPE")) {
        return text;
      }
    }
  } catch {
    // allorigins failed
  }

  // Attempt 4: CORS Proxy via corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(csvUrl)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const text = await response.text();
      if (text && !text.trim().startsWith("<!DOCTYPE")) {
        return text;
      }
    }
  } catch {
    // corsproxy failed
  }

  throw new Error("スプレッドシート・GASからの直接取得に失敗しました");
}

/**
 * Main Congestion fetcher (supports both backend API and static browser client)
 */
export async function fetchLiveGasCongestionSmart(gasUrl?: string): Promise<GasSyncResult> {
  const targetUrl = gasUrl || DEFAULT_CONGESTION_URL;

  const isStaticHost = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.protocol === 'file:'
  );

  // First, try Express backend /api/congestion-live if available and NOT on static host
  if (!isStaticHost) {
    try {
      const apiUrl = `/api/congestion-live?url=${encodeURIComponent(targetUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json: GasSyncResult = await response.json();
        if (json.success && json.data) {
          return json;
        }
      }
    } catch {
      // Backend API unavailable or failed
    }
  }

  // Fallback / Static host: Direct client browser fetch
  try {
    const rawText = await fetchRawTextDirect(targetUrl);
    const data = parseGasCongestionCsv(rawText);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      count: Object.keys(data).length,
      data,
    };
  } catch (err: any) {
    console.warn("Direct congestion fetch fallback:", err.message);
    return {
      success: false,
      error: err.message || "データ取得に失敗しました",
    };
  }
}

/**
 * Main Announcement fetcher (supports both backend API and static browser client)
 */
export async function fetchLiveAnnouncementsSmart(gasUrl?: string): Promise<AnnouncementSyncResult> {
  const targetUrl = gasUrl || DEFAULT_ANNOUNCEMENT_URL;

  const isStaticHost = typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.protocol === 'file:'
  );

  // First, try Express backend /api/announcements-live if available and NOT on static host
  if (!isStaticHost) {
    try {
      const apiUrl = `/api/announcements-live?url=${encodeURIComponent(targetUrl)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const json: AnnouncementSyncResult = await response.json();
        if (json.success && json.data !== undefined) {
          return json;
        }
      }
    } catch {
      // Backend API unavailable or failed
    }
  }

  // Fallback / Static host: Direct client browser fetch
  try {
    const rawText = await fetchRawTextDirect(targetUrl);
    const announcements = parseAnnouncementCsvOrJson(rawText);
    return {
      success: true,
      data: announcements,
    };
  } catch (err: any) {
    console.warn("Direct announcement fetch fallback:", err.message);
    return {
      success: false,
      error: err.message || "お知らせデータの取得に失敗しました",
    };
  }
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { ClassProject, CongestionLevel } from '../types';

export interface GasParsedItem {
  classCode: string; // e.g. "1A", "2K"
  statusText: string; // e.g. "混んでいる", "普通", "空いている"
  waitTimeMinutes: number;
  detailText?: string; // e.g. 待ち時間の隣に記載される詳細・注意事項
  level: CongestionLevel;
  rawWait?: string;
}

export interface GasSyncResult {
  success: boolean;
  timestamp?: string;
  count?: number;
  data?: Record<string, GasParsedItem>;
  error?: string;
}

/**
 * Maps class code (e.g. "1A", "2K") to project classNumber pattern / id
 */
export function matchClassCodeToProject(classCode: string, project: ClassProject): boolean {
  const normalizedCode = classCode.replace(/[\s\-_]/g, '').toUpperCase(); // e.g. "1A"
  
  // Format check: "1年A組", "1-A", "1年 A組" -> "1A"
  const m = project.classNumber.replace(/\s+/g, '').match(/([0-9])(?:年)?([A-Za-z])(?:組)?/);
  if (m) {
    const pCode = `${m[1]}${m[2]}`.toUpperCase();
    if (pCode === normalizedCode) return true;
  }

  // Id check: "p-1a" -> "1A"
  const idMatch = project.id.match(/^p-([0-9])([a-z])$/i);
  if (idMatch) {
    const idCode = `${idMatch[1]}${idMatch[2]}`.toUpperCase();
    if (idCode === normalizedCode) return true;
  }

  // Direct includes check
  if (project.classNumber.replace(/\s+/g, '').toUpperCase().includes(normalizedCode)) return true;

  return false;
}

/**
 * Fetch latest live congestion data from the backend API /api/congestion-live
 */
export async function fetchLiveGasCongestion(gasUrl?: string): Promise<GasSyncResult> {
  try {
    const apiUrl = gasUrl 
      ? `/api/congestion-live?url=${encodeURIComponent(gasUrl)}`
      : '/api/congestion-live';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json: GasSyncResult = await response.json();
    return json;
  } catch (err: any) {
    console.warn('Live congestion fetch failed:', err);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'タイムアウト（15秒経過）' : (err.message || 'データ取得に失敗しました'),
    };
  }
}

/**
 * Applies parsed GAS data to the app's project list
 */
export function applyGasSyncToProjects(
  projects: ClassProject[],
  gasData: Record<string, GasParsedItem>
): { updatedProjects: ClassProject[]; syncedCount: number } {
  let syncedCount = 0;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updatedProjects = projects.map((p) => {
    // Find matching class in GAS data
    const matchedKey = Object.keys(gasData).find((code) => matchClassCodeToProject(code, p));

    if (matchedKey && gasData[matchedKey]) {
      const gasItem = gasData[matchedKey];
      syncedCount++;

      return {
        ...p,
        congestion: {
          ...p.congestion,
          level: gasItem.level,
          waitTimeMinutes: gasItem.waitTimeMinutes,
          lastUpdated: `${timeStr} (GAS同期)`,
          statusNote: gasItem.statusText || p.congestion.statusNote,
          detailNote: gasItem.detailText || p.congestion.detailNote,
          ticketRequired: gasItem.level === 'ticket' ? true : p.congestion.ticketRequired,
        },
      };
    }

    return p;
  });

  return { updatedProjects, syncedCount };
}

/**
 * React Hook for automatic real-time sync with Google Apps Script
 */
export function useGasCongestionSync(
  gasUrl: string,
  projects: ClassProject[],
  onUpdateProjects: (updated: ClassProject[]) => void,
  intervalSeconds: number = 180 // default 180s
) {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState<number>(0);
  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  const performSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const result = await fetchLiveGasCongestion(gasUrl);
      if (result.success && result.data && Object.keys(result.data).length > 0) {
        const { updatedProjects, syncedCount: count } = applyGasSyncToProjects(
          projectsRef.current,
          result.data
        );

        onUpdateProjects(updatedProjects);
        setSyncedCount(count);
        const now = new Date();
        setLastSyncTime(
          `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
        );
      } else if (result.error) {
        setSyncError(result.error);
      }
    } catch (err: any) {
      setSyncError(err.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, [gasUrl, onUpdateProjects]);

  // Initial sync on mount or URL change
  useEffect(() => {
    performSync();
  }, [gasUrl, performSync]);

  // Periodic timer
  useEffect(() => {
    if (intervalSeconds <= 0) return;

    const timer = setInterval(() => {
      performSync();
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds, performSync]);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncedCount,
    syncNow: performSync,
  };
}

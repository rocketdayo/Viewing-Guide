import { useState, useEffect, useCallback, useRef } from 'react';
import { ClassProject, CongestionLevel } from '../types';
import { fetchLiveGasCongestionSmart } from './gasClientFetcher';

export interface GasParsedItem {
  classCode: string;
  statusText: string;
  waitTimeMinutes: number;
  detailText?: string;
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

export function matchClassCodeToProject(classCode: string, project: ClassProject): boolean {
  const normalizedCode = classCode.replace(/[\s\-_]/g, '').toUpperCase();
  
  const m = project.classNumber.replace(/\s+/g, '').match(/([0-9])(?:年)?([A-Za-z])(?:組)?/);
  if (m) {
    const pCode = `${m[1]}${m[2]}`.toUpperCase();
    if (pCode === normalizedCode) return true;
  }

  const idMatch = project.id.match(/^p-([0-9])([a-z])$/i);
  if (idMatch) {
    const idCode = `${idMatch[1]}${idMatch[2]}`.toUpperCase();
    if (idCode === normalizedCode) return true;
  }

  if (project.classNumber.replace(/\s+/g, '').toUpperCase().includes(normalizedCode)) return true;

  return false;
}

export async function fetchLiveGasCongestion(gasUrl?: string): Promise<GasSyncResult> {
  return fetchLiveGasCongestionSmart(gasUrl);
}

export function applyGasSyncToProjects(
  projects: ClassProject[],
  gasData: Record<string, GasParsedItem>
): { updatedProjects: ClassProject[]; syncedCount: number } {
  let syncedCount = 0;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const updatedProjects = projects.map((p) => {
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

export function useGasCongestionSync(
  gasUrl: string,
  projects: ClassProject[],
  onUpdateProjects: (updated: ClassProject[]) => void,
  intervalSeconds: number = 60
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

        if (count > 0) {
          onUpdateProjects(updatedProjects);
        }

        setSyncedCount(count);
        setLastSyncTime(new Date().toLocaleTimeString());
      } else if (!result.success) {
        setSyncError(result.error || 'GASからのデータ取得に失敗しました');
      }
    } catch (err: any) {
      setSyncError(err.message || '同期エラーが発生しました');
    } finally {
      setIsSyncing(false);
    }
  }, [gasUrl, onUpdateProjects]);

  useEffect(() => {
    performSync();

    if (intervalSeconds <= 0) return;

    const timer = setInterval(() => {
      performSync();
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [performSync, intervalSeconds]);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncedCount,
    refetch: performSync,
  };
}

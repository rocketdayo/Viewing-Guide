import { useState, useEffect, useCallback } from 'react';
import { Announcement } from '../types';
import { fetchLiveAnnouncementsSmart } from './gasClientFetcher';

export interface AnnouncementSyncResult {
  success: boolean;
  data?: Announcement[];
  error?: string;
}

export async function fetchLiveAnnouncements(gasUrl?: string): Promise<AnnouncementSyncResult> {
  return fetchLiveAnnouncementsSmart(gasUrl);
}

export function useAnnouncementSync(
  gasUrl: string | undefined,
  currentAnnouncements: Announcement[],
  onUpdateAnnouncements: (updated: Announcement[]) => void,
  intervalSeconds: number = 30
) {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const performSync = useCallback(async () => {
    if (!gasUrl) return; // Do nothing if URL is not configured
    
    setIsSyncing(true);
    setSyncError(null);
    try {
      const result = await fetchLiveAnnouncements(gasUrl);
      if (result.success && result.data !== undefined) {
        onUpdateAnnouncements(result.data);
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
  }, [gasUrl, onUpdateAnnouncements]);

  useEffect(() => {
    performSync();
  }, [gasUrl, performSync]);

  useEffect(() => {
    if (!gasUrl || intervalSeconds <= 0) return;
    const timer = setInterval(() => {
      performSync();
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [gasUrl, intervalSeconds, performSync]);

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    syncNow: performSync,
  };
}

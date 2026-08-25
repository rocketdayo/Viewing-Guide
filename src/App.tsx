import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ClassesView } from './components/ClassesView';
import { ClassDetailModal } from './components/ClassDetailModal';
import { AdminView } from './components/AdminView';
import { ScheduleView } from './components/ScheduleView';
import { CampusMapView } from './components/CampusMapView';
import { CongestionLiveView } from './components/CongestionLiveView';
import { MyTimelineView } from './components/MyTimelineView';
import { SearchModal } from './components/SearchModal';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { Footer } from './components/Footer';
import { 
  loadAppData, 
  saveAppData, 
  getBookmarks, 
  saveBookmarks, 
  resetAppDataToDefault,
  fetchServerAppData
} from './utils/storage';
import { Bookmark } from 'lucide-react';
import { AppDataState, ClassProject } from './types';
import { fetchLiveGasCongestion, applyGasSyncToProjects } from './utils/congestionSync';
import { fetchLiveAnnouncements } from './utils/announcementSync';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [appData, setAppData] = useState<AppDataState>(() => loadAppData());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Synchronized state references to prevent re-creation loops
  const appDataRef = React.useRef(appData);
  appDataRef.current = appData;

  const isSyncingRef = React.useRef(false);

  // Top level initial background sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState(0);

  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);
    setSyncError(null);

    const currentData = appDataRef.current;
    let hasUpdatedProjects = false;
    let hasUpdatedAnnouncements = false;

    try {
      // 1. Sync Congestion Data from data endpoint
      const congestionUrl = currentData.gasCongestionUrl;
      if (congestionUrl) {
        const cResult = await fetchLiveGasCongestion(congestionUrl);

        if (cResult.success && cResult.data && Object.keys(cResult.data).length > 0) {
          const { updatedProjects, syncedCount: count } = applyGasSyncToProjects(
            appDataRef.current.projects || [],
            cResult.data
          );

          if (count > 0) {
            setAppData((prev) => {
              const next = { ...prev, projects: updatedProjects };
              saveAppData(next);
              return next;
            });
            hasUpdatedProjects = true;
            setSyncedCount(count);
          }
        }
      }

      // 2. Sync Announcements Data from data endpoint
      const announcementUrl = currentData.gasAnnouncementUrl;
      if (announcementUrl) {
        const aResult = await fetchLiveAnnouncements(announcementUrl);
        if (aResult.success && aResult.data !== undefined) {
          // If the spreadsheet is empty or rows were deleted, sync the empty/updated list
          setAppData((prev) => {
            const next = { ...prev, announcements: aResult.data! };
            saveAppData(next);
            return next;
          });
          hasUpdatedAnnouncements = true;
        }
      }

      if (hasUpdatedProjects || hasUpdatedAnnouncements) {
        setLastSyncTime(new Date());
      }
    } catch (e: any) {
      console.error('Background sync failed:', e);
      setSyncError(e.message || 'データ同期エラー');
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch latest app data from server on mount for online sync
    fetchServerAppData().then((serverData) => {
      if (serverData) {
        setAppData(serverData);
        saveAppData(serverData);
      }
    });

    syncNow();
    const timer = setInterval(() => {
      syncNow();
    }, 20000);
    return () => clearInterval(timer);
  }, [syncNow]);

  const handleNavigate = (page: string, anchorOrProjectId?: string) => {
    if (page === 'classDetail' && anchorOrProjectId) {
      setSelectedProjectId(anchorOrProjectId);
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (anchorOrProjectId) {
      setTimeout(() => {
        const el = document.getElementById(anchorOrProjectId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleDataUpdate = (newData: AppDataState) => {
    setAppData(newData);
    saveAppData(newData);
  };

  const handleResetData = () => {
    const defaultData = resetAppDataToDefault();
    setAppData(defaultData);
  };

  const handleToggleBookmark = (id: string) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  const selectedProject = useMemo(() => 
    selectedProjectId ? appData.projects.find((p) => p.id === selectedProjectId) || null : null
  , [selectedProjectId, appData.projects]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-20 sm:pb-0 flex flex-col justify-between">
      <div>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          appData={appData}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenToc={() => setIsTocOpen(true)}
          bookmarksCount={bookmarks.length}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 min-h-[calc(100vh-14rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {currentPage === 'home' && (
                <HomeView 
                  appData={appData} 
                  onNavigate={handleNavigate}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onOpenToc={() => setIsTocOpen(true)}
                  bookmarks={bookmarks}
                />
              )}
              
              {currentPage === 'schedule' && (
                <ScheduleView 
                  schedules={appData?.schedules || []}
                />
              )}
              
              {currentPage === 'classes' && (
                <ClassesView 
                  projects={appData?.projects || []}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  onNavigateToCongestion={() => handleNavigate('congestion')}
                />
              )}
              
              {currentPage === 'congestion' && (
                <CongestionLiveView 
                  gasUrl={appData.gasCongestionUrl}
                  projects={appData?.projects || []}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onSyncNow={syncNow}
                  isSyncing={isSyncing}
                  lastSyncTime={lastSyncTime ? lastSyncTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null}
                  syncError={syncError}
                />
              )}
              
              {currentPage === 'bookmarks' && (
                <MyTimelineView
                  bookmarkedProjects={(appData?.projects || []).filter((p) => bookmarks.includes(p.id))}
                  allProjects={appData?.projects || []}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                  onNavigate={handleNavigate}
                />
              )}
              
              {currentPage === 'map' && (
                <CampusMapView 
                  projects={appData?.projects || []}
                  onSelectProject={(id) => setSelectedProjectId(id)}
                />
              )}
              
              {currentPage === 'admin' && (
                <AdminView 
                  appData={appData} 
                  onUpdateAppData={handleDataUpdate}
                  onResetData={handleResetData}
                  isAdminLoggedIn={isAdminLoggedIn}
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer 
        appData={appData}
        onNavigate={handleNavigate}
        onOpenToc={() => setIsTocOpen(true)} 
      />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        bookmarksCount={bookmarks.length}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        appData={appData}
        onSelectProject={(id) => setSelectedProjectId(id)}
        onNavigate={handleNavigate}
      />

      {/* Table of Contents Modal */}
      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        currentPage={currentPage}
        appData={appData}
        onNavigate={handleNavigate}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />

      {/* Class Detail Modal */}
      {selectedProject && (
        <ClassDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          isBookmarked={bookmarks.includes(selectedProject.id)}
          onToggleBookmark={handleToggleBookmark}
          onNavigateToCongestion={() => handleNavigate('congestion')}
        />
      )}
    </div>
  );
}

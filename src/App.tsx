import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { FaqMannersView } from './components/FaqMannersView';
import { PwaInstallBanner } from './components/PwaInstallBanner';
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
import { AppDataState } from './types';
import { fetchLiveGasCongestion, applyGasSyncToProjects } from './utils/congestionSync';
import { fetchLiveAnnouncements } from './utils/announcementSync';
import { motion, AnimatePresence } from 'motion/react';

export function getAppBasePath(): string {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  if (pathname.startsWith('/Viewing-Guide')) {
    return '/Viewing-Guide';
  }
  const segments = pathname.split('/').filter(Boolean);
  const reservedPages = ['home', 'schedule', 'classes', 'congestion', 'bookmarks', 'timeline', 'map', 'faq', 'admin', 'project'];
  if (segments.length > 0 && !reservedPages.includes(segments[0]) && !segments[0].includes('.')) {
    return `/${segments[0]}`;
  }
  return '';
}

export function getRelativePath(): string {
  if (typeof window === 'undefined') return '/home';
  const basePath = getAppBasePath();
  let pathname = window.location.pathname;
  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length);
  }
  pathname = pathname.replace(/\/+$/, '') || '/';
  return pathname;
}

interface RouteState {
  page: string;
  projectId: string | null;
  anchor: string | null;
}

function parseCurrentUrl(): RouteState {
  if (typeof window === 'undefined') {
    return { page: 'home', projectId: null, anchor: null };
  }

  const relPath = getRelativePath();
  const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
  const searchParams = new URLSearchParams(window.location.search);
  const paramProjectId = searchParams.get('project') || searchParams.get('id');

  const projectMatch = relPath.match(/^\/(?:project|classes)\/([a-zA-Z0-9_-]+)$/);
  const reservedPages = ['home', 'schedule', 'classes', 'congestion', 'bookmarks', 'timeline', 'map', 'faq', 'admin'];
  
  if (projectMatch && !reservedPages.includes(projectMatch[1])) {
    return {
      page: 'classes',
      projectId: projectMatch[1],
      anchor: hash && hash !== 'toc' && hash !== 'menu' && hash !== 'search' ? hash : null,
    };
  }

  let page = 'home';
  if (relPath === '/schedule') page = 'schedule';
  else if (relPath === '/classes') page = 'classes';
  else if (relPath === '/congestion') page = 'congestion';
  else if (relPath === '/bookmarks' || relPath === '/timeline') page = 'bookmarks';
  else if (relPath === '/map') page = 'map';
  else if (relPath === '/faq') page = 'faq';
  else if (relPath === '/admin') page = 'admin';
  else if (relPath === '/' || relPath === '/home') page = 'home';
  else {
    page = 'home';
  }

  return {
    page,
    projectId: paramProjectId || null,
    anchor: hash && hash !== 'toc' && hash !== 'menu' && hash !== 'search' ? hash : null,
  };
}

export default function App() {
  const [appData, setAppData] = useState<AppDataState>(() => loadAppData());
  
  const initialRoute = parseCurrentUrl();
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialRoute.projectId);
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(() => typeof window !== 'undefined' && (window.location.hash === '#toc' || window.location.hash === '#menu'));
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(() => typeof window !== 'undefined' && window.location.hash === '#search');
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);

  const appDataRef = React.useRef(appData);
  appDataRef.current = appData;

  const isSyncingRef = React.useRef(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [, setSyncedCount] = useState(0);

  const syncCongestion = useCallback(async () => {
    const currentData = appDataRef.current;
    const congestionUrl = currentData.gasCongestionUrl;
    if (!congestionUrl) return;

    try {
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
          setSyncedCount(count);
          setLastSyncTime(new Date());
        }
      }
    } catch (e: any) {
      console.error('Congestion sync error:', e);
    }
  }, []);

  const syncAnnouncements = useCallback(async () => {
    const currentData = appDataRef.current;
    const announcementUrl = currentData.gasAnnouncementUrl;
    if (!announcementUrl) return;

    try {
      const aResult = await fetchLiveAnnouncements(announcementUrl);
      if (aResult.success && aResult.data !== undefined) {
        setAppData((prev) => {
          const next = { ...prev, announcements: aResult.data! };
          saveAppData(next);
          return next;
        });
        setLastSyncTime(new Date());
      }
    } catch (e: any) {
      console.error('Announcement sync error:', e);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);
    setSyncError(null);

    try {
      await Promise.allSettled([
        syncCongestion(),
        syncAnnouncements(),
      ]);
    } catch (e: any) {
      console.error('Background sync failed:', e);
      setSyncError(e.message || 'Error');
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [syncCongestion, syncAnnouncements]);

  const pendingAnchorRef = useRef<string | null>(null);

  const scrollToAnchor = useCallback((anchorId: string, retryCount = 0) => {
    if (!anchorId) return;

    document.body.style.overflow = '';

    const el = document.getElementById(anchorId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const navbarHeight = 70;
      const targetY = Math.max(0, rect.top + scrollTop - navbarHeight);

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      return;
    }

    if (retryCount < 30) {
      setTimeout(() => {
        scrollToAnchor(anchorId, retryCount + 1);
      }, 40);
    }
  }, []);

  const handleSelectProject = useCallback((id: string) => {
    setSelectedProjectId(id);
    const basePath = getAppBasePath();
    const targetPath = `${basePath}/project/${id}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: currentPage, projectId: id }, '', targetPath);
    }
  }, [currentPage]);

  const handleNavigate = useCallback((page: string, anchorOrProjectId?: string, replace: boolean = false) => {
    if (page === 'classDetail' && anchorOrProjectId) {
      handleSelectProject(anchorOrProjectId);
      return;
    }

    const basePath = getAppBasePath();
    let targetPath = page === 'home' ? `${basePath}/home` : `${basePath}/${page}`;
    let targetAnchor = '';
    let targetProjectId: string | null = null;

    if (anchorOrProjectId) {
      const isProject = appDataRef.current?.projects?.some((p) => p.id === anchorOrProjectId);
      if (isProject) {
        targetProjectId = anchorOrProjectId;
        targetPath = `${basePath}/project/${anchorOrProjectId}`;
      } else {
        targetAnchor = anchorOrProjectId;
        targetPath = `${targetPath}#${anchorOrProjectId}`;
      }
    }

    const currentFullPath = window.location.pathname + window.location.hash;
    if (currentFullPath !== targetPath) {
      const historyState = { page, projectId: targetProjectId, anchor: targetAnchor };
      if (replace) {
        window.history.replaceState(historyState, '', targetPath);
      } else {
        window.history.pushState(historyState, '', targetPath);
      }
    }

    setCurrentPage(page);
    setSelectedProjectId(targetProjectId);

    if (!targetAnchor) {
      pendingAnchorRef.current = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      pendingAnchorRef.current = targetAnchor;
      scrollToAnchor(targetAnchor);
    }
  }, [handleSelectProject, scrollToAnchor]);

  const handleCloseProjectModal = useCallback(() => {
    setSelectedProjectId(null);
    const basePath = getAppBasePath();
    const currentPath = window.location.pathname;
    const projectPrefix = `${basePath}/project/`;
    const classesPrefix = `${basePath}/classes/`;
    if (currentPath.startsWith(projectPrefix) || currentPath.startsWith(classesPrefix)) {
      const normalizedPage = currentPage === 'home' ? 'home' : currentPage;
      const pagePath = `${basePath}/${normalizedPage}`;
      window.history.pushState({ page: currentPage, projectId: null }, '', pagePath);
    }
  }, [currentPage]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchOpen(true);
    if (window.location.hash !== '#search') {
      window.history.pushState({ modal: 'search' }, '', window.location.pathname + '#search');
    }
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
    if (window.location.hash === '#search') {
      window.history.back();
    }
  }, []);

  const handleOpenToc = useCallback(() => {
    setIsTocOpen(true);
    if (window.location.hash !== '#menu' && window.location.hash !== '#toc') {
      window.history.pushState({ modal: 'menu' }, '', window.location.pathname + '#menu');
    }
  }, []);

  const handleCloseToc = useCallback(() => {
    setIsTocOpen(false);
    if (window.location.hash === '#menu' || window.location.hash === '#toc') {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentUrl();
      setCurrentPage(route.page);
      setSelectedProjectId(route.projectId);

      const currentHash = window.location.hash;
      setIsSearchOpen(currentHash === '#search');
      setIsTocOpen(currentHash === '#toc' || currentHash === '#menu');

      if (route.anchor) {
        pendingAnchorRef.current = route.anchor;
        scrollToAnchor(route.anchor);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const basePath = getAppBasePath();
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === basePath || currentPath === `${basePath}/`) {
      window.history.replaceState({ page: 'home', projectId: null }, '', `${basePath}/home`);
    }

    if (initialRoute.anchor) {
      pendingAnchorRef.current = initialRoute.anchor;
      scrollToAnchor(initialRoute.anchor);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [scrollToAnchor]);

  useEffect(() => {
    fetchServerAppData().then((serverData) => {
      if (serverData) {
        setAppData(serverData);
        saveAppData(serverData);
      }
    });

    syncNow();

    const congestionTimer = setInterval(() => {
      syncCongestion();
    }, 60000);

    const announcementTimer = setInterval(() => {
      syncAnnouncements();
    }, 45000);

    return () => {
      clearInterval(congestionTimer);
      clearInterval(announcementTimer);
    };
  }, [syncNow, syncCongestion, syncAnnouncements]);

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
    selectedProjectId ? (appData?.projects || []).find((p) => p.id === selectedProjectId) || null : null
  , [selectedProjectId, appData?.projects]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-20 sm:pb-0 flex flex-col justify-between">
      <div>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={(page, anchor) => handleNavigate(page, anchor)} 
          appData={appData}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenSearch={handleOpenSearch}
          onOpenToc={handleOpenToc}
          bookmarksCount={(bookmarks || []).length}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 min-h-[calc(100vh-14rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onAnimationComplete={() => {
                if (pendingAnchorRef.current) {
                  scrollToAnchor(pendingAnchorRef.current);
                }
              }}
            >
              {currentPage === 'home' && (
                <HomeView 
                  appData={appData} 
                  onNavigate={handleNavigate}
                  onSelectProject={handleSelectProject}
                  onOpenToc={handleOpenToc}
                  bookmarks={bookmarks || []}
                />
              )}
              
              {currentPage === 'schedule' && (
                <ScheduleView 
                  schedules={appData?.schedules || []}
                  onNavigate={handleNavigate}
                />
              )}
              
              {currentPage === 'classes' && (
                <ClassesView 
                  projects={appData?.projects || []}
                  onSelectProject={handleSelectProject}
                  bookmarks={bookmarks || []}
                  onToggleBookmark={handleToggleBookmark}
                  onNavigateToCongestion={() => handleNavigate('congestion')}
                />
              )}
              
              {currentPage === 'congestion' && (
                <CongestionLiveView 
                  gasUrl={appData.gasCongestionUrl}
                  projects={appData?.projects || []}
                  onSelectProject={handleSelectProject}
                  onSyncNow={syncNow}
                  isSyncing={isSyncing}
                  lastSyncTime={lastSyncTime ? lastSyncTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null}
                  syncError={syncError}
                />
              )}
              
              {currentPage === 'bookmarks' && (
                <MyTimelineView
                  bookmarkedProjects={(appData?.projects || []).filter((p) => (bookmarks || []).includes(p.id))}
                  allProjects={appData?.projects || []}
                  bookmarks={bookmarks || []}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectProject={handleSelectProject}
                  onNavigate={handleNavigate}
                />
              )}
              
              {currentPage === 'map' && (
                <CampusMapView 
                  projects={appData?.projects || []}
                  onSelectProject={handleSelectProject}
                />
              )}

              {currentPage === 'faq' && (
                <FaqMannersView 
                  onNavigate={handleNavigate}
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
        onOpenToc={handleOpenToc} 
      />

      <BottomNav
        currentPage={currentPage}
        setCurrentPage={(page) => handleNavigate(page)}
        bookmarksCount={(bookmarks || []).length}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        appData={appData}
        onSelectProject={handleSelectProject}
        onNavigate={handleNavigate}
      />

      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={handleCloseToc}
        currentPage={currentPage}
        appData={appData}
        onNavigate={handleNavigate}
        onSelectProject={handleSelectProject}
        onOpenSearch={handleOpenSearch}
        onOpenPwaModal={() => setShowPwaModal(true)}
        bookmarksCount={(bookmarks || []).length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <PwaInstallBanner
        forceShowModal={showPwaModal}
        onCloseModal={() => setShowPwaModal(false)}
      />

      {selectedProject && (
        <ClassDetailModal
          project={selectedProject}
          onClose={handleCloseProjectModal}
          isBookmarked={(bookmarks || []).includes(selectedProject.id)}
          onToggleBookmark={handleToggleBookmark}
          onNavigateToCongestion={() => handleNavigate('congestion')}
        />
      )}
    </div>
  );
}

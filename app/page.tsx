'use client';

import { useState, useEffect, useRef } from 'react';
import LockScreen from '@/components/LockScreen';
import BootScreen from '@/components/BootScreen';
import Desktop from '@/components/Desktop';
import Menubar from '@/components/Menubar';
import Taskbar from '@/components/Taskbar';
import WindowManager, { useWindowManager } from '@/components/WindowManager';
import NotificationSystem, { NotificationProvider, useNotifications } from '@/components/NotificationSystem';
import Spotlight from '@/components/Spotlight';
import SpotlightTrigger from '@/components/SpotlightTrigger';
import { notifications } from '@/data/content';
import { WindowId } from '@/types/windows';

type AppState = 'booting' | 'locked' | 'desktop';

const WINDOW_NOTIFS: Partial<Record<WindowId, typeof notifications[keyof typeof notifications]>> = {
  projects: notifications.projectsOpened,
  contact:  notifications.contactOpened,
  terminal: notifications.terminalOpened,
};

export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
      <NotificationSystem />
    </NotificationProvider>
  );
}

function HomeContent() {
  const { notify } = useNotifications();
  const [appState, setAppState] = useState<AppState>('booting');

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    toggleWindow,
    navigateBrowser,
  } = useWindowManager();

  const idleTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleNotifFiredRef = useRef(false);
  const notifiedWindowsRef = useRef<Set<WindowId>>(new Set());

  // Welcome + idle timers on desktop entry
  useEffect(() => {
    if (appState !== 'desktop') return;
    const welcome = setTimeout(() => notify(notifications.welcome), 3000);

    if (!idleNotifFiredRef.current) {
      idleTimerRef.current = setTimeout(() => {
        idleNotifFiredRef.current = true;
        notify(notifications.idleHire);
      }, 60_000);
    }

    return () => {
      clearTimeout(welcome);
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
    };
  }, [appState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Window-open notifications
  useEffect(() => {
    if (appState !== 'desktop') return;
    windows.forEach(w => {
      if (!w.isOpen || notifiedWindowsRef.current.has(w.id)) return;
      notifiedWindowsRef.current.add(w.id);

      // Opening any window cancels the idle notification
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
        idleNotifFiredRef.current = true;
      }

      const n = WINDOW_NOTIFS[w.id];
      if (n) notify(n);
    });
  }, [windows, appState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {appState === 'booting' && (
        <BootScreen onComplete={() => setAppState('locked')} />
      )}

      {appState === 'locked' && (
        <LockScreen onUnlocked={() => setAppState('desktop')} />
      )}

      {appState === 'desktop' && (
        <>
          <Menubar />

          <Desktop>
            <WindowManager
              windows={windows}
              closeWindow={closeWindow}
              minimizeWindow={minimizeWindow}
              maximizeWindow={maximizeWindow}
              focusWindow={focusWindow}
              moveWindow={moveWindow}
              resizeWindow={resizeWindow}
              navigateBrowser={navigateBrowser}
            />
          </Desktop>

          <Taskbar
            windows={windows}
            onWindowFocus={focusWindow}
            onWindowToggle={toggleWindow}
            onOpenWindow={openWindow}
          />

          <Spotlight onOpenWindow={openWindow} onNavigate={navigateBrowser} />
          <SpotlightTrigger />
        </>
      )}
    </>
  );
}

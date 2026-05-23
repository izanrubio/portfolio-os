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
import { t } from '@/data/translations';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WindowId } from '@/types/windows';

type AppState = 'booting' | 'locked' | 'desktop';

type NotifMeta = { type: typeof notifications[keyof typeof notifications]['type']; app: string };

const WINDOW_NOTIF_META: Partial<Record<WindowId, NotifMeta>> = {
  projects: { type: notifications.projectsOpened.type, app: notifications.projectsOpened.app },
  contact:  { type: notifications.contactOpened.type,  app: notifications.contactOpened.app  },
  terminal: { type: notifications.terminalOpened.type, app: notifications.terminalOpened.app },
};

const WINDOW_NOTIF_KEY: Partial<Record<WindowId, string>> = {
  projects: 'projectsOpened',
  contact:  'contactOpened',
  terminal: 'terminalOpened',
};

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <HomeContent />
          <NotificationSystem />
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function HomeContent() {
  const { notify } = useNotifications();
  const { lang }   = useLanguage();
  const langRef    = useRef(lang);
  langRef.current  = lang;

  const [appState, setAppState] = useState<AppState>('booting');

  const {
    windows, openWindow, closeWindow, minimizeWindow, maximizeWindow,
    focusWindow, moveWindow, resizeWindow, toggleWindow, navigateBrowser,
  } = useWindowManager();

  const idleTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleNotifFiredRef  = useRef(false);
  const notifiedWindowsRef = useRef<Set<WindowId>>(new Set());

  useEffect(() => {
    if (appState !== 'desktop') return;
    const welcome = setTimeout(() => {
      const l = langRef.current;
      notify({ type: notifications.welcome.type, app: notifications.welcome.app, title: t('notif.welcome.title', l), body: t('notif.welcome.body', l) });
    }, 3000);

    if (!idleNotifFiredRef.current) {
      idleTimerRef.current = setTimeout(() => {
        idleNotifFiredRef.current = true;
        const l = langRef.current;
        notify({ type: notifications.idleHire.type, app: notifications.idleHire.app, title: t('notif.idleHire.title', l), body: t('notif.idleHire.body', l) });
      }, 60_000);
    }

    return () => {
      clearTimeout(welcome);
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
    };
  }, [appState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (appState !== 'desktop') return;
    windows.forEach(w => {
      if (!w.isOpen || notifiedWindowsRef.current.has(w.id)) return;
      notifiedWindowsRef.current.add(w.id);

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
        idleNotifFiredRef.current = true;
      }

      const meta = WINDOW_NOTIF_META[w.id];
      const key  = WINDOW_NOTIF_KEY[w.id];
      if (meta && key) {
        const l = langRef.current;
        notify({ type: meta.type, app: meta.app, title: t(`notif.${key}.title`, l), body: t(`notif.${key}.body`, l) });
      }
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

          <Desktop onOpenWindow={openWindow} onNavigate={navigateBrowser}>
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

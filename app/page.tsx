'use client';

import { useState } from 'react';
import LockScreen from '@/components/LockScreen';
import BootScreen from '@/components/BootScreen';
import Desktop from '@/components/Desktop';
import Menubar from '@/components/Menubar';
import Taskbar from '@/components/Taskbar';
import WindowManager, { useWindowManager } from '@/components/WindowManager';

type AppState = 'locked' | 'booting' | 'desktop';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('locked');

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

  return (
    <>
      {appState === 'locked' && (
        <LockScreen onUnlocked={() => setAppState('booting')} />
      )}

      {appState === 'booting' && (
        <BootScreen onComplete={() => setAppState('desktop')} />
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
        </>
      )}
    </>
  );
}

'use client';

import { useState } from 'react';
import BootScreen from '@/components/BootScreen';
import Desktop from '@/components/Desktop';
import Menubar from '@/components/Menubar';
import Taskbar from '@/components/Taskbar';
import WindowManager, { useWindowManager } from '@/components/WindowManager';

export default function Home() {
  const [booted, setBooted] = useState(false);

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
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      {booted && (
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

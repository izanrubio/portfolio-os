'use client';

import { useState, useCallback } from 'react';
import BootScreen from '@/components/BootScreen';
import Desktop from '@/components/Desktop';
import Taskbar from '@/components/Taskbar';
import WindowManager, { useWindowManager } from '@/components/WindowManager';
import { WindowId } from '@/types/windows';

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
  } = useWindowManager();

  const handleOpenWindow = useCallback((id: WindowId) => {
    openWindow(id);
  }, [openWindow]);

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      {booted && (
        <>
          <Desktop onOpenWindow={handleOpenWindow}>
            <WindowManager
              windows={windows}
              closeWindow={closeWindow}
              minimizeWindow={minimizeWindow}
              maximizeWindow={maximizeWindow}
              focusWindow={focusWindow}
              moveWindow={moveWindow}
              resizeWindow={resizeWindow}
            />
          </Desktop>

          <Taskbar
            windows={windows}
            onWindowFocus={focusWindow}
            onWindowToggle={toggleWindow}
          />
        </>
      )}
    </>
  );
}

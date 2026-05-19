'use client';

import { useState, useCallback, useRef } from 'react';
import { WindowState, WindowId } from '@/types/windows';
import Window from './Window';
import ProjectsWindow from './windows/ProjectsWindow';
import WhoamiWindow from './windows/WhoamiWindow';
import SkillsWindow from './windows/SkillsWindow';
import ContactWindow from './windows/ContactWindow';
import TerminalWindow from './windows/TerminalWindow';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'projects',
    title: 'projects.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 80, y: 60 },
    size: { width: 600, height: 500 },
  },
  {
    id: 'whoami',
    title: 'whoami.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 120, y: 80 },
    size: { width: 620, height: 420 },
  },
  {
    id: 'skills',
    title: 'skills.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 160, y: 100 },
    size: { width: 480, height: 460 },
  },
  {
    id: 'contact',
    title: 'contact.exe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 200, y: 80 },
    size: { width: 480, height: 520 },
  },
  {
    id: 'terminal',
    title: 'terminal.exe — izanos@portfolio:~',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 100, y: 100 },
    size: { width: 560, height: 400 },
  },
];

const WINDOW_CONTENT: Record<WindowId, React.ReactNode> = {
  projects: <ProjectsWindow />,
  whoami: <WhoamiWindow />,
  skills: <SkillsWindow />,
  contact: <ContactWindow />,
  terminal: <TerminalWindow />,
};

interface WindowManagerProps {
  openWindow: (id: WindowId) => void;
  windows: WindowState[];
  setWindows: React.Dispatch<React.SetStateAction<WindowState[]>>;
}

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const topZRef = useRef(10);

  const openWindow = useCallback((id: WindowId) => {
    topZRef.current += 1;
    const z = topZRef.current;
    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, isOpen: true, isMinimized: false, zIndex: z }
        : w
    ));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false, isMinimized: false } : w));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    topZRef.current += 1;
    const z = topZRef.current;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z } : w));
  }, []);

  const moveWindow = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: pos } : w));
  }, []);

  const resizeWindow = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  }, []);

  return {
    windows,
    setWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    toggleWindow,
  };
}

interface RenderedWindowManagerProps {
  windows: WindowState[];
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, pos: { x: number; y: number }) => void;
  resizeWindow: (id: WindowId, size: { width: number; height: number }) => void;
}

export default function WindowManager({
  windows,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
  moveWindow,
  resizeWindow,
}: RenderedWindowManagerProps) {
  return (
    <>
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
        >
          {WINDOW_CONTENT[win.id]}
        </Window>
      ))}
    </>
  );
}

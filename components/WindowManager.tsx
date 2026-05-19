'use client';

import { useState, useCallback, useRef } from 'react';
import { WindowState, WindowId } from '@/types/windows';
import Window from './Window';
import ProjectsWindow from './windows/ProjectsWindow';
import WhoamiWindow from './windows/WhoamiWindow';
import SkillsWindow from './windows/SkillsWindow';
import ContactWindow from './windows/ContactWindow';
import BrowserWindow from './windows/BrowserWindow';
import FilesWindow from './windows/FilesWindow';
import TerminalWindow from './windows/TerminalWindow';

const DEFAULT_WINDOWS: WindowState[] = [
  {
    id: 'projects',
    title: 'projects.exe',
    icon: '🗂️',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 100, y: 60 },
    size: { width: 680, height: 520 },
  },
  {
    id: 'whoami',
    title: 'whoami.exe',
    icon: '👤',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 140, y: 80 },
    size: { width: 720, height: 480 },
  },
  {
    id: 'skills',
    title: 'skills.exe',
    icon: '⚡',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 180, y: 100 },
    size: { width: 600, height: 500 },
  },
  {
    id: 'contact',
    title: 'contact.exe',
    icon: '📡',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 220, y: 80 },
    size: { width: 560, height: 580 },
  },
  {
    id: 'browser',
    title: 'browser.exe',
    icon: '🌐',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 120, y: 60 },
    size: { width: 900, height: 620 },
    browserUrl: 'izanrubio.dev',
  },
  {
    id: 'files',
    title: 'files.exe',
    icon: '📁',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 160, y: 80 },
    size: { width: 720, height: 500 },
  },
  {
    id: 'terminal',
    title: 'terminal.exe',
    icon: '>_',
    isOpen: false, isMinimized: false, isMaximized: false,
    zIndex: 10,
    position: { x: 200, y: 100 },
    size: { width: 660, height: 420 },
  },
];

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>(DEFAULT_WINDOWS);
  const topZRef = useRef(10);

  const bumpZ = () => {
    topZRef.current += 1;
    return topZRef.current;
  };

  const openWindow = useCallback((id: WindowId) => {
    const z = bumpZ();
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: z } : w
    ));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isOpen: false, isMinimized: false } : w
    ));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    const z = bumpZ();
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: z } : w
    ));
  }, []);

  const moveWindow = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, position: pos } : w
    ));
  }, []);

  const resizeWindow = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    const z = bumpZ();
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized, zIndex: w.isMinimized ? z : w.zIndex } : w
    ));
  }, []);

  const navigateBrowser = useCallback((url: string) => {
    const z = bumpZ();
    setWindows(prev => prev.map(w =>
      w.id === 'browser'
        ? { ...w, isOpen: true, isMinimized: false, zIndex: z, browserUrl: url }
        : w
    ));
  }, []);

  return {
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
  };
}

interface WindowManagerProps {
  windows: WindowState[];
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, pos: { x: number; y: number }) => void;
  resizeWindow: (id: WindowId, size: { width: number; height: number }) => void;
  navigateBrowser: (url: string) => void;
}

export default function WindowManager({
  windows,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow,
  moveWindow,
  resizeWindow,
  navigateBrowser,
}: WindowManagerProps) {
  const browserState = windows.find(w => w.id === 'browser');

  const CONTENT: Record<WindowId, React.ReactNode> = {
    projects: <ProjectsWindow />,
    whoami: <WhoamiWindow />,
    skills: <SkillsWindow />,
    contact: <ContactWindow />,
    browser: <BrowserWindow initialUrl={browserState?.browserUrl ?? 'izanrubio.dev'} />,
    files: <FilesWindow onOpenBrowser={navigateBrowser} />,
    terminal: <TerminalWindow />,
  };

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
          {CONTENT[win.id]}
        </Window>
      ))}
    </>
  );
}

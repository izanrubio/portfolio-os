export type WindowId = 'projects' | 'whoami' | 'skills' | 'contact' | 'terminal';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DesktopIcon {
  id: WindowId;
  label: string;
  icon: string;
}

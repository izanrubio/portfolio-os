export type WindowId = 'projects' | 'whoami' | 'skills' | 'contact' | 'browser' | 'files' | 'terminal';

export interface WindowState {
  id: WindowId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  browserUrl?: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  children?: FileNode[];
  action?: {
    type: 'download' | 'browser' | 'preview';
    payload?: string;
  };
}

export interface DesktopIcon {
  id: WindowId;
  label: string;
  icon: string;
}

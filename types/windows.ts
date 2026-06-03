export type WindowId = 'projects' | 'whoami' | 'skills' | 'contact' | 'browser' | 'files' | 'terminal' | 'game' | 'experience' | 'education';

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
  type: 'file' | 'folder' | 'url' | 'pdf' | 'png' | 'readme';
  icon?: string;
  children?: FileNode[];
  url?: string;      // for type='url'
  path?: string;     // for type='pdf' | 'png'
  status?: string;   // for type='readme'
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

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WallpaperId, WALLPAPERS } from '@/components/WallpaperPicker';

interface WallpaperCtxValue {
  wallpaper: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
}

const WallpaperCtx = createContext<WallpaperCtxValue>({
  wallpaper: 'aurora',
  setWallpaper: () => {},
});

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<WallpaperId>('aurora');

  /* Restore from localStorage on mount and apply data-wallpaper attribute */
  useEffect(() => {
    const saved = localStorage.getItem('izanos-wallpaper') as WallpaperId | null;
    const id = saved && WALLPAPERS.find(w => w.id === saved) ? saved : 'aurora';
    setWallpaperState(id);
    document.documentElement.setAttribute('data-wallpaper', id);
  }, []);

  const setWallpaper = useCallback((id: WallpaperId) => {
    setWallpaperState(id);
    localStorage.setItem('izanos-wallpaper', id);
    document.documentElement.setAttribute('data-wallpaper', id);
  }, []);

  return (
    <WallpaperCtx.Provider value={{ wallpaper, setWallpaper }}>
      {children}
    </WallpaperCtx.Provider>
  );
}

export function useWallpaper() {
  return useContext(WallpaperCtx);
}

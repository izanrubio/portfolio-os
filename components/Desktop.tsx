'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ParticleNetwork from './ParticleNetwork';
import ContextMenu from './ContextMenu';
import WallpaperPicker, { WALLPAPERS } from './WallpaperPicker';
import { useWallpaper } from '@/contexts/WallpaperContext';
import AboutIzanOS from './AboutIzanOS';
import { WindowId } from '@/types/windows';


interface DesktopProps {
  children: React.ReactNode;
  onOpenWindow?: (id: WindowId) => void;
  onNavigate?: (url: string) => void;
}

export default function Desktop({ children, onOpenWindow, onNavigate }: DesktopProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const { wallpaper: wallpaperId, setWallpaper: handleSetWallpaper } = useWallpaper();
  const [ctxMenu, setCtxMenu]         = useState<{ x: number; y: number } | null>(null);
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [showAbout, setShowAbout]         = useState(false);

  const wallpaper = WALLPAPERS.find(w => w.id === wallpaperId) ?? WALLPAPERS[0];

  const bg    = dark ? wallpaper.darkBg : '#f0f4ff';
  const blend = dark ? 'screen' as const : 'multiply' as const;
  const [b1, b2, b3] = dark
    ? wallpaper.blobs
    : ['rgba(0,201,122,0.04)', 'rgba(124,58,237,0.03)', 'rgba(0,102,255,0.02)'] as const;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
    setShowWallpaper(false);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: bg, paddingTop: '28px', paddingBottom: '100px', transition: 'background-color 400ms ease' }}
      onContextMenu={handleContextMenu}
    >
      {/* Particle network — hero background */}
      <ParticleNetwork />

      {/* Aurora blobs — soft ambient glow behind network */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <div className="aurora-blob" style={{
          position: 'absolute', width: '60vw', height: '60vw', top: '-20vw', left: '-15vw',
          borderRadius: '50%', background: `radial-gradient(circle, ${b1}, transparent 65%)`,
          filter: 'blur(120px)', mixBlendMode: blend,
          animation: 'aurora-drift-1 20s ease-in-out infinite alternate', willChange: 'transform',
        }} />
        <div className="aurora-blob" style={{
          position: 'absolute', width: '65vw', height: '65vw', bottom: '-25vw', right: '-20vw',
          borderRadius: '50%', background: `radial-gradient(circle, ${b2}, transparent 65%)`,
          filter: 'blur(120px)', mixBlendMode: blend,
          animation: 'aurora-drift-2 25s ease-in-out infinite alternate-reverse', willChange: 'transform',
        }} />
        <div className="aurora-blob" style={{
          position: 'absolute', width: '45vw', height: '45vw', top: '50%', left: '50%',
          borderRadius: '50%', background: `radial-gradient(circle, ${b3}, transparent 65%)`,
          filter: 'blur(120px)', mixBlendMode: blend,
          animation: 'aurora-pulse-3 15s ease-in-out infinite alternate', willChange: 'transform',
        }} />
      </div>

      {/* Window content layer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {ctxMenu && (
          <ContextMenu
            key="ctx"
            x={ctxMenu.x}
            y={ctxMenu.y}
            onClose={() => setCtxMenu(null)}
            onOpenWindow={id => { onOpenWindow?.(id); }}
            onNavigate={url => { onNavigate?.(url); }}
            onOpenWallpaper={() => setShowWallpaper(true)}
            onOpenAbout={() => setShowAbout(true)}
          />
        )}
      </AnimatePresence>

      {/* Wallpaper picker */}
      <AnimatePresence>
        {showWallpaper && (
          <WallpaperPicker
            key="wallpaper"
            current={wallpaperId}
            onSelect={handleSetWallpaper}
            onClose={() => setShowWallpaper(false)}
          />
        )}
      </AnimatePresence>

      {/* About IzanOS modal */}
      {showAbout && <AboutIzanOS onClose={() => setShowAbout(false)} />}
    </div>
  );
}

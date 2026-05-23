'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { contextMenu as cm } from '@/data/content';
import { WindowId } from '@/types/windows';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
  onOpenWallpaper: () => void;
  onOpenAbout: () => void;
  onRefreshDesktop: () => void;
}

const MENU_W = 220;
const MENU_H = 340;

function Separator({ dark }: { dark: boolean }) {
  return (
    <div style={{
      height: '1px',
      background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      margin: '4px 0',
    }} />
  );
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  dark: boolean;
  onClick: () => void;
  danger?: boolean;
}

function Item({ icon, label, hint, dark, onClick, danger }: ItemProps) {
  const textColor = danger
    ? '#ff4757'
    : dark ? 'rgba(255,255,255,0.85)' : '#1a1a2e';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: '36px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '13px',
        color: textColor,
        textAlign: 'left',
        transition: 'background 0.1s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = dark
          ? 'rgba(0,212,255,0.1)'
          : 'rgba(0,0,0,0.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {hint && (
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        }}>
          {hint}
        </span>
      )}
    </button>
  );
}

export default function ContextMenu({
  x, y, onClose, onOpenWindow, onOpenWallpaper, onOpenAbout, onRefreshDesktop,
}: ContextMenuProps) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const menuRef = useRef<HTMLDivElement>(null);

  // Smart positioning
  const left = x + MENU_W > (globalThis.innerWidth  ?? 1200) ? x - MENU_W : x;
  const top  = y + MENU_H > (globalThis.innerHeight ?? 800)  ? y - MENU_H : y;
  const originX = left === x ? '0%' : '100%';
  const originY = top  === y ? '0%' : '100%';

  // Close on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const openSpotlight = () => {
    onClose();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  const bg     = dark ? 'rgba(15,15,25,0.92)' : 'rgba(255,255,255,0.92)';
  const border = dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)';
  const shadow = dark
    ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.06)'
    : '0 20px 60px rgba(0,0,0,0.15)';

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: 600,
        width: `${MENU_W}px`,
        background: bg,
        border,
        borderRadius: '12px',
        boxShadow: shadow,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '6px',
        transformOrigin: `${originX} ${originY}`,
      }}
      onContextMenu={e => { e.preventDefault(); e.stopPropagation(); }}
    >
      <Item
        icon="🎨" label={cm.changeWallpaper} dark={dark}
        onClick={() => { onClose(); onOpenWallpaper(); }}
      />
      <Item
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke={dark ? 'rgba(255,255,255,0.7)' : '#1a1a2e'} strokeWidth="1.2" fill="none"/>
            <text x="2.5" y="10" style={{ font: 'bold 8px monospace', fill: dark ? '#00ff88' : '#00aa55' }}>{'_'}</text>
          </svg>
        }
        label={cm.newTerminal} dark={dark}
        onClick={() => { onClose(); onOpenWindow('terminal'); }}
      />
      <Item
        icon="🔍" label={cm.search} hint="⌘K" dark={dark}
        onClick={openSpotlight}
      />

      <Separator dark={dark} />

      <Item
        icon="👤" label={cm.aboutMe} dark={dark}
        onClick={() => { onClose(); onOpenWindow('whoami'); }}
      />
      <Item
        icon="📁" label={cm.openFiles} dark={dark}
        onClick={() => { onClose(); onOpenWindow('files'); }}
      />

      <Separator dark={dark} />

      <Item
        icon={dark ? '☀️' : '🌙'}
        label={dark ? cm.switchThemeLight : cm.switchThemeDark}
        dark={dark}
        onClick={() => { onClose(); toggleTheme(); }}
      />
      <Item
        icon="ℹ️" label={cm.aboutOS} dark={dark}
        onClick={() => { onClose(); onOpenAbout(); }}
      />

      <Separator dark={dark} />

      <Item
        icon="🔄" label={cm.refreshDesktop} dark={dark}
        onClick={() => {
          onClose();
          window.dispatchEvent(new CustomEvent('particle-reset'));
          onRefreshDesktop();
        }}
      />
    </motion.div>
  );
}

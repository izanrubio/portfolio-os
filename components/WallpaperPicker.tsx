'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export type WallpaperId = 'aurora' | 'sunset' | 'ocean' | 'cyberpunk' | 'midnight' | 'forest';

interface WallpaperDef {
  id: WallpaperId;
  name: string;
  thumbnail: string;
  darkBg: string;
  blobs: [string, string, string];
  nodeColor: string;
}

export const WALLPAPERS: WallpaperDef[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    thumbnail: 'radial-gradient(ellipse at 25% 35%, rgba(0,255,102,0.55) 0%, transparent 60%), radial-gradient(ellipse at 75% 65%, rgba(0,102,255,0.55) 0%, transparent 60%), #000',
    darkBg: '#000000',
    blobs: ['rgba(0,255,102,0.06)', 'rgba(0,102,255,0.05)', 'rgba(0,255,255,0.04)'],
    nodeColor: '0,212,255',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    thumbnail: 'radial-gradient(ellipse at 25% 35%, rgba(255,100,0,0.65) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(180,0,100,0.55) 0%, transparent 55%), #0d0005',
    darkBg: '#0d0005',
    blobs: ['rgba(255,107,0,0.07)', 'rgba(180,0,60,0.05)', 'rgba(100,0,150,0.04)'],
    nodeColor: '255,120,50',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    thumbnail: 'radial-gradient(ellipse at 25% 35%, rgba(0,80,200,0.65) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(0,200,200,0.55) 0%, transparent 55%), #000b18',
    darkBg: '#000b18',
    blobs: ['rgba(0,100,220,0.07)', 'rgba(0,200,200,0.05)', 'rgba(0,150,255,0.04)'],
    nodeColor: '0,210,200',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    thumbnail: 'radial-gradient(ellipse at 25% 35%, rgba(180,0,255,0.65) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(255,0,150,0.55) 0%, transparent 55%), #0a000f',
    darkBg: '#0a000f',
    blobs: ['rgba(180,0,255,0.06)', 'rgba(255,0,150,0.05)', 'rgba(100,0,200,0.04)'],
    nodeColor: '200,0,255',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    thumbnail: 'radial-gradient(ellipse at 50% 40%, rgba(30,60,180,0.45) 0%, transparent 65%), #000000',
    darkBg: '#000000',
    blobs: ['rgba(30,60,200,0.05)', 'rgba(0,30,120,0.04)', 'rgba(20,50,180,0.03)'],
    nodeColor: '68,130,255',
  },
  {
    id: 'forest',
    name: 'Forest',
    thumbnail: 'radial-gradient(ellipse at 25% 35%, rgba(0,160,60,0.65) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(0,80,30,0.55) 0%, transparent 55%), #000a02',
    darkBg: '#000a02',
    blobs: ['rgba(0,200,80,0.06)', 'rgba(0,100,40,0.05)', 'rgba(50,180,0,0.04)'],
    nodeColor: '0,220,100',
  },
];

interface WallpaperPickerProps {
  current: WallpaperId;
  onSelect: (id: WallpaperId) => void;
  onClose: () => void;
}

export default function WallpaperPicker({ current, onSelect, onClose }: WallpaperPickerProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
      onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onClose(); }}
    >
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '320px',
          background: dark ? 'rgba(15,15,25,0.96)' : 'rgba(255,255,255,0.96)',
          border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
          borderRadius: '16px',
          boxShadow: dark
            ? '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.08)'
            : '0 24px 80px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '16px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#00d4ff',
          }}>
            Wallpapers
          </span>
          <button
            onClick={onClose}
            style={{
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
              fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Grid 2×3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {WALLPAPERS.map(wp => (
            <button
              key={wp.id}
              onClick={() => { onSelect(wp.id); onClose(); }}
              style={{
                position: 'relative',
                height: '80px',
                borderRadius: '8px',
                background: wp.thumbnail,
                backgroundSize: 'cover',
                border: current === wp.id
                  ? '2px solid #00d4ff'
                  : dark ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                transition: 'border-color 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              {/* Checkmark */}
              {current === wp.id && (
                <div style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '18px', height: '18px',
                  background: '#00d4ff',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              {/* Label */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                padding: '12px 8px 6px',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: '#fff',
                textAlign: 'left',
              }}>
                {wp.name}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

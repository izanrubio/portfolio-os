'use client';

import { useRef, useState } from 'react';
import { WindowId, DesktopIcon } from '@/types/windows';
import ParticleField from './ParticleField';

const ICONS: DesktopIcon[] = [
  { id: 'projects', label: 'projects.exe', icon: '🗂️' },
  { id: 'whoami', label: 'whoami.exe', icon: '👤' },
  { id: 'skills', label: 'skills.exe', icon: '⚡' },
  { id: 'contact', label: 'contact.exe', icon: '📡' },
  { id: 'browser', label: 'browser.exe', icon: '🌐' },
  { id: 'files', label: 'files.exe', icon: '📁' },
  { id: 'terminal', label: 'terminal.exe', icon: '>_' },
];

interface DesktopProps {
  openWindows: Set<WindowId>;
  onOpenWindow: (id: WindowId) => void;
  children: React.ReactNode;
}

export default function Desktop({ openWindows, onOpenWindow, children }: DesktopProps) {
  const lastClickRef = useRef<{ id: WindowId; time: number } | null>(null);
  const [hovered, setHovered] = useState<WindowId | null>(null);

  const handleIconClick = (id: WindowId) => {
    const now = Date.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
      onOpenWindow(id);
      return;
    }

    if (lastClickRef.current?.id === id && now - lastClickRef.current.time < 400) {
      onOpenWindow(id);
      lastClickRef.current = null;
    } else {
      lastClickRef.current = { id, time: now };
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 10%, rgba(124,58,237,0.08), transparent 70%),
          radial-gradient(ellipse 70% 50% at 85% 90%, rgba(0,212,255,0.06), transparent 70%),
          #060810
        `,
        paddingBottom: '110px',
      }}
    >
      <ParticleField />

      {/* Scanline veil */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)',
          mixBlendMode: 'overlay',
          zIndex: 1,
        }}
      />

      {/* Icons — left column */}
      <div className="absolute left-6 top-6 flex flex-col gap-1 z-10">
        {ICONS.map(icon => (
          <div
            key={icon.id}
            className="relative flex flex-col items-center gap-1.5 cursor-pointer select-none"
            style={{ width: '68px', padding: '8px 4px' }}
            onClick={() => handleIconClick(icon.id)}
            onMouseEnter={() => setHovered(icon.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Hover background */}
            <div
              className="absolute inset-0 rounded-xl transition-all duration-200"
              style={{
                background: hovered === icon.id ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                boxShadow: hovered === icon.id ? '0 0 20px rgba(0, 212, 255, 0.12)' : 'none',
              }}
            />

            {/* Icon */}
            <div
              className="relative transition-transform duration-200"
              style={{
                fontSize: icon.icon === '>_' ? '18px' : '28px',
                transform: hovered === icon.id ? 'scale(1.08)' : 'scale(1)',
                fontFamily: icon.icon === '>_' ? 'var(--font-jetbrains), monospace' : 'inherit',
                color: icon.icon === '>_' ? (hovered === icon.id ? '#00d4ff' : '#8892a4') : undefined,
                fontWeight: icon.icon === '>_' ? 700 : undefined,
                filter: hovered === icon.id && icon.icon !== '>_'
                  ? 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))'
                  : 'none',
              }}
            >
              {icon.icon}
            </div>

            {/* Label */}
            <span
              className="relative text-center leading-tight transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: hovered === icon.id ? '#f0f4ff' : '#8892a4',
                wordBreak: 'break-all',
                lineHeight: '1.3',
              }}
            >
              {icon.label}
            </span>

            {/* Active indicator */}
            {openWindows.has(icon.id) && (
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#00d4ff',
                  boxShadow: '0 0 4px #00d4ff',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

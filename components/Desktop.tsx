'use client';

import { useRef } from 'react';
import { WindowId, DesktopIcon } from '@/types/windows';
import ParticleBackground from './ParticleBackground';

const ICONS: DesktopIcon[] = [
  { id: 'projects', label: 'projects.exe', icon: '📁' },
  { id: 'whoami', label: 'whoami.exe', icon: '👤' },
  { id: 'skills', label: 'skills.exe', icon: '⚡' },
  { id: 'contact', label: 'contact.exe', icon: '📡' },
  { id: 'terminal', label: 'terminal.exe', icon: '>_' },
];

interface DesktopProps {
  onOpenWindow: (id: WindowId) => void;
  children: React.ReactNode;
}

export default function Desktop({ onOpenWindow, children }: DesktopProps) {
  const lastClick = useRef<{ id: WindowId; time: number } | null>(null);

  const handleIconClick = (id: WindowId) => {
    const now = Date.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
      onOpenWindow(id);
      return;
    }

    if (lastClick.current?.id === id && now - lastClick.current.time < 400) {
      onOpenWindow(id);
      lastClick.current = null;
    } else {
      lastClick.current = { id, time: now };
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: '#0a0f1a', paddingBottom: '40px' }}
    >
      <ParticleBackground />

      {/* Desktop icons — left column */}
      <div className="absolute left-6 top-6 flex flex-col gap-2 z-10">
        {ICONS.map(icon => (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon.id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 group select-none"
            style={{ width: '72px' }}
          >
            <span
              className="text-2xl transition-all duration-200 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]"
              style={{
                fontFamily: icon.icon === '>_' ? 'JetBrains Mono, monospace' : 'inherit',
                fontSize: icon.icon === '>_' ? '18px' : '28px',
                color: icon.icon === '>_' ? '#00d4ff' : undefined,
                fontWeight: icon.icon === '>_' ? 700 : undefined,
              }}
            >
              {icon.icon}
            </span>
            <span
              className="text-center leading-tight transition-colors duration-200"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.75)',
                wordBreak: 'break-all',
              }}
            >
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {/* Windows rendered here */}
      {children}
    </div>
  );
}

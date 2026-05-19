'use client';

import { useEffect, useState } from 'react';
import { WindowState, WindowId } from '@/types/windows';

interface TaskbarProps {
  windows: WindowState[];
  onWindowFocus: (id: WindowId) => void;
  onWindowToggle: (id: WindowId) => void;
}

export default function Taskbar({ windows, onWindowFocus, onWindowToggle }: TaskbarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase());
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center px-4 gap-3 z-50"
      style={{
        height: '48px',
        background: 'rgba(6, 8, 16, 0.92)',
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 shrink-0 pr-4"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <svg width="20" height="20" viewBox="0 0 96 96" fill="none">
          <polygon points="48,4 88,26 88,70 48,92 8,70 8,26" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.7"/>
          <polygon points="48,20 72,48 48,76 24,48" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <circle cx="48" cy="48" r="7" fill="rgba(0,212,255,0.2)"/>
          <circle cx="48" cy="48" r="3.5" fill="#00d4ff" opacity="0.9"/>
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#f0f4ff',
          }}
        >
          IzanOS
        </span>
      </div>

      {/* Window pills */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
        {openWindows.map(win => (
          <button
            key={win.id}
            onClick={() => win.isMinimized ? onWindowToggle(win.id) : onWindowFocus(win.id)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md shrink-0 transition-all duration-150 max-w-40 truncate"
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              background: win.isMinimized
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0, 212, 255, 0.12)',
              color: win.isMinimized
                ? '#4a5568'
                : 'rgba(0, 212, 255, 0.9)',
              border: `1px solid ${win.isMinimized ? 'rgba(255,255,255,0.06)' : 'rgba(0,212,255,0.25)'}`,
            }}
          >
            <span style={{ fontSize: '13px' }}>{win.icon}</span>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <div
        className="text-right shrink-0 pl-4"
        style={{
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-jetbrains), monospace',
        }}
      >
        <div style={{ fontSize: '12px', color: '#8892a4' }}>{time}</div>
        <div style={{ fontSize: '10px', color: '#4a5568' }}>{date}</div>
      </div>
    </div>
  );
}

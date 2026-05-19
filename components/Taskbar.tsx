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
      setDate(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-3 gap-3 z-40"
      style={{
        background: 'rgba(8, 12, 22, 0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 212, 255, 0.12)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0 pr-3" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 76,28 76,52 40,76 4,52 4,28" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.8"/>
          <circle cx="40" cy="40" r="5" fill="#00d4ff" opacity="0.9"/>
        </svg>
        <span className="text-white text-xs font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          IzanOS
        </span>
      </div>

      {/* Open window tabs */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
        {openWindows.map(win => (
          <button
            key={win.id}
            onClick={() => win.isMinimized ? onWindowToggle(win.id) : onWindowFocus(win.id)}
            className="px-3 py-1 text-xs rounded transition-all duration-150 shrink-0 max-w-36 truncate"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              background: win.isMinimized ? 'rgba(255,255,255,0.04)' : 'rgba(0, 212, 255, 0.12)',
              color: win.isMinimized ? 'rgba(255,255,255,0.5)' : 'rgba(0, 212, 255, 0.9)',
              border: `1px solid ${win.isMinimized ? 'rgba(255,255,255,0.06)' : 'rgba(0, 212, 255, 0.25)'}`,
            }}
          >
            {win.title}
          </button>
        ))}
      </div>

      {/* Clock */}
      <div
        className="text-right shrink-0 pl-3"
        style={{
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div className="text-white text-xs font-medium">{time}</div>
        <div className="text-[10px]" style={{ color: 'rgba(0,212,255,0.6)' }}>{date}</div>
      </div>
    </div>
  );
}

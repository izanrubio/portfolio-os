'use client';

import { useEffect, useState, useRef } from 'react';
import { WindowState, WindowId } from '@/types/windows';

const DOCK_ITEMS: { id: WindowId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'browser',
    label: 'browser.exe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" fill="url(#ff-grad)" opacity="0.95"/>
        <ellipse cx="14" cy="14" rx="5" ry="12" fill="url(#ff-inner)" opacity="0.7"/>
        <circle cx="14" cy="14" r="12" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none"/>
        <ellipse cx="14" cy="14" rx="12" ry="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
        <defs>
          <radialGradient id="ff-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff9500"/>
            <stop offset="40%" stopColor="#ff6b00"/>
            <stop offset="100%" stopColor="#9b3cff"/>
          </radialGradient>
          <radialGradient id="ff-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'files',
    label: 'files.exe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Folder back */}
        <path d="M3 9C3 7.9 3.9 7 5 7H11L13 9H23C24.1 9 25 9.9 25 11V21C25 22.1 24.1 23 23 23H5C3.9 23 3 22.1 3 21V9Z" fill="url(#folder-grad)"/>
        {/* Folder tab */}
        <path d="M3 9H13L11 7H5C3.9 7 3 7.9 3 9Z" fill="url(#folder-tab)"/>
        {/* Shine */}
        <path d="M5 11H23V13H5V11Z" fill="rgba(255,255,255,0.12)" rx="1"/>
        <defs>
          <linearGradient id="folder-grad" x1="3" y1="9" x2="25" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5ac8fa"/>
            <stop offset="100%" stopColor="#007aff"/>
          </linearGradient>
          <linearGradient id="folder-tab" x1="3" y1="7" x2="13" y2="9" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ab8ea"/>
            <stop offset="100%" stopColor="#3da8da"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'terminal',
    label: 'terminal.exe',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="4" width="24" height="20" rx="3" fill="#1a1a2e"/>
        <rect x="2" y="4" width="24" height="5" rx="3" fill="#2a2a4e"/>
        <circle cx="7" cy="6.5" r="1.2" fill="#ff4757"/>
        <circle cx="11" cy="6.5" r="1.2" fill="#ffd32a"/>
        <circle cx="15" cy="6.5" r="1.2" fill="#00ff88"/>
        <text x="5" y="18" fontFamily="monospace" fontSize="8" fill="#00ff88" fontWeight="700">&gt;_</text>
        <rect x="13" y="14.5" width="8" height="1.2" rx="0.6" fill="rgba(0,255,136,0.4)"/>
        <rect x="5" y="18.5" width="6" height="1.2" rx="0.6" fill="rgba(0,255,136,0.25)"/>
      </svg>
    ),
  },
];

interface TaskbarProps {
  windows: WindowState[];
  onWindowFocus: (id: WindowId) => void;
  onWindowToggle: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
}

export default function Taskbar({ windows, onWindowFocus, onWindowToggle, onOpenWindow }: TaskbarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<WindowId | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const getScale = (idx: number): number => {
    if (mouseX === null) return 1;
    const el = itemRefs.current[idx];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    const RANGE = 72;
    const MAX_SCALE = 1.55;
    if (dist > RANGE) return 1;
    return 1 + (MAX_SCALE - 1) * Math.cos((dist / RANGE) * (Math.PI / 2));
  };

  const handleDockMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
  };

  const handleDockMouseLeave = () => {
    setMouseX(null);
    setTooltip(null);
  };

  const handleItemClick = (item: typeof DOCK_ITEMS[0]) => {
    const win = windows.find(w => w.id === item.id);
    if (!win) return;
    if (!win.isOpen) {
      onOpenWindow(item.id);
    } else if (win.isMinimized) {
      onWindowToggle(item.id);
    } else {
      onWindowFocus(item.id);
    }
  };

  const isOpen = (id: WindowId) => {
    const win = windows.find(w => w.id === id);
    return win?.isOpen ?? false;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center px-4 z-50"
      style={{
        height: '56px',
        background: 'rgba(6, 8, 16, 0.92)',
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(0, 212, 255, 0.1)',
      }}
    >
      {/* IzanOS Logo — left */}
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
        <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#f0f4ff' }}>
          IzanOS
        </span>
      </div>

      {/* Dock — center */}
      <div className="flex-1 flex items-end justify-center pb-1">
        <div
          ref={dockRef}
          className="relative flex items-end gap-3 px-4 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          onMouseMove={handleDockMouseMove}
          onMouseLeave={handleDockMouseLeave}
        >
          {DOCK_ITEMS.map((item, idx) => {
            const scale = getScale(idx);
            const open = isOpen(item.id);

            return (
              <div key={item.id} className="relative flex flex-col items-center">
                {/* Tooltip */}
                {tooltip === item.id && (
                  <div
                    className="absolute bottom-full mb-2 px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
                    style={{
                      background: 'rgba(8,12,24,0.9)',
                      border: '1px solid rgba(0,212,255,0.15)',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '11px',
                      color: '#f0f4ff',
                      backdropFilter: 'blur(8px)',
                      transform: 'translateX(-50%)',
                      left: '50%',
                    }}
                  >
                    {item.label}
                  </div>
                )}

                <button
                  ref={el => { itemRefs.current[idx] = el; }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    transform: `scale(${scale}) translateY(${-(scale - 1) * 6}px)`,
                    transformOrigin: 'bottom center',
                    transition: mouseX === null ? 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' : 'transform 0.1s ease-out',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    filter: open ? 'drop-shadow(0 0 6px rgba(0,212,255,0.35))' : 'none',
                  }}
                >
                  {item.icon}
                </button>

                {/* Open indicator dot */}
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: open ? '#00d4ff' : 'transparent',
                    boxShadow: open ? '0 0 4px #00d4ff' : 'none',
                    marginTop: '3px',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Clock — right */}
      <div
        className="text-right shrink-0 pl-4"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        <div style={{ fontSize: '12px', color: '#8892a4' }}>{time}</div>
        <div style={{ fontSize: '10px', color: '#4a5568' }}>{date}</div>
      </div>
    </div>
  );
}

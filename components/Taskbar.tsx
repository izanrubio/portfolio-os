'use client';

import { useEffect, useState, useRef } from 'react';
import { WindowState, WindowId } from '@/types/windows';
import BrowserIcon from './icons/BrowserIcon';
import FilesIcon from './icons/FilesIcon';
import TerminalIcon from './icons/TerminalIcon';

// Magnification constants — match prototype exactly
const SCALE_MAX = 1.35;
const RANGE = 110;

const DOCK_ITEMS: {
  id: WindowId;
  label: string;
  color: string;
  glowClass: string;
  Icon: () => React.ReactElement;
}[] = [
  { id: 'browser',  label: 'browser.exe',  color: '#ff6b00', glowClass: 'browser',  Icon: BrowserIcon  },
  { id: 'files',    label: 'files.exe',    color: '#06b6d4', glowClass: 'files',    Icon: FilesIcon    },
  { id: 'terminal', label: 'terminal.exe', color: '#00ff88', glowClass: 'terminal', Icon: TerminalIcon },
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const pad = (n: number) => n < 10 ? '0' + n : '' + n;

    const tick = () => {
      const now = new Date();
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setDate(`${days[now.getDay()]} ${pad(now.getDate())} ${months[now.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const getScale = (idx: number): number => {
    if (mouseX === null) return 1;
    const el = iconRefs.current[idx];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const d = Math.abs(mouseX - cx);
    if (d >= RANGE) return 1;
    return 1 + (SCALE_MAX - 1) * Math.cos((d / RANGE) * (Math.PI / 2));
  };

  const handleDockMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
    // Find nearest icon for tooltip
    let nearestIdx = 0;
    let nearestDist = Infinity;
    iconRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const d = Math.abs(e.clientX - cx);
      if (d < nearestDist) { nearestDist = d; nearestIdx = idx; }
    });
    setHoveredIdx(nearestDist < 60 ? nearestIdx : null);
  };

  const handleDockMouseLeave = () => {
    setMouseX(null);
    setHoveredIdx(null);
  };

  const handleItemClick = (item: typeof DOCK_ITEMS[0]) => {
    const win = windows.find(w => w.id === item.id);
    if (!win || !win.isOpen) {
      onOpenWindow(item.id);
    } else if (win.isMinimized) {
      onWindowToggle(item.id);
    } else {
      onWindowFocus(item.id);
    }
  };

  const isOpen = (id: WindowId) => windows.find(w => w.id === id)?.isOpen ?? false;

  const isHovering = mouseX !== null;

  return (
    <>
      {/* ── Brand — bottom left ── */}
      <div
        className="fixed z-50 flex items-center gap-2.5 select-none pointer-events-none"
        style={{ bottom: '22px', left: '24px' }}
      >
        <svg
          width="22" height="22" viewBox="0 0 32 32" fill="none"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.55))' }}
        >
          <defs>
            <linearGradient id="dragon-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%"  stopColor="#00d4ff"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
          </defs>
          <path
            d="M4 16 L11 9 L17 11 L24 6 L28 11 L24 16 L28 21 L24 26 L17 21 L11 23 Z"
            stroke="url(#dragon-grad)" strokeWidth="1.6" strokeLinejoin="round" fill="none" opacity=".95"
          />
          <path d="M11 16 L24 16" stroke="#00d4ff" strokeWidth="1.2" strokeLinecap="round" opacity=".55"/>
          <circle cx="22.5" cy="13" r="1.2" fill="#00d4ff"/>
          <circle cx="22.5" cy="13" r="0.5" fill="#fff"/>
          <path
            d="M15 14 L19 16 L15 18"
            stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            opacity=".7" fill="none"
          />
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#f0f4ff',
            letterSpacing: '0.01em',
          }}
        >
          Izan<span style={{ color: '#00d4ff', fontWeight: 800 }}>OS</span>
        </span>
      </div>

      {/* ── Clock — bottom right ── */}
      <div
        className="fixed z-50 text-right select-none pointer-events-none"
        style={{ bottom: '22px', right: '24px', fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        <div style={{ fontSize: '13px', color: '#aab3c3', fontWeight: 500, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
          {time}
        </div>
        <div style={{ fontSize: '10.5px', color: '#4a5568', marginTop: '2px', letterSpacing: '0.14em' }}>
          {date}
        </div>
      </div>

      {/* ── Dock — floating centered bottom ── */}
      <div
        className="fixed z-50"
        style={{ left: '50%', bottom: '18px', transform: 'translateX(-50%)' }}
      >
        <div
          className="relative flex items-end gap-3.5"
          style={{
            padding: '10px 14px',
            borderRadius: '22px',
            background: 'linear-gradient(180deg, rgba(20,26,44,.55), rgba(8,11,22,.78))',
            border: '1px solid rgba(0, 212, 255, 0.12)',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,.85), 0 12px 30px -10px rgba(0,212,255,.08), inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.4)',
            backdropFilter: 'blur(22px) saturate(180%)',
          }}
          onMouseMove={handleDockMouseMove}
          onMouseLeave={handleDockMouseLeave}
        >
          {/* Top hairline accent */}
          <div
            className="absolute top-0 pointer-events-none"
            style={{
              left: '20%', right: '20%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.35), transparent)',
            }}
          />

          {DOCK_ITEMS.map((item, idx) => {
            const scale = getScale(idx);
            const lift = (scale - 1) * 18;
            const open = isOpen(item.id);
            const isHov = hoveredIdx === idx;
            const isPressed = pressedIdx === idx;
            const pressScale = isPressed ? 0.92 : 1;

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center"
                style={{ color: item.color }}
              >
                {/* Tooltip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 18px)',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${isHov ? '0px' : '4px'})`,
                    padding: '6px 10px',
                    background: 'rgba(10,14,28,0.85)',
                    border: '1px solid rgba(0,212,255,0.22)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(14px) saturate(180%)',
                    boxShadow: '0 12px 30px -10px rgba(0,0,0,.7)',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#f0f4ff',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: isHov ? 1 : 0,
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                    zIndex: 10,
                  }}
                >
                  {item.label}
                  {/* Arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid rgba(0,212,255,0.22)',
                    }}
                  />
                </div>

                {/* Color glow underlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-10px',
                    borderRadius: '22px',
                    pointerEvents: 'none',
                    opacity: isHov ? 0.55 : 0,
                    transition: 'opacity 0.3s ease',
                    filter: 'blur(14px)',
                    zIndex: -1,
                    background: item.id === 'browser'
                      ? 'radial-gradient(circle, rgba(255,107,0,0.7), transparent 65%)'
                      : item.id === 'files'
                      ? 'radial-gradient(circle, rgba(6,182,212,0.7), transparent 65%)'
                      : 'radial-gradient(circle, rgba(0,255,136,0.6), transparent 65%)',
                  }}
                />

                {/* Icon */}
                <div
                  ref={el => { iconRefs.current[idx] = el; }}
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transformOrigin: 'bottom center',
                    transform: `translateY(${-lift}px) scale(${scale * pressScale})`,
                    transition: isHovering
                      ? 'transform .12s cubic-bezier(.2,.8,.2,1)'
                      : 'transform .35s cubic-bezier(.34,1.56,.64,1)',
                    willChange: 'transform',
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseDown={() => setPressedIdx(idx)}
                  onMouseUp={() => setPressedIdx(null)}
                  onMouseLeave={() => setPressedIdx(null)}
                >
                  <item.Icon />
                </div>

                {/* Open indicator dot */}
                <div
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    marginTop: '8px',
                    background: open ? item.color : 'transparent',
                    boxShadow: open ? `0 0 8px ${item.color}, 0 0 16px ${item.color}` : 'none',
                    opacity: open ? 1 : 0,
                    transition: 'opacity .25s ease, background .25s ease, box-shadow .25s ease',
                    animation: open ? 'dot-pulse 2.2s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
          50%       { transform: scale(1.35); box-shadow: 0 0 10px currentColor, 0 0 22px currentColor; }
        }
      `}</style>
    </>
  );
}

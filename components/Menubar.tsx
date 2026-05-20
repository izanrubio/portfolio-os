'use client';

import { useEffect, useState } from 'react';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

export default function Menubar() {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const pad = (n: number) => n < 10 ? '0' + n : '' + n;

    const tick = () => {
      const d = new Date();
      setClock(`${days[d.getDay()]} ${pad(d.getDate())} ${months[d.getMonth()]}  ${pad(d.getHours())}:${pad(d.getMinutes())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const openSpotlight = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '28px',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', padding: '0 16px',
        zIndex: 100,
        userSelect: 'none',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mb-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#00ff9d"/>
              <stop offset="50%"  stopColor="#00d4ff"/>
              <stop offset="100%" stopColor="#a855f7"/>
            </linearGradient>
          </defs>
          <path d="M16 3 L28 12 L24 28 L8 28 L4 12 Z"
            stroke="url(#mb-grad)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
          <circle cx="16" cy="16" r="3.2" fill="url(#mb-grad)"/>
        </svg>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: '13px', color: '#fff' }}>
          IzanOS
        </span>
      </div>

      {/* Center: search hint */}
      <div
        onClick={openSpotlight}
        style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          width: '200px', height: '22px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '999px',
          display: 'flex', alignItems: 'center',
          padding: '0 8px', gap: '6px',
          cursor: 'pointer',
          transition: 'background .15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.3-4.3"/>
        </svg>
        <span style={{ flex: 1, fontFamily: INTER, fontSize: '12px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Search IzanOS...
        </span>
        <span style={{
          flexShrink: 0, fontFamily: MONO, fontSize: '10px',
          color: 'rgba(255,255,255,0.25)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '1px 6px', borderRadius: '3px',
        }}>⌘K</span>
      </div>

      {/* Right: wifi + battery + clock */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', fontWeight: 500, color: '#fff' }}>
        {/* Wifi */}
        <span style={{ opacity: 0.85, display: 'flex', alignItems: 'center' }} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.5a18 18 0 0 1 20 0"/>
            <path d="M5 12a13 13 0 0 1 14 0"/>
            <path d="M8.5 15.5a8 8 0 0 1 7 0"/>
            <circle cx="12" cy="19" r=".8" fill="currentColor"/>
          </svg>
        </span>
        {/* Battery */}
        <span style={{ opacity: 0.85, display: 'flex', alignItems: 'center' }} aria-hidden="true">
          <svg width="22" height="14" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="2" width="26" height="12" rx="3"/>
            <rect x="3" y="4" width="18" height="8" rx="1.5" fill="currentColor"/>
            <rect x="28" y="6" width="2" height="4" rx="1" fill="currentColor"/>
          </svg>
        </span>
        {/* Clock */}
        <span style={{ fontFamily: MONO, fontSize: '13px', letterSpacing: '0.01em', fontFeatureSettings: '"tnum"' }}>
          {clock}
        </span>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SpotlightTrigger() {
  const [hovered, setHovered] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const open = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        // dock is bottom:18px, inner padding-bottom:10px → icon bottom edge at 28px
        bottom: '28px',
        right: '24px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      onMouseEnter={() => { setHovered(true); setShowTip(true); }}
      onMouseLeave={() => { setHovered(false); setShowTip(false); }}
    >
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: `translateX(-50%) translateY(${showTip ? '0px' : '4px'})`,
          whiteSpace: 'nowrap',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '11px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontWeight: 500,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: showTip ? 1 : 0,
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        Search IzanOS...
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '1px 5px',
            borderRadius: '3px',
          }}
        >⌘K</span>
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid rgba(0,0,0,0.8)',
        }} />
      </div>

      {/* Button — matches 60×60 dock icon size */}
      <button
        onClick={open}
        aria-label="Open Spotlight search"
        style={{
          width: '60px',
          height: '60px',
          background: dark
            ? (hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)')
            : (hovered ? 'rgba(0,0,0,0.18)'        : 'rgba(0,0,0,0.12)'),
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.2)',
          borderRadius: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          filter: hovered ? 'brightness(1.15)' : 'brightness(1)',
          transition: 'background 0.15s ease, transform 0.15s ease, filter 0.15s ease',
          padding: 0,
          boxShadow: dark
            ? '0 8px 20px -6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)'
            : '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {[4, 10, 16].flatMap(cy =>
            [4, 10, 16].map(cx => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx} cy={cy} r="1.5"
                fill={dark ? 'rgba(255,255,255,0.85)' : '#1a1a2e'}
                fillOpacity={dark ? 1 : 0.8}
              />
            ))
          )}
        </svg>
      </button>
    </div>
  );
}

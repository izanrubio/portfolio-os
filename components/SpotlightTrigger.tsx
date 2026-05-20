'use client';

import { useState } from 'react';

export default function SpotlightTrigger() {
  const [hovered, setHovered] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const open = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 60,
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
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          background: 'rgba(15,15,25,0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          padding: '5px 10px',
          fontSize: '12px',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          color: 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: showTip ? 1 : 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
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
      </div>

      {/* Button */}
      <button
        onClick={open}
        aria-label="Open Spotlight search"
        style={{
          width: '36px',
          height: '36px',
          background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'background 0.15s ease, transform 0.15s ease',
          padding: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {[4, 10, 16].flatMap(cy =>
            [4, 10, 16].map(cx => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.75)" />
            ))
          )}
        </svg>
      </button>
    </div>
  );
}

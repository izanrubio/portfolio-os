'use client';

import { useState, useRef, useCallback } from 'react';
import { skills } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const CAT_ACCENT: Record<string, string> = {
  languages: '#00d4ff',
  frontend:  '#7c3aed',
  backend:   '#00ff88',
  databases: '#ff9500',
  devops:    '#00d4ff',
  security:  '#ff4757',
  other:     '#a855f7',
};

function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ── SVG icons (filled via parent width/height) ── */
const ICONS: Record<string, React.ReactElement> = {
  languages: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="14" y1="4" x2="10" y2="20"/>
    </svg>
  ),
  frontend: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <circle cx="6" cy="6.6" r=".7" fill="currentColor"/>
      <circle cx="8.4" cy="6.6" r=".7" fill="currentColor"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
    </svg>
  ),
  backend: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="6" rx="1.5"/>
      <rect x="3" y="14" width="18" height="6" rx="1.5"/>
      <line x1="6.5" y1="7" x2="6.5" y2="7.01"/>
      <line x1="6.5" y1="17" x2="6.5" y2="17.01"/>
      <line x1="10" y1="7" x2="14" y2="7"/>
      <line x1="10" y1="17" x2="14" y2="17"/>
    </svg>
  ),
  databases: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v6a9 3 0 0 0 18 0V5"/>
      <path d="M3 11v6a9 3 0 0 0 18 0v-6"/>
    </svg>
  ),
  devops: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="6 10 9 13 6 16"/>
      <line x1="12" y1="16" x2="17" y2="16"/>
    </svg>
  ),
  security: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  other: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
};

export default function SkillsWindow() {
  const { lang } = useLanguage();
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [fading,     setFading]     = useState(false);
  const [gridKey,    setGridKey]    = useState(0);
  const isAnimating = useRef(false);

  const handleSelect = useCallback((idx: number) => {
    if (isAnimating.current || idx === activeIdx) return;
    isAnimating.current = true;
    setActiveIdx(idx);
    setFading(true);
    setTimeout(() => {
      setVisibleIdx(idx);
      setGridKey(k => k + 1);
      setFading(false);
      isAnimating.current = false;
    }, 160);
  }, [activeIdx]);

  const cat    = skills[visibleIdx];
  const accent = CAT_ACCENT[cat.key] ?? '#00d4ff';
  const num    = String(visibleIdx + 1).padStart(2, '0');
  const total  = String(skills.length).padStart(2, '0');

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{
        background: 'rgba(8,8,12,0.92)',
        boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.08)}`,
        transition: 'box-shadow 0.6s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '22px 0',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0 22px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: '10px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            ▸ Categories
          </div>
          <div style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            {total}
          </div>
        </div>

        {/* Category items */}
        {skills.map((c, idx) => {
          const isActive = idx === activeIdx;
          const cAccent  = CAT_ACCENT[c.key] ?? '#00d4ff';
          return (
            <div
              key={c.key}
              onClick={() => handleSelect(idx)}
              style={{
                position: 'relative',
                padding: '11px 22px',
                cursor: 'pointer',
                borderLeft: `3px solid ${isActive ? cAccent : 'transparent'}`,
                background: isActive
                  ? `linear-gradient(90deg, ${hexToRgba(cAccent, 0.12)}, transparent 80%)`
                  : 'transparent',
                transition: 'border-color 0.25s ease, background 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  flexShrink: 0,
                  color: isActive ? cAccent : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ICONS[c.key]}
              </div>
              {/* Name + count */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <div
                  style={{
                    fontFamily: INTER,
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: isActive ? cAccent : 'rgba(255,255,255,0.65)',
                    letterSpacing: '-0.005em',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    marginTop: '3px',
                    fontFamily: MONO,
                    fontSize: '10px',
                    color: isActive ? hexToRgba(cAccent, 0.70) : 'rgba(255,255,255,0.28)',
                    letterSpacing: '0.12em',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {c.items.length} TECH
                </div>
              </div>
            </div>
          );
        })}
      </aside>

      {/* ── CONTENT ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent blob */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            top: '-90px',
            right: '-90px',
            background: `radial-gradient(circle, ${accent}, transparent 60%)`,
            filter: 'blur(60px)',
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'blobDrift 14s ease-in-out infinite',
            transition: 'background 0.6s cubic-bezier(.4,0,.2,1)',
          }}
        />

        {/* Panel — fades on category switch */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            opacity: fading ? 0 : 1,
            transition: fading ? 'opacity 0.15s ease-in' : 'opacity 0.18s ease',
          }}
        >
          {/* Decorative large background text */}
          <div
            aria-hidden={true}
            style={{
              position: 'absolute',
              left: '-8px',
              top: '22px',
              fontFamily: INTER,
              fontWeight: 900,
              fontSize: '200px',
              lineHeight: 1,
              color: 'rgba(255,255,255,0.04)',
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              zIndex: 0,
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {cat.label.toUpperCase()}
          </div>

          {/* Top bar */}
          <div
            style={{
              padding: '32px 40px 22px',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
            }}
          >
            {/* Large icon top-right */}
            <div
              aria-hidden={true}
              style={{
                position: 'absolute',
                top: '30px',
                right: '36px',
                width: '48px',
                height: '48px',
                color: accent,
                opacity: 0.18,
                transition: 'color 0.35s ease',
                zIndex: 1,
              }}
            >
              {ICONS[cat.key]}
            </div>

            {/* Label row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: '10.5px',
                  color: accent,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  transition: 'color 0.35s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label.toUpperCase()}
              </div>
              <div
                style={{
                  flex: '0 0 160px',
                  height: '1px',
                  background: `linear-gradient(90deg, ${hexToRgba(accent, 0.5)}, transparent)`,
                  transition: 'background 0.35s ease',
                }}
              />
            </div>

            {/* Category heading */}
            <h1
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.035em',
                lineHeight: 0.95,
                color: '#ffffff',
                textShadow: `0 0 40px ${hexToRgba(accent, 0.45)}`,
                position: 'relative',
                zIndex: 1,
                margin: 0,
                transition: 'text-shadow 0.35s ease',
              }}
            >
              {cat.label}
            </h1>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              margin: '0 40px',
              background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.6)} 18%, ${hexToRgba(accent, 0.6)} 82%, transparent)`,
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              transition: 'background 0.35s ease',
            }}
          />

          {/* Skills area */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: '28px 40px 20px',
              position: 'relative',
              zIndex: 1,
              overflowY: 'auto',
            }}
          >
            <div
              key={gridKey}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
            >
              {cat.items.map((tech, i) => (
                <span
                  key={tech}
                  className="izanos-skill-tag"
                  style={{
                    '--skill-i': i,
                    fontFamily: MONO,
                    fontSize: '12px',
                    fontWeight: 500,
                    color: accent,
                    background: hexToRgba(accent, 0.08),
                    border: `1px solid ${hexToRgba(accent, 0.30)}`,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'default',
                    display: 'inline-block',
                  } as React.CSSProperties}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = hexToRgba(accent, 0.15);
                    e.currentTarget.style.borderColor = hexToRgba(accent, 0.60);
                    e.currentTarget.style.boxShadow = `0 0 12px ${hexToRgba(accent, 0.20)}`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = hexToRgba(accent, 0.08);
                    e.currentTarget.style.borderColor = hexToRgba(accent, 0.30);
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              height: '36px',
              flexShrink: 0,
              padding: '0 40px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: '11px',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.04em',
              }}
            >
              <b style={{ color: accent, fontWeight: 600, transition: 'color 0.35s ease' }}>
                {cat.items.length}
              </b>
              {' '}
              {t('skills.technologies', lang)}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: '11px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.12em',
                fontWeight: 500,
              }}
            >
              <b style={{ color: accent, fontWeight: 600, transition: 'color 0.35s ease' }}>
                {num}
              </b>
              {' / '}
              {total}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blobDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-30px,20px) scale(1.1); }
          66%       { transform: translate(15px,-15px) scale(0.95); }
        }
        .izanos-skill-tag {
          opacity: 0;
          transform: translateY(8px);
          animation: skillIn .4s cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: calc(var(--skill-i, 0) * 30ms);
          transition:
            background .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }
        @keyframes skillIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

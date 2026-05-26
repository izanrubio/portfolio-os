'use client';

import { useState, useRef, useCallback } from 'react';
import { projects } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const ACCENT: Record<string, string> = {
  ciberchurros: '#00ff88',
  laraveles:    '#00d4ff',
  stastarat:    '#7c3aed',
  docflow:      '#ff9500',
  barbercompte: '#ff4757',
};

function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function TechTag({ tech, accent }: { tech: string; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: '12px',
        fontWeight: 500,
        color: accent,
        background: hexToRgba(accent, hovered ? 0.18 : 0.08),
        border: `1px solid ${hexToRgba(accent, hovered ? 0.55 : 0.30)}`,
        padding: '6px 14px',
        borderRadius: '6px',
        cursor: 'default',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? `0 0 18px ${hexToRgba(accent, 0.30)}` : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
        display: 'inline-block',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tech}
    </span>
  );
}

export default function ProjectsWindow() {
  const { lang } = useLanguage();
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [fading,     setFading]     = useState(false);
  const isAnimating = useRef(false);

  const handleSelect = useCallback((idx: number) => {
    if (isAnimating.current || idx === activeIdx) return;
    isAnimating.current = true;
    setActiveIdx(idx);
    setFading(true);
    setTimeout(() => {
      setVisibleIdx(idx);
      setFading(false);
      isAnimating.current = false;
    }, 160);
  }, [activeIdx]);

  const proj       = projects[visibleIdx];
  const accent     = ACCENT[proj.slug] ?? '#00d4ff';
  const num        = String(visibleIdx + 1).padStart(2, '0');
  const total      = String(projects.length).padStart(2, '0');
  const highlights = (proj as unknown as { highlights?: string[] }).highlights ?? [];

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
          width: '250px',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.3)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '22px 0 22px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '0 22px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '12px',
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
            ▸ Projects
          </div>
          <div style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            {total}
          </div>
        </div>

        {projects.map((p, idx) => {
          const isActive = idx === activeIdx;
          const pAccent  = ACCENT[p.slug] ?? '#00d4ff';
          const pNum     = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={p.slug}
              onClick={() => handleSelect(idx)}
              style={{
                position: 'relative',
                padding: '14px 22px',
                cursor: 'pointer',
                borderLeft: `3px solid ${isActive ? pAccent : 'transparent'}`,
                background: isActive
                  ? `linear-gradient(90deg, ${hexToRgba(pAccent, 0.12)}, transparent 80%)`
                  : 'transparent',
                transition: 'border-color 0.25s ease, background 0.25s ease',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: '16px',
                  fontWeight: 700,
                  color: isActive ? pAccent : 'rgba(255,255,255,0.65)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.25s ease',
                  lineHeight: 1.1,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  marginTop: '5px',
                  fontFamily: MONO,
                  fontSize: '9.5px',
                  color: isActive ? hexToRgba(pAccent, 0.75) : 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  transition: 'color 0.25s ease',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {p.category}
              </div>
              {/* Faded giant background numeral */}
              <div
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontSize: '56px',
                  lineHeight: 1,
                  color: isActive ? hexToRgba(pAccent, 0.08) : 'rgba(255,255,255,0.025)',
                  letterSpacing: '-0.05em',
                  pointerEvents: 'none',
                  transition: 'color 0.25s ease',
                  userSelect: 'none',
                }}
              >
                {pNum}
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
        {/* Animated accent blob */}
        <div
          style={{
            position: 'absolute',
            width: '520px',
            height: '520px',
            top: '-160px',
            right: '-160px',
            background: `radial-gradient(circle, ${accent}, transparent 60%)`,
            filter: 'blur(80px)',
            opacity: 0.25,
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'blobDrift 14s ease-in-out infinite',
            transition: 'background 0.6s cubic-bezier(.4,0,.2,1)',
          }}
        />

        {/* Background decorative large numeral */}
        <div
          aria-hidden={true}
          style={{
            position: 'absolute',
            left: '-10px',
            top: '-20px',
            fontFamily: INTER,
            fontWeight: 900,
            fontSize: '380px',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          {num}
        </div>

        {/* Detail area — fades on project switch */}
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
          {/* Hero */}
          <div
            style={{
              flex: '0 0 45%',
              padding: '38px 44px 28px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '14px',
                position: 'relative',
                zIndex: 1,
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
                {proj.category}
              </div>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: `linear-gradient(90deg, ${hexToRgba(accent, 0.5)}, transparent)`,
                  transition: 'background 0.35s ease',
                }}
              />
            </div>
            <h1
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                letterSpacing: '-0.035em',
                lineHeight: 0.95,
                position: 'relative',
                zIndex: 2,
                margin: 0,
                color: '#fff',
              }}
            >
              <span
                style={{
                  display: 'inline',
                  background: `linear-gradient(135deg, #ffffff 0%, ${accent} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'background 0.35s ease',
                }}
              >
                {proj.name}
              </span>
            </h1>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              margin: '0 44px',
              background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.6)} 20%, ${hexToRgba(accent, 0.6)} 80%, transparent)`,
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
              transition: 'background 0.35s ease',
            }}
          />

          {/* Body area */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: '28px 44px 32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: INTER,
                fontSize: '15px',
                lineHeight: 1.9,
                color: '#9ba3af',
                maxWidth: '520px',
                margin: 0,
              }}
            >
              {t(`proj.${proj.slug}.description`, lang)}
            </p>

            {highlights.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: MONO,
                      fontSize: '11.5px',
                      fontWeight: 500,
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: accent,
                      background: hexToRgba(accent, 0.10),
                      border: `1px solid ${hexToRgba(accent, 0.25)}`,
                      transition: 'all 0.35s ease',
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>▸</span>
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {proj.stack.map(tech => (
                <TechTag key={tech} tech={tech} accent={accent} />
              ))}
            </div>

            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              {proj.status === 'in-development' ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    color: accent,
                    border: `1px solid ${hexToRgba(accent, 0.5)}`,
                    background: hexToRgba(accent, 0.04),
                    fontFamily: MONO,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    transition: 'all 0.35s ease',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: accent,
                      boxShadow: `0 0 8px ${accent}, 0 0 16px ${accent}`,
                      animation: 'wipPulse 1.5s ease-in-out infinite',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  {t('projects.inDev', lang)}
                </span>
              ) : proj.demo ? (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '12px 28px',
                    borderRadius: '10px',
                    background: accent,
                    color: '#001017',
                    fontFamily: INTER,
                    fontSize: '13.5px',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'filter 0.2s ease, transform 0.2s ease, box-shadow 0.35s ease',
                    boxShadow: `0 12px 28px -10px ${hexToRgba(accent, 0.5)}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  {t('projects.openDemo', lang)}
                  <span style={{ fontFamily: MONO }}>→</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Counter bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '18px',
            fontFamily: MONO,
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.12em',
            fontWeight: 500,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <b style={{ color: accent, fontWeight: 600, transition: 'color 0.35s ease' }}>{num}</b>
          {' / '}
          {total}
        </div>
      </div>

      <style>{`
        @keyframes blobDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-40px,30px) scale(1.1); }
          66%       { transform: translate(20px,-20px) scale(0.95); }
        }
        @keyframes wipPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .3; transform: scale(.8); }
        }
      `}</style>
    </div>
  );
}

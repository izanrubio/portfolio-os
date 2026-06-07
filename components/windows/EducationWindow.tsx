'use client';

import { education } from '@/data/content';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';
const CYAN  = '#00f5ff';
const GREEN = '#00ff88';

const DAW_ENTRY   = education.find(e => e.degree.includes('DAW'))!;
const CIBER_ENTRY = education.find(e => e.degree.includes('Ciberseguridad'))!;

/* ── SVG icons ── */
function IconWeb() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18"/>
      <path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}

export default function EducationWindow() {
  const { theme } = useTheme();
  const { lang }  = useLanguage();
  const isDark = theme === 'dark';

  /* Theme tokens */
  const bg         = isDark ? 'transparent'               : 'transparent';
  const decoColor  = isDark ? 'rgba(255,255,255,.025)'    : 'rgba(0,0,0,.04)';
  const eyebrowCol = isDark ? 'rgba(255,255,255,.35)'     : '#94a3b8';
  const titleCol   = isDark ? '#ffffff'                   : '#0f172a';
  const subCol     = isDark ? 'rgba(255,255,255,.35)'     : '#94a3b8';

  /* Card tokens by accent */
  const cardStyles = (accent: string) => ({
    bg:     isDark ? `rgba(255,255,255,.03)` : 'rgba(255,255,255,.8)',
    border: isDark ? `rgba(255,255,255,.08)` : 'rgba(0,0,0,.08)',
    accentBg:  `${accent}12`,
    titleCol:  isDark ? '#fff' : '#0f172a',
    subCol:    isDark ? 'rgba(255,255,255,.5)' : '#64748b',
    periodCol: isDark ? 'rgba(255,255,255,.35)' : '#94a3b8',
    descCol:   isDark ? 'rgba(255,255,255,.55)' : '#475569',
    tagBg:     isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
    tagBdr:    isDark ? 'rgba(255,255,255,.1)'  : 'rgba(0,0,0,.1)',
    tagCol:    isDark ? 'rgba(255,255,255,.65)' : '#475569',
    shadow:    isDark ? 'none' : '0 4px 20px rgba(0,0,0,.06)',
  });

  const cards = [
    { entry: DAW_ENTRY,   accent: CYAN,  badgeKey: 'edu.inProgress' as const, finished: false },
    { entry: CIBER_ENTRY, accent: GREEN, badgeKey: 'edu.finished'   as const, finished: true  },
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '28px 32px 24px',
        background: bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <div style={{
        position: 'absolute', right: -10, top: -14, zIndex: 0,
        fontFamily: INTER, fontWeight: 900, fontSize: 100,
        lineHeight: 1, color: decoColor, letterSpacing: '-0.04em',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        EDU
      </div>

      {/* ── Hero ── */}
      <div style={{ flexShrink: 0, marginBottom: 22, position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: eyebrowCol, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 5 }}>
          {t('edu.eyebrow', lang)}
        </div>
        <h1 style={{ fontFamily: INTER, fontSize: 28, fontWeight: 800, color: titleCol, letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
          Education<span style={{ color: GREEN }}>.</span>
        </h1>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: subCol, marginTop: 7 }}>
          IES Nicolau Copèrnic · Terrassa
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', position: 'relative', zIndex: 1, scrollbarWidth: 'thin', scrollbarColor: isDark ? 'rgba(0,245,255,.2) transparent' : 'rgba(0,0,0,.15) transparent' }}>
        {cards.map(({ entry, accent, badgeKey, finished }, idx) => {
          const C = cardStyles(accent);
          return (
            <div key={entry.degree}>
              {/* Card */}
              <div style={{
                background:   C.bg,
                border:       `1px solid ${C.border}`,
                borderLeft:   `3px solid ${accent}`,
                borderRadius: 14,
                padding:      '18px 20px',
                boxShadow:    C.shadow,
                position:     'relative',
                overflow:     'hidden',
              }}>
                {/* Accent glow blob */}
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: `radial-gradient(circle, ${C.accentBg}, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, position: 'relative' }}>
                  {/* Left: icon + info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    {/* Icon circle */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: `${accent}18`,
                      border: `1px solid ${accent}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: accent,
                    }}>
                      {finished ? <IconShield /> : <IconWeb />}
                    </div>

                    {/* Titles */}
                    <div>
                      <div style={{ fontFamily: INTER, fontSize: 17, fontWeight: 700, color: C.titleCol, lineHeight: 1.2 }}>
                        {entry.degree}
                      </div>
                      {entry.fullDegree !== entry.degree && (
                        <div style={{ fontFamily: INTER, fontSize: 12.5, color: accent, fontWeight: 500, marginTop: 3, lineHeight: 1.3 }}>
                          {entry.fullDegree.replace(entry.degree + ' — ', '')}
                        </div>
                      )}
                      <div style={{ fontFamily: MONO, fontSize: 10, color: C.subCol, marginTop: 4 }}>
                        {entry.institute}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.periodCol, marginTop: 3 }}>
                        {entry.period}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <span style={{
                    flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: MONO, fontSize: 8.5, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '5px 10px', borderRadius: 999,
                    color: accent,
                    background: `${accent}15`,
                    border: `1px solid ${accent}40`,
                    whiteSpace: 'nowrap',
                  }}>
                    {finished ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, animation: 'edu-pulse 1.5s ease-in-out infinite', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    {t(badgeKey, lang)}
                  </span>
                </div>

                {/* Description */}
                {entry.description ? (
                  <div style={{ fontFamily: INTER, fontSize: 12.5, color: C.descCol, lineHeight: 1.65, marginTop: 14, paddingLeft: 58 }}>
                    {entry.description}
                  </div>
                ) : null}

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingLeft: 58 }}>
                    {entry.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: MONO, fontSize: 10, fontWeight: 500,
                        padding: '3px 8px', borderRadius: 6,
                        color: finished ? GREEN : CYAN,
                        background: `${accent}10`,
                        border: `1px solid ${accent}28`,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Timeline connector between cards */}
              {idx === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 0 }}>
                  <div style={{ width: 1, height: 14, background: `linear-gradient(180deg, ${CYAN}80, ${GREEN}80)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ height: 1, width: 32, background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.2)', border: `1px solid ${isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)'}` }} />
                    <div style={{ height: 1, width: 32, background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)' }} />
                  </div>
                  <div style={{ width: 1, height: 14, background: `linear-gradient(180deg, ${GREEN}80, ${GREEN}20)` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes edu-pulse { 50% { opacity:.25; transform:scale(.65); } }`}</style>
    </div>
  );
}

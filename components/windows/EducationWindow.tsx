'use client';

import { education } from '@/data/content';
import { useTheme } from '@/contexts/ThemeContext';

const MONO   = 'var(--font-jetbrains), monospace';
const INTER  = 'var(--font-inter), Inter, sans-serif';
const VIOLET = '#7c3aed';

export default function EducationWindow() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const T = {
    eyebrow:      isDark ? '#b794f6'                    : '#7c3aed',
    sub:          isDark ? 'rgba(255,255,255,0.40)'     : '#64748b',
    deco:         isDark ? 'rgba(255,255,255,0.03)'     : 'rgba(0,0,0,0.04)',
    cardBase:     isDark ? 'rgba(255,255,255,0.03)'     : 'rgba(255,255,255,0.80)',
    cardBaseBdr:  isDark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.08)',
    cardBaseLBdr: isDark ? 'rgba(255,255,255,0.20)'     : 'rgba(0,0,0,0.15)',
    cardHl:       isDark ? 'rgba(124,58,237,0.08)'      : 'rgba(124,58,237,0.06)',
    cardHlBdr:    isDark ? 'rgba(124,58,237,0.30)'      : 'rgba(124,58,237,0.25)',
    deg:          isDark ? '#fff'                       : '#0f172a',
    instMuted:    isDark ? 'rgba(255,255,255,0.50)'     : '#64748b',
    instCurrent:  isDark ? '#b794f6'                    : VIOLET,
    per:          isDark ? 'rgba(255,255,255,0.40)'     : '#94a3b8',
    desc:         isDark ? 'rgba(255,255,255,0.60)'     : '#475569',
    dotBg:        isDark ? '#0a0a12'                    : '#f8f8ff',
    dotBdr:       isDark ? 'rgba(255,255,255,0.30)'     : 'rgba(0,0,0,0.20)',
    chipBase:     { color: isDark ? 'rgba(255,255,255,.7)' : '#475569', bg: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,0.05)', bdr: isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,0.1)' },
    chipHl:       { color: isDark ? '#c4b5fd' : '#7c3aed', bg: isDark ? 'rgba(124,58,237,.12)' : 'rgba(124,58,237,0.08)', bdr: isDark ? 'rgba(124,58,237,.3)' : 'rgba(124,58,237,0.3)' },
    badgeDone:    { color: isDark ? 'rgba(255,255,255,.5)' : '#64748b', bg: isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,0.05)', bdr: isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,0.1)' },
    scrollThumb:  isDark ? 'rgba(124,58,237,.4) transparent' : 'rgba(124,58,237,.3) transparent',
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ padding: '26px 34px 20px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.10)' }}
    >
      {/* ── Hero ── */}
      <div style={{ flexShrink: 0, marginBottom: 18, position: 'relative' }}>
        <div style={{ position: 'absolute', right: -6, top: -22, fontFamily: INTER, fontWeight: 900, fontSize: 90, lineHeight: 1, color: T.deco, letterSpacing: '-0.05em', pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
          EDU
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.eyebrow, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          Formación Académica
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, fontFamily: INTER, color: isDark ? '#fff' : '#0f172a' }}>
          Education<span style={{ color: '#a855f7' }}>.</span>
        </h1>
        <div style={{ fontFamily: MONO, fontSize: 11, color: T.sub, marginTop: 6 }}>
          IES Nicolau Copèrnic · Terrassa
        </div>
      </div>

      {/* ── Timeline ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ position: 'relative', paddingLeft: 26, scrollbarWidth: 'thin', scrollbarColor: T.scrollThumb }}
      >
        <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: `linear-gradient(180deg,${VIOLET},rgba(255,255,255,.08))`, borderRadius: 2 }} />

        {education.map((e, i) => (
          <div key={e.degree} style={{ position: 'relative', marginBottom: 14 }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -24, top: 16,
              width: 11, height: 11, borderRadius: '50%', zIndex: 2,
              background: e.current ? VIOLET : T.dotBg,
              border: `2px solid ${e.current ? VIOLET : T.dotBdr}`,
              boxShadow: e.current ? `0 0 0 4px rgba(124,58,237,.2),0 0 12px ${VIOLET}` : 'none',
            }} />

            {/* Card */}
            <div style={{
              background:   e.current ? T.cardHl    : T.cardBase,
              border:       `1px solid ${e.current ? T.cardHlBdr : T.cardBaseBdr}`,
              borderLeft:   `3px solid ${e.current ? VIOLET      : T.cardBaseLBdr}`,
              borderRadius: 12, padding: '14px 16px',
              ...(i === education.length - 1 ? { opacity: 0.85 } : {}),
              ...(isDark ? {} : { boxShadow: '0 2px 8px rgba(0,0,0,.05)' }),
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.deg, lineHeight: 1.2, fontFamily: INTER }}>{e.degree}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, fontFamily: INTER, color: e.current ? T.instCurrent : T.instMuted }}>
                    {e.fullDegree !== e.degree ? e.fullDegree.replace(e.degree + ' — ', '') : e.institute}
                  </div>
                  {e.fullDegree !== e.degree && (
                    <div style={{ fontSize: 12, color: T.instMuted, fontFamily: INTER }}>{e.institute}</div>
                  )}
                  <div style={{ fontFamily: MONO, fontSize: 11, color: T.per, marginTop: 6 }}>{e.period}</div>
                </div>

                {e.current ? (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, color: T.chipHl.color, background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.4)', whiteSpace: 'nowrap' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.chipHl.color, animation: 'edu-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                    En curso
                  </span>
                ) : (
                  <span style={{ flexShrink: 0, display: 'inline-flex', fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, color: T.badgeDone.color, background: T.badgeDone.bg, border: `1px solid ${T.badgeDone.bdr}`, whiteSpace: 'nowrap' }}>
                    Completado
                  </span>
                )}
              </div>

              {e.description && (
                <div style={{ fontSize: 13, color: T.desc, lineHeight: 1.6, marginTop: 10, fontFamily: INTER }}>{e.description}</div>
              )}

              {e.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {e.tags.map(tag => {
                    const ch = e.current ? T.chipHl : T.chipBase;
                    return (
                      <span key={tag} style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color: ch.color, background: ch.bg, border: `1px solid ${ch.bdr}` }}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes edu-pulse { 50% { opacity:.3; transform:scale(.7); } }`}</style>
    </div>
  );
}

'use client';

import { education } from '@/data/content';

const MONO   = 'var(--font-jetbrains), monospace';
const INTER  = 'var(--font-inter), Inter, sans-serif';
const VIOLET = '#7c3aed';

export default function EducationWindow() {
  return (
    <div
      className="h-full flex flex-col"
      style={{ padding: '26px 34px 20px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.10)' }}
    >
      {/* ── Hero ── */}
      <div style={{ flexShrink: 0, marginBottom: 18, position: 'relative' }}>
        <div style={{ position: 'absolute', right: -6, top: -22, fontFamily: INTER, fontWeight: 900, fontSize: 90, lineHeight: 1, color: 'rgba(255,255,255,.03)', letterSpacing: '-0.05em', pointerEvents: 'none', whiteSpace: 'nowrap', userSelect: 'none' }}>
          EDU
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#b794f6', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          Formación Académica
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, fontFamily: INTER }}>
          Education<span style={{ color: '#a855f7' }}>.</span>
        </h1>
        <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>
          IES Nicolau Copèrnic · Terrassa
        </div>
      </div>

      {/* ── Timeline ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ position: 'relative', paddingLeft: 26, scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,.4) transparent' }}
      >
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: `linear-gradient(180deg, ${VIOLET}, rgba(255,255,255,.08))`, borderRadius: 2 }} />

        {education.map((e, i) => (
          <div key={e.degree} style={{ position: 'relative', marginBottom: 14 }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -24, top: 16,
              width: 11, height: 11, borderRadius: '50%', zIndex: 2,
              background: e.current ? VIOLET : '#0a0a12',
              border: `2px solid ${e.current ? VIOLET : 'rgba(255,255,255,.3)'}`,
              boxShadow: e.current ? `0 0 0 4px rgba(124,58,237,.2), 0 0 12px ${VIOLET}` : 'none',
            }} />

            {/* Card */}
            <div style={{
              background:  e.current ? 'rgba(124,58,237,.08)' : 'rgba(255,255,255,.03)',
              border:      `1px solid ${e.current ? 'rgba(124,58,237,.3)' : 'rgba(255,255,255,.08)'}`,
              borderLeft:  `3px solid ${e.current ? VIOLET : 'rgba(255,255,255,.2)'}`,
              borderRadius: 12, padding: '14px 16px',
              ...(i === education.length - 1 ? { opacity: 0.85 } : {}),
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2, fontFamily: INTER }}>{e.degree}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, fontFamily: INTER, color: e.current ? '#b794f6' : 'rgba(255,255,255,.5)' }}>
                    {e.fullDegree !== e.degree ? e.fullDegree.replace(e.degree + ' — ', '') : e.institute}
                  </div>
                  {e.fullDegree !== e.degree && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', fontFamily: INTER }}>{e.institute}</div>
                  )}
                  <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>{e.period}</div>
                </div>

                {/* Badge */}
                {e.current ? (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, color: '#c4b5fd', background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.4)', whiteSpace: 'nowrap' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c4b5fd', animation: 'edu-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                    En curso
                  </span>
                ) : (
                  <span style={{ flexShrink: 0, display: 'inline-flex', fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', whiteSpace: 'nowrap' }}>
                    Completado
                  </span>
                )}
              </div>

              {e.description && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.6, marginTop: 10, fontFamily: INTER }}>{e.description}</div>
              )}

              {e.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {e.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6,
                      color:       e.current ? '#c4b5fd'                  : 'rgba(255,255,255,.7)',
                      background:  e.current ? 'rgba(124,58,237,.12)'     : 'rgba(255,255,255,.05)',
                      border:      `1px solid ${e.current ? 'rgba(124,58,237,.3)' : 'rgba(255,255,255,.1)'}`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes edu-pulse { 50% { opacity: .3; transform: scale(.7); } }
      `}</style>
    </div>
  );
}

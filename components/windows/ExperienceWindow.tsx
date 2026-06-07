'use client';

import { useState } from 'react';
import { experience } from '@/data/content';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

export default function ExperienceWindow() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';

  const [selected, setSelected] = useState(0);
  const [fading,   setFading]   = useState(false);

  const select = (i: number) => {
    if (i === selected || fading) return;
    setFading(true);
    setTimeout(() => { setSelected(i); setFading(false); }, 160);
  };

  const job = experience[selected];

  /* theme-aware tokens */
  const T = {
    sidebar:     isDark ? 'rgba(0,0,0,0.30)'          : 'rgba(0,0,0,0.04)',
    sidebarBdr:  isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.08)',
    headBdr:     isDark ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.06)',
    itemHover:   isDark ? 'rgba(255,255,255,0.025)'    : 'rgba(0,0,0,0.03)',
    itemActive:  isDark ? 'linear-gradient(90deg,rgba(0,212,255,.12),transparent 80%)' : 'linear-gradient(90deg,rgba(0,212,255,.08),transparent 80%)',
    coInactive:  isDark ? 'rgba(255,255,255,0.65)'     : '#475569',
    roleText:    isDark ? 'rgba(255,255,255,0.35)'     : '#94a3b8',
    crumb:       isDark ? 'rgba(255,255,255,0.40)'     : '#64748b',
    numeral:     isDark ? 'rgba(255,255,255,0.03)'     : 'rgba(0,0,0,0.04)',
    h1Grad:      isDark ? 'linear-gradient(135deg,#fff 0%,#00d4ff 100%)' : 'linear-gradient(135deg,#0f172a 0%,#0066ff 100%)',
    period:      isDark ? 'rgba(255,255,255,0.40)'     : '#94a3b8',
    desc:        isDark ? 'rgba(255,255,255,0.60)'     : '#475569',
    statusText:  isDark ? 'rgba(255,255,255,0.85)'     : '#1e293b',
  };

  return (
    <div
      className="h-full flex"
      style={{ position: 'relative', boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.08)' }}
    >
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: T.sidebar,
        borderRight: `1px solid ${T.sidebarBdr}`,
        padding: '22px 0', overflowY: 'auto',
      }}>
        <div style={{ padding: '0 22px 14px', borderBottom: `1px solid ${T.headBdr}`, marginBottom: 10 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: '#00d4ff', letterSpacing: '0.14em', fontWeight: 600 }}>
            <span style={{ color: isDark ? 'rgba(255,255,255,.3)' : '#94a3b8' }}>▸ </span>~/experience
          </div>
        </div>
        {experience.map((j, i) => (
          <div
            key={j.company}
            onClick={() => select(i)}
            style={{
              padding: '13px 22px', cursor: 'pointer',
              borderLeft: `3px solid ${i === selected ? '#00d4ff' : 'transparent'}`,
              background: i === selected ? T.itemActive : 'transparent',
              transition: 'background .2s, border-color .2s',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: i === selected ? '#00d4ff' : T.coInactive, transition: 'color .2s', fontFamily: INTER }}>
              {j.company}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.roleText, marginTop: 4, letterSpacing: '0.04em' }}>
              {j.role.toUpperCase()}
            </div>
            {j.current && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontFamily: MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ff88' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'exp-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                {t('exp.current', lang)}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, minWidth: 0, padding: '34px 38px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative numeral */}
        <div style={{ position: 'absolute', right: -10, top: -40, fontFamily: INTER, fontWeight: 900, fontSize: 300, lineHeight: 1, color: T.numeral, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }}>
          {String(selected + 1).padStart(2, '0')}
        </div>

        {/* Fading content */}
        <div style={{ opacity: fading ? 0 : 1, transition: 'opacity .18s ease', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.crumb, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            {t('exp.position', lang)} · <b style={{ color: '#00d4ff', fontWeight: 600 }}>{String(selected + 1).padStart(2, '0')}</b> · {job.current ? t('exp.fullTime', lang) : t('exp.intern', lang)}
          </div>

          <h1 style={{
            fontSize: 40, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1, fontFamily: INTER,
            background: T.h1Grad,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {job.company}
          </h1>

          <div style={{ fontFamily: MONO, fontSize: 13, color: '#00d4ff', marginTop: 12, fontWeight: 500 }}>{job.role}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: T.period, marginTop: 6 }}>{job.period}</div>

          <div style={{ width: 40, height: 3, background: '#00d4ff', borderRadius: 2, margin: '20px 0', boxShadow: '0 0 10px rgba(0,212,255,.45)' }} />

          <div style={{ fontSize: 14, lineHeight: 1.8, color: T.desc, maxWidth: 440, fontFamily: INTER }}>{job.description}</div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
            {job.stack.map(s => (
              <span key={s} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, padding: '5px 12px', borderRadius: 6, color: '#00d4ff', background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.28)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* EN ACTIVO */}
        {job.current && (
          <div style={{ position: 'absolute', left: 38, bottom: 28, zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: MONO, fontSize: 10, color: T.statusText, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88, 0 0 16px #00ff88', animation: 'exp-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
            {t('exp.active', lang)} · <b style={{ color: '#00ff88', fontWeight: 700 }}>{t('exp.available', lang)}</b>
          </div>
        )}
      </div>

      <style>{`@keyframes exp-pulse { 50% { opacity:.3; transform:scale(.7); } }`}</style>
    </div>
  );
}

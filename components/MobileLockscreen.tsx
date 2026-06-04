'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal, projects } from '@/data/content';

const OUTFIT = 'var(--font-outfit), system-ui, sans-serif';
const MONO   = 'var(--font-jetbrains), monospace';
const C_PURPLE = '#a855f7';
const C_CYAN   = '#00e5ff';
const C_GREEN  = '#22d3a5';

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ── Status bar icons ── */
function StatusIcons() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff">
        <rect x="0" y="7" width="3" height="4" rx="1"/>
        <rect x="4.5" y="5" width="3" height="6" rx="1"/>
        <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
        <rect x="13.5" y="0" width="3" height="11" rx="1"/>
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="#fff">
        <path d="M8 2.2c2 0 3.8.8 5.1 2l1.1-1.2A9 9 0 0 0 8 .4 9 9 0 0 0 1.8 3l1.1 1.2A7.2 7.2 0 0 1 8 2.2zM8 5.5c1.1 0 2.1.4 2.8 1.2l1.1-1.2A6 6 0 0 0 8 3.8a6 6 0 0 0-3.9 1.7l1.1 1.2A4 4 0 0 1 8 5.5zm0 3.2L9.6 7A2.3 2.3 0 0 0 8 6.4 2.3 2.3 0 0 0 6.4 7L8 8.7z"/>
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="1" y="1" width="21" height="10" rx="2.5" stroke="#fff" strokeOpacity=".4"/>
        <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill="#fff"/>
        <rect x="23" y="4" width="1.5" height="4" rx=".75" fill="#fff" fillOpacity=".5"/>
      </svg>
    </div>
  );
}

/* ── Shared glass pill ── */
const pillStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '7px 13px', borderRadius: 999,
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.10)',
  fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.9)',
  fontFamily: OUTFIT,
};

/* ── Widget card ── */
function Widget({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 18, padding: '14px 16px',
    }}>
      {children}
    </div>
  );
}

interface Props {
  isLocked: boolean;
  isBooting: boolean;
  onUnlock: () => void;
}

export default function MobileLockscreen({ isLocked, isBooting, onUnlock }: Props) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
      setDate(`${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const liveProjects = projects.filter(p => p.status !== 'in-development').length;

  return (
    <AnimatePresence>
      {!isBooting && isLocked && (
        <motion.div
          key="lockscreen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 50, cursor: 'pointer' }}
          onClick={onUnlock}
          onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
          onTouchMove={e => {
            if (touchStartY.current !== null && touchStartY.current - e.touches[0].clientY > 40) {
              onUnlock();
              touchStartY.current = null;
            }
          }}
        >
          {/* ── Background ── */}
          <div style={{ position: 'absolute', inset: 0, background: '#080c14', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 300, height: 300, top: -80, right: -90, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.28), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 280, height: 280, bottom: -60, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.20), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 240, height: 240, bottom: -40, right: -70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,165,0.18), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
          </div>

          {/* ── Dynamic Island ── */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />

          {/* ── Status bar ── */}
          <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: OUTFIT }}>{time}</span>
            <StatusIcons />
          </div>

          {/* ── Content ── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', padding: '58px 22px 22px' }}>

            {/* Top pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={pillStyle}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: C_GREEN, boxShadow: `0 0 8px ${C_GREEN}`, animation: 'ls-pulsedot 1.6s ease-in-out infinite', flexShrink: 0 }} />
                Available
              </span>
              <span style={pillStyle}>
                <span style={{ fontFamily: MONO, color: C_CYAN, fontSize: 11 }}>⌘</span>
                IzanOS 0.3
              </span>
            </div>

            {/* Photo */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              margin: '30px auto 0',
              boxShadow: '0 0 0 2px rgba(255,255,255,.15), 0 0 30px rgba(168,85,247,.4), 0 0 50px rgba(0,229,255,.2)',
              overflow: 'hidden', flexShrink: 0, position: 'relative',
            }}>
              <Image
                src={personal.photo}
                alt={personal.name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>

            {/* Clock */}
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <div style={{
                fontFamily: OUTFIT, fontWeight: 200, fontSize: 88,
                letterSpacing: '-0.04em', lineHeight: 0.9,
                background: 'linear-gradient(135deg, #fff 40%, #d8b4fe 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {time}
              </div>
              <div style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,.75)', marginTop: 10, fontFamily: OUTFIT }}>
                {date}
              </div>
            </div>

            {/* Widgets 2×2 */}
            <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Stack */}
              <Widget>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  STACK
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.15, color: C_CYAN, fontFamily: OUTFIT }}>Next.js / React 19</div>
              </Widget>

              {/* Projects */}
              <Widget>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  PROJECTES
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT }}>{liveProjects}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2, fontFamily: OUTFIT }}>completats</div>
              </Widget>

              {/* Location / Weather */}
              <Widget>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/>
                  </svg>
                  TERRASSA
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT }}>22°</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2, fontFamily: OUTFIT }}>Despejado</div>
              </Widget>

              {/* Dev link */}
              <Widget>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C_PURPLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>
                  DEV
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT }}>
                  izanrubio<span style={{ color: C_PURPLE }}>.info</span>
                </div>
              </Widget>
            </div>

            {/* Swipe up */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                Swipe up to unlock
              </span>
              <span style={{ width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.25)', display: 'block' }} />
            </motion.div>
          </div>

          <style>{`
            @keyframes ls-pulsedot { 50% { opacity:.4; transform:scale(.75); } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

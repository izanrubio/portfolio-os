'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { personal, lockScreen } from '@/data/content';

const INTER = 'var(--font-inter), Inter, sans-serif';
const MONO  = 'var(--font-jetbrains), monospace';

interface LockScreenProps {
  onUnlocked: () => void;
}

export default function LockScreen({ onUnlocked }: LockScreenProps) {
  const [clock, setClock]     = useState('');
  const [dateStr, setDateStr] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const days   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    const pad = (n: number) => n < 10 ? '0' + n : '' + n;
    const tick = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
      setDateStr(`${days[d.getDay()]}, ${pad(d.getDate())} ${months[d.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = () => setUnlocking(true);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 200 }}
      animate={{ opacity: unlocking ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeIn' }}
      onAnimationComplete={() => { if (unlocking) onUnlocked(); }}
      onClick={() => setUnlocking(true)}
    >
      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw', top: '-20vw', left: '-15vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,102,0.32), transparent 65%)',
          filter: 'blur(120px)', mixBlendMode: 'screen' as const, willChange: 'transform',
          animation: 'aurora-drift-1 20s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', width: '65vw', height: '65vw', bottom: '-25vw', right: '-20vw',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,102,255,0.28), transparent 65%)',
          filter: 'blur(120px)', mixBlendMode: 'screen' as const, willChange: 'transform',
          animation: 'aurora-drift-2 25s ease-in-out infinite alternate-reverse',
        }} />
        <div style={{
          position: 'absolute', width: '45vw', height: '45vw', top: '30%', left: '30%',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,255,0.18), transparent 65%)',
          filter: 'blur(120px)', mixBlendMode: 'screen' as const, willChange: 'transform',
          animation: 'aurora-pulse-3 18s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', width: '35vw', height: '35vw', top: '55%', left: '10%',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,0,255,0.10), transparent 65%)',
          filter: 'blur(120px)', mixBlendMode: 'screen' as const, willChange: 'transform',
          animation: 'aurora-drift-4 40s ease-in-out infinite',
        }} />
      </div>

      {/* Frosted glass overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: unlocking ? 'blur(80px) saturate(160%)' : 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: unlocking ? 'blur(80px) saturate(160%)' : 'blur(40px) saturate(160%)',
        transition: 'backdrop-filter 0.6s ease-in, -webkit-backdrop-filter 0.6s ease-in',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px', cursor: 'pointer',
      }}>
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 100% 80% at 50% 45%, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }} />
        {/* Highlight band */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '40%',
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent)',
        }} />

        {/* Center content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          {/* Logo */}
          <svg
            width="32" height="32" viewBox="0 0 100 100" fill="none"
            style={{ opacity: 0.4, marginBottom: '24px' }}
          >
            <polygon points="50,8 86.4,29 86.4,71 50,92 13.6,71 13.6,29" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round"/>
            <circle cx="34" cy="33" r="3" fill="#ffffff"/>
            <line x1="34" y1="40" x2="34" y2="67" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
            <polyline points="44,40 68,40 44,67 68,67" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* Clock */}
          <div style={{
            fontFamily: INTER,
            fontSize: 'clamp(72px, 10vw, 96px)',
            fontWeight: 200, letterSpacing: '-4px',
            color: '#ffffff', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 4px 60px rgba(255,255,255,0.12)',
          }}>
            {clock}
          </div>
          {/* Date */}
          <div style={{
            marginTop: '16px', fontFamily: INTER, fontSize: '16px', fontWeight: 500,
            color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>
            {dateStr}
          </div>

          {/* Profile */}
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.18), 0 8px 20px rgba(0,0,0,0.4)',
              overflow: 'hidden', position: 'relative',
              background: 'linear-gradient(135deg, #1a1d2e 0%, #06080f 100%)',
            }}>
              <Image
                src={personal.photo}
                alt={personal.shortName}
                fill
                sizes="72px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{
              marginTop: '14px', fontFamily: INTER, fontSize: '18px',
              fontWeight: 600, color: '#ffffff', letterSpacing: '-0.005em',
            }}>
              {personal.shortName}
            </div>
            <div style={{
              marginTop: '4px', fontFamily: INTER, fontSize: '13px',
              fontWeight: 400, color: 'rgba(255,255,255,0.5)',
            }}>
              {personal.roles[0]}
            </div>
          </div>

          {/* Unlock hint */}
          <div style={{
            marginTop: '32px', fontFamily: MONO, fontSize: '11px', fontWeight: 500,
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            animation: 'ls-breathe 3s ease-in-out infinite',
          }}>
            <span>Press</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '18px', height: '18px', padding: '0 5px',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)',
              fontSize: '9.5px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)',
            }}>ANY</span>
            <span>or click to unlock</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: '24px',
          padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'rgba(255,255,255,0.5)', zIndex: 1, pointerEvents: 'none',
        }}>
          {/* Left: wifi + battery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8.5a18 18 0 0 1 20 0"/>
                <path d="M5 12a13 13 0 0 1 14 0"/>
                <path d="M8.5 15.5a8 8 0 0 1 7 0"/>
                <circle cx="12" cy="19" r=".8" fill="currentColor"/>
              </svg>
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">
              <svg width="24" height="14" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="2" width="26" height="12" rx="3"/>
                <rect x="3" y="4" width="18" height="8" rx="1.5" fill="currentColor"/>
                <rect x="28" y="6" width="2" height="4" rx="1" fill="currentColor"/>
              </svg>
            </span>
          </div>

          {/* Right: IzanOS logo + version */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            color: 'rgba(255,255,255,0.35)', fontFamily: MONO, fontSize: '11px', letterSpacing: '0.02em',
          }}>
            <svg width="13" height="13" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <polygon points="50,8 86.4,29 86.4,71 50,92 13.6,71 13.6,29" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" strokeLinejoin="round"/>
              <circle cx="34" cy="33" r="3" fill="rgba(255,255,255,0.5)"/>
              <line x1="34" y1="40" x2="34" y2="67" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" strokeLinecap="round"/>
              <polyline points="44,40 68,40 44,67 68,67" stroke="rgba(255,255,255,0.5)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>IzanOS <b style={{ fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>{lockScreen.version}</b></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

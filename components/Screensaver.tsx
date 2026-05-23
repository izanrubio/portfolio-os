'use client';

import { useState, useEffect, useRef } from 'react';

const IDLE_MS = 120_000; // 2 minutes

const DAYS   = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function pad(n: number) { return String(n).padStart(2, '0'); }

interface ScanLine { id: number; top: number; h: number; }

export default function Screensaver() {
  const [visible,    setVisible]    = useState(false);
  const [fadeIn,     setFadeIn]     = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [time,       setTime]       = useState(new Date());
  const [glitching,  setGlitching]  = useState(false);
  const [jitter,     setJitter]     = useState({ x: 0, y: 0 });
  const [dimmed,     setDimmed]     = useState(false);
  const [scanLines,  setScanLines]  = useState<ScanLine[]>([]);

  // Mutable state that callbacks read without stale-closure issues
  const st = useRef({ visible: false, dismissing: false });

  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Glitch orchestrator ──────────────────────────────────────────────────
  function runGlitch(intense = false) {
    if (!st.current.visible) return;

    const duration     = intense ? 700 : 400 + Math.random() * 400;
    const jitterCount  = intense ? 5   : 2 + Math.floor(Math.random() * 2);
    const flickerCount = intense ? 3   : 1 + Math.floor(Math.random() * 2);
    const lineCount    = 2 + Math.floor(Math.random() * 3);

    setGlitching(true);
    setScanLines(Array.from({ length: lineCount }, (_, i) => ({
      id:  Date.now() + i,
      top: 10 + Math.random() * 80,
      h:   2  + Math.floor(Math.random() * 3),
    })));

    // Jitter pulses
    for (let i = 0; i < jitterCount; i++) {
      const delay = i * 80 + Math.random() * 30;
      setTimeout(() => {
        setJitter({ x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
        setTimeout(() => setJitter({ x: 0, y: 0 }), 50);
      }, delay);
    }

    // Opacity flicker
    for (let i = 0; i < flickerCount; i++) {
      setTimeout(() => {
        setDimmed(true);
        setTimeout(() => setDimmed(false), 80);
      }, i * 140 + 30);
    }

    // End glitch
    setTimeout(() => {
      setGlitching(false);
      setScanLines([]);
      setJitter({ x: 0, y: 0 });
      setDimmed(false);
    }, duration);
  }

  function scheduleGlitch() {
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    const delay = 3000 + Math.random() * 5000;
    glitchTimerRef.current = setTimeout(() => {
      if (st.current.visible && !st.current.dismissing) {
        runGlitch();
        scheduleGlitch();
      }
    }, delay);
  }

  // ── Activate ─────────────────────────────────────────────────────────────
  function activate() {
    if (st.current.visible) return;
    st.current.visible = true;
    setVisible(true);
    setFadeIn(false);
    // Two rAF ticks so the initial opacity:0 renders before the transition
    requestAnimationFrame(() => requestAnimationFrame(() => setFadeIn(true)));
    // Entrance glitch + start cycle
    setTimeout(() => { if (st.current.visible) runGlitch(true); }, 600);
    setTimeout(() => { if (st.current.visible) scheduleGlitch(); }, 1500);
  }

  // ── Dismiss ───────────────────────────────────────────────────────────────
  function dismiss() {
    if (!st.current.visible || st.current.dismissing) return;
    st.current.dismissing = true;
    setDismissing(true);

    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    runGlitch(true); // brief intense exit glitch

    setTimeout(() => {
      setFadeIn(false); // triggers 400ms fade-out
      setTimeout(() => {
        st.current.visible    = false;
        st.current.dismissing = false;
        setVisible(false);
        setDismissing(false);
        setGlitching(false);
        setScanLines([]);
        setJitter({ x: 0, y: 0 });
        setDimmed(false);
      }, 400);
    }, 200);
  }

  // ── Idle detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const params = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search) : null;
    const idleMs = params?.get('screensaver') === '1' ? 5000 : IDLE_MS;

    function resetTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(activate, idleMs);
    }

    function onInteraction() {
      if (st.current.visible) dismiss();
      else resetTimer();
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'] as const;
    events.forEach(e => window.addEventListener(e, onInteraction));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, onInteraction));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const now      = time;
  const timeStr  = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr  = `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;
  const opacity  = fadeIn ? 1 : 0;
  const trans    = dismissing ? 'opacity 400ms ease' : 'opacity 1000ms ease';

  const CLOCK_FONT: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontWeight: 100,
    fontSize: 'clamp(80px, 15vw, 160px)',
    letterSpacing: '-4px',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };

  return (
    <>
      <style>{`
        @keyframes ss-breathe {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.4; }
        }
        @keyframes ss-scan {
          from { transform: translateY(0);    opacity: 0.8; }
          to   { transform: translateY(80px); opacity: 0;   }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#000000',
          opacity,
          transition: trans,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'none',
          userSelect: 'none',
          pointerEvents: 'all',
        }}
        onClick={dismiss}
      >
        {/* IzanOS — top right */}
        <span style={{
          position: 'absolute',
          top: '24px', right: '28px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.1em',
        }}>
          IzanOS
        </span>

        {/* Clock + date */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>

          {/* Clock with RGB split + scan lines */}
          <div style={{
            position: 'relative',
            transform: `translateX(${jitter.x}px) translateY(${jitter.y}px)`,
            lineHeight: 1,
          }}>
            {/* Red channel */}
            <span style={{
              ...CLOCK_FONT,
              position: 'absolute', top: 0, left: 0,
              color: 'rgba(255,0,0,0.8)',
              mixBlendMode: 'screen',
              transform: `translateX(${glitching ? -3 : 0}px)`,
              opacity: glitching ? 1 : 0,
              pointerEvents: 'none',
            }}>
              {timeStr}
            </span>

            {/* Main white (green channel) */}
            <span style={{
              ...CLOCK_FONT,
              color: dimmed ? 'rgba(255,255,255,0.7)' : '#ffffff',
              display: 'block',
            }}>
              {timeStr}
            </span>

            {/* Blue channel */}
            <span style={{
              ...CLOCK_FONT,
              position: 'absolute', top: 0, left: 0,
              color: 'rgba(0,255,255,0.8)',
              mixBlendMode: 'screen',
              transform: `translateX(${glitching ? 3 : 0}px)`,
              opacity: glitching ? 1 : 0,
              pointerEvents: 'none',
            }}>
              {timeStr}
            </span>

            {/* Scan lines */}
            {glitching && scanLines.map(line => (
              <div
                key={line.id}
                style={{
                  position: 'absolute',
                  left: '-10px', right: '-10px',
                  top: `${line.top}%`,
                  height: `${line.h}px`,
                  background: 'rgba(0,212,255,0.3)',
                  pointerEvents: 'none',
                  animation: 'ss-scan 200ms linear forwards',
                }}
              />
            ))}
          </div>

          {/* Date */}
          <div style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em',
          }}>
            {dateStr}
          </div>
        </div>

        {/* Wake hint — bottom center */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.15em',
          animation: 'ss-breathe 4s ease-in-out infinite',
        }}>
          — move mouse to wake —
        </div>
      </div>
    </>
  );
}

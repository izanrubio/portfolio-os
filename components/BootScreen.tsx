'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MESSAGES = [
  '[ OK ] Starting IzanOS kernel...',
  '[ OK ] Loading display manager...',
  '[ OK ] Mounting filesystems...',
  '[ OK ] Starting network services...',
  '[ OK ] Loading portfolio modules...',
  '[ OK ] Welcome, visitor.',
];

const MESSAGE_TIMINGS = [400, 900, 1400, 2000, 2700, 3300];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [phase, setPhase] = useState<'boot' | 'flash' | 'done'>('boot');
  const doneRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    MESSAGE_TIMINGS.forEach((t, i) => {
      timers.push(setTimeout(() => {
        setMessages(prev => [...prev, BOOT_MESSAGES[i]]);
      }, t));
    });

    // Non-linear progress: fast → slow → fast
    let startTime: number | null = null;
    const TOTAL = 4000;
    let rafId: number;

    const easeProgress = (t: number) => {
      // Fast at start and end, slow in middle
      const x = t / TOTAL;
      return Math.sin(x * Math.PI * 0.5) * 0.6 + x * 0.4;
    };

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      if (elapsed < TOTAL) {
        setProgress(Math.min(99, easeProgress(elapsed) * 100));
        rafId = requestAnimationFrame(animate);
      } else {
        setProgress(100);
      }
    };
    rafId = requestAnimationFrame(animate);

    timers.push(setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPhase('flash');
      setTimeout(onComplete, 600);
    }, 4200));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="boot"
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
          style={{ background: '#000000' }}
          animate={phase === 'flash' ? { opacity: 0, backgroundColor: '#ffffff' } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Center content */}
          <div className="flex flex-col items-center gap-8">
            {/* Geometric dragon SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                animate={{ filter: ['drop-shadow(0 0 8px #00d4ff44)', 'drop-shadow(0 0 16px #00d4ff88)', 'drop-shadow(0 0 8px #00d4ff44)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Outer hexagon */}
                <polygon points="48,4 88,26 88,70 48,92 8,70 8,26" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.5"/>
                {/* Inner diamond */}
                <polygon points="48,20 72,48 48,76 24,48" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.7"/>
                {/* Dragon wings — left */}
                <path d="M24,48 L8,26 L30,38" stroke="#00d4ff" strokeWidth="1.5" fill="rgba(0,212,255,0.06)" opacity="0.8"/>
                {/* Dragon wings — right */}
                <path d="M72,48 L88,26 L66,38" stroke="#00d4ff" strokeWidth="1.5" fill="rgba(0,212,255,0.06)" opacity="0.8"/>
                {/* Dragon tail */}
                <path d="M48,76 L38,92 L48,82 L58,92Z" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.1)" opacity="0.8"/>
                {/* Dragon head */}
                <path d="M36,26 L48,4 L60,26 L48,20Z" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.12)" opacity="0.9"/>
                {/* Eyes */}
                <circle cx="43" cy="36" r="2.5" fill="#00d4ff" opacity="0.9"/>
                <circle cx="53" cy="36" r="2.5" fill="#00d4ff" opacity="0.9"/>
                {/* Core glow */}
                <circle cx="48" cy="48" r="8" fill="rgba(0,212,255,0.15)"/>
                <circle cx="48" cy="48" r="4" fill="rgba(0,212,255,0.3)"/>
                {/* Center cross-lines */}
                <line x1="48" y1="20" x2="48" y2="76" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
                <line x1="24" y1="48" x2="72" y2="48" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
              </motion.svg>
            </motion.div>

            {/* Text */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: '24px',
                  letterSpacing: '0.4em',
                  color: '#f0f4ff',
                }}
              >
                IzanOS
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '11px',
                  color: '#4a5568',
                  letterSpacing: '0.05em',
                }}
              >
                v2.0.4 — Powered by Izan Rubio
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-56 flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div
                className="w-full overflow-hidden"
                style={{ height: '2px', background: '#1a1a2e', borderRadius: '1px' }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                    borderRadius: '1px',
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          </div>

          {/* System messages — bottom left */}
          <div
            className="absolute bottom-8 left-8 flex flex-col gap-0.5"
            style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: '#4a5568' }}
          >
            {messages.map((msg, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {msg}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

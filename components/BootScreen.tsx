'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootMessages = [
  '[    0.000000] Booting IzanOS kernel...',
  '[    0.142857] Loading security modules...',
  '[    0.420000] Initializing network interfaces...',
  '[    0.831337] Starting window compositor...',
  '[    1.337000] Mounting portfolio filesystem...',
  '[    1.960000] Loading user environment...',
  '[    2.480000] Starting desktop session...',
  '[    2.990000] IzanOS ready.',
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [phase, setPhase] = useState<'logo' | 'loading' | 'flash'>('logo');

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase('loading'), 800);
    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

    const intervals: ReturnType<typeof setTimeout>[] = [];

    bootMessages.forEach((msg, i) => {
      const t = setTimeout(() => {
        setMessages(prev => [...prev, msg]);
      }, i * 280);
      intervals.push(t);
    });

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 - prev) * 0.08 + 0.5;
        return Math.min(next, 99);
      });
    }, 60);

    const doneTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setPhase('flash');
        setTimeout(onComplete, 400);
      }, 400);
    }, 3200);

    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(doneTimer);
    };
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="boot"
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        animate={phase === 'flash' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          {/* Kali-inspired geometric dragon logo */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="40,4 76,28 76,52 40,76 4,52 4,28" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <polygon points="40,14 66,30 66,50 40,66 14,50 14,30" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.4"/>
            <polygon points="40,22 58,32 58,48 40,58 22,48 22,32" fill="#00d4ff" opacity="0.12"/>
            <line x1="40" y1="4" x2="40" y2="76" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
            <line x1="4" y1="28" x2="76" y2="52" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
            <line x1="76" y1="28" x2="4" y2="52" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="40" cy="40" r="6" fill="#00d4ff" opacity="0.8"/>
            <circle cx="40" cy="40" r="3" fill="#ffffff" opacity="0.9"/>
          </svg>

          <div className="text-center">
            <h1
              className="text-white text-2xl font-bold tracking-[0.3em]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              IzanOS
            </h1>
            <p className="text-[#00d4ff] text-xs tracking-widest mt-1 opacity-70">
              v1.0.0-kali
            </p>
          </div>

          {phase === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-64 flex flex-col gap-3"
            >
              <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00d4ff] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <div className="h-28 overflow-hidden flex flex-col justify-end">
                {messages.map((msg, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i === messages.length - 1 ? 0.7 : 0.35 }}
                    className="text-gray-400 text-[10px] leading-5"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {msg}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

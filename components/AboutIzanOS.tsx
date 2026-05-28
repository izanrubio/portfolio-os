'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface AboutIzanOSProps {
  onClose: () => void;
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}

export default function AboutIzanOS({ onClose }: AboutIzanOSProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const text  = dark ? 'rgba(255,255,255,0.85)' : '#0f172a';
  const muted = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const divider = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const rows = [
    { label: 'Version',    value: 'Aurora 0.3' },
    { label: 'Built with', value: 'Next.js 16 · React 19 · Framer Motion' },
    { label: 'Developer',  value: 'Izan Rubio Cerezo' },
    { label: 'Uptime',     value: formatUptime(uptime) },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '400px',
          background: dark ? 'rgba(15,15,25,0.96)' : 'rgba(255,255,255,0.96)',
          border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
          borderRadius: '16px',
          boxShadow: dark
            ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.08)'
            : '0 32px 80px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '24px', height: '24px',
            borderRadius: '50%',
            background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            border: 'none',
            cursor: 'pointer',
            color: muted,
            fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '32px 32px 24px',
          gap: '12px',
        }}>
          {/* IzanOS logo */}
          <svg
            width="64" height="64" viewBox="0 0 100 100" fill="none"
            style={{ filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.5))' }}
          >
            <polygon points="50,8 86.4,29 86.4,71 50,92 13.6,71 13.6,29" stroke="#00d4ff" strokeWidth="3.5" strokeLinejoin="round"/>
            <circle cx="34" cy="33" r="3" fill="#00d4ff"/>
            <line x1="34" y1="40" x2="34" y2="67" stroke="#00d4ff" strokeWidth="3.5" strokeLinecap="round"/>
            <polyline points="44,40 68,40 44,67 68,67" stroke="#00d4ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '28px',
              fontWeight: 700,
              color: text,
              lineHeight: 1,
            }}>
              IzanOS
            </div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              color: '#00d4ff',
              marginTop: '6px',
            }}>
              Aurora 0.3
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: divider, margin: '0 24px' }} />

        {/* Info rows */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rows.map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
              }}
            >
              <span style={{ color: muted }}>{label}</span>
              <span style={{ color: text }}>{value}</span>
            </div>
          ))}

          {/* Status row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
          }}>
            <span style={{ color: muted }}>Status</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: text }}>
              All systems operational
              <span style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 6px rgba(0,255,136,0.6)',
                display: 'inline-block',
              }} />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

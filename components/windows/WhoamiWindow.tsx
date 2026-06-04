'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { personal } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { tRoles } from '@/data/translations';

const MONO   = 'var(--font-jetbrains), monospace';
const INTER  = 'var(--font-inter), Inter, sans-serif';
const ACCENT = '#00d4ff';
const GREEN  = '#00ff88';

const EMAIL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <polyline points="3 7 12 13 21 7"/>
  </svg>
);
const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
  </svg>
);
const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6h0a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.5c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.8C24 .8 23.2 0 22.2 0z"/>
  </svg>
);
const LOCATION_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const PHONE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

function ContactItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  const { theme: _t } = useTheme(); const isDark = _t === 'dark';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '18px 78px 1fr', alignItems: 'center', gap: '14px' }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
        {icon}
      </span>
      <span style={{
        fontFamily: MONO, fontSize: '9px',
        color: isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8', letterSpacing: '0.18em',
        textTransform: 'uppercase', fontWeight: 600,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: INTER, fontSize: '13px',
        color: isDark ? '#fff' : '#0f172a', fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
    </div>
  );
}

function ContactLink({ href, children, target }: { href: string; children: React.ReactNode; target?: string }) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color .2s ease, color .2s ease' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = ACCENT;
        e.currentTarget.style.borderBottomColor = ACCENT;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'inherit';
        e.currentTarget.style.borderBottomColor = 'transparent';
      }}
    >
      {children}
    </a>
  );
}

export default function WhoamiWindow() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [typed, setTyped] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const roles = tRoles(lang).slice(0, 3);
    let r = 0, c = 0, dir: 1 | -1 = 1;

    const step = () => {
      const word = roles[r];
      if (dir === 1) {
        c++;
        if (c >= word.length) {
          dir = -1;
          timerRef.current = setTimeout(step, 2000);
          return;
        }
      } else {
        c--;
        if (c <= 0) { dir = 1; r = (r + 1) % roles.length; }
      }
      setTyped(word.slice(0, c));
      timerRef.current = setTimeout(step, dir === 1 ? 70 : 35);
    };

    timerRef.current = setTimeout(step, 400);
    return () => clearTimeout(timerRef.current);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusRight = [...personal.location.split(', '), 'Spain'].join(' · ');
  const phoneFormatted = personal.contact.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{
        background: isDark ? 'rgba(8,8,12,0.92)' : 'transparent',
        boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.10)',
      }}
    >
      {/* ── PHOTO COLUMN ── */}
      <div style={{ width: '38%', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#04060c' }}>
        <Image
          src={personal.photo}
          alt={personal.name}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Duotone */}
        <div style={{
          position: 'absolute', inset: 0,
          mixBlendMode: 'color',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.55) 0%, transparent 50%, rgba(0,90,130,0.65) 100%)',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 90%, rgba(8,8,12,1) 100%), radial-gradient(ellipse 100% 100% at 50% 40%, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }} />
        {/* Film grain */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none',
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }} />
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 3px)',
          mixBlendMode: 'overlay',
        }} />
        {/* Corner crop marks */}
        <div style={{ position: 'absolute', top: '12px',    left: '12px',  width: '14px', height: '14px', border: '1px solid rgba(255,255,255,0.2)', borderRight: 'none', borderBottom: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: '12px',    right: '12px', width: '14px', height: '14px', border: '1px solid rgba(255,255,255,0.2)', borderLeft: 'none',  borderBottom: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px',  width: '14px', height: '14px', border: '1px solid rgba(255,255,255,0.2)', borderRight: 'none', borderTop: 'none',    zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '14px', height: '14px', border: '1px solid rgba(255,255,255,0.2)', borderLeft: 'none',  borderTop: 'none',    zIndex: 2 }} />
        {/* Label */}
        <div style={{
          position: 'absolute', left: '18px', bottom: '16px',
          fontFamily: MONO, fontSize: '9.5px',
          color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase',
          zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
          /usr/portrait.raw
        </div>
      </div>

      {/* ── INFO COLUMN ── */}
      <div style={{ flex: 1, minWidth: 0, padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Decorative monogram */}
        <div aria-hidden style={{
          position: 'absolute', bottom: '-60px', right: '-30px',
          fontFamily: INTER, fontWeight: 900, fontSize: '360px', lineHeight: 1,
          color: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)', letterSpacing: '-0.08em',
          pointerEvents: 'none', zIndex: 0, userSelect: 'none',
        }}>IR</div>
        {/* Accent blob */}
        <div style={{
          position: 'absolute', width: '200px', height: '200px',
          top: '-50px', right: '-50px',
          background: `radial-gradient(circle, ${ACCENT}, transparent 60%)`,
          filter: 'blur(50px)', opacity: 0.06,
          pointerEvents: 'none', zIndex: 0,
          animation: 'whoamiBlobDrift 14s ease-in-out infinite',
        }} />

        {/* Content above decorations */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ~/WHOAMI path */}
          <div style={{
            fontFamily: MONO, fontSize: '10px', color: ACCENT,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              border: `1.5px solid ${ACCENT}`, borderRight: 'none', borderTop: 'none',
              transform: 'rotate(-45deg)', flexShrink: 0,
            }} />
            ~/WHOAMI
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: INTER, fontWeight: 800,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            lineHeight: 1, letterSpacing: '-0.03em', color: isDark ? '#fff' : '#0f172a', margin: 0,
          }}>
            {personal.name}<span style={{ color: ACCENT }}>.</span>
          </h1>

          {/* Role typer */}
          <div style={{
            marginTop: '8px', height: '18px',
            fontFamily: MONO, fontSize: '13px', color: ACCENT,
            fontWeight: 500, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center',
          }}>
            <span style={{ minWidth: '1ch' }}>{typed}</span>
            <span style={{
              display: 'inline-block', width: '6px', height: '13px',
              background: ACCENT, marginLeft: '4px',
              animation: 'whoamiCaretBlink 1.05s steps(1) infinite',
              boxShadow: '0 0 6px rgba(0,212,255,0.55)',
            }} />
          </div>

          {/* Accent line */}
          <div style={{
            width: '40px', height: '1px',
            background: 'rgba(0,212,255,0.5)',
            margin: '20px 0',
            boxShadow: '0 0 8px rgba(0,212,255,0.35)',
          }} />

          {/* Bio */}
          <p style={{ fontFamily: INTER, fontSize: '14px', lineHeight: 1.85, color: isDark ? '#9ba3af' : '#475569', maxWidth: '380px', margin: 0 }}>
            {personal.shortBio}
          </p>

          {/* Contact items */}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ContactItem icon={EMAIL_ICON} label="Email">
              <ContactLink href={`mailto:${personal.contact.email}`}>{personal.contact.email}</ContactLink>
            </ContactItem>
            <ContactItem icon={GITHUB_ICON} label="GitHub">
              <ContactLink href={personal.contact.github} target="_blank">{personal.contact.github.replace('https://', '')}</ContactLink>
            </ContactItem>
            <ContactItem icon={LINKEDIN_ICON} label="LinkedIn">
              <ContactLink href={personal.contact.linkedin} target="_blank">{personal.contact.linkedin.replace('https://', '')}</ContactLink>
            </ContactItem>
            <ContactItem icon={LOCATION_ICON} label="Location">
              {personal.location}
            </ContactItem>
            <ContactItem icon={PHONE_ICON} label="Phone">
              <ContactLink href={`tel:+34${personal.contact.phone}`}>{phoneFormatted}</ContactLink>
            </ContactItem>
          </div>

          {/* Status bar */}
          <div style={{
            marginTop: 'auto', paddingTop: '24px',
            borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px',
              fontFamily: MONO, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.85)' : '#1e293b',
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: GREEN,
                boxShadow: `0 0 8px ${GREEN}, 0 0 16px ${GREEN}`,
                animation: 'whoamiPulseDot 1.6s ease-in-out infinite',
                flexShrink: 0, display: 'inline-block',
              }} />
              {personal.statusText}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8', letterSpacing: '0.1em' }}>
              {statusRight.split(' · ').map((part, i, arr) => (
                <span key={part}>
                  {part}
                  {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.18)', margin: '0 6px' }}>·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes whoamiBlobDrift {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-20px,15px) scale(1.1); }
        }
        @keyframes whoamiCaretBlink { 50% { opacity: 0; } }
        @keyframes whoamiPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .35; transform: scale(.8); }
        }
      `}</style>
    </div>
  );
}

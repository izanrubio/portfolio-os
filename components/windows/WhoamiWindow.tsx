'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { personal } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, tRoles } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

export default function WhoamiWindow() {
  const { lang } = useLanguage();
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const roles = tRoles(lang);
    let r = 0, c = 0, dir: 1 | -1 = 1;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const word = roles[r];
      if (dir === 1) {
        c++;
        if (c >= word.length) { dir = -1; timer = setTimeout(step, 1600); return; }
      } else {
        c--;
        if (c <= 0) { dir = 1; r = (r + 1) % roles.length; }
      }
      setTyped(word.slice(0, c));
      timer = setTimeout(step, dir === 1 ? 70 : 35);
    };

    timer = setTimeout(step, 400);
    return () => clearTimeout(timer);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0b0d16' }}>
      {/* Photo panel */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ flex: '0 0 42%', minHeight: '360px' }}
      >
        <Image
          src={personal.photo}
          alt={personal.name}
          fill
          className="object-cover"
          style={{ objectPosition: 'center top', filter: 'grayscale(100%) brightness(0.85)' }}
          onError={() => {}}
        />
        {/* Duotone grade */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(0,212,255,0.14), rgba(124,58,237,0.1))',
            mixBlendMode: 'color',
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.82) 100%)',
          }}
        />
        {/* Right fade into info panel */}
        <div
          style={{
            position: 'absolute', inset: '0 0 0 auto',
            width: '80px',
            background: 'linear-gradient(to right, transparent, #0b0d16)',
          }}
        />
        {/* Badge */}
        <div
          style={{
            position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
            fontFamily: MONO, fontSize: '9px', color: 'rgba(0,212,255,0.6)',
            letterSpacing: '0.2em', border: '1px solid rgba(0,212,255,0.2)',
            padding: '4px 10px', borderRadius: '4px',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}
        >
          /USR/PORTRAIT.RAW
        </div>
      </div>

      {/* Info panel */}
      <div
        className="flex-1 flex flex-col justify-center overflow-y-auto"
        style={{ padding: '32px 28px' }}
      >
        <div style={{ fontFamily: MONO, fontSize: '11px', color: '#4a5568', letterSpacing: '0.15em', marginBottom: '14px' }}>
          ~/whoami
        </div>

        <h1
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: '30px',
            lineHeight: 1.15,
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #f0f4ff 0%, rgba(0,212,255,0.85) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {personal.name}.
        </h1>

        {/* Role typer */}
        <div
          style={{ fontFamily: MONO, fontSize: '13px', color: '#aab3c3', marginBottom: '20px', minHeight: '20px' }}
        >
          <span>{typed}</span>
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '14px',
              background: '#00d4ff',
              verticalAlign: 'text-bottom',
              marginLeft: '2px',
              animation: 'caret-blink 1.05s steps(1) infinite',
            }}
          />
        </div>

        <p
          style={{
            fontFamily: INTER,
            fontSize: '13.5px',
            color: '#8892a4',
            lineHeight: 1.75,
            marginBottom: '24px',
            maxWidth: '360px',
          }}
        >
          {t('whoami.bio', lang)}
        </p>

        {/* Social pills */}
        <div className="flex flex-col gap-2" style={{ marginBottom: '24px' }}>
          {[
            {
              href: personal.github,
              label: 'github.com/izanrubio',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
                </svg>
              ),
            },
            {
              href: personal.linkedin,
              label: 'linkedin.com/in/izanrubio',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6h0a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.5c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.8C24 .8 23.2 0 22.2 0z" />
                </svg>
              ),
            },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 14px', width: 'fit-content',
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.12)',
                borderRadius: '50px',
                fontFamily: MONO, fontSize: '12px', color: '#aab3c3',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                e.currentTarget.style.color = '#f0f4ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                e.currentTarget.style.color = '#aab3c3';
              }}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: MONO, fontSize: '12px', color: '#8892a4' }}>
          <span
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#00ff88', boxShadow: '0 0 8px #00ff88',
              display: 'inline-block', flexShrink: 0,
              animation: 'status-pulse 2.2s ease-in-out infinite',
            }}
          />
          <span>{t('whoami.statusLabel', lang)} · <b style={{ color: '#f0f4ff' }}>{t('whoami.status', lang)}</b></span>
        </div>
      </div>

      <style>{`
        @keyframes caret-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes status-pulse { 0%,100%{box-shadow:0 0 6px #00ff88} 50%{box-shadow:0 0 14px #00ff88} }
      `}</style>
    </div>
  );
}

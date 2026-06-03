'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal, projects, skills, filesystem, experience, education } from '@/data/content';
import { FileNode } from '@/types/windows';
import { useLanguage, type Lang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallpaper } from '@/contexts/WallpaperContext';
import type { WallpaperId } from '@/components/WallpaperPicker';
import { t, tRoles } from '@/data/translations';

const INTER = 'var(--font-inter), Inter, sans-serif';
const MONO  = 'var(--font-jetbrains), monospace';

function hexToRgba(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const ACCENT: Record<string, string> = {
  ciberchurros: '#00ff88',
  laraveles:    '#00d4ff',
  stastarat:    '#7c3aed',
  docflow:      '#ff9500',
  barbercompte: '#ff4757',
};

type AppId = 'projects' | 'about' | 'skills' | 'contact' | 'browser' | 'files' | 'terminal' | 'game' | 'settings' | 'experience' | 'education';

const GRADS: Record<AppId, string> = {
  projects: 'linear-gradient(135deg,#00c97a,#00ff9d)',
  about:    'linear-gradient(135deg,#7b2ff7,#a855f7)',
  skills:   'linear-gradient(135deg,#0066ff,#00d4ff)',
  contact:  'linear-gradient(135deg,#ff6b00,#ff9500)',
  browser:  'linear-gradient(135deg,#0066ff,#7b2ff7)',
  files:    'linear-gradient(135deg,#00c97a,#0066ff)',
  terminal: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
  game:     'linear-gradient(135deg,#ff4757,#ff6b35)',
  settings:    'linear-gradient(135deg,#6b7280,#4b5563)',
  experience:  'linear-gradient(135deg,#0066ff,#00d4ff)',
  education:   'linear-gradient(135deg,#7c3aed,#a855f7)',
};

const APP_TITLES: Record<AppId, string> = {
  projects: 'projects.exe', about: 'whoami.exe',   skills:    'skills.exe',
  contact:  'contact.exe',  browser: 'browser.exe', files:    'files.exe',
  terminal:   'terminal.exe', game:    'game.exe',  settings:   'settings.exe',
  experience: 'experience.exe',                    education:  'education.exe',
};

const APP_ACCENTS: Record<AppId, string> = {
  projects: '#00ff88', about: '#7c3aed', skills: '#00d4ff', contact: '#ff9500',
  browser:  '#7c3aed', files: '#00d4ff', terminal: '#00ff88', game: '#ff4757',
  settings:   '#00d4ff',
  experience: '#00d4ff',
  education:  '#7c3aed',
};

/* ── Shared hero header ── */
function VHero({ eyebrow, title, sub, deco, accent }: { eyebrow: string; title: string; sub: React.ReactNode; deco: string; accent: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ position: 'relative', padding: '22px 22px 14px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', top: -90, right: -70, filter: 'blur(50px)', opacity: isDark ? .5 : .3, pointerEvents: 'none', background: `radial-gradient(circle, ${accent}, transparent 60%)` }} />
      <div style={{ position: 'absolute', right: -6, top: -28, fontFamily: INTER, fontWeight: 900, fontSize: 150, lineHeight: 1, color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', letterSpacing: '-0.06em', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>{deco}</div>
      <div style={{ position: 'relative', zIndex: 1, fontFamily: MONO, fontSize: 10, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>{eyebrow}</div>
      <div style={{ position: 'relative', zIndex: 1, fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 6, color: isDark ? '#fff' : '#0f172a', lineHeight: 1.04, fontFamily: INTER }}>{title}</div>
      <div style={{ position: 'relative', zIndex: 1, fontFamily: MONO, fontSize: 11, color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b', marginTop: 8, letterSpacing: '0.03em' }}>{sub}</div>
    </div>
  );
}

/* ── App icon SVG ── */
function AppSvg({ app }: { app: AppId }) {
  const S: React.CSSProperties = { width: 30, height: 30, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' };
  if (app === 'terminal') return (
    <svg viewBox="0 0 24 24" fill="none" style={S}>
      <path d="M5 8l4 4-4 4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17h7"     stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const paths: Record<AppId, React.ReactNode> = {
    projects: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    about:    <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" /></>,
    skills:   <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    contact:  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    browser:  <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" /></>,
    files:    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    game:       <><rect x="3" y="8" width="18" height="10" rx="4" /><path d="M8 12v3M6.5 13.5h3" /><circle cx="15.5" cy="12.5" r=".8" fill="white" /><circle cx="17" cy="14" r=".8" fill="white" /></>,
    settings:   <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    experience: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    education:  <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    terminal:   null,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={S}>{paths[app]}</svg>;
}

/* ════════════════════════════════════════
   PROJECTS APP
════════════════════════════════════════ */
function ProjectsApp() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';
  const accent = APP_ACCENTS.projects;
  return (
    <div style={{ paddingBottom: 40 }}>
      <VHero eyebrow="My Projects" title={`0${projects.length} Projects`} deco="{ }" accent={accent}
        sub={<>Full stack · security · <b style={{ color: accent, fontWeight: 600 }}>built from scratch</b></>} />
      {projects.map((p, i) => {
        const color = ACCENT[p.slug] ?? '#00d4ff';
        const isExp = expanded === p.slug;
        const wip   = p.status === 'in-development';
        return (
          <div key={p.slug} onClick={() => setExpanded(isExp ? null : p.slug)}
            style={{ margin: '12px 18px', borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,.82)', border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,.07)', borderLeft: `3px solid ${color}`, padding: 16, cursor: 'pointer', transition: 'background .2s', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{t(`proj.${p.slug}.category`, lang) || p.category}</span>
              <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', padding: '3px 9px', borderRadius: 999,
                ...(wip ? { color: '#ff9500', background: 'rgba(255,149,0,.12)', border: '1px solid rgba(255,149,0,.3)' }
                         : { color: '#00ff88', background: 'rgba(0,255,136,.12)', border: '1px solid rgba(0,255,136,.3)' }) }}>
                {wip ? 'WIP' : 'LIVE'}
              </span>
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: isDark ? '#fff' : '#0f172a', marginTop: 6, letterSpacing: '-0.01em', fontFamily: INTER }}>{p.name}</div>
            <div style={{ fontSize: 13, color: isDark ? '#9ba3af' : '#475569', lineHeight: 1.55, marginTop: 8, maxHeight: isExp ? 200 : 0, overflow: 'hidden', transition: 'max-height .35s ease' }}>{t(`proj.${p.slug}.description`, lang) || p.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {p.stack.slice(0, 4).map(s => (
                <span key={s} style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color, background: hexToRgba(color, 0.10), border: `1px solid ${hexToRgba(color, 0.28)}` }}>{s}</span>
              ))}
            </div>
            {wip && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, animation: 'mob-dotpulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                {t('projects.inDev', lang)}
              </div>
            )}
            {!wip && isExp && p.demo && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 14, fontFamily: MONO, fontSize: 11, fontWeight: 600, color }}>
                {t('projects.openDemo', lang)} →
              </div>
            )}
            <div style={{ fontFamily: MONO, fontSize: 10, color: isDark ? 'rgba(255,255,255,.2)' : '#94a3b8', marginTop: 8, textAlign: 'right' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════
   ABOUT APP
════════════════════════════════════════ */
function AboutApp() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [typed, setTyped] = useState('');
  const [photoErr, setPhotoErr] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const roles = tRoles(lang).slice(0, 3);
    let r = 0, c = 0, dir: 1 | -1 = 1;
    const step = () => {
      const word = roles[r];
      if (dir === 1) { c++; if (c >= word.length) { dir = -1; timerRef.current = setTimeout(step, 1800); return; } }
      else { c--; if (c <= 0) { dir = 1; r = (r + 1) % roles.length; } }
      setTyped(word.slice(0, c));
      timerRef.current = setTimeout(step, dir === 1 ? 75 : 35);
    };
    timerRef.current = setTimeout(step, 400);
    return () => clearTimeout(timerRef.current);
  }, [lang]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ position: 'relative', width: '100%', height: 320, overflow: 'hidden', background: '#04060c', flexShrink: 0 }}>
        {photoErr ? (
          <div style={{ width: '100%', height: '100%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 32, color: '#fff', letterSpacing: '0.05em' }}>IR</span>
          </div>
        ) : (
          <Image src={personal.photo} alt={personal.name} fill
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            onError={() => setPhotoErr(true)} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,212,255,.45),transparent 50%,rgba(167,85,247,.55))', mixBlendMode: 'color' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(6,7,13,1) 100%)' }} />
      </div>
      <div style={{ padding: '0 22px 30px', marginTop: -40, position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: isDark ? '#fff' : '#0f172a', fontFamily: INTER }}>
          {personal.name}<span style={{ color: '#7c3aed' }}>.</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6, fontWeight: 600, height: 18, display: 'flex', alignItems: 'center' }}>
          {typed}<span style={{ width: 7, height: 11, background: '#7c3aed', display: 'inline-block', verticalAlign: 'text-bottom', marginLeft: 2, animation: 'mob-blink 1s steps(1) infinite' }} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#b794f6', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 18 }}>{t('mobile.about.path', lang)}</div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: isDark ? '#9ba3af' : '#475569', marginTop: 16, fontFamily: INTER }}>{t('whoami.bio', lang)}</p>
        <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)', margin: '20px 0' }} />
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#b794f6', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>{t('mobile.about.contact', lang)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: t('contact.label.email',    lang), value: personal.email,                     href: `mailto:${personal.email}` },
            { label: t('contact.label.github',   lang), value: 'github.com/izanrubio',             href: personal.github },
            { label: t('contact.label.linkedin', lang), value: 'in/izan-rubio-cerezo',             href: personal.linkedin },
            { label: t('contact.label.phone',    lang), value: personal.contact.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'), href: `tel:${personal.contact.phone}` },
            { label: t('contact.label.location', lang), value: personal.location,                  href: null },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.08)'}` }}>
              <span style={{ color: '#b794f6', display: 'flex', width: 18, flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                  <circle cx="12" cy="8" r="4" /><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" />
                </svg>
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: isDark ? 'rgba(255,255,255,.35)' : '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{item.label}</div>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'} rel="noopener"
                    style={{ fontSize: 14, color: isDark ? '#fff' : '#0f172a', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{item.value}</a>
                ) : <div style={{ fontSize: 14, color: isDark ? '#fff' : '#0f172a', fontWeight: 500 }}>{item.value}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.8)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'mob-dotpulse 1.6s ease-in-out infinite', display: 'inline-block' }} />
          {t('whoami.status', lang)}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SKILLS APP
════════════════════════════════════════ */
function SkillsApp() {
  const [filter, setFilter] = useState('All');
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';
  const total = skills.reduce((n, c) => n + c.items.length, 0);
  const catLabel = (key: string, fallback: string) => t(`skills.cat.${key}`, lang) || fallback;
  const allLabel = lang === 'ENG' ? 'All' : lang === 'CAT' ? 'Tot' : 'Todo';
  const pills = [allLabel, ...skills.map(s => catLabel(s.key, s.label))];
  const cats = filter === allLabel ? skills : skills.filter(s => catLabel(s.key, s.label) === filter);
  const accent = APP_ACCENTS.skills;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <VHero eyebrow="Skills" title="My Stack" deco="</>" accent={accent}
        sub={<><b style={{ color: accent, fontWeight: 600 }}>{skills.length}</b> categories · <b style={{ color: accent, fontWeight: 600 }}>{total}</b> technologies</>} />
      {/* Sticky pills */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', gap: 8, padding: '14px 18px', overflowX: 'auto', background: isDark ? 'rgba(6,7,13,.9)' : 'rgba(245,247,252,.92)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'}`, scrollbarWidth: 'none', flexShrink: 0 }}>
        {pills.map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{
            flexShrink: 0, whiteSpace: 'nowrap', fontSize: 13, fontWeight: filter === p ? 600 : 500,
            padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
            background: filter === p ? accent : (isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'),
            color: filter === p ? '#002430' : (isDark ? 'rgba(255,255,255,.7)' : '#475569'),
            border: '1px solid transparent', transition: 'background .2s, color .2s', fontFamily: INTER,
          }}>{p}</button>
        ))}
      </div>
      {/* Skill sections */}
      <div style={{ padding: '4px 18px', overflowY: 'auto', flex: 1 }}>
        {cats.map(cat => (
          <div key={cat.key}>
            <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#fff' : '#0f172a', margin: '22px 0 12px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: INTER }}>
              <span style={{ width: 4, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />
              {catLabel(cat.key, cat.label)}
              <span style={{ fontFamily: MONO, fontSize: 10, color: isDark ? 'rgba(255,255,255,.3)' : '#94a3b8', fontWeight: 400, marginLeft: 'auto' }}>{cat.items.length}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 4 }}>
              {cat.items.map(item => (
                <span key={item} style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, padding: '7px 13px', borderRadius: 8, color: accent, background: hexToRgba(accent, 0.08), border: `1px solid ${hexToRgba(accent, 0.28)}` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CONTACT APP
════════════════════════════════════════ */
function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent]   = useState(false);
  const [errs, setErrs]   = useState<Set<string>>(new Set());
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';
  const accent = APP_ACCENTS.contact;

  const submit = () => {
    const empty = Object.entries(form).filter(([, v]) => !v.trim()).map(([k]) => k);
    if (empty.length) { setErrs(new Set(empty)); setTimeout(() => setErrs(new Set()), 400); return; }
    setSent(true); setForm({ name: '', email: '', msg: '' });
    setTimeout(() => setSent(false), 2600);
  };

  const iStyle = (k: string): React.CSSProperties => ({
    width: '100%', background: isDark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.85)', borderRadius: 10,
    border: `1px solid ${errs.has(k) ? 'rgba(255,71,87,.5)' : (isDark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.1)')}`,
    padding: '12px 14px', color: isDark ? '#fff' : '#0f172a', fontFamily: INTER, fontSize: 14, outline: 'none',
    animation: errs.has(k) ? 'mob-shake 0.35s ease' : 'none',
    transition: 'border-color .2s, box-shadow .2s',
  });

  const cards = [
    { label: t('contact.label.email',    lang), value: personal.email,                                      href: `mailto:${personal.email}` },
    { label: t('contact.label.phone',    lang), value: personal.contact.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'), href: `tel:${personal.contact.phone}` },
    { label: t('contact.label.github',   lang), value: 'github.com/izanrubio',                             href: personal.github },
    { label: t('contact.label.linkedin', lang), value: 'in/izan-rubio-cerezo',                             href: personal.linkedin },
    { label: t('contact.label.location', lang), value: personal.location,                                  href: null },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      <VHero eyebrow={t('contact.heading', lang)} title={t('contact.heading', lang)} deco="TALK" accent={accent}
        sub={<b style={{ color: accent, fontWeight: 600 }}>{t('mobile.contact.responseTime', lang)}</b>} />
      {cards.map(item => (
        item.href ? (
          <a key={item.label} href={item.href} target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'} rel="noopener"
            style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 18px 10px', padding: '15px 16px', background: isDark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.82)', border: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(0,0,0,.07)', borderRadius: 14, cursor: 'pointer', textDecoration: 'none', transition: 'background .18s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,.05)' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, background: hexToRgba(accent, 0.1), border: `1px solid ${hexToRgba(accent, 0.22)}` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" /></svg>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: MONO, fontSize: 9, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{item.label}</span>
              <span style={{ display: 'block', fontSize: 14, color: isDark ? '#fff' : '#0f172a', fontWeight: 500, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke={isDark ? 'rgba(255,255,255,.3)' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
          </a>
        ) : (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 18px 10px', padding: '15px 16px', background: isDark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.82)', border: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(0,0,0,.07)', borderRadius: 14, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,.05)' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, background: hexToRgba(accent, 0.1), border: `1px solid ${hexToRgba(accent, 0.22)}` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontFamily: MONO, fontSize: 9, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{item.label}</span>
              <span style={{ display: 'block', fontSize: 14, color: isDark ? '#fff' : '#0f172a', fontWeight: 500, marginTop: 2 }}>{item.value}</span>
            </span>
          </div>
        )
      ))}
      <div style={{ padding: '8px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t('contact.sendHeader', lang)}</div>
        {(['name','email'] as const).map(k => (
          <div key={k}>
            <label style={{ display: 'block', fontFamily: MONO, fontSize: 9, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{t(`contact.form.${k}`, lang)}</label>
            <input placeholder={t(k === 'name' ? 'contact.form.namePlaceholder' : 'contact.form.emailPlaceholder', lang)} type={k === 'email' ? 'email' : 'text'}
              value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={iStyle(k)} />
          </div>
        ))}
        <div>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: 9, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{t('contact.form.message', lang)}</label>
          <textarea placeholder={t('contact.form.msgPlaceholder', lang)} value={form.msg} onChange={e => setForm(p => ({ ...p, msg: e.target.value }))} rows={3} style={{ ...iStyle('msg'), resize: 'none', lineHeight: 1.5 }} />
        </div>
        <button onClick={submit} style={{
          width: '100%', padding: 14, border: 'none', borderRadius: 12, cursor: 'pointer',
          background: sent ? 'linear-gradient(135deg,#00c97a,#00ff9d)' : `linear-gradient(135deg,#ff6b00,${accent})`,
          color: sent ? '#00220f' : '#1a0c00', fontFamily: INTER, fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'transform .15s, background .35s',
        }}>
          {sent ? t('mobile.contact.sent', lang) : <>{t('contact.form.send', lang)} <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></>}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TERMINAL APP
════════════════════════════════════════ */
type TBlock = { id: number; cmd: string; output: string };
let _tbid = 0;

function buildTermOutputs(lang: Lang): Record<string, string> {
  return {
    whoami:
      `<span style="color:#f0f4ff;font-weight:600;">${personal.name}</span>\n` +
      `<span style="color:#00d4ff;">${t('whoami.role.0', lang)} &amp; ${t('whoami.role.1', lang)}</span>\n` +
      `${personal.location} · <span style="color:#00ff88;">${t('whoami.status', lang)} ●</span>`,

    'ls projects':
      projects.map(p => {
        const stack = ((p as { terminalStack?: string[] }).terminalStack ?? p.stack.slice(0, 3)).join(' · ');
        const wip   = p.status === 'in-development';
        return `<span style="color:#7c3aed;">drwxr-xr-x</span>  <span style="color:#f0f4ff;">${p.name}</span>  <span style="color:rgba(255,255,255,.4);">→ ${stack}</span>${wip ? ` <span style="color:#ff9500;">[${t('projects.inDev', lang)}]</span>` : ''}`;
      }).join('\n'),

    skills:
      skills.map(s =>
        `<span style="color:#00d4ff;font-weight:600;">${(t(`skills.cat.${s.key}`, lang) || s.label).toUpperCase().padEnd(10)}</span><span style="color:#c8d0c8;">${s.items.slice(0, 4).join(' · ')}</span>`
      ).join('\n'),

    'ping izan':
      `<span style="color:#c8d0c8;">${t('contact.label.email', lang)}:    <span style="color:#f0f4ff;">${personal.email}</span></span>\n` +
      `<span style="color:#c8d0c8;">GitHub:   <span style="color:#f0f4ff;">github.com/izanrubio</span></span>\n` +
      `<span style="color:#c8d0c8;">LinkedIn: <span style="color:#f0f4ff;">linkedin.com/in/izan-rubio-cerezo</span></span>\n` +
      `<span style="color:#c8d0c8;">${t('contact.label.phone', lang)}:    <span style="color:#f0f4ff;">${personal.contact.phone}</span></span>\n` +
      `<span style="color:#00ff88;">${t('mobile.terminal.whoami', lang)}</span>`,

    'sudo hire-me': (() => {
      const parts = t('mobile.terminal.hireMe', lang).split('\n');
      return parts.map((line, i) => {
        if (i === 0) return `<span style="color:rgba(255,255,255,.4);">${line}</span>`;
        if (i === 1) return `<span style="color:#00ff88;font-weight:700;">${line}</span>`;
        if (i === parts.length - 1) return `<span style="color:#c8d0c8;">${line}<span style="color:#00d4ff;">${personal.email}</span></span>`;
        return `<span style="color:#c8d0c8;">${line}</span>`;
      }).join('\n');
    })(),

    'nmap localhost':
      `<span style="color:#c8d0c8;">Starting Nmap scan...</span>\n` +
      `<span style="color:#ff4757;font-weight:700;">WARNING: Intrusion attempt logged.</span>\n` +
      `<span style="color:#ff4757;">Nice try. I see you, visitor. 👀</span>\n` +
      `<span style="color:#ff4757;">Access denied.</span>`,
  };
}

const CMD_BUTTONS: string[] = ['whoami', 'ls projects', 'skills', 'ping izan', 'sudo hire-me', 'nmap localhost'];

function TerminalApp() {
  const [blocks, setBlocks] = useState<TBlock[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const { lang } = useLanguage();
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight, behavior: 'smooth' });
  }, [blocks]);

  const run = (cmd: string) => {
    setActive(cmd);
    setTimeout(() => setActive(null), 220);
    const outputs = buildTermOutputs(lang);
    setBlocks(prev => [...prev, { id: _tbid++, cmd, output: outputs[cmd] ?? '' }]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0d0a', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
      {/* CRT scanlines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg,rgba(0,255,136,.012) 0 1px,transparent 1px 3px)', zIndex: 0 }} />

      {/* Welcome header */}
      <div style={{ flexShrink: 0, padding: '14px 16px 10px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: '#00d4ff', fontWeight: 600 }}>IzanOS Terminal v2.0.4</div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{lang === 'ENG' ? 'Tap a command to execute.' : lang === 'CAT' ? 'Toca una ordre per executar.' : 'Toca un comando para ejecutar.'}</div>
        <div style={{ height: 1, background: 'rgba(255,255,255,.08)', marginTop: 10 }} />
      </div>

      {/* Output area */}
      <div ref={outRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 12px', fontFamily: MONO, fontSize: 12, lineHeight: 1.7, position: 'relative', zIndex: 1, scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,136,.2) transparent' }}>
        {blocks.map(b => (
          <div key={b.id} style={{ marginBottom: 14 }}>
            <div style={{ color: '#00ff88' }}>└─$ <span style={{ color: '#f0f4ff' }}>{b.cmd}</span></div>
            <div dangerouslySetInnerHTML={{ __html: b.output }} style={{ whiteSpace: 'pre-wrap', color: '#c8d0c8', paddingLeft: 4, wordBreak: 'break-word' }} />
          </div>
        ))}
        {blocks.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,.2)', fontFamily: MONO, fontSize: 11, paddingTop: 8 }}>No output yet. Tap a command below.</div>
        )}
      </div>

      {/* Command buttons */}
      <div style={{ flexShrink: 0, padding: '10px 14px', paddingBottom: `max(14px, env(safe-area-inset-bottom, 14px))`, borderTop: '1px solid rgba(0,255,136,.08)', background: '#0a0d0a', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {CMD_BUTTONS.map(cmd => (
            <button key={cmd} onClick={() => run(cmd)} style={{
              padding: '14px 10px', borderRadius: 12, cursor: 'pointer',
              background: active === cmd ? 'rgba(0,255,136,.2)' : 'rgba(0,255,136,.06)',
              border: '1px solid rgba(0,255,136,.2)',
              fontFamily: MONO, fontSize: 12, color: '#00ff88',
              transition: 'background .15s ease',
              textAlign: 'left' as const,
            }}>
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   FILES APP
════════════════════════════════════════ */
const FILE_ICONS: Record<string, string> = {
  folder:  `<svg viewBox="0 0 56 56"><defs><linearGradient id="mff" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><path d="M5 16 Q5 13 8 13 L21 13 L26 17 L48 17 Q51 17 51 20 L51 42 Q51 45 48 45 L8 45 Q5 45 5 42 Z" fill="#0a6e8a"/><path d="M5 21 Q5 19 7 19 L49 19 Q51 19 51 21 L51 42 Q51 45 48 45 L8 45 Q5 45 5 42 Z" fill="url(#mff)"/></svg>`,
  url:     `<svg viewBox="0 0 56 56"><defs><radialGradient id="mfu" cx="35%" cy="35%" r="75%"><stop offset="0%" stop-color="#67e8f9"/><stop offset="60%" stop-color="#0891b2"/><stop offset="100%" stop-color="#082f49"/></radialGradient></defs><circle cx="28" cy="28" r="18" fill="url(#mfu)"/><ellipse cx="28" cy="28" rx="18" ry="7" fill="none" stroke="rgba(255,255,255,.45)"/><ellipse cx="28" cy="28" rx="7" ry="18" fill="none" stroke="rgba(255,255,255,.45)"/><circle cx="28" cy="28" r="18" fill="none" stroke="rgba(255,255,255,.5)"/></svg>`,
  pdf:     `<svg viewBox="0 0 56 56"><defs><linearGradient id="mfp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff7a86"/><stop offset="100%" stop-color="#ff4757"/></linearGradient></defs><path d="M12 6 L38 6 L50 18 L50 50 Q50 52 48 52 L12 52 Q10 52 10 50 L10 8 Q10 6 12 6 Z" fill="url(#mfp)"/><path d="M38 6 L38 18 L50 18 Z" fill="rgba(0,0,0,.25)"/><text x="30" y="40" text-anchor="middle" font-family="monospace" font-size="9" font-weight="800" fill="#fff">PDF</text></svg>`,
  png:     `<svg viewBox="0 0 56 56"><defs><linearGradient id="mfi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6b21a8"/></linearGradient></defs><rect x="6" y="10" width="44" height="36" rx="4" fill="url(#mfi)"/><circle cx="40" cy="22" r="3.5" fill="rgba(255,255,255,.55)"/><path d="M10 40 L22 26 L32 36 L40 30 L50 40 L50 46 L6 46 Z" fill="rgba(0,0,0,.3)"/></svg>`,
  readme:  `<svg viewBox="0 0 56 56"><defs><linearGradient id="mfr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffb86b"/><stop offset="100%" stop-color="#ff9500"/></linearGradient></defs><rect x="6" y="10" width="44" height="36" rx="5" fill="url(#mfr)"/><rect x="6" y="10" width="44" height="8" rx="5" fill="rgba(0,0,0,.2)"/><rect x="11" y="24" width="20" height="2.5" rx="1" fill="rgba(255,255,255,.85)"/><rect x="11" y="30" width="30" height="2.5" rx="1" fill="rgba(255,255,255,.6)"/><rect x="11" y="36" width="22" height="2.5" rx="1" fill="rgba(255,255,255,.45)"/></svg>`,
};

function FilesApp() {
  const [pathStack, setPathStack] = useState<string[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getNode = (path: string[]): FileNode => {
    let node: FileNode = filesystem;
    for (const name of path) { const c = node.children?.find(x => x.name === name); if (c) node = c; }
    return node;
  };

  const current = getNode(pathStack);
  const items   = current.children ?? [];
  const fullPath = ['Home', ...pathStack];

  const open = (node: FileNode) => {
    if (node.type === 'folder') { setPathStack(p => [...p, node.name]); return; }
    if (node.type === 'pdf')    { window.open(node.path ?? '/cv.pdf', '_blank'); return; }
    if (node.type === 'url')    { window.open(node.url, '_blank'); return; }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
      {/* Breadcrumb bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 18px', fontFamily: MONO, fontSize: 12, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.07)'}`, flexWrap: 'wrap' }}>
        {fullPath.map((part, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span style={{ color: isDark ? 'rgba(255,255,255,.2)' : '#94a3b8' }}>›</span>}
            <span onClick={() => i < fullPath.length - 1 ? setPathStack(pathStack.slice(0, i)) : undefined}
              style={{ color: i === fullPath.length - 1 ? '#00d4ff' : (isDark ? 'rgba(255,255,255,.4)' : '#475569'), cursor: i < fullPath.length - 1 ? 'pointer' : 'default' }}>
              {part}
            </span>
          </span>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, padding: 18 }}>
        {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 20px', color: isDark ? 'rgba(255,255,255,.3)' : '#94a3b8', fontSize: 14 }}>Esta carpeta está vacía</div>}
        {items.map(node => (
          <div key={node.name} onClick={() => open(node)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', borderRadius: 14, background: isDark ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.78)', border: isDark ? '1px solid transparent' : '1px solid rgba(0,0,0,.07)', cursor: 'pointer', textAlign: 'center', transition: 'background .18s', boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ width: 54, height: 54 }} dangerouslySetInnerHTML={{ __html: FILE_ICONS[node.type] ?? FILE_ICONS.readme }} />
            <div style={{ fontFamily: MONO, fontSize: 11, color: isDark ? 'rgba(255,255,255,.85)' : '#0f172a', lineHeight: 1.3, wordBreak: 'break-word' }}>
              {node.name.replace(/\.(url|pdf|png|readme)$/i, '')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   GAME APP
════════════════════════════════════════ */
function GameApp() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const rafRef     = useRef(0);
  const [score, setScore]  = useState(0);
  const [lives, setLives]  = useState(3);
  const [overlay, setOverlay] = useState<{ big: string; sub: string; win: boolean } | null>({
    big: 'FIREWALL BREAKER', sub: 'Tap to start · drag to move', win: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const ROWS = [
      { c:'#00d4ff',h:1 },{ c:'#00b6ea',h:1 },{ c:'#3a7bff',h:1 },
      { c:'#7c3aed',h:2 },{ c:'#ff9500',h:2 },{ c:'#ff4757',h:3 },
    ];
    const COLS = 6, PAD = 12, GAP = 6, TOP = 58;
    const BW = (W - PAD*2 - GAP*(COLS-1)) / COLS;
    const BH = Math.min(38, (H*0.42 - TOP - GAP*(ROWS.length-1)) / ROWS.length);

    type Block = { x:number; y:number; w:number; h:number; c:string; hits:number; max:number; alive:boolean };
    type Particle = { x:number; y:number; vx:number; vy:number; life:number; max:number; col:string };

    let blocks: Block[] = [], parts: Particle[] = [], playing = false;
    let sc = 0, lv = 3;
    let ball = { x:W/2, y:H-58, r:6, vx:0, vy:0, stuck:true, sp:3.6 };
    let paddle = { x:W/2-40, y:H-42, w:80, h:10 };

    const reset = () => {
      blocks = [];
      for (let r = 0; r < ROWS.length; r++)
        for (let c = 0; c < COLS; c++)
          blocks.push({ x:PAD+c*(BW+GAP), y:TOP+r*(BH+GAP), w:BW, h:BH, c:ROWS[r].c, hits:ROWS[r].h, max:ROWS[r].h, alive:true });
      paddle = { x:W/2-40, y:H-42, w:80, h:10 };
      ball = { x:W/2, y:H-58, r:6, vx:0, vy:0, stuck:true, sp:3.6 };
      sc = 0; lv = 3; setScore(0); setLives(3);
    };

    const launch = () => {
      ball.stuck = false;
      const a = -Math.PI/2 + (Math.random()-.5)*.6;
      ball.vx = Math.cos(a)*ball.sp; ball.vy = Math.sin(a)*ball.sp;
    };

    const burst = (x: number, y: number, c: string) => {
      for (let i = 0; i < 10; i++) {
        const a = Math.random()*Math.PI*2, s = 1+Math.random()*2.5;
        parts.push({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:0, max:22, col:c });
      }
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
    };

    const step = () => {
      ctx.clearRect(0, 0, W, H);
      // Grid background
      ctx.strokeStyle = 'rgba(0,212,255,0.045)'; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      if (playing && !ball.stuck) {
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x-ball.r < 0) { ball.x=ball.r; ball.vx*=-1; }
        if (ball.x+ball.r > W) { ball.x=W-ball.r; ball.vx*=-1; }
        if (ball.y-ball.r < 0) { ball.y=ball.r; ball.vy*=-1; }
        if (ball.y-ball.r > H) {
          lv--; setLives(lv);
          if (lv <= 0) { playing = false; setOverlay({ big:'CONNECTION LOST', sub:'Tap to reconnect', win:false }); }
          else { ball.stuck=true; ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-ball.r-1; }
        }
        if (ball.vy>0 && ball.x>paddle.x && ball.x<paddle.x+paddle.w && ball.y+ball.r>=paddle.y && ball.y<paddle.y+paddle.h) {
          ball.y=paddle.y-ball.r;
          const off=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2), ang=off*(Math.PI/3), sp=Math.hypot(ball.vx,ball.vy);
          ball.vx=Math.sin(ang)*sp; ball.vy=-Math.abs(Math.cos(ang)*sp);
        }
        for (const b of blocks) {
          if (!b.alive) continue;
          if (ball.x+ball.r<b.x||ball.x-ball.r>b.x+b.w||ball.y+ball.r<b.y||ball.y-ball.r>b.y+b.h) continue;
          const px=ball.x-ball.vx, py=ball.y-ball.vy;
          if ((px+ball.r<=b.x)||(px-ball.r>=b.x+b.w)) ball.vx*=-1; else ball.vy*=-1;
          b.hits--; sc+=25*b.max; setScore(sc);
          if (b.hits<=0) { b.alive=false; burst(b.x+b.w/2,b.y+b.h/2,b.c); sc+=50; setScore(sc);
            if (!blocks.some(x=>x.alive)) { playing=false; setOverlay({ big:'SYSTEM BREACHED', sub:'Full access granted · tap to replay', win:true }); }
          } else burst(b.x+b.w/2,b.y+b.h/2,b.c);
          break;
        }
      } else if (ball.stuck) { ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-ball.r-1; }

      // Draw blocks
      for (const b of blocks) {
        if (!b.alive) continue;
        const dmg=1-b.hits/b.max;
        ctx.fillStyle=b.c; ctx.globalAlpha=0.85-dmg*0.3;
        roundRect(b.x,b.y,b.w,b.h,4); ctx.fill(); ctx.globalAlpha=1;
        ctx.fillStyle='rgba(255,255,255,.18)'; ctx.fillRect(b.x+2,b.y+2,b.w-4,1.6);
      }
      // Particles
      for (let i=parts.length-1;i>=0;i--) {
        const p=parts[i]; p.life++; p.x+=p.vx; p.y+=p.vy; p.vy+=.12;
        const a=1-p.life/p.max; if(a<=0){parts.splice(i,1);continue;}
        ctx.globalAlpha=a; ctx.fillStyle=p.col; ctx.fillRect(p.x,p.y,2.5,2.5); ctx.globalAlpha=1;
      }
      // Paddle
      ctx.fillStyle='rgba(255,255,255,.22)'; roundRect(paddle.x,paddle.y,paddle.w,paddle.h,4); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=1; roundRect(paddle.x+.5,paddle.y+.5,paddle.w-1,paddle.h-1,4); ctx.stroke();
      ctx.fillStyle='rgba(0,212,255,.6)'; ctx.fillRect(paddle.x+4,paddle.y+paddle.h+1,paddle.w-8,1.5);
      // Ball
      ctx.save(); ctx.shadowColor='#fff'; ctx.shadowBlur=10; ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill(); ctx.restore();
      // TAP TO CONTINUE when ball is stuck mid-game (life lost, not game over)
      if (playing && ball.stuck) {
        ctx.save();
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const msg = 'TAP TO CONTINUE';
        const tw = ctx.measureText(msg).width;
        ctx.fillStyle = 'rgba(0,0,0,.65)';
        ctx.beginPath(); ctx.roundRect(W/2-tw/2-14, H/2-14, tw+28, 28, 6); ctx.fill();
        ctx.fillStyle = '#00ff88'; ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 6;
        ctx.fillText(msg, W/2, H/2);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const movePaddle = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      const x = (clientX-r.left)*(W/r.width);
      paddle.x = Math.max(0, Math.min(W-paddle.w, x-paddle.w/2));
    };

    const onOverlayClick = () => {
      setOverlay(null);
      if (!playing) { reset(); }
      playing = true;
      if (ball.stuck) launch();
    };
    // Expose start handler
    (canvas as HTMLCanvasElement & { _onOverlayClick?: () => void })._onOverlayClick = onOverlayClick;

    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); movePaddle(e.touches[0].clientX); };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      movePaddle(e.touches[0].clientX);
      if (playing && ball.stuck) launch();
    };
    const onMouseMove  = (e: MouseEvent) => { if (e.buttons) movePaddle(e.clientX); };
    const onMouseDown  = (e: MouseEvent) => { movePaddle(e.clientX); if (playing && ball.stuck) launch(); };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mousedown',  onMouseDown);

    reset();
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mousedown',  onMouseDown);
    };
  }, []);

  const handleOverlay = () => {
    const canvas = canvasRef.current as (HTMLCanvasElement & { _onOverlayClick?: () => void }) | null;
    canvas?._onOverlayClick?.();
  };

  return (
    <div ref={wrapRef} style={{ flex: 1, minHeight: 0, height: '100%', position: 'relative', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* HUD */}
      <div style={{ position: 'absolute', top: 10, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#ff4757', letterSpacing: '0.06em', textShadow: '0 0 8px rgba(255,71,87,.4)' }}>
          <span style={{ display: 'block', fontSize: 8, color: 'rgba(255,71,87,.6)', letterSpacing: '0.16em' }}>BREACH</span>
          {String(score).padStart(4, '0')}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0,1,2].map(i => (
            <svg key={i} viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15, color: i < lives ? '#ff4757' : 'rgba(255,255,255,.14)' }}>
              <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5z"/>
            </svg>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }} />
      {overlay && (
        <div onClick={handleOverlay} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'rgba(8,8,16,.72)', backdropFilter: 'blur(3px)', zIndex: 3, textAlign: 'center', padding: 30, cursor: 'pointer' }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '0.03em', color: overlay.win ? '#00ff88' : '#ff4757', textShadow: overlay.win ? '0 0 18px rgba(0,255,136,.5)' : '0 0 18px rgba(255,71,87,.5)' }}>{overlay.big}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.6)', letterSpacing: '0.1em', animation: 'mob-floatup 2s ease-in-out infinite' }}>{overlay.sub}</div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   SETTINGS APP
════════════════════════════════════════ */
const WP_LIST: { id: WallpaperId; name: string; grad: string }[] = [
  { id:'aurora',    name:'Aurora',    grad:'linear-gradient(135deg,#00ff88,#00d4ff,#7c3aed)' },
  { id:'sunset',    name:'Sunset',    grad:'linear-gradient(135deg,#ff9500,#ff4757,#7c3aed)' },
  { id:'ocean',     name:'Ocean',     grad:'linear-gradient(135deg,#0066ff,#00d4ff,#00ff88)' },
  { id:'cyberpunk', name:'Cyberpunk', grad:'linear-gradient(135deg,#ec4899,#7c3aed,#00d4ff)' },
  { id:'midnight',  name:'Midnight',  grad:'linear-gradient(135deg,#0a0a2e,#16213e,#0066ff)' },
  { id:'forest',    name:'Forest',    grad:'linear-gradient(135deg,#0a2e1a,#00c97a,#00ff88)' },
];

/* per-wallpaper blob radial-gradient colors [wb1, wb2, wb3] */
const WP_BLOBS: Record<string, [string,string,string]> = {
  aurora:    ['rgba(0,255,136,.3)',   'rgba(0,102,255,.3)',   'rgba(124,58,237,.22)'],
  sunset:    ['rgba(255,149,0,.38)',  'rgba(255,71,87,.32)',  'rgba(124,58,237,.25)'],
  ocean:     ['rgba(0,102,255,.38)',  'rgba(0,212,255,.32)',  'rgba(0,255,136,.2)'],
  cyberpunk: ['rgba(236,72,153,.38)','rgba(124,58,237,.32)', 'rgba(0,212,255,.2)'],
  midnight:  ['rgba(0,102,255,.28)',  'rgba(10,10,80,.9)',    'rgba(124,58,237,.2)'],
  forest:    ['rgba(0,201,122,.38)',  'rgba(0,255,136,.28)',  'rgba(0,102,50,.3)'],
};

/* section label translations for Settings */
const SET_LABELS: Record<string, [string,string,string,string]> = {
  CAS: ['Apariencia', 'Sistema', 'Contacto',  'Créditos'],
  CAT: ['Aparença',   'Sistema', 'Contacte',  'Crèdits'],
  ENG: ['Appearance', 'System',  'Contact',   'Credits'],
};

/* app-name translations */
const APP_LABEL_MAP: Record<string, Record<string,string>> = {
  CAS: { projects:'Proyectos', about:'Sobre mí',  skills:'Skills',    contact:'Contacto', browser:'Navegador', files:'Archivos', terminal:'Terminal', game:'Juego',    settings:'Ajustes' },
  CAT: { projects:'Projectes', about:'Sobre mi',  skills:'Skills',    contact:'Contacte', browser:'Navegador', files:'Arxius',   terminal:'Terminal', game:'Joc',      settings:'Ajustos' },
  ENG: { projects:'Projects',  about:'About',     skills:'Skills',    contact:'Contact',  browser:'Browser',   files:'Files',    terminal:'Terminal', game:'Game',     settings:'Settings' },
};

function SettingsApp() {
  const { theme, toggleTheme }             = useTheme();
  const { lang, setLang }                  = useLanguage();
  const { wallpaper, setWallpaper: onWallpaper } = useWallpaper();
  const [uptime, setUptime]    = useState(0);
  const [toast, setToast]      = useState<string | null>(null);
  const [wpOpen, setWpOpen]    = useState(false);
  const toastRef               = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { const id = setInterval(() => setUptime(s => s + 1), 1000); return () => clearInterval(id); }, []);
  useEffect(() => () => clearTimeout(toastRef.current), []);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 1900);
  };

  const fmtUptime = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

  const selWp  = WP_LIST.find(w => w.id === wallpaper) ?? WP_LIST[0];
  const sLabels = SET_LABELS[lang] ?? SET_LABELS.CAS;

  const isDark = theme === 'dark';
  const COL   = isDark ? '#fff' : '#0f172a';
  const MUTED = isDark ? 'rgba(255,255,255,.45)' : '#64748b';

  /* row helper */
  const ROW: React.CSSProperties = { display:'flex', alignItems:'center', gap:14, padding:'0 16px', minHeight:50 };
  const CARD: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.85)',
    border: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(0,0,0,.06)',
    borderRadius:14, overflow:'hidden',
    ...(isDark ? {} : { boxShadow:'0 2px 8px rgba(0,0,0,.06)' }),
  };
  const SEP: React.CSSProperties = { borderTop: isDark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(0,0,0,.06)' };
  const CHEV = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
  const EXT  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

  const secLabel = (txt: string, mt = 22) => (
    <div style={{ fontFamily:INTER, fontSize:12, fontWeight:600, color: isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 8px 8px', marginTop:mt }}>{txt}</div>
  );

  const ic = (color: string, svg: React.ReactNode) => (
    <span style={{ width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color }}>{svg}</span>
  );

  const right = (...nodes: React.ReactNode[]) => (
    <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, color:MUTED, fontSize:14, flexShrink:0 }}>{...nodes}</span>
  );

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'20px 16px 40px', scrollbarWidth:'none', position:'relative' }}>

      {/* ── APARIENCIA ── */}
      {secLabel(sLabels[0], 0)}
      <div style={CARD}>
        {/* Tema */}
        <div style={ROW}>
          {ic('#00d4ff', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Tema oscuro</span>
          {right(
            <div onClick={() => { toggleTheme(); showToast(isDark ? 'Tema claro activado' : 'Tema oscuro activado'); }}
              style={{ width:44, height:26, borderRadius:999, background: isDark ? '#00d4ff' : 'rgba(0,0,0,.15)', position:'relative', cursor:'pointer', flexShrink:0, transition:'background .2s' }}>
              <div style={{ position:'absolute', top:3, left:3, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.4)', transition:'transform .2s cubic-bezier(.4,0,.2,1)', transform: theme==='dark' ? 'translateX(18px)' : 'translateX(0)' }} />
            </div>
          )}
        </div>
        {/* Wallpaper */}
        <div style={{ ...ROW, ...SEP, cursor:'pointer' }} onClick={() => setWpOpen(o => !o)}>
          {ic('#00d4ff', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-.8 1.5-1.5 0-.4-.2-.8-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Wallpaper</span>
          {right(
            <span style={{ width:22, height:22, borderRadius:'50%', border: isDark ? '1.5px solid rgba(255,255,255,.3)' : '1.5px solid rgba(0,0,0,.2)', background: selWp.grad, flexShrink:0, display:'block' }} />,
            <span style={{ color:'rgba(255,255,255,.3)', transform: wpOpen ? 'rotate(90deg)' : 'none', transition:'transform .2s', display:'flex' }}>{CHEV}</span>
          )}
        </div>
        {/* Wallpaper picker (collapsible) */}
        <div style={{ maxHeight: wpOpen ? 240 : 0, overflow:'hidden', transition:'max-height .3s ease', background: isDark ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.03)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, padding:16 }}>
            {WP_LIST.map(w => (
              <div key={w.id} onClick={() => { onWallpaper(w.id); showToast(`${w.name} aplicado`); }} style={{ cursor:'pointer', textAlign:'center' }}>
                <div style={{ width:'100%', height:60, borderRadius:10, background:w.grad, border: wallpaper===w.id ? '2px solid #00d4ff' : '2px solid transparent', position:'relative', transition:'border-color .2s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {wallpaper===w.id && <svg viewBox="0 0 24 24" fill="none" stroke="#002430" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,background:'#00d4ff',borderRadius:'50%',padding:3}}><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div style={{ fontFamily:MONO, fontSize:9, color: isDark ? 'rgba(255,255,255,.5)' : '#64748b', marginTop:6, letterSpacing:'0.05em' }}>{w.name}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Idioma */}
        <div style={{ ...ROW, ...SEP }}>
          {ic('#00d4ff', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Idioma</span>
          {right(
            <div style={{ display:'flex', background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', borderRadius:8, padding:2 }}>
              {(['CAS','CAT','ENG'] as const).map(l => (
                <button key={l} onClick={() => { setLang(l); showToast(`Idioma: ${l}`); }}
                  style={{ border:'none', cursor:'pointer', fontFamily:MONO, fontSize:10, fontWeight:600, padding:'5px 9px', borderRadius:6, letterSpacing:'0.04em', background: lang===l ? '#00d4ff' : 'transparent', color: lang===l ? '#002430' : (isDark ? 'rgba(255,255,255,.5)' : '#64748b'), transition:'background .2s, color .2s' }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SISTEMA ── */}
      {secLabel(sLabels[1])}
      <div style={CARD}>
        <div style={ROW}>
          {ic('#7c3aed', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" style={{width:20,height:20}}><path d="M12 3 20 8 17 19 7 19 4 8Z"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>IzanOS Aurora</span>
          {right(<span>0.3</span>)}
        </div>
        <div style={{ ...ROW, ...SEP }}>
          {ic('#7c3aed', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Stack</span>
          {right(<span style={{ fontSize:12 }}>Next · React · Framer</span>)}
        </div>
        <div style={{ ...ROW, ...SEP }}>
          {ic('#7c3aed', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Uptime</span>
          {right(<span style={{ fontFamily:MONO, fontSize:13 }}>{fmtUptime(uptime)}</span>)}
        </div>
        <div style={{ ...ROW, ...SEP, cursor:'pointer' }} onClick={() => showToast('IzanOS Aurora 0.3 · build 2026')}>
          {ic('#7c3aed', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r=".8" fill="currentColor"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>About IzanOS</span>
          {right(<span style={{ color:'rgba(255,255,255,.3)' }}>{CHEV}</span>)}
        </div>
      </div>

      {/* ── CONTACTO ── */}
      {secLabel(sLabels[2])}
      <div style={CARD}>
        <div style={{ ...ROW, cursor:'pointer' }} onClick={() => { navigator.clipboard?.writeText(personal.email).catch(()=>{}); showToast('Copiado ✓'); }}>
          {ic('#00ff88', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>)}
          <span style={{ fontSize:13, color:COL, fontFamily:INTER, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{personal.email}</span>
          {right(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>)}
        </div>
        <a href={personal.github} target="_blank" rel="noopener" style={{ ...ROW, ...SEP, textDecoration:'none', cursor:'pointer', display:'flex' }}>
          {ic('#00ff88', <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>)}
          <span style={{ fontSize:13, color:COL, fontFamily:INTER }}>github.com/izanrubio</span>
          {right(EXT)}
        </a>
        <a href={personal.linkedin} target="_blank" rel="noopener" style={{ ...ROW, ...SEP, textDecoration:'none', cursor:'pointer', display:'flex' }}>
          {ic('#00ff88', <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4z"/></svg>)}
          <span style={{ fontSize:13, color:COL, fontFamily:INTER }}>in/izan-rubio-cerezo</span>
          {right(EXT)}
        </a>
        <a href="/cv.pdf" download style={{ ...ROW, ...SEP, textDecoration:'none', cursor:'pointer', display:'flex', background:'rgba(0,212,255,.06)' }}>
          {ic('#00d4ff', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Curriculum Vitae</span>
          {right(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>)}
        </a>
      </div>

      {/* ── CRÉDITOS ── */}
      {secLabel(sLabels[3])}
      <div style={CARD}>
        <div style={ROW}>
          {ic(isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Desarrollado por</span>
          {right(<span style={{ color:COL }}>{personal.name}</span>)}
        </div>
        <a href="https://github.com/izanrubio/portfolio-os" target="_blank" rel="noopener" style={{ ...ROW, ...SEP, textDecoration:'none', cursor:'pointer', display:'flex' }}>
          {ic(isDark ? 'rgba(255,255,255,.4)' : '#94a3b8', <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>)}
          <span style={{ fontSize:15, color:COL, fontFamily:INTER }}>Código fuente</span>
          {right(<span style={{ fontSize:12 }}>portfolio-os</span>, <span style={{ color:'rgba(255,255,255,.3)' }}>{CHEV}</span>)}
        </a>
        <div style={{ ...ROW, ...SEP, flexDirection:'column', alignItems:'flex-start', padding:'12px 16px', minHeight:'auto' }}>
          <span style={{ fontSize:15, color:COL, fontFamily:INTER, marginBottom:10 }}>Tecnologías</span>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {['Next.js','React','TypeScript','Tailwind','Framer Motion'].map(t => (
              <span key={t} style={{ fontFamily:MONO, fontSize:10, background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', color:COL, border: isDark ? 'none' : '1px solid rgba(0,0,0,.1)', borderRadius:6, padding:'4px 8px', letterSpacing:'0.03em' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background: isDark ? 'rgba(15,15,25,.95)' : 'rgba(255,255,255,.95)', border:'1px solid rgba(0,212,255,.25)', color:COL, fontFamily:MONO, fontSize:12, padding:'9px 16px', borderRadius:999, backdropFilter:'blur(12px)', display:'inline-flex', alignItems:'center', gap:8, zIndex:100, whiteSpace:'nowrap', animation:'mob-chipin .2s ease', boxShadow: isDark ? 'none' : '0 8px 24px rgba(0,0,0,.12)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#00ff88', boxShadow:'0 0 8px #00ff88', flexShrink:0 }} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   TIMELINE HELPERS (shared)
════════════════════════════════════════ */
function Badge({ type, label }: { type: 'live' | 'cur' | 'done'; label: string }) {
  const styles: Record<string, React.CSSProperties> = {
    live: { color: '#00ff88', background: 'rgba(0,255,136,.12)', border: '1px solid rgba(0,255,136,.3)' },
    cur:  { color: '#00d4ff', background: 'rgba(0,212,255,.12)', border: '1px solid rgba(0,212,255,.35)' },
    done: { color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' },
  };
  return (
    <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', ...styles[type] }}>
      {type !== 'done' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animation: 'mob-dotpulse 1.5s ease-in-out infinite', flexShrink: 0 }} />}
      {label}
    </span>
  );
}

/* ════════════════════════════════════════
   EXPERIENCE APP
════════════════════════════════════════ */
function ExperienceApp() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = '#00d4ff';
  const COL   = isDark ? '#fff' : '#0f172a';
  const MUTED = isDark ? 'rgba(255,255,255,.6)' : '#475569';
  const DATE  = isDark ? 'rgba(255,255,255,.4)' : '#94a3b8';
  const CARD_BASE: React.CSSProperties = isDark
    ? { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderLeft: '3px solid rgba(255,255,255,.2)', borderRadius: 12, padding: 16 }
    : { background: 'rgba(255,255,255,.82)', border: '1px solid rgba(0,0,0,.07)', borderLeft: '3px solid rgba(0,0,0,.15)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.05)' };
  const CARD_HL: React.CSSProperties = isDark
    ? { background: hexToRgba(accent, 0.07), border: `1px solid ${hexToRgba(accent, 0.22)}`, borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: 16 }
    : { background: hexToRgba(accent, 0.06), border: `1px solid ${hexToRgba(accent, 0.2)}`, borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.05)' };
  const CHIP_BASE: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color: isDark ? 'rgba(255,255,255,.7)' : '#475569', background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)', border: isDark ? '1px solid rgba(255,255,255,.1)' : '1px solid rgba(0,0,0,.1)' };
  const CHIP_HL: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color: accent, background: hexToRgba(accent, 0.10), border: `1px solid ${hexToRgba(accent, 0.28)}` };
  const DOT_BORDER = isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.2)';

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
      <VHero eyebrow="Experiencia Laboral" title="Work Experience" deco="JOB" accent={accent}
        sub={`${experience.length} posiciones`} />
      <div style={{ position: 'relative', padding: '8px 22px 40px 40px' }}>
        {/* Timeline vertical line */}
        <div style={{ position: 'absolute', left: 28, top: 14, bottom: 40, width: 2, background: `linear-gradient(180deg, ${accent}, rgba(255,255,255,0.08))`, borderRadius: 2 }} />
        {experience.map((e, i) => (
          <div key={e.company} style={{ position: 'relative', marginBottom: 16, opacity: 0, transform: 'translateY(12px)', animation: `mob-tlrise .5s cubic-bezier(.16,1,.3,1) ${i * 70}ms forwards` }}>
            {/* Dot */}
            <div style={{ position: 'absolute', left: -19, top: 18, width: 12, height: 12, borderRadius: '50%', zIndex: 2, background: e.current ? accent : (isDark ? '#06070d' : '#f5f7fc'), border: `2px solid ${e.current ? accent : DOT_BORDER}`, boxShadow: e.current ? `0 0 0 4px ${hexToRgba(accent, 0.20)}, 0 0 12px ${accent}` : 'none' }} />
            <div style={e.current ? CARD_HL : CARD_BASE}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: COL, lineHeight: 1.2 }}>{e.company}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 3, color: e.current ? accent : MUTED }}>{e.role}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: DATE, marginTop: 6 }}>{e.period}</div>
                </div>
                {e.current && <Badge type="live" label="Actual" />}
              </div>
              {e.description && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginTop: 10 }}>{e.description}</div>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {e.stack.map(s => <span key={s} style={e.current ? CHIP_HL : CHIP_BASE}>{s}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   EDUCATION APP
════════════════════════════════════════ */
function EducationApp() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = '#7c3aed';
  const COL   = isDark ? '#fff' : '#0f172a';
  const MUTED = isDark ? 'rgba(255,255,255,.5)' : '#64748b';
  const DATE  = isDark ? 'rgba(255,255,255,.4)' : '#94a3b8';
  const CARD_BASE: React.CSSProperties = isDark
    ? { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderLeft: '3px solid rgba(255,255,255,.2)', borderRadius: 12, padding: 16 }
    : { background: 'rgba(255,255,255,.82)', border: '1px solid rgba(0,0,0,.07)', borderLeft: '3px solid rgba(0,0,0,.15)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.05)' };
  const CARD_HL: React.CSSProperties = isDark
    ? { background: hexToRgba(accent, 0.07), border: `1px solid ${hexToRgba(accent, 0.22)}`, borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: 16 }
    : { background: hexToRgba(accent, 0.06), border: `1px solid ${hexToRgba(accent, 0.2)}`, borderLeft: `3px solid ${accent}`, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,.05)' };
  const CHIP_BASE: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color: isDark ? 'rgba(255,255,255,.7)' : '#475569', background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)', border: isDark ? '1px solid rgba(255,255,255,.1)' : '1px solid rgba(0,0,0,.1)' };
  const CHIP_HL: React.CSSProperties = { fontFamily: MONO, fontSize: 10.5, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color: accent, background: hexToRgba(accent, 0.10), border: `1px solid ${hexToRgba(accent, 0.28)}` };
  const DOT_BORDER = isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.2)';

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
      <VHero eyebrow="Formación Académica" title="Education" deco="EDU" accent={accent}
        sub="IES Nicolau Copèrnic · Terrassa" />
      <div style={{ position: 'relative', padding: '8px 22px 40px 40px' }}>
        <div style={{ position: 'absolute', left: 28, top: 14, bottom: 40, width: 2, background: `linear-gradient(180deg, ${accent}, rgba(255,255,255,0.08))`, borderRadius: 2 }} />
        {education.map((e, i) => (
          <div key={e.degree} style={{ position: 'relative', marginBottom: 16, opacity: 0, transform: 'translateY(12px)', animation: `mob-tlrise .5s cubic-bezier(.16,1,.3,1) ${i * 70}ms forwards`, ...(i === education.length - 1 ? { opacity: .85 } as React.CSSProperties : {}) }}>
            <div style={{ position: 'absolute', left: -19, top: 18, width: 12, height: 12, borderRadius: '50%', zIndex: 2, background: e.current ? accent : (isDark ? '#06070d' : '#f5f7fc'), border: `2px solid ${e.current ? accent : DOT_BORDER}`, boxShadow: e.current ? `0 0 0 4px ${hexToRgba(accent, 0.20)}, 0 0 12px ${accent}` : 'none' }} />
            <div style={{ ...(e.current ? CARD_HL : CARD_BASE), ...(i === education.length - 1 ? { opacity: .85 } : {}) }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COL, lineHeight: 1.2 }}>{e.degree}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: e.current ? accent : MUTED }}>{e.fullDegree !== e.degree ? e.fullDegree.replace(e.degree + ' — ', '') : e.institute}</div>
                  {e.fullDegree !== e.degree && <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{e.institute}</div>}
                  <div style={{ fontFamily: MONO, fontSize: 11, color: DATE, marginTop: 6 }}>{e.period}</div>
                </div>
                {e.current ? <Badge type="cur" label="En curso" /> : <Badge type="done" label="Completado" />}
              </div>
              {e.description && <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginTop: 10 }}>{e.description}</div>}
              {e.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {e.tags.map(tag => <span key={tag} style={e.current ? CHIP_HL : CHIP_BASE}>{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STUB APP
════════════════════════════════════════ */
function StubApp({ app }: { app: AppId }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px 80px', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: 18, background: GRADS[app], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
        <AppSvg app={app} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: INTER }}>{APP_TITLES[app]}</div>
      <div style={{ fontSize: 14, color: '#9ba3af', lineHeight: 1.6, maxWidth: 240, fontFamily: INTER }}>Open the desktop version for the full experience.</div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: '#00d4ff', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 999, background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.25)' }}>
        Open on desktop
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   APP DECLARATIONS
════════════════════════════════════════ */
const APPS: { id: AppId; label: string }[] = [
  { id: 'projects', label: 'Projects' }, { id: 'about',    label: 'About'    },
  { id: 'skills',   label: 'Skills'   }, { id: 'contact',  label: 'Contact'  },
  { id: 'browser',  label: 'Browser'  }, { id: 'files',    label: 'Files'    },
  { id: 'terminal',   label: 'Terminal'   }, { id: 'game',       label: 'Game'       },
  { id: 'settings',   label: 'Settings'   },
  { id: 'experience', label: 'Experience' }, { id: 'education',  label: 'Education'  },
];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function MobilePortfolio() {
  const { theme }          = useTheme();
  const { lang }           = useLanguage();

  const [appState,   setAppState]   = useState<'booting' | 'locked' | 'home'>('booting');
  const [bootMsgs,   setBootMsgs]   = useState<string[]>([]);
  const [bootProg,   setBootProg]   = useState(0);
  const [activeApp,  setActiveApp]  = useState<AppId | null>(null);
  const [appOrigin,  setAppOrigin]  = useState('center center');
  const [appAccent,  setAppAccent]  = useState('#00d4ff');
  const [clock,      setClock]      = useState({ time: '9:41', date: 'Thursday, 29 May' });

  const { wallpaper } = useWallpaper();
  const blobColors = WP_BLOBS[wallpaper] ?? WP_BLOBS.aurora;
  const appLabels  = APP_LABEL_MAP[lang] ?? APP_LABEL_MAP.CAS;

  const screenRef       = useRef<HTMLDivElement>(null);
  const touchStartY     = useRef<number | null>(null);

  /* Clock */
  useEffect(() => {
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const MONS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const pad = (n: number) => n < 10 ? '0'+n : ''+n;
    const tick = () => {
      const d = new Date();
      setClock({ time: `${pad(d.getHours())}:${pad(d.getMinutes())}`, date: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONS[d.getMonth()]}` });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);



  /* Boot sequence */
  useEffect(() => {
    const MSGS = [
      '[ OK ] Starting IzanOS kernel...',
      '[ OK ] Loading display manager...',
      '[ OK ] Mounting filesystems...',
      '[ OK ] Loading portfolio modules...',
      '[ OK ] Welcome, visitor.',
    ];
    const TIMINGS = [400, 900, 1400, 2000, 2800];
    const timers: ReturnType<typeof setTimeout>[] = [];
    TIMINGS.forEach((t, i) => { timers.push(setTimeout(() => setBootMsgs(prev => [...prev, MSGS[i]]), t)); });
    const start = performance.now();
    const TOTAL = 4000;
    let raf: number;
    const animate = (now: number) => {
      const p = Math.min(1, (now - start) / TOTAL);
      const eased = Math.sin(p * Math.PI * 0.5) * 0.6 + p * 0.4;
      setBootProg(Math.min(99, eased * 100));
      if (p < 1) raf = requestAnimationFrame(animate); else setBootProg(100);
    };
    raf = requestAnimationFrame(animate);
    timers.push(setTimeout(() => setAppState('locked'), 4600));
    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const unlock = () => setAppState('home');

  const openApp = (app: AppId, e: React.MouseEvent) => {
    const icon = (e.currentTarget as HTMLElement).querySelector('.mob-icon') as HTMLElement | null;
    if (icon && screenRef.current) {
      const r = icon.getBoundingClientRect();
      const s = screenRef.current.getBoundingClientRect();
      setAppOrigin(`${((r.left + r.width / 2 - s.left) / s.width * 100).toFixed(1)}% ${((r.top + r.height / 2 - s.top) / s.height * 100).toFixed(1)}%`);
    }
    setActiveApp(app);
    setAppAccent(APP_ACCENTS[app]);
  };

  const closeApp = () => setActiveApp(null);

  const appContent: Record<AppId, React.ReactNode> = {
    projects: <ProjectsApp />,
    about:    <AboutApp />,
    skills:   <SkillsApp />,
    contact:  <ContactApp />,
    terminal: <TerminalApp />,
    files:    <FilesApp />,
    browser:  <StubApp app="browser" />,
    game:     <GameApp />,
    settings:   <SettingsApp />,
    experience: <ExperienceApp />,
    education:  <EducationApp />,
  };

  return (
    <>
      <style>{`
        *{-webkit-tap-highlight-color:transparent;}
        .mob-screen{position:fixed;inset:0;background:#000;overflow:hidden;display:flex;flex-direction:column;}
        .mob-wallpaper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#0b1020,#05060c);overflow:hidden;}
        .mob-wb{position:absolute;border-radius:50%;filter:blur(90px);mix-blend-mode:screen;}
        .mob-wb1{width:80vw;height:80vw;top:-20vw;left:-20vw;background:radial-gradient(circle,rgba(0,255,136,.3),transparent 65%);animation:mob-drift1 24s ease-in-out infinite;}
        .mob-wb2{width:90vw;height:90vw;bottom:-30vw;right:-25vw;background:radial-gradient(circle,rgba(0,102,255,.3),transparent 65%);animation:mob-drift2 30s ease-in-out infinite;}
        .mob-wb3{width:60vw;height:60vw;top:35%;left:25%;background:radial-gradient(circle,rgba(124,58,237,.22),transparent 65%);animation:mob-pulse3 20s ease-in-out infinite;}
        @keyframes mob-drift1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(10vw,6vh) scale(1.1);}66%{transform:translate(-4vw,10vh) scale(.95);}}
        @keyframes mob-drift2{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-12vw,-8vh) scale(1.15);}}
        @keyframes mob-pulse3{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.3);}}
        @keyframes mob-dotpulse{50%{opacity:.35;}}
        @keyframes mob-blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mob-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes mob-floatup{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(-6px);opacity:.9;}}
        @keyframes mob-tlrise{to{opacity:1;transform:translateY(0);}}
        .mob-lock{position:absolute;inset:0;z-index:50;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .4s ease;}
        .mob-lock.off{transform:translateY(-100%);opacity:0;pointer-events:none;}
        .mob-home{position:absolute;inset:0;z-index:30;padding:env(safe-area-inset-top,20px) 24px 0;display:flex;flex-direction:column;transition:opacity .3s;}
        .mob-home.dim{opacity:.3;}
        .mob-app-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,4vw,24px) clamp(8px,3vw,16px);margin-top:10px;}
        .mob-app{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;user-select:none;}
        .mob-icon{width:clamp(54px,14vw,68px);height:clamp(54px,14vw,68px);border-radius:15px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 14px -4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.2);transition:transform .15s ease;flex-shrink:0;}
        .mob-app:active .mob-icon{transform:scale(.88);}
        .mob-app-name{font-size:11px;font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);}
        .mob-dock{margin-top:auto;display:flex;justify-content:center;gap:18px;padding:12px 20px;padding-bottom:max(20px,env(safe-area-inset-bottom,20px));border-radius:30px 30px 0 0;background:rgba(255,255,255,.08);backdrop-filter:blur(30px) saturate(180%);-webkit-backdrop-filter:blur(30px) saturate(180%);border-top:1px solid rgba(255,255,255,.1);}
        .mob-dock .mob-icon{width:56px;height:56px;}
        .mob-appview{position:absolute;inset:0;z-index:45;background:#06070d;display:flex;flex-direction:column;opacity:0;transform:translateY(100%);pointer-events:none;transition:opacity .3s ease,transform .35s cubic-bezier(.4,0,.2,1);overflow:hidden;}
        .mob-appview.open{opacity:1;transform:translateY(0);pointer-events:auto;}
        .mob-appnav{flex-shrink:0;height:88px;padding:46px 20px 0;display:flex;align-items:center;gap:8px;background:rgba(8,10,18,.92);border-bottom:1px solid rgba(255,255,255,.06);position:relative;z-index:2;}
        .mob-back{display:inline-flex;align-items:center;gap:3px;color:var(--app-accent,#00d4ff);font-size:16px;font-weight:500;cursor:pointer;background:none;border:none;padding:0;}
        .mob-nav-title{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--font-jetbrains),monospace;font-size:13px;color:rgba(255,255,255,.7);white-space:nowrap;}
        .mob-appscroll{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;}
        .mob-appscroll::-webkit-scrollbar{width:0;}
        .mob-home-ind{position:absolute;bottom:max(6px,env(safe-area-inset-bottom,6px));left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:rgba(255,255,255,.3);z-index:70;cursor:pointer;}
      `}</style>

      <div className="mob-screen" ref={screenRef}>
        <div className="mob-wallpaper" style={{ background: theme === 'light' ? 'radial-gradient(ellipse at 50% 30%,#0f1428,#06080f)' : undefined }}>
          <div className="mob-wb mob-wb1" style={{ background: `radial-gradient(circle,${blobColors[0]},transparent 65%)` }} />
          <div className="mob-wb mob-wb2" style={{ background: `radial-gradient(circle,${blobColors[1]},transparent 65%)` }} />
          <div className="mob-wb mob-wb3" style={{ background: `radial-gradient(circle,${blobColors[2]},transparent 65%)` }} />
        </div>

        {/* Boot screen */}
              <AnimatePresence>
                {appState === 'booting' && (
                  <motion.div key="mob-boot" initial={{ opacity: 1 }} exit={{ opacity: 0, backgroundColor: '#ffffff' }} transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <motion.img src="/icons/logo.svg" alt="IzanOS" width={60} height={60}
                        animate={{ filter: ['drop-shadow(0 0 6px rgba(0,212,255,0.3))','drop-shadow(0 0 16px rgba(0,212,255,0.8))','drop-shadow(0 0 6px rgba(0,212,255,0.3))'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 20, letterSpacing: '0.3em', color: '#f0f4ff', marginTop: 2 }}>IzanOS</div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: '#00d4ff' }}>Aurora 0.3</div>
                    </motion.div>
                    <div style={{ width: 200, height: 2, background: '#1a1a2e', borderRadius: 1, marginTop: 32, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(to right,#00d4ff,#7c3aed)', borderRadius: 1, width: `${bootProg}%`, transition: 'width 0.1s linear' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: 32, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {bootMsgs.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                          style={{ fontFamily: MONO, fontSize: 10, color: '#4a5568' }}>{msg}</motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lock screen */}
              <div className={`mob-lock${appState === 'home' ? ' off' : ''}`}
                style={appState === 'booting' ? { opacity: 0, pointerEvents: 'none' } : {}}
                onClick={appState === 'locked' ? unlock : undefined}
                onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
                onTouchMove={e => { if (touchStartY.current !== null && touchStartY.current - e.touches[0].clientY > 40) { unlock(); touchStartY.current = null; } }}>
                <div style={{ marginTop: 80, width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 0 0 1px rgba(255,255,255,0.15),0 0 24px rgba(255,255,255,0.18),0 8px 20px rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg,#1a1d2e,#06080f)', flexShrink: 0 }}>
                  <Image src={personal.photo} alt={personal.shortName} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ marginTop: 24, fontSize: 80, fontWeight: 300, color: '#fff', letterSpacing: -3, lineHeight: 1, fontFamily: INTER, textShadow: '0 4px 40px rgba(255,255,255,.15)' }}>{clock.time}</div>
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,.85)', letterSpacing: '0.02em', fontFamily: INTER }}>{clock.date}</div>
                <div style={{ marginTop: 'auto', marginBottom: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '0.1em', animation: 'mob-floatup 2s ease-in-out infinite' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                  <span>Swipe up to unlock</span>
                </div>
              </div>

              {/* Home screen */}
              <div className={`mob-home${activeApp ? ' dim' : ''}`}>
                <div className="mob-app-grid">
                  {APPS.map(a => (
                    <div key={a.id} className="mob-app" onClick={e => openApp(a.id, e)}>
                      <div className="mob-icon" style={{ background: GRADS[a.id] }}><AppSvg app={a.id} /></div>
                      <div className="mob-app-name">{appLabels[a.id] ?? a.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mob-dock">
                  {(['browser', 'files', 'terminal'] as AppId[]).map(a => (
                    <div key={a} className="mob-app" onClick={e => openApp(a, e)}>
                      <div className="mob-icon" style={{ background: GRADS[a] }}><AppSvg app={a} /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App view */}
              <div className={`mob-appview${activeApp ? ' open' : ''}`}
                style={{ '--origin': appOrigin, '--app-accent': appAccent } as React.CSSProperties}>
                <div className="mob-appnav">
                  <button className="mob-back" style={{ fontFamily: INTER }} onClick={closeApp}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}><polyline points="15 18 9 12 15 6"/></svg>
                    Home
                  </button>
                  <div className="mob-nav-title">{activeApp ? APP_TITLES[activeApp] : ''}</div>
                </div>
                <div className="mob-appscroll">
                  {activeApp && appContent[activeApp]}
                </div>
              </div>

              {/* Home indicator */}
              <div className="mob-home-ind" onClick={activeApp ? closeApp : undefined} />
            </div>
  </>
  );
}

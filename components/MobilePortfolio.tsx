'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal, projects, skills, filesystem } from '@/data/content';
import { FileNode } from '@/types/windows';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/components/NotificationSystem';
import { tRoles } from '@/data/translations';

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

type AppId = 'projects' | 'about' | 'skills' | 'contact' | 'browser' | 'files' | 'terminal' | 'game';

const GRADS: Record<AppId, string> = {
  projects: 'linear-gradient(135deg,#00c97a,#00ff9d)',
  about:    'linear-gradient(135deg,#7b2ff7,#a855f7)',
  skills:   'linear-gradient(135deg,#0066ff,#00d4ff)',
  contact:  'linear-gradient(135deg,#ff6b00,#ff9500)',
  browser:  'linear-gradient(135deg,#0066ff,#7b2ff7)',
  files:    'linear-gradient(135deg,#00c97a,#0066ff)',
  terminal: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
  game:     'linear-gradient(135deg,#ff4757,#ff6b35)',
};

const APP_TITLES: Record<AppId, string> = {
  projects: 'projects.exe', about: 'whoami.exe',   skills:   'skills.exe',
  contact:  'contact.exe',  browser: 'browser.exe', files:    'files.exe',
  terminal: 'terminal.exe', game:    'game.exe',
};

const CAT_ACCENTS = ['#00d4ff','#7c3aed','#00ff88','#ff9500','#00d4ff','#ff4757','#a855f7'];

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
    game:     <><rect x="3" y="8" width="18" height="10" rx="4" /><path d="M8 12v3M6.5 13.5h3" /><circle cx="15.5" cy="12.5" r=".8" fill="white" /><circle cx="17" cy="14" r=".8" fill="white" /></>,
    terminal: null,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={S}>{paths[app]}</svg>;
}

/* ════════════════════════════════════════
   PROJECTS APP
════════════════════════════════════════ */
function ProjectsApp() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '22px 22px 8px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#00d4ff', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          ~/projects · {String(projects.length).padStart(2, '0')}
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, color: '#fff', fontFamily: INTER }}>Projects.</div>
      </div>
      {projects.map((p, i) => {
        const color = ACCENT[p.slug] ?? '#00d4ff';
        const isExp = expanded === p.slug;
        const wip   = p.status === 'in-development';
        return (
          <div key={p.slug} onClick={() => setExpanded(isExp ? null : p.slug)}
            style={{ margin: '10px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${color}`, padding: '16px', cursor: 'pointer', transition: 'background .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{p.category}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', marginTop: 6, letterSpacing: '-0.01em', fontFamily: INTER }}>{p.name}</div>
            {isExp && <div style={{ fontSize: 13, color: '#9ba3af', lineHeight: 1.55, marginTop: 8, fontFamily: INTER }}>{p.description}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {p.stack.slice(0, 4).map(s => (
                <span key={s} style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, padding: '4px 9px', borderRadius: 6, color, background: hexToRgba(color, 0.10), border: `1px solid ${hexToRgba(color, 0.28)}` }}>{s}</span>
              ))}
            </div>
            {wip && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, animation: 'mob-dotpulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                In development
              </div>
            )}
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
  const [typed, setTyped] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const roles = tRoles(lang).slice(0, 3);
    let r = 0, c = 0, dir: 1 | -1 = 1;
    const step = () => {
      const word = roles[r];
      if (dir === 1) { c++; if (c >= word.length) { dir = -1; timerRef.current = setTimeout(step, 2000); return; } }
      else { c--; if (c <= 0) { dir = 1; r = (r + 1) % roles.length; } }
      setTyped(word.slice(0, c));
      timerRef.current = setTimeout(step, dir === 1 ? 70 : 35);
    };
    timerRef.current = setTimeout(step, 400);
    return () => clearTimeout(timerRef.current);
  }, [lang]);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ position: 'relative', width: '100%', height: 320, overflow: 'hidden', background: '#04060c', flexShrink: 0 }}>
        <Image src={personal.photo} alt={personal.name} fill style={{ objectFit: 'cover', objectPosition: 'top', filter: 'grayscale(100%) brightness(0.72)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,212,255,.45),transparent 50%,rgba(167,85,247,.55))', mixBlendMode: 'color' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(6,7,13,1) 100%)' }} />
      </div>
      <div style={{ padding: '0 22px 30px', marginTop: -40, position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', fontFamily: INTER }}>
          {personal.name}<span style={{ color: '#00d4ff' }}>.</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: '#00d4ff', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6, fontWeight: 600, height: 20, display: 'flex', alignItems: 'center' }}>
          {typed}<span style={{ width: 8, height: 14, background: '#00d4ff', display: 'inline-block', verticalAlign: 'text-bottom', marginLeft: 2, animation: 'mob-blink 1s steps(1) infinite' }} />
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#9ba3af', marginTop: 16, fontFamily: INTER }}>{personal.bio}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'mob-dotpulse 1.6s ease-in-out infinite', display: 'inline-block' }} />
          {personal.statusText}
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Email',    value: personal.email,       href: `mailto:${personal.email}` },
            { label: 'GitHub',   value: 'github.com/izanrubio', href: personal.github },
            { label: 'LinkedIn', value: 'linkedin.com/in/izan-rubio-cerezo', href: personal.linkedin },
            { label: 'Location', value: personal.location,   href: null },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <span style={{ color: '#00d4ff', fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', width: 60, flexShrink: 0 }}>{item.label}</span>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener"
                  style={{ fontSize: 13, color: '#fff', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: INTER }}>{item.value}</a>
              ) : <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, fontFamily: INTER }}>{item.value}</span>}
            </div>
          ))}
        </div>
        <a href="/cv.pdf" download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#7b2ff7,#a855f7)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginTop: 20, boxShadow: '0 8px 20px rgba(124,58,237,.4)', fontFamily: INTER }}>
          Download CV
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   SKILLS APP
════════════════════════════════════════ */
function SkillsApp() {
  const [cat, setCat] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
        {skills.map((s, i) => {
          const accent = CAT_ACCENTS[i] ?? '#00d4ff';
          const active = cat === i;
          return (
            <button key={s.key} onClick={() => setCat(i)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 20,
              fontFamily: INTER, fontSize: 13, fontWeight: 500,
              background: active ? accent : 'rgba(255,255,255,0.07)',
              color: active ? '#000' : 'rgba(255,255,255,0.55)',
              border: `1px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer', transition: 'all .2s',
            }}>{s.label}</button>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 16px 40px', overflowY: 'auto', flex: 1, alignContent: 'flex-start' }}>
        {skills[cat]?.items.map((item, i) => {
          const accent = CAT_ACCENTS[cat] ?? '#00d4ff';
          return (
            <span key={item} style={{
              padding: '9px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${hexToRgba(accent, 0.2)}`,
              fontFamily: INTER, fontSize: 13, fontWeight: 500, color: '#f0f4ff',
              animation: `mob-chipin 0.25s ease ${i * 30}ms both`,
            }}>{item}</span>
          );
        })}
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

  const submit = () => {
    const empty = Object.entries(form).filter(([, v]) => !v.trim()).map(([k]) => k);
    if (empty.length) { setErrs(new Set(empty)); setTimeout(() => setErrs(new Set()), 400); return; }
    setSent(true); setForm({ name: '', email: '', msg: '' });
    setTimeout(() => setSent(false), 2000);
  };

  const iStyle = (k: string): React.CSSProperties => ({
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${errs.has(k) ? 'rgba(255,71,87,.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12, padding: '12px 14px', color: '#f0f4ff',
    fontFamily: INTER, fontSize: 14, outline: 'none',
    animation: errs.has(k) ? 'mob-shake 0.35s ease' : 'none',
  });

  const rows = [
    { label: 'Email',    value: personal.email,       href: `mailto:${personal.email}`,   color: '#00d4ff' },
    { label: 'GitHub',   value: 'github.com/izanrubio', href: personal.github,             color: '#a855f7' },
    { label: 'LinkedIn', value: 'linkedin.com/in/...',href: personal.linkedin,            color: '#0066ff' },
    { label: 'Phone',    value: '637 689 946',          href: `tel:${personal.contact.phone}`, color: '#00ff88' },
    { label: 'Location', value: personal.location,    href: null,                         color: '#ff9500' },
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ padding: '20px 20px 8px' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#f0f4ff', fontFamily: INTER }}>Let&apos;s talk.</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginTop: 6, fontFamily: INTER }}>Siempre abierto a nuevas oportunidades</div>
      </div>
      <div style={{ padding: '12px 16px' }}>
        {rows.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: hexToRgba(item.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'} rel="noopener"
                  style={{ fontSize: 13, color: '#f0f4ff', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap', fontFamily: INTER }}>{item.value}</a>
              ) : <div style={{ fontSize: 13, color: '#f0f4ff', fontWeight: 500, fontFamily: INTER }}>{item.value}</div>}
            </div>
            {item.href && <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 16 }}>›</span>}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input placeholder="Name"    value={form.name}  onChange={e => setForm(p => ({...p, name:  e.target.value}))} style={iStyle('name')} />
        <input placeholder="Email"   type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} style={iStyle('email')} />
        <textarea placeholder="Message" value={form.msg} onChange={e => setForm(p => ({...p, msg: e.target.value}))} rows={4} style={{ ...iStyle('msg'), resize: 'none' }} />
        <button onClick={submit} style={{
          height: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
          background: sent ? 'rgba(0,255,136,.2)' : 'linear-gradient(135deg,#00c97a,#00d4ff)',
          color: sent ? '#00ff88' : '#000', fontFamily: INTER, fontSize: 15, fontWeight: 700, transition: 'all .3s',
        }}>{sent ? '✓ Sent!' : 'Send Message →'}</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   TERMINAL APP
════════════════════════════════════════ */
type TLine = { id: number; html: string };
let _tid = 0;

function TerminalApp() {
  const [lines, setLines] = useState<TLine[]>([
    { id: _tid++, html: '<span style="color:#00d4ff;font-weight:600;">IzanOS Terminal v2.0.4</span>' },
    { id: _tid++, html: '<span style="color:rgba(255,255,255,.4);">Type \'help\' for available commands.</span>' },
    { id: _tid++, html: '<span style="color:rgba(255,255,255,.15);">────────────────────────────────</span>' },
  ]);
  const [inp, setInp]   = useState('');
  const histRef         = useRef<string[]>([]);
  const histIdxRef      = useRef(0);
  const outRef          = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);

  const push = (html: string) => setLines(prev => [...prev, { id: _tid++, html }]);

  useEffect(() => { outRef.current?.scrollTo(0, outRef.current.scrollHeight); }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().replace(/\s+/g, ' ').toLowerCase();
    push(`<span style="color:#00ff88;">┌──(izanos㉿IzanOS)-[~]</span>`);
    push(`<span style="color:#00ff88;">└─$</span> <span style="color:#f0f4ff;">${raw.replace(/</g,'&lt;')}</span>`);
    if (!cmd) return;
    histRef.current.push(raw); histIdxRef.current = histRef.current.length;

    switch (cmd) {
      case 'help':
        push('<span style="color:#00d4ff;">Available commands:</span>');
        [['whoami','who is Izan'],['ls projects','list projects'],['cat &lt;slug&gt;','read project'],['skills','tech stack'],['ping izan','contact info'],['sudo hire-me','the important one'],['clear','clear terminal']].forEach(([c,d]) =>
          push(`<span style="color:#00ff88;display:inline-block;min-width:14ch;">${c}</span><span style="color:rgba(255,255,255,.4);">— ${d}</span>`)
        ); break;
      case 'whoami':
        push(`<span style="color:#f0f4ff;font-weight:600;">${personal.name}</span>`);
        push(`<span style="color:#c8d0c8;">${personal.role}</span>`);
        push(`<span style="color:#c8d0c8;">${personal.location} · <span style="color:#00ff88;">Available for hire</span></span>`);
        break;
      case 'ls projects':
        push(`<span style="color:rgba(255,255,255,.3);">total ${projects.length}</span>`);
        projects.forEach(p => {
          const stack = ((p as {terminalStack?: string[]}).terminalStack ?? p.stack.slice(0, 2)).join(' · ');
          push(`<span style="color:#7c3aed;">drwxr-xr-x</span> <span style="color:rgba(255,255,255,.5);">izan</span> <span style="color:#f0f4ff;display:inline-block;min-width:14ch;">${p.name}</span><span style="color:rgba(255,255,255,.4);">→ ${stack}</span>${p.status === 'in-development' ? ' <span style="color:#ff9500;">[DEV]</span>' : ''}`);
        }); break;
      case 'skills':
        skills.forEach(s => push(`<span style="color:#00d4ff;font-weight:600;display:inline-block;min-width:12ch;">${s.label.toUpperCase()}</span><span style="color:#c8d0c8;">${s.items.slice(0, 4).join(' · ')}</span>`));
        break;
      case 'ping izan':
        push('<span style="color:#c8d0c8;">PING izan: 3 packets, 0% loss</span>');
        push('<span style="color:#00d4ff;">Status: online · usually replies &lt; 24h</span>');
        break;
      case 'sudo hire-me':
        push('<span style="color:rgba(255,255,255,.4);">[sudo] password: ••••••••</span>');
        push('<span style="color:#00ff88;">✓ Authentication successful.</span>');
        push('<span style="color:#00ff88;font-weight:700;">Great choice. 🚀</span>');
        push(`<span style="color:#c8d0c8;">Email: <span style="color:#00d4ff;">${personal.email}</span></span>`);
        break;
      case 'clear': setLines([]); break;
      case 'nmap localhost':
        push('<span style="color:#ff4757;font-weight:700;">WARNING: Intrusion attempt logged.</span>');
        push('<span style="color:#ff4757;">Access denied. I see you. 👀</span>');
        break;
      case 'theme --switch':
        push('<span style="color:#00d4ff;">Theme toggled. Restart for full effect.</span>');
        break;
      default:
        if (cmd.startsWith('cat ')) {
          const slug = cmd.slice(4).trim();
          const p = projects.find(x => x.slug === slug);
          if (p) {
            push(`<span style="color:#00d4ff;">${p.name}</span> — ${p.category}`);
            push(`<span style="color:#c8d0c8;">Stack: ${p.stack.join(' · ')}</span>`);
            push(`<span style="color:rgba(255,255,255,.6);">${p.description}</span>`);
          } else push(`<span style="color:#ff4757;">cat: ${raw.slice(4).trim()}: No such file</span>`);
          break;
        }
        push(`<span style="color:#ff4757;">zsh: command not found: ${raw.replace(/</g,'&lt;')}</span>`);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(inp); setInp(''); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); histIdxRef.current = Math.max(0, histIdxRef.current - 1); setInp(histRef.current[histIdxRef.current] ?? ''); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); histIdxRef.current = Math.min(histRef.current.length, histIdxRef.current + 1); setInp(histRef.current[histIdxRef.current] ?? ''); }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0d0a', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg,rgba(0,255,136,.012) 0 1px,transparent 1px 3px)', zIndex: 1 }} />
      <div ref={outRef} onClick={() => inputRef.current?.focus()}
        style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', fontFamily: MONO, fontSize: 12, lineHeight: 1.7, position: 'relative', zIndex: 2, scrollbarWidth: 'none' }}>
        {lines.map(l => <div key={l.id} dangerouslySetInnerHTML={{ __html: l.html }} style={{ wordBreak: 'break-all', marginBottom: 1 }} />)}
      </div>
      <div style={{ flexShrink: 0, borderTop: '1px solid rgba(0,255,136,.08)', padding: '10px 14px 14px', background: '#0a0d0a', position: 'relative', zIndex: 2 }}>
        <div style={{ color: '#00ff88', fontFamily: MONO, fontSize: 12 }}>┌──(izanos㉿IzanOS)-[~]</div>
        <div style={{ display: 'flex', alignItems: 'center', color: '#00ff88', fontFamily: MONO, fontSize: 12 }}>
          <span>└─$</span>
          <input ref={inputRef} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={onKey}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f0f4ff', fontFamily: MONO, fontSize: 12, marginLeft: 8, caretColor: '#00ff88' }}
            autoComplete="off" autoCapitalize="off" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   FILES APP
════════════════════════════════════════ */
function FilesApp() {
  const [pathStack, setPathStack] = useState<string[]>([]);

  const getNode = (path: string[]): FileNode => {
    let node: FileNode = filesystem;
    for (const name of path) { const c = node.children?.find(x => x.name === name); if (c) node = c; }
    return node;
  };

  const current = getNode(pathStack);
  const items   = current.children ?? [];

  const FileIcon = ({ type }: { type: FileNode['type'] }) => {
    const C: Record<string, string> = { folder: '#00d4ff', pdf: '#ff4757', url: '#00ff88', png: '#a855f7', readme: '#ff9500', file: '#f0f4ff' };
    const c = C[type] ?? '#f0f4ff';
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" style={{ width: 32, height: 32 }}>
        {type === 'folder'  && <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={hexToRgba(c, 0.12)} />}
        {type === 'pdf'     && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={hexToRgba(c, 0.12)} /><polyline points="14 2 14 8 20 8" /></>}
        {type === 'url'     && <><circle cx="12" cy="12" r="9" fill={hexToRgba(c, 0.12)} /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" /></>}
        {type === 'png'     && <><rect x="3" y="3" width="18" height="18" rx="2" fill={hexToRgba(c, 0.12)} /><circle cx="8.5" cy="8.5" r="1.5" fill={c} /><polyline points="21 15 16 10 5 21" /></>}
        {type === 'readme'  && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill={hexToRgba(c, 0.12)} /><polyline points="14 2 14 8 20 8" /><path d="M8 13h8M8 17h6" /></>}
      </svg>
    );
  };

  const open = (node: FileNode) => {
    if (node.type === 'folder') { setPathStack(p => [...p, node.name]); return; }
    if (node.type === 'pdf')    { window.open(node.path ?? '/cv.pdf', '_blank'); return; }
    if (node.type === 'url')    { window.open(node.url, '_blank'); return; }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
      {pathStack.length > 0 && (
        <button onClick={() => setPathStack(p => p.slice(0, -1))}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 16px', background: 'none', border: 'none', color: '#00d4ff', fontFamily: INTER, fontSize: 15, cursor: 'pointer' }}>
          ‹ {pathStack[pathStack.length - 1] ?? 'Home'}
        </button>
      )}
      <div style={{ padding: '4px 16px 4px', fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.35)' }}>
        ~/{['Home', ...pathStack].join('/')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '8px 16px' }}>
        {items.map(node => (
          <div key={node.name} onClick={() => open(node)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '14px 8px', borderRadius: 14, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', cursor: 'pointer', transition: 'background .15s' }}>
            <FileIcon type={node.type} />
            <div style={{ fontFamily: INTER, fontSize: 11, color: '#f0f4ff', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.3 }}>
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const COLS = 8, ROWS = 4, BH = 14, GAP = 4;
    const BW = (W - GAP * (COLS + 1)) / COLS;
    const PW = 80, PR = 6;
    const COLORS = ['#ff4757','#ff9500','#00d4ff','#00ff88'];

    let bricks = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
    let paddle = { x: W / 2 - PW / 2 };
    let ball   = { x: W / 2, y: H - 90, dx: 3.5, dy: -4.5 };
    let score  = 0, lives = 3, running = true;

    const endScreen = (msg: string, color: string) => {
      ctx.fillStyle = 'rgba(0,0,0,.88)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = color; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
      ctx.fillText(msg, W / 2, H / 2);
      ctx.fillStyle = '#00d4ff'; ctx.font = '13px monospace';
      ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 24);
    };

    const draw = () => {
      ctx.fillStyle = '#0a0d0a'; ctx.fillRect(0, 0, W, H);
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (!bricks[r][c]) continue;
        ctx.fillStyle = COLORS[r]; ctx.shadowColor = COLORS[r]; ctx.shadowBlur = 4;
        ctx.fillRect(GAP + c * (BW + GAP), 50 + r * (BH + GAP), BW, BH); ctx.shadowBlur = 0;
      }
      ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 8;
      ctx.fillRect(paddle.x, H - 30, PW, 10); ctx.shadowBlur = 0;
      ctx.fillStyle = '#00ff88'; ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, PR, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '11px monospace';
      ctx.textAlign = 'left';  ctx.fillText(`${score} pts`, 10, H - 8);
      ctx.textAlign = 'right'; ctx.fillText(`♥ ${lives}`, W - 10, H - 8);
    };

    const update = () => {
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.x < PR || ball.x > W - PR) ball.dx *= -1;
      if (ball.y < PR) ball.dy *= -1;
      if (ball.y > H - 34 && ball.y < H - 20 && ball.x > paddle.x - PR && ball.x < paddle.x + PW + PR) {
        ball.dy = -Math.abs(ball.dy);
        ball.dx = ((ball.x - (paddle.x + PW / 2)) / (PW / 2)) * 5;
      }
      if (ball.y > H) {
        lives--; ball.x = W / 2; ball.y = H - 90; ball.dx = 3.5; ball.dy = -4.5;
        if (lives <= 0) { running = false; endScreen('GAME OVER', '#ff4757'); return; }
      }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (!bricks[r][c]) continue;
        const bx = GAP + c * (BW + GAP), by = 50 + r * (BH + GAP);
        if (ball.x > bx - PR && ball.x < bx + BW + PR && ball.y > by - PR && ball.y < by + BH + PR) {
          bricks[r][c] = false; ball.dy *= -1; score += 10;
        }
      }
      if (bricks.every(row => row.every(b => !b))) { running = false; endScreen('FIREWALL BREACHED', '#00ff88'); }
    };

    const loop = () => { if (!running) return; update(); draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);

    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = Math.min(Math.max(0, (e.touches[0].clientX - rect.left) * (W / rect.width) - PW / 2), W - PW);
    };
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = Math.min(Math.max(0, (e.clientX - rect.left) * (W / rect.width) - PW / 2), W - PW);
    };
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('mousemove', onMouse);
    return () => { cancelAnimationFrame(rafRef.current); canvas.removeEventListener('touchmove', onTouch); canvas.removeEventListener('mousemove', onMouse); };
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0d0a', alignItems: 'center', justifyContent: 'center', padding: '16px 16px 32px', gap: 12 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(0,255,136,.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Firewall Breaker — Level 1</div>
      <canvas ref={canvasRef} width={330} height={400} style={{ borderRadius: 8, border: '1px solid rgba(0,255,136,.15)', maxWidth: '100%', touchAction: 'none', cursor: 'none' }} />
      <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>Move finger / mouse to control paddle</div>
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
  { id: 'terminal', label: 'Terminal' }, { id: 'game',     label: 'Game'     },
];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function MobilePortfolio() {
  const { notifs } = useNotifications();

  const [appState,  setAppState]  = useState<'booting' | 'locked' | 'home'>('booting');
  const [bootMsgs,  setBootMsgs]  = useState<string[]>([]);
  const [bootProg,  setBootProg]  = useState(0);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [appOrigin, setAppOrigin] = useState('center center');
  const [island,    setIsland]    = useState<{ title: string; msg: string } | null>(null);
  const [clock,     setClock]     = useState({ time: '9:41', date: 'Thursday, 29 May' });
  const [scale,     setScale]     = useState(1);

  const screenRef        = useRef<HTMLDivElement>(null);
  const islandTimerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevNotifsLen    = useRef(0);
  const touchStartY      = useRef<number | null>(null);

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

  /* Scale */
  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 24) / 390, (window.innerHeight - 24) / 844, 1));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  /* Connect NotificationSystem → Dynamic Island */
  useEffect(() => {
    if (notifs.length > prevNotifsLen.current && notifs[0]) {
      const n = notifs[0];
      showIsland(n.title, n.body);
    }
    prevNotifsLen.current = notifs.length;
  }, [notifs]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Cleanup island timer */
  useEffect(() => () => clearTimeout(islandTimerRef.current), []);

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

    TIMINGS.forEach((t, i) => {
      timers.push(setTimeout(() => setBootMsgs(prev => [...prev, MSGS[i]]), t));
    });

    const start = performance.now();
    const TOTAL = 4000;
    let raf: number;
    const animate = (now: number) => {
      const p = Math.min(1, (now - start) / TOTAL);
      const eased = Math.sin(p * Math.PI * 0.5) * 0.6 + p * 0.4;
      setBootProg(Math.min(99, eased * 100));
      if (p < 1) raf = requestAnimationFrame(animate);
      else setBootProg(100);
    };
    raf = requestAnimationFrame(animate);

    timers.push(setTimeout(() => {
      setAppState('locked');
    }, 4600));

    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showIsland = (title: string, msg: string) => {
    setIsland({ title, msg });
    clearTimeout(islandTimerRef.current);
    islandTimerRef.current = setTimeout(() => setIsland(null), 3000);
  };

  const unlock = () => {
    setAppState('home');
    setTimeout(() => showIsland('Welcome to IzanOS', 'Tap any app to explore'), 700);
  };

  const openApp = (app: AppId, e: React.MouseEvent) => {
    const icon = (e.currentTarget as HTMLElement).querySelector('.mob-icon') as HTMLElement | null;
    if (icon && screenRef.current) {
      const r = icon.getBoundingClientRect();
      const s = screenRef.current.getBoundingClientRect();
      setAppOrigin(`${((r.left + r.width / 2 - s.left) / s.width * 100).toFixed(1)}% ${((r.top + r.height / 2 - s.top) / s.height * 100).toFixed(1)}%`);
    }
    setActiveApp(app);
    showIsland(APP_TITLES[app], 'Opened');
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
  };

  return (
    <>
      <style>{`
        .mob-page{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden;}
        .mob-aurora{position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at 50% 50%,#0a0a0a,#000);}
        .mob-blob{position:absolute;border-radius:50%;filter:blur(120px);mix-blend-mode:screen;pointer-events:none;}
        .mob-b1{width:60vw;height:60vw;top:-20vw;left:-15vw;background:radial-gradient(circle,rgba(0,255,102,.28),transparent 65%);animation:mob-drift1 28s ease-in-out infinite;}
        .mob-b2{width:65vw;height:65vw;bottom:-25vw;right:-20vw;background:radial-gradient(circle,rgba(0,102,255,.26),transparent 65%);animation:mob-drift2 34s ease-in-out infinite;}
        .mob-b3{width:45vw;height:45vw;top:30%;left:30%;background:radial-gradient(circle,rgba(0,255,255,.15),transparent 65%);animation:mob-pulse3 18s ease-in-out infinite;}
        @keyframes mob-drift1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(15vw,8vh) scale(1.15);}66%{transform:translate(-5vw,12vh) scale(.95);}}
        @keyframes mob-drift2{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-20vw,-12vh) scale(1.2);}}
        @keyframes mob-pulse3{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.35);}}
        @keyframes mob-dotpulse{50%{opacity:.35;}}
        @keyframes mob-blink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mob-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
        @keyframes mob-chipin{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
        @keyframes mob-floatup{0%,100%{transform:translateY(0);opacity:.5;}50%{transform:translateY(-6px);opacity:.9;}}
        .mob-stage{position:relative;z-index:10;transform-origin:center;}
        .mob-phone{position:relative;width:390px;height:844px;border-radius:56px;background:linear-gradient(145deg,#2a2a2c 0%,#1a1a1a 40%,#0e0e0e 100%);padding:11px;box-shadow:0 40px 80px rgba(0,0,0,.6),0 0 0 2px rgba(255,255,255,.05),inset 0 0 2px rgba(255,255,255,.2);}
        .mob-phone::before{content:'';position:absolute;inset:2px;border-radius:54px;background:linear-gradient(115deg,rgba(255,255,255,.12),transparent 18%,transparent 82%,rgba(255,255,255,.08));pointer-events:none;z-index:5;}
        .mob-btn{position:absolute;background:linear-gradient(90deg,#2a2a2c,#111);border-radius:3px;}
        .mob-screen{position:relative;width:100%;height:100%;border-radius:46px;overflow:hidden;background:#000;}
        .mob-wallpaper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#0b1020,#05060c);overflow:hidden;}
        .mob-wb{position:absolute;border-radius:50%;filter:blur(60px);mix-blend-mode:screen;}
        .mob-wb1{width:280px;height:280px;top:-60px;left:-60px;background:radial-gradient(circle,rgba(0,255,136,.3),transparent 65%);animation:mob-drift1 24s ease-in-out infinite;}
        .mob-wb2{width:300px;height:300px;bottom:-80px;right:-70px;background:radial-gradient(circle,rgba(0,102,255,.3),transparent 65%);animation:mob-drift2 30s ease-in-out infinite;}
        .mob-wb3{width:200px;height:200px;top:40%;left:30%;background:radial-gradient(circle,rgba(124,58,237,.22),transparent 65%);animation:mob-pulse3 20s ease-in-out infinite;}
        .mob-statusbar{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:18px 30px 0;z-index:40;pointer-events:none;}
        .mob-island{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:122px;height:36px;background:#000;border-radius:20px;z-index:60;overflow:hidden;transition:width .4s cubic-bezier(.2,.9,.3,1.2),height .4s cubic-bezier(.2,.9,.3,1.2),border-radius .4s;display:flex;align-items:center;cursor:pointer;}
        .mob-island.exp{width:310px;height:68px;border-radius:32px;}
        .mob-island-c{display:flex;align-items:center;gap:10px;width:100%;padding:0 12px;opacity:0;transition:opacity .2s ease .15s;}
        .mob-island.exp .mob-island-c{opacity:1;}
        .mob-lock{position:absolute;inset:0;z-index:50;backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;transition:transform .5s cubic-bezier(.4,0,.2,1),opacity .4s ease;}
        .mob-lock.off{transform:translateY(-100%);opacity:0;pointer-events:none;}
        .mob-home{position:absolute;inset:0;z-index:30;padding:64px 20px 0;display:flex;flex-direction:column;transition:opacity .3s;}
        .mob-home.dim{opacity:.3;}
        .mob-app-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px 12px;margin-top:8px;}
        .mob-app{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;}
        .mob-icon{width:60px;height:60px;border-radius:15px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 14px -4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.2);transition:transform .15s ease;flex-shrink:0;}
        .mob-app:active .mob-icon{transform:scale(.88);}
        .mob-app-name{font-size:11px;font-weight:500;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);}
        .mob-dock{margin-top:auto;margin-bottom:28px;display:flex;justify-content:center;gap:18px;padding:14px 18px;border-radius:30px;background:rgba(255,255,255,.1);backdrop-filter:blur(30px) saturate(180%);-webkit-backdrop-filter:blur(30px) saturate(180%);border:1px solid rgba(255,255,255,.12);}
        .mob-dock .mob-icon{width:56px;height:56px;}
        .mob-appview{position:absolute;inset:0;z-index:45;background:#06070d;display:flex;flex-direction:column;opacity:0;transform:scale(.4);transform-origin:var(--origin,center);pointer-events:none;transition:opacity .35s cubic-bezier(.4,0,.2,1),transform .35s cubic-bezier(.4,0,.2,1);}
        .mob-appview.open{opacity:1;transform:scale(1);pointer-events:auto;}
        .mob-appnav{flex-shrink:0;height:92px;padding:50px 20px 0;display:flex;align-items:center;gap:8px;background:rgba(8,10,18,.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06);position:relative;z-index:2;}
        .mob-back{display:inline-flex;align-items:center;gap:3px;color:#00d4ff;font-size:16px;font-weight:500;cursor:pointer;background:none;border:none;padding:0;}
        .mob-nav-title{position:absolute;left:50%;transform:translateX(-50%);font-family:var(--font-jetbrains),monospace;font-size:13px;color:rgba(255,255,255,.7);white-space:nowrap;}
        .mob-appscroll{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;}
        .mob-appscroll::-webkit-scrollbar{width:0;}
        .mob-home-ind{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:rgba(255,255,255,.3);z-index:70;cursor:pointer;}
      `}</style>

      <div className="mob-page">
        <div className="mob-aurora">
          <div className="mob-blob mob-b1" /><div className="mob-blob mob-b2" /><div className="mob-blob mob-b3" />
        </div>

        <div className="mob-stage" style={{ transform: `scale(${scale})` }}>
          <div className="mob-phone">
            <div className="mob-btn" style={{ left: -3, top: 130, width: 4, height: 28 }} />
            <div className="mob-btn" style={{ left: -3, top: 180, width: 4, height: 50 }} />
            <div className="mob-btn" style={{ left: -3, top: 244, width: 4, height: 50 }} />
            <div className="mob-btn" style={{ right: -3, top: 200, width: 4, height: 78 }} />

            <div className="mob-screen" ref={screenRef}>
              {/* Wallpaper */}
              <div className="mob-wallpaper">
                <div className="mob-wb mob-wb1" /><div className="mob-wb mob-wb2" /><div className="mob-wb mob-wb3" />
              </div>

              {/* Status bar */}
              <div className="mob-statusbar">
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', fontFamily: INTER }}>{clock.time}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="#fff"><path d="M8.5 2.5a10 10 0 0 1 7 2.8l-1.4 1.5a8 8 0 0 0-11.2 0L1.5 5.3a10 10 0 0 1 7-2.8z" opacity=".95"/><path d="M8.5 6.5a5 5 0 0 1 3.5 1.4L8.5 11.5 5 7.9a5 5 0 0 1 3.5-1.4z"/></svg>
                  <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1.5" width="21" height="10" rx="3" stroke="#fff" strokeOpacity=".5" strokeWidth="1"/><rect x="2.5" y="3" width="16" height="7" rx="1.5" fill="#fff"/><rect x="23.5" y="4.5" width="1.6" height="4" rx="1" fill="#fff" fillOpacity=".5"/></svg>
                </div>
              </div>

              {/* Dynamic Island */}
              <div className={`mob-island${island ? ' exp' : ''}`} onClick={() => setIsland(null)}>
                <div className="mob-island-c">
                  {island && (
                    <>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(0,212,255,.15)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: INTER }}>{island.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: INTER }}>{island.msg}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Boot screen */}
              <AnimatePresence>
                {appState === 'booting' && (
                  <motion.div
                    key="mob-boot"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, backgroundColor: '#ffffff' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                    >
                      <motion.img
                        src="/icons/logo.svg"
                        alt="IzanOS"
                        width={60}
                        height={60}
                        animate={{ filter: ['drop-shadow(0 0 6px rgba(0,212,255,0.3))', 'drop-shadow(0 0 16px rgba(0,212,255,0.8))', 'drop-shadow(0 0 6px rgba(0,212,255,0.3))'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 20, letterSpacing: '0.3em', color: '#f0f4ff', marginTop: 2 }}>IzanOS</div>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: '#00d4ff' }}>Aurora 0.3</div>
                    </motion.div>

                    {/* Progress bar */}
                    <div style={{ width: 200, height: 2, background: '#1a1a2e', borderRadius: 1, marginTop: 32, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(to right, #00d4ff, #7c3aed)', borderRadius: 1, width: `${bootProg}%`, transition: 'width 0.1s linear' }} />
                    </div>

                    {/* System messages */}
                    <div style={{ position: 'absolute', bottom: 32, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {bootMsgs.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ fontFamily: MONO, fontSize: 10, color: '#4a5568' }}
                        >{msg}</motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lock screen */}
              <div
                className={`mob-lock${appState === 'home' ? ' off' : ''}`}
                style={appState === 'booting' ? { opacity: 0, pointerEvents: 'none' } : {}}
                onClick={appState === 'locked' ? unlock : undefined}
                onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
                onTouchMove={e => { if (touchStartY.current !== null && touchStartY.current - e.touches[0].clientY > 40) { unlock(); touchStartY.current = null; } }}>
                <div style={{ marginTop: 130, fontSize: 80, fontWeight: 300, color: '#fff', letterSpacing: -3, lineHeight: 1, fontFamily: INTER, textShadow: '0 4px 40px rgba(255,255,255,.15)' }}>{clock.time}</div>
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
                      <div className="mob-app-name">{a.label}</div>
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
              <div className={`mob-appview${activeApp ? ' open' : ''}`} style={{ '--origin': appOrigin } as React.CSSProperties}>
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
          </div>
        </div>
      </div>
    </>
  );
}

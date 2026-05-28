'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { personal, projects, skills, notifications } from '@/data/content';
import { useNotifications } from '@/components/NotificationSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/data/translations';

const MONO   = 'var(--font-jetbrains), monospace';
const GREEN  = '#00ff88';
const CYAN   = '#00d4ff';
const RED    = '#ff4757';
const PURPLE = '#7c3aed';
const ORANGE = '#ff9500';
const TXT    = '#c8d0c8';
const DIM    = 'rgba(255,255,255,0.5)';
const DIM2   = 'rgba(255,255,255,0.3)';
const WHITE  = '#f0f4ff';

/* ── Color span helpers ── */
const sg  = (s: string) => <span style={{ color: GREEN }}>{s}</span>;
const sc  = (s: string) => <span style={{ color: CYAN }}>{s}</span>;
const sr  = (s: string) => <span style={{ color: RED }}>{s}</span>;
const sp  = (s: string) => <span style={{ color: PURPLE }}>{s}</span>;
const sw  = (s: string) => <span style={{ color: WHITE }}>{s}</span>;
const sd  = (s: string) => <span style={{ color: DIM }}>{s}</span>;
const sd2 = (s: string) => <span style={{ color: DIM2 }}>{s}</span>;
const stx = (s: string) => <span style={{ color: TXT }}>{s}</span>;

/* ── Line type ── */
let _id = 0;
type Line = { id: number; node: React.ReactNode };
const ln = (node: React.ReactNode): Line => ({ id: _id++, node });

/* ── Prompt echo (for history) ── */
function PromptEcho({ cmd }: { cmd: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div>
        <span style={{ color: GREEN }}>┌──(</span>
        <span style={{ color: GREEN }}>izanos</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>㉿</span>
        <span style={{ color: GREEN }}>IzanOS</span>
        <span style={{ color: GREEN }}>)-[</span>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>~</span>
        <span style={{ color: GREEN }}>]</span>
      </div>
      <div>
        <span style={{ color: GREEN }}>└─</span>
        <span style={{ color: GREEN }}>$</span>
        {' '}
        <span style={{ color: WHITE }}>{cmd}</span>
      </div>
    </div>
  );
}

/* ══════════ Command output builders ══════════ */

function helpLines(): Line[] {
  const rows: [string, string][] = [
    ['whoami',         'who is Izan'],
    ['ls projects',    'list portfolio projects'],
    ['cat <slug>',     'read project details'],
    ['skills',         'technical skill matrix'],
    ['ping izan',      'check availability'],
    ['sudo hire-me',   'the important one'],
    ['theme --switch', 'toggle dark/light mode'],
    ['nmap localhost', 'scan this machine'],
    ['exploit',        'run the payload'],
    ['sudo rm -rf /',  'dangerous command'],
    ['clear',          'clear the screen'],
  ];
  return [
    ln(<div>{sc('Available commands')}</div>),
    ...rows.map(([cmd, desc]) =>
      ln(
        <div>
          <span style={{ color: GREEN, display: 'inline-block', minWidth: '17ch' }}>{cmd}</span>
          {sd('— ' + desc)}
        </div>
      )
    ),
  ];
}

function whoamiLines(): Line[] {
  return [
    ln(<div><span style={{ color: WHITE, fontWeight: 700 }}>Izan Rubio Cerezo</span></div>),
    ln(<div>{stx(personal.role)}</div>),
    ln(<div>
      {stx(personal.location + ' · Available for hire')}
      <span style={{
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
        background: GREEN, boxShadow: `0 0 6px ${GREEN}`,
        marginLeft: 5, verticalAlign: 1,
        animation: 'term-dot 1.6s ease-in-out infinite',
      }} />
    </div>),
  ];
}

function lsProjectsLines(): Line[] {
  return [
    ln(<div>{sd2(`total ${projects.length}`)}</div>),
    ...projects.map(proj => {
      const stack = (proj.terminalStack ?? proj.stack.slice(0, 3)).join(' · ');
      const wip = proj.status === 'in-development';
      return ln(
        <div>
          {sp('drwxr-xr-x')}&nbsp;{sd('izan')}&nbsp;
          <span style={{ color: WHITE, display: 'inline-block', minWidth: '14ch' }}>{proj.name}</span>
          {sd('→ ' + stack)}
          {wip && <> <span style={{ color: ORANGE, fontWeight: 600 }}>[EN DESARROLLO]</span></>}
        </div>
      );
    }),
  ];
}

function skillsLines(): Line[] {
  return skills.map(cat =>
    ln(
      <div>
        <span style={{ color: CYAN, fontWeight: 700, display: 'inline-block', minWidth: '12ch' }}>
          {cat.label.toUpperCase()}
        </span>
        {stx(cat.items.join(' · '))}
      </div>
    )
  );
}

function pingLines(): Line[] {
  return [
    ln(<div>{stx('PING izan (Terrassa, ES): 56 data bytes')}</div>),
    ln(<div>{stx('64 bytes from izan: icmp_seq=0 ttl=64 time=0.4 ms')}</div>),
    ln(<div>{stx('64 bytes from izan: icmp_seq=1 ttl=64 time=0.3 ms')}</div>),
    ln(<div>{stx('64 bytes from izan: icmp_seq=2 ttl=64 time=0.3 ms')}</div>),
    ln(<div>&nbsp;</div>),
    ln(<div>{sg('--- izan ping statistics ---')}</div>),
    ln(<div>{stx('3 packets transmitted, 3 received, ')}{sg('0% packet loss')}</div>),
    ln(<div>{sc('Status: online & responsive · usually replies < 24h')}</div>),
  ];
}

function hireMeLines(): Line[] {
  return [
    ln(<div>{sd('[sudo] password for visitor: ')}{sd2('••••••••')}</div>),
    ln(<div>{sg('✓ Authentication successful.')}</div>),
    ln(<div>&nbsp;</div>),
    ln(<div><span style={{ color: CYAN, fontWeight: 700 }}>Elevating visitor → employer...</span></div>),
    ln(<div>{stx('→ Reviewing portfolio........ ')}{sg('[OK]')}</div>),
    ln(<div>{stx('→ Checking skill matrix...... ')}{sg('[OK]')}</div>),
    ln(<div>{stx('→ Verifying availability..... ')}{sg('[OK]')}</div>),
    ln(<div>&nbsp;</div>),
    ln(<div><span style={{ color: GREEN, fontWeight: 700 }}>Great choice. 🚀</span></div>),
    ln(<div>{stx('Reach out: ')}{sc(personal.contact.email)}</div>),
    ln(<div>
      {stx('Download CV: ')}
      <a href="/cv.pdf" download style={{ color: CYAN, textDecoration: 'none' }}>/cv.pdf</a>
    </div>),
  ];
}

function nmapLines(): Line[] {
  return [
    ln(<div>{stx('Starting Nmap scan...')}</div>),
    ln(<div><span style={{ color: RED, fontWeight: 700 }}>WARNING: Intrusion attempt logged.</span></div>),
    ln(<div>{sr('Access denied. I see you, visitor.')}</div>),
    ln(<div>{sw('Nice try. 👀')}</div>),
  ];
}

function exploitLines(): Line[] {
  return [
    ln(<div>{stx('[*] Loading exploit module ')}{sp('izanos/portfolio/charm')}</div>),
    ln(<div>{stx('[*] Configuring payload............ ')}{sg('done')}</div>),
    ln(<div>{stx('[*] Launching at target ')}{sc('visitor@browser')}</div>),
    ln(<div>&nbsp;</div>),
    ln(<div><span style={{ color: GREEN, fontWeight: 700 }}>[+] Exploit successful!</span></div>),
    ln(<div>{stx('You are now thoroughly impressed. Payload delivered. 😎')}</div>),
  ];
}

function catLines(slug: string): Line[] | null {
  const proj = projects.find(x => x.slug === slug);
  if (!proj) return null;
  return [
    ln(<div>{sc(proj.name)}{stx(` — ${proj.category}`)}</div>),
    ln(<div>{sd('─'.repeat(38))}</div>),
    ln(<div>{stx(`Stack   ${proj.stack.join(' · ')}`)}</div>),
    ...(proj.demo ? [ln(<div>{stx(`Demo    ${proj.demo}`)}</div>)] : []),
    ...(proj.repo ? [ln(<div>{stx(`Repo    ${proj.repo}`)}</div>)] : []),
    ln(<div>&nbsp;</div>),
    ln(<div style={{ color: TXT, maxWidth: '60ch' }}>{proj.description}</div>),
  ];
}

function themeLines(toDark: boolean): Line[] {
  return toDark
    ? [
        ln(<div>{stx('→ Engaging Aurora Dark mode...')}</div>),
        ln(<div>{stx('→ Aurora blobs: green · blue · cyan')}</div>),
        ln(<div>{stx('→ Window chrome: dark glass')}</div>),
        ln(<div>{stx('→ System: aurora re-calibrated')}</div>),
      ]
    : [
        ln(<div>{stx('→ Engaging Aurora Light mode...')}</div>),
        ln(<div>{stx('→ Aurora blobs re-tinted: mint · lavender · sky')}</div>),
        ln(<div>{stx('→ Window chrome: light glass')}</div>),
        ln(<div>{stx('→ Terminal: staying dark, as tradition demands')}</div>),
      ];
}

/* ══════════ Main component ══════════ */

export default function TerminalWindow() {
  const { notify } = useNotifications();
  const { lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [locked, setLocked] = useState(true);

  const inputRef    = useRef<HTMLInputElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const histRef     = useRef<string[]>([]);
  const histIdxRef  = useRef<number>(0);
  const timersRef   = useRef<ReturnType<typeof setTimeout>[]>([]);

  const push = (newLines: Line[]) =>
    setLines(prev => [...prev, ...newLines]);

  /* Auto-scroll on new output */
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  /* Cancel all pending timers on unmount */
  useEffect(() => {
    return () => { timersRef.current.forEach(clearTimeout); };
  }, []);

  /* Welcome typewriter sequence */
  useEffect(() => {
    const schedule = (delay: number, newLines: Line[]) => {
      const id = setTimeout(() => push(newLines), delay);
      timersRef.current.push(id);
    };
    schedule(0, [ln(
      <div><span style={{ color: CYAN, fontWeight: 700 }}>IzanOS Terminal v2.0.4</span></div>
    )]);
    schedule(350, [ln(
      <div>{sd("Type 'help' for available commands.")}</div>
    )]);
    schedule(600, [ln(
      <div style={{ color: 'rgba(255,255,255,0.1)' }}>{'─'.repeat(44)}</div>
    )]);
    const unlockId = setTimeout(() => {
      setLocked(false);
      inputRef.current?.focus();
    }, 750);
    timersRef.current.push(unlockId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* sudo rm -rf / easter egg — async deletion sequence */
  const runRmRf = () => {
    setLocked(true);
    const deletionMsgs = [
      'Removing /usr/bin...',
      'Removing /etc/passwd...',
      'Removing /home/izan...',
      'Removing portfolio...',
    ];
    deletionMsgs.forEach((msg, i) => {
      const id = setTimeout(() => {
        setLines(prev => [...prev, ln(<div>{sr(msg)}</div>)]);
      }, (i + 1) * 400);
      timersRef.current.push(id);
    });
    const finalId = setTimeout(() => {
      setLines(prev => [
        ...prev,
        ln(<div>&nbsp;</div>),
        ln(<div style={{ color: WHITE }}>Just kidding. ;)</div>),
        ln(<div>{sg('IzanOS Aurora 0.3 — All systems operational.')}</div>),
      ]);
      setLocked(false);
      inputRef.current?.focus();
    }, deletionMsgs.length * 400 + 2000);
    timersRef.current.push(finalId);
  };

  /* Command dispatcher */
  const runCommand = (raw: string) => {
    const cmd = raw.trim().replace(/\s+/g, ' ').toLowerCase();
    push([ln(<PromptEcho cmd={raw} />)]);
    if (!cmd) return;

    if (raw.trim()) {
      histRef.current.push(raw);
      histIdxRef.current = histRef.current.length;
    }

    /* Trigger intrusion notification */
    if (cmd === 'nmap localhost' || cmd === 'exploit') {
      notify({
        type: notifications.intrusionDetected.type,
        app: notifications.intrusionDetected.app,
        title: t('notif.intrusionDetected.title', lang),
        body: t('notif.intrusionDetected.body', lang),
      });
    }

    switch (cmd) {
      case 'clear':
        setLines([]);
        return;
      case 'help':
        push(helpLines());
        return;
      case 'whoami':
        push(whoamiLines());
        return;
      case 'ls projects':
        push(lsProjectsLines());
        return;
      case 'skills':
        push(skillsLines());
        return;
      case 'ping izan':
        push(pingLines());
        return;
      case 'sudo hire-me':
        push(hireMeLines());
        return;
      case 'nmap localhost':
        push(nmapLines());
        return;
      case 'exploit':
        push(exploitLines());
        return;
      case 'sudo rm -rf /':
        push([ln(<div>{sd('[sudo] password for visitor: ')}{sd2('••••••••')}</div>)]);
        runRmRf();
        return;
      case 'theme --switch':
        toggleTheme();
        push(themeLines(theme === 'light'));
        return;
    }

    if (cmd.startsWith('cat ')) {
      const slug = cmd.slice(4).trim();
      const result = catLines(slug);
      if (result) { push(result); return; }
      push([ln(<div>{sr(`cat: ${cmd.slice(4).trim()}: No such file or directory`)}</div>)]);
      return;
    }

    push([
      ln(<div>{sr(`zsh: command not found: ${raw.trim()}`)}</div>),
      ln(<div>{sd('Type ')}{sg('help')}{sd(' for available commands.')}</div>),
    ]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (locked) { e.preventDefault(); return; }
    if (e.key === 'Enter') {
      const val = input;
      setInput('');
      runCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = histRef.current;
      if (!h.length) return;
      histIdxRef.current = Math.max(0, histIdxRef.current - 1);
      setInput(h[histIdxRef.current] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdxRef.current = Math.min(histRef.current.length, histIdxRef.current + 1);
      setInput(histRef.current[histIdxRef.current] ?? '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: '#0a0d0a',
        fontFamily: MONO,
        fontSize: '13px',
        lineHeight: 1.7,
        color: TXT,
        cursor: 'text',
        boxShadow: 'inset 0 0 0 1px rgba(0,255,136,0.10)',
        position: 'relative',
      }}
      onClick={() => { if (!locked) inputRef.current?.focus(); }}
    >
      {/* CRT scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'repeating-linear-gradient(0deg, rgba(0,255,136,0.015) 0 1px, transparent 1px 3px)',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'radial-gradient(ellipse 100% 80% at 50% 40%, transparent 55%, rgba(0,0,0,0.4) 100%)',
      }} />

      {/* ── Scroll area (output history) ── */}
      <div
        className="term-scroll"
        style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '18px 20px 8px',
          position: 'relative', zIndex: 3,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,255,136,0.2) transparent',
        }}
      >
        {lines.map(line => (
          <div key={line.id}>{line.node}</div>
        ))}
        <div ref={scrollEndRef} />
      </div>

      {/* ── Input area (fixed bottom) ── */}
      <div style={{
        flexShrink: 0,
        background: '#0a0d0a',
        borderTop: '1px solid rgba(0,255,136,0.08)',
        padding: '12px 20px 14px',
        position: 'relative', zIndex: 3,
        fontFamily: MONO, fontSize: '13px', lineHeight: 1.7,
      }}>
        {/* Prompt line 1 */}
        <div>
          <span style={{ color: GREEN }}>┌──(</span>
          <span style={{ color: GREEN }}>izanos</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>㉿</span>
          <span style={{ color: GREEN }}>IzanOS</span>
          <span style={{ color: GREEN }}>)-[</span>
          <span style={{ color: 'rgba(255,255,255,0.8)' }}>~</span>
          <span style={{ color: GREEN }}>]</span>
        </div>
        {/* Prompt line 2 + input + block cursor */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: GREEN }}>└─</span>
          <span style={{ color: GREEN, marginRight: 8 }}>$</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={locked}
              style={{
                flex: 1, minWidth: 0,
                background: 'transparent', border: 'none', outline: 'none',
                color: WHITE, fontFamily: MONO, fontSize: '13px',
                caretColor: 'transparent',
                padding: 0,
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {/* Block cursor █ */}
            <span style={{
              display: 'inline-block',
              width: 8, height: 15,
              background: GREEN,
              boxShadow: '0 0 8px rgba(0,255,136,0.5)',
              animation: 'term-blink 1s ease-in-out infinite',
              marginLeft: 1,
              flexShrink: 0,
              transform: 'translateY(2px)',
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes term-blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes term-dot { 50% { opacity: 0.35 } }
        .term-scroll::-webkit-scrollbar { width: 3px; }
        .term-scroll::-webkit-scrollbar-track { background: transparent; }
        .term-scroll::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.2); border-radius: 999px; }
        .term-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,255,136,0.5); }
      `}</style>
    </div>
  );
}

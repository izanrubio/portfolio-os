'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { terminal, notifications } from '@/data/content';
import { useNotifications } from '@/components/NotificationSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/data/translations';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error';
  content: string;
  path?: string;
  typing?: boolean;
}

let lineIdCounter = 0;

const MONO = 'var(--font-jetbrains), monospace';

/* Prompt component — Kali-style two lines */
function Prompt({ path = '~' }: { path?: string }) {
  return (
    <>
      <div>
        <span style={{ color: '#8892a4' }}>┌──(</span>
        <span style={{ color: '#00d4ff', fontWeight: 700 }}>izanos</span>
        <span style={{ color: '#00d4ff' }}>㉿</span>
        <span style={{ color: '#00d4ff', fontWeight: 700 }}>IzanOS</span>
        <span style={{ color: '#8892a4' }}>)-[</span>
        <span style={{ color: '#5b9eff' }}>{path}</span>
        <span style={{ color: '#8892a4' }}>]</span>
      </div>
      <div>
        <span style={{ color: '#8892a4' }}>└─</span>
        <span style={{ color: '#00d4ff', fontWeight: 700 }}>$</span>
        <span style={{ color: '#f0f4ff' }}>{' '}</span>
      </div>
    </>
  );
}

const INTRUSION_CMDS = new Set(['nmap localhost', 'exploit']);

export default function TerminalWindow() {
  const { notify }           = useNotifications();
  const { lang }             = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: lineIdCounter++, type: 'output', content: terminal.welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  const typeOutput = (text: string, type: 'output' | 'error' = 'output') => {
    const id = lineIdCounter++;
    setLines(prev => [...prev, { id, type, content: '', typing: true }]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLines(prev => prev.map(l => l.id === id ? { ...l, content: text.slice(0, i) } : l));
      if (i >= text.length) {
        clearInterval(interval);
        setLines(prev => prev.map(l => l.id === id ? { ...l, typing: false } : l));
      }
    }, 6);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setLines(prev => [...prev, { id: lineIdCounter++, type: 'input', content: raw }]);
    if (!cmd) return;
    setHistory(prev => [raw, ...prev]);
    setHistoryIdx(-1);

    if (INTRUSION_CMDS.has(cmd)) notify({ type: notifications.intrusionDetected.type, app: notifications.intrusionDetected.app, title: t('notif.intrusionDetected.title', lang), body: t('notif.intrusionDetected.body', lang) });

    if (cmd === 'theme --switch') {
      const toLight = theme === 'dark';
      toggleTheme();
      typeOutput(toLight
        ? '→ Engaging Aurora Light mode...\n→ Aurora blobs re-tinted: mint · lavender · sky\n→ Window chrome: light glass\n→ Terminal: staying dark, as tradition demands'
        : '→ Engaging Aurora Dark mode...\n→ Aurora blobs: green · blue · cyan\n→ Window chrome: dark glass\n→ System: aurora re-calibrated');
      return;
    }

    if (cmd === 'clear') {
      setLines([{ id: lineIdCounter++, type: 'output', content: terminal.welcomeMessage }]);
      return;
    }

    const cmdResult = terminal.commands[cmd as keyof typeof terminal.commands];
    if (cmdResult) { typeOutput(cmdResult); return; }

    const eggResult = terminal.easterEggs[cmd as keyof typeof terminal.easterEggs];
    if (eggResult) { typeOutput(eggResult); return; }

    if (cmd.startsWith('cat ')) {
      const slug = cmd.slice(4).trim();
      const detail = terminal.projectDetails[slug];
      if (detail) { typeOutput(detail); return; }
      typeOutput(`cat: ${cmd.slice(4)}: No such file or directory`, 'error');
      return;
    }

    typeOutput(`bash: ${cmd}: command not found\nType 'help' for available commands.`, 'error');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = historyIdx + 1;
      if (idx < history.length) { setHistoryIdx(idx); setInput(history[idx]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = historyIdx - 1;
      if (idx < 0) { setHistoryIdx(-1); setInput(''); }
      else { setHistoryIdx(idx); setInput(history[idx]); }
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden cursor-text"
      style={{
        background: '#0d0f10',
        backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(0,255,136,.04), transparent 60%)',
        fontFamily: MONO,
        fontSize: '13px',
        lineHeight: 1.55,
        color: '#c8d2d6',
        position: 'relative',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanlines */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,255,136,.022) 0 1px, transparent 1px 3px)',
        }}
      />

      <div className="flex-1 overflow-y-auto" style={{ padding: '22px 24px', position: 'relative', zIndex: 1 }}>
        {lines.map(line => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.type === 'input' && (
              <div style={{ marginTop: '10px' }}>
                <Prompt path="~" />
                <span style={{ color: '#f0f4ff' }}>{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <div style={{ color: '#c8d2d6', marginTop: '4px' }}>
                {line.content}
                {line.typing && (
                  <span
                    style={{
                      display: 'inline-block', width: '9px', height: '16px',
                      background: '#00d4ff', verticalAlign: 'text-bottom',
                      marginLeft: '4px', boxShadow: '0 0 6px rgba(0,212,255,0.35)',
                      animation: 'term-blink 1.05s steps(1) infinite',
                    }}
                  />
                )}
              </div>
            )}
            {line.type === 'error' && (
              <div style={{ color: '#ff4757', marginTop: '4px' }}>{line.content}</div>
            )}
          </div>
        ))}

        {/* Active input prompt */}
        <div style={{ marginTop: '10px' }}>
          <Prompt path="~" />
          <span className="relative inline-flex" style={{ flex: 1 }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute', inset: 0, width: '100%',
                background: 'transparent', outline: 'none', border: 'none',
                color: '#f0f4ff', fontFamily: MONO, fontSize: '13px',
                caretColor: '#00d4ff',
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{input || ' '}</span>
          </span>
        </div>

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes term-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

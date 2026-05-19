'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { terminalCommands } from '@/data/content';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const PROMPT = 'izanos@portfolio:~$ ';

const WELCOME = `IzanOS Terminal v1.0.0
Type 'help' to see available commands.
──────────────────────────────────────`;

export default function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();

    setLines(prev => [...prev, { type: 'input', content: PROMPT + raw }]);

    if (!cmd) return;

    setHistory(prev => [raw, ...prev]);
    setHistoryIdx(-1);

    if (cmd === 'clear') {
      setLines([{ type: 'output', content: WELCOME }]);
      return;
    }

    const result = terminalCommands[cmd];
    if (result !== undefined) {
      const output = typeof result === 'function' ? result([]) : result;
      setLines(prev => [...prev, { type: 'output', content: output }]);
    } else {
      setLines(prev => [...prev, {
        type: 'error',
        content: `bash: ${cmd}: command not found\nType 'help' for available commands.`,
      }]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = historyIdx + 1;
      if (idx < history.length) {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = historyIdx - 1;
      if (idx < 0) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col p-4 overflow-hidden cursor-text"
      style={{
        background: '#0a0c10',
        fontFamily: 'JetBrains Mono, monospace',
        color: '#e2e8f0',
        fontSize: '12px',
        lineHeight: '1.6',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.type === 'input' && (
              <span style={{ color: '#00d4ff' }}>{line.content}</span>
            )}
            {line.type === 'output' && (
              <span style={{ color: '#94a3b8' }}>{line.content}</span>
            )}
            {line.type === 'error' && (
              <span style={{ color: '#f87171' }}>{line.content}</span>
            )}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center">
          <span style={{ color: '#00d4ff' }}>{PROMPT}</span>
          <span className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full bg-transparent outline-none border-none caret-[#00d4ff]"
              style={{ color: '#e2e8f0', fontFamily: 'inherit', fontSize: 'inherit' }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <span className="invisible whitespace-pre">{input || ' '}</span>
          </span>
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

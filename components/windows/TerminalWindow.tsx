'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { terminal } from '@/data/content';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error';
  content: string;
  typing?: boolean;
}

const PROMPT_TEXT = 'izanos@portfolio:~$ ';
let lineIdCounter = 0;

export default function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: lineIdCounter++, type: 'output', content: terminal.welcomeMessage },
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

  const typeOutput = (text: string, type: 'output' | 'error' = 'output') => {
    const id = lineIdCounter++;
    setLines(prev => [...prev, { id, type, content: '', typing: true }]);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLines(prev => prev.map(l =>
        l.id === id ? { ...l, content: text.slice(0, i) } : l
      ));
      if (i >= text.length) {
        clearInterval(interval);
        setLines(prev => prev.map(l =>
          l.id === id ? { ...l, typing: false } : l
        ));
      }
    }, 6);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setLines(prev => [...prev, { id: lineIdCounter++, type: 'input', content: raw }]);

    if (!cmd) return;
    setHistory(prev => [raw, ...prev]);
    setHistoryIdx(-1);

    if (cmd === 'clear') {
      setLines([{ id: lineIdCounter++, type: 'output', content: terminal.welcomeMessage }]);
      return;
    }

    // Check regular commands
    const cmdResult = terminal.commands[cmd as keyof typeof terminal.commands];
    if (cmdResult) {
      typeOutput(cmdResult);
      return;
    }

    // Check easter eggs
    const eggResult = terminal.easterEggs[cmd as keyof typeof terminal.easterEggs];
    if (eggResult) {
      typeOutput(eggResult);
      return;
    }

    // cat <project>
    if (cmd.startsWith('cat ')) {
      const slug = cmd.slice(4).trim();
      const detail = terminal.projectDetails[slug as keyof typeof terminal.projectDetails];
      if (detail) {
        typeOutput(detail);
        return;
      }
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

  const MONO = 'var(--font-jetbrains), monospace';

  return (
    <div
      className="h-full flex flex-col overflow-hidden cursor-text"
      style={{ background: '#0a0a0a', fontFamily: MONO, fontSize: '12px', lineHeight: 1.6 }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {lines.map(line => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.type === 'input' && (
              <div>
                <span style={{ color: '#00d4ff' }}>izanos</span>
                <span style={{ color: '#7c3aed' }}>@portfolio</span>
                <span style={{ color: '#f0f4ff' }}>:~$ </span>
                <span style={{ color: '#f0f4ff' }}>{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <span style={{ color: '#8892a4' }}>
                {line.content}
                {line.typing && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '13px',
                      background: '#00d4ff',
                      marginLeft: '1px',
                      verticalAlign: 'text-bottom',
                      animation: 'blink 1s step-end infinite',
                    }}
                  />
                )}
              </span>
            )}
            {line.type === 'error' && (
              <span style={{ color: '#ff4757' }}>{line.content}</span>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center">
          <span style={{ color: '#00d4ff' }}>izanos</span>
          <span style={{ color: '#7c3aed' }}>@portfolio</span>
          <span style={{ color: '#f0f4ff' }}>:~$ </span>
          <span className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full bg-transparent outline-none border-none"
              style={{ color: '#f0f4ff', fontFamily: MONO, fontSize: '12px', caretColor: '#00d4ff' }}
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

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

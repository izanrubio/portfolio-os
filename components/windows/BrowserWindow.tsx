'use client';

import { useState, useEffect, useRef } from 'react';
import PortfolioSite from './PortfolioSite';

const MONO = 'var(--font-jetbrains), monospace';
const HOME = 'izanrubio.dev';

interface BrowserWindowProps {
  initialUrl?: string;
}

type Page =
  | { type: 'internal' }
  | { type: 'external'; url: string }
  | { type: 'error'; url: string };

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return HOME;
  if (trimmed === HOME || trimmed === 'izanrubio.dev') return HOME;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

export default function BrowserWindow({ initialUrl = HOME }: BrowserWindowProps) {
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentRaw = history[historyIdx] ?? HOME;

  useEffect(() => {
    setInputUrl(currentRaw === HOME ? HOME : currentRaw);
    setIframeError(false);
  }, [currentRaw]);

  // Respond to external URL navigation (from FilesWindow)
  useEffect(() => {
    if (!initialUrl || initialUrl === HOME) return;
    const norm = normalizeUrl(initialUrl);
    setHistory([norm]);
    setHistoryIdx(0);
  }, [initialUrl]);

  const navigate = (raw: string) => {
    const url = normalizeUrl(raw);
    const newHistory = [...history.slice(0, historyIdx + 1), url];
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setInputUrl(url === HOME ? HOME : url);
    setIframeError(false);
  };

  const goBack = () => {
    if (historyIdx > 0) setHistoryIdx(i => i - 1);
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) setHistoryIdx(i => i + 1);
  };

  const refresh = () => {
    setIframeError(false);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src;
      }, 50);
    }
  };

  const isInternal = currentRaw === HOME;
  const canBack = historyIdx > 0;
  const canForward = historyIdx < history.length - 1;

  const btnStyle = (enabled: boolean) => ({
    background: 'none',
    border: 'none',
    color: enabled ? '#f0f4ff' : '#4a5568',
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '14px',
    padding: '4px 6px',
    borderRadius: '4px',
    transition: 'background 0.1s',
  });

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0e1a' }}>
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: '#080c18', borderBottom: '1px solid #1a2332' }}
      >
        {/* Nav buttons */}
        <button style={btnStyle(canBack)} onClick={goBack} title="Back" disabled={!canBack}>←</button>
        <button style={btnStyle(canForward)} onClick={goForward} title="Forward" disabled={!canForward}>→</button>
        <button style={btnStyle(true)} onClick={refresh} title="Refresh">↻</button>

        {/* URL bar */}
        <form
          className="flex-1"
          onSubmit={e => { e.preventDefault(); navigate(inputUrl); }}
        >
          <input
            type="text"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0f1a',
              border: '1px solid #1e2d40',
              borderRadius: '20px',
              padding: '5px 16px',
              color: '#f0f4ff',
              fontFamily: MONO,
              fontSize: '12px',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; e.currentTarget.select(); }}
            onBlur={e => { e.currentTarget.style.borderColor = '#1e2d40'; }}
          />
        </form>

        {/* Bookmark indicator */}
        <span style={{ color: '#00d4ff', fontSize: '14px' }} title="Bookmarks">☆</span>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-hidden relative">
        {isInternal ? (
          <div className="h-full overflow-y-auto">
            <PortfolioSite />
          </div>
        ) : iframeError ? (
          <div
            className="h-full flex flex-col items-center justify-center gap-4"
            style={{ background: '#0a0e1a' }}
          >
            <p style={{ fontFamily: MONO, fontSize: '13px', color: '#ff4757' }}>
              Cannot load page
            </p>
            <p style={{ fontFamily: MONO, fontSize: '11px', color: '#8892a4', textAlign: 'center', maxWidth: '300px' }}>
              {currentRaw} blocked loading in iframe.
            </p>
            <a
              href={currentRaw}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: MONO,
                fontSize: '12px',
                color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.3)',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              Open in new tab ↗
            </a>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={currentRaw}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
              onError={() => setIframeError(true)}
              style={{ background: '#fff' }}
            />
            {/* Info banner */}
            <div
              className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(8,12,24,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,212,255,0.1)' }}
            >
              <span style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568' }}>
                Page not loading?
              </span>
              <a
                href={currentRaw}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: MONO, fontSize: '10px', color: '#00d4ff', textDecoration: 'none' }}
              >
                Open in new tab ↗
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

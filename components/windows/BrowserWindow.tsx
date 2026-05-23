'use client';

import { useState, useEffect, useRef } from 'react';
import PortfolioSite from './PortfolioSite';

const MONO = 'var(--font-jetbrains), monospace';
const HOME = 'izanrubio.dev';

interface BrowserWindowProps {
  initialUrl?: string;
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return HOME;
  if (trimmed === HOME || trimmed === 'izanrubio.dev') return HOME;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

function extractHost(url: string): string {
  try { return new URL(url).hostname; } catch { return url; }
}

export default function BrowserWindow({ initialUrl = HOME }: BrowserWindowProps) {
  const [history, setHistory]       = useState<string[]>([initialUrl]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [inputUrl, setInputUrl]     = useState(initialUrl);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentRaw = history[historyIdx] ?? HOME;
  const isInternal = currentRaw === HOME;

  // Reset blocked state on navigation
  useEffect(() => {
    setInputUrl(currentRaw === HOME ? HOME : currentRaw);
    setIframeBlocked(false);
  }, [currentRaw]);

  // Respond to external URL navigation (from FilesWindow / context menu)
  useEffect(() => {
    if (!initialUrl || initialUrl === HOME) return;
    const norm = normalizeUrl(initialUrl);
    setHistory([norm]);
    setHistoryIdx(0);
  }, [initialUrl]);

  // Detect blocked iframes: external URLs that fail to load within 3 seconds
  useEffect(() => {
    if (isInternal) return;
    const timer = setTimeout(() => setIframeBlocked(true), 3000);
    return () => clearTimeout(timer);
  }, [currentRaw, isInternal]);

  const navigate = (raw: string) => {
    const url = normalizeUrl(raw);
    const newHistory = [...history.slice(0, historyIdx + 1), url];
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setInputUrl(url === HOME ? HOME : url);
    setIframeBlocked(false);
  };

  const goBack    = () => { if (historyIdx > 0) setHistoryIdx(i => i - 1); };
  const goForward = () => { if (historyIdx < history.length - 1) setHistoryIdx(i => i + 1); };

  const refresh = () => {
    setIframeBlocked(false);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => { if (iframeRef.current) iframeRef.current.src = src; }, 50);
    }
  };

  const canBack    = historyIdx > 0;
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
        <button style={btnStyle(canBack)}    onClick={goBack}    title="Back"    disabled={!canBack}>←</button>
        <button style={btnStyle(canForward)} onClick={goForward} title="Forward" disabled={!canForward}>→</button>
        <button style={btnStyle(true)}       onClick={refresh}   title="Refresh">↻</button>

        <form className="flex-1" onSubmit={e => { e.preventDefault(); navigate(inputUrl); }}>
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

        <span style={{ color: '#00d4ff', fontSize: '14px' }} title="Bookmarks">☆</span>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-hidden relative">
        {isInternal ? (
          <div className="h-full overflow-y-auto">
            <PortfolioSite />
          </div>
        ) : iframeBlocked ? (
          <div
            className="h-full flex flex-col items-center justify-center"
            style={{ background: '#0d1117' }}
          >
            {/* Lock icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '20px' }}>
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#00d4ff" strokeWidth="1.5" fill="rgba(0,212,255,0.08)"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="#00d4ff"/>
            </svg>

            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}>
              Access Restricted
            </p>

            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '8px',
              textAlign: 'center',
              maxWidth: '320px',
            }}>
              {extractHost(currentRaw)} blocks external embedding for security.
            </p>

            <button
              onClick={() => window.open(currentRaw, '_blank')}
              style={{
                marginTop: '24px',
                background: '#00d4ff',
                color: '#0a0e1a',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open in new tab →
            </button>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={currentRaw}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
              onError={() => setIframeBlocked(true)}
              onLoad={() => {/* loaded — timer still runs but state won't double-flip */}}
              style={{ background: '#fff' }}
            />
            <div
              className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(8,12,24,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,212,255,0.1)' }}
            >
              <span style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568' }}>Page not loading?</span>
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

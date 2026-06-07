'use client';

import { useState, useEffect, useRef } from 'react';
import PortfolioSite from './PortfolioSite';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';
const HOME  = 'izanrubio.dev';

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

function displayUrl(raw: string): string {
  if (raw === HOME) return HOME;
  try {
    const u = new URL(raw);
    return u.host + u.pathname + (u.search || '');
  } catch { return raw; }
}

/* ── SVG icon helpers ── */
function IconBack({ enabled }: { enabled: boolean }) {
  const c = enabled ? '#c8d0e0' : '#3a4255';
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 5l-7 7 7 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconForward({ enabled }: { enabled: boolean }) {
  const c = enabled ? '#c8d0e0' : '#3a4255';
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M12 19l7-7-7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 9" stroke="#c8d0e0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 3v6h-6" stroke="#c8d0e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="12" height="13" viewBox="0 0 24 26" fill="none">
      <rect x="4" y="11" width="16" height="12" rx="2.5" stroke="#00d4ff" strokeWidth="2"/>
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1.5" fill="#00d4ff"/>
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#8892a4" strokeWidth="2"/>
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="#8892a4" strokeWidth="2"/>
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function BrowserWindow({ initialUrl = HOME }: BrowserWindowProps) {
  const [history, setHistory]         = useState<string[]>([initialUrl]);
  const [historyIdx, setHistoryIdx]   = useState(0);
  const [inputUrl, setInputUrl]       = useState(initialUrl === HOME ? HOME : displayUrl(initialUrl));
  const [inputFocused, setInputFocused] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentRaw = history[historyIdx] ?? HOME;
  const isInternal = currentRaw === HOME;
  const isSecure   = currentRaw.startsWith('https://') || isInternal;

  useEffect(() => {
    setInputUrl(currentRaw === HOME ? HOME : displayUrl(currentRaw));
    setIframeBlocked(false);
  }, [currentRaw]);

  useEffect(() => {
    if (!initialUrl || initialUrl === HOME) return;
    const norm = normalizeUrl(initialUrl);
    setHistory([norm]);
    setHistoryIdx(0);
  }, [initialUrl]);

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
    setInputUrl(url === HOME ? HOME : displayUrl(url));
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

  const tabLabel = isInternal ? HOME : extractHost(currentRaw);

  return (
    <div className="h-full flex flex-col" style={{ background: '#070a12' }}>

      {/* ── Tab bar ── */}
      <div style={{
        height: 36,
        flexShrink: 0,
        background: '#060810',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 12px',
      }}>
        {/* Active tab */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '0 14px',
          height: 28,
          background: '#0c1020',
          borderRadius: '8px 8px 0 0',
          border: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid #0c1020',
          maxWidth: 220,
          overflow: 'hidden',
        }}>
          {isInternal ? <IconGlobe /> : <IconGlobe />}
          <span style={{
            fontFamily: INTER,
            fontSize: 12,
            color: '#c8d0e0',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {tabLabel}
          </span>
          <div style={{
            marginLeft: 4,
            width: 14,
            height: 14,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            color: '#4a5568',
            fontSize: 10,
            lineHeight: 1,
          }}>×</div>
        </div>

        {/* New tab btn */}
        <button
          onClick={() => navigate(HOME)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3a4255',
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
            padding: '0 8px',
            marginBottom: 2,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#8892a4'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#3a4255'; }}
          title="New tab"
        >+</button>
      </div>

      {/* ── Navigation chrome ── */}
      <div style={{
        height: 44,
        flexShrink: 0,
        background: '#0c1020',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '0 12px',
      }}>
        {/* Back */}
        <button
          onClick={goBack}
          disabled={!canBack}
          style={{ background: 'none', border: 'none', cursor: canBack ? 'pointer' : 'default', padding: '4px 6px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => { if (canBack) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <IconBack enabled={canBack} />
        </button>

        {/* Forward */}
        <button
          onClick={goForward}
          disabled={!canForward}
          style={{ background: 'none', border: 'none', cursor: canForward ? 'pointer' : 'default', padding: '4px 6px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => { if (canForward) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <IconForward enabled={canForward} />
        </button>

        {/* Reload */}
        <button
          onClick={refresh}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <IconRefresh />
        </button>

        {/* URL bar */}
        <form
          className="flex-1"
          style={{ display: 'flex', alignItems: 'center' }}
          onSubmit={e => { e.preventDefault(); navigate(inputUrl); }}
        >
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#080c16',
            border: `1px solid ${inputFocused ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 8,
            padding: '0 12px',
            height: 30,
            transition: 'border-color 0.15s',
          }}>
            {isSecure ? <IconLock /> : <IconGlobe />}
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onFocus={e => { setInputFocused(true); e.currentTarget.select(); }}
              onBlur={() => setInputFocused(false)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#c8d0e0',
                fontFamily: MONO,
                fontSize: '12px',
              }}
            />
          </div>
        </form>

        {/* Bookmark */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          title="Bookmark"
        >
          <IconBookmark />
        </button>
      </div>

      {/* ── Viewport ── */}
      <div className="flex-1 overflow-hidden relative">
        {isInternal ? (
          <div className="h-full overflow-y-auto">
            <PortfolioSite />
          </div>
        ) : iframeBlocked ? (
          <div
            className="h-full flex flex-col items-center justify-center"
            style={{ background: '#070a12' }}
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 20 }}>
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#00d4ff" strokeWidth="1.5" fill="rgba(0,212,255,0.06)"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="#00d4ff"/>
            </svg>
            <p style={{ fontFamily: INTER, fontSize: 18, fontWeight: 700, color: '#f0f4ff', margin: 0 }}>
              Access Restricted
            </p>
            <p style={{ fontFamily: INTER, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8, textAlign: 'center', maxWidth: 300 }}>
              {extractHost(currentRaw)} blocks embedding for security.
            </p>
            <button
              onClick={() => window.open(currentRaw, '_blank')}
              style={{
                marginTop: 20,
                background: '#00d4ff',
                color: '#070a12',
                border: 'none',
                borderRadius: 8,
                padding: '9px 22px',
                fontFamily: INTER,
                fontSize: 13,
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
              style={{ background: '#fff' }}
            />
            <div
              className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(6,8,16,0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,212,255,0.08)' }}
            >
              <span style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568' }}>Not loading?</span>
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

'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WindowId } from '@/types/windows';
import { skills, projects, spotlight as spotlightContent } from '@/data/content';

const INTER = 'var(--font-inter), Inter, sans-serif';
const MONO  = 'var(--font-jetbrains), monospace';

/* ── Row types ── */
type AppRow     = { kind: 'app';     id: WindowId; name: string };
type ActionRow  = { kind: 'action';  id: string;   name: string; cta: string };
type SkillRow   = { kind: 'skill';   name: string; category: string };
type ProjectRow = { kind: 'project'; id: string;   name: string; sub: string };
type Row = AppRow | ActionRow | SkillRow | ProjectRow;

/* ── Icon meta ── */
type IconMeta = { gradient: string; icon: React.ReactNode };

const APP_ICON: Record<string, IconMeta> = {
  projects: {
    gradient: 'linear-gradient(135deg,#00c97a,#00ff9d)',
    icon: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
  whoami: {
    gradient: 'linear-gradient(135deg,#7b2ff7,#a855f7)',
    icon: <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
  skills: {
    gradient: 'linear-gradient(135deg,#0066ff,#00d4ff)',
    icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  },
  contact: {
    gradient: 'linear-gradient(135deg,#ff6b00,#ff9500)',
    icon: <><path d="M21 12.5A8.5 8.5 0 1 1 12.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M21 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M3.5 9.5 12 14l8.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  },
  browser: {
    gradient: 'linear-gradient(135deg,#0066ff,#7b2ff7)',
    icon: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
  files: {
    gradient: 'linear-gradient(135deg,#00c97a,#0066ff)',
    icon: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  },
  terminal: {
    gradient: 'linear-gradient(135deg,#1a1a1a,#2a2a2a)',
    icon: <><path d="M5 8l4 4-4 4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M12 17h7" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
};

const ACTION_ICON: Record<string, IconMeta> = {
  cv: {
    gradient: 'linear-gradient(135deg,#00c97a,#00ff9d)',
    icon: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
  email: {
    gradient: 'linear-gradient(135deg,#ff6b00,#ff9500)',
    icon: <><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></>,
  },
  github: {
    gradient: 'linear-gradient(135deg,#7b2ff7,#a855f7)',
    icon: <><path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M8 6L2 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  },
};

const FALLBACK_ICON: IconMeta = {
  gradient: 'linear-gradient(135deg,#333,#555)',
  icon: <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>,
};

/* ── Helpers ── */
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const at = lower.indexOf(q);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <span style={{ color: '#00d4ff', fontWeight: 600 }}>{text.slice(at, at + query.length)}</span>
      {text.slice(at + query.length)}
    </>
  );
}

function getSectionLabel(rows: Row[], i: number): string | null {
  const row = rows[i];
  const prev = rows[i - 1];
  const isSearch = (k: string) => k === 'skill' || k === 'project';

  if (!prev) {
    if (row.kind === 'app')    return 'Applications';
    if (row.kind === 'action') return 'Quick Actions';
    if (isSearch(row.kind))    return 'Search Results';
    return null;
  }
  if (row.kind === prev.kind)                        return null;
  if (isSearch(row.kind) && isSearch(prev.kind))     return null;
  if (row.kind === 'app')    return 'Applications';
  if (row.kind === 'action') return 'Quick Actions';
  if (isSearch(row.kind))    return 'Search Results';
  return null;
}

function downloadCV() {
  const a = document.createElement('a');
  a.href = '/cv.pdf';
  a.download = 'Izan_Rubio_CV.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── Row sub-component ── */
function RowItem({
  row, idx, active, query, onCommit, onHover,
}: {
  row: Row; idx: number; active: boolean; query: string;
  onCommit: () => void; onHover: () => void;
}) {
  let meta: IconMeta;
  let name: string;
  let sub: string;
  let cta: string;

  if (row.kind === 'app') {
    meta = APP_ICON[row.id] ?? FALLBACK_ICON;
    name = row.name;
    sub  = `${row.id}.exe · Application`;
    cta  = 'Open';
  } else if (row.kind === 'action') {
    meta = ACTION_ICON[row.id] ?? FALLBACK_ICON;
    name = row.name;
    sub  = 'Quick action';
    cta  = row.cta;
  } else if (row.kind === 'skill') {
    meta = APP_ICON.skills;
    name = row.name;
    sub  = `in skills.exe`;
    cta  = 'Open';
  } else {
    meta = APP_ICON.projects;
    name = row.name;
    sub  = row.sub;
    cta  = 'Open';
  }

  return (
    <div
      data-sp-idx={idx}
      onClick={onCommit}
      onMouseEnter={onHover}
      style={{
        height: '48px', padding: '0 12px', borderRadius: '10px',
        display: 'flex', alignItems: 'center', gap: '12px',
        cursor: 'pointer', color: '#fff',
        background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
        transition: 'background .12s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
        background: meta.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          {meta.icon}
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{
          fontFamily: INTER, fontSize: '15px', fontWeight: 500, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2,
        }}>
          {row.kind === 'skill'
            ? <>{highlight(name, query)} <span style={{ color: 'rgba(255,255,255,.35)', fontWeight: 400 }}>— {row.category} skill</span></>
            : highlight(name, query)
          }
        </div>
        <div style={{
          fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.03em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2,
        }}>
          {sub}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0, fontFamily: MONO, fontSize: '11px',
        color: active ? '#00d4ff' : 'rgba(255,255,255,0.3)',
        letterSpacing: '0.04em', transition: 'color .12s',
      }}>
        {cta}
      </div>
    </div>
  );
}

/* ── Footer hint ── */
function HintGroup({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: MONO, fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
      {keys.map(k => (
        <span key={k} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minWidth: '16px', height: '16px', padding: '0 4px',
          border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
          borderRadius: '3px', fontSize: '10px', color: 'rgba(255,255,255,0.45)',
        }}>{k}</span>
      ))}
      <span>{label}</span>
    </span>
  );
}

/* ── Main component ── */
interface SpotlightProps {
  onOpenWindow: (id: WindowId) => void;
  onNavigate:   (url: string) => void;
}

export default function Spotlight({ onOpenWindow, onNavigate }: SpotlightProps) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [query,     setQuery]     = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef   = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* Pre-compute flat skill list */
  const allSkills = useMemo(
    () => skills.flatMap(cat => cat.items.map(item => ({ name: item, category: cat.label }))),
    []
  );

  /* Flat selectable rows */
  const rows = useMemo((): Row[] => {
    const q = query.trim().toLowerCase();

    const appRows: AppRow[] = spotlightContent.apps.map(a => ({
      kind: 'app', id: a.id as WindowId, name: a.name,
    }));
    const actionRows: ActionRow[] = spotlightContent.actions.map(a => ({
      kind: 'action', id: a.id, name: a.name, cta: a.cta,
    }));

    if (!q) return [...appRows, ...actionRows];

    const matchApps:     AppRow[]     = appRows.filter(a => a.name.toLowerCase().includes(q));
    const matchActions:  ActionRow[]  = actionRows.filter(a => a.name.toLowerCase().includes(q));
    const matchSkills:   SkillRow[]   = allSkills.filter(s => s.name.toLowerCase().includes(q)).slice(0, 6).map(s => ({ kind: 'skill' as const, ...s }));
    const matchProjects: ProjectRow[] = projects.filter(p => p.name.toLowerCase().includes(q)).map(p => ({ kind: 'project' as const, id: p.slug, name: p.name, sub: p.description }));

    return [...matchApps, ...matchActions, ...matchSkills, ...matchProjects];
  }, [query, allSkills]);

  /* Reset active idx when query or rows change */
  useEffect(() => setActiveIdx(0), [query]);

  /* Focus input on open, clear on close */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  /* Scroll active row into view */
  useEffect(() => {
    resultsRef.current
      ?.querySelector(`[data-sp-idx="${activeIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  /* Stable refs for keyboard handler (no stale closure) */
  const isOpenRef   = useRef(isOpen);
  const activeIdxRef = useRef(activeIdx);
  const rowsRef     = useRef(rows);
  isOpenRef.current    = isOpen;
  activeIdxRef.current = activeIdx;
  rowsRef.current      = rows;

  const handleCommit = useCallback((idx: number) => {
    const row = rowsRef.current[idx];
    if (!row) return;

    if (row.kind === 'app') {
      onOpenWindow(row.id);
    } else if (row.kind === 'skill') {
      onOpenWindow('skills');
    } else if (row.kind === 'project') {
      onOpenWindow('projects');
    } else if (row.kind === 'action') {
      if (row.id === 'cv')     downloadCV();
      if (row.id === 'email')  onOpenWindow('contact');
      if (row.id === 'github') onNavigate('https://github.com/izanrubio');
    }

    setIsOpen(false);
  }, [onOpenWindow, onNavigate]);

  const handleCommitRef = useRef(handleCommit);
  handleCommitRef.current = handleCommit;

  /* Keyboard handler — registered once */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }
      if (!isOpenRef.current) return;
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIdx(prev =>
            rowsRef.current.length ? (prev + 1) % rowsRef.current.length : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIdx(prev =>
            rowsRef.current.length
              ? (prev - 1 + rowsRef.current.length) % rowsRef.current.length
              : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          handleCommitRef.current(activeIdxRef.current);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={e => { if (e.target === e.currentTarget) setIsOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            paddingTop: '20vh', paddingLeft: '24px', paddingRight: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } }}
            style={{
              width: '640px', maxWidth: '100%',
              background: 'rgba(15,15,25,0.92)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', maxHeight: '70vh',
            }}
          >
            {/* Input row */}
            <div style={{
              height: '56px', flexShrink: 0, padding: '0 20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search IzanOS..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1, minWidth: 0, height: '100%',
                  border: 0, outline: 0, background: 'transparent',
                  fontFamily: INTER, fontSize: '18px', fontWeight: 400,
                  color: '#fff', caretColor: '#00d4ff',
                }}
              />
              <span style={{
                flexShrink: 0, fontFamily: MONO, fontSize: '11px', fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.15)', padding: '2px 8px',
                borderRadius: '4px', letterSpacing: '0.08em',
              }}>ESC</span>
            </div>

            {/* Results */}
            <div
              ref={resultsRef}
              style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px', flex: 1, minHeight: 0 }}
            >
              {rows.length === 0 && query.trim() ? (
                <div style={{
                  padding: '24px', textAlign: 'center',
                  fontFamily: INTER, fontSize: '14px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  No results for{' '}
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>"{query.trim()}"</span>
                </div>
              ) : (
                rows.map((row, i) => {
                  const label = getSectionLabel(rows, i);
                  const key = row.kind === 'app' ? row.id : row.kind === 'action' ? row.id : row.kind === 'skill' ? `skill-${row.name}` : `proj-${row.id}`;
                  return (
                    <div key={key}>
                      {label && (
                        <div style={{
                          fontFamily: MONO, fontSize: '10px',
                          color: 'rgba(255,255,255,0.3)',
                          textTransform: 'uppercase', letterSpacing: '0.15em',
                          padding: '12px 16px 6px',
                        }}>
                          {label}
                        </div>
                      )}
                      <RowItem
                        row={row}
                        idx={i}
                        active={i === activeIdx}
                        query={query.trim()}
                        onCommit={() => handleCommit(i)}
                        onHover={() => setActiveIdx(i)}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{
              height: '40px', flexShrink: 0, padding: '0 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <HintGroup keys={['↑', '↓']} label="navigate" />
                <HintGroup keys={['↵']} label="open" />
                <HintGroup keys={['ESC']} label="close" />
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: MONO, fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.02em',
              }}>
                <svg width="11" height="11" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sp-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor="#00ff9d"/>
                      <stop offset="50%"  stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                  <path d="M16 3 L28 12 L24 28 L8 28 L4 12 Z" stroke="url(#sp-logo)" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                  <circle cx="16" cy="16" r="3.2" fill="url(#sp-logo)"/>
                </svg>
                <span>Spotlight</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

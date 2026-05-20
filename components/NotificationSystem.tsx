'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Types ── */
export type NotifType = 'message' | 'system' | 'alert' | 'achievement';

export interface NotifyInput {
  type: NotifType;
  app: string;
  title: string;
  body: string;
}

interface NotifItem extends NotifyInput {
  id: string;
}

interface NotifCtxValue {
  notify:  (n: NotifyInput) => void;
  notifs:  NotifItem[];
  dismiss: (id: string) => void;
}

/* ── Context ── */
const NotifCtx = createContext<NotifCtxValue>({
  notify:  () => {},
  notifs:  [],
  dismiss: () => {},
});

export function useNotifications() {
  return useContext(NotifCtx);
}

/* ── Provider ── */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((n: NotifyInput) => {
    const id = Math.random().toString(36).slice(2, 10);
    setNotifs(prev => [{ ...n, id }, ...prev]);
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  return (
    <NotifCtx.Provider value={{ notify, notifs, dismiss }}>
      {children}
    </NotifCtx.Provider>
  );
}

/* ── Design constants ── */
const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const TYPE_COLOR: Record<NotifType, string> = {
  message:     '#00ff88',
  system:      '#00d4ff',
  alert:       '#ff9500',
  achievement: '#7c3aed',
};

type AppMeta = { gradient: string; icon: React.ReactNode };

const APP_META: Record<string, AppMeta> = {
  'terminal.exe': {
    gradient: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    icon: (
      <>
        <path d="M5 8l4 4-4 4" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 17h7" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
  },
  'contact.exe': {
    gradient: 'linear-gradient(135deg, #ff6b00, #ff9500)',
    icon: (
      <>
        <path d="M21 12.5A8.5 8.5 0 1 1 12.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M21 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M3.5 9.5 12 14l8.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </>
    ),
  },
  'projects.exe': {
    gradient: 'linear-gradient(135deg, #00c97a, #00ff9d)',
    icon: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
  },
  'skills.exe': {
    gradient: 'linear-gradient(135deg, #0066ff, #00d4ff)',
    icon: (
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
  },
  'whoami.exe': {
    gradient: 'linear-gradient(135deg, #7b2ff7, #a855f7)',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
  },
  'files.exe': {
    gradient: 'linear-gradient(135deg, #00c97a, #0066ff)',
    icon: (
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
  },
  'browser.exe': {
    gradient: 'linear-gradient(135deg, #0066ff, #7b2ff7)',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M12 3a13 13 0 0 1 0 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
  },
};

const FALLBACK_META: AppMeta = {
  gradient: 'linear-gradient(135deg, #333, #555)',
  icon: <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>,
};

/* ── Notification card ── */
function NotifCard({ notif, onDismiss }: { notif: NotifItem; onDismiss: () => void }) {
  const accent = TYPE_COLOR[notif.type];
  const meta   = APP_META[notif.app] ?? FALLBACK_META;

  return (
    <motion.div
      layout
      initial={{ x: '110%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ x: '110%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
      style={{
        position: 'relative',
        background: 'rgba(20,20,30,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        pointerEvents: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '24px', height: '24px', flexShrink: 0,
          borderRadius: '6px', background: meta.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            {meta.icon}
          </svg>
        </div>
        <span style={{
          fontFamily: MONO, fontSize: '11px', fontWeight: 500,
          color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em',
          flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {notif.app}
        </span>
        <span style={{
          fontFamily: MONO, fontSize: '10px', fontWeight: 500,
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em',
          flexShrink: 0, paddingRight: '18px',
        }}>
          just now
        </span>
      </div>

      {/* Close */}
      <button
        onClick={onDismiss}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '16px', height: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)', background: 'none', border: 0, padding: 0,
          cursor: 'pointer', transition: 'color .15s, transform .15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
        aria-label="Dismiss"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 4 L12 12 M12 4 L4 12"/>
        </svg>
      </button>

      {/* Title */}
      <div style={{
        marginTop: '8px', fontFamily: INTER, fontSize: '14px',
        fontWeight: 600, color: '#fff', lineHeight: 1.3,
      }}>
        {notif.title}
      </div>

      {/* Body */}
      <div style={{
        marginTop: '4px', fontFamily: INTER, fontSize: '13px',
        fontWeight: 400, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {notif.body}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', left: '12px', right: '12px', bottom: '6px',
        height: '1.5px', borderRadius: '1px', overflow: 'hidden',
        background: 'rgba(255,255,255,.05)',
      }}>
        <div style={{
          height: '100%', background: accent,
          transformOrigin: 'left',
          animation: 'notif-progress 5s linear forwards',
        }} />
      </div>
    </motion.div>
  );
}

/* ── Dev test pool ── */
const TEST_POOL = [
  { type: 'message'     as const, app: 'contact.exe',  title: 'Recruiter pinged you',  body: 'A recruiter is asking about your availability for a senior FE role.' },
  { type: 'system'      as const, app: 'terminal.exe', title: 'Build succeeded',        body: 'next build · 27 routes · 4.2s. Vercel deploy preview ready.' },
  { type: 'achievement' as const, app: 'projects.exe', title: 'Project starred',        body: 'stastarat just hit 250 stars on GitHub. Nice.' },
  { type: 'alert'       as const, app: 'skills.exe',   title: 'TLS cert expires soon',  body: 'videoatencion.com expires in 7 days. Time to rotate.' },
  { type: 'system'      as const, app: 'files.exe',    title: 'Backup complete',        body: '847 files synced to kali-rootfs. 14.2 MB compressed.' },
];

/* ── Main component ── */
export default function NotificationSystem() {
  const { notifs, dismiss, notify } = useContext(NotifCtx);

  return (
    <>
      {/* Notification stack */}
      <div style={{
        position: 'fixed', top: '44px', right: '16px',
        width: '320px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '8px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {notifs.map(n => (
            <NotifCard key={n.id} notif={n} onDismiss={() => dismiss(n.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Dev-only test button */}
      {process.env.NODE_ENV === 'development' && (
        <DevTrigger notify={notify} />
      )}
    </>
  );
}

let testCursor = 0;
function DevTrigger({ notify }: { notify: (n: NotifyInput) => void }) {
  return (
    <button
      onClick={() => { notify(TEST_POOL[testCursor % TEST_POOL.length]); testCursor++; }}
      style={{
        position: 'fixed', bottom: '90px', right: '16px', zIndex: 9998,
        padding: '8px 14px', borderRadius: '999px',
        background: 'rgba(20,20,30,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,.45)',
        color: '#fff', fontFamily: MONO, fontSize: '11px', fontWeight: 500,
        letterSpacing: '0.05em', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '8px',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', flexShrink: 0 }} />
      test notif
    </button>
  );
}

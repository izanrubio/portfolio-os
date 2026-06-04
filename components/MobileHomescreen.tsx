'use client';

import { motion } from 'framer-motion';

const OUTFIT = 'var(--font-outfit), system-ui, sans-serif';
const MONO   = 'var(--font-jetbrains), monospace';

/* ── App-id mapping (ref key → MobilePortfolio AppId) ── */
const KEY_TO_ID: Record<string, string> = {
  projectes:  'projects',
  sobremi:    'about',
  skills:     'skills',
  contacte:   'contact',
  navegador:  'browser',
  arxius:     'files',
  terminal:   'terminal',
  joc:        'game',
  ajustos:    'settings',
  experience: 'experience',
  education:  'education',
};

/* ── App definitions ── */
interface AppDef { key: string; label: string; gradient: string; terminalBorder?: boolean; terminalIcon?: boolean; }

const APPS: AppDef[] = [
  { key: 'projectes',  label: 'Projectes',  gradient: 'linear-gradient(145deg,#1de589,#0ea875)' },
  { key: 'sobremi',    label: 'Sobre mi',   gradient: 'linear-gradient(145deg,#b06af7,#7c3aed)' },
  { key: 'skills',     label: 'Skills',     gradient: 'linear-gradient(145deg,#38bdf8,#0284c7)' },
  { key: 'contacte',   label: 'Contacte',   gradient: 'linear-gradient(145deg,#fb923c,#ea580c)' },
  { key: 'navegador',  label: 'Navegador',  gradient: 'linear-gradient(145deg,#60a5fa,#2563eb)' },
  { key: 'arxius',     label: 'Arxius',     gradient: 'linear-gradient(145deg,#2dd4bf,#0d9488)' },
  { key: 'terminal',   label: 'Terminal',   gradient: 'linear-gradient(145deg,#1e2a1e,#0f1a0f)', terminalBorder: true, terminalIcon: true },
  { key: 'joc',        label: 'Joc',        gradient: 'linear-gradient(145deg,#f87171,#dc2626)' },
  { key: 'ajustos',    label: 'Ajustos',    gradient: 'linear-gradient(145deg,#94a3b8,#475569)' },
  { key: 'experience', label: 'Experience', gradient: 'linear-gradient(145deg,#818cf8,#4f46e5)' },
  { key: 'education',  label: 'Education',  gradient: 'linear-gradient(145deg,#34d399,#059669)' },
];

const DOCK_KEYS = ['navegador', 'arxius', 'terminal', 'sobremi'];

/* ── SVG icon paths ── */
const ICON_PATHS: Record<string, string> = {
  projectes:  '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8M8 17h5"/>',
  sobremi:    '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/>',
  skills:     '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  contacte:   '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 21 11.5z"/>',
  navegador:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/>',
  arxius:     '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  terminal:   '<path d="M5 8l4 4-4 4"/><path d="M12 17h7"/>',
  joc:        '<rect x="2" y="7" width="20" height="10" rx="4"/><line x1="7" y1="11" x2="7" y2="13"/><line x1="6" y1="12" x2="8" y2="12"/><circle cx="16" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="13.5" r="1" fill="currentColor"/>',
  ajustos:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  experience: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  education:  '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/>',
};

/* ── Status icons ── */
function StatusIcons() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff">
        <rect x="0" y="7" width="3" height="4" rx="1"/>
        <rect x="4.5" y="5" width="3" height="6" rx="1"/>
        <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
        <rect x="13.5" y="0" width="3" height="11" rx="1"/>
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="#fff">
        <path d="M8 2.2c2 0 3.8.8 5.1 2l1.1-1.2A9 9 0 0 0 8 .4 9 9 0 0 0 1.8 3l1.1 1.2A7.2 7.2 0 0 1 8 2.2zM8 5.5c1.1 0 2.1.4 2.8 1.2l1.1-1.2A6 6 0 0 0 8 3.8a6 6 0 0 0-3.9 1.7l1.1 1.2A4 4 0 0 1 8 5.5zm0 3.2L9.6 7A2.3 2.3 0 0 0 8 6.4 2.3 2.3 0 0 0 6.4 7L8 8.7z"/>
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="1" y="1" width="21" height="10" rx="2.5" stroke="#fff" strokeOpacity=".4"/>
        <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill="#fff"/>
        <rect x="23" y="4" width="1.5" height="4" rx=".75" fill="#fff" fillOpacity=".5"/>
      </svg>
    </div>
  );
}

/* ── App icon component ── */
function AppIcon({ app, size = 64, onOpen }: { app: AppDef; size?: number; onOpen: (id: string) => void }) {
  const radius = size <= 56 ? 15 : 18;
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}
      onClick={() => onOpen(KEY_TO_ID[app.key] ?? app.key)}
    >
      <div style={{
        width: size, height: size, borderRadius: radius,
        background: app.gradient,
        border: app.terminalBorder ? '1px solid rgba(34,211,165,.3)' : 'none',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 18px -6px rgba(0,0,0,.6)',
        flexShrink: 0,
      }}>
        {/* Shimmer line */}
        <div style={{ content: '""', position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)' }} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={app.terminalIcon ? 'rgba(34,211,165,.9)' : '#fff'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: size <= 56 ? 26 : 30, height: size <= 56 ? 26 : 30 }}
          dangerouslySetInnerHTML={{ __html: ICON_PATHS[app.key] ?? '' }}
        />
      </div>
      {size > 56 && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', textShadow: '0 1px 3px rgba(0,0,0,.6)', textAlign: 'center', fontFamily: OUTFIT }}>
          {app.label}
        </span>
      )}
    </div>
  );
}

/* ── Framer variants ── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  show:   { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
};

interface Props {
  isVisible: boolean;
  dimmed: boolean;
  onOpenApp: (id: string) => void;
}

export default function MobileHomescreen({ isVisible, dimmed, onOpenApp }: Props) {
  const dockApps = DOCK_KEYS.map(k => APPS.find(a => a.key === k)!).filter(Boolean);
  const gridApps1 = APPS.slice(0, 8);
  const gridApps2 = APPS.slice(8);

  if (!isVisible) return null;

  return (
    <motion.div
      key="homescreen"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Background ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#080c14', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, top: -80, right: -90, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.28), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, bottom: -60, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.20), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, bottom: -40, right: -70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,165,0.18), transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
        {/* Drift blobs */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', width: 280, height: 280, top: -60, right: -80, borderRadius: '50%', background: 'rgba(168,85,247,.12)', filter: 'blur(60px)', pointerEvents: 'none' }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ position: 'absolute', width: 200, height: 200, bottom: 40, left: -70, borderRadius: '50%', background: 'rgba(0,229,255,.08)', filter: 'blur(60px)', pointerEvents: 'none' }}
        />
      </div>

      {/* ── Dynamic Island ── */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />

      {/* ── Status bar ── */}
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: OUTFIT }}>
          {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
        </span>
        <StatusIcons />
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, paddingTop: 54 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 20px' }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,.4)', fontFamily: OUTFIT }}>
              Welcome back
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 3, fontFamily: OUTFIT }}>
              Izan
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(145deg, #a855f7, #00e5ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            boxShadow: '0 4px 16px rgba(168,85,247,.5)',
            fontFamily: OUTFIT,
          }}>
            IZ
          </div>
        </div>

        {/* App grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
        >
          {/* First 8 apps — 4×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px 12px', padding: '4px 20px 0' }}>
            {gridApps1.map(app => (
              <motion.div key={app.key} variants={itemVariants} whileTap={{ scale: 0.88 }} style={{ display: 'flex', justifyContent: 'center' }}>
                <AppIcon app={app} onOpen={onOpenApp} />
              </motion.div>
            ))}
          </div>

          {/* Last 3 — centered */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '20px 20px 0' }}>
            {gridApps2.map(app => (
              <motion.div key={app.key} variants={itemVariants} whileTap={{ scale: 0.88 }}>
                <AppIcon app={app} onOpen={onOpenApp} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Page dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 'auto', paddingBottom: 16 }}>
          <span style={{ width: 18, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.8)' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.25)' }} />
        </div>

        {/* Dock */}
        <div style={{
          margin: '0 16px 10px',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 28,
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        }}>
          {dockApps.map(app => (
            <motion.div key={app.key} whileTap={{ scale: 0.88 }}>
              <AppIcon app={app} size={56} onOpen={onOpenApp} />
            </motion.div>
          ))}
        </div>

        {/* Home bar */}
        <div style={{ width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,.25)', margin: '0 auto 9px' }} />
      </div>
    </motion.div>
  );
}

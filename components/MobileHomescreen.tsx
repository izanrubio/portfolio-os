'use client';

import { motion } from 'framer-motion';
import { personal } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallpaper } from '@/contexts/WallpaperContext';
import { t } from '@/data/translations';

const FIRST_NAME = personal.name.split(' ')[0];

const OUTFIT = 'var(--font-outfit), system-ui, sans-serif';

/* Mirror WP_BLOBS from MobileLockscreen for the homescreen drifting blobs */
const WP_BLOBS: Record<string, [string, string, string]> = {
  aurora:    ['rgba(168,85,247,.15)', 'rgba(0,229,255,.10)',  'rgba(34,211,165,.10)'],
  sunset:    ['rgba(255,149,0,.20)',  'rgba(255,71,87,.15)',  'rgba(124,58,237,.12)'],
  ocean:     ['rgba(0,102,255,.18)',  'rgba(0,212,255,.15)',  'rgba(0,255,136,.10)'],
  cyberpunk: ['rgba(236,72,153,.18)','rgba(124,58,237,.15)', 'rgba(0,212,255,.10)'],
  midnight:  ['rgba(0,102,255,.15)', 'rgba(10,10,80,.60)',   'rgba(124,58,237,.12)'],
  forest:    ['rgba(0,201,122,.18)', 'rgba(0,255,136,.14)',  'rgba(0,102,50,.16)'],
};

/* ── App definitions ── */
interface AppDef { id: string; labelKey: string; grad: string; term?: boolean; }

const GRID_APPS: AppDef[] = [
  { id: 'projects',   labelKey: 'dock.projects',   grad: 'linear-gradient(145deg,#1de589,#0ea875)' },
  { id: 'about',      labelKey: 'dock.about',      grad: 'linear-gradient(145deg,#b06af7,#7c3aed)' },
  { id: 'skills',     labelKey: 'dock.skills',     grad: 'linear-gradient(145deg,#38bdf8,#0284c7)' },
  { id: 'contact',    labelKey: 'dock.contact',    grad: 'linear-gradient(145deg,#fb923c,#ea580c)' },
  { id: 'browser',    labelKey: 'dock.browser',    grad: 'linear-gradient(145deg,#60a5fa,#2563eb)' },
  { id: 'files',      labelKey: 'dock.files',      grad: 'linear-gradient(145deg,#2dd4bf,#0d9488)' },
  { id: 'terminal',   labelKey: 'dock.terminal',   grad: 'linear-gradient(145deg,#1e2a1e,#0f1a0f)', term: true },
  { id: 'game',       labelKey: 'dock.game',       grad: 'linear-gradient(145deg,#f87171,#dc2626)' },
  { id: 'settings',   labelKey: 'dock.settings',   grad: 'linear-gradient(145deg,#94a3b8,#475569)' },
  { id: 'experience', labelKey: 'dock.experience', grad: 'linear-gradient(145deg,#818cf8,#4f46e5)' },
  { id: 'education',  labelKey: 'dock.education',  grad: 'linear-gradient(145deg,#34d399,#059669)' },
  { id: 'chat',       labelKey: 'dock.chat',       grad: 'linear-gradient(145deg,#25d366,#128c7e)' },
];

const DOCK_APPS: AppDef[] = [
  GRID_APPS.find(a => a.id === 'browser')!,
  GRID_APPS.find(a => a.id === 'files')!,
  GRID_APPS.find(a => a.id === 'terminal')!,
  GRID_APPS.find(a => a.id === 'about')!,
];

/* ── SVG icon paths (React nodes, no dangerouslySetInnerHTML) ── */
function AppIcon({ app, size, onOpen }: { app: AppDef; size: number; onOpen: (id: string) => void }) {
  const radius = size <= 56 ? 15 : 18;
  const iconSize = size <= 56 ? 25 : 29;
  const iconColor = app.term ? 'rgba(34,211,165,.9)' : '#fff';

  const IconPath = () => {
    switch (app.id) {
      case 'projects':   return <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8M8 17h5"/></>;
      case 'about':      return <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/></>;
      case 'skills':     return <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>;
      case 'contact':    return <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 21 11.5z"/>;
      case 'browser':    return <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></>;
      case 'files':      return <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>;
      case 'terminal':   return <><path d="M5 8l4 4-4 4"/><path d="M12 17h7"/></>;
      case 'game':       return <><rect x="2" y="7" width="20" height="10" rx="4"/><line x1="7" y1="11" x2="7" y2="13"/><line x1="6" y1="12" x2="8" y2="12"/><circle cx="16" cy="11.5" r="1" fill="currentColor"/><circle cx="18" cy="13.5" r="1" fill="currentColor"/></>;
      case 'settings':   return <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></>;
      case 'experience': return <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>;
      case 'education':  return <><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/></>;
      case 'chat':       return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }} onClick={() => onOpen(app.id)}>
      <div style={{
        width: size, height: size, borderRadius: radius, background: app.grad,
        border: app.term ? '1px solid rgba(34,211,165,.3)' : 'none',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 18px -6px rgba(0,0,0,.6)', flexShrink: 0,
      }}>
        {/* Top shimmer line */}
        <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)' }} />
        <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: iconSize, height: iconSize }}>
          <IconPath />
        </svg>
      </div>
      {size > 56 && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', textShadow: '0 1px 3px rgba(0,0,0,.6)', textAlign: 'center', fontFamily: OUTFIT, lineHeight: 1.2 }}>
          {/* label provided by parent */}
        </span>
      )}
    </div>
  );
}

/* ── Status bar icons ── */
function StatusIcons({ color = '#fff' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill={color}><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill={color}><path d="M8 2.2c2 0 3.8.8 5.1 2l1.1-1.2A9 9 0 0 0 8 .4 9 9 0 0 0 1.8 3l1.1 1.2A7.2 7.2 0 0 1 8 2.2zM8 5.5c1.1 0 2.1.4 2.8 1.2l1.1-1.2A6 6 0 0 0 8 3.8a6 6 0 0 0-3.9 1.7l1.1 1.2A4 4 0 0 1 8 5.5zm0 3.2L9.6 7A2.3 2.3 0 0 0 8 6.4 2.3 2.3 0 0 0 6.4 7L8 8.7z"/></svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="2.5" stroke={color} strokeOpacity=".4"/><rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill={color}/><rect x="23" y="4" width="1.5" height="4" rx=".75" fill={color} fillOpacity=".5"/></svg>
    </div>
  );
}

/* ── Framer variants ── */
const containerVars = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVars = {
  hidden: { opacity: 0, scale: 0.7 },
  show:   { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
};

interface Props {
  isVisible: boolean;
  dimmed: boolean;
  onOpenApp: (id: string) => void;
}

export default function MobileHomescreen({ isVisible, dimmed, onOpenApp }: Props) {
  const { lang }      = useLanguage();
  const { theme }     = useTheme();
  const { wallpaper } = useWallpaper();

  const isDark   = theme === 'dark';
  const blobs    = WP_BLOBS[wallpaper] ?? WP_BLOBS.aurora;
  const bg       = isDark ? '#080c14' : '#e8edf5';
  const blobOp   = isDark ? 1 : 0.18;
  const blobBlend = isDark ? 'screen' as const : 'multiply' as const;
  const iconColor = isDark ? '#fff' : '#1e293b';

  /* Current time for status bar */
  const now  = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const grid1 = GRID_APPS.slice(0, 8);  // 4×2
  const grid2 = GRID_APPS.slice(8);     // last 3, centered

  if (!isVisible) return null;

  return (
    <motion.div
      key="homescreen"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Background + drift blobs ── */}
      <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden' }}>
        {/* Static aurora radials — lightweight, no animation */}
        <div style={{ position: 'absolute', width: 260, height: 260, top: -70, right: -80, borderRadius: '50%', background: `radial-gradient(circle,${blobs[0]},transparent 65%)`, filter: 'blur(25px)', opacity: blobOp, mixBlendMode: blobBlend, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, bottom: -50, left: -80, borderRadius: '50%', background: `radial-gradient(circle,${blobs[1]},transparent 65%)`, filter: 'blur(25px)', opacity: blobOp, mixBlendMode: blobBlend, pointerEvents: 'none' }} />
      </div>

      {/* ── Dynamic Island ── */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />

      {/* ── Status bar ── */}
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: iconColor, fontFamily: OUTFIT }}>{time}</span>
        <StatusIcons color={iconColor} />
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, paddingTop: 54 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 20px' }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)', fontFamily: OUTFIT }}>
              {t('mobile.hs.welcome', lang)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 3, fontFamily: OUTFIT, color: isDark ? '#fff' : '#0f172a' }}>
              {FIRST_NAME}
            </div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(145deg,#a855f7,#00e5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(168,85,247,.5)', fontFamily: OUTFIT }}>
            IZ
          </div>
        </div>

        {/* App grid — stagger entrance */}
        <motion.div variants={containerVars} initial="hidden" animate="show" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* 4×2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px 12px', padding: '4px 20px 0' }}>
            {grid1.map(app => (
              <motion.div key={app.id} variants={itemVars} whileTap={{ scale: 0.88 }} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <AppIcon app={app} size={64} onOpen={onOpenApp} />
                  <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.75)', textShadow: isDark ? '0 1px 3px rgba(0,0,0,.6)' : 'none', textAlign: 'center', fontFamily: OUTFIT, lineHeight: 1.2 }}>
                    {t(app.labelKey, lang)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Last row — same grid as above */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px 12px', padding: '20px 20px 0' }}>
            {grid2.map(app => (
              <motion.div key={app.id} variants={itemVars} whileTap={{ scale: 0.88 }} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <AppIcon app={app} size={64} onOpen={onOpenApp} />
                  <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.75)', textShadow: isDark ? '0 1px 3px rgba(0,0,0,.6)' : 'none', textAlign: 'center', fontFamily: OUTFIT, lineHeight: 1.2 }}>
                    {t(app.labelKey, lang)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Page dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 'auto', paddingBottom: 16 }}>
          <span style={{ width: 18, height: 6, borderRadius: 3, background: isDark ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.6)' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.2)' }} />
        </div>

        {/* Dock */}
        <div style={{
          margin: '0 16px 10px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.10)',
          borderRadius: 28, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        }}>
          {DOCK_APPS.map(app => (
            <motion.div key={app.id} whileTap={{ scale: 0.88 }}>
              <AppIcon app={app} size={56} onOpen={onOpenApp} />
            </motion.div>
          ))}
        </div>

        {/* Home bar */}
        <div style={{ width: 134, height: 5, borderRadius: 3, background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.2)', margin: '0 auto 9px' }} />
      </div>
    </motion.div>
  );
}


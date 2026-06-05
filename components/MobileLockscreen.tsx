'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal, projects } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallpaper } from '@/contexts/WallpaperContext';
import { t } from '@/data/translations';

const OUTFIT = 'var(--font-outfit), system-ui, sans-serif';
const MONO   = 'var(--font-jetbrains), monospace';

/* Blob colors per wallpaper (top-right, bottom-left, bottom-right).
   Aurora uses the approved reference palette; others follow wallpaper hue. */
const WP_BLOBS: Record<string, [string, string, string]> = {
  aurora:    ['rgba(168,85,247,.28)', 'rgba(0,229,255,.20)',  'rgba(34,211,165,.18)'],
  sunset:    ['rgba(255,149,0,.35)',  'rgba(255,71,87,.30)',  'rgba(124,58,237,.22)'],
  ocean:     ['rgba(0,102,255,.32)',  'rgba(0,212,255,.28)',  'rgba(0,255,136,.18)'],
  cyberpunk: ['rgba(236,72,153,.32)','rgba(124,58,237,.28)', 'rgba(0,212,255,.18)'],
  midnight:  ['rgba(0,102,255,.26)', 'rgba(10,10,80,.80)',   'rgba(124,58,237,.18)'],
  forest:    ['rgba(0,201,122,.32)', 'rgba(0,255,136,.25)',  'rgba(0,102,50,.28)'],
};

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function StatusIcons({ color = '#fff' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill={color}>
        <rect x="0" y="7" width="3" height="4" rx="1"/>
        <rect x="4.5" y="5" width="3" height="6" rx="1"/>
        <rect x="9" y="2.5" width="3" height="8.5" rx="1"/>
        <rect x="13.5" y="0" width="3" height="11" rx="1"/>
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill={color}>
        <path d="M8 2.2c2 0 3.8.8 5.1 2l1.1-1.2A9 9 0 0 0 8 .4 9 9 0 0 0 1.8 3l1.1 1.2A7.2 7.2 0 0 1 8 2.2zM8 5.5c1.1 0 2.1.4 2.8 1.2l1.1-1.2A6 6 0 0 0 8 3.8a6 6 0 0 0-3.9 1.7l1.1 1.2A4 4 0 0 1 8 5.5zm0 3.2L9.6 7A2.3 2.3 0 0 0 8 6.4 2.3 2.3 0 0 0 6.4 7L8 8.7z"/>
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="1" y="1" width="21" height="10" rx="2.5" stroke={color} strokeOpacity=".4"/>
        <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill={color}/>
        <rect x="23" y="4" width="1.5" height="4" rx=".75" fill={color} fillOpacity=".5"/>
      </svg>
    </div>
  );
}

interface Props {
  isLocked: boolean;
  isBooting: boolean;
  onUnlock: () => void;
}

export default function MobileLockscreen({ isLocked, isBooting, onUnlock }: Props) {
  const { lang }      = useLanguage();
  const { theme }     = useTheme();
  const { wallpaper } = useWallpaper();

  const isDark = theme === 'dark';
  const blobs  = WP_BLOBS[wallpaper] ?? WP_BLOBS.aurora;

  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`);
      setDate(`${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const liveProjects = projects.filter(p => p.status !== 'in-development').length;

  /* theme-aware tokens */
  const bg         = isDark ? '#080c14' : '#e8edf5';
  const blobOpac   = isDark ? 1 : 0.18;
  const blobBlend  = isDark ? 'screen' as const : 'multiply' as const;
  const pillBg     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const pillBdr    = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const pillColor  = isDark ? 'rgba(255,255,255,.9)'   : '#1e293b';
  const widgetBg   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.65)';
  const widgetBdr  = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const wLabelCol  = isDark ? 'rgba(255,255,255,.5)'   : '#64748b';
  const wSubCol    = isDark ? 'rgba(255,255,255,.45)'  : '#94a3b8';
  const swipeCol   = isDark ? 'rgba(255,255,255,.45)'  : '#64748b';
  const iconColor  = isDark ? '#fff' : '#1e293b';

  const pill: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '7px 13px', borderRadius: 999,
    background: pillBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${pillBdr}`,
    fontSize: 12, fontWeight: 500, color: pillColor, fontFamily: OUTFIT,
  };

  return (
    <AnimatePresence>
      {!isBooting && isLocked && (
        <motion.div
          key="lockscreen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 50, cursor: 'pointer' }}
          onClick={onUnlock}
          onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
          onTouchMove={e => {
            if (touchStartY.current !== null && touchStartY.current - e.touches[0].clientY > 40) {
              onUnlock(); touchStartY.current = null;
            }
          }}
        >
          {/* ── Background ── */}
          <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden' }}>
            {/* Aurora radials — respond to wallpaper and theme */}
            <div style={{ position: 'absolute', width: 300, height: 300, top: -80, right: -90, borderRadius: '50%', background: `radial-gradient(circle,${blobs[0]},transparent 65%)`, filter: 'blur(25px)', opacity: blobOpac, mixBlendMode: blobBlend, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 280, height: 280, bottom: -60, left: -100, borderRadius: '50%', background: `radial-gradient(circle,${blobs[1]},transparent 65%)`, filter: 'blur(25px)', opacity: blobOpac, mixBlendMode: blobBlend, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 240, height: 240, bottom: -40, right: -70, borderRadius: '50%', background: `radial-gradient(circle,${blobs[2]},transparent 65%)`, filter: 'blur(25px)', opacity: blobOpac, mixBlendMode: blobBlend, pointerEvents: 'none' }} />
            {/* SVG grain noise 3% */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
          </div>

          {/* ── Dynamic Island ── */}
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />

          {/* ── Status bar ── */}
          <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: iconColor, fontFamily: OUTFIT }}>{time}</span>
            <StatusIcons color={iconColor} />
          </div>

          {/* ── Main content ── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', padding: '58px 22px 22px' }}>

            {/* Top pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={pill}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3a5', boxShadow: '0 0 8px #22d3a5', animation: 'ls-pulsedot 1.6s ease-in-out infinite', flexShrink: 0 }} />
                {t('mobile.ls.available', lang)}
              </span>
              <span style={pill}>
                <span style={{ fontFamily: MONO, color: '#00e5ff', fontSize: 11 }}>⌘</span>
                IzanOS 0.3
              </span>
            </div>

            {/* Photo */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              margin: '30px auto 0', flexShrink: 0,
              boxShadow: '0 0 0 2px rgba(255,255,255,.15), 0 0 30px rgba(168,85,247,.4), 0 0 50px rgba(0,229,255,.2)',
            }}>
              {photoFailed ? (
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  background: 'linear-gradient(145deg,#a855f7,#00e5ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: OUTFIT,
                }}>IZ</div>
              ) : (
                <img
                  src={personal.photo}
                  alt={personal.name}
                  onError={() => setPhotoFailed(true)}
                  style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
                />
              )}
            </div>

            {/* Clock */}
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <div style={{
                fontFamily: OUTFIT, fontWeight: 200, fontSize: 88,
                letterSpacing: '-0.04em', lineHeight: 0.9,
                background: isDark
                  ? 'linear-gradient(135deg, #fff 40%, #d8b4fe 100%)'
                  : 'linear-gradient(135deg, #1e293b 40%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{time}</div>
              <div style={{ fontSize: 16, fontWeight: 400, color: isDark ? 'rgba(255,255,255,.75)' : '#334155', marginTop: 10, fontFamily: OUTFIT }}>
                {date}
              </div>
            </div>

            {/* Widgets 2×2 */}
            <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Stack */}
              <div style={{ background: widgetBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${widgetBdr}`, borderRadius: 18, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: wLabelCol, textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  {t('mobile.ls.stack', lang)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.15, color: '#00e5ff', fontFamily: OUTFIT }}>Next.js / React 19</div>
              </div>

              {/* Projects */}
              <div style={{ background: widgetBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${widgetBdr}`, borderRadius: 18, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: wLabelCol, textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  {t('mobile.ls.projects', lang)}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT, color: isDark ? '#fff' : '#0f172a' }}>{liveProjects}</div>
                <div style={{ fontSize: 11, color: wSubCol, marginTop: 2, fontFamily: OUTFIT }}>{t('mobile.ls.completed', lang)}</div>
              </div>

              {/* Location */}
              <div style={{ background: widgetBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${widgetBdr}`, borderRadius: 18, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: wLabelCol, textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/></svg>
                  {t('mobile.ls.location', lang)}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT, color: isDark ? '#fff' : '#0f172a' }}>22°</div>
                <div style={{ fontSize: 11, color: wSubCol, marginTop: 2, fontFamily: OUTFIT }}>{t('mobile.ls.weather', lang)}</div>
              </div>

              {/* Dev */}
              <div style={{ background: widgetBg, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${widgetBdr}`, borderRadius: 18, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', color: wLabelCol, textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>
                  {t('mobile.ls.dev', lang)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8, lineHeight: 1.15, fontFamily: OUTFIT, color: isDark ? '#fff' : '#0f172a' }}>
                  izanrubio<span style={{ color: '#a855f7' }}>.info</span>
                </div>
              </div>
            </div>

            {/* Swipe up */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={swipeCol} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: swipeCol }}>
                {t('mobile.ls.swipeUp', lang)}
              </span>
              <span style={{ width: 134, height: 5, borderRadius: 3, background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.20)', display: 'block' }} />
            </motion.div>
          </div>

          <style>{`@keyframes ls-pulsedot { 50% { opacity:.4; transform:scale(.75); } }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

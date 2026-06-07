'use client';

interface IconConfig {
  bg: string;
  shadowColor: string;
  extra?: React.ReactNode;
  svgProps?: {
    fill?: string; stroke?: string; strokeWidth?: string;
    strokeLinecap?: 'round' | 'butt' | 'square';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    style?: React.CSSProperties;
  };
  icon: React.ReactNode;
}

const ICON_CONFIG: Record<string, IconConfig> = {
  /* ── Missatges / Chat ── */
  chat: {
    bg: 'linear-gradient(150deg,#34e57a 0%,#16a34a 55%,#0c7a37 100%)',
    shadowColor: 'rgba(22,163,74,.4)',
    extra: (
      <div style={{ position:'absolute', zIndex:2, left:'10%', right:'10%', top:'7%', height:'42%', borderRadius:'50% / 50%', background:'linear-gradient(180deg,rgba(255,255,255,.4),transparent)', filter:'blur(3px)' }} />
    ),
    icon: (
      <>
        <path d="M21 8C13.3 8 7 13.5 7 20.3c0 3.6 1.8 6.8 4.7 9L10 36l7-2.5c1.2.4 2.6.6 4 .6 7.7 0 14-5.5 14-12.4S28.7 8 21 8Z" fill="#fff"/>
        <path d="M17 16c-.3-.7-.6-.7-.9-.7l-.8 0c-.3 0-.8.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 2 1.5 3.9 1.7 4.2.2.3 2.8 4.4 6.9 6 3.4 1.3 4.1 1.1 4.8 1 .7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.9-.5-.5-.2-2.7-1.3-3.1-1.5-.4-.1-.7-.2-1 .2-.3.4-1.1 1.4-1.4 1.6-.2.3-.5.3-.9.1-.5-.2-2-.7-3.7-2.3-1.4-1.2-2.3-2.7-2.5-3.1-.3-.4 0-.7.2-.9.2-.2.5-.5.7-.8.2-.2.3-.4.4-.7.1-.3.1-.6 0-.8-.2-.3-1-2.4-1.4-3.3Z" fill="#16a34a"/>
      </>
    ),
  },

  /* ── Projectes ── */
  projects: {
    bg: 'linear-gradient(150deg,#0a3b46,#06222a)',
    shadowColor: 'rgba(10,59,70,.5)',
    icon: (
      <>
        <g opacity=".55"><path d="M21 7 33 13 21 19 9 13 21 7Z" fill="#22d3a5"/></g>
        <g opacity=".8"><path d="M21 13 33 19 21 25 9 19 21 13Z" fill="#1de589"/></g>
        <path d="M21 19 33 25 21 31 9 25 21 19Z" fill="#5cffb0"/>
        <path d="M9 25 21 31V19L9 25Z" fill="#0c9466"/>
        <path d="M33 25 21 31V19L33 25Z" fill="#0a7d56"/>
        <path d="M21 19 33 25 21 31 9 25 21 19Z" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth=".8" strokeLinejoin="round"/>
      </>
    ),
  },

  /* ── Sobre mi ── */
  about: {
    bg: 'radial-gradient(circle at 50% 45%,#c89bff,#7c3aed 55%,#3b1a82 100%)',
    shadowColor: 'rgba(124,58,237,.4)',
    icon: (
      <>
        <circle cx="21" cy="21" r="14" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
        <circle cx="21" cy="21" r="9.5" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1"/>
        <circle cx="21" cy="17" r="4.4" fill="#fff"/>
        <path d="M13.5 30c1.2-4 4-6.2 7.5-6.2s6.3 2.2 7.5 6.2" fill="#fff"/>
      </>
    ),
  },

  /* ── Skills ── */
  skills: {
    bg: 'linear-gradient(150deg,#7dd3fc,#0284c7 60%,#075985)',
    shadowColor: 'rgba(2,132,199,.4)',
    icon: (
      <>
        <g stroke="rgba(255,255,255,.4)" strokeWidth="1" strokeLinecap="round">
          <line x1="21" y1="5" x2="21" y2="9"/>
          <line x1="21" y1="33" x2="21" y2="37"/>
          <line x1="5" y1="21" x2="9" y2="21"/>
          <line x1="33" y1="21" x2="37" y2="21"/>
        </g>
        <path d="M23 9 13 23h7l-2 10 12-15h-7l2-9Z" fill="#fff" style={{ filter:'drop-shadow(0 0 5px rgba(255,255,255,.5))' }}/>
      </>
    ),
  },

  /* ── Contacte ── */
  contact: {
    bg: 'linear-gradient(150deg,#fdba74,#ea580c 60%,#9a3412)',
    shadowColor: 'rgba(234,88,12,.4)',
    svgProps: { fill: 'none', stroke: '#fff', strokeLinecap: 'round' },
    icon: (
      <>
        <circle cx="21" cy="24" r="3.2" fill="#fff" stroke="none"/>
        <path d="M15 18a8.5 8.5 0 0 1 12 0" strokeWidth="1.8" opacity=".9"/>
        <path d="M11.5 14.5a13.5 13.5 0 0 1 19 0" strokeWidth="1.6" opacity=".55"/>
        <path d="M8 11a18.5 18.5 0 0 1 26 0" strokeWidth="1.4" opacity=".3"/>
      </>
    ),
  },

  /* ── Arxius ── */
  files: {
    bg: 'linear-gradient(150deg,#5eead4,#0d9488 60%,#0f5f57)',
    shadowColor: 'rgba(13,148,136,.4)',
    icon: (
      <>
        <path d="M8 14a2 2 0 0 1 2-2h6l2.5 3H32a2 2 0 0 1 2 2v3H8V14Z" fill="rgba(255,255,255,.5)"/>
        <path d="M9 19h24l-2.2 12.2a2 2 0 0 1-2 1.6H13.2a2 2 0 0 1-2-1.6L9 19Z" fill="#fff"/>
        <path d="M9 19h24l-.4 2.2H9.4L9 19Z" fill="rgba(13,148,136,.3)"/>
      </>
    ),
  },

  /* ── Terminal ── */
  terminal: {
    bg: 'linear-gradient(150deg,#13241c,#070f0b)',
    shadowColor: 'rgba(34,211,165,.25)',
    extra: (
      <>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:'radial-gradient(ellipse 70% 55% at 50% 45%,rgba(34,211,165,.18),transparent 70%)' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:'repeating-linear-gradient(0deg,rgba(34,211,165,.10) 0 1px,transparent 1px 3px)' }} />
      </>
    ),
    svgProps: {
      fill: 'none', stroke: '#22d3a5', strokeWidth: '2.4',
      strokeLinecap: 'round', strokeLinejoin: 'round',
      style: { filter: 'drop-shadow(0 0 4px rgba(34,211,165,.8))' },
    },
    icon: (
      <>
        <path d="M13 15 19 21 13 27"/>
        <line x1="22" y1="27" x2="30" y2="27"/>
      </>
    ),
  },

  /* ── Joc ── */
  game: {
    bg: 'linear-gradient(150deg,#fca5a5,#dc2626 58%,#7f1d1d)',
    shadowColor: 'rgba(220,38,38,.4)',
    icon: (
      <>
        <path d="M14 15h14a6.5 6.5 0 0 1 6.5 6.5v1A5.2 5.2 0 0 1 25 25.8l-.6-.8a3 3 0 0 0-2.4-1.1h-2a3 3 0 0 0-2.4 1.1l-.6.8A5.2 5.2 0 0 1 7.5 22.5v-1A6.5 6.5 0 0 1 14 15Z" fill="#fff"/>
        <rect x="12.4" y="19.4" width="4.4" height="1.5" rx=".7" fill="#dc2626"/>
        <rect x="13.85" y="17.9" width="1.5" height="4.4" rx=".7" fill="#dc2626"/>
        <circle cx="27" cy="20" r="1.5" fill="#dc2626"/>
        <circle cx="30" cy="22.5" r="1.5" fill="#dc2626"/>
      </>
    ),
  },

  /* ── Ajustos ── */
  settings: {
    bg: 'conic-gradient(from 200deg at 50% 50%,#cbd5e1,#64748b,#334155,#cbd5e1)',
    shadowColor: 'rgba(100,116,139,.4)',
    extra: (
      <div style={{ position:'absolute', zIndex:2, inset:14, borderRadius:'50%', border:'1px dashed rgba(255,255,255,.25)', pointerEvents:'none' }} />
    ),
    icon: (
      <>
        <circle cx="21" cy="21" r="6.5" fill="none" stroke="#fff" strokeWidth="2"/>
        <circle cx="21" cy="21" r="2" fill="#fff"/>
        <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <line x1="21" y1="9" x2="21" y2="13"/>
          <line x1="21" y1="29" x2="21" y2="33"/>
          <line x1="9" y1="21" x2="13" y2="21"/>
          <line x1="29" y1="21" x2="33" y2="21"/>
        </g>
      </>
    ),
  },

  /* ── Experiència ── */
  experience: {
    bg: 'linear-gradient(150deg,#a5b4fc,#4f46e5 60%,#312e81)',
    shadowColor: 'rgba(79,70,229,.4)',
    icon: (
      <>
        <path d="M16 14v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <rect x="8" y="14" width="26" height="19" rx="3" fill="#fff"/>
        <path d="M8 22h26" stroke="rgba(79,70,229,.35)" strokeWidth="1.5"/>
        <rect x="18.5" y="20.5" width="5" height="3.4" rx="1.2" fill="#4f46e5"/>
      </>
    ),
  },

  /* ── Educació ── */
  education: {
    bg: 'linear-gradient(150deg,#6ee7b7,#059669 60%,#065f46)',
    shadowColor: 'rgba(5,150,105,.4)',
    icon: (
      <>
        <path d="M21 11 35 17 21 23 7 17 21 11Z" fill="#fff"/>
        <path d="M13 20v6c0 2 3.6 3.6 8 3.6s8-1.6 8-3.6v-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M35 17v7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="35" cy="25.5" r="1.6" fill="#fff"/>
      </>
    ),
  },

  /* ── Navegador / Browser ── */
  browser: {
    bg: 'radial-gradient(circle at 36% 30%,#93c5fd,#2563eb 55%,#1e3a8a 100%)',
    shadowColor: 'rgba(37,99,235,.4)',
    svgProps: { fill: 'none', stroke: 'rgba(255,255,255,.85)', strokeWidth: '1.4' },
    icon: (
      <>
        <circle cx="21" cy="21" r="13"/>
        <ellipse cx="21" cy="21" rx="5.5" ry="13"/>
        <line x1="8" y1="21" x2="34" y2="21"/>
        <path d="M10 15.5h22M10 26.5h22" opacity=".6"/>
      </>
    ),
  },
};

/* ── Component ── */
interface Props {
  app: string;
  size?: number;
}

export default function AppIcon({ app, size = 60 }: Props) {
  const config = ICON_CONFIG[app];
  if (!config) return null;

  const r       = Math.round(size * 0.275);      // squircle radius ~27.5%
  const iconSz  = Math.round(size * 0.525);      // SVG icon ~52.5% of container
  const sh1     = Math.round(size * 0.125);      // shadow offset-y
  const sh2     = Math.round(size * 0.35);       // shadow blur
  const inSh    = Math.round(size * 0.075);      // inner shadow

  const { fill, stroke, strokeWidth, strokeLinecap, strokeLinejoin, style: svgStyle } = config.svgProps ?? {};

  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: config.bg,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: [
        `0 ${sh1}px ${sh2}px rgba(0,0,0,.5)`,
        `0 1px 0 rgba(255,255,255,.12) inset`,
        `0 -${inSh}px ${inSh * 2}px rgba(0,0,0,.35) inset`,
        `0 0 0 .5px rgba(255,255,255,.06)`,
        `0 ${sh1}px ${Math.round(size * 0.3)}px ${config.shadowColor}`,
      ].join(', '),
    }}>
      {/* App-specific extras (gloss, scan lines, rings, etc.) */}
      {config.extra}

      {/* Top-left light source — mix-blend-mode: screen */}
      <div style={{
        position:'absolute', inset:0, zIndex:4, pointerEvents:'none',
        background:'radial-gradient(circle at 28% 18%, rgba(255,255,255,.38), rgba(255,255,255,.06) 38%, transparent 62%)',
        mixBlendMode:'screen',
      }} />

      {/* Fine top sheen line */}
      <div style={{
        position:'absolute', top:0, left:'16%', right:'16%', height:1,
        zIndex:5, pointerEvents:'none',
        background:'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)',
      }} />

      {/* Icon SVG */}
      <svg
        viewBox="0 0 42 42"
        style={{ width: iconSz, height: iconSz, position:'relative', zIndex:3, ...svgStyle }}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        aria-hidden="true"
      >
        {config.icon}
      </svg>
    </div>
  );
}

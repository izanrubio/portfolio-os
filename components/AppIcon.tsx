'use client';

interface IconConfig {
  bg: string;
  shadowColor: string;
  /** Path under /public (e.g. '/icons/foo.png'). When set, renders <img> instead of SVG. */
  image?: string;
  extra?: React.ReactNode;
  svgProps?: {
    fill?: string; stroke?: string; strokeWidth?: string;
    strokeLinecap?: 'round' | 'butt' | 'square';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    style?: React.CSSProperties;
  };
  icon?: React.ReactNode;
}

const ICON_CONFIG: Record<string, IconConfig> = {
  /* ── Missatges / Chat — real icon ── */
  chat: {
    bg: '#fff',
    shadowColor: 'rgba(22,163,74,.4)',
    image: '/icons/app-missatges.png',
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

  /* ── Arxius — real icon ── */
  files: {
    bg: '#fff',
    shadowColor: 'rgba(0,122,255,.4)',
    image: '/icons/app-arxius.png',
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

  /* ── Ajustos — real icon ── */
  settings: {
    bg: '#e5e5ea',
    shadowColor: 'rgba(100,116,139,.4)',
    image: '/icons/app-ajustos.png',
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

  /* ── Navegador / Browser — real icon ── */
  browser: {
    bg: '#fff',
    shadowColor: 'rgba(0,122,255,.4)',
    image: '/icons/app-navegador.png',
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
      {config.image ? (
        /* ── Real PNG icon — fills container, contained within squircle ── */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={config.image}
          alt={app}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{
            width: '100%', height: '100%',
            objectFit: 'contain',
            position: 'relative', zIndex: 3,
            display: 'block',
          }}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

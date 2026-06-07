'use client';

export default function VirtualBoxIcon() {
  return (
    <div style={{
      width: 60, height: 60, borderRadius: 13,
      background: 'linear-gradient(150deg,#1e2a3a,#0a0f1e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.10) inset, 0 0 0 .5px rgba(255,255,255,.06)',
    }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,245,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,.05) 1px, transparent 1px)', backgroundSize: '8px 8px', opacity: .5 }} />
      {/* VBox-style stacked rectangles */}
      <svg viewBox="0 0 42 42" style={{ width: 30, height: 30, position: 'relative', zIndex: 2 }}>
        {/* Back screen */}
        <rect x="6" y="10" width="24" height="17" rx="2.5" fill="none" stroke="rgba(0,245,255,.4)" strokeWidth="1.4"/>
        {/* Back monitor stand */}
        <path d="M14 27v3h8v-3" stroke="rgba(0,245,255,.3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Front screen — offset */}
        <rect x="12" y="15" width="24" height="17" rx="2.5" fill="rgba(0,20,30,.9)" stroke="#00f5ff" strokeWidth="1.5"/>
        {/* Screen content: terminal cursor */}
        <text x="16" y="27" fontFamily="monospace" fontSize="7" fill="#00ff41" opacity=".9">&gt;_</text>
        {/* Running indicator dot */}
        <circle cx="33" cy="17" r="2" fill="#00ff41" style={{ filter: 'drop-shadow(0 0 3px #00ff41)' }}/>
      </svg>
      {/* Light source */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 28% 18%, rgba(255,255,255,.22), transparent 55%)', mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 3 }} />
    </div>
  );
}

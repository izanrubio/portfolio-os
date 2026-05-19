export default function FilesIcon() {
  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="48" height="48" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="fl-bg" x1="0" y1="0" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#06212a"/>
          <stop offset="100%" stopColor="#020c12"/>
        </linearGradient>
        <linearGradient id="fl-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0e7fa3"/>
          <stop offset="100%" stopColor="#075b75"/>
        </linearGradient>
        <linearGradient id="fl-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#22d3ee"/>
          <stop offset="50%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#0891b2"/>
        </linearGradient>
        <linearGradient id="fl-front-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(255,255,255,.45)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <radialGradient id="fl-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%"  stopColor="rgba(6,182,212,0.14)"/>
          <stop offset="100%" stopColor="rgba(6,182,212,0)"/>
        </radialGradient>
      </defs>

      {/* Container */}
      <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#fl-bg)"/>
      <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#fl-glow)"/>
      <rect x="0.5" y="0.5" width="55" height="55" rx="13.5" fill="none" stroke="rgba(255,255,255,.05)"/>

      {/* Folder back with tab */}
      <path d="
        M 9 17
        Q 9 14, 12 14
        L 22 14
        L 25.5 17.5
        L 44 17.5
        Q 47 17.5, 47 20.5
        L 47 41
        Q 47 44, 44 44
        L 12 44
        Q 9 44, 9 41
        Z" fill="url(#fl-back)"
      />

      {/* Folder front */}
      <path d="
        M 9 21
        Q 9 19, 11 19
        L 45 19
        Q 47 19, 47 21
        L 47 41
        Q 47 44, 44 44
        L 12 44
        Q 9 44, 9 41
        Z" fill="url(#fl-front)"
      />

      {/* Glossy highlight */}
      <path d="
        M 10 21
        Q 10 20, 11 20
        L 45 20
        Q 46 20, 46 21
        L 46 28
        Q 28 31, 10 28 Z" fill="url(#fl-front-hi)" opacity=".55"
      />

      {/* Files peeking out */}
      <rect x="14" y="11" width="10" height="5" rx="1.2" fill="rgba(255,255,255,.18)"/>
      <rect x="26" y="9"  width="8"  height="5" rx="1.2" fill="rgba(255,255,255,.12)"/>

      {/* File lines inside */}
      <rect x="15" y="33" width="14" height="1.5" rx="0.75" fill="rgba(255,255,255,.35)"/>
      <rect x="15" y="37" width="22" height="1.5" rx="0.75" fill="rgba(255,255,255,.25)"/>
      <rect x="15" y="41" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,.18)"/>

      {/* Bottom edge shadow */}
      <rect x="9" y="42.5" width="38" height="1.5" rx="0.75" fill="rgba(0,0,0,.18)"/>
    </svg>
  );
}

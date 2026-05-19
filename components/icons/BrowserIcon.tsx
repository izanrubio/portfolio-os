export default function BrowserIcon() {
  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
      <defs>
        <linearGradient id="br-bg" x1="0" y1="0" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d1530"/>
          <stop offset="100%" stopColor="#05091a"/>
        </linearGradient>
        <radialGradient id="br-globe" cx="38%" cy="32%" r="75%">
          <stop offset="0%"  stopColor="#5eb8ff"/>
          <stop offset="35%" stopColor="#2563eb"/>
          <stop offset="75%" stopColor="#5b21b6"/>
          <stop offset="100%" stopColor="#1e0a47"/>
        </radialGradient>
        <radialGradient id="br-globe-hi" cx="32%" cy="22%" r="35%">
          <stop offset="0%"  stopColor="rgba(255,255,255,.55)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <linearGradient id="br-flame" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffd24a"/>
          <stop offset="35%"  stopColor="#ff8a00"/>
          <stop offset="70%"  stopColor="#ff3a00"/>
          <stop offset="100%" stopColor="#b30000"/>
        </linearGradient>
        <linearGradient id="br-flame-hi" x1="0" y1="0" x2="0" y2="56">
          <stop offset="0%"  stopColor="rgba(255,236,170,.85)"/>
          <stop offset="55%" stopColor="rgba(255,140,0,0)"/>
        </linearGradient>
        <radialGradient id="br-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="rgba(255,122,0,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,122,0,0)"/>
        </radialGradient>
      </defs>

      {/* Container */}
      <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#br-bg)"/>
      <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#br-glow)"/>
      <rect x="0.5" y="0.5" width="55" height="55" rx="13.5" fill="none" stroke="rgba(255,255,255,.06)"/>

      {/* Globe */}
      <circle cx="28" cy="28" r="14.5" fill="url(#br-globe)"/>
      <ellipse cx="28" cy="28" rx="14.5" ry="6" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".5"/>
      <ellipse cx="28" cy="28" rx="6" ry="14.5" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth=".5"/>
      <circle cx="28" cy="28" r="14.5" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth=".5"/>
      <circle cx="28" cy="28" r="14.5" fill="url(#br-globe-hi)"/>

      {/* Flame */}
      <path d="
        M 41 11
        C 49 13, 52 22, 47 30
        C 51 26, 53 22, 51 16
        C 52 22, 50 28, 45 32
        C 49 32, 52 30, 53 27
        C 52 36, 44 44, 33 45
        C 28 45.5, 23 44, 20 41
        C 25 42, 30 40, 33 36
        C 28 38, 22 37, 19 33
        C 25 32, 30 28, 31 22
        C 32 27, 35 30, 39 30
        C 37 24, 38 17, 43 14
        C 42 12, 41.5 11.5, 41 11 Z"
        fill="url(#br-flame)"
      />
      <path d="
        M 42 13
        C 47 16, 49 22, 45 28
        C 47 22, 46 18, 43 16
        C 43.5 14, 42.5 13.5, 42 13 Z"
        fill="url(#br-flame-hi)" opacity=".75"
      />
      <circle cx="40" cy="42" r="1.2" fill="#ffd24a" opacity=".9"/>
    </svg>
  );
}

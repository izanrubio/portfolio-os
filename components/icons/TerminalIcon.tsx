export default function TerminalIcon() {
  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
      <defs>
        <linearGradient id="tm-bg" x1="0" y1="0" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#0a0d14"/>
          <stop offset="100%" stopColor="#04060b"/>
        </linearGradient>
        <linearGradient id="tm-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#161a26"/>
          <stop offset="100%" stopColor="#0b0e16"/>
        </linearGradient>
        <linearGradient id="tm-title" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2a3045"/>
          <stop offset="100%" stopColor="#1a1f2e"/>
        </linearGradient>
        <radialGradient id="tm-glow" cx="50%" cy="70%" r="55%">
          <stop offset="0%"  stopColor="rgba(0,255,136,.16)"/>
          <stop offset="100%" stopColor="rgba(0,255,136,0)"/>
        </radialGradient>
        <pattern id="tm-scan" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="2" height="1" fill="rgba(0,255,136,.05)"/>
        </pattern>
      </defs>

      {/* Container */}
      <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#tm-bg)"/>
      <rect x="0.5" y="0.5" width="55" height="55" rx="13.5" fill="none" stroke="rgba(0,255,136,.08)"/>

      {/* Window */}
      <rect x="7" y="10" width="42" height="36" rx="4" fill="url(#tm-window)" stroke="rgba(255,255,255,.06)" strokeWidth="0.5"/>

      {/* Title bar */}
      <path d="M 7 14 Q 7 10, 11 10 L 45 10 Q 49 10, 49 14 L 49 17 L 7 17 Z" fill="url(#tm-title)"/>

      {/* Traffic lights */}
      <circle cx="11"   cy="13.5" r="1.3" fill="#ff5f57"/>
      <circle cx="14.6" cy="13.5" r="1.3" fill="#ffbd2e"/>
      <circle cx="18.2" cy="13.5" r="1.3" fill="#27c93f"/>

      {/* Screen glow + scanlines */}
      <rect x="7" y="17" width="42" height="29" fill="url(#tm-glow)"/>
      <rect x="7" y="17" width="42" height="29" fill="url(#tm-scan)" opacity=".7"/>

      {/* Prompt > */}
      <text x="11" y="29" fontSize="7" fill="#00ff88" fontFamily="JetBrains Mono, ui-monospace, monospace" fontWeight="700"
        style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,136,.7))' }}>
        &gt;
      </text>

      {/* Blinking caret */}
      <rect x="16" y="26" width="4" height="1.4" fill="#00ff88" opacity=".95">
        <animate attributeName="opacity" values="0.95;0.15;0.95" dur="1s" repeatCount="indefinite"/>
      </rect>

      {/* Typed text lines */}
      <text x="11" y="38" fontSize="5" fill="rgba(0,255,136,.55)" fontFamily="JetBrains Mono, ui-monospace, monospace">
        izan@kali
      </text>
      <text x="32" y="38" fontSize="5" fill="rgba(0,255,136,.35)" fontFamily="JetBrains Mono, ui-monospace, monospace">
        :~$
      </text>

      {/* Screen inner frame */}
      <rect x="7" y="17" width="42" height="29" fill="none" stroke="rgba(0,255,136,.08)" strokeWidth="0.5"/>
    </svg>
  );
}

'use client';

interface Props {
  size?: number;
  glow?: boolean;
}

export default function IzanLogo({ size = 32, glow = false }: Props) {
  const id = `izHexGrad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={glow ? { filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.6))' } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#b400ff" />
        </linearGradient>
      </defs>
      <polygon
        points="28,2 52,15 52,41 28,54 4,41 4,15"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x="28"
        y="33"
        textAnchor="middle"
        fontFamily="Orbitron, sans-serif"
        fontSize="13"
        fontWeight="900"
        fill={`url(#${id})`}
      >
        IZ
      </text>
    </svg>
  );
}

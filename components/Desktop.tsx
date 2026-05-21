'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface DesktopProps {
  children: React.ReactNode;
}

export default function Desktop({ children }: DesktopProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg        = dark ? '#000000'         : '#f0f4ff';
  const blend     = dark ? 'screen' as const : 'multiply' as const;
  const b1        = dark ? 'rgba(0,255,102,0.12)'  : 'rgba(0,201,122,0.12)';
  const b2        = dark ? 'rgba(0,102,255,0.10)'  : 'rgba(124,58,237,0.08)';
  const b3        = dark ? 'rgba(0,255,255,0.08)'  : 'rgba(0,102,255,0.06)';

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: bg, paddingTop: '28px', paddingBottom: '100px', transition: 'background-color 400ms ease' }}
    >
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Blob 1 — top-left */}
        <div className="aurora-blob" style={{
          position: 'absolute',
          width: '60vw', height: '60vw',
          top: '-20vw', left: '-15vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b1}, transparent 65%)`,
          filter: 'blur(120px)',
          mixBlendMode: blend,
          animation: 'aurora-drift-1 20s ease-in-out infinite alternate',
          willChange: 'transform',
        }} />
        {/* Blob 2 — bottom-right */}
        <div className="aurora-blob" style={{
          position: 'absolute',
          width: '65vw', height: '65vw',
          bottom: '-25vw', right: '-20vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b2}, transparent 65%)`,
          filter: 'blur(120px)',
          mixBlendMode: blend,
          animation: 'aurora-drift-2 25s ease-in-out infinite alternate-reverse',
          willChange: 'transform',
        }} />
        {/* Blob 3 — center */}
        <div className="aurora-blob" style={{
          position: 'absolute',
          width: '45vw', height: '45vw',
          top: '50%', left: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b3}, transparent 65%)`,
          filter: 'blur(120px)',
          mixBlendMode: blend,
          animation: 'aurora-pulse-3 15s ease-in-out infinite alternate',
          willChange: 'transform',
        }} />
      </div>

      {/* Window content layer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

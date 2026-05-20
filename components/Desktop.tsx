'use client';

interface DesktopProps {
  children: React.ReactNode;
}

export default function Desktop({ children }: DesktopProps) {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#000', paddingTop: '28px', paddingBottom: '100px' }}>
      {/* Aurora blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Blob 1 — green, top-left */}
        <div style={{
          position: 'absolute',
          width: '60vw', height: '60vw',
          top: '-20vw', left: '-15vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,102,0.32), transparent 65%)',
          filter: 'blur(120px)',
          mixBlendMode: 'screen',
          animation: 'aurora-drift-1 20s ease-in-out infinite alternate',
          willChange: 'transform',
        }} />
        {/* Blob 2 — blue, bottom-right */}
        <div style={{
          position: 'absolute',
          width: '65vw', height: '65vw',
          bottom: '-25vw', right: '-20vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,255,0.28), transparent 65%)',
          filter: 'blur(120px)',
          mixBlendMode: 'screen',
          animation: 'aurora-drift-2 25s ease-in-out infinite alternate-reverse',
          willChange: 'transform',
        }} />
        {/* Blob 3 — cyan, center */}
        <div style={{
          position: 'absolute',
          width: '45vw', height: '45vw',
          top: '50%', left: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.18), transparent 65%)',
          filter: 'blur(120px)',
          mixBlendMode: 'screen',
          animation: 'aurora-pulse-3 15s ease-in-out infinite alternate',
          willChange: 'transform',
        }} />
        {/* Film grain */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.07, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }} />
      </div>

      {/* Window content layer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

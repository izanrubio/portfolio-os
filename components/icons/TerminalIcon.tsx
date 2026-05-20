export default function TerminalIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 16px -4px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.14)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,136,.5))' }}>
        <path d="M5 8l4 4-4 4"/>
        <path d="M12 17h7"/>
      </svg>
    </div>
  );
}

export default function ContactIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #ff6b00 0%, #ff9500 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <path d="M21 12.5A8.5 8.5 0 1 1 12.5 4"/>
        <path d="M21 4v6h-6"/>
        <path d="M3.5 9.5 12 14l8.5-4.5"/>
      </svg>
    </div>
  );
}

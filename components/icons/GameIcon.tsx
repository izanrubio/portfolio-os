export default function GameIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #ff4757 0%, #ff6b35 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <rect x="3" y="8" width="18" height="10" rx="4"/>
        <path d="M8 12v3M6.5 13.5h3"/>
        <circle cx="15.5" cy="12.5" r=".8" fill="currentColor"/>
        <circle cx="17" cy="14" r=".8" fill="currentColor"/>
      </svg>
    </div>
  );
}

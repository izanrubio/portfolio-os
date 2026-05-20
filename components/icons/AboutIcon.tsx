export default function AboutIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #7b2ff7 0%, #a855f7 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7"/>
      </svg>
    </div>
  );
}

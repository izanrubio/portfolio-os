export default function SkillsIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>
      </svg>
    </div>
  );
}

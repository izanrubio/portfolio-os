export default function EducationIcon() {
  return (
    <div style={{
      width: '60px', height: '60px', borderRadius: '16px',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff',
      boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <path d="M22 10 12 5 2 10l10 5 10-5z"/>
        <path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/>
      </svg>
    </div>
  );
}

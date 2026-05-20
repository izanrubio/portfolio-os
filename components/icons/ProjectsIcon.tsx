export default function ProjectsIcon() {
  return (
    <div
      style={{
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #00c97a 0%, #00ff9d 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.2)',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))' }}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M8 13h8M8 17h5"/>
      </svg>
    </div>
  );
}

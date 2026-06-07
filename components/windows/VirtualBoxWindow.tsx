'use client';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';
const CYAN  = '#00f5ff';
const TERM  = '#00ff41';

const vmIconSVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <path d="M5 8 9 5l4 3-4 3-4-3Z"/><path d="M9 11v6"/>
    <circle cx="16" cy="14" r="3.5"/><path d="M16 10.5v3.5"/>
  </svg>
);

interface Spec { label: string; value: React.ReactNode; icon: React.ReactNode; }

const SPECS: { group: string; rows: Spec[] }[] = [
  {
    group: 'Sistema',
    rows: [
      { label: 'OS Guest',    value: 'Kali Linux 2026.1 · 6.1.0-kali', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg> },
      { label: 'Procesador',  value: <span>2 vCPU <span style={{ color: 'rgba(255,255,255,.4)' }}>· VT-x</span></span>, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg> },
      { label: 'Memoria RAM', value: '4096 MB', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 7v10M11 7v10M15 7v10"/></svg> },
    ],
  },
  {
    group: 'Almacenamiento',
    rows: [
      { label: 'Disco',       value: <span>izanos-vuln.vdi · 40 GB <span style={{ color: 'rgba(255,255,255,.4)' }}>(dynamic)</span></span>, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12a8 3 0 0 0 16 0V6"/></svg> },
      { label: 'Controlador', value: <span>SATA · AHCI</span>, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg> },
    ],
  },
  {
    group: 'Red & Audio',
    rows: [
      { label: 'Network', value: <span>Host-Only <span style={{ color: 'rgba(255,255,255,.4)' }}>· 192.168.56.0/24</span></span>, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/></svg> },
      { label: 'Audio',   value: <span>Intel HD <span style={{ color: 'rgba(255,255,255,.4)' }}>· deshabilitado</span></span>, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg> },
    ],
  },
];

interface Props {
  vmIsRunning: boolean;
  onStartVM: () => void;
}

export default function VirtualBoxWindow({ vmIsRunning, onStartVM }: Props) {
  const stateDot: React.CSSProperties = {
    width: 6, height: 6, borderRadius: '50%',
    background: vmIsRunning ? '#28c840' : '#ff5f57',
    boxShadow: vmIsRunning ? '0 0 6px #28c840' : '0 0 6px #ff5f57',
    flexShrink: 0,
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#0d0d0d', fontFamily: INTER, color: '#f0f4ff', fontSize: 13 }}>
      {/* Toolbar */}
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', background: '#111118', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        {(['New','Settings'] as const).map(label => (
          <button key={label} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 14px', borderRadius: 8, cursor: 'default', color: 'rgba(255,255,255,.4)', background: 'none', border: '1px solid transparent', fontFamily: INTER, fontSize: 11, fontWeight: 500 }}>
            {label === 'New' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.2V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 19.4 9H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>}
            {label}
          </button>
        ))}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.08)', margin: '0 6px' }} />
        <button
          onClick={onStartVM}
          disabled={vmIsRunning}
          style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 14px', borderRadius: 8, cursor: vmIsRunning ? 'default' : 'pointer', color: vmIsRunning ? 'rgba(0,255,65,.4)' : TERM, background: vmIsRunning ? 'rgba(0,255,65,.04)' : 'none', border: `1px solid ${vmIsRunning ? 'rgba(0,255,65,.15)' : 'transparent'}`, fontFamily: INTER, fontSize: 11, fontWeight: 500, transition: 'all .15s' }}
          onMouseEnter={e => { if (!vmIsRunning) (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,65,.08)'; }}
          onMouseLeave={e => { if (!vmIsRunning) (e.currentTarget as HTMLElement).style.background = 'none'; }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}><path d="M8 5v14l11-7z"/></svg>
          {vmIsRunning ? 'Running' : 'Start'}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex">
        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0, background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,.06)', padding: '14px 0' }}>
          <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0 16px 10px' }}>
            Máquinas Virtuales
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, margin: '0 8px', padding: '11px 12px', borderRadius: 9, cursor: 'pointer', background: 'rgba(0,245,255,.08)', border: '1px solid rgba(0,245,255,.2)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(150deg,#1a1a1a,#0a0a0a)', border: '1px solid rgba(0,245,255,.3)' }}>
              {vmIconSVG}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>IzanOS-Vulnerable-v1.0</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.45)', marginTop: 3 }}>
                <span style={stateDot} />
                {vmIsRunning ? 'Running' : 'Powered Off'}
              </div>
            </div>
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex-1 min-w-0 overflow-y-auto" style={{ padding: '22px 26px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,245,255,.25) transparent' }}>
          {/* Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(150deg,#1a1a1a,#080808)', border: '1px solid rgba(0,245,255,.25)', padding: 10 }}>
              {vmIconSVG}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', fontFamily: INTER }}>IzanOS-Vulnerable-v1.0</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 5 }}>
                <span style={stateDot} />
                {vmIsRunning ? 'Running' : 'Powered Off'} · Kali Linux (64-bit)
              </div>
            </div>
          </div>

          {/* Specs */}
          {SPECS.map(({ group, rows }) => (
            <div key={group} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: CYAN, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10, opacity: .8 }}>{group}</div>
              {rows.map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,.6)', width: 140, flexShrink: 0 }}>
                    <span style={{ width: 15, height: 15, color: 'rgba(255,255,255,.4)', display: 'flex', alignItems: 'center' }}>
                      {icon}
                    </span>
                    {label}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: '#fff' }}>{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

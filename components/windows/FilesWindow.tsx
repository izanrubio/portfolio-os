'use client';

import { useState, useRef } from 'react';
import { FileNode } from '@/types/windows';
import { filesystem } from '@/data/content';

const MONO = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

/* ── Sidebar structure ── */
type NavItem = { label: string; path: string[]; active?: boolean };
type SidebarGroup = { title: string; items: NavItem[] };

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: 'Places',
    items: [
      { label: 'Home',      path: [] },
      { label: 'Documents', path: ['Documents'] },
      { label: 'Downloads', path: ['Downloads'] },
      { label: 'Pictures',  path: ['Pictures'] },
    ],
  },
  {
    title: 'Bookmarks',
    items: [
      { label: '~/code/projects', path: ['Documents', 'Projects'] },
      { label: 'Downloads',       path: ['Downloads'] },
    ],
  },
  {
    title: 'Devices',
    items: [
      { label: 'kali-rootfs · 512 GB', path: [] },
    ],
  },
];

/* ── Icons per sidebar item ── */
const NAV_ICONS: Record<string, React.ReactElement> = {
  Home: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>,
  Documents: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Downloads: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Pictures: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  '~/code/projects': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  'kali-rootfs · 512 GB': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>,
};

/* ── Helper to navigate the filesystem tree ── */
function getNodeAtPath(root: FileNode, path: string[]): FileNode {
  let node = root;
  for (const seg of path) {
    const child = node.children?.find(c => c.name === seg);
    if (!child) return root;
    node = child;
  }
  return node;
}

/* ── File icon SVGs by extension / type ── */
function FileIcon({ node }: { node: FileNode }) {
  if (node.type === 'folder') {
    return (
      <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id="fc-fold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee"/>
            <stop offset="100%" stopColor="#0891b2"/>
          </linearGradient>
        </defs>
        <path d="M 5 17 Q 5 14, 8 14 L 20 14 L 24 18 L 48 18 Q 51 18, 51 21 L 51 44 Q 51 47, 48 47 L 8 47 Q 5 47, 5 44 Z" fill="url(#fc-fold)"/>
        <rect x="5" y="20" width="46" height="3" fill="rgba(255,255,255,.15)" rx="1"/>
      </svg>
    );
  }

  const name = node.name.toLowerCase();

  if (name.endsWith('.pdf')) return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <path d="M 12 8 L 36 8 L 46 18 L 46 48 Q 46 50, 44 50 L 12 50 Q 10 50, 10 48 L 10 10 Q 10 8, 12 8 Z" fill="#1a1d2e" stroke="rgba(255,71,87,.4)" strokeWidth="1.2"/>
      <path d="M 36 8 L 36 18 L 46 18 Z" fill="#0d0f1a"/>
      <rect x="17" y="32" width="22" height="3" rx="1" fill="#ff4757"/>
      <text x="28" y="44" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="700" fill="#ff4757">PDF</text>
    </svg>
  );

  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg')) return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="10" width="40" height="36" rx="3" fill="#1a1d2e" stroke="rgba(124,58,237,.4)" strokeWidth="1.2"/>
      <circle cx="19" cy="20" r="3" fill="#c4b5fd" opacity=".8"/>
      <path d="M 10 40 L 22 28 L 32 36 L 40 30 L 46 38 L 46 44 L 10 44 Z" fill="#7c3aed" opacity=".7"/>
    </svg>
  );

  if (name.endsWith('.sh') || name.endsWith('.bash')) return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="10" width="40" height="36" rx="3" fill="#0a0d14" stroke="rgba(0,255,136,.4)" strokeWidth="1.2"/>
      <text x="14" y="28" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#00ff88">&gt;_</text>
      <rect x="14" y="32" width="18" height="1.5" fill="rgba(0,255,136,.4)"/>
      <rect x="14" y="36" width="26" height="1.5" fill="rgba(0,255,136,.3)"/>
    </svg>
  );

  /* generic URL / link file */
  if (node.action?.type === 'browser') return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="20" fill="#0a0e1c" stroke="rgba(0,212,255,.4)" strokeWidth="1.5"/>
      <ellipse cx="28" cy="28" rx="20" ry="8" fill="none" stroke="rgba(0,212,255,.4)" strokeWidth="1.2"/>
      <ellipse cx="28" cy="28" rx="8" ry="20" fill="none" stroke="rgba(0,212,255,.4)" strokeWidth="1.2"/>
      <line x1="8" y1="28" x2="48" y2="28" stroke="rgba(0,212,255,.4)" strokeWidth="1.2"/>
    </svg>
  );

  /* generic file */
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <path d="M 12 8 L 36 8 L 46 18 L 46 48 Q 46 50, 44 50 L 12 50 Q 10 50, 10 48 L 10 10 Q 10 8, 12 8 Z" fill="#1a1d2e" stroke="rgba(0,212,255,.2)" strokeWidth="1.2"/>
      <path d="M 36 8 L 36 18 L 46 18 Z" fill="#0d0f1a"/>
      <rect x="18" y="30" width="20" height="1.5" rx="0.75" fill="rgba(0,212,255,.3)"/>
      <rect x="18" y="35" width="14" height="1.5" rx="0.75" fill="rgba(0,212,255,.2)"/>
    </svg>
  );
}

interface FilesWindowProps {
  onOpenBrowser: (url: string) => void;
}

export default function FilesWindow({ onOpenBrowser }: FilesWindowProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [activeSidebar, setActiveSidebar] = useState('Home');
  const lastClickRef = useRef<{ name: string; time: number } | null>(null);

  const currentNode = getNodeAtPath(filesystem, currentPath);
  const children = currentNode.children ?? [];

  const navigateTo = (path: string[], sidebarLabel?: string) => {
    setCurrentPath(path);
    if (sidebarLabel) setActiveSidebar(sidebarLabel);
  };

  const activateNode = (node: FileNode, pathTo: string[]) => {
    if (node.type === 'folder') { navigateTo(pathTo); return; }
    if (!node.action) return;
    const { type, payload } = node.action;
    if (type === 'browser' && payload) onOpenBrowser(payload);
    else if (type === 'download' && payload) {
      const a = document.createElement('a');
      a.href = payload; a.download = node.name; a.click();
    } else if (type === 'preview' && payload) {
      globalThis.open(payload, '_blank');
    }
  };

  const handleItemClick = (node: FileNode, pathTo: string[]) => {
    const now = Date.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) { activateNode(node, pathTo); return; }
    if (lastClickRef.current?.name === node.name && now - lastClickRef.current.time < 400) {
      activateNode(node, pathTo);
      lastClickRef.current = null;
    } else {
      lastClickRef.current = { name: node.name, time: now };
    }
  };

  const breadcrumbParts = ['~', ...currentPath];

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0b0d16' }}>
      {/* Sidebar */}
      <aside
        className="shrink-0 flex flex-col overflow-y-auto"
        style={{ width: '190px', background: 'rgba(6,8,16,0.6)', borderRight: '1px solid rgba(0,212,255,0.08)' }}
      >
        {SIDEBAR_GROUPS.map((group, gi) => (
          <div key={group.title}>
            {gi > 0 && (
              <div style={{ height: '1px', background: 'rgba(0,212,255,0.06)', margin: '4px 0' }} />
            )}
            <div
              style={{ fontFamily: MONO, fontSize: '9px', color: '#4a5568', letterSpacing: '0.18em', padding: '10px 14px 4px', textTransform: 'uppercase' }}
            >
              {group.title}
            </div>
            {group.items.map(item => {
              const active = activeSidebar === item.label;
              const icon = NAV_ICONS[item.label];
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.path, item.label)}
                  className="w-full text-left flex items-center gap-2"
                  style={{
                    padding: '7px 12px',
                    margin: '1px 6px',
                    width: 'calc(100% - 12px)',
                    background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: active ? '#f0f4ff' : '#8892a4',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; e.currentTarget.style.color = '#f0f4ff'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8892a4'; } }}
                >
                  <span style={{ color: active ? '#00d4ff' : 'inherit', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontFamily: MONO, fontSize: '11.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar breadcrumb */}
        <div
          className="flex items-center shrink-0"
          style={{ padding: '8px 16px', background: 'rgba(6,8,16,0.4)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}
        >
          <div className="flex items-center flex-1 gap-1">
            {breadcrumbParts.map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const path = currentPath.slice(0, i);
                    navigateTo(path, i === 0 ? 'Home' : part);
                  }}
                  style={{
                    fontFamily: MONO, fontSize: '12px',
                    color: i === breadcrumbParts.length - 1 ? '#00d4ff' : '#aab3c3',
                    fontWeight: i === breadcrumbParts.length - 1 ? 600 : 400,
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                    borderRadius: '4px', transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {part}
                </button>
                {i < breadcrumbParts.length - 1 && (
                  <span style={{ color: '#4a5568', fontSize: '11px' }}>/</span>
                )}
              </span>
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em' }}>
            VIEW · GRID
          </span>
        </div>

        {/* File grid */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
          {children.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: '12px', color: '#4a5568', padding: '8px' }}>
              Empty folder
            </p>
          ) : (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
            >
              {children.map(node => {
                const nodePath = [...currentPath, node.name];
                const ext = node.name.includes('.') ? node.name.split('.').pop()?.toUpperCase() : null;
                const sublbl = node.type === 'folder' ? 'FOLDER' : ext ?? 'FILE';
                return (
                  <button
                    key={node.name}
                    onClick={() => handleItemClick(node, nodePath)}
                    className="flex flex-col items-center text-center rounded-xl"
                    style={{
                      padding: '12px 8px 10px',
                      background: 'transparent',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      gap: '8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(0,212,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FileIcon node={node} />
                    <div>
                      <div
                        style={{
                          fontFamily: MONO, fontSize: '11px', color: '#f0f4ff',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                          wordBreak: 'break-all', lineHeight: 1.3,
                        }}
                      >
                        {node.name}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: '9.5px', color: '#4a5568', marginTop: '2px', letterSpacing: '0.08em' }}>
                        {sublbl}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '6px 16px',
            background: 'rgba(6,8,16,0.5)',
            borderTop: '1px solid rgba(0,212,255,0.07)',
            fontFamily: MONO, fontSize: '11px', color: '#4a5568',
          }}
        >
          <div className="flex items-center gap-3">
            <span>{children.length} items</span>
            {children.filter(c => c.type === 'folder').length > 0 && (
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
                  borderRadius: '50px', padding: '2px 8px', color: '#8892a4',
                }}
              >
                <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor" style={{ color: '#00d4ff' }}>
                  <circle cx="4" cy="4" r="3"/>
                </svg>
                {children.filter(c => c.type === 'folder').length} folder{children.filter(c => c.type === 'folder').length !== 1 ? 's' : ''}, {children.filter(c => c.type === 'file').length} file{children.filter(c => c.type === 'file').length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div>~/IzanOS</div>
        </div>
      </div>
    </div>
  );
}

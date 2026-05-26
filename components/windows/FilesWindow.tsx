'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { filesystem } from '@/data/content';
import { FileNode } from '@/types/windows';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';
const ACCENT = '#00d4ff';

const TYPE_ACCENT: Record<string, string> = {
  folder: '#06b6d4',
  url:    '#00d4ff',
  pdf:    '#ff4757',
  png:    '#7c3aed',
  readme: '#ff9500',
};

function hexToRgba(hex: string, a: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function sortChildren(children: FileNode[]): FileNode[] {
  return [...children].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (b.type === 'folder' && a.type !== 'folder') return 1;
    return a.name.localeCompare(b.name);
  });
}

function getChildren(root: FileNode, path: string[]): FileNode[] {
  let node = root;
  for (const seg of path) {
    const child = node.children?.find(c => c.name === seg);
    if (!child) return [];
    node = child;
  }
  return sortChildren(node.children ?? []);
}

/* ── File icons (inline SVG, matches reference sprite) ── */
function FolderIcon() {
  return (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.4))' }}>
      <defs>
        <linearGradient id="fi-fback" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#075985"/></linearGradient>
        <linearGradient id="fi-ffront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
        <linearGradient id="fi-fhi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,.4)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/></linearGradient>
      </defs>
      <path d="M 5 16 Q 5 13, 8 13 L 21 13 L 26 17 L 48 17 Q 51 17, 51 20 L 51 42 Q 51 45, 48 45 L 8 45 Q 5 45, 5 42 Z" fill="url(#fi-fback)"/>
      <path d="M 5 21 Q 5 19, 7 19 L 49 19 Q 51 19, 51 21 L 51 42 Q 51 45, 48 45 L 8 45 Q 5 45, 5 42 Z" fill="url(#fi-ffront)"/>
      <path d="M 6 22 Q 6 21, 7 21 L 49 21 Q 50 21, 50 22 L 50 27 Q 28 30, 6 27 Z" fill="url(#fi-fhi)" opacity=".5"/>
    </svg>
  );
}

function UrlIcon() {
  return (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.4))' }}>
      <defs>
        <radialGradient id="fi-urg" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#67e8f9"/><stop offset="55%" stopColor="#0891b2"/><stop offset="100%" stopColor="#082f49"/>
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="18" fill="url(#fi-urg)"/>
      <ellipse cx="28" cy="28" rx="18" ry="7" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1"/>
      <ellipse cx="28" cy="28" rx="7" ry="18" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1"/>
      <ellipse cx="28" cy="22" rx="14.5" ry="3.5" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth=".7"/>
      <ellipse cx="28" cy="34" rx="14.5" ry="3.5" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth=".7"/>
      <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="6" fill="rgba(255,255,255,.18)"/>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.4))' }}>
      <defs>
        <linearGradient id="fi-pgbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff7a86"/><stop offset="100%" stopColor="#ff4757"/></linearGradient>
      </defs>
      <path d="M 12 6 L 38 6 L 50 18 L 50 50 Q 50 52, 48 52 L 12 52 Q 10 52, 10 50 L 10 8 Q 10 6, 12 6 Z" fill="url(#fi-pgbg)"/>
      <path d="M 38 6 L 38 18 L 50 18 Z" fill="rgba(0,0,0,.25)"/>
      <path d="M 12 6 L 38 6 L 12 10 Z" fill="rgba(255,255,255,.25)"/>
      <rect x="16" y="32" width="28" height="11" rx="2" fill="rgba(0,0,0,.35)"/>
      <text x="30" y="40" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill="#fff" letterSpacing=".15em">PDF</text>
    </svg>
  );
}

function PngIcon() {
  return (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.4))' }}>
      <defs>
        <linearGradient id="fi-igbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#6b21a8"/></linearGradient>
      </defs>
      <rect x="6" y="10" width="44" height="36" rx="4" fill="url(#fi-igbg)"/>
      <circle cx="40" cy="22" r="3.5" fill="rgba(255,255,255,.55)"/>
      <path d="M 10 40 L 22 26 L 32 36 L 40 30 L 50 40 L 50 46 L 6 46 L 6 44 Z" fill="rgba(0,0,0,.35)"/>
      <path d="M 6 40 L 18 28 L 28 36 L 6 46 Z" fill="rgba(255,255,255,.18)"/>
      <rect x="6.5" y="10.5" width="43" height="35" rx="3.5" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
    </svg>
  );
}

function ReadmeIcon() {
  return (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.4))' }}>
      <defs>
        <linearGradient id="fi-rgbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffb86b"/><stop offset="100%" stopColor="#ff9500"/></linearGradient>
      </defs>
      <rect x="6" y="10" width="44" height="36" rx="5" fill="url(#fi-rgbg)"/>
      <rect x="6" y="10" width="44" height="8" rx="5" fill="rgba(0,0,0,.2)"/>
      <circle cx="11" cy="14" r="1.2" fill="rgba(255,255,255,.65)"/>
      <circle cx="15" cy="14" r="1.2" fill="rgba(255,255,255,.5)"/>
      <circle cx="19" cy="14" r="1.2" fill="rgba(255,255,255,.35)"/>
      <rect x="11" y="23" width="18" height="2" rx="1" fill="rgba(255,255,255,.85)"/>
      <rect x="11" y="28" width="28" height="2" rx="1" fill="rgba(255,255,255,.6)"/>
      <rect x="11" y="33" width="22" height="2" rx="1" fill="rgba(255,255,255,.5)"/>
      <rect x="11" y="38" width="14" height="2" rx="1" fill="rgba(255,255,255,.4)"/>
    </svg>
  );
}

function getFileIcon(node: FileNode): React.ReactNode {
  switch (node.type) {
    case 'folder': return <FolderIcon />;
    case 'url':    return <UrlIcon />;
    case 'pdf':    return <PdfIcon />;
    case 'png':    return <PngIcon />;
    case 'readme': return <ReadmeIcon />;
    default:
      if (node.action?.type === 'browser') return <UrlIcon />;
      if (node.name.endsWith('.pdf')) return <PdfIcon />;
      if (node.name.endsWith('.png')) return <PngIcon />;
      return <PdfIcon />;
  }
}

/* ── Sidebar config ── */
interface SidebarItem { label: string; path: string[]; icon: React.ReactNode; select?: string; }

const SB_ICON = {
  home:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></svg>,
  doc:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  pic:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  dl:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
};

const SIDEBAR_CONFIG: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Places',
    items: [
      { label: 'Home',      path: [],                       icon: SB_ICON.home   },
      { label: 'Documents', path: ['Documents'],             icon: SB_ICON.doc    },
      { label: 'Pictures',  path: ['Pictures'],              icon: SB_ICON.pic    },
      { label: 'Downloads', path: ['Downloads'],             icon: SB_ICON.dl     },
    ],
  },
  {
    title: 'Bookmarks',
    items: [
      { label: 'Projects', path: ['Documents', 'Projects'], icon: SB_ICON.folder },
      { label: 'CV',       path: ['Documents'],             icon: SB_ICON.doc, select: 'IzanRubio_CV.pdf' },
    ],
  },
];

/* ── Toolbar button ── */
function TbBtn({ onClick, disabled, children, active }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '26px', height: '26px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '6px', background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
        border: 'none', color: disabled ? 'rgba(255,255,255,0.18)' : active ? ACCENT : 'rgba(255,255,255,0.5)',
        cursor: disabled ? 'default' : 'pointer', transition: 'background .15s, color .15s',
      }}
      onMouseEnter={e => { if (!disabled && !active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (!disabled && !active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
    >
      {children}
    </button>
  );
}

interface FilesWindowProps {
  onOpenBrowser: (url: string) => void;
}

export default function FilesWindow({ onOpenBrowser }: FilesWindowProps) {
  const [nav,        setNav]        = useState({ stack: [['Documents', 'Projects']] as string[][], idx: 0 });
  const [selName,    setSelName]    = useState<string | null>(null);
  const [viewMode,   setViewMode]   = useState<'grid' | 'list'>('grid');
  const [readmeFile, setReadmeFile] = useState<string | null>(null);
  const [previewFile,setPreviewFile]= useState<{ name: string; path: string } | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; kind: string } | null>(null);
  const [fading,     setFading]     = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clickRef   = useRef<{ name: string; time: number } | null>(null);

  const currentPath = nav.stack[nav.idx];
  const children    = getChildren(filesystem, currentPath);
  const canBack     = nav.idx > 0;
  const canFwd      = nav.idx < nav.stack.length - 1;

  const navigate = (path: string[], select?: string) => {
    setNav(prev => {
      if (JSON.stringify(prev.stack[prev.idx]) === JSON.stringify(path)) return prev;
      const newStack = [...prev.stack.slice(0, prev.idx + 1), path];
      return { stack: newStack, idx: newStack.length - 1 };
    });
    setSelName(select ?? null);
    setFading(true);
    setTimeout(() => setFading(false), 100);
  };

  const goBack = () => {
    if (!canBack) return;
    setNav(prev => ({ ...prev, idx: prev.idx - 1 }));
    setSelName(null);
    setFading(true);
    setTimeout(() => setFading(false), 100);
  };

  const goForward = () => {
    if (!canFwd) return;
    setNav(prev => ({ ...prev, idx: prev.idx + 1 }));
    setSelName(null);
    setFading(true);
    setTimeout(() => setFading(false), 100);
  };

  const showToast = (msg: string, kind: string) => {
    setToast({ msg, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const openItem = (node: FileNode) => {
    if (node.type === 'folder') {
      navigate([...currentPath, node.name]);
    } else if (node.type === 'url') {
      onOpenBrowser(node.url ?? '');
      showToast(`Opening ${node.name} in browser.exe…`, 'url');
    } else if (node.type === 'pdf') {
      window.open(node.path ?? '/cv.pdf', '_blank');
      showToast(`⬇ Downloading ${node.name}…`, 'pdf');
    } else if (node.type === 'png') {
      setPreviewFile({ name: node.name, path: node.path ?? '' });
    } else if (node.type === 'readme') {
      setReadmeFile(node.name.replace('.readme', ''));
    } else if (node.action?.type === 'browser' && node.action.payload) {
      onOpenBrowser(node.action.payload);
      showToast(`Opening ${node.name}…`, 'url');
    } else if (node.action?.type === 'download' && node.action.payload) {
      window.open(node.action.payload, '_blank');
      showToast(`⬇ Downloading ${node.name}…`, 'pdf');
    }
  };

  const handleClick = (node: FileNode) => {
    const now = Date.now();
    if (clickRef.current?.name === node.name && now - clickRef.current.time < 400) {
      openItem(node);
      clickRef.current = null;
    } else {
      setSelName(node.name);
      clickRef.current = { name: node.name, time: now };
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setReadmeFile(null); setPreviewFile(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pathStr = currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');

  /* ── Shared grid/list item render ── */
  const renderGridItem = (node: FileNode) => {
    const accent     = TYPE_ACCENT[node.type] ?? '#fff';
    const isSelected = selName === node.name;
    return (
      <div
        key={node.name}
        onClick={() => handleClick(node)}
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px', padding: '14px 10px 12px',
          borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
          border: isSelected ? '1px solid rgba(0,212,255,0.35)' : '1px solid transparent',
          background: isSelected ? 'rgba(0,212,255,0.08)' : 'transparent',
          boxShadow: isSelected ? '0 0 0 1px rgba(0,212,255,0.4), 0 0 18px rgba(0,212,255,0.2)' : 'none',
          transition: 'background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        }}
        onMouseEnter={e => {
          if (isSelected) return;
          e.currentTarget.style.background   = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor  = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform    = 'scale(1.03)';
          e.currentTarget.style.boxShadow    = `0 10px 24px -10px rgba(0,0,0,.6), 0 0 0 1px ${hexToRgba(accent,.30)}, 0 0 16px ${hexToRgba(accent,.25)}`;
          const iw = e.currentTarget.querySelector('.fi-iconwrap') as HTMLElement | null;
          if (iw) iw.style.transform = 'rotateZ(-3deg) translateY(-2px)';
        }}
        onMouseLeave={e => {
          if (isSelected) return;
          e.currentTarget.style.background  = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform   = 'scale(1)';
          e.currentTarget.style.boxShadow   = 'none';
          const iw = e.currentTarget.querySelector('.fi-iconwrap') as HTMLElement | null;
          if (iw) iw.style.transform = 'none';
        }}
      >
        <div className="fi-iconwrap" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .25s ease' }}>
          {getFileIcon(node)}
        </div>
        <div style={{ fontFamily: INTER, fontSize: '12px', fontWeight: 500, color: isSelected ? '#fff' : 'rgba(255,255,255,0.8)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', wordBreak: 'break-word', maxWidth: '100%' }}>
          {node.name}
        </div>
      </div>
    );
  };

  const renderListItem = (node: FileNode) => {
    const accent     = TYPE_ACCENT[node.type] ?? '#fff';
    const isSelected = selName === node.name;
    return (
      <div
        key={node.name}
        onClick={() => handleClick(node)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
          border: isSelected ? '1px solid rgba(0,212,255,0.35)' : '1px solid transparent',
          background: isSelected ? 'rgba(0,212,255,0.08)' : 'transparent',
          transition: 'background .15s',
        }}
        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ width: '22px', height: '22px', flexShrink: 0 }}>{getFileIcon(node)}</div>
        <span style={{ fontFamily: INTER, fontSize: '13px', color: isSelected ? '#fff' : 'rgba(255,255,255,0.8)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '10px', color: hexToRgba(accent, 0.65), textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {node.type}
        </span>
      </div>
    );
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: 'rgba(8,8,12,0.92)', boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.08)', position: 'relative' }}
    >
      {/* ── Toolbar ── */}
      <div style={{ height: '40px', flexShrink: 0, background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px' }}>
        <TbBtn onClick={goBack}    disabled={!canBack}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><polyline points="15 18 9 12 15 6"/></svg></TbBtn>
        <TbBtn onClick={goForward} disabled={!canFwd}><svg  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><polyline points="9 18 15 12 9 6"/></svg></TbBtn>

        {/* Breadcrumb */}
        <div style={{ flex: 1, minWidth: 0, marginLeft: '8px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', fontFamily: MONO, fontSize: '11px', height: '26px', display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {['Home', ...currentPath].map((seg, i, arr) => {
            const isLast = i === arr.length - 1;
            const targetPath = currentPath.slice(0, i);
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                <span
                  onClick={() => !isLast && navigate(targetPath)}
                  className={isLast ? 'crumb-current' : 'crumb-seg'}
                  style={{ color: isLast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', cursor: isLast ? 'default' : 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => { if (!isLast) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                  onMouseLeave={e => { if (!isLast) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >{seg}</span>
                {!isLast && <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 6px' }}>/</span>}
              </span>
            );
          })}
        </div>

        {/* Right buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <TbBtn onClick={() => setViewMode('grid')} active={viewMode === 'grid'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          </TbBtn>
          <TbBtn onClick={() => setViewMode('list')} active={viewMode === 'list'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>
          </TbBtn>
          <TbBtn>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'14px',height:'14px'}}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </TbBtn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{ width: '180px', flexShrink: 0, background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 0', overflowY: 'auto' }}>
          {SIDEBAR_CONFIG.map((group, gi) => (
            <div key={group.title} style={{ marginBottom: '14px' }}>
              {gi === 1 && <div style={{ height: '1px', margin: '0 16px 10px', background: 'rgba(255,255,255,0.05)' }} />}
              <div style={{ padding: '0 16px', marginBottom: '6px', fontFamily: MONO, fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {group.title}
              </div>
              {group.items.map(item => {
                const isActive = JSON.stringify(item.path) === JSON.stringify(currentPath);
                return (
                  <div
                    key={item.label}
                    onClick={() => navigate(item.path, item.select)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '9px',
                      margin: '0 8px', padding: '8px 10px', borderRadius: '6px',
                      borderLeft: `2px solid ${isActive ? ACCENT : 'transparent'}`,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                      background: isActive ? 'rgba(0,212,255,0.10)' : 'transparent',
                      fontFamily: INTER, fontSize: '13px', cursor: 'pointer',
                      transition: 'background .15s, color .15s, border-color .15s',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; } }}
                  >
                    <span style={{ width: '14px', flexShrink: 0, color: isActive ? ACCENT : 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.01)', padding: '20px', overflowY: 'auto' }}>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignContent: 'start', opacity: fading ? 0 : 1, transition: fading ? 'opacity .1s ease' : 'opacity .15s ease' }}>
              {children.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)', fontFamily: INTER, fontSize: '14px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px', color: 'rgba(255,255,255,0.2)', display: 'block', margin: '0 auto 14px' }}>
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  Esta carpeta está vacía
                </div>
              ) : children.map(renderGridItem)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: fading ? 0 : 1, transition: fading ? 'opacity .1s ease' : 'opacity .15s ease' }}>
              {children.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)', fontFamily: INTER, fontSize: '14px' }}>Esta carpeta está vacía</div>
              ) : children.map(renderListItem)}
            </div>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ height: '32px', flexShrink: 0, background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: MONO, fontSize: '11px' }}>
        <div style={{ color: 'rgba(255,255,255,0.3)' }}>
          <b style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{children.length}</b>
          {' '}{children.length === 1 ? 'elemento' : 'elementos'}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)' }}>{pathStr}</div>
      </div>

      {/* ── README modal ── */}
      {readmeFile && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setReadmeFile(null); }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div style={{ background: 'rgba(15,15,25,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '28px 28px 24px', width: '360px', boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,149,0,0.1)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: MONO, fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '999px', color: '#ff9500', background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.4)', marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff9500', boxShadow: '0 0 8px #ff9500', animation: 'fiWipDot 1.5s ease-in-out infinite', display: 'inline-block', flexShrink: 0 }} />
              En desarrollo
            </div>
            <h3 style={{ fontFamily: INTER, fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.015em', marginBottom: '8px' }}>{readmeFile}</h3>
            <p style={{ fontFamily: INTER, fontSize: '13.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '22px' }}>
              Este proyecto está en desarrollo. Disponible próximamente.
            </p>
            <button
              onClick={() => setReadmeFile(null)}
              style={{ padding: '9px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', fontFamily: INTER, fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', transition: 'background .15s, color .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* ── Image preview modal ── */}
      {previewFile && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setPreviewFile(null); }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div style={{ background: 'rgba(15,15,25,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(124,58,237,0.18)', maxWidth: '480px', width: '100%' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 6px #7c3aed', display: 'inline-block' }} />
                {previewFile.name}
              </span>
              <span
                onClick={() => setPreviewFile(null)}
                style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', transition: 'background .15s, color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4 L12 12 M12 4 L4 12"/></svg>
              </span>
            </div>
            <div style={{ position: 'relative', width: '480px', height: '320px', background: '#04060c', overflow: 'hidden' }}>
              <Image
                src={previewFile.path}
                alt={previewFile.name}
                fill
                style={{ objectFit: 'cover', filter: 'grayscale(100%)' }}
              />
              <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'color', background: 'linear-gradient(135deg, rgba(0,212,255,0.45), transparent 50%, rgba(124,58,237,0.55))' }} />
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)', padding: '10px 16px', background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', backdropFilter: 'blur(12px)', color: 'rgba(255,255,255,0.85)', fontFamily: MONO, fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', zIndex: 60, display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 12px 30px rgba(0,0,0,.5)', animation: 'fiSlideUp .25s cubic-bezier(.16,1,.3,1)', whiteSpace: 'nowrap' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: toast.kind === 'pdf' ? '#ff4757' : ACCENT, boxShadow: `0 0 8px ${toast.kind === 'pdf' ? '#ff4757' : ACCENT}`, display: 'inline-block', flexShrink: 0 }} />
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fiWipDot  { 50% { opacity: .35; transform: scale(.7); } }
        @keyframes fiSlideUp { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}

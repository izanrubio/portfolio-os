'use client';

import { useState, useRef } from 'react';
import { FileNode } from '@/types/windows';
import { filesystem } from '@/data/content';

const MONO = 'var(--font-jetbrains), monospace';

type SidebarItem = { label: string; icon: string; path: string[] };

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Home', icon: '🏠', path: [] },
  { label: 'Documents', icon: '📄', path: ['Documents'] },
  { label: 'Pictures', icon: '🖼️', path: ['Pictures'] },
  { label: 'Downloads', icon: '⬇️', path: ['Downloads'] },
  { label: 'Trash', icon: '🗑️', path: ['Trash'] },
];

function getNodeAtPath(root: FileNode, path: string[]): FileNode {
  let node = root;
  for (const segment of path) {
    const child = node.children?.find(c => c.name === segment);
    if (!child) return root;
    node = child;
  }
  return node;
}

interface FilesWindowProps {
  onOpenBrowser: (url: string) => void;
}

export default function FilesWindow({ onOpenBrowser }: FilesWindowProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selected, setSidebarSelected] = useState<string>('Home');
  const lastClickRef = useRef<{ name: string; time: number } | null>(null);

  const currentNode = getNodeAtPath(filesystem, currentPath);
  const children = currentNode.children ?? [];

  const navigateTo = (path: string[], sidebarLabel?: string) => {
    setCurrentPath(path);
    if (sidebarLabel) setSidebarSelected(sidebarLabel);
  };

  const handleItemClick = (node: FileNode, pathTo: string[]) => {
    const now = Date.now();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
      activateNode(node, pathTo);
      return;
    }

    if (lastClickRef.current?.name === node.name && now - lastClickRef.current.time < 400) {
      activateNode(node, pathTo);
      lastClickRef.current = null;
    } else {
      lastClickRef.current = { name: node.name, time: now };
    }
  };

  const activateNode = (node: FileNode, pathTo: string[]) => {
    if (node.type === 'folder') {
      navigateTo(pathTo);
      return;
    }

    if (!node.action) return;

    const { type, payload } = node.action;

    if (type === 'browser' && payload) {
      onOpenBrowser(payload);
    } else if (type === 'download' && payload) {
      const a = document.createElement('a');
      a.href = payload;
      a.download = node.name;
      a.click();
    } else if (type === 'preview' && payload) {
      globalThis.open(payload, '_blank');
    }
  };

  const breadcrumbParts = ['Home', ...currentPath];

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0d1117' }}>
      {/* Sidebar */}
      <div
        className="flex flex-col shrink-0 overflow-y-auto"
        style={{ width: '180px', background: '#080c18', borderRight: '1px solid #1a2332' }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: '10px',
            color: '#00d4ff',
            letterSpacing: '0.2em',
            padding: '16px 16px 8px',
          }}
        >
          FILES
        </p>

        {SIDEBAR_ITEMS.map(item => {
          const active = selected === item.label;
          return (
            <button
              key={item.label}
              onClick={() => navigateTo(item.path, item.label)}
              className="flex items-center gap-2 px-3 py-2 mx-2 mb-0.5 rounded-lg text-left transition-colors duration-100"
              style={{
                fontFamily: MONO,
                fontSize: '12px',
                color: active ? '#f0f4ff' : '#8892a4',
                background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#1a2332'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-1 px-4 py-2 shrink-0"
          style={{ background: '#0a0f1a', borderBottom: '1px solid #1a2332' }}
        >
          {breadcrumbParts.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              <button
                onClick={() => {
                  const path = breadcrumbParts.slice(1, i + 1);
                  navigateTo(path, i === 0 ? 'Home' : part);
                }}
                style={{ fontFamily: MONO, fontSize: '12px', color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {part}
              </button>
              {i < breadcrumbParts.length - 1 && (
                <span style={{ color: '#4a5568', fontSize: '10px' }}>/</span>
              )}
            </span>
          ))}
        </div>

        {/* Files grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {children.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: '12px', color: '#4a5568', padding: '16px' }}>
              Empty folder
            </p>
          ) : (
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
            >
              {children.map(node => {
                const nodePath = [...currentPath, node.name];
                return (
                  <button
                    key={node.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-150 group"
                    style={{ background: 'transparent', border: '1px solid transparent', cursor: 'pointer' }}
                    onClick={() => handleItemClick(node, nodePath)}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>
                      {node.icon ?? (node.type === 'folder' ? '📁' : '📄')}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: '11px',
                        color: '#f0f4ff',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        wordBreak: 'break-all',
                        lineHeight: 1.3,
                      }}
                    >
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

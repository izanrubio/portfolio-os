'use client';

import { useState } from 'react';
import { projects } from '@/data/content';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const STACK_COLOR: Record<string, string> = {
  'Next.js': '#00d4ff', 'React': '#00d4ff', 'Alpine.js': '#00d4ff', 'TypeScript': '#00d4ff',
  'Node.js': '#7c3aed', 'Laravel': '#7c3aed', 'PHP': '#7c3aed', 'PostgreSQL': '#7c3aed',
  'Prisma': '#7c3aed', 'MySQL': '#7c3aed', 'Express': '#7c3aed',
  'WebSockets': '#00ff88', 'Python': '#00ff88',
  'Stripe': '#ff9500', 'Redis': '#ff9500', 'Docker': '#ff9500',
  'Tailwind CSS': '#ec4899', 'Framer Motion': '#ec4899',
};

export default function ProjectsWindow() {
  const [activeIdx, setActiveIdx] = useState(0);
  const proj = projects[activeIdx];

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0b0d16' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 overflow-y-auto"
        style={{ width: '200px', background: 'rgba(6,8,16,0.7)', borderRight: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: '18px 16px 12px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}
        >
          <span style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.15em' }}>
            ~/projects
          </span>
          <span
            style={{
              fontFamily: MONO, fontSize: '11px', color: '#4a5568',
              background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
              borderRadius: '4px', padding: '1px 6px',
            }}
          >
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {projects.map((p, idx) => {
          const active = idx === activeIdx;
          return (
            <button
              key={p.slug}
              onClick={() => setActiveIdx(idx)}
              className="w-full text-left flex items-center gap-3"
              style={{
                padding: '12px 16px',
                background: active ? 'rgba(0,212,255,0.06)' : 'transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,212,255,0.03)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; } }}
            >
              <span style={{ fontFamily: MONO, fontSize: '10px', color: active ? '#00d4ff' : '#4a5568', minWidth: '20px' }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: INTER, fontSize: '13px', color: active ? '#f0f4ff' : '#8892a4', fontWeight: active ? 500 : 400 }}>
                {p.name}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ padding: '28px 28px 24px' }}>
        <div style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.15em', marginBottom: '14px' }}>
          PROJECT&nbsp;·&nbsp;
          <b style={{ color: '#8892a4' }}>{String(activeIdx + 1).padStart(2, '0')}</b>
          &nbsp;·&nbsp;
          <span style={{ color: '#00d4ff' }}>{proj.category}</span>
        </div>

        <h2
          style={{
            fontFamily: INTER,
            fontSize: '26px',
            fontWeight: 700,
            color: '#f0f4ff',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          {proj.name}<span style={{ color: '#00d4ff' }}>.</span>
        </h2>

        <div
          style={{
            height: '2px',
            width: '42px',
            background: 'linear-gradient(90deg, #00d4ff, transparent)',
            marginBottom: '18px',
            borderRadius: '1px',
          }}
        />

        <p
          style={{
            fontFamily: INTER,
            fontSize: '13.5px',
            color: '#8892a4',
            lineHeight: 1.75,
            marginBottom: '20px',
          }}
        >
          {proj.longDescription}
        </p>

        <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '22px' }}>
          {proj.stack.map(tech => {
            const color = STACK_COLOR[tech] ?? '#aab3c3';
            return (
              <span
                key={tech}
                style={{
                  fontFamily: MONO,
                  fontSize: '11px',
                  color,
                  background: `${color}12`,
                  border: `1px solid ${color}28`,
                  borderRadius: '5px',
                  padding: '3px 10px',
                }}
              >
                {tech}
              </span>
            );
          })}
        </div>

        <div className="flex gap-3" style={{ marginBottom: '28px' }}>
          {proj.demo && (
            <a
              href={proj.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: INTER, fontSize: '12.5px', fontWeight: 600,
                color: '#060810', background: '#00d4ff',
                padding: '8px 18px', borderRadius: '7px',
                textDecoration: 'none', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Open demo <span>→</span>
            </a>
          )}
          {proj.repo && (
            <a
              href={proj.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: INTER, fontSize: '12.5px', fontWeight: 600,
                color: '#f0f4ff', background: 'transparent',
                border: '1px solid rgba(0,212,255,0.25)',
                padding: '8px 18px', borderRadius: '7px',
                textDecoration: 'none', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'; }}
            >
              View code <span>↗</span>
            </a>
          )}
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(0,212,255,0.08)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {[
            {
              lbl: 'Status',
              val: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', display: 'inline-block', flexShrink: 0 }} />
                  {proj.status}
                </span>
              ),
            },
            { lbl: 'Launched', val: <span>{proj.launched}</span> },
            { lbl: 'Repository', val: <span>{proj.repoShort}</span> },
          ].map(({ lbl, val }) => (
            <div
              key={lbl}
              style={{ background: 'rgba(6,8,16,0.8)', padding: '14px 16px' }}
            >
              <div style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '6px' }}>{lbl}</div>
              <div style={{ fontFamily: MONO, fontSize: '12px', color: '#f0f4ff' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

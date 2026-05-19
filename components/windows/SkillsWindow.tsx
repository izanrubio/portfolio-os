'use client';

import { skills, ProficiencyLevel } from '@/data/content';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const PROF_COLOR: Record<ProficiencyLevel, string> = {
  Expert:     '#00d4ff',
  Advanced:   '#00ff88',
  Proficient: '#ff9500',
};

const PROF_FILL: Record<ProficiencyLevel, [number, number, number]> = {
  Expert:     [1, 1, 1],
  Advanced:   [1, 1, 0.25],
  Proficient: [1, 0.25, 0.25],
};

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  languages: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  frontend: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  backend: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14a9 3 0 0 0 18 0V5"/>
      <path d="M3 12a9 3 0 0 0 18 0"/>
    </svg>
  ),
  security: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5z"/>
    </svg>
  ),
  devops: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.3 7A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
};

function ProfBadge({ level }: { level: ProficiencyLevel }) {
  const color = PROF_COLOR[level];
  const fills = PROF_FILL[level];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color }}>
      <span style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
        {fills.map((opacity, i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: '4px',
              height: `${8 + i * 3}px`,
              borderRadius: '2px',
              background: color,
              opacity,
            }}
          />
        ))}
      </span>
      <span style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 600 }}>{level}</span>
    </div>
  );
}

export default function SkillsWindow() {
  const totalTech = skills.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: '#0b0d16', padding: '22px 24px' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}
      >
        <span style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.15em' }}>~/skills</span>
        <span style={{ fontFamily: MONO, fontSize: '11px', color: '#4a5568' }}>
          {skills.length} categories · {totalTech} technologies
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {skills.map(cat => (
          <div
            key={cat.key}
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(0,212,255,0.08)',
              borderRadius: '10px',
              padding: '16px 18px',
            }}
          >
            {/* Category header row */}
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.12)',
                    borderRadius: '8px',
                    color: '#00d4ff',
                    flexShrink: 0,
                  }}
                >
                  {CATEGORY_ICONS[cat.key]}
                </div>
                <div>
                  <div style={{ fontFamily: INTER, fontSize: '14px', fontWeight: 600, color: '#f0f4ff' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568' }}>
                    {cat.items.length} technologies
                  </div>
                </div>
              </div>
              <ProfBadge level={cat.proficiency} />
            </div>

            {/* Skill pills */}
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map(tech => (
                <span
                  key={tech}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontFamily: MONO, fontSize: '12px', color: '#aab3c3',
                    background: 'rgba(0,212,255,0.04)',
                    border: '1px solid rgba(0,212,255,0.1)',
                    borderRadius: '6px',
                    padding: '4px 11px',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(0,212,255,0.5)', display: 'inline-block', flexShrink: 0 }} />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { personal, projects, skills } from '@/data/content';

const INTER = 'var(--font-inter), Inter, sans-serif';
const MONO = 'var(--font-jetbrains), monospace';

export default function PortfolioSite() {
  return (
    <div
      style={{
        background: '#0a0e1a',
        color: '#f0f4ff',
        fontFamily: INTER,
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 flex items-center justify-between px-8 py-4 z-10"
        style={{ background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}
      >
        <span style={{ fontFamily: MONO, fontSize: '13px', color: '#00d4ff', fontWeight: 700 }}>
          {personal.name.split(' ')[0].toLowerCase()}.dev
        </span>
        <div className="flex gap-6">
          {['projects', 'skills', 'contact'].map(s => (
            <a
              key={s}
              href={`#${s}`}
              style={{ fontSize: '13px', color: '#8892a4', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8892a4')}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 flex flex-col items-start max-w-3xl mx-auto">
        <p style={{ fontFamily: MONO, fontSize: '12px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '16px' }}>
          HELLO, WORLD —
        </p>
        <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
          {personal.name}
        </h1>
        <p style={{ fontSize: '20px', color: '#7c3aed', fontWeight: 600, marginBottom: '20px' }}>
          {personal.role}
        </p>
        <p style={{ fontSize: '16px', color: '#8892a4', lineHeight: 1.8, maxWidth: '540px', marginBottom: '32px' }}>
          {personal.bio}
        </p>
        <div className="flex gap-4">
          <a
            href={`mailto:${personal.email}`}
            style={{
              padding: '12px 24px',
              background: '#00d4ff',
              color: '#000',
              fontWeight: 700,
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            Get in touch →
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '12px 24px',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#f0f4ff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-8 py-16 max-w-4xl mx-auto">
        <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '32px' }}>
          SELECTED WORK
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {projects.map(p => (
            <div
              key={p.slug}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: '10px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{p.name}</h3>
              <p style={{ fontSize: '13px', color: '#8892a4', lineHeight: 1.7, marginBottom: '16px' }}>{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.stack.slice(0, 3).map(t => (
                  <span
                    key={t}
                    style={{ fontFamily: MONO, fontSize: '10px', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)', padding: '2px 8px', borderRadius: '3px' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', textDecoration: 'none' }}>
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="px-8 py-16 max-w-4xl mx-auto">
        <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '32px' }}>
          TECH STACK
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(skills).flat().map(tech => (
            <span
              key={tech}
              style={{
                fontFamily: MONO,
                fontSize: '12px',
                color: '#8892a4',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '6px 14px',
                borderRadius: '4px',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-16 max-w-4xl mx-auto">
        <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '24px' }}>
          CONTACT
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Let&apos;s work together.</h2>
        <p style={{ fontSize: '16px', color: '#8892a4', marginBottom: '24px' }}>
          Open to full-time roles and freelance projects.
        </p>
        <a
          href={`mailto:${personal.email}`}
          style={{ fontFamily: MONO, fontSize: '16px', color: '#00d4ff', textDecoration: 'none' }}
        >
          {personal.email}
        </a>
      </section>

      <footer className="px-8 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontFamily: MONO, fontSize: '11px', color: '#4a5568' }}>
          © 2024 Izan Rubio Cerezo — Built with Next.js
        </p>
      </footer>
    </div>
  );
}

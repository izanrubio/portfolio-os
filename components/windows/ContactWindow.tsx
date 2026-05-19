'use client';

import { useState } from 'react';
import { personal } from '@/data/content';

const MONO = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const CONTACT_ITEMS = [
  { label: 'EMAIL', value: personal.email, href: `mailto:${personal.email}` },
  { label: 'GITHUB', value: 'github.com/izanrubio', href: personal.github },
  { label: 'LINKEDIN', value: 'linkedin.com/in/izanrubio', href: personal.linkedin },
];

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle = {
    width: '100%',
    background: '#0a0f1a',
    border: '1px solid #1e2d40',
    borderRadius: '4px',
    padding: '10px 14px',
    color: '#f0f4ff',
    fontFamily: INTER,
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="h-full overflow-y-auto p-5" style={{ background: '#0d1117' }}>
      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '24px' }}>
        ~/CONTACT
      </p>

      {/* Contact items */}
      <div className="flex flex-col">
        {CONTACT_ITEMS.map((item, i) => (
          <div key={item.label}>
            <a
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 group"
            >
              <span
                style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.2em' }}
              >
                {item.label}
              </span>
              <span
                className="transition-colors duration-150"
                style={{
                  fontFamily: MONO,
                  fontSize: '14px',
                  color: '#f0f4ff',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#f0f4ff')}
              >
                {item.value}
              </span>
            </a>
            {i < CONTACT_ITEMS.length - 1 && (
              <div style={{ height: '1px', background: '#1a2332' }} />
            )}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: '#1a2332', margin: '20px 0' }} />

      {/* Form */}
      <div>
        <p style={{ fontFamily: INTER, fontSize: '13px', color: '#8892a4', marginBottom: '16px' }}>
          Send a message
        </p>

        {sent && (
          <div
            className="mb-4 px-4 py-3 rounded"
            style={{
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00ff88',
              fontFamily: MONO,
              fontSize: '12px',
            }}
          >
            Message sent — I&apos;ll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = '#1e2d40')}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = '#1e2d40')}
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            required
            rows={4}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = '#1e2d40')}
          />
          <button
            type="submit"
            className="transition-opacity hover:opacity-85"
            style={{
              width: '100%',
              padding: '11px',
              background: '#00d4ff',
              color: '#000',
              fontFamily: INTER,
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Send →
          </button>
        </form>
      </div>
    </div>
  );
}

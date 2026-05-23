'use client';

import { useState, useMemo } from 'react';
import { personal } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const MONO  = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

const CONTACT_ITEMS_BASE = [
  {
    key: 'email' as const,
    labelKey: 'contact.label.email',
    value: personal.contact.email,
    href: `mailto:${personal.contact.email}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <polyline points="3 7 12 13 21 7"/>
      </svg>
    ),
  },
  {
    key: 'phone',
    labelKey: 'contact.label.phone',
    value: personal.contact.phone,
    href: `tel:${personal.contact.phone}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>
      </svg>
    ),
  },
  {
    key: 'github',
    labelKey: 'contact.label.github',
    value: 'github.com/izanrubio',
    href: personal.contact.github,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
      </svg>
    ),
  },
  {
    key: 'linkedin',
    labelKey: 'contact.label.linkedin',
    value: 'linkedin.com/in/izanrubio',
    href: personal.contact.linkedin,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6h0a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.5c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.8C24 .8 23.2 0 22.2 0z"/>
      </svg>
    ),
  },
  {
    key: 'location',
    labelKey: 'contact.label.location',
    value: personal.location,
    href: undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(0,212,255,0.12)',
  borderRadius: '6px',
  padding: '9px 13px',
  color: '#f0f4ff',
  fontFamily: INTER,
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export default function ContactWindow() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const contactItems = useMemo(
    () => CONTACT_ITEMS_BASE.map(item => ({ ...item, label: t(item.labelKey, lang) })),
    [lang]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="h-full flex overflow-hidden" style={{ background: '#0b0d16' }}>
      {/* Left */}
      <div
        className="flex flex-col shrink-0 overflow-y-auto"
        style={{
          width: '240px',
          padding: '26px 24px',
          background: 'rgba(6,8,16,0.5)',
          borderRight: '1px solid rgba(0,212,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: '11px', color: '#4a5568', letterSpacing: '0.15em', marginBottom: '10px' }}>
          ~/contact
        </div>
        <h2 style={{ fontFamily: INTER, fontSize: '22px', fontWeight: 700, color: '#f0f4ff', marginBottom: '10px' }}>
          {t('contact.heading', lang)}
        </h2>
        <p style={{ fontFamily: INTER, fontSize: '12.5px', color: '#8892a4', lineHeight: 1.65, marginBottom: '22px' }}>
          {t('contact.subheading', lang)}
        </p>

        <div className="flex flex-col gap-1" style={{ marginBottom: '22px' }}>
          {contactItems.map(item => {
            const inner = (
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: '30px', height: '30px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,212,255,0.06)',
                    border: '1px solid rgba(0,212,255,0.12)',
                    borderRadius: '7px',
                    color: '#00d4ff',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: '12px', color: '#aab3c3', wordBreak: 'break-all' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            );
            return item.href ? (
              <a
                key={item.key}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', padding: '8px 0', display: 'block', transition: 'opacity 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {inner}
              </a>
            ) : (
              <div key={item.key} style={{ padding: '8px 0' }}>{inner}</div>
            );
          })}
        </div>

        {/* Social icons */}
        <div className="flex gap-2" style={{ marginBottom: '20px' }}>
          {[
            { href: personal.contact.github, label: 'GitHub', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg> },
            { href: personal.contact.linkedin, label: 'LinkedIn', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6h0a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4z"/></svg> },
            { href: `mailto:${personal.contact.email}`, label: 'Email', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg> },
            { href: `tel:${personal.contact.phone}`, label: 'Phone', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/></svg> },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)',
                borderRadius: '8px', color: '#8892a4',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8892a4'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'; }}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Deco text */}
        <div
          style={{
            position: 'absolute', bottom: '16px', left: '12px', right: '12px',
            fontFamily: INTER, fontWeight: 800, fontSize: '32px',
            color: 'rgba(0,212,255,0.04)',
            letterSpacing: '0.05em',
            pointerEvents: 'none', userSelect: 'none',
            lineHeight: 1,
          }}
        >
          GET IN<br />TOUCH
        </div>
      </div>

      {/* Right: form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ padding: '26px 24px', gap: '0' }}
      >
        <div style={{ fontFamily: MONO, fontSize: '10px', color: '#4a5568', letterSpacing: '0.15em', marginBottom: '18px' }}>
          {t('contact.sendHeader', lang)}
        </div>

        {sent && (
          <div
            style={{
              marginBottom: '14px', padding: '10px 14px',
              background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.25)',
              borderRadius: '6px', color: '#00ff88',
              fontFamily: MONO, fontSize: '12px',
            }}
          >
            {t('contact.form.sent', lang)}
          </div>
        )}

        {[
          { id: 'c-name',    type: 'text',  labelKey: 'contact.form.name',    placeholderKey: 'contact.form.namePlaceholder',    key: 'name' as const    },
          { id: 'c-email',   type: 'email', labelKey: 'contact.form.email',   placeholderKey: 'contact.form.emailPlaceholder',   key: 'email' as const   },
          { id: 'c-subject', type: 'text',  labelKey: 'contact.form.subject', placeholderKey: 'contact.form.subjectPlaceholder', key: 'subject' as const },
        ].map(field => (
          <div key={field.id} style={{ marginBottom: '12px' }}>
            <label
              htmlFor={field.id}
              style={{ display: 'block', fontFamily: MONO, fontSize: '11px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '6px' }}
            >
              {t(field.labelKey, lang)}
            </label>
            <input
              id={field.id}
              type={field.type}
              placeholder={t(field.placeholderKey, lang)}
              value={form[field.key]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              required
              autoComplete="off"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'; }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="c-msg"
            style={{ display: 'block', fontFamily: MONO, fontSize: '11px', color: '#4a5568', letterSpacing: '0.1em', marginBottom: '6px' }}
          >
            {t('contact.form.message', lang)}
          </label>
          <textarea
            id="c-msg"
            placeholder={t('contact.form.msgPlaceholder', lang)}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            required
            rows={5}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'; }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 22px',
            background: '#00d4ff',
            color: '#060810',
            fontFamily: INTER,
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          {t('contact.form.send', lang)} <span>→</span>
        </button>
      </form>
    </div>
  );
}

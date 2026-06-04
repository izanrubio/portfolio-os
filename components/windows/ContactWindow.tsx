'use client';

import { useState, useCallback } from 'react';
import { personal } from '@/data/content';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/data/translations';

const MONO   = 'var(--font-jetbrains), monospace';
const INTER  = 'var(--font-inter), Inter, sans-serif';
const ACCENT = '#00d4ff';
const GREEN  = '#00ff88';

const SENT_BTN: Record<string, string> = { CAS: '✓ ¡Enviado!', CAT: '✓ Enviat!', ENG: '✓ Message sent!' };

type FormKey = 'name' | 'email' | 'subject' | 'message';

const CONTACT_ITEMS = [
  {
    key: 'email',
    label: 'Email',
    value: personal.contact.email,
    href: `mailto:${personal.contact.email}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <polyline points="3 7 12 13 21 7"/>
      </svg>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    value: personal.contact.github.replace('https://', ''),
    href: personal.contact.github,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.4-1.4.8-1.8-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.3 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1 .8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/>
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: personal.contact.linkedin.replace('https://', ''),
    href: personal.contact.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
        <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.7H9.1V9h3.5v1.6h0a3.8 3.8 0 0 1 3.4-1.9c3.7 0 4.4 2.4 4.4 5.6v6zM5 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM6.8 20.4H3.2V9h3.6v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.8v20.5c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.8C24 .8 23.2 0 22.2 0z"/>
      </svg>
    ),
  },
  {
    key: 'phone',
    label: 'Phone',
    value: personal.contact.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
    href: `tel:+34${personal.contact.phone}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    key: 'location',
    label: 'Location',
    value: personal.location,
    href: undefined as string | undefined,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
];

function fieldInputStyle(hasError: boolean, isDark = true): React.CSSProperties {
  return {
    display: 'block', width: '100%',
    padding: '12px 16px', borderRadius: '8px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    border: `1px solid ${hasError ? 'rgba(255,71,87,0.6)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)')}`,
    color: isDark ? '#fff' : '#0f172a', fontFamily: INTER, fontSize: '14px', fontWeight: 500,
    outline: 'none',
    transition: 'border-color .2s ease, box-shadow .2s ease, background .2s ease',
    animation: hasError ? 'contactShake 0.35s ease' : 'none',
  };
}

export default function ContactWindow() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [form, setForm]     = useState<Record<FormKey, string>>({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [errors, setErrors] = useState<Set<FormKey>>(new Set());
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (sent) return;

    const empty = (Object.keys(form) as FormKey[]).filter(k => !form[k].trim());
    if (empty.length > 0) {
      setErrors(new Set(empty));
      setTimeout(() => setErrors(new Set()), 400);
      return;
    }

    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 2000);
  }, [form, sent]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.background  = 'rgba(255,255,255,0.05)';
    e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(0,212,255,0.10)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? 'rgba(255,71,87,0.6)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)');
    e.currentTarget.style.background  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)';
    e.currentTarget.style.boxShadow   = 'none';
  };

  return (
    <div
      className="h-full flex overflow-hidden"
      style={{
        background: isDark ? 'rgba(8,8,12,0.92)' : 'transparent',
        boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.10)',
      }}
    >
      {/* ── LEFT COLUMN ── */}
      <div style={{
        width: '340px', flexShrink: 0,
        background: isDark ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.04)',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
        padding: '40px 32px',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Decorative "GET IN TOUCH" rotated */}
        <div aria-hidden style={{
          position: 'absolute', top: '50%', right: '-180px',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center',
          fontFamily: INTER, fontWeight: 900, fontSize: '86px', lineHeight: 1,
          color: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)', letterSpacing: '-0.04em',
          whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0, userSelect: 'none',
        }}>GET IN TOUCH</div>

        {/* Content above decoration */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ~/CONTACT path */}
          <div style={{
            fontFamily: MONO, fontSize: '10px', color: ACCENT,
            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              border: `1.5px solid ${ACCENT}`, borderRight: 'none', borderTop: 'none',
              transform: 'rotate(-45deg)', flexShrink: 0,
            }} />
            ~/CONTACT
          </div>

          {/* Title */}
          <h1 style={{
            marginTop: '12px', fontFamily: INTER, fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1,
            letterSpacing: '-0.03em', color: isDark ? '#fff' : '#0f172a',
          }}>
            {t('contact.heading', lang).replace('.', '')}<span style={{ color: ACCENT }}>.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: '16px', fontFamily: INTER, fontSize: '14px',
            lineHeight: 1.8, color: isDark ? '#9ba3af' : '#475569', maxWidth: '280px',
          }}>
            {t('contact.subheading', lang)}
          </p>

          {/* Contact items */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column' }}>
            {CONTACT_ITEMS.map((item, idx) => {
              const isLast = idx === CONTACT_ITEMS.length - 1;
              const inner = (
                <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: '14px', alignItems: 'center', padding: '14px 0', borderBottom: isLast ? 'none' : isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.07)' }}>
                  <span style={{ color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ fontFamily: MONO, fontSize: '9px', color: isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px', fontWeight: 600 }}>
                      {item.label}
                    </div>
                    <div className="contact-item-val" style={{ fontFamily: INTER, fontSize: '14px', color: isDark ? '#fff' : '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color .2s ease' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={item.key}
                  href={item.href}
                  target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="contact-item-link"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {inner}
                </a>
              ) : (
                <div key={item.key}>{inner}</div>
              );
            })}
          </div>

          {/* Bottom: response pill + status */}
          <div style={{ marginTop: 'auto', paddingTop: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{
              alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px',
              background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.20)',
              color: GREEN, fontFamily: MONO, fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em',
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '10px', height: '10px', flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(0,255,136,0.6))' }}>
                <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>
              </svg>
              {t('contact.responseTime', lang)}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px',
              fontFamily: MONO, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.85)' : '#1e293b',
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: GREEN, boxShadow: `0 0 8px ${GREEN}, 0 0 16px ${GREEN}`,
                animation: 'contactPulseDot 1.6s ease-in-out infinite',
                flexShrink: 0, display: 'inline-block',
              }} />
              {personal.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{
        flex: 1, minWidth: 0,
        padding: '40px 36px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top hairline */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 30%, rgba(0,212,255,0.4) 70%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* Accent blob */}
        <div style={{
          position: 'absolute', width: '150px', height: '150px',
          top: '-40px', right: '-40px',
          background: `radial-gradient(circle, ${ACCENT}, transparent 60%)`,
          filter: 'blur(40px)', opacity: 0.05,
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Content above blob */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{
            fontFamily: MONO, fontSize: '10px', color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', fontWeight: 600,
          }}>
            {t('contact.sendHeader', lang)}
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {([
              { id: 'ct-name',    key: 'name'    as FormKey, type: 'text',  labelKey: 'contact.form.name',    phKey: 'contact.form.namePlaceholder' },
              { id: 'ct-email',   key: 'email'   as FormKey, type: 'email', labelKey: 'contact.form.email',   phKey: 'contact.form.emailPlaceholder' },
              { id: 'ct-subject', key: 'subject' as FormKey, type: 'text',  labelKey: 'contact.form.subject', phKey: 'contact.form.subjectPlaceholder' },
            ] as const).map(field => (
              <div key={field.id} style={{ marginBottom: '18px' }}>
                <label htmlFor={field.id} style={{ display: 'block', fontFamily: MONO, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                  {t(field.labelKey, lang)}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={t(field.phKey, lang)}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={fieldInputStyle(errors.has(field.key), isDark)}
                  onFocus={handleFocus}
                  onBlur={e => handleBlur(e, errors.has(field.key))}
                />
              </div>
            ))}

            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="ct-msg" style={{ display: 'block', fontFamily: MONO, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.4)' : '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                {t('contact.form.message', lang)}
              </label>
              <textarea
                id="ct-msg"
                placeholder={t('contact.form.msgPlaceholder', lang)}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                style={{ ...fieldInputStyle(errors.has('message'), isDark), resize: 'vertical', minHeight: '88px', lineHeight: 1.55 }}
                onFocus={handleFocus}
                onBlur={e => handleBlur(e, errors.has('message'))}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px', width: '100%', padding: '14px',
                border: 'none', borderRadius: '8px',
                background: sent ? GREEN : ACCENT,
                color: '#000', fontFamily: INTER, fontSize: '14px', fontWeight: 700,
                letterSpacing: '0.01em', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'filter .2s ease, transform .2s ease, box-shadow .2s ease, background .35s ease',
                boxShadow: sent
                  ? '0 8px 24px rgba(0,255,136,0.30)'
                  : btnHovered ? '0 8px 24px rgba(0,212,255,0.30)' : 'none',
                filter: !sent && btnHovered ? 'brightness(1.1)' : 'none',
                transform: !sent && btnHovered ? 'scale(1.01)' : 'scale(1)',
                animation: sent ? 'contactSendPop .35s ease' : 'none',
              }}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              <span>{sent ? (SENT_BTN[lang] ?? '✓ Sent!') : t('contact.form.send', lang)}</span>
              {!sent && <span style={{ fontFamily: MONO, transition: 'transform .2s ease', transform: btnHovered ? 'translateX(3px)' : 'none' }}>→</span>}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes contactPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .35; transform: scale(.8); }
        }
        @keyframes contactShake {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        @keyframes contactSendPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        #ct-name::placeholder, #ct-email::placeholder, #ct-subject::placeholder, #ct-msg::placeholder {
          color: rgba(255,255,255,0.20);
        }
        .contact-item-link:hover .contact-item-val { color: #00d4ff; }
      `}</style>
    </div>
  );
}

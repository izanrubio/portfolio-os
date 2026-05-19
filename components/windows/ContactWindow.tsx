'use client';

import { useState } from 'react';
import { personalInfo } from '@/data/content';

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="p-6 h-full overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-md mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">~/contact</p>

        {/* Contact items */}
        <div className="flex flex-col gap-4 mb-8">
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-4 p-4 rounded-lg transition-colors group"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: '#f3f4f6' }}
            >
              ✉️
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Email</p>
              <p className="text-sm font-semibold text-gray-900 group-hover:underline">{personalInfo.email}</p>
            </div>
          </a>

          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg transition-colors group"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: '#f3f4f6' }}
            >
              ⚙️
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">GitHub</p>
              <p className="text-sm font-semibold text-gray-900 group-hover:underline">github.com/izanrubio</p>
            </div>
          </a>

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg transition-colors group"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: '#f3f4f6' }}
            >
              💼
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">LinkedIn</p>
              <p className="text-sm font-semibold text-gray-900 group-hover:underline">in/izanrubio</p>
            </div>
          </a>
        </div>

        {/* Contact form */}
        <div
          className="p-5 rounded-xl"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Send a message</h3>

          {sent && (
            <div
              className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
            >
              Message sent! I&apos;ll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                color: '#111827',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                color: '#111827',
              }}
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all resize-none"
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                color: '#111827',
              }}
            />
            <button
              type="submit"
              className="w-full py-2 text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
              style={{ background: '#0d1117', color: '#ffffff' }}
            >
              Send →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

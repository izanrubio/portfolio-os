'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

interface Message {
  id: number;
  text: string;
  time: string;
  side: 'sent' | 'received';
  status?: 'sending' | 'sent'; // only for sent side
}

interface Props {
  onClose: () => void;
}

function TypingIndicator() {
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '7.5px 7.5px 7.5px 0',
      padding: '10px 14px',
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {/* Bottom-left tail */}
      <div style={{
        position: 'absolute', bottom: 0, left: -8,
        width: 0, height: 0,
        borderRight: '8px solid rgba(255,255,255,0.08)',
        borderTop: '8px solid transparent',
      }} />
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#8696a0', flexShrink: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

const STORAGE_KEY = 'izanos-chat-messages';

export default function MobileChat({ onClose }: Props) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);
  const isMounted = useRef(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          scrollToBottom();
        }
      }
    } catch {}
    return () => {
      isMounted.current = false;
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const getTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const langCode = lang === 'CAS' ? 'es' : lang === 'CAT' ? 'ca' : 'en';

  const fetchAiReply = async (userMessage: string) => {
    try {
      const aiRes = await fetch('/api/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, lang: langCode }),
      });
      const aiData = await aiRes.json();

      if (!isMounted.current) return;
      setShowTyping(false);

      if (aiData.ok && aiData.reply) {
        const replyId = nextId.current++;
        const replyTime = getTime();
        setMessages(prev => [...prev, { id: replyId, text: aiData.reply, time: replyTime, side: 'received' }]);
        scrollToBottom();
      }
    } catch {
      if (isMounted.current) setShowTyping(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const time = getTime();
    const id = nextId.current++;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setMessages(prev => [...prev, { id, text, time, side: 'sent', status: 'sending' }]);
    setSending(true);
    scrollToBottom();

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data.ok) {
        if (!isMounted.current) return;
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'sent' } : m));
        setShowConfirm(true);
        confirmTimerRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          setShowConfirm(false);
          setSending(false);
        }, 2500);

        // Start AI reply flow: 600ms delay then typing indicator + API call
        typingTimerRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          setShowTyping(true);
          scrollToBottom();
          fetchAiReply(text);
        }, 600);
      } else {
        throw new Error(data.error ?? 'Error');
      }
    } catch {
      if (!isMounted.current) return;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'sent' } : m));
      setErrorMsg(t('chat.error', lang));
      errorTimerRef.current = setTimeout(() => {
        if (!isMounted.current) return;
        setErrorMsg(null);
        setSending(false);
      }, 3000);
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#0b141a',
    }}>
      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#1f2c34',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        zIndex: 3,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 56, padding: '0 12px 0 8px', width: '100%' }}>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#e9edef', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#a855f7,#00e5ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 14, color: '#fff',
          }}>IZ</div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e9edef', lineHeight: 1.15 }}>Izan Rubio</div>
            <div style={{ fontSize: 13, color: '#25d366', lineHeight: 1.15 }}>En línia</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#e9edef', paddingRight: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 15.5a12.6 12.6 0 0 1-3.9-.6 1.1 1.1 0 0 0-1.1.3l-1.7 1.7a13.3 13.3 0 0 1-5.8-5.8l1.7-1.7a1.1 1.1 0 0 0 .3-1.1A12.6 12.6 0 0 1 8.5 4a1.1 1.1 0 0 0-1-1H4.6a1.1 1.1 0 0 0-1.1 1A16.4 16.4 0 0 0 20 20.5a1.1 1.1 0 0 0 1-1.1V16.5a1.1 1.1 0 0 0-1-1z" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="12" cy="19" r="1.7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Chat body ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '12px 16px 12px',
          position: 'relative',
          background: '#0b141a',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Doodle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90' fill='none' stroke='%23ffffff' stroke-width='1.2'><circle cx='20' cy='20' r='6'/><path d='M55 12h14v14h-14z'/><path d='M64 50l8 14H56z'/><circle cx='26' cy='66' r='7'/><path d='M44 40c5 0 8 4 8 8'/><path d='M10 50h12M16 44v12'/></svg>")`,
          backgroundSize: '90px 90px',
        }} />

        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            textAlign: 'center', paddingTop: '28vh',
          }}>
            <div style={{
              background: 'rgba(31,44,52,.85)', borderRadius: 8,
              padding: '8px 12px', fontSize: 12.5, color: '#ffd279',
              lineHeight: 1.5, display: 'inline-flex', alignItems: 'center', gap: 7,
              boxShadow: '0 1px 1px rgba(0,0,0,.2)',
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13, flexShrink: 0 }}>
                <path d="M12 2a4 4 0 0 0-4 4v2H7a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4zm-2 6V6a2 2 0 0 1 4 0v2z" />
              </svg>
              {t('chat.encrypted', lang)}
            </div>
            <div style={{ fontSize: 14, color: '#8696a0', marginTop: 4 }}>
              {t('chat.sendMessage', lang)}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            {/* Date separator */}
            <div style={{
              alignSelf: 'center', marginBottom: 12,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 999, padding: '5px 12px',
              fontSize: 12, color: '#8696a0', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.02em',
            }}>
              {t('chat.today', lang)}
            </div>

            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: msg.side === 'received' ? 0.3 : 0.18 }}
                style={{
                  display: 'flex',
                  justifyContent: msg.side === 'sent' ? 'flex-end' : 'flex-start',
                  marginBottom: 4,
                }}
              >
                {msg.side === 'sent' ? (
                  /* ── Sent bubble (right, green) ── */
                  <div style={{
                    position: 'relative', maxWidth: '78%',
                    background: '#005c4b', color: '#e9edef',
                    fontSize: 14.2, lineHeight: '19px',
                    padding: '6px 9px 8px',
                    borderRadius: '7.5px 7.5px 0 7.5px',
                    boxShadow: '0 1px .5px rgba(0,0,0,.13)',
                    marginRight: 8,
                  }}>
                    {/* Right tail */}
                    <div style={{
                      position: 'absolute', top: 0, right: -8,
                      width: 0, height: 0,
                      borderLeft: '8px solid #005c4b',
                      borderBottom: '8px solid transparent',
                    }} />
                    <span style={{ paddingRight: 64, display: 'block' }}>{msg.text}</span>
                    <div style={{
                      position: 'absolute', right: 9, bottom: 6,
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 11, color: '#8696a0',
                    }}>
                      {msg.time}
                      {msg.status === 'sent' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#53bdeb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                          <polyline points="2 13 7 18 14 9" />
                          <polyline points="10 18 17 9" />
                        </svg>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ── Received bubble (left, dark) ── */
                  <div style={{
                    position: 'relative', maxWidth: '78%',
                    background: '#202c33', color: '#e9edef',
                    fontSize: 14, lineHeight: '19px',
                    padding: '6px 10px 8px 10px',
                    borderRadius: '7.5px 7.5px 7.5px 0',
                    boxShadow: '0 1px .5px rgba(0,0,0,.13)',
                    marginLeft: 8,
                  }}>
                    {/* Bottom-left tail */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: -8,
                      width: 0, height: 0,
                      borderRight: '8px solid #202c33',
                      borderTop: '8px solid transparent',
                    }} />
                    <span style={{ paddingRight: 46, display: 'block' }}>{msg.text}</span>
                    <div style={{
                      position: 'absolute', right: 9, bottom: 6,
                      fontSize: 11, color: '#8696a0',
                    }}>
                      {msg.time}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {showTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 4, marginLeft: 0 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirmation pill */}
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    alignSelf: 'center', marginTop: 6,
                    background: 'rgba(37,211,102,0.12)',
                    borderRadius: 999, padding: '4px 14px',
                    fontSize: 12, color: '#25d366',
                  }}
                >
                  {t('chat.sent', lang)} ✓
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    alignSelf: 'center', marginTop: 6,
                    fontSize: 12, color: 'rgba(255,71,87,0.85)',
                    textAlign: 'center',
                  }}
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'flex-end', gap: 8,
        padding: '8px 10px',
        paddingBottom: 'max(18px, env(safe-area-inset-bottom, 18px))',
        background: '#1f2c34',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        zIndex: 3,
      }}>
        {/* Emoji icon */}
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 10, flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 14.5a4 4 0 0 0 7 0" />
            <circle cx="9" cy="10" r=".9" fill="#8696a0" stroke="none" />
            <circle cx="15" cy="10" r=".9" fill="#8696a0" stroke="none" />
          </svg>
        </div>

        {/* Input pill */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: '#2a3942', borderRadius: 21,
            display: 'flex', alignItems: 'flex-end', padding: '0 44px 0 14px',
            position: 'relative', minHeight: 42,
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              placeholder={t('chat.placeholder', lang)}
              disabled={sending}
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#e9edef', fontSize: 15, lineHeight: '22px',
                padding: '10px 0', resize: 'none', overflow: 'hidden',
                fontFamily: 'inherit', width: '100%', maxHeight: 120,
              }}
            />
            {/* Clip icon */}
            <div style={{ position: 'absolute', right: 12, bottom: 10, color: '#8696a0' }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.5 12.5 21a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Send / Mic button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={sending}
          style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: '#00a884', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: hasText ? '0 0 14px rgba(0,168,132,0.45)' : 'none',
            opacity: sending ? 0.6 : 1,
            transition: 'box-shadow 0.2s, opacity 0.2s',
          }}
        >
          <AnimatePresence mode="wait">
            {hasText ? (
              <motion.span key="send"
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.12 }}
                style={{ display: 'flex' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5 21 12 3 3.5 3 10l13 2-13 2z" />
                </svg>
              </motion.span>
            ) : (
              <motion.span key="mic"
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.12 }}
                style={{ display: 'flex' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                  <path d="M18 11a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.9V22h2v-3.1A8 8 0 0 0 20 11h-2z" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { personal } from '@/data/content';

const MONO = 'var(--font-jetbrains), monospace';
const INTER = 'var(--font-inter), Inter, sans-serif';

export default function WhoamiWindow() {
  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden" style={{ background: '#0d1117' }}>
      {/* Left: Photo */}
      <div className="md:w-2/5 w-full h-52 md:h-full relative shrink-0 overflow-hidden">
        <Image
          src={personal.photo}
          alt={personal.name}
          fill
          className="object-cover"
          style={{
            objectPosition: 'center top',
            filter: 'grayscale(100%) brightness(0.8)',
            mixBlendMode: 'luminosity',
          }}
          onError={() => {}}
        />
        {/* Cyan overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.06) 100%)',
            mixBlendMode: 'color-dodge',
          }}
        />
        {/* Right fade */}
        <div
          className="absolute inset-y-0 right-0 w-24 hidden md:block"
          style={{ background: 'linear-gradient(to right, transparent, #0d1117)' }}
        />
      </div>

      {/* Right: Info */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center" style={{ padding: '32px' }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '12px' }}
          >
            ~/WHOAMI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: INTER, fontWeight: 700, fontSize: '28px', color: '#f0f4ff', lineHeight: 1.2, marginBottom: '8px' }}
          >
            {personal.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}
          >
            {personal.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: INTER, fontSize: '14px', color: '#8892a4', lineHeight: 1.8, marginBottom: '28px' }}
          >
            {personal.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            {[
              { label: 'email', value: personal.email, href: `mailto:${personal.email}` },
              { label: 'github', value: 'izanrubio', href: personal.github },
              { label: 'linkedin', value: 'in/izanrubio', href: personal.linkedin },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '10px',
                    color: '#4a5568',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    minWidth: '56px',
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="transition-colors duration-150 group-hover:underline"
                  style={{
                    fontFamily: MONO,
                    fontSize: '13px',
                    color: '#f0f4ff',
                  }}
                >
                  {link.value}
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

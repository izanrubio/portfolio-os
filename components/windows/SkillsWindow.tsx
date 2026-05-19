'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/content';

const MONO = 'var(--font-jetbrains), monospace';

const CATEGORIES = [
  { key: 'languages' as const, label: 'LANGUAGES', color: '#00d4ff' },
  { key: 'frontend' as const, label: 'FRONTEND', color: '#7c3aed' },
  { key: 'backend' as const, label: 'BACKEND', color: '#00d4ff' },
  { key: 'security' as const, label: 'SECURITY', color: '#00ff88' },
  { key: 'devops' as const, label: 'DEVOPS', color: '#7c3aed' },
];

export default function SkillsWindow() {
  return (
    <div
      className="h-full overflow-y-auto p-5"
      style={{ background: '#0d1117' }}
    >
      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '24px' }}>
        ~/SKILLS
      </p>

      <div className="flex flex-col gap-6">
        {CATEGORIES.map((cat, catIdx) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: catIdx * 0.08, duration: 0.3 }}
          >
            <p
              style={{
                fontFamily: MONO,
                fontSize: '10px',
                color: cat.color,
                letterSpacing: '0.2em',
                marginBottom: '10px',
              }}
            >
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills[cat.key].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: catIdx * 0.08 + i * 0.03, duration: 0.2 }}
                  style={{
                    fontFamily: MONO,
                    fontSize: '11px',
                    color: cat.color,
                    border: `1px solid ${cat.color}40`,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    background: `${cat.color}08`,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

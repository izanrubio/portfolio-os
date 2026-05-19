'use client';

import { useState } from 'react';
import { projects } from '@/data/content';
import { motion, AnimatePresence } from 'framer-motion';

const MONO = 'var(--font-jetbrains), monospace';

export default function ProjectsWindow() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className="h-full overflow-y-auto p-5"
      style={{ background: '#0d1117', color: '#f0f4ff' }}
    >
      {/* Header */}
      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '20px' }}>
        ~/PROJECTS
      </p>

      <div className="flex flex-col gap-1">
        {projects.map((project, idx) => {
          const isExpanded = expanded === project.slug;
          const isOther = expanded !== null && !isExpanded;

          return (
            <div key={project.slug}>
              <button
                className="w-full text-left transition-all duration-300"
                style={{ opacity: isOther ? 0.35 : 1 }}
                onClick={() => setExpanded(isExpanded ? null : project.slug)}
              >
                <div className="flex items-start gap-4 py-4 px-2">
                  {/* Number */}
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: '42px',
                      fontWeight: 800,
                      color: '#1a2332',
                      lineHeight: 1,
                      minWidth: '56px',
                      userSelect: 'none',
                    }}
                  >
                    {project.slug === 'stastarat' ? '01' : project.slug === 'laraveles' ? '02' : project.slug === 'goldenbids' ? '03' : '04'}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f0f4ff' }}>
                        {project.name}
                      </h3>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#4a5568', fontSize: '10px' }}
                      >
                        ▼
                      </motion.span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8892a4', lineHeight: 1.7 }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.stack.map(tech => (
                        <span
                          key={tech}
                          style={{
                            fontFamily: MONO,
                            fontSize: '10px',
                            color: '#00d4ff',
                            border: '1px solid rgba(0,212,255,0.3)',
                            padding: '2px 8px',
                            borderRadius: '3px',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-2 mb-4 p-4 rounded-lg"
                      style={{ background: '#111827', border: '1px solid rgba(0,212,255,0.12)' }}
                    >
                      <p style={{ fontSize: '13px', color: '#8892a4', lineHeight: 1.8, marginBottom: '16px' }}>
                        {project.longDescription}
                      </p>
                      <div className="flex gap-3">
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-70"
                            style={{
                              fontFamily: MONO,
                              fontSize: '11px',
                              color: '#00d4ff',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            DEMO →
                          </a>
                        )}
                        {project.repo && (
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-70"
                            style={{
                              fontFamily: MONO,
                              fontSize: '11px',
                              color: '#8892a4',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            GITHUB →
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ height: '1px', background: '#1a2332', margin: '0 8px' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

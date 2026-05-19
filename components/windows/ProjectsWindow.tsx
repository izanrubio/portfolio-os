'use client';

import { useState } from 'react';
import { projects } from '@/data/content';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsWindow() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6 h-full overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
          ~/projects
        </h2>

        <div className="flex flex-col gap-3">
          {projects.map(project => (
            <div key={project.id}>
              <button
                className="w-full text-left group"
                onClick={() => setExpanded(expanded === project.id ? null : project.id)}
              >
                <div
                  className="flex items-start gap-4 p-4 rounded-lg transition-all duration-200"
                  style={{
                    background: expanded === project.id ? '#f0f4ff' : '#ffffff',
                    border: `1px solid ${expanded === project.id ? '#c7d2fe' : '#e5e7eb'}`,
                  }}
                >
                  <span
                    className="text-4xl font-bold leading-none select-none"
                    style={{ color: '#f3f4f6', minWidth: '2.5rem' }}
                  >
                    {project.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{project.name}</h3>
                      <span
                        className="text-[10px] transition-transform duration-200"
                        style={{ transform: expanded === project.id ? 'rotate(180deg)' : 'rotate(0deg)', color: '#6b7280' }}
                      >
                        ▼
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.stack.map(tech => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expanded === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-4 mx-px"
                      style={{
                        background: '#f8f9ff',
                        border: '1px solid #c7d2fe',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      <p className="text-gray-600 text-xs leading-relaxed mb-4">{project.details}</p>
                      <div className="flex gap-3">
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-1.5 rounded-md font-medium transition-colors"
                          style={{ background: '#1e1e2e', color: '#ffffff' }}
                        >
                          Live Demo →
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-1.5 rounded-md font-medium transition-colors"
                          style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { skills } from '@/data/content';

const categoryColors: Record<string, string> = {
  Languages: '#dbeafe',
  Frontend: '#dcfce7',
  Backend: '#fef3c7',
  Security: '#fee2e2',
  DevOps: '#f3e8ff',
};

const categoryTextColors: Record<string, string> = {
  Languages: '#1e40af',
  Frontend: '#166534',
  Backend: '#92400e',
  Security: '#991b1b',
  DevOps: '#6b21a8',
};

export default function SkillsWindow() {
  return (
    <div className="p-6 h-full overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">~/skills</p>

        <div className="flex flex-col gap-6">
          {Object.entries(skills).map(([category, techs]) => (
            <div key={category}>
              <h3
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: categoryTextColors[category] || '#374151' }}
              >
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {techs.map(tech => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-transform hover:scale-105 cursor-default"
                    style={{
                      background: categoryColors[category] || '#f3f4f6',
                      color: categoryTextColors[category] || '#374151',
                      border: `1px solid ${categoryTextColors[category] || '#e5e7eb'}22`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

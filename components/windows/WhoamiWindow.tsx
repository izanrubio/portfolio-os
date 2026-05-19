'use client';

import Image from 'next/image';
import { personalInfo } from '@/data/content';

export default function WhoamiWindow() {
  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left: Photo */}
      <div
        className="md:w-2/5 w-full h-48 md:h-full relative shrink-0"
        style={{ background: '#0d1117' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              fill
              className="object-cover grayscale"
              style={{ objectPosition: 'center top' }}
              onError={() => {}}
            />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, transparent 60%, rgba(248,249,250,0.15) 100%)' }}
            />
          </div>
        </div>
      </div>

      {/* Right: Info */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-center" style={{ background: '#f8f9fa' }}>
        <div className="max-w-sm">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">whoami</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{personalInfo.name}</h1>
          <p className="text-sm font-medium mt-1 mb-4" style={{ color: '#00d4ff', filter: 'brightness(0.7)' }}>
            {personalInfo.role}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{personalInfo.bio}</p>

          <div className="flex flex-col gap-2.5">
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace' }}
              >
                email
              </span>
              <span className="group-hover:underline">{personalInfo.email}</span>
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace' }}
              >
                github
              </span>
              <span className="group-hover:underline">izanrubio</span>
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', fontFamily: 'JetBrains Mono, monospace' }}
              >
                linkedin
              </span>
              <span className="group-hover:underline">in/izanrubio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

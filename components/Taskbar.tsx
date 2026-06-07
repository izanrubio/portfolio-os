'use client';

import { useState, useRef } from 'react';
import { WindowState, WindowId } from '@/types/windows';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';
import ProjectsIcon from './icons/ProjectsIcon';
import AboutIcon    from './icons/AboutIcon';
import SkillsIcon   from './icons/SkillsIcon';
import ContactIcon  from './icons/ContactIcon';
import BrowserIcon  from './icons/BrowserIcon';
import FilesIcon    from './icons/FilesIcon';
import TerminalIcon from './icons/TerminalIcon';
import GameIcon        from './icons/GameIcon';
import ExperienceIcon  from './icons/ExperienceIcon';
import EducationIcon   from './icons/EducationIcon';
import VirtualBoxIcon  from './icons/VirtualBoxIcon';

const SCALE_MAX = 1.40;
const RANGE     = 130;

interface DockItem {
  id: WindowId;
  labelKey: string;
  Icon: () => React.ReactElement;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'projects',   labelKey: 'dock.projects',   Icon: ProjectsIcon   },
  { id: 'whoami',     labelKey: 'dock.about',      Icon: AboutIcon      },
  { id: 'skills',     labelKey: 'dock.skills',     Icon: SkillsIcon     },
  { id: 'contact',    labelKey: 'dock.contact',    Icon: ContactIcon    },
  { id: 'experience', labelKey: 'dock.experience', Icon: ExperienceIcon },
  { id: 'education',  labelKey: 'dock.education',  Icon: EducationIcon  },
  { id: 'browser',    labelKey: 'dock.browser',    Icon: BrowserIcon    },
  { id: 'files',      labelKey: 'dock.files',      Icon: FilesIcon      },
  { id: 'terminal',   labelKey: 'dock.terminal',   Icon: TerminalIcon   },
  { id: 'game',        labelKey: 'dock.game',        Icon: GameIcon        },
  { id: 'virtualbox',  labelKey: 'dock.virtualbox',  Icon: VirtualBoxIcon  },
];

const SEPARATOR_BEFORE = 6; // vertical rule before browser/files/terminal/game/virtualbox

interface TaskbarProps {
  windows: WindowState[];
  onWindowFocus: (id: WindowId) => void;
  onWindowToggle: (id: WindowId) => void;
  onOpenWindow: (id: WindowId) => void;
}

export default function Taskbar({ windows, onWindowFocus, onWindowToggle, onOpenWindow }: TaskbarProps) {
  const { lang } = useLanguage();
  const [mouseX, setMouseX]         = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getScale = (idx: number): number => {
    if (mouseX === null) return 1;
    const el = iconRefs.current[idx];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const d = Math.abs(mouseX - cx);
    if (d >= RANGE) return 1;
    return 1 + (SCALE_MAX - 1) * Math.cos((d / RANGE) * (Math.PI / 2));
  };

  const handleDockMouseMove = (e: React.MouseEvent) => {
    setMouseX(e.clientX);
    let nearestIdx = 0, nearestDist = Infinity;
    iconRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const d = Math.abs(e.clientX - cx);
      if (d < nearestDist) { nearestDist = d; nearestIdx = idx; }
    });
    setHoveredIdx(nearestDist < 60 ? nearestIdx : null);
  };

  const handleDockMouseLeave = () => { setMouseX(null); setHoveredIdx(null); };

  const handleItemClick = (item: DockItem) => {
    const win = windows.find(w => w.id === item.id);
    if (!win || !win.isOpen) {
      onOpenWindow(item.id);
    } else if (win.isMinimized) {
      onWindowToggle(item.id);
    } else {
      onWindowFocus(item.id);
    }
  };

  const isOpen     = (id: WindowId) => windows.find(w => w.id === id)?.isOpen ?? false;
  const isHovering = mouseX !== null;

  return (
    <div
      className="fixed z-50"
      style={{ left: '50%', bottom: '18px', transform: 'translateX(-50%)', overflow: 'visible' }}
      onContextMenu={e => e.stopPropagation()}
    >
      <div
        className="dock-pill"
        style={{
          display: 'flex', alignItems: 'flex-end', gap: '12px',
          padding: '10px 18px',
          borderRadius: '24px',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'visible',
          position: 'relative',
        }}
        onMouseMove={handleDockMouseMove}
        onMouseLeave={handleDockMouseLeave}
      >
        {DOCK_ITEMS.map((item, idx) => {
          const scale      = getScale(idx);
          const lift       = (scale - 1) * 20;
          const open       = isOpen(item.id);
          const isHov      = hoveredIdx === idx;
          const isPressed  = pressedIdx === idx;
          const pressScale = isPressed ? 0.92 : 1;

          return (
            <div key={item.id} style={{ display: 'contents' }}>
              {idx === SEPARATOR_BEFORE && (
                <div
                  style={{
                    width: '1px', height: '44px',
                    background: 'rgba(255,255,255,0.15)',
                    margin: '0 6px 8px',
                    flexShrink: 0,
                    alignSelf: 'flex-end',
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                className="flex flex-col items-center"
                style={{ position: 'relative', overflow: 'visible' }}
              >
                {/* Tooltip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 12px)',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${isHov ? '0px' : '4px'})`,
                    padding: '6px 12px',
                    background: 'var(--tip-bg)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid var(--tip-bd)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--tip-text)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: isHov ? 1 : 0,
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                    zIndex: 9999,
                  }}
                >
                  {t(item.labelKey, lang)}
                  <div
                    style={{
                      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                      width: 0, height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid var(--tip-bg)',
                    }}
                  />
                </div>

                {/* Icon */}
                <div
                  ref={el => { iconRefs.current[idx] = el; }}
                  style={{
                    transformOrigin: 'bottom center',
                    transform: `translateY(${-lift}px) scale(${scale * pressScale})`,
                    transition: isHovering
                      ? 'transform .12s cubic-bezier(.2,.8,.2,1)'
                      : 'transform .35s cubic-bezier(.34,1.56,.64,1)',
                    willChange: 'transform',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleItemClick(item)}
                  onMouseDown={() => setPressedIdx(idx)}
                  onMouseUp={() => setPressedIdx(null)}
                  onMouseLeave={() => setPressedIdx(null)}
                >
                  <item.Icon />
                </div>

                {/* Open indicator dot */}
                <div
                  style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    marginTop: '8px',
                    background: open ? 'var(--open-dot)' : 'transparent',
                    boxShadow: open ? '0 0 6px rgba(255,255,255,.5)' : 'none',
                    opacity: open ? 1 : 0,
                    transition: 'opacity .25s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

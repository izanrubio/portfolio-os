'use client';

import { useRef, useState, useCallback, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WindowState, WindowId } from '@/types/windows';

interface WindowProps {
  window: WindowState;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMove: (id: WindowId, pos: { x: number; y: number }) => void;
  onResize: (id: WindowId, size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

const TASKBAR_H = 48;

export default function Window({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    setDragging(true);

    const startX = e.clientX - win.position.x;
    const startY = e.clientY - win.position.y;

    const onMove_ = (ev: MouseEvent) => {
      const x = Math.max(0, Math.min(globalThis.innerWidth - 120, ev.clientX - startX));
      const y = Math.max(0, Math.min(globalThis.innerHeight - TASKBAR_H - 36, ev.clientY - startY));
      onMove(win.id, { x, y });
    };

    const onUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMove_);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove_);
    document.addEventListener('mouseup', onUp);
  }, [win, isMobile, onMove]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);

    const origW = win.size.width;
    const origH = win.size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove_ = (ev: MouseEvent) => {
      onResize(win.id, {
        width: Math.max(340, origW + ev.clientX - startX),
        height: Math.max(240, origH + ev.clientY - startY),
      });
    };

    const onUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', onMove_);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove_);
    document.addEventListener('mouseup', onUp);
  }, [win, isMobile, onResize]);

  const positionStyle: CSSProperties = isMobile
    ? { position: 'fixed', inset: 0, bottom: `${TASKBAR_H}px` }
    : win.isMaximized
    ? { position: 'fixed', left: 0, top: 0, right: 0, bottom: `${TASKBAR_H}px` }
    : {
        position: 'fixed',
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        transition: dragging || resizing
          ? 'none'
          : 'left 0.28s cubic-bezier(0.16,1,0.3,1), top 0.28s cubic-bezier(0.16,1,0.3,1), width 0.28s cubic-bezier(0.16,1,0.3,1), height 0.28s cubic-bezier(0.16,1,0.3,1)',
      };

  const borderRadius = win.isMaximized || isMobile ? '0px' : '10px';

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            ...positionStyle,
            zIndex: win.zIndex,
          }}
          className="flex flex-col"
          onMouseDown={() => onFocus(win.id)}
        >
          <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{
              borderRadius,
              border: '1px solid rgba(0, 212, 255, 0.2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)',
              background: 'rgba(10, 15, 30, 0.92)',
              backdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center px-3 shrink-0 select-none"
              style={{
                height: '36px',
                background: 'rgba(8, 12, 24, 0.95)',
                borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                borderRadius: win.isMaximized || isMobile ? '0' : '9px 9px 0 0',
                cursor: win.isMaximized || isMobile ? 'default' : 'grab',
              }}
              onMouseDown={handleTitleMouseDown}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="rounded-full transition-opacity hover:opacity-75 active:scale-90"
                  style={{ width: '12px', height: '12px', background: '#ff4757' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onClose(win.id); }}
                  title="Close"
                />
                <button
                  className="rounded-full transition-opacity hover:opacity-75 active:scale-90"
                  style={{ width: '12px', height: '12px', background: '#ffd32a' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onMinimize(win.id); }}
                  title="Minimize"
                />
                <button
                  className="rounded-full transition-opacity hover:opacity-75 active:scale-90"
                  style={{ width: '12px', height: '12px', background: '#00ff88' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onMaximize(win.id); }}
                  title="Maximize"
                />
              </div>

              {/* Title */}
              <span
                className="flex-1 text-center truncate px-4"
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '12px',
                  color: '#8892a4',
                }}
              >
                {win.title}
              </span>

              {/* Spacer to center title */}
              <div style={{ width: '52px' }} />
            </div>

            {/* Window content */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>

          {/* Resize handle */}
          {!win.isMaximized && !isMobile && (
            <div
              className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group"
              style={{ zIndex: 1 }}
              onMouseDown={handleResizeMouseDown}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className="absolute bottom-1.5 right-1.5 transition-opacity opacity-30 group-hover:opacity-70"
              >
                <line x1="9" y1="1" x2="1" y2="9" stroke="#00d4ff" strokeWidth="1.2"/>
                <line x1="9" y1="5" x2="5" y2="9" stroke="#00d4ff" strokeWidth="1.2"/>
              </svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

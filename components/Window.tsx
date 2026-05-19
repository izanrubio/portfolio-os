'use client';

import { useRef, useCallback, useEffect } from 'react';
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

const TASKBAR_HEIGHT = 40;

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
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.position.x,
      origY: win.position.y,
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(globalThis.innerWidth - 200, dragRef.current.origX + dx));
      const newY = Math.max(0, Math.min(globalThis.innerHeight - TASKBAR_HEIGHT - 40, dragRef.current.origY + dy));
      onMove(win.id, { x: newX, y: newY });
    };

    const onMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [win, isMobile, onMove]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: win.size.width,
      origH: win.size.height,
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = ev.clientX - resizeRef.current.startX;
      const dy = ev.clientY - resizeRef.current.startY;
      onResize(win.id, {
        width: Math.max(340, resizeRef.current.origW + dx),
        height: Math.max(240, resizeRef.current.origH + dy),
      });
    };

    const onMouseUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [win, isMobile, onResize]);

  const style = isMobile
    ? {
        position: 'fixed' as const,
        inset: 0,
        bottom: `${TASKBAR_HEIGHT}px`,
        zIndex: win.zIndex,
        borderRadius: 0,
      }
    : win.isMaximized
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: `${TASKBAR_HEIGHT}px`,
        zIndex: win.zIndex,
        borderRadius: '0px',
      }
    : {
        position: 'fixed' as const,
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      };

  return (
    <AnimatePresence>
      {win.isOpen && !win.isMinimized && (
        <motion.div
          ref={windowRef}
          key={win.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={style}
          className="flex flex-col overflow-hidden shadow-2xl"
          onMouseDown={() => onFocus(win.id)}
          onClick={() => onFocus(win.id)}
        >
          {/* Window border */}
          <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{
              border: '1px solid rgba(0, 212, 255, 0.18)',
              borderRadius: win.isMaximized || isMobile ? 0 : '8px',
              background: '#f8f9fa',
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center px-3 h-9 shrink-0 select-none"
              style={{
                background: '#0d1117',
                borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
                cursor: win.isMaximized || isMobile ? 'default' : 'grab',
                borderRadius: win.isMaximized || isMobile ? 0 : '7px 7px 0 0',
              }}
              onMouseDown={handleTitleBarMouseDown}
            >
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 mr-3">
                <button
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: '#ff5f57' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onClose(win.id); }}
                  title="Close"
                />
                <button
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: '#febc2e' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onMinimize(win.id); }}
                  title="Minimize"
                />
                <button
                  className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                  style={{ background: '#28c840' }}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onMaximize(win.id); }}
                  title="Maximize"
                />
              </div>

              <span
                className="flex-1 text-center text-xs text-white/60 truncate"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {win.title}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto" style={{ background: '#f8f9fa' }}>
              {children}
            </div>
          </div>

          {/* Resize handle */}
          {!win.isMaximized && !isMobile && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={handleResizeMouseDown}
              style={{ zIndex: 1 }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1 opacity-30">
                <line x1="10" y1="0" x2="0" y2="10" stroke="#00d4ff" strokeWidth="1"/>
                <line x1="10" y1="4" x2="4" y2="10" stroke="#00d4ff" strokeWidth="1"/>
                <line x1="10" y1="8" x2="8" y2="10" stroke="#00d4ff" strokeWidth="1"/>
              </svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

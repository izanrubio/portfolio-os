'use client';

import { useState, useCallback, useMemo, CSSProperties } from 'react';
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

const TASKBAR_H = 110;

type SnapZone = 'left' | 'right' | 'top' | null;
type SnapState = { x: number; y: number; width: number; height: number };

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
  const [dragging, setDragging]   = useState(false);
  const [resizing, setResizing]   = useState(false);
  const [snapZone, setSnapZone]   = useState<SnapZone>(null);
  const [preSnap, setPreSnap]     = useState<SnapState | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    setDragging(true);

    let startX = e.clientX - win.position.x;
    let startY = e.clientY - win.position.y;
    let currentW = win.size.width;
    let currentH = win.size.height;

    // Un-snap on drag start — restore original size, keep cursor proportional
    if (preSnap) {
      const ratio = Math.min(0.9, Math.max(0.1, (e.clientX - win.position.x) / win.size.width));
      startX = preSnap.width * ratio;
      const restoredX = Math.max(0, e.clientX - startX);
      onMove(win.id, { x: restoredX, y: win.position.y });
      onResize(win.id, { width: preSnap.width, height: preSnap.height });
      currentW = preSnap.width;
      currentH = preSnap.height;
      setPreSnap(null);
    }

    // savedPreSnap = last position while NOT near any edge — used as restore target
    let savedPreSnap: SnapState = {
      x: win.position.x, y: win.position.y, width: currentW, height: currentH,
    };

    const onMove_ = (ev: MouseEvent) => {
      const x = Math.max(0, Math.min(globalThis.innerWidth - 120, ev.clientX - startX));
      const y = Math.max(28, Math.min(globalThis.innerHeight - TASKBAR_H - 40, ev.clientY - startY));
      onMove(win.id, { x, y });

      const W = globalThis.innerWidth;
      if (ev.clientX >= 20 && ev.clientX <= W - 20 && ev.clientY >= 20) {
        savedPreSnap = { x, y, width: currentW, height: currentH };
      }

      if      (ev.clientX < 20)    setSnapZone('left');
      else if (ev.clientX > W - 20) setSnapZone('right');
      else if (ev.clientY < 20)    setSnapZone('top');
      else                         setSnapZone(null);
    };

    const onUp = (ev: MouseEvent) => {
      setDragging(false);
      setSnapZone(null);

      const W = globalThis.innerWidth;
      const H = globalThis.innerHeight;
      const snapH = H - 28 - 48;

      if (ev.clientX < 20) {
        setPreSnap(savedPreSnap);
        onMove(win.id,   { x: 0, y: 28 });
        onResize(win.id, { width: Math.round(W / 2), height: snapH });
      } else if (ev.clientX > W - 20) {
        setPreSnap(savedPreSnap);
        onMove(win.id,   { x: Math.round(W / 2), y: 28 });
        onResize(win.id, { width: Math.round(W / 2), height: snapH });
      } else if (ev.clientY < 20) {
        setPreSnap(savedPreSnap);
        onMaximize(win.id);
      }

      document.removeEventListener('mousemove', onMove_);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove_);
    document.addEventListener('mouseup', onUp);
  }, [win, isMobile, onMove, onResize, onMaximize, preSnap]);

  // Double-click title bar: restore pre-snap state, or maximize if not snapped
  const handleTitleDoubleClick = useCallback(() => {
    if (preSnap) {
      if (win.isMaximized) onMaximize(win.id);
      onMove(win.id,   { x: preSnap.x, y: preSnap.y });
      onResize(win.id, { width: preSnap.width, height: preSnap.height });
      setPreSnap(null);
    } else {
      onMaximize(win.id);
    }
  }, [win, preSnap, onMove, onResize, onMaximize]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);

    const origW  = win.size.width;
    const origH  = win.size.height;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove_ = (ev: MouseEvent) => {
      onResize(win.id, {
        width:  Math.max(340, origW + ev.clientX - startX),
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

  // Snap preview geometry (position: fixed coords)
  const snapPreview = useMemo<SnapState | null>(() => {
    if (!snapZone) return null;
    const W = globalThis.innerWidth  ?? 1200;
    const H = globalThis.innerHeight ?? 800;
    if (snapZone === 'left')  return { x: 0,               y: 28, width: Math.round(W / 2), height: H - 28 - 48 };
    if (snapZone === 'right') return { x: Math.round(W / 2), y: 28, width: Math.round(W / 2), height: H - 28 - 48 };
    return { x: 0, y: 0, width: W, height: H - 48 }; // top = full
  }, [snapZone]);

  const positionStyle: CSSProperties = isMobile
    ? { position: 'fixed', inset: 0, bottom: `${TASKBAR_H}px` }
    : win.isMaximized
    ? { position: 'fixed', left: 0, top: 0, right: 0, bottom: `${TASKBAR_H}px` }
    : {
        position: 'fixed',
        left:   win.position.x,
        top:    win.position.y,
        width:  win.size.width,
        height: win.size.height,
        transition: dragging || resizing
          ? 'none'
          : 'left 0.25s cubic-bezier(0.16,1,0.3,1), top 0.25s cubic-bezier(0.16,1,0.3,1), width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1)',
      };

  const borderRadius = win.isMaximized || isMobile ? '0px' : '10px';
  const isTerminal   = win.id === 'terminal';

  return (
    <>
      {/* Snap preview overlay — fixed-position, outside motion.div to avoid transform inheritance */}
      {snapPreview && (
        <div
          style={{
            position: 'fixed',
            left:   snapPreview.x,
            top:    snapPreview.y,
            width:  snapPreview.width,
            height: snapPreview.height,
            background:   'rgba(0,212,255,0.1)',
            border:       '1px solid rgba(0,212,255,0.4)',
            borderRadius: '12px',
            pointerEvents: 'none',
            zIndex: win.zIndex - 1,
          }}
        />
      )}

      <AnimatePresence>
        {win.isOpen && !win.isMinimized && (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ ...positionStyle, zIndex: win.zIndex }}
            className="flex flex-col"
            onMouseDown={() => onFocus(win.id)}
            onContextMenu={e => e.stopPropagation()}
          >
            <div
              className={`win-chrome flex flex-col flex-1 overflow-hidden${isTerminal ? ' w-term' : ''}`}
              style={{
                borderRadius,
                border: '1px solid',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Title bar */}
              <div
                className="win-titlebar flex items-center px-3 shrink-0 select-none"
                style={{
                  height: '36px',
                  borderBottom: '1px solid',
                  borderRadius: win.isMaximized || isMobile ? '0' : '9px 9px 0 0',
                  cursor: win.isMaximized || isMobile ? 'default' : 'grab',
                }}
                onMouseDown={handleTitleMouseDown}
                onDoubleClick={handleTitleDoubleClick}
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
                  className="win-title-text flex-1 text-center truncate px-4"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}
                >
                  {win.title}
                </span>

                {/* Spacer to balance traffic lights */}
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
                  width="10" height="10" viewBox="0 0 10 10"
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
    </>
  );
}

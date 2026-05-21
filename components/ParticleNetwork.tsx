'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  lit: boolean;
}

interface Pulse {
  fromX: number; fromY: number;
  toX: number;   toY: number;
  progress: number; // 0 → 1
  startTime: number;
  duration: number;
}

const NODE_COUNT   = 45;
const CONN_DIST    = 150;
const MOUSE_RADIUS = 120;
const MAX_PULSES   = 3;
const PULSE_INTERVAL_MIN = 2000;
const PULSE_INTERVAL_MAX = 3500;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function ParticleNetwork() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const nodesRef   = useRef<Node[]>([]);
  const pulsesRef  = useRef<Pulse[]>([]);
  const mouseRef   = useRef({ x: -999, y: -999 });
  const prevMouseRef = useRef({ x: -999, y: -999 });
  const frameRef   = useRef(0);
  const tickRef    = useRef(0);
  // Cached connection pairs, recalculated every 2 frames
  const connRef    = useRef<[number, number][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init nodes
    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      lit: false,
    }));

    // Pulse scheduler
    let pulseTimeout: ReturnType<typeof setTimeout>;
    function schedulePulse() {
      const delay = PULSE_INTERVAL_MIN + Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN);
      pulseTimeout = setTimeout(() => {
        spawnPulse();
        schedulePulse();
      }, delay);
    }
    schedulePulse();

    function spawnPulse(count = 1) {
      const nodes  = nodesRef.current;
      const pulses = pulsesRef.current;
      if (pulses.length >= MAX_PULSES + count) return;
      for (let i = 0; i < count; i++) {
        if (pulses.length >= MAX_PULSES) break;
        const from = Math.floor(Math.random() * nodes.length);
        // pick a connected neighbour
        const neighbours: number[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (j === from) continue;
          const dx = nodes[from].x - nodes[j].x;
          const dy = nodes[from].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < CONN_DIST) neighbours.push(j);
        }
        if (!neighbours.length) continue;
        const to = neighbours[Math.floor(Math.random() * neighbours.length)];
        pulses.push({
          fromX: nodes[from].x, fromY: nodes[from].y,
          toX:   nodes[to].x,   toY:   nodes[to].y,
          progress: 0,
          startTime: performance.now(),
          duration: 800 + Math.random() * 400,
        });
      }
    }

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      const delta = Math.sqrt(dx * dx + dy * dy);
      if (delta > 30) spawnPulse(2 + Math.floor(Math.random()));
    };
    window.addEventListener('mousemove', onMouseMove);

    function draw(now: number) {
      frameRef.current = requestAnimationFrame(draw);
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const nodes  = nodesRef.current;
      const pulses = pulsesRef.current;
      const mouse  = mouseRef.current;
      const tick   = ++tickRef.current;

      const dark = document.documentElement.getAttribute('data-theme') !== 'light';

      ctx.clearRect(0, 0, W, H);

      // Move nodes + bounce
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0)  { n.x = 0;  n.vx = Math.abs(n.vx); }
        if (n.x > W)  { n.x = W;  n.vx = -Math.abs(n.vx); }
        if (n.y < 0)  { n.y = 0;  n.vy = Math.abs(n.vy); }
        if (n.y > H)  { n.y = H;  n.vy = -Math.abs(n.vy); }
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        n.lit = Math.sqrt(mdx * mdx + mdy * mdy) < MOUSE_RADIUS;
      }

      // Recalculate connections every 2 frames
      if (tick % 2 === 0) {
        const pairs: [number, number][] = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            if (dx * dx + dy * dy < CONN_DIST * CONN_DIST) pairs.push([i, j]);
          }
        }
        connRef.current = pairs;
      }

      // Draw connections
      for (const [i, j] of connRef.current) {
        const a = nodes[i];
        const b = nodes[j];
        const bothLit = a.lit && b.lit;
        const anyLit  = a.lit || b.lit;
        const alpha = dark
          ? (bothLit ? 0.35 : anyLit ? 0.18 : 0.06)
          : (bothLit ? 0.25 : anyLit ? 0.12 : 0.05);
        ctx.strokeStyle = dark
          ? `rgba(0,212,255,${alpha})`
          : `rgba(0,100,200,${alpha})`;
        ctx.lineWidth = bothLit ? 1 : 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw nodes
      for (const n of nodes) {
        const r   = n.lit ? 6 : 3;
        const glow = n.lit ? 15 : 0;
        ctx.shadowBlur  = glow;
        ctx.shadowColor = dark ? '#00d4ff' : '#0064c8';
        ctx.fillStyle   = dark
          ? (n.lit ? 'rgba(0,212,255,0.9)' : 'rgba(0,212,255,0.35)')
          : (n.lit ? 'rgba(0,100,200,0.85)' : 'rgba(0,100,200,0.30)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Advance + draw pulses
      pulsesRef.current = pulses.filter(p => {
        p.progress = Math.min(1, (now - p.startTime) / p.duration);
        const t  = easeInOut(p.progress);
        const px = p.fromX + (p.toX - p.fromX) * t;
        const py = p.fromY + (p.toY - p.fromY) * t;

        ctx.shadowBlur  = 10;
        ctx.shadowColor = dark ? '#ffffff' : '#0064c8';
        ctx.fillStyle   = dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,80,200,0.85)';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return p.progress < 1;
      });
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(pulseTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

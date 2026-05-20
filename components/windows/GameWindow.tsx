'use client';

import { useRef, useEffect, useState } from 'react';

const W = 520, H = 380;
const COLS = 8, ROWS_COUNT = 6;
const PAD = 18, GAP = 4, TOP = 26;
const BW = (W - PAD * 2 - GAP * (COLS - 1)) / COLS;
const BH = 20;
const MAX_LEVEL = 3;
const TRAIL_MAX = 14;

const ROWS_DEF = [
  { label: 'L6', long: 'APP', color: '#00d4ff', hits: 1 },
  { label: 'L5', long: 'SES', color: '#00b6ea', hits: 1 },
  { label: 'L4', long: 'TCP', color: '#3a7bff', hits: 1 },
  { label: 'L3', long: 'NET', color: '#7c3aed', hits: 2 },
  { label: 'L2', long: 'L2',  color: '#ff9500', hits: 2 },
  { label: 'L1', long: 'PHY', color: '#ff4757', hits: 3 },
];

type GameState = 'start' | 'play' | 'flash' | 'over' | 'win';
type OverlayType = GameState | null;

type Block = {
  x: number; y: number; w: number; h: number;
  row: number; color: string; maxHits: number; hits: number;
  label: string; long: string; alive: boolean; flashT: number;
};
type Ball    = { x: number; y: number; r: number; vx: number; vy: number; stuck: boolean; baseSpeed: number };
type Paddle  = { x: number; y: number; w: number; h: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string };

function hexToRgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function TermTyper() {
  const [text, setText] = useState('');
  const full = 'sudo breach --target=firewall';
  const iRef = useRef(0);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    function step() {
      if (iRef.current <= full.length) {
        setText(full.slice(0, iRef.current));
        iRef.current++;
        tid = setTimeout(step, 55);
      } else {
        tid = setTimeout(() => { iRef.current = 0; step(); }, 1800);
      }
    }
    step();
    return () => clearTimeout(tid);
  }, []);

  return (
    <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '11.5px', color: 'rgba(0,212,255,0.7)', letterSpacing: '.04em', marginTop: '18px' }}>
      <span style={{ color: 'rgba(255,255,255,.4)' }}>izanos@kali:~$ </span>
      <span>{text}</span>
      <span style={{ display: 'inline-block', width: '7px', height: '12px', verticalAlign: 'text-bottom', background: '#00d4ff', marginLeft: '3px', boxShadow: '0 0 6px #00d4ff', animation: 'fb-blink 1.05s steps(1) infinite' }} />
    </div>
  );
}

export default function GameWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);

  const [score,      setScoreState]  = useState(0);
  const [level,      setLevelState]  = useState(1);
  const [lives,      setLivesState]  = useState(3);
  const [overlay,    setOverlay]     = useState<OverlayType>('start');
  const [finalScore, setFinalScore]  = useState(0);
  const [finalLevel, setFinalLevel]  = useState(1);

  const gRef = useRef({
    state:     'start' as GameState,
    score:     0,
    level:     1,
    lives:     3,
    blocks:    [] as Block[],
    particles: [] as Particle[],
    ball:      null as Ball | null,
    paddle:    null as Paddle | null,
    trail:     [] as { x: number; y: number }[],
    keys:      { left: false, right: false },
    mouseX:    null as number | null,
  });

  const rafRef         = useRef<number | null>(null);
  const flashTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const g      = gRef.current;
    const canvas = canvasRef.current!;
    const stage  = stageRef.current!;
    const ctx    = canvas.getContext('2d')!;

    function makeBlocks() {
      g.blocks = [];
      for (let r = 0; r < ROWS_COUNT; r++) {
        const def = ROWS_DEF[r];
        for (let c = 0; c < COLS; c++) {
          g.blocks.push({
            x: PAD + c * (BW + GAP), y: TOP + r * (BH + GAP),
            w: BW, h: BH, row: r,
            color: def.color, maxHits: def.hits, hits: def.hits,
            label: def.label, long: def.long, alive: true, flashT: 0,
          });
        }
      }
    }

    function makeBall() {
      g.ball   = { x: W / 2, y: H - 50, r: 5, vx: 0, vy: 0, stuck: true, baseSpeed: 3.4 + (g.level - 1) * 0.55 };
      g.paddle = { x: W / 2 - 40, y: H - 22, w: 80, h: 8 };
      g.trail  = [];
    }

    function startBall() {
      if (!g.ball) return;
      g.ball.stuck = false;
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.6;
      g.ball.vx = Math.cos(angle) * g.ball.baseSpeed;
      g.ball.vy = Math.sin(angle) * g.ball.baseSpeed;
    }

    function spawnBurst(x: number, y: number, color: string, n: number) {
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp  = 1 + Math.random() * 3.2;
        g.particles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.5, life: 0, max: 24 + Math.random() * 12, size: 1 + Math.random() * 2.2, color });
      }
    }

    function win() {
      g.state = 'win';
      setFinalScore(g.score);
      setOverlay('win');
    }

    function levelClear() {
      g.state = 'flash';
      setOverlay('flash');
      flashTimerRef.current = setTimeout(() => {
        g.level++;
        setLevelState(g.level);
        makeBlocks();
        makeBall();
        g.state = 'play';
        setOverlay(null);
        launchTimerRef.current = setTimeout(() => {
          if (g.state === 'play') startBall();
        }, 200);
      }, 1300);
    }

    function checkLevelClear() {
      if (g.blocks.some(b => b.alive)) return;
      if (g.level >= MAX_LEVEL) win(); else levelClear();
    }

    function loseLife() {
      g.lives--;
      setLivesState(g.lives);
      if (g.lives <= 0) {
        g.state = 'over';
        setFinalScore(g.score);
        setFinalLevel(g.level);
        setOverlay('over');
      } else {
        makeBall();
      }
    }

    function restart() {
      if (flashTimerRef.current)  clearTimeout(flashTimerRef.current);
      if (launchTimerRef.current) clearTimeout(launchTimerRef.current);
      g.score = 0; g.level = 1; g.lives = 3;
      setScoreState(0); setLevelState(1); setLivesState(3);
      makeBlocks();
      makeBall();
      g.state = 'play';
      setOverlay(null);
      startBall();
    }

    function handleStartOrShoot() {
      if (g.state === 'start') {
        setOverlay(null);
        g.state = 'play';
        startBall();
      } else if (g.state === 'over' || g.state === 'win') {
        restart();
      } else if (g.state === 'play' && g.ball?.stuck) {
        startBall();
      }
    }

    function hitBlock(b: Block) {
      b.hits--; b.flashT = 1;
      g.score += 25 * b.maxHits;
      setScoreState(g.score);
      if (b.hits <= 0) {
        b.alive = false;
        spawnBurst(b.x + b.w / 2, b.y + b.h / 2, b.color, 18);
        g.score += 50;
        setScoreState(g.score);
        checkLevelClear();
      } else {
        spawnBurst(b.x + b.w / 2, b.y + b.h / 2, b.color, 6);
      }
    }

    function update() {
      if (g.state !== 'play') return;
      const ball = g.ball!, paddle = g.paddle!;

      if (g.mouseX !== null) {
        const t = g.mouseX - paddle.w / 2;
        paddle.x += (t - paddle.x) * 0.32;
      }
      if (g.keys.left)  paddle.x -= 6;
      if (g.keys.right) paddle.x += 6;
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));

      if (ball.stuck) {
        ball.x = paddle.x + paddle.w / 2;
        ball.y = paddle.y - ball.r - 1;
        return;
      }

      ball.x += ball.vx; ball.y += ball.vy;
      g.trail.push({ x: ball.x, y: ball.y });
      if (g.trail.length > TRAIL_MAX) g.trail.shift();

      if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx *= -1; }
      if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.vx *= -1; }
      if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy *= -1; }
      if (ball.y - ball.r > H) { loseLife(); return; }

      if (ball.vy > 0 && ball.x > paddle.x && ball.x < paddle.x + paddle.w &&
          ball.y + ball.r >= paddle.y && ball.y < paddle.y + paddle.h) {
        ball.y = paddle.y - ball.r;
        const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        const angle  = offset * (Math.PI / 3);
        const speed  = Math.hypot(ball.vx, ball.vy);
        ball.vx = Math.sin(angle) * speed;
        ball.vy = -Math.abs(Math.cos(angle) * speed);
      }

      for (const b of g.blocks) {
        if (!b.alive) continue;
        if (ball.x + ball.r < b.x || ball.x - ball.r > b.x + b.w) continue;
        if (ball.y + ball.r < b.y || ball.y - ball.r > b.y + b.h) continue;
        const prevX = ball.x - ball.vx, prevY = ball.y - ball.vy;
        const fromLR = (prevX + ball.r <= b.x) || (prevX - ball.r >= b.x + b.w);
        const fromTB = (prevY + ball.r <= b.y) || (prevY - ball.r >= b.y + b.h);
        if (fromLR && !fromTB) ball.vx *= -1;
        else if (fromTB && !fromLR) ball.vy *= -1;
        else { ball.vx *= -1; ball.vy *= -1; }
        hitBlock(b);
        break;
      }
    }

    function drawGrid() {
      ctx.save();
      ctx.strokeStyle = 'rgba(0,212,255,0.05)'; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(0,212,255,0.07)';
      ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H - W * .35); ctx.stroke();
      ctx.restore();
    }

    function drawBlock(b: Block) {
      const dmg   = 1 - b.hits / b.maxHits;
      const baseA = 0.85 - dmg * 0.25;
      const flash = b.flashT > 0 ? Math.min(b.flashT, 1) : 0;
      b.flashT *= 0.9;

      if (flash > 0.05) {
        ctx.save(); ctx.shadowColor = b.color; ctx.shadowBlur = 18 * flash;
        ctx.fillStyle = hexToRgba(b.color, 0); ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.restore();
      }

      ctx.fillStyle = hexToRgba(b.color, baseA);
      roundRect(ctx, b.x, b.y, b.w, b.h, 3); ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, 1.4);

      ctx.strokeStyle = hexToRgba(b.color, 0.95); ctx.lineWidth = 1;
      roundRect(ctx, b.x + .5, b.y + .5, b.w - 1, b.h - 1, 3); ctx.stroke();

      if (b.maxHits > 1 && b.hits < b.maxHits) {
        const cracks = b.maxHits - b.hits;
        ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1;
        for (let i = 0; i < cracks; i++) {
          const sx = b.x + b.w * (0.18 + i * 0.45), sy = b.y + 1;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 4, sy + b.h * .45);
          ctx.lineTo(sx - 3, sy + b.h * .75); ctx.lineTo(sx + 5, b.y + b.h - 1); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        for (let i = 0; i < cracks; i++) ctx.fillRect(b.x + 4 + i * 8, b.y + b.h - 3, 2, 1);
      }

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '700 8px "JetBrains Mono", ui-monospace, monospace';
      ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText(b.label + '·' + b.long, b.x + b.w / 2, b.y + b.h / 2 + 1);
    }

    function drawPaddle() {
      const { x, y, w, h } = g.paddle!;
      ctx.save(); ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(0,212,255,0)'; ctx.fillRect(x, y + h, w, 1); ctx.restore();

      ctx.fillStyle = 'rgba(255,255,255,0.2)'; roundRect(ctx, x, y, w, h, 3); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(x + 2, y + 1, w - 4, 1);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1;
      roundRect(ctx, x + .5, y + .5, w - 1, h - 1, 3); ctx.stroke();

      ctx.fillStyle = 'rgba(0,212,255,0.65)'; ctx.fillRect(x + 4, y + h + 1, w - 8, 1);
      ctx.fillStyle = 'rgba(0,212,255,0.2)';  ctx.fillRect(x + 2, y + h + 2, w - 4, 1);
    }

    function drawBall() {
      const ball = g.ball!;
      for (let i = 0; i < g.trail.length; i++) {
        const t = g.trail[i];
        ctx.fillStyle = `rgba(0,212,255,${(i / g.trail.length) * 0.5})`;
        const r = ball.r * (i / g.trail.length) * 1.2;
        ctx.beginPath(); ctx.arc(t.x, t.y, Math.max(.6, r), 0, Math.PI * 2); ctx.fill();
      }
      ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function drawParticles() {
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.99;
        const a = Math.max(0, 1 - p.life / p.max);
        if (a <= 0) { g.particles.splice(i, 1); continue; }
        ctx.fillStyle = hexToRgba(p.color, a);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      const dim = (g.state === 'start' || g.state === 'over' || g.state === 'win') ? 0.45 : 1;
      ctx.globalAlpha = dim;
      drawGrid();
      for (const b of g.blocks) if (b.alive) drawBlock(b);
      drawParticles();
      drawPaddle();
      drawBall();
      ctx.globalAlpha = 1;
    }

    function loop() {
      update(); render();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onMouseMove  = (e: MouseEvent) => { const rect = canvas.getBoundingClientRect(); g.mouseX = (e.clientX - rect.left) * (W / rect.width); };
    const onMouseLeave = () => { g.mouseX = null; };
    const onClick      = () => handleStartOrShoot();
    const onKeyDown    = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  g.keys.left  = true;
      if (e.key === 'ArrowRight') g.keys.right = true;
      if (e.code === 'Space') { e.preventDefault(); handleStartOrShoot(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  g.keys.left  = false;
      if (e.key === 'ArrowRight') g.keys.right = false;
    };

    stage.addEventListener('mousemove',  onMouseMove);
    stage.addEventListener('mouseleave', onMouseLeave);
    stage.addEventListener('click',      onClick);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup',   onKeyUp);

    makeBlocks();
    makeBall();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current)         cancelAnimationFrame(rafRef.current);
      if (flashTimerRef.current)  clearTimeout(flashTimerRef.current);
      if (launchTimerRef.current) clearTimeout(launchTimerRef.current);
      stage.removeEventListener('mousemove',  onMouseMove);
      stage.removeEventListener('mouseleave', onMouseLeave);
      stage.removeEventListener('click',      onClick);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup',   onKeyUp);
    };
  }, []);

  const shieldPath = 'M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5z';
  const ov: React.CSSProperties = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    background: 'rgba(8,8,16,0.7)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    pointerEvents: 'none',
    transition: 'opacity .25s ease',
  };

  return (
    <>
      <style>{`
        @keyframes fb-blink   { 50% { opacity: 0; } }
        @keyframes fb-breathe { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes fb-glitchA {
          0%,92%,100% { transform: translate(2px,0); }
          93% { transform: translate(-3px,-1px); clip-path: polygon(0 10%,100% 10%,100% 22%,0 22%); }
          96% { transform: translate(4px,0);     clip-path: polygon(0 65%,100% 65%,100% 75%,0 75%); }
        }
        @keyframes fb-glitchB {
          0%,92%,100% { transform: translate(-2px,0); }
          94% { transform: translate(3px,1px);  clip-path: polygon(0 40%,100% 40%,100% 55%,0 55%); }
          97% { transform: translate(-4px,0);   clip-path: polygon(0 5%,100% 5%,100% 18%,0 18%); }
        }
        @keyframes fb-flashIn {
          0%   { transform: scale(.7);    opacity: 0; filter: blur(8px); }
          60%  { transform: scale(1.05);  opacity: 1; filter: blur(0); }
          100% { transform: scale(1);     opacity: 1; }
        }
        @keyframes fb-over-glitchA {
          0%,92%,100% { transform: translate(2px,0); }
          93% { transform: translate(-3px,-1px); clip-path: polygon(0 10%,100% 10%,100% 22%,0 22%); }
          96% { transform: translate(4px,0);     clip-path: polygon(0 65%,100% 65%,100% 75%,0 75%); }
        }
        @keyframes fb-over-glitchB {
          0%,92%,100% { transform: translate(-2px,0); }
          94% { transform: translate(3px,1px);  clip-path: polygon(0 40%,100% 40%,100% 55%,0 55%); }
          97% { transform: translate(-4px,0);   clip-path: polygon(0 5%,100% 5%,100% 18%,0 18%); }
        }
      `}</style>

      <div style={{ background: '#0a0a0f', padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, minHeight: 0 }}>

        {/* HUD */}
        <div style={{ height: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '13px', fontWeight: 700, color: '#00d4ff', letterSpacing: '.08em', textShadow: '0 0 8px rgba(0,212,255,.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 500, color: 'rgba(0,212,255,.55)', letterSpacing: '.18em' }}>BREACH</span>
            <span>{String(score).padStart(4, '0')}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.4)', letterSpacing: '.14em', paddingLeft: '10px', marginLeft: '8px', borderLeft: '1px solid rgba(255,255,255,.1)' }}>
              LEVEL {String(level).padStart(2, '0')} / 0{MAX_LEVEL}
            </span>
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '.25em' }}>FIREWALL BREAKER</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2].map(i => (
              <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ width: '18px', height: '18px', color: i < lives ? '#00d4ff' : 'rgba(255,255,255,.12)', filter: i < lives ? 'drop-shadow(0 0 4px rgba(0,212,255,.5))' : 'none', transition: 'opacity .25s, transform .25s' }}>
                <path d={shieldPath} />
              </svg>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          style={{ position: 'relative', width: '520px', height: '380px', alignSelf: 'center', borderRadius: '10px', border: '1px solid rgba(255,255,255,.06)', overflow: 'hidden', background: '#080810', cursor: 'none' }}
        >
          <canvas ref={canvasRef} width={520} height={380} style={{ display: 'block', width: '520px', height: '380px' }} />

          {/* Start overlay */}
          <div style={{ ...ov, opacity: overlay === 'start' ? 1 : 0 }}>
            <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '38px', fontWeight: 800, letterSpacing: '.04em', color: '#00d4ff', textShadow: '0 0 18px rgba(0,212,255,.5), 0 0 38px rgba(0,212,255,.3)', position: 'relative' }}>
              FIREWALL BREAKER
              <span style={{ position: 'absolute', left: 0, top: 0, width: '100%', color: '#ff4757', transform: 'translate(2px,0)', mixBlendMode: 'screen', opacity: .55, clipPath: 'polygon(0 0,100% 0,100% 30%,0 30%)', animation: 'fb-glitchA 3.6s infinite linear', pointerEvents: 'none' }}>FIREWALL BREAKER</span>
              <span style={{ position: 'absolute', left: 0, top: 0, width: '100%', color: '#00ff88', transform: 'translate(-2px,0)', mixBlendMode: 'screen', opacity: .5, clipPath: 'polygon(0 60%,100% 60%,100% 100%,0 100%)', animation: 'fb-glitchB 4.2s infinite linear', pointerEvents: 'none' }}>FIREWALL BREAKER</span>
            </div>
            {overlay === 'start' && <TermTyper />}
            <div style={{ marginTop: '28px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '.14em', animation: 'fb-breathe 2.4s ease-in-out infinite', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Click or press</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.05)', fontSize: '10.5px', color: 'rgba(255,255,255,.8)', letterSpacing: '.08em' }}>SPACE</span>
              <span>to initiate breach</span>
            </div>
          </div>

          {/* Level clear flash */}
          <div style={{ ...ov, opacity: overlay === 'flash' ? 1 : 0 }}>
            <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '42px', fontWeight: 900, letterSpacing: '.04em', color: '#00ff88', textShadow: '0 0 22px rgba(0,255,136,.6), 0 0 48px rgba(0,255,136,.35)', animation: overlay === 'flash' ? 'fb-flashIn .35s ease-out' : 'none' }}>ACCESS GRANTED</div>
            <div style={{ marginTop: '10px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '12px', color: 'rgba(0,255,136,.8)', letterSpacing: '.2em' }}>— ADVANCING TO NEXT LAYER —</div>
          </div>

          {/* Game over */}
          <div style={{ ...ov, opacity: overlay === 'over' ? 1 : 0 }}>
            <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '36px', fontWeight: 800, color: '#ff4757', letterSpacing: '.04em', textShadow: '0 0 18px rgba(255,71,87,.55)', position: 'relative' }}>
              CONNECTION LOST
              <span style={{ position: 'absolute', left: 0, top: 0, width: '100%', color: '#00d4ff', transform: 'translate(2px,0)', mixBlendMode: 'screen', opacity: .65, animation: 'fb-over-glitchA 1.2s infinite linear', pointerEvents: 'none' }}>CONNECTION LOST</span>
              <span style={{ position: 'absolute', left: 0, top: 0, width: '100%', color: '#fff', transform: 'translate(-2px,0)', mixBlendMode: 'screen', opacity: .35, animation: 'fb-over-glitchB 1.6s infinite linear', pointerEvents: 'none' }}>CONNECTION LOST</span>
            </div>
            <div style={{ marginTop: '22px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '12px', color: 'rgba(255,255,255,.6)', letterSpacing: '.14em' }}>
              SCORE · <b style={{ color: '#00d4ff', fontWeight: 700 }}>{String(finalScore).padStart(4, '0')}</b> · LEVEL · <b style={{ color: '#00d4ff', fontWeight: 700 }}>{String(finalLevel).padStart(2, '0')}</b>
            </div>
            <div style={{ marginTop: '20px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '.14em', animation: 'fb-breathe 2.4s ease-in-out infinite', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Press</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.05)', fontSize: '10.5px', color: 'rgba(255,255,255,.8)' }}>SPACE</span>
              <span>to reconnect</span>
            </div>
          </div>

          {/* Win */}
          <div style={{ ...ov, opacity: overlay === 'win' ? 1 : 0 }}>
            <div style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '44px', fontWeight: 900, color: '#00ff88', letterSpacing: '.03em', textShadow: '0 0 22px rgba(0,255,136,.6), 0 0 48px rgba(0,255,136,.35)', animation: overlay === 'win' ? 'fb-flashIn .55s ease-out' : 'none' }}>SYSTEM BREACHED</div>
            <div style={{ marginTop: '14px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '13px', color: 'rgba(0,255,136,.85)', letterSpacing: '.2em', animation: overlay === 'win' ? 'fb-flashIn .55s ease-out .15s both' : 'none' }}>— FULL ACCESS GRANTED —</div>
            <div style={{ marginTop: '22px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '12px', color: 'rgba(255,255,255,.6)', letterSpacing: '.14em', animation: overlay === 'win' ? 'fb-flashIn .55s ease-out .3s both' : 'none' }}>
              FINAL SCORE · <b style={{ color: '#00ff88', fontWeight: 700 }}>{String(finalScore).padStart(4, '0')}</b>
            </div>
            <div style={{ marginTop: '22px', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,255,255,.45)', letterSpacing: '.14em', animation: 'fb-breathe 2.4s ease-in-out infinite', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Press</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.05)', fontSize: '10.5px', color: 'rgba(255,255,255,.8)' }}>SPACE</span>
              <span>to play again</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

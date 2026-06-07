'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const MONO   = 'var(--font-jetbrains), monospace';
const TERM   = '#00ff41';
const CYAN   = '#00f5ff';
const YELLOW = '#ffcc00';
const DIM    = '#00aa2a';

/* ── mild password obfuscation ── */
const _p = (s: string) => s;
const PASS = _p(['iz','an','20','24'].join(''));

/* ── boot sequence ── */
interface BootLine { text: string; type?: 'ok' | 'warn' | 'dim' | 'plain'; delay: number; }
const BOOT_SEQ: BootLine[] = [
  { delay:    0, text: '[    0.000000] Linux version 6.1.0-kali7-amd64 (devel@kali.org) #1 SMP PREEMPT_DYNAMIC' },
  { delay:  800, text: '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.1.0-kali root=/dev/sda1 ro quiet' },
  { delay: 1800, text: '[    0.004210] x86/fpu: Supporting XSAVE feature 0x002: \'SSE registers\'' },
  { delay: 2800, text: '[    0.118934] Memory: 4096MB available' },
  { delay: 3600, text: '[    0.342017] ACPI: Core revision 20220331' },
  { delay: 4400, text: '[    0.512288] [ OK ] Started Network Manager',        type: 'ok'   },
  { delay: 5200, text: '[    0.733401] [ OK ] Mounted /dev/sda1 on /',         type: 'ok'   },
  { delay: 6000, text: '[    0.901225] [ OK ] Reached target Basic System',    type: 'ok'   },
  { delay: 7200, text: '[    1.204870] [ WARN ] ssh: weak host key detected (intentional)', type: 'warn' },
  { delay: 8400, text: '[    1.556032] [ OK ] Started OpenSSH server',         type: 'ok'   },
  { delay: 9600, text: '[    1.889145] [ OK ] Started CTF challenge service',  type: 'ok'   },
  { delay:11000, text: '[    2.013998] Starting izanos-vulnerable...' },
];

/* ── terminal output types ── */
type LineType = 'prompt' | 'output' | 'output-cyan' | 'output-yellow' | 'output-dim' | 'flag' | 'b64' | 'error' | 'password-prompt' | 'blank';
interface TermLine { id: number; type: LineType; text: string; promptText?: string; }

let _lid = 0;
const mkLine = (type: LineType, text: string, promptText?: string): TermLine => ({ id: _lid++, type, text, promptText });

/* ── command outputs ── */
const LS_OUTPUT = `total 24
-rw-r--r-- 1 guest guest  220 jun  7 13:58 README.txt
-rw-r--r-- 1 guest guest   88 jun  7 14:01 notes.enc
-rwsr-x--x 1 root  root  8344 jun  7 13:59 check_flag`;

const LS_LA_OUTPUT = `total 24
drwxr-xr-x 2 guest guest 4096 jun  7 14:02 .
drwxr-xr-x 4 root  root  4096 jun  7 13:58 ..
-rw-r--r-- 1 guest guest  220 jun  7 13:58 README.txt
-rw-r--r-- 1 guest guest   88 jun  7 14:01 notes.enc
-rwsr-x--x 1 root  root  8344 jun  7 13:59 \x00check_flag`;

const README = `  ┌─────────────────────────────────────────┐
  │   IzanOS Vulnerable VM · CTF Challenge  │
  └─────────────────────────────────────────┘
  Objetivo: encontrar la flag y ejecutar ./check_flag
  Pista #1: a veces lo que parece cifrado solo está codificado.`;

const B64_ENCODED = 'RmxhZ3M6IGVsIGJhc2U2NCBubyBlcyBjaWZyYWRvLiBQcnVlYmEgYSBkZWNvZGlmaWNhciAtPiBzaWd1aWVudGUgcGlzdGEgZW4gL29wdC8uaGlkZGVu';
const B64_DECODED = 'Flags: el base64 no es cifrado. Prueba a decodificar → siguiente pista en /opt/.hidden';

const HELP_TEXT = `Comandos disponibles:
  ls, ls -la, cat [archivo], base64 -d [archivo],
  cd [directorio], pwd, whoami, hostname, uname -a,
  sudo [comando], ./check_flag, clear`;

const FLAG_TEXT = `██████████████████████████████████████

    IzanCTF{y0u_found_th3_r34l_1z4n}

██████████████████████████████████████
Congratulations. You found the real Izan.
Execute ./check_flag to claim your certificate.`;

/* ── Certificate Component ── */
function Certificate({ name, date }: { name: string; date: string }) {
  return (
    <div id="cert-preview" style={{
      width: 800, height: 500, background: '#050a0f', position: 'relative',
      fontFamily: MONO, overflow: 'hidden', padding: '32px 40px',
      backgroundImage: 'linear-gradient(rgba(0,245,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,.04) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}>
      {/* Scan line animation */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,245,255,.6), transparent)', zIndex: 10, animation: 'scanline 3s linear infinite' }} />
      {/* Corner brackets */}
      {[{ t:8,l:8 },{ t:8,r:8 },{ b:8,l:8 },{ b:8,r:8 }].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', width: 20, height: 20, border: '2px solid rgba(0,245,255,.5)', ...(pos.t !== undefined ? { top: pos.t } : { bottom: pos.b }), ...(pos.l !== undefined ? { left: pos.l } : { right: pos.r }), borderRadius: 2, ...(i === 0 ? { borderRight:'none', borderBottom:'none' } : i === 1 ? { borderLeft:'none', borderBottom:'none' } : i === 2 ? { borderRight:'none', borderTop:'none' } : { borderLeft:'none', borderTop:'none' }) }} />
      ))}
      {/* Logo top-left */}
      <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="28" height="28" viewBox="0 0 100 100">
          <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00f5ff"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
          <polygon points="50,8 86,29 86,71 50,92 14,71 14,29" stroke="url(#cg)" strokeWidth="5" fill="none"/>
          <text x="50" y="66" textAnchor="middle" fill="url(#cg)" fontSize="32" fontWeight="bold">IZ</text>
        </svg>
        <span style={{ fontSize: 11, color: 'rgba(0,245,255,.7)', letterSpacing: '0.15em' }}>IZANOS AURORA</span>
      </div>
      {/* Verified badge */}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid rgba(0,255,65,.4)', borderRadius: 999, color: '#00ff41', fontSize: 10, letterSpacing: '0.1em' }}>
        <span>✓</span> Verified
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', paddingTop: 20 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6 }}>CERTIFICATE of completion</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>This certifies that</div>
        <div style={{ fontSize: 42, fontWeight: 700, background: 'linear-gradient(135deg,#fff,#00f5ff,#a855f7)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: 16 }}>
          {name || 'Hacker'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', maxWidth: 580, lineHeight: 1.7, marginBottom: 20 }}>
          has successfully breached IzanOS-Vulnerable-v1.0, navegando a través de sus defensas y capturando
          la flag — demostrando habilidad real en Linux enumeration, cryptographic analysis y privilege escalation.
        </div>
        <div style={{ padding: '8px 24px', border: '1px solid rgba(0,245,255,.5)', borderRadius: 8, fontFamily: MONO, color: CYAN, fontSize: 13, letterSpacing: '0.05em', marginBottom: 24, background: 'rgba(0,245,255,.06)' }}>
          IzanCTF&#123;y0u_found_th3_r34l_1z4n&#125;
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: 'rgba(255,255,255,.35)', fontSize: 10, letterSpacing: '0.1em' }}>
          <span>Issued by Izan Rubio Cerezo</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,.2)' }} />
          <span>{date}</span>
          <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,.2)' }} />
          <span style={{ color: 'rgba(255,149,0,.8)' }}>MEDIUM</span>
        </div>
        <div style={{ marginTop: 10, color: 'rgba(255,255,255,.2)', fontSize: 10 }}>izanrubio.info · IzanOS Aurora CTF Challenge</div>
      </div>
      <style>{`@keyframes scanline { from { top: 0 } to { top: 100% } }`}</style>
    </div>
  );
}

/* ── Props ── */
interface Props {
  shutdownPending: boolean;
  onCancelShutdown: () => void;
  onConfirmShutdown: () => void;
}

export default function VMRunningWindow({ shutdownPending, onCancelShutdown, onConfirmShutdown }: Props) {
  /* phases: boot | terminal */
  const [phase, setPhase]           = useState<'boot' | 'terminal'>('boot');
  const [bootLines, setBootLines]   = useState<BootLine[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [progressVal, setProgressVal]   = useState(0);
  const [showLogin, setShowLogin]   = useState(false);

  /* terminal */
  const [termLines, setTermLines]   = useState<TermLine[]>([]);
  const [input, setInput]           = useState('');
  const [maskInput, setMaskInput]   = useState(false);
  const [pendingSudo, setPendingSudo] = useState(false);
  const [sudoAttempts, setSudoAttempts] = useState(0);
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx]       = useState(-1);

  /* certificate */
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName]     = useState('');
  const [certGenerated, setCertGenerated] = useState(false);
  const [certDate, setCertDate]     = useState('');
  const [generating, setGenerating] = useState(false);

  const bootRef  = useRef<HTMLDivElement>(null);
  const termRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll */
  useEffect(() => { bootRef.current?.scrollTo(0, bootRef.current.scrollHeight); }, [bootLines, showProgress, showLogin]);
  useEffect(() => { termRef.current?.scrollTo(0, termRef.current.scrollHeight); }, [termLines]);

  /* Boot sequence */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_SEQ.forEach(line => {
      timers.push(setTimeout(() => setBootLines(prev => [...prev, line]), line.delay));
    });
    timers.push(setTimeout(() => setShowProgress(true), 13000));
    /* progress bar fill */
    let p = 0;
    const prog = setInterval(() => {
      p += 2.5;
      setProgressVal(Math.min(p, 100));
      if (p >= 100) clearInterval(prog);
    }, 75);
    timers.push(setTimeout(() => setShowLogin(true), 17000));
    timers.push(setTimeout(() => {
      setPhase('terminal');
      setTermLines([
        mkLine('blank', ''),
        mkLine('output-dim', 'Kali GNU/Linux Rolling · izanos-vulnerable tty1'),
        mkLine('blank', ''),
        mkLine('output', 'Last login: Sat Jun  7 14:01:33 2025 from 192.168.56.1'),
        mkLine('blank', ''),
      ]);
    }, 20000));
    return () => { timers.forEach(clearTimeout); clearInterval(prog); };
  }, []);

  /* Terminal commands */
  const addLine  = useCallback((l: TermLine) => setTermLines(prev => [...prev, l]), []);
  const addOut   = useCallback((text: string, type: LineType = 'output') => addLine(mkLine(type, text)), [addLine]);
  const addBlank = useCallback(() => addLine(mkLine('blank', '')), [addLine]);

  const handleCommand = useCallback((raw: string) => {
    const cmd = raw.trim();

    if (pendingSudo) {
      /* sudo password input */
      addLine(mkLine('password-prompt', ''));
      if (cmd === PASS) {
        addBlank();
        addLine(mkLine('flag', FLAG_TEXT));
        setFlagRevealed(true);
        setPendingSudo(false);
        setSudoAttempts(0);
        setMaskInput(false);
      } else {
        const att = sudoAttempts + 1;
        setSudoAttempts(att);
        if (att >= 3) {
          addOut('sudo: 3 incorrect password attempts', 'error');
          setPendingSudo(false);
          setMaskInput(false);
          setSudoAttempts(0);
        } else {
          addOut('Sorry, try again.', 'error');
          addOut('[sudo] password for guest: ', 'password-prompt');
        }
      }
      return;
    }

    addLine(mkLine('prompt', cmd));
    if (!cmd) return;
    setCmdHistory(h => [cmd, ...h]);
    setHistIdx(-1);

    /* Parse piped commands first */
    if (cmd === 'cat notes.enc | base64 -d') { addOut(B64_DECODED); addBlank(); return; }
    if (cmd === 'cat /opt/.hidden/pass.txt | base64 -d') { addOut('hashed: not that easy ;)'); addBlank(); return; }

    const parts = cmd.split(/\s+/);
    const c = parts[0];

    switch (c) {
      case 'clear':
        setTermLines([]);
        return;
      case 'help':
        addOut(HELP_TEXT); addBlank(); return;
      case 'whoami':
        addOut('guest'); addBlank(); return;
      case 'hostname':
        addOut('izanos-vulnerable'); addBlank(); return;
      case 'pwd':
        addOut('/home/guest'); addBlank(); return;
      case 'uname':
        addOut('Linux izanos-vulnerable 6.1.0-kali #1 SMP x86_64 GNU/Linux'); addBlank(); return;
      case 'ls': {
        const a = parts[1];
        if (a === '-la') {
          /* render ls -la with check_flag highlighted */
          LS_LA_OUTPUT.split('\n').forEach(line => {
            if (line.includes('\x00check_flag')) {
              addLine(mkLine('output-cyan', line.replace('\x00', '')));
            } else {
              addOut(line);
            }
          });
        } else if (a === '/opt') {
          addOut('(directorio vacío aparente)');
        } else if (a === '/opt/.hidden') {
          addOut('pass.txt  hint.txt');
        } else {
          addOut(LS_OUTPUT);
        }
        addBlank(); return;
      }
      case 'cat': {
        const file = parts.slice(1).join(' ');
        if (file === 'README.txt')              { addOut(README); addBlank(); return; }
        if (file === 'notes.enc')               { addLine(mkLine('b64', B64_ENCODED)); addBlank(); return; }
        if (file === '/opt/.hidden/hint.txt')   { addOut('La password de root tiene exactamente 8 caracteres.\nEstá compuesta por: nombre del autor + año de creación del portfolio.\nFormato: [nombre][año]'); addBlank(); return; }
        if (file === '/opt/.hidden/pass.txt')   { addLine(mkLine('b64', 'aGFzaGVkOiBub3QgdGhhdCBlYXN5IDsp')); addBlank(); return; }
        if (file === '/root/flag.txt')          { addOut('cat: /root/flag.txt: Permission denied', 'error'); addBlank(); return; }
        addOut(`cat: ${file}: No such file or directory`, 'error'); addBlank(); return;
      }
      case 'cd':
        if (!parts[1] || parts[1] === '~' || parts[1] === '/home/guest') { addBlank(); return; }
        addOut(`bash: cd: ${parts[1]}: Permission denied`, 'error'); addBlank(); return;
      case 'sudo': {
        const sub = parts.slice(1).join(' ');
        if (sub === 'cat /root/flag.txt' || sub === 'cat /root/flag.txt') {
          addOut('[sudo] password for guest: ', 'password-prompt');
          setPendingSudo(true);
          setMaskInput(true);
          return;
        }
        addOut('[sudo] password for guest: ', 'password-prompt');
        setPendingSudo(true);
        setMaskInput(true);
        return;
      }
      case './check_flag':
        if (!flagRevealed) {
          addOut('Permission denied. Find the flag first.', 'error');
        } else {
          addBlank();
          setShowCertModal(true);
          setCertDate(new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }));
        }
        addBlank(); return;
      default:
        addOut(`bash: ${c}: command not found`, 'error');
        addOut("Type 'help' for available commands.", 'output-dim');
        addBlank(); return;
    }
  }, [pendingSudo, sudoAttempts, flagRevealed, addLine, addOut, addBlank]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      setInput('');
      handleCommand(val);
    } else if (e.key === 'ArrowUp' && !pendingSudo) {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx] ?? '');
    } else if (e.key === 'ArrowDown' && !pendingSudo) {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : cmdHistory[idx] ?? '');
    }
  };

  /* Certificate generation */
  const generateCert = async () => {
    if (!certName.trim() || generating) return;
    setGenerating(true);
    try {
      const [html2canvas, { default: jsPDF }] = await Promise.all([
        import('html2canvas').then(m => m.default),
        import('jspdf'),
      ]);
      const el = document.getElementById('cert-preview');
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#050a0f' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`IzanOS-CTF-Certificate-${certName.replace(/\s+/g, '-')}.pdf`);
      setCertGenerated(true);
      /* Telegram notification */
      try {
        await fetch('/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `🏴 CTF Completado\n👤 Nombre: ${certName}\n🕐 Fecha: ${certDate}\n🎯 Flag: IzanCTF{y0u_found_th3_r34l_1z4n}\n🌐 izanrubio.info`,
          }),
        });
      } catch { /* fail silently */ }
    } finally {
      setGenerating(false);
    }
  };

  /* ── RENDER ── */
  return (
    <div className="h-full flex flex-col relative" style={{ background: '#000', fontFamily: MONO, color: TERM }}>

      {/* Scanlines overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg,rgba(0,255,65,.04) 0 1px,transparent 1px 3px)' }} />

      {/* ── BOOT PHASE ── */}
      {phase === 'boot' && (
        <div ref={bootRef} className="flex-1 overflow-y-auto" style={{ padding: '18px 22px', fontSize: 12.5, lineHeight: 1.55, zIndex: 1, scrollbarWidth: 'none' }}>
          {bootLines.map((l, i) => {
            let color = TERM;
            if (l.type === 'ok')   color = '#fff';
            if (l.type === 'warn') color = YELLOW;
            if (l.type === 'dim')  color = DIM;
            const parts = l.text.split(/(\[ OK \]|\[ WARN \]|\[.*?\])/g);
            return (
              <div key={i} style={{ color, whiteSpace: 'pre-wrap' }}>
                {parts.map((p, j) => {
                  if (/^\[.*?\]$/.test(p) && p.length < 20) {
                    const c = p === '[ OK ]' ? '#fff' : p === '[ WARN ]' ? YELLOW : DIM;
                    return <span key={j} style={{ color: c }}>{p}</span>;
                  }
                  return <span key={j}>{p}</span>;
                })}
              </div>
            );
          })}

          {showProgress && (
            <div style={{ margin: '14px 0 18px' }}>
              <div style={{ color: 'rgba(0,255,65,.7)', marginBottom: 6 }}>Loading initial ramdisk ...</div>
              <div style={{ width: 280, height: 14, border: '1px solid rgba(0,255,65,.5)', borderRadius: 2, padding: 2 }}>
                <div style={{ height: '100%', width: `${progressVal}%`, background: 'repeating-linear-gradient(90deg,#00ff41 0 8px,transparent 8px 11px)', transition: 'width .1s linear' }} />
              </div>
            </div>
          )}

          {showLogin && (
            <>
              <div style={{ color: 'rgba(0,255,65,.7)' }}>Kali GNU/Linux Rolling · izanos-vulnerable tty1</div>
              <div style={{ color: '#fff', marginTop: 6 }}>
                izanos-vulnerable login: <span style={{ color: TERM }}>guest</span>
                <span style={{ display: 'inline-block', width: 8, height: 14, background: TERM, verticalAlign: 'text-bottom', marginLeft: 3, boxShadow: `0 0 6px ${TERM}`, animation: 'termBlink 1.05s steps(1) infinite' }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TERMINAL PHASE ── */}
      {phase === 'terminal' && (
        <div className="h-full flex flex-col" style={{ zIndex: 1 }} onClick={() => inputRef.current?.focus()}>
          <div ref={termRef} className="flex-1 overflow-y-auto" style={{ padding: '18px 22px 8px', fontSize: 13, lineHeight: 1.65, color: '#cfe8d4', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,65,.25) transparent' }}>
            {termLines.map(l => {
              if (l.type === 'blank') return <div key={l.id} style={{ height: 4 }} />;
              if (l.type === 'prompt') return (
                <div key={l.id}>
                  <span style={{ color: TERM, fontWeight: 600 }}>guest@izanos-vulnerable</span>
                  <span style={{ color: '#5b9eff' }}>:~</span>
                  <span style={{ color: '#fff' }}>$ </span>
                  <span style={{ color: '#fff' }}>{l.text}</span>
                </div>
              );
              if (l.type === 'flag') return (
                <div key={l.id} style={{ color: CYAN, whiteSpace: 'pre-wrap', padding: '8px 0' }}>{l.text}</div>
              );
              if (l.type === 'b64') return (
                <div key={l.id} style={{ color: TERM, wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{l.text}</div>
              );
              if (l.type === 'error') return <div key={l.id} style={{ color: '#ff5f57', whiteSpace: 'pre-wrap' }}>{l.text}</div>;
              if (l.type === 'output-cyan') return (
                <div key={l.id} style={{ color: CYAN, whiteSpace: 'pre-wrap' }}>
                  {l.text.replace('check_flag', '')}
                  <span style={{ color: CYAN, fontWeight: 700 }}>check_flag</span>
                </div>
              );
              if (l.type === 'output-dim') return <div key={l.id} style={{ color: 'rgba(0,255,65,.55)', whiteSpace: 'pre-wrap' }}>{l.text}</div>;
              if (l.type === 'output-yellow') return <div key={l.id} style={{ color: YELLOW, whiteSpace: 'pre-wrap' }}>{l.text}</div>;
              if (l.type === 'password-prompt') return <div key={l.id} style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>{l.text}</div>;
              return <div key={l.id} style={{ color: '#a9c4ae', whiteSpace: 'pre-wrap' }}>{l.text}</div>;
            })}

            {/* Active prompt */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, color: '#fff' }}>
              {!pendingSudo ? (
                <>
                  <span style={{ color: TERM, fontWeight: 600 }}>guest@izanos-vulnerable</span>
                  <span style={{ color: '#5b9eff' }}>:~</span>
                  <span>$ </span>
                </>
              ) : null}
              <span>{maskInput ? '•'.repeat(input.length) : input}</span>
              <span style={{ display: 'inline-block', width: 8, height: 14, background: TERM, verticalAlign: 'text-bottom', marginLeft: 1, boxShadow: `0 0 6px ${TERM}`, animation: 'termBlink 1.05s steps(1) infinite' }} />
            </div>
          </div>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
          />
        </div>
      )}

      {/* ── SHUTDOWN MODAL ── */}
      {shutdownPending && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '28px 32px', width: 380, fontFamily: 'var(--font-inter)', color: '#f0f4ff' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span> Apagar máquina virtual
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 20 }}>
              ¿Estás seguro de que quieres apagar <strong style={{ color: '#fff' }}>IzanOS-Vulnerable-v1.0</strong>?<br/>
              Los datos no guardados se perderán.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onCancelShutdown} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,.15)', background: 'transparent', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-inter)' }}>
                Cancelar
              </button>
              <button onClick={onConfirmShutdown} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#ff5f57', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-inter)' }}>
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE MODAL ── */}
      {showCertModal && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 25, background: 'rgba(0,0,0,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 20 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(0,245,255,.2)', borderRadius: 12, padding: '24px 28px', width: '100%', maxWidth: 500, fontFamily: 'var(--font-inter)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: CYAN }}>🏴 CTF Completado — Genera tu certificado</div>
              <button onClick={() => setShowCertModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <label style={{ display: 'block', fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '0.15em', marginBottom: 8 }}>
              ¿CÓMO TE LLAMAS?
            </label>
            <input
              value={certName}
              onChange={e => setCertName(e.target.value)}
              placeholder="Tu nombre"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: '#fff', fontSize: 14, outline: 'none', marginBottom: 16, fontFamily: 'var(--font-inter)' }}
            />
            <button
              onClick={generateCert}
              disabled={!certName.trim() || generating}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: certName.trim() ? CYAN : 'rgba(0,245,255,.2)', color: certName.trim() ? '#00252a' : 'rgba(0,245,255,.4)', cursor: certName.trim() ? 'pointer' : 'default', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-inter)', transition: 'all .2s' }}
            >
              {generating ? 'Generando...' : certGenerated ? '✓ Descargado' : 'Generar certificado PDF'}
            </button>
            {certGenerated && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'rgba(0,255,65,.08)', border: '1px solid rgba(0,255,65,.2)', color: TERM, fontSize: 12, textAlign: 'center', fontFamily: MONO }}>
                ✓ Certificado descargado: IzanOS-CTF-Certificate-{certName}.pdf
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden certificate render target */}
      {showCertModal && certName && (
        <div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none', zIndex: -1 }}>
          <Certificate name={certName} date={certDate} />
        </div>
      )}

      <style>{`
        @keyframes termBlink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

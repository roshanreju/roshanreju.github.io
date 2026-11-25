import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Play, RotateCcw, Trophy, X } from 'lucide-react';

interface SecretVoidProps {
  open: boolean;
  onClose: () => void;
}

interface TargetNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

const LABELS = ['0DAY', 'RCE', 'LLM', 'C2', 'IAM', 'SQLi', 'XSS', 'ROOT', 'JWT', 'SSH'];
const GOAL_SCORE = 10;
const ROUND_SECONDS = 20;
const SECRET_FLAG = 'C4PTR4{y0u_pwn3d_th3_v01d}';

export default function SecretVoid({ open, onClose }: SecretVoidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [target, setTarget] = useState<TargetNode>({ id: 1, x: 50, y: 50, label: '0DAY' });
  const [copiedFlag, setCopiedFlag] = useState(false);

  // Crimson Matrix Rain background canvas
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = 'C4PTR4_0xDEADBEEF_01{}[]<>/\\*#';
    const fontSize = 15;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -40);
    };
    resize();
    window.addEventListener('resize', resize);

    const interval = window.setInterval(() => {
      ctx.fillStyle = 'rgba(5, 5, 7, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.94 ? '#fecaca' : '#dc2626';
        ctx.fillText(ch, x, y);

        if (y > canvas.height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [open]);

  // Escape key closes overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const spawnTarget = () => {
    setTarget({
      id: Date.now() + Math.random(),
      x: 14 + Math.random() * 72,
      y: 18 + Math.random() * 64,
      label: LABELS[Math.floor(Math.random() * LABELS.length)],
    });
  };

  // Countdown & target movement during play
  useEffect(() => {
    if (!open || phase !== 'playing') return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const mover = window.setInterval(() => {
      spawnTarget();
    }, 1550);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(mover);
    };
  }, [open, phase]);

  if (!open) return null;

  const startGame = () => {
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setPhase('playing');
    spawnTarget();
  };

  const handleHit = () => {
    const next = score + 1;
    setScore(next);
    if (next >= GOAL_SCORE) {
      setPhase('won');
    } else {
      spawnTarget();
    }
  };

  const copyFlag = async () => {
    try {
      await navigator.clipboard.writeText(SECRET_FLAG);
      setCopiedFlag(true);
      window.setTimeout(() => setCopiedFlag(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-75"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Exit the void"
        className="fixed top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3.5 py-2 font-mono text-xs text-zinc-300 backdrop-blur-md transition hover:border-red-500 hover:text-white"
      >
        <X className="h-4 w-4" />
        <span>exit void</span>
      </button>

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-red-500/40 bg-[#08080c]/90 p-6 shadow-[0_0_80px_-15px_rgba(220,38,38,0.55)] backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-red-400">0xC4PTR4 // THE VOID</span>
          {phase === 'playing' && (
            <div className="flex items-center gap-4">
              <span className="text-zinc-300">
                HITS: <strong className="text-white">{score}/{GOAL_SCORE}</strong>
              </span>
              <span className={timeLeft <= 5 ? 'font-bold text-red-400' : 'text-zinc-400'}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div className="py-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-red-500">
              you found ???
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Breach the Void.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
              Catch <strong className="text-white">{GOAL_SCORE} intrusion payloads</strong> in{' '}
              <strong className="text-white">{ROUND_SECONDS} seconds</strong> to dump the hidden
              flag. Simple, fast, zero setup.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/35 transition hover:bg-red-500"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>ENTER THE VOID</span>
            </button>
          </div>
        )}

        {/* PLAYING ARENA */}
        {phase === 'playing' && (
          <div className="relative mt-5 h-72 w-full overflow-hidden rounded-2xl border border-red-500/25 bg-black/80 sm:h-80">
            {/* Subtle radar crosshairs */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12)_0%,transparent_65%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-red-500/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px bg-red-500/10"
            />

            <button
              key={target.id}
              type="button"
              onClick={handleHit}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-400 bg-red-600/25 px-3.5 py-2 font-mono text-xs font-bold text-white shadow-[0_0_24px_rgba(239,68,68,0.75)] transition-transform hover:scale-110 active:scale-95"
            >
              {target.label}
            </button>
          </div>
        )}

        {/* WON */}
        {phase === 'won' && (
          <div className="py-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/20 text-red-400">
              <Trophy className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">Void Breached.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
              Clean reflexes. Drop this flag in my LinkedIn DMs if you want to talk Red Teaming, AI
              security, or FPS games.
            </p>

            <div className="mx-auto mt-5 flex max-w-sm items-center justify-between gap-2 rounded-xl border border-red-500/40 bg-black/80 px-4 py-3 font-mono text-xs text-red-300">
              <span className="truncate">{SECRET_FLAG}</span>
              <button
                type="button"
                onClick={copyFlag}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] text-white hover:border-red-500"
              >
                {copiedFlag ? (
                  <>
                    <Check className="h-3 w-3 text-red-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-xs text-zinc-300 hover:border-red-500/50 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Play Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-red-600 px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-red-500"
              >
                Back to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* LOST */}
        {phase === 'lost' && (
          <div className="py-8 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-500">
              CONNECTION DROPPED
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              You caught {score}/{GOAL_SCORE} payloads.
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Almost had it — run it back?</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 font-mono text-xs font-semibold text-white hover:bg-red-500"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Breach
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 font-mono text-xs text-zinc-300 hover:text-white"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

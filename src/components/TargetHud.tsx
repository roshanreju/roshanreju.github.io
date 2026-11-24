import { Flag, RotateCcw, Shield, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { BOX_META, PROFILE } from '../data/portfolio';
import { AccessLevel, BoxState } from '../engine/boxEngine';

interface TargetHudProps {
  boxState: BoxState;
  onAutoPwn: () => void;
  onReset: () => void;
}

const ACCESS_STYLES: Record<AccessLevel, { label: string; className: string }> = {
  unauth: {
    label: 'UNAUTHENTICATED',
    className: 'border-slate-600/40 bg-slate-800/60 text-slate-300',
  },
  recon: {
    label: 'RECON ACTIVE',
    className: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  },
  user: {
    label: 'SHELL: guest',
    className: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  },
  root: {
    label: 'ROOT OWNED (#)',
    className: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_-4px_rgba(16,185,129,0.5)]',
  },
};

export default function TargetHud({ boxState, onAutoPwn, onReset }: TargetHudProps) {
  const unlockedModules = Object.entries(boxState.unlocked).filter(
    ([key, isUnlocked]) => key !== 'briefing' && isUnlocked
  ).length;
  const flagCount = Number(boxState.flags.user) + Number(boxState.flags.root);
  const progressPct = Math.round((unlockedModules / 5) * 100);
  const accessMeta = ACCESS_STYLES[boxState.access];
  const isFullyPwned = unlockedModules === 5 && flagCount === 2;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Box Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
              <span className="font-bold tracking-tight text-white">BOX://{BOX_META.hostname}</span>
              <span className="hidden rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-emerald-400 sm:inline">
                {BOX_META.ip}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Target: {PROFILE.name} ({PROFILE.handle}) · {PROFILE.location}
            </p>
          </div>
        </div>

        {/* Center Status Metrics */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2.5">
            <div className="w-32">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>COMPROMISE</span>
                <span className="text-emerald-400">{progressPct}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition ${accessMeta.className}`}
          >
            {boxState.access === 'root' ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <Shield className="h-3.5 w-3.5" />
            )}
            <span>{accessMeta.label}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-300">
            <Flag className={`h-3.5 w-3.5 ${flagCount === 2 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>
              FLAGS: <strong className="text-white">{flagCount}/2</strong>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isFullyPwned ? (
            <button
              type="button"
              onClick={onAutoPwn}
              title="Unlock all sections immediately (Recruiter Quick View)"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25 hover:text-white"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Auto-Pwn</span>
              <span className="hidden text-[10px] font-normal text-emerald-200/70 xl:inline">
                (Quick View)
              </span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              BOX PWNED
            </span>
          )}

          {unlockedModules > 0 && (
            <button
              type="button"
              onClick={onReset}
              title="Reset box to fresh snapshot"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

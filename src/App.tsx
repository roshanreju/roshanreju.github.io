import { useEffect, useState } from 'react';
import { ArrowRight, Bot, LayoutGrid, Terminal } from 'lucide-react';
import JailbreakLab from './components/JailbreakLab';
import Operative3D from './components/Operative3D';
import TerminalWorkspace from './components/TerminalWorkspace';
import VisualProfile from './components/VisualProfile';
import { PROFILE, SOCIALS } from './data/portfolio';

type ViewMode = 'stage' | 'terminal' | 'visual';

export default function App() {
  const [mode, setMode] = useState<ViewMode>('stage');
  const [warping, setWarping] = useState(false);
  const [labOpen, setLabOpen] = useState(false);

  const enterTerminal = () => {
    if (warping) return;
    setWarping(true);
    window.setTimeout(() => {
      setMode('terminal');
      setWarping(false);
    }, 680);
  };

  // Allow pressing Enter on the 3D Opening Stage to dive straight into the terminal!
  useEffect(() => {
    if (mode !== 'stage' || labOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        enterTerminal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, labOpen, warping]);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-200">
      {/* PHASE 1: OPENING 3D OPERATIVE STAGE */}
      {mode === 'stage' && (
        <div className="relative flex min-h-screen flex-col justify-between overflow-hidden">
          <Operative3D warping={warping} />

          {/* Subtle ambient radial vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_25%_50%,rgba(5,5,7,0.75)_0%,rgba(5,5,7,0.25)_55%,rgba(5,5,7,0.85)_100%)]"
          />

          {/* Warp transition flash overlay */}
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#050507] transition-opacity duration-500 ${
              warping ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="font-mono text-xs tracking-[0.25em] text-red-400">
              connecting...
            </div>
          </div>

          {/* Minimal Top Header */}
          <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-wider text-white">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>{PROFILE.handle}</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
              {SOCIALS.slice(0, 3).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden transition hover:text-red-400 sm:inline"
                >
                  {s.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setMode('visual')}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-zinc-200 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-red-400" />
                <span>Resume View</span>
              </button>
            </div>
          </header>

          {/* Editorial Intro Composition (cleanly paired with 3D figure on the right) */}
          <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-12">
            <div className="max-w-xl">
              <p className="font-mono text-xs tracking-wider text-zinc-400">
                {PROFILE.location}
              </p>

              <h1 className="mt-4 font-display text-5xl font-bold leading-[1.03] tracking-tight text-white sm:text-7xl">
                {PROFILE.name}
              </h1>

              <p className="mt-4 font-mono text-sm font-medium text-red-400 sm:text-base">
                Red Team @ Google
              </p>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
                Breaking networks, cloud infrastructure, and AI systems before someone else does.
              </p>

              {/* Enter Phase 2 CTA */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={enterTerminal}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-red-600 px-6 py-3.5 font-mono text-xs font-semibold text-white shadow-[0_0_40px_-8px_rgba(220,38,38,0.9)] transition hover:bg-red-500 sm:text-sm"
                >
                  <Terminal className="h-4 w-4" />
                  <span>Enter Shell</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => setLabOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-5 py-3.5 font-mono text-xs font-medium text-zinc-200 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
                >
                  <Bot className="h-4 w-4 text-red-400" />
                  <span>Break My AI</span>
                </button>
              </div>
            </div>
          </main>

          {/* Subtle Bottom Bar */}
          <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 font-mono text-[11px] text-zinc-500">
            <span>{PROFILE.email}</span>
            <span>{PROFILE.handle}</span>
          </footer>
        </div>
      )}

      {/* PHASE 2: FULL-SCREEN REAL INTERACTIVE LINUX TERMINAL */}
      {mode === 'terminal' && (
        <TerminalWorkspace
          onBackToStage={() => setMode('stage')}
          onSwitchVisual={() => setMode('visual')}
          onOpenJailbreak={() => setLabOpen(true)}
        />
      )}

      {/* OPTIONAL VISUAL READER MODE */}
      {mode === 'visual' && (
        <VisualProfile
          onBackToStage={() => setMode('stage')}
          onSwitchTerminal={() => setMode('terminal')}
          onOpenJailbreak={() => setLabOpen(true)}
        />
      )}

      {/* 3-Layer LLM Red-Team Sandbox Modal */}
      <JailbreakLab
        open={labOpen}
        onClose={() => setLabOpen(false)}
        onBreachPulse={() => {}}
      />
    </div>
  );
}

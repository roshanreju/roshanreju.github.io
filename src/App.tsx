import { useEffect, useState } from 'react';
import { ArrowRight, LayoutGrid, Terminal } from 'lucide-react';
import RoshanCharacter3D from './components/RoshanCharacter3D';
import TerminalWorkspace from './components/TerminalWorkspace';
import VisualProfile from './components/VisualProfile';
import { PROFILE, SOCIALS } from './data/portfolio';

type ViewMode = 'stage' | 'terminal' | 'visual';

export default function App() {
  const [mode, setMode] = useState<ViewMode>('stage');
  const [warping, setWarping] = useState(false);

  const enterTerminal = () => {
    if (warping) return;
    setWarping(true);
    window.setTimeout(() => {
      setMode('terminal');
      setWarping(false);
    }, 580);
  };

  useEffect(() => {
    if (mode !== 'stage') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        enterTerminal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, warping]);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#050507] text-zinc-200">
      {/* PHASE 1: RESPONSIVE 3D CHARACTER STAGE */}
      {mode === 'stage' && (
        <div className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden">
          {/* Desktop subtle vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden lg:fixed lg:inset-0 lg:z-[1] lg:block lg:bg-[radial-gradient(ellipse_at_22%_50%,rgba(5,5,7,0.72)_0%,rgba(5,5,7,0.12)_55%,rgba(5,5,7,0.78)_100%)]"
          />

          {/* Warp transition overlay */}
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#050507] transition-opacity duration-500 ${
              warping ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="font-mono text-xs tracking-[0.25em] text-red-400">connecting...</div>
          </div>

          {/* Minimal Top Header */}
          <header className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6 sm:py-7">
            <div className="pointer-events-auto flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-white">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>{PROFILE.handle}</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-4 font-mono text-xs text-zinc-400">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-zinc-200 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-red-400" />
                <span>Resume</span>
              </button>
            </div>
          </header>

          {/* Single responsive WebGL 3D canvas: top viewport on phone, full-bleed right-framed stage on desktop */}
          <div className="relative z-10 h-[44dvh] min-h-[260px] w-full lg:fixed lg:inset-0 lg:z-0 lg:h-auto lg:min-h-0">
            <RoshanCharacter3D warping={warping} />
          </div>

          {/* Editorial Intro */}
          <main className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-start px-5 pt-2 pb-6 sm:px-6 lg:items-center lg:py-12">
            <div className="w-full max-w-lg text-center lg:text-left">
              <p className="font-mono text-xs tracking-wider text-zinc-400">{PROFILE.location}</p>

              <h1 className="mt-2.5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:mt-4 lg:text-7xl">
                {PROFILE.name}
              </h1>

              <p className="mt-3 font-mono text-sm font-medium text-red-400 sm:text-base">
                Red Team Consultant @ Google
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base lg:mx-0">
                Breaking networks, cloud infrastructure, and AI systems before someone else does.
              </p>

              <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-9 lg:justify-start">
                <button
                  type="button"
                  onClick={enterTerminal}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-red-600 px-6 py-3.5 font-mono text-xs font-semibold text-white shadow-[0_0_40px_-8px_rgba(220,38,38,0.9)] transition hover:bg-red-500 sm:text-sm"
                >
                  <Terminal className="h-4 w-4" />
                  <span>Enter Shell</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </main>

          {/* Subtle Bottom Bar */}
          <footer className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 font-mono text-[11px] text-zinc-500 sm:px-6">
            <a
              href={`mailto:${PROFILE.email}`}
              className="pointer-events-auto truncate transition hover:text-zinc-300"
            >
              {PROFILE.email}
            </a>
            <span className="shrink-0">{PROFILE.handle}</span>
          </footer>
        </div>
      )}

      {/* PHASE 2: FULL-SCREEN REAL LINUX TERMINAL */}
      {mode === 'terminal' && (
        <TerminalWorkspace
          onBackToStage={() => setMode('stage')}
          onSwitchVisual={() => setMode('visual')}
        />
      )}

      {/* RESUME / VISUAL READER VIEW */}
      {mode === 'visual' && (
        <VisualProfile
          onBackToStage={() => setMode('stage')}
          onSwitchTerminal={() => setMode('terminal')}
        />
      )}
    </div>
  );
}

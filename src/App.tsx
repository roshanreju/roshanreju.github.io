import { useRef, useState } from 'react';
import { Layers, MapPin, ShieldCheck } from 'lucide-react';
import HackerAvatar from './components/HackerAvatar';
import HackTerminal from './components/HackTerminal';
import PortfolioContent from './components/PortfolioContent';
import { PROFILE } from './data/portfolio';
import {
  getPrompt,
  getWelcomeEntry,
  HackState,
  INITIAL_HACK_STATE,
  runBoxCommand,
  SectionId,
  TerminalEntry,
} from './engine/boxEngine';

const NAV_LINKS: { id: SectionId; label: string; command: string }[] = [
  { id: 'about', label: 'About', command: 'scan' },
  { id: 'experience', label: 'Career', command: 'career' },
  { id: 'projects', label: 'Projects', command: 'projects' },
  { id: 'contact', label: 'Contact', command: 'root' },
];

export default function App() {
  const [state, setState] = useState<HackState>(() => ({
    ...INITIAL_HACK_STATE,
    unlocked: { ...INITIAL_HACK_STATE.unlocked },
  }));
  const [entries, setEntries] = useState<TerminalEntry[]>(() => [getWelcomeEntry()]);
  const contentAnchorRef = useRef<HTMLDivElement>(null);

  const handleRunCommand = (rawCommand: string) => {
    const promptBefore = getPrompt(state);
    const outcome = runBoxCommand(rawCommand, state);

    if (outcome.openUrl) {
      window.open(outcome.openUrl, '_blank', 'noopener,noreferrer');
    }

    if (outcome.clear) {
      setEntries([]);
    } else if (rawCommand.trim()) {
      setEntries((prev) => [
        ...prev.slice(-18),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          prompt: promptBefore,
          command: rawCommand.trim(),
          lines: outcome.lines,
        },
      ]);
    }

    setState(outcome.nextState);

    if (outcome.scrollToContent) {
      window.setTimeout(() => {
        contentAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 90);
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas bg-grid-subtle text-zinc-200">
      {/* Subtle top crimson spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.16),transparent_65%)]"
      />

      {/* Simple Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>{PROFILE.handle}</span>
          </a>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = !state.showAll && state.activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleRunCommand(link.command)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-red-600/20 text-red-300'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => handleRunCommand('all')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
              state.showAll
                ? 'border-red-500 bg-red-600/20 text-red-200'
                : 'border-red-500/40 bg-red-600/15 text-red-300 hover:bg-red-600/25 hover:text-white'
            }`}
          >
            {state.isRoot ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <Layers className="h-3.5 w-3.5" />
            )}
            <span>{state.showAll ? 'Viewing All' : 'View Full Page'}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Experience */}
      <main id="top" className="relative mx-auto max-w-5xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
        {/* Hero Header with Animated Hacker Avatar */}
        <section className="flex flex-col items-center gap-7 text-center sm:flex-row sm:text-left">
          <HackerAvatar />

          <div className="space-y-3">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-600/10 px-3 py-1 font-mono text-xs text-red-300 sm:justify-start">
              <span>{PROFILE.handle}</span>
              <span className="text-red-500/50">·</span>
              <span className="inline-flex items-center gap-1 text-zinc-300">
                <MapPin className="h-3 w-3 text-red-400" />
                {PROFILE.location}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {PROFILE.name}
            </h1>

            <p className="font-mono text-sm font-medium text-red-400">{PROFILE.tagline}</p>

            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Welcome to my interactive security box. Click a mission below or type a command in the
              terminal to break in and explore my work—or hit{' '}
              <button
                type="button"
                onClick={() => handleRunCommand('all')}
                className="font-medium text-red-400 underline decoration-red-500/40 underline-offset-4 hover:text-red-300"
              >
                View Full Page
              </button>{' '}
              anytime.
            </p>
          </div>
        </section>

        {/* Interactive Terminal + 4 Simple Step Buttons */}
        <section className="mt-10">
          <HackTerminal state={state} entries={entries} onRunCommand={handleRunCommand} />
        </section>

        {/* Decrypted Content Area */}
        <div ref={contentAnchorRef} className="mt-14 scroll-mt-20">
          <PortfolioContent activeSection={state.activeSection} showAll={state.showAll} />
        </div>
      </main>

      <footer className="border-t border-white/[0.06] bg-surface/50 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 font-mono text-xs text-zinc-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} ({PROFILE.handle})
          </p>
          <p>Red Team · AI Security · AppSec</p>
        </div>
      </footer>
    </div>
  );
}

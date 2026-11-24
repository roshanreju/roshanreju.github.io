import { useState } from 'react';
import { Layers, Terminal, Zap } from 'lucide-react';
import JarvisConsole from './components/JarvisConsole';
import Stark3DScene from './components/Stark3DScene';
import StoryPanels from './components/StoryPanels';
import { PROFILE } from './data/portfolio';
import {
  ChapterId,
  CHAPTERS,
  ConsoleEntry,
  executeJarvisCommand,
  getWelcomeLog,
  INITIAL_STORY_STATE,
  StoryState,
} from './engine/storyEngine';

export default function App() {
  const [state, setState] = useState<StoryState>(() => ({
    ...INITIAL_STORY_STATE,
    visited: { ...INITIAL_STORY_STATE.visited },
  }));
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [entries, setEntries] = useState<ConsoleEntry[]>(() => [getWelcomeLog()]);

  const handleRunCommand = (raw: string) => {
    const outcome = executeJarvisCommand(raw, state);

    if (outcome.openUrl) {
      window.open(outcome.openUrl, '_blank', 'noopener,noreferrer');
    }

    if (outcome.clear) {
      setEntries([]);
    } else if (raw.trim()) {
      setEntries((prev) => [
        ...prev.slice(-18),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          command: raw.trim(),
          lines: outcome.lines,
        },
      ]);
    }

    setState(outcome.nextState);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chapter: ChapterId) => {
    const meta = CHAPTERS.find((c) => c.id === chapter);
    if (meta) {
      handleRunCommand(meta.command);
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas text-zinc-200">
      {/* Live Real-Time Three.js 3D Stark Iron-Hacker World */}
      <Stark3DScene chapter={state.chapter} overdrive={state.overdrive} />

      {/* Subtle vignette so HUD text always reads cleanly over 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,7,0.75)_100%)]"
      />

      {/* Top Stark Storyline HUD Bar */}
      <header className="sticky top-0 z-40 border-b border-red-500/20 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Brand */}
          <button
            type="button"
            onClick={() => handleSelectChapter('boot')}
            className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-wider text-white sm:text-sm"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                state.overdrive
                  ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]'
                  : 'bg-red-500 shadow-[0_0_12px_#ef4444]'
              }`}
            />
            <span>
              MARK-R4 <span className="text-red-400">// {PROFILE.handle}</span>
            </span>
          </button>

          {/* 5 Simple Chapter Pills */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Story chapters">
            {CHAPTERS.map((chap) => {
              const active = !state.showAll && state.chapter === chap.id;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => handleSelectChapter(chap.id)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition ${
                    active
                      ? 'border border-red-500/60 bg-red-600/20 text-white shadow-[0_0_18px_-6px_rgba(239,68,68,0.65)]'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span className="mr-1 text-[10px] text-amber-400/80">{chap.code}</span>
                  {chap.label}
                </button>
              );
            })}
          </nav>

          {/* Right HUD Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRunCommand('jarvis')}
              title="Toggle 3D Arc Reactor Overdrive"
              className={`hidden items-center gap-1 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition sm:inline-flex ${
                state.overdrive
                  ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                  : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-amber-400/50 hover:text-amber-300'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleRunCommand('all')}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition ${
                state.showAll
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                  : 'border-white/15 bg-white/[0.04] text-zinc-200 hover:border-red-500/50 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">Full Story</span>
            </button>

            <button
              type="button"
              onClick={() => setConsoleOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                consoleOpen
                  ? 'border-red-500 bg-red-600/30 text-white'
                  : 'border-red-500/40 bg-red-600/15 text-red-300 hover:bg-red-600/25 hover:text-white'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>J.A.R.V.I.S.</span>
            </button>
          </div>
        </div>

        {/* Mobile Chapter Bar */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-white/[0.06] px-4 py-2 md:hidden">
          {CHAPTERS.map((chap) => {
            const active = !state.showAll && state.chapter === chap.id;
            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => handleSelectChapter(chap.id)}
                className={`shrink-0 rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                  active
                    ? 'border border-red-500/60 bg-red-600/20 text-white'
                    : 'border border-white/10 bg-black/50 text-zinc-400'
                }`}
              >
                {chap.code} {chap.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Foreground Interactive Storyline */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <StoryPanels
          state={state}
          onSelectChapter={handleSelectChapter}
          onToggleOverdrive={() => handleRunCommand('jarvis')}
          onOpenConsole={() => setConsoleOpen(true)}
          onShowAll={() => handleRunCommand('all')}
        />
      </main>

      {/* Collapsible J.A.R.V.I.S. Interactive Terminal */}
      <JarvisConsole
        open={consoleOpen}
        state={state}
        entries={entries}
        onClose={() => setConsoleOpen(false)}
        onRunCommand={handleRunCommand}
      />
    </div>
  );
}

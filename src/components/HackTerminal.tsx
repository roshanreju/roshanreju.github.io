import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, CornerDownLeft, Lock, Terminal, Unlock } from 'lucide-react';
import {
  AUTOCOMPLETE_LIST,
  getPrompt,
  HackState,
  QUICK_ACTIONS,
  TerminalEntry,
  TerminalLine,
} from '../engine/boxEngine';

interface HackTerminalProps {
  state: HackState;
  entries: TerminalEntry[];
  onRunCommand: (command: string) => void;
}

const TONE_CLASS: Record<NonNullable<TerminalLine['tone']>, string> = {
  default: 'text-zinc-300',
  red: 'text-red-400',
  bright: 'text-white font-medium',
  muted: 'text-zinc-500',
  badge:
    'inline-block my-1 rounded-md border border-red-500/50 bg-red-600/20 px-2.5 py-1 text-red-200 font-semibold tracking-wide',
};

export default function HackTerminal({ state, entries, onRunCommand }: HackTerminalProps) {
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = getPrompt(state);
  const unlockedCount = Object.values(state.unlocked).filter(Boolean).length;

  const suggestion = input.trim()
    ? AUTOCOMPLETE_LIST.find(
        (c) => c.startsWith(input.trim().toLowerCase()) && c !== input.trim().toLowerCase()
      )
    : undefined;

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  const submit = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    setCmdHistory((prev) => [cleaned, ...prev.slice(0, 29)]);
    setHistIdx(-1);
    onRunCommand(cleaned);
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInput(suggestion);
      return;
    }
    if (e.key === 'ArrowUp' && cmdHistory.length > 0) {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Sleek Terminal Box */}
      <div
        className="overflow-hidden rounded-2xl border border-red-500/25 bg-[#09090d]/95 shadow-2xl shadow-red-950/30 backdrop-blur-xl"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
            <span className="ml-2 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400">
              <Terminal className="h-3.5 w-3.5 text-red-500" />
              <span>{state.isRoot ? 'root@roshan-box (FULL ACCESS)' : 'roshan-box — interactive terminal'}</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-red-400">
            {unlockedCount}/4 unlocked
          </span>
        </div>

        {/* Output Log */}
        <div
          ref={logRef}
          className="max-h-[210px] min-h-[145px] space-y-3 overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:text-[13px]"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={entry.prompt.startsWith('root@') ? 'font-semibold text-red-500' : 'font-semibold text-red-400/90'}>
                  {entry.prompt}
                </span>
                <span className="text-white">{entry.command}</span>
              </div>
              <div className="space-y-0.5 pl-2.5">
                {entry.lines.map((line, idx) => (
                  <div key={idx} className={TONE_CLASS[line.tone ?? 'default']}>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-white/[0.07] bg-black/60 px-4 py-3 font-mono text-xs sm:text-[13px]"
        >
          <ChevronRight className="h-4 w-4 shrink-0 text-red-500" />
          <span className="hidden shrink-0 font-semibold text-red-400 sm:inline">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type a command (try "scan", "career", "projects", "root", or "help")...'
            autoComplete="off"
            spellCheck={false}
            aria-label="Interactive terminal input"
            className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none"
          />
          {suggestion && (
            <button
              type="button"
              onClick={() => setInput(suggestion)}
              className="hidden shrink-0 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline"
            >
              Tab ↹
            </button>
          )}
          <button
            type="submit"
            aria-label="Execute command"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-600/15 text-red-300 transition hover:bg-red-600/30 hover:text-white"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* 4 Big Friendly Mission Buttons (Great for Non-Tech & Tech Visitors!) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const isUnlocked = state.unlocked[action.section];
          const isActive = !state.showAll && state.activeSection === action.section;

          return (
            <button
              key={action.section}
              type="button"
              onClick={() => submit(action.command)}
              className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                isActive
                  ? 'border-red-500 bg-red-600/15 shadow-[0_0_24px_-8px_rgba(239,68,68,0.55)]'
                  : isUnlocked
                    ? 'border-red-500/30 bg-surface hover:border-red-500/60 hover:bg-elevated'
                    : 'border-white/[0.08] bg-surface/80 hover:border-red-500/40 hover:bg-elevated'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold text-red-400">
                  STEP {action.step}
                </span>
                {isActive ? (
                  <CheckCircle2 className="h-4 w-4 text-red-400" />
                ) : isUnlocked ? (
                  <Unlock className="h-3.5 w-3.5 text-red-400/80" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-zinc-500 transition group-hover:text-red-400" />
                )}
              </div>

              <div className="mt-2.5">
                <div className="font-display text-sm font-semibold text-white">{action.title}</div>
                <div className="mt-0.5 text-xs text-zinc-400">{action.subtitle}</div>
              </div>

              <div className="mt-3 inline-flex w-fit items-center rounded border border-white/[0.08] bg-black/50 px-2 py-0.5 font-mono text-[10.5px] text-zinc-300 group-hover:border-red-500/40 group-hover:text-red-300">
                $ {action.command}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

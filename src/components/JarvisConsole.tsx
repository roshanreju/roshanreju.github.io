import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChevronRight, CornerDownLeft, Terminal, X, Zap } from 'lucide-react';
import {
  CONSOLE_AUTOCOMPLETE,
  ConsoleEntry,
  ConsoleLine,
  StoryState,
} from '../engine/storyEngine';

interface JarvisConsoleProps {
  open: boolean;
  state: StoryState;
  entries: ConsoleEntry[];
  onClose: () => void;
  onRunCommand: (command: string) => void;
}

const LINE_TONE: Record<NonNullable<ConsoleLine['tone']>, string> = {
  default: 'text-zinc-300',
  red: 'text-red-400',
  gold: 'text-amber-300',
  white: 'text-white font-medium',
  muted: 'text-zinc-500',
  badge:
    'inline-block my-1 rounded-md border border-amber-400/50 bg-gradient-to-r from-red-600/30 to-amber-500/20 px-2.5 py-1 text-amber-200 font-semibold tracking-wider',
};

const QUICK_CHIPS = ['origin', 'missions', 'lab', 'overdrive', 'jarvis', 'all', 'help'];

export default function JarvisConsole({
  open,
  state,
  entries,
  onClose,
  onRunCommand,
}: JarvisConsoleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestion = input.trim()
    ? CONSOLE_AUTOCOMPLETE.find(
        (c) => c.startsWith(input.trim().toLowerCase()) && c !== input.trim().toLowerCase()
      )
    : undefined;

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries, open]);

  if (!open) return null;

  const submit = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    setHistory((prev) => [cleaned, ...prev.slice(0, 29)]);
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
    if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next]);
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
        setInput(history[next]);
      }
    }
  };

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-2xl overflow-hidden rounded-2xl border border-red-500/40 bg-[#08080c]/95 shadow-[0_0_50px_-10px_rgba(220,38,38,0.5)] backdrop-blur-2xl sm:left-auto sm:w-[540px]">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-red-600/15 via-transparent to-amber-500/10 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Terminal className="h-3.5 w-3.5 text-red-400" />
          <span className="font-semibold text-white">J.A.R.V.I.S. // MARK-R4 CONSOLE</span>
          {state.overdrive && (
            <span className="inline-flex items-center gap-1 rounded border border-amber-400/40 bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
              <Zap className="h-2.5 w-2.5" />
              OVERDRIVE
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close J.A.R.V.I.S. console"
          className="rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Output Stream */}
      <div
        ref={logRef}
        className="max-h-[200px] min-h-[130px] space-y-2.5 overflow-y-auto p-3.5 font-mono text-xs leading-relaxed"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className={state.overdrive ? 'text-amber-400' : 'text-red-400'}>
                {state.overdrive ? 'root@mark-r4:~#' : 'jarvis@mark-r4:~$'}
              </span>
              <span className="text-white">{entry.command}</span>
            </div>
            <div className="space-y-0.5 pl-2">
              {entry.lines.map((line, idx) => (
                <div key={idx} className={LINE_TONE[line.tone ?? 'default']}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] bg-black/40 px-3.5 py-2">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => submit(chip)}
            className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10.5px] text-zinc-300 transition hover:border-red-500/50 hover:bg-red-600/15 hover:text-white"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-white/10 bg-black/70 px-3.5 py-2.5 font-mono text-xs"
      >
        <ChevronRight className="h-4 w-4 shrink-0 text-red-500" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Command J.A.R.V.I.S. (origin, missions, lab, overdrive, jarvis)...'
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none"
        />
        {suggestion && (
          <button
            type="button"
            onClick={() => setInput(suggestion)}
            className="hidden rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline"
          >
            Tab ↹
          </button>
        )}
        <button
          type="submit"
          aria-label="Send command"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/40 bg-red-600/20 text-red-200 transition hover:bg-red-600/35 hover:text-white"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}

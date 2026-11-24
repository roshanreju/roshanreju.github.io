import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChevronRight, CornerDownLeft, Play, Sparkles } from 'lucide-react';
import {
  AUTOCOMPLETE_COMMANDS,
  BoxState,
  getNextMission,
  getPrompt,
  TerminalBlock,
  TerminalLine,
} from '../engine/boxEngine';

interface HackTerminalProps {
  boxState: BoxState;
  blocks: TerminalBlock[];
  onRunCommand: (command: string) => void;
}

const TONE_CLASS: Record<NonNullable<TerminalLine['tone']>, string> = {
  default: 'text-slate-300',
  emerald: 'text-emerald-400',
  cyan: 'text-cyan-300',
  amber: 'text-amber-300',
  rose: 'text-rose-400',
  muted: 'text-slate-500',
  white: 'text-white font-semibold',
  flag: 'inline-block my-1 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-emerald-200 font-semibold',
};

const UTILITY_CHIPS = ['help', 'ls', 'whois roshan', 'flags', 'clear'];

export default function HackTerminal({ boxState, blocks, onRunCommand }: HackTerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = getPrompt(boxState);
  const nextMission = getNextMission(boxState);

  const autocompleteSuggestion = input.trim()
    ? AUTOCOMPLETE_COMMANDS.find(
        (cmd) => cmd.toLowerCase().startsWith(input.trim().toLowerCase()) && cmd !== input.trim()
      )
    : undefined;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [blocks]);

  const submitCommand = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    setHistory((prev) => [cleaned, ...prev.slice(0, 39)]);
    setHistoryIndex(-1);
    onRunCommand(cleaned);
    setInput('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitCommand(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      if (autocompleteSuggestion) {
        e.preventDefault();
        setInput(autocompleteSuggestion);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIdx);
      setInput(history[nextIdx]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  return (
    <div
      className="flex h-[calc(100vh-8.5rem)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#090d14]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">
            {boxState.access === 'root'
              ? 'root@roshan-01 (UID 0)'
              : boxState.access === 'user'
                ? 'ssh://guest@10.10.11.24'
                : 'kali-attackbox — zsh'}
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          TUN0 LIVE
        </span>
      </div>

      {/* Guided Next-Step Objective Banner */}
      <div className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.09] via-cyan-500/[0.05] to-transparent px-4 py-3">
        {nextMission ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                <Sparkles className="h-3 w-3" />
                <span>{nextMission.phase}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300">{nextMission.description}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                submitCommand(nextMission.command);
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-emerald-200 transition hover:bg-emerald-500/30 hover:text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              <span className="max-w-[200px] truncate">{nextMission.command}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 font-mono text-xs text-emerald-300">
            <span>🏆 ALL OBJECTIVES COMPLETE — ROOT ACCESS &amp; BOTH FLAGS CAPTURED</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                submitCommand('flags');
              }}
              className="shrink-0 rounded border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] hover:bg-emerald-500/20"
            >
              flags
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Output History */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 font-mono text-xs leading-relaxed sm:text-[12.5px]"
      >
        {blocks.map((block) => (
          <div key={block.id} className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 break-all">
              <span
                className={
                  block.prompt.startsWith('root@')
                    ? 'font-semibold text-rose-400'
                    : block.prompt.startsWith('guest@')
                      ? 'font-semibold text-amber-300'
                      : 'font-semibold text-emerald-400'
                }
              >
                {block.prompt}
              </span>
              <span className="text-white">{block.command}</span>
            </div>
            <div className="space-y-0.5 pl-2">
              {block.lines.map((line, idx) => (
                <div
                  key={idx}
                  className={`whitespace-pre-wrap break-words ${
                    TONE_CLASS[line.tone ?? 'default']
                  }`}
                >
                  {line.text || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="border-t border-white/[0.08] bg-black/50 px-4 py-3">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 font-mono text-xs">
          <ChevronRight
            className={`h-4 w-4 shrink-0 ${
              boxState.access === 'root'
                ? 'text-rose-400'
                : boxState.access === 'user'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
            }`}
          />
          <span
            className={`hidden shrink-0 font-semibold sm:inline ${
              boxState.access === 'root'
                ? 'text-rose-400'
                : boxState.access === 'user'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
            }`}
          >
            {prompt}
          </span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                nextMission ? `Try: ${nextMission.command}` : 'Type a command (help, ls, open github)...'
              }
              autoComplete="off"
              spellCheck={false}
              aria-label="Attacker terminal command input"
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          {autocompleteSuggestion && (
            <button
              type="button"
              onClick={() => setInput(autocompleteSuggestion)}
              className="hidden rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline"
            >
              Tab ↹
            </button>
          )}
          <button
            type="submit"
            aria-label="Run command"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Utility command chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {UTILITY_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                submitCommand(chip);
              }}
              className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10.5px] text-slate-400 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

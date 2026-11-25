import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CornerDownLeft, Sparkles, Terminal, X } from 'lucide-react';
import { PROFILE, SOCIALS } from '../data/portfolio';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onPulseCore: () => void;
  onOpenVoid: () => void;
}

interface LogItem {
  id: string;
  cmd: string;
  out: string[];
}

const QUICK_CMDS = [
  { label: 'whoami', hint: 'Profile summary' },
  { label: 'breach', hint: 'Pulse 3D core' },
  { label: '???', hint: 'Enter the void' },
  { label: 'xp', hint: 'Jump to career' },
  { label: 'work', hint: 'Projects & IEEE' },
  { label: 'contact', hint: 'Direct email & links' },
];

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
  onPulseCore,
  onOpenVoid,
}: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'init',
      cmd: 'status',
      out: [
        `${PROFILE.name} (${PROFILE.handle}) · Associate Red Team Consultant @ Google`,
        'Type a command (whoami, nmap, breach, experience, work, credentials, contact, github, linkedin) or pick below.',
      ],
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, open]);

  if (!open) return null;

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    let out: string[] = [];

    if (cmd === 'help' || cmd === '?') {
      out = [
        'whoami / nmap       Inspect operator profile & focus',
        'breach / pulse      Trigger 3D obsidian core explosion wave',
        '??? / void / game   Enter the hidden Crimson Void mini-game',
        'about · xp · work · certs · contact',
        'github · linkedin · twitter · medium · ieee · email · clear',
      ];
    } else if (cmd === '???' || cmd === 'void' || cmd === 'game') {
      out = ['[+] Opening 0xC4PTR4 // THE VOID...'];
      window.setTimeout(() => {
        onClose();
        onOpenVoid();
      }, 220);
    } else if (cmd === 'whoami' || cmd === 'nmap') {
      onPulseCore();
      out = [
        `${PROFILE.name} (${PROFILE.handle}) — ${PROFILE.location}`,
        PROFILE.tagline,
        'Certs: OffSec LLM Red Teaming · CompTIA PenTest+ · CEH (Hall of Fame)',
      ];
    } else if (cmd === 'breach' || cmd === 'pulse' || cmd === 'exploit' || cmd === 'root') {
      onPulseCore();
      out = [
        '[+] Kinetic core unlocked — spatial telemetry surged.',
        'All portfolio sections are open for inspection.',
      ];
    } else if (['about', 'experience', 'xp', 'career', 'work', 'projects', 'credentials', 'certs', 'contact'].includes(cmd)) {
      const target =
        cmd === 'career' || cmd === 'xp'
          ? 'experience'
          : cmd === 'projects'
            ? 'work'
            : cmd === 'certs'
              ? 'credentials'
              : cmd;
      onPulseCore();
      onNavigate(target);
      out = [`[+] Navigated to #${target}.`];
      window.setTimeout(() => onClose(), 320);
    } else if (cmd === 'email') {
      window.location.href = `mailto:${PROFILE.email}`;
      out = [`[+] Opening mail client -> ${PROFILE.email}`];
    } else {
      const social = SOCIALS.find(
        (s) => s.label.toLowerCase().includes(cmd) || s.handle.toLowerCase().includes(cmd)
      );
      if (social) {
        window.open(social.href, '_blank', 'noopener,noreferrer');
        out = [`[+] Launched ${social.label} (${social.href})`];
      } else {
        out = [`Unknown command "${cmd}". Type "help" for available commands.`];
      }
    }

    setLogs((prev) => [
      ...prev.slice(-10),
      { id: `${Date.now()}-${Math.random()}`, cmd, out },
    ]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-md sm:pt-28"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#09090d]/95 shadow-[0_24px_80px_-16px_rgba(220,38,38,0.45)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top input bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5"
        >
          <Terminal className="h-4 w-4 shrink-0 text-red-500" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a command ("whoami", "breach", "work", "linkedin")...'
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent font-mono text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Run command"
            className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-zinc-400 transition hover:border-red-500/50 hover:text-white"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close palette"
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        {/* Output log */}
        <div
          ref={logRef}
          className="max-h-44 space-y-2.5 overflow-y-auto border-b border-white/[0.07] bg-black/40 px-4 py-3 font-mono text-xs"
        >
          {logs.map((entry) => (
            <div key={entry.id} className="space-y-0.5">
              <div className="text-red-400">
                <span className="text-zinc-600">$ </span>
                {entry.cmd}
              </div>
              {entry.out.map((line, i) => (
                <div key={i} className="pl-3 text-zinc-300">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Clean quick commands */}
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-red-500" />
              Quick Commands
            </span>
            <span>ESC to close</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {QUICK_CMDS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => run(item.label)}
                className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-left transition hover:border-red-500/45 hover:bg-red-600/10"
              >
                <div>
                  <div className="font-mono text-xs font-medium text-white">{item.label}</div>
                  <div className="text-[10.5px] text-zinc-500">{item.hint}</div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  LayoutGrid,
  PanelLeft,
  Terminal,
  X,
} from 'lucide-react';
import {
  autocompleteInput,
  executeShellCommand,
  formatPromptPath,
  FsDir,
  getNodeAt,
  getShellPrompt,
  getWelcomeBlock,
  HOME_DIR,
  INITIAL_SHELL_STATE,
  ShellBlock,
  ShellLine,
  ShellState,
} from '../engine/virtualFs';

interface TerminalWorkspaceProps {
  onBackToStage: () => void;
  onSwitchVisual: () => void;
}

const LINE_STYLE: Record<NonNullable<ShellLine['tone']>, string> = {
  default: 'text-zinc-300',
  red: 'text-red-400',
  white: 'text-white font-medium',
  muted: 'text-zinc-500',
  dir: 'text-red-400 font-semibold',
  exec: 'text-emerald-400',
  badge:
    'inline-block my-1 rounded-md border border-red-500/50 bg-red-600/20 px-2.5 py-1 text-red-200 font-semibold tracking-wide',
};

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderWithLinks(text: string): ReactNode {
  if (!text.includes('http://') && !text.includes('https://')) {
    return text || '\u00A0';
  }
  const parts = text.split(URL_REGEX);
  return parts.map((part, idx) =>
    part.startsWith('http://') || part.startsWith('https://') ? (
      <a
        key={idx}
        href={part}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="break-all text-red-400 underline decoration-red-500/40 underline-offset-4 hover:text-red-300"
      >
        {part}
      </a>
    ) : (
      <span key={idx}>{part}</span>
    )
  );
}

const QUICK_COMMANDS = ['ls -la', 'tree', 'cat about.md', 'nmap', 'sudo -l', 'help'];

export default function TerminalWorkspace({
  onBackToStage,
  onSwitchVisual,
}: TerminalWorkspaceProps) {
  const [shellState, setShellState] = useState<ShellState>(() => ({
    ...INITIAL_SHELL_STATE,
    history: [],
  }));
  const [blocks, setBlocks] = useState<ShellBlock[]>(() => [getWelcomeBlock()]);
  const [input, setInput] = useState('');
  const [histCursor, setHistCursor] = useState(-1);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    experience: true,
    projects: false,
    research: false,
    credentials: false,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = getShellPrompt(shellState);
  const tabHint = input ? autocompleteInput(input, shellState) : null;

  useEffect(() => {
    if (window.innerWidth >= 768) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    const promptBefore = getShellPrompt(shellState);

    if (!cmd) {
      setBlocks((prev) => [
        ...prev,
        { id: `${Date.now()}`, prompt: promptBefore, command: '', lines: [] },
      ]);
      return;
    }

    const res = executeShellCommand(cmd, shellState);
    setShellState(res.nextState);
    setHistCursor(-1);

    if (res.openUrl) {
      window.open(res.openUrl, '_blank', 'noopener,noreferrer');
    }
    if (res.switchMode === 'visual') {
      onSwitchVisual();
      return;
    }
    if (res.switchMode === 'stage') {
      onBackToStage();
      return;
    }

    if (res.clear) {
      setBlocks([]);
    } else {
      setBlocks((prev) => [
        ...prev.slice(-60),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          prompt: promptBefore,
          command: cmd,
          lines: res.lines,
        },
      ]);
    }
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setBlocks([]);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const promptNow = getShellPrompt(shellState);
      setBlocks((prev) => [
        ...prev,
        { id: `${Date.now()}`, prompt: promptNow, command: `${input}^C`, lines: [] },
      ]);
      setInput('');
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = autocompleteInput(input, shellState);
      if (completed) {
        setInput(completed);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = shellState.history;
      if (hist.length === 0) return;
      const next = histCursor < 0 ? hist.length - 1 : Math.max(0, histCursor - 1);
      setHistCursor(next);
      setInput(hist[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const hist = shellState.history;
      if (histCursor < 0) return;
      if (histCursor >= hist.length - 1) {
        setHistCursor(-1);
        setInput('');
      } else {
        const next = histCursor + 1;
        setHistCursor(next);
        setInput(hist[next]);
      }
    }
  };

  const homeDirNode = getNodeAt(HOME_DIR) as FsDir | null;

  const handleFileClick = (absPath: string) => {
    runCommand(`cat ${formatPromptPath(absPath)}`);
    setMobileDrawerOpen(false);
    if (window.innerWidth >= 768) {
      inputRef.current?.focus();
    }
  };

  const handleDirToggle = (dirName: string, absPath: string) => {
    setExpandedDirs((prev) => ({ ...prev, [dirName]: !prev[dirName] }));
    runCommand(`cd ${formatPromptPath(absPath)} && ls`);
  };

  const renderFileTree = () => {
    if (!homeDirNode) return null;
    return (
      <div className="space-y-1 font-mono text-xs">
        {Object.entries(homeDirNode.children)
          .filter(([, node]) => !node.hidden)
          .map(([name, node]) => {
            const fullPath = `${HOME_DIR}/${name}`;
            if (node.type === 'file') {
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleFileClick(fullPath)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate">{name}</span>
                </button>
              );
            }

            const isOpen = !!expandedDirs[name];
            return (
              <div key={name}>
                <button
                  type="button"
                  onClick={() => handleDirToggle(name, fullPath)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-400 transition hover:bg-red-600/10 hover:text-red-300"
                >
                  {isOpen ? (
                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate font-medium">{name}/</span>
                </button>
                {isOpen && (
                  <div className="mt-0.5 ml-4 space-y-0.5 border-l border-white/[0.08] pl-2.5">
                    {Object.keys(node.children).map((childName) => (
                      <button
                        key={childName}
                        type="button"
                        onClick={() => handleFileClick(`${fullPath}/${childName}`)}
                        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[11.5px] text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <FileText className="h-3 w-3 shrink-0 text-zinc-600" />
                        <span className="truncate">{childName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {shellState.isRoot && (
          <button
            type="button"
            onClick={() => handleFileClick('/root/flag.txt')}
            className="mt-3 flex w-full items-center gap-2 rounded-lg border border-red-500/30 bg-red-600/10 px-2.5 py-2 text-left text-red-300 transition hover:bg-red-600/20"
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">/root/flag.txt</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#050507] text-zinc-200">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/[0.08] bg-[#08080c] px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onBackToStage}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Mobile Files Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:text-white lg:hidden"
          >
            <PanelLeft className="h-3.5 w-3.5 text-red-400" />
            <span>Files</span>
          </button>

          {/* Desktop Files Toggle */}
          <button
            type="button"
            onClick={() => setDesktopSidebarOpen((p) => !p)}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-400 transition hover:text-white lg:inline-flex"
          >
            <PanelLeft className="h-3.5 w-3.5" />
            <span>Files</span>
          </button>

          <div className="flex min-w-0 items-center gap-1.5 font-mono text-xs">
            <Terminal className="hidden h-3.5 w-3.5 shrink-0 text-red-500 sm:block" />
            <span className="truncate font-semibold text-white">
              {shellState.isRoot ? 'root@c4ptr4' : 'c4ptr4'}
            </span>
            <span className="hidden truncate rounded border border-white/10 bg-black/50 px-2 py-0.5 text-[11px] text-zinc-400 md:inline">
              {formatPromptPath(shellState.cwd)}
            </span>
            {shellState.isRoot && (
              <span className="shrink-0 rounded border border-red-500/40 bg-red-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                #
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchVisual}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-zinc-200 transition hover:border-white/25 hover:text-white"
        >
          <LayoutGrid className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Resume View</span>
          <span className="sm:hidden">Resume</span>
        </button>
      </header>

      {/* Mobile Slide-Over File Explorer Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/75 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <aside
            className="flex h-full w-72 max-w-[82vw] flex-col border-r border-white/10 bg-[#08080c] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                /home/roshan
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close files"
                className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{renderFileTree()}</div>
          </aside>
        </div>
      )}

      {/* Main Split */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {desktopSidebarOpen && (
          <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-white/[0.07] bg-[#07070b] p-4 lg:block">
            <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
              /home/roshan
            </div>
            {renderFileTree()}
          </aside>
        )}

        {/* Full-Height Breathing Terminal Area */}
        <main
          className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#050507]"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5 font-mono text-[12.5px] leading-relaxed sm:px-8 sm:py-6 sm:text-[14px]"
          >
            {blocks.map((block) => (
              <div key={block.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 break-all">
                  <span
                    className={
                      block.prompt.startsWith('root@')
                        ? 'font-bold text-red-500'
                        : 'font-semibold text-red-400'
                    }
                  >
                    {block.prompt}
                  </span>
                  <span className="text-white">{block.command}</span>
                </div>
                {block.lines.length > 0 && (
                  <div className="space-y-0.5 overflow-x-auto pl-0.5">
                    {block.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`whitespace-pre-wrap break-words ${LINE_STYLE[line.tone ?? 'default']}`}
                      >
                        {renderWithLinks(line.text)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Inline Active Shell Prompt — 16px on mobile prevents iOS Safari auto-zoom */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 sm:flex-nowrap"
            >
              <span
                className={`shrink-0 text-[12.5px] sm:text-[14px] ${
                  shellState.isRoot ? 'font-bold text-red-500' : 'font-semibold text-red-400'
                }`}
              >
                {prompt}
              </span>
              <div className="relative flex min-w-[160px] flex-1 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  aria-label="Linux terminal prompt"
                  className="w-full bg-transparent text-[16px] text-white caret-red-500 focus:outline-none sm:text-[14px]"
                />
                {tabHint && (
                  <span className="pointer-events-none ml-2 hidden shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] text-zinc-500 sm:inline">
                    Tab → {tabHint}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Bottom Quick-Command Bar */}
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-white/[0.07] bg-[#08080c] px-4 py-2.5 sm:px-8">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-red-500" />
            {QUICK_COMMANDS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  runCommand(q);
                }}
                className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11.5px] text-zinc-300 transition hover:border-red-500/45 hover:bg-red-600/15 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

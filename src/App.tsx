import { useState } from 'react';
import { FileText, Terminal } from 'lucide-react';
import HackTerminal from './components/HackTerminal';
import IntelDossier from './components/IntelDossier';
import TargetHud from './components/TargetHud';
import { BOX_META, PROFILE } from './data/portfolio';
import {
  BoxState,
  DossierTab,
  executeCommand,
  getInitialBanner,
  getPrompt,
  INITIAL_BOX_STATE,
  TerminalBlock,
} from './engine/boxEngine';

export default function App() {
  const [boxState, setBoxState] = useState<BoxState>(() => ({
    ...INITIAL_BOX_STATE,
    unlocked: { ...INITIAL_BOX_STATE.unlocked },
    flags: { ...INITIAL_BOX_STATE.flags },
  }));
  const [blocks, setBlocks] = useState<TerminalBlock[]>(() => [getInitialBanner()]);
  const [mobilePane, setMobilePane] = useState<'terminal' | 'dossier'>('terminal');
  const [toast, setToast] = useState<string | null>(null);
  const [unreadIntel, setUnreadIntel] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => {
      setToast((current) => (current === msg ? null : current));
    }, 3400);
  };

  const handleRunCommand = (rawCommand: string) => {
    const prevUnlockedCount = Object.values(boxState.unlocked).filter(Boolean).length;
    const prevRoot = boxState.flags.root;
    const prevUser = boxState.flags.user;
    const promptBefore = getPrompt(boxState);

    const result = executeCommand(rawCommand, boxState);

    if (result.openUrl) {
      window.open(result.openUrl, '_blank', 'noopener,noreferrer');
    }

    if (result.clear) {
      setBlocks([]);
    } else if (rawCommand.trim()) {
      const entry: TerminalBlock = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        prompt: promptBefore,
        command: rawCommand.trim(),
        lines: result.lines,
      };
      setBlocks((prev) => [...prev.slice(-30), entry]);
    }

    setBoxState(result.nextState);

    const nextUnlockedCount = Object.values(result.nextState.unlocked).filter(Boolean).length;
    if (!prevRoot && result.nextState.flags.root) {
      showToast(`🏆 ROOT OWNED · ${BOX_META.rootFlag}`);
      setUnreadIntel(true);
    } else if (!prevUser && result.nextState.flags.user) {
      showToast(`🚩 USER FLAG CAPTURED · Research & Write-ups Unlocked`);
      setUnreadIntel(true);
    } else if (nextUnlockedCount > prevUnlockedCount) {
      showToast(`🔓 NEW INTEL DECRYPTED · Module ${result.nextState.activeTab.toUpperCase()} Ready`);
      setUnreadIntel(true);
    }
  };

  const handleSelectTab = (tab: DossierTab) => {
    setBoxState((prev) => ({ ...prev, activeTab: tab }));
    setUnreadIntel(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-canvas bg-grid-subtle text-slate-200">
      {/* Ambient Cyber Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.11),transparent_65%)]"
      />

      <TargetHud
        boxState={boxState}
        onAutoPwn={() => handleRunCommand('autopwn')}
        onReset={() => handleRunCommand('reset')}
      />

      {/* Live Toast Notification */}
      {toast && (
        <div className="pointer-events-none fixed right-4 bottom-5 z-50 animate-bounce rounded-xl border border-emerald-400/40 bg-[#0b131e]/95 px-4 py-2.5 font-mono text-xs font-semibold text-emerald-200 shadow-2xl shadow-emerald-500/20 backdrop-blur-md">
          {toast}
        </div>
      )}

      {/* Mobile Pane Switcher */}
      <div className="sticky top-[61px] z-40 border-b border-white/[0.08] bg-canvas/95 px-4 py-2 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMobilePane('terminal')}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border py-2 font-mono text-xs font-semibold transition ${
              mobilePane === 'terminal'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                : 'border-white/10 bg-white/[0.03] text-slate-400'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Attacker Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobilePane('dossier');
              setUnreadIntel(false);
            }}
            className={`relative inline-flex items-center justify-center gap-2 rounded-lg border py-2 font-mono text-xs font-semibold transition ${
              mobilePane === 'dossier'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                : 'border-white/10 bg-white/[0.03] text-slate-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Intel Dossier</span>
            {unreadIntel && mobilePane !== 'dossier' && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Main Split Command Center */}
      <main className="relative mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6">
        <div className="grid items-start gap-5 lg:grid-cols-12">
          {/* Left: Interactive Attacker Terminal */}
          <div
            className={`lg:sticky lg:top-[82px] lg:col-span-5 lg:block ${
              mobilePane === 'terminal' ? 'block' : 'hidden'
            }`}
          >
            <HackTerminal
              boxState={boxState}
              blocks={blocks}
              onRunCommand={handleRunCommand}
            />
          </div>

          {/* Right: Live Intel Dossier */}
          <div
            className={`lg:col-span-7 lg:block ${
              mobilePane === 'dossier' ? 'block' : 'hidden'
            }`}
          >
            <IntelDossier
              boxState={boxState}
              onSelectTab={handleSelectTab}
              onRunCommand={handleRunCommand}
              onAutoPwn={() => handleRunCommand('autopwn')}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] bg-surface/40 py-4">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 font-mono text-[11px] text-slate-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} ({PROFILE.handle}) · BOX://{BOX_META.hostname}
          </p>
          <p>Type &quot;help&quot; in terminal or click Auto-Pwn for instant dossier access</p>
        </div>
      </footer>
    </div>
  );
}

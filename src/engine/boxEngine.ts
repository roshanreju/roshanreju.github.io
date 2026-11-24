import { PROFILE, SOCIALS } from '../data/portfolio';

export type SectionId = 'about' | 'experience' | 'projects' | 'contact';

export interface TerminalLine {
  text: string;
  tone?: 'default' | 'red' | 'bright' | 'muted' | 'badge';
}

export interface TerminalEntry {
  id: string;
  prompt: string;
  command: string;
  lines: TerminalLine[];
}

export interface HackState {
  unlocked: Record<SectionId, boolean>;
  activeSection: SectionId | null;
  showAll: boolean;
  isRoot: boolean;
}

export interface QuickAction {
  step: string;
  section: SectionId;
  title: string;
  subtitle: string;
  command: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    step: '01',
    section: 'about',
    title: 'Scan Profile',
    subtitle: 'About me & skills',
    command: 'scan',
  },
  {
    step: '02',
    section: 'experience',
    title: 'Breach Career',
    subtitle: 'Work & education',
    command: 'career',
  },
  {
    step: '03',
    section: 'projects',
    title: 'Inspect Lab',
    subtitle: 'Projects & papers',
    command: 'projects',
  },
  {
    step: '04',
    section: 'contact',
    title: 'Get Root',
    subtitle: 'Awards & contact',
    command: 'root',
  },
];

export const INITIAL_HACK_STATE: HackState = {
  unlocked: {
    about: false,
    experience: false,
    projects: false,
    contact: false,
  },
  activeSection: null,
  showAll: false,
  isRoot: false,
};

export const AUTOCOMPLETE_LIST = [
  'scan',
  'nmap',
  'career',
  'experience',
  'projects',
  'research',
  'root',
  'contact',
  'all',
  'whoami',
  'ls',
  'help',
  'open github',
  'open linkedin',
  'open twitter',
  'open medium',
  'clear',
  'reset',
];

export function getPrompt(state: HackState): string {
  return state.isRoot ? 'root@roshan-box:~#' : 'guest@roshan-box:~$';
}

export function getWelcomeEntry(): TerminalEntry {
  return {
    id: 'welcome',
    prompt: 'guest@roshan-box:~$',
    command: './start',
    lines: [
      { text: 'Connected to ROSHAN-BOX (@C4PTR4 · Chicago).', tone: 'bright' },
      {
        text: 'Click any button below — or type a command (scan, career, projects, root, help) — to explore.',
        tone: 'muted',
      },
    ],
  };
}

export interface CommandOutcome {
  nextState: HackState;
  lines: TerminalLine[];
  clear?: boolean;
  openUrl?: string;
  scrollToContent?: boolean;
}

export function runBoxCommand(rawInput: string, state: HackState): CommandOutcome {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { nextState: state, lines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').toLowerCase();

  if (cmd === 'clear' || cmd === 'cls') {
    return { nextState: state, lines: [], clear: true };
  }

  if (cmd === 'reset') {
    return {
      nextState: {
        unlocked: { about: false, experience: false, projects: false, contact: false },
        activeSection: null,
        showAll: false,
        isRoot: false,
      },
      lines: [{ text: '[*] Box reset. Start again with "scan" or click a button below.', tone: 'muted' }],
    };
  }

  if (cmd === 'help' || cmd === '?') {
    return {
      nextState: state,
      lines: [
        { text: 'Commands you can type (or just click the buttons below):', tone: 'bright' },
        { text: '  scan / nmap        Unlock About & Focus Areas', tone: 'default' },
        { text: '  career / resume    Unlock Experience & Education', tone: 'default' },
        { text: '  projects / papers  Unlock Projects, IEEE & Write-ups', tone: 'default' },
        { text: '  root / contact     Escalate to root (Certs, Awards & Contact)', tone: 'default' },
        { text: '  all                Unlock & display the entire portfolio', tone: 'default' },
        { text: '  open <github|linkedin|twitter|medium>   Open social link', tone: 'default' },
        { text: '  whoami · ls · clear · reset', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'all' || cmd === 'autopwn' || cmd === 'unlock') {
    return {
      nextState: {
        unlocked: { about: true, experience: true, projects: true, contact: true },
        activeSection: 'about',
        showAll: true,
        isRoot: true,
      },
      lines: [
        { text: '[+] FULL ACCESS GRANTED — All 4 sections unlocked below.', tone: 'badge' },
        { text: 'Scroll down to read Roshan’s full portfolio.', tone: 'muted' },
      ],
      scrollToContent: true,
    };
  }

  // Step 1: About
  if (cmd === 'scan' || cmd === 'nmap' || cmd === 'whois' || cmd === 'about') {
    const unlocked = { ...state.unlocked, about: true };
    const allUnlocked = Object.values(unlocked).every(Boolean);
    return {
      nextState: {
        unlocked,
        activeSection: 'about',
        showAll: false,
        isRoot: state.isRoot || allUnlocked,
      },
      lines: [
        { text: '[*] Scanning target ROSHAN-BOX...', tone: 'muted' },
        { text: `[+] TARGET FOUND: ${PROFILE.name} (${PROFILE.handle}) — ${PROFILE.tagline}`, tone: 'red' },
        { text: '[✓] Unlocked: About & Focus Areas (shown below).', tone: 'bright' },
      ],
      scrollToContent: true,
    };
  }

  // Step 2: Experience
  if (
    cmd === 'career' ||
    cmd === 'experience' ||
    cmd === 'resume' ||
    cmd === 'gobuster' ||
    cmd === 'enum' ||
    cmd === 'education'
  ) {
    const unlocked = { ...state.unlocked, experience: true };
    const allUnlocked = Object.values(unlocked).every(Boolean);
    return {
      nextState: {
        unlocked,
        activeSection: 'experience',
        showAll: false,
        isRoot: state.isRoot || allUnlocked,
      },
      lines: [
        { text: '[*] Enumerating /career and /education endpoints...', tone: 'muted' },
        { text: '[+] 200 OK — Google (Red Team), Northeastern Khoury TA, H&R Block (AppSec & CSIRT).', tone: 'red' },
        { text: '[✓] Unlocked: Experience, Education & Volunteering (shown below).', tone: 'bright' },
      ],
      scrollToContent: true,
    };
  }

  // Step 3: Projects & Research
  if (
    cmd === 'projects' ||
    cmd === 'project' ||
    cmd === 'research' ||
    cmd === 'papers' ||
    cmd === 'ssh' ||
    cmd === 'exploit' ||
    cmd === 'lab'
  ) {
    const unlocked = { ...state.unlocked, projects: true };
    const allUnlocked = Object.values(unlocked).every(Boolean);
    return {
      nextState: {
        unlocked,
        activeSection: 'projects',
        showAll: false,
        isRoot: state.isRoot || allUnlocked,
      },
      lines: [
        { text: '[*] Opening interactive shell to /opt/projects & /opt/research...', tone: 'muted' },
        { text: '[+] SHELL ACTIVE — Extracted Phishector, Nikto_capt.r4, IEEE paper & write-ups.', tone: 'red' },
        { text: '[✓] Unlocked: Projects & Publications (shown below).', tone: 'bright' },
      ],
      scrollToContent: true,
    };
  }

  // Step 4: Root, Certs, Awards & Contact
  if (
    cmd === 'root' ||
    cmd === 'sudo' ||
    cmd === 'privesc' ||
    cmd === 'contact' ||
    cmd === 'vault' ||
    cmd === 'certs' ||
    cmd === 'awards'
  ) {
    const unlocked = { ...state.unlocked, contact: true };
    return {
      nextState: {
        unlocked,
        activeSection: 'contact',
        showAll: false,
        isRoot: true,
      },
      lines: [
        { text: '[*] Escalating privileges -> UID=0 (root)...', tone: 'muted' },
        { text: 'ACCESS GRANTED // ROOT SHELL ACTIVE (#)', tone: 'badge' },
        { text: '[✓] Unlocked: OffSec LLM Red Teaming, PenTest+, CEH HoF, Awards & Contact.', tone: 'bright' },
      ],
      scrollToContent: true,
    };
  }

  if (cmd === 'whoami') {
    return {
      nextState: state,
      lines: [
        {
          text: state.isRoot
            ? 'root (you own the box — full access unlocked!)'
            : 'guest (friendly visitor exploring Roshan’s machine)',
          tone: 'red',
        },
      ],
    };
  }

  if (cmd === 'ls' || cmd === 'dir') {
    return {
      nextState: state,
      lines: [
        { text: 'about/   career/   projects/   vault/   README.txt', tone: 'default' },
        { text: 'Tip: type "scan", "career", "projects", "root", or "all".', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'open') {
    const found = SOCIALS.find(
      (s) => s.label.toLowerCase().includes(arg) || s.handle.toLowerCase().includes(arg)
    );
    if (found && arg) {
      return {
        nextState: state,
        lines: [{ text: `[+] Opening ${found.label} in a new tab...`, tone: 'red' }],
        openUrl: found.href,
      };
    }
    return {
      nextState: state,
      lines: [{ text: 'Try: open github · open linkedin · open twitter · open medium', tone: 'muted' }],
    };
  }

  return {
    nextState: state,
    lines: [
      { text: `Command "${cmd}" not recognized.`, tone: 'red' },
      { text: 'Try: scan, career, projects, root, all, or help (or click a button below).', tone: 'muted' },
    ],
  };
}

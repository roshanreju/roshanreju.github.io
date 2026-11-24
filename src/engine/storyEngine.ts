import { PROFILE, SOCIALS } from '../data/portfolio';

export type ChapterId = 'boot' | 'origin' | 'missions' | 'lab' | 'vault';

export interface ChapterMeta {
  id: ChapterId;
  index: number;
  code: string;
  label: string;
  headline: string;
  narration: string;
  command: string;
  ctaLabel: string;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'boot',
    index: 0,
    code: '00',
    label: 'Suit Boot',
    headline: 'MARK-R4 ONLINE',
    narration:
      'J.A.R.V.I.S.: Armor diagnostics green. Move your cursor to track the MARK-R4 sentinel, then start the mission storyline.',
    command: 'boot',
    ctaLabel: 'Start Story: Chapter 01 →',
  },
  {
    id: 'origin',
    index: 1,
    code: '01',
    label: 'The Origin',
    headline: 'WHO IS @C4PTR4',
    narration:
      'J.A.R.V.I.S.: Scanning operator profile — from ethical hacker and IEEE researcher to Associate Red Team Consultant at Google.',
    command: 'origin',
    ctaLabel: 'Next: Field Missions →',
  },
  {
    id: 'missions',
    index: 2,
    code: '02',
    label: 'Missions',
    headline: 'FIELD OPERATIONS',
    narration:
      'J.A.R.V.I.S.: Loading combat log — Google Red Team (Mandiant TTPs & Cloud), Northeastern Khoury TA, H&R Block AppSec & 24/7 CSIRT.',
    command: 'missions',
    ctaLabel: 'Next: Enter The Lab →',
  },
  {
    id: 'lab',
    index: 3,
    code: '03',
    label: 'The Lab',
    headline: 'WEAPONS & RESEARCH',
    narration:
      'J.A.R.V.I.S.: Accessing Stark Lab blueprints — PHISHECTOR (Kerala Police Cyberdome BSafe), IEEE publication, and offensive tooling.',
    command: 'lab',
    ctaLabel: 'Final Chapter: Root Vault →',
  },
  {
    id: 'vault',
    index: 4,
    code: '04',
    label: 'Root Vault',
    headline: 'OVERDRIVE & COMMS',
    narration:
      'J.A.R.V.I.S.: ROOT OVERDRIVE ENGAGED. OffSec LLM Red Teaming, CompTIA PenTest+, CEH Hall of Fame, and encrypted comms unlocked.',
    command: 'overdrive',
    ctaLabel: 'View Full Dossier',
  },
];

export interface ConsoleLine {
  text: string;
  tone?: 'default' | 'red' | 'gold' | 'white' | 'muted' | 'badge';
}

export interface ConsoleEntry {
  id: string;
  command: string;
  lines: ConsoleLine[];
}

export interface StoryState {
  chapter: ChapterId;
  showAll: boolean;
  overdrive: boolean;
  visited: Record<ChapterId, boolean>;
}

export const INITIAL_STORY_STATE: StoryState = {
  chapter: 'boot',
  showAll: false,
  overdrive: false,
  visited: {
    boot: true,
    origin: false,
    missions: false,
    lab: false,
    vault: false,
  },
};

export const CONSOLE_AUTOCOMPLETE = [
  'boot',
  'origin',
  'scan',
  'missions',
  'career',
  'lab',
  'projects',
  'vault',
  'overdrive',
  'root',
  'jarvis',
  'all',
  'open github',
  'open linkedin',
  'open twitter',
  'open medium',
  'help',
  'clear',
];

export function getWelcomeLog(): ConsoleEntry {
  return {
    id: 'jarvis-init',
    command: 'jarvis --init mark-r4',
    lines: [
      { text: 'J.A.R.V.I.S. v4.0 // STARK RED-TEAM INTERFACE ONLINE', tone: 'gold' },
      { text: `Operator: ${PROFILE.name} (${PROFILE.handle}) · Google Red Team · Chicago`, tone: 'white' },
      { text: 'Use the chapter buttons, or type: origin, missions, lab, overdrive, all, help.', tone: 'muted' },
    ],
  };
}

export interface ConsoleOutcome {
  nextState: StoryState;
  lines: ConsoleLine[];
  clear?: boolean;
  openUrl?: string;
}

export function executeJarvisCommand(raw: string, state: StoryState): ConsoleOutcome {
  const trimmed = raw.trim();
  if (!trimmed) return { nextState: state, lines: [] };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').toLowerCase();

  if (cmd === 'clear' || cmd === 'cls') {
    return { nextState: state, lines: [], clear: true };
  }

  if (cmd === 'help' || cmd === '?') {
    return {
      nextState: state,
      lines: [
        { text: 'J.A.R.V.I.S. Command Protocol:', tone: 'gold' },
        { text: '  boot                 Return to 3D MARK-R4 Showcase', tone: 'default' },
        { text: '  origin / scan        Chapter 01 — About & Focus Areas', tone: 'default' },
        { text: '  missions / career    Chapter 02 — Google, Northeastern, H&R Block', tone: 'default' },
        { text: '  lab / projects       Chapter 03 — Projects, IEEE Paper & Write-ups', tone: 'default' },
        { text: '  overdrive / root     Chapter 04 — Reactor Overdrive, Certs & Contact', tone: 'default' },
        { text: '  all                  Unlock & display the complete story', tone: 'default' },
        { text: '  jarvis               Toggle Suit Overdrive Reactor pulse', tone: 'default' },
        { text: '  open <github|linkedin|twitter|medium|ieee>', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'boot' || cmd === 'home' || cmd === 'suit') {
    return {
      nextState: {
        ...state,
        chapter: 'boot',
        showAll: false,
        visited: { ...state.visited, boot: true },
      },
      lines: [{ text: '[+] Camera locked onto MARK-R4 Sentinel.', tone: 'red' }],
    };
  }

  if (cmd === 'origin' || cmd === 'scan' || cmd === 'nmap' || cmd === 'about' || cmd === 'whoami') {
    return {
      nextState: {
        ...state,
        chapter: 'origin',
        showAll: false,
        visited: { ...state.visited, origin: true },
      },
      lines: [
        { text: '[*] Camera flight -> CHAPTER 01: THE ORIGIN', tone: 'gold' },
        { text: `[+] ${PROFILE.name} (${PROFILE.handle}) — ${PROFILE.tagline}`, tone: 'white' },
      ],
    };
  }

  if (cmd === 'missions' || cmd === 'career' || cmd === 'experience' || cmd === 'resume') {
    return {
      nextState: {
        ...state,
        chapter: 'missions',
        showAll: false,
        visited: { ...state.visited, missions: true },
      },
      lines: [
        { text: '[*] Camera flight -> CHAPTER 02: FIELD MISSIONS', tone: 'gold' },
        { text: '[+] Loaded Google Red Team, Khoury TA, H&R Block & Cyberdome logs.', tone: 'red' },
      ],
    };
  }

  if (cmd === 'lab' || cmd === 'projects' || cmd === 'research' || cmd === 'papers' || cmd === 'ssh') {
    return {
      nextState: {
        ...state,
        chapter: 'lab',
        showAll: false,
        visited: { ...state.visited, lab: true },
      },
      lines: [
        { text: '[*] Camera flight -> CHAPTER 03: THE STARK LAB', tone: 'gold' },
        { text: '[+] Holographic blueprints active: PHISHECTOR, IEEE Paper, Nikto_capt.r4.', tone: 'red' },
      ],
    };
  }

  if (cmd === 'overdrive' || cmd === 'vault' || cmd === 'root' || cmd === 'sudo' || cmd === 'contact' || cmd === 'certs') {
    return {
      nextState: {
        ...state,
        chapter: 'vault',
        showAll: false,
        overdrive: true,
        visited: { ...state.visited, vault: true },
      },
      lines: [
        { text: 'ARC REACTOR OVERDRIVE // ROOT ACCESS GRANTED', tone: 'badge' },
        { text: '[+] Loaded OffSec LLM Red Teaming, PenTest+, CEH HoF & Direct Comms.', tone: 'gold' },
      ],
    };
  }

  if (cmd === 'jarvis') {
    const nextOverdrive = !state.overdrive;
    return {
      nextState: { ...state, overdrive: nextOverdrive },
      lines: [
        {
          text: nextOverdrive
            ? 'J.A.R.V.I.S.: Diverting auxiliary power to MARK-R4 Arc Reactor. Overdrive engaged, sir.'
            : 'J.A.R.V.I.S.: Reactor stabilized to standard stealth output.',
          tone: 'gold',
        },
      ],
    };
  }

  if (cmd === 'all' || cmd === 'full') {
    return {
      nextState: {
        chapter: 'origin',
        showAll: true,
        overdrive: true,
        visited: { boot: true, origin: true, missions: true, lab: true, vault: true },
      },
      lines: [
        { text: 'FULL DOSSIER UNLOCKED // ALL CHAPTERS ACTIVE', tone: 'badge' },
        { text: 'Scroll freely through every chapter below.', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'open') {
    const target = SOCIALS.find(
      (s) => s.label.toLowerCase().includes(arg) || s.handle.toLowerCase().includes(arg)
    );
    if (target && arg) {
      return {
        nextState: state,
        lines: [{ text: `[+] Launching external channel: ${target.label}`, tone: 'gold' }],
        openUrl: target.href,
      };
    }
    return {
      nextState: state,
      lines: [{ text: 'Usage: open <github|linkedin|twitter|medium|ieee>', tone: 'muted' }],
    };
  }

  return {
    nextState: state,
    lines: [
      { text: `J.A.R.V.I.S.: Command "${cmd}" unrecognized.`, tone: 'red' },
      { text: 'Try: origin, missions, lab, overdrive, jarvis, all, or help.', tone: 'muted' },
    ],
  };
}

import {
  AWARDS,
  BOX_META,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  PUBLICATIONS,
  SOCIALS,
} from '../data/portfolio';

export type DossierTab = 'briefing' | 'about' | 'experience' | 'projects' | 'research' | 'vault';

export type AccessLevel = 'unauth' | 'recon' | 'user' | 'root';

export interface TerminalLine {
  text: string;
  tone?: 'default' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'muted' | 'white' | 'flag';
}

export interface TerminalBlock {
  id: string;
  prompt: string;
  command: string;
  lines: TerminalLine[];
}

export interface BoxState {
  access: AccessLevel;
  cwd: string;
  unlocked: Record<DossierTab, boolean>;
  activeTab: DossierTab;
  flags: {
    user: boolean;
    root: boolean;
  };
  discoveredSudo: boolean;
}

export interface MissionStep {
  id: string;
  phase: string;
  label: string;
  command: string;
  description: string;
  targetTab: DossierTab;
}

export const INITIAL_BOX_STATE: BoxState = {
  access: 'unauth',
  cwd: '/home/attacker/roshan-box',
  unlocked: {
    briefing: true,
    about: false,
    experience: false,
    projects: false,
    research: false,
    vault: false,
  },
  activeTab: 'briefing',
  flags: {
    user: false,
    root: false,
  },
  discoveredSudo: false,
};

export const AUTOCOMPLETE_COMMANDS = [
  'help',
  'nmap -sV 10.10.11.24',
  'whois roshan',
  'gobuster dir -u http://10.10.11.24',
  'curl http://10.10.11.24/experience',
  'curl http://10.10.11.24/projects',
  'ssh guest@10.10.11.24',
  'cat user.txt',
  'sudo -l',
  'sudo /usr/local/bin/roshan-vault',
  'cat root.txt',
  'ls',
  'ls -la',
  'pwd',
  'id',
  'whoami',
  'uname -a',
  'flags',
  'open github',
  'open linkedin',
  'open twitter',
  'open medium',
  'open ieee',
  'autopwn',
  'reset',
  'clear',
];

export function getPrompt(state: BoxState): string {
  if (state.access === 'root') {
    return `root@${BOX_META.hostname.toLowerCase()}:${state.cwd}#`;
  }
  if (state.access === 'user') {
    return `guest@${BOX_META.hostname.toLowerCase()}:${state.cwd}$`;
  }
  return `attacker@kali:~/roshan-box$`;
}

export function getNextMission(state: BoxState): MissionStep | null {
  if (!state.unlocked.about) {
    return {
      id: 'recon',
      phase: 'STAGE 01 · RECON',
      label: 'Scan the target box',
      command: `nmap -sV ${BOX_META.ip}`,
      description: 'Discover open ports, services, and target identity.',
      targetTab: 'about',
    };
  }
  if (!state.unlocked.experience || !state.unlocked.projects) {
    return {
      id: 'enum',
      phase: 'STAGE 02 · ENUMERATION',
      label: 'Enumerate hidden endpoints',
      command: `gobuster dir -u http://${BOX_META.ip}`,
      description: 'Uncover career logs, project repos, and SSH foothold hints.',
      targetTab: 'experience',
    };
  }
  if (state.access !== 'user' && state.access !== 'root') {
    return {
      id: 'foothold',
      phase: 'STAGE 03 · FOOTHOLD',
      label: 'SSH into target & grab user.txt',
      command: `ssh guest@${BOX_META.ip}`,
      description: 'Gain user shell to unlock IEEE research, write-ups & user flag.',
      targetTab: 'research',
    };
  }
  if (!state.discoveredSudo && state.access !== 'root') {
    return {
      id: 'sudo-check',
      phase: 'STAGE 04 · PRIVESC RECON',
      label: 'Check sudo privileges',
      command: 'sudo -l',
      description: 'Inspect NOPASSWD binaries to find a root escalation vector.',
      targetTab: 'research',
    };
  }
  if (state.access !== 'root') {
    return {
      id: 'privesc',
      phase: 'STAGE 05 · PRIVILEGE ESCALATION',
      label: 'Escalate to root & unlock vault',
      command: 'sudo /usr/local/bin/roshan-vault',
      description: 'Compromise root to unlock certifications, awards, contact & root.txt.',
      targetTab: 'vault',
    };
  }
  if (!state.flags.root) {
    return {
      id: 'root-flag',
      phase: 'FINAL · CAPTURE FLAG',
      label: 'Exfiltrate root.txt',
      command: 'cat root.txt',
      description: 'Read the final root flag to complete the box.',
      targetTab: 'vault',
    };
  }
  return null;
}

export function getInitialBanner(): TerminalBlock {
  return {
    id: 'init-banner',
    prompt: 'attacker@kali:~/roshan-box$',
    command: './connect --target 10.10.11.24',
    lines: [
      { text: '╔══════════════════════════════════════════════════════════╗', tone: 'emerald' },
      { text: '║   TARGET BOX: ROSHAN-01 (10.10.11.24) · HANDLE: @C4PTR4 ║', tone: 'emerald' },
      { text: '║   OBJECTIVE : Recon → Enum → Foothold → Root Privesc    ║', tone: 'cyan' },
      { text: '╚══════════════════════════════════════════════════════════╝', tone: 'emerald' },
      { text: '[*] VPN tunnel established (tun0: 10.10.14.8 -> 10.10.11.24).', tone: 'muted' },
      {
        text: '[+] Start with "nmap -sV 10.10.11.24", click the mission button above, or type "help".',
        tone: 'white',
      },
      {
        text: '[i] In a hurry? Type "autopwn" or click Auto-Pwn in the top bar to unlock everything.',
        tone: 'muted',
      },
    ],
  };
}

export interface CommandResult {
  nextState: BoxState;
  lines: TerminalLine[];
  clear?: boolean;
  openUrl?: string;
}

export function executeCommand(rawInput: string, state: BoxState): CommandResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { nextState: state, lines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const argStr = parts.slice(1).join(' ').toLowerCase();

  // Clear
  if (cmd === 'clear' || cmd === 'cls') {
    return { nextState: state, lines: [], clear: true };
  }

  // Reset box
  if (cmd === 'reset') {
    return {
      nextState: { ...INITIAL_BOX_STATE, unlocked: { ...INITIAL_BOX_STATE.unlocked }, flags: { user: false, root: false } },
      lines: [
        { text: '[*] Reverting target machine ROSHAN-01 to clean snapshot...', tone: 'amber' },
        { text: '[+] Snapshot restored. You are back on attacker@kali.', tone: 'emerald' },
      ],
    };
  }

  // Auto-Pwn (Recruiter Fast Mode)
  if (cmd === 'autopwn' || cmd === 'pwn' || cmd === 'recruiter') {
    const nextState: BoxState = {
      access: 'root',
      cwd: '/root',
      unlocked: {
        briefing: true,
        about: true,
        experience: true,
        projects: true,
        research: true,
        vault: true,
      },
      activeTab: 'about',
      flags: { user: true, root: true },
      discoveredSudo: true,
    };
    return {
      nextState,
      lines: [
        { text: '[*] Executing automated exploit chain against 10.10.11.24...', tone: 'cyan' },
        { text: '[+] Stage 1/5: nmap recon complete -> About & Focus unlocked', tone: 'emerald' },
        { text: '[+] Stage 2/5: gobuster enum complete -> Experience & Projects unlocked', tone: 'emerald' },
        { text: `[+] Stage 3/5: SSH foothold achieved -> ${BOX_META.userFlag}`, tone: 'flag' },
        { text: '[+] Stage 4/5: Research & IEEE publications exfiltrated', tone: 'emerald' },
        { text: `[+] Stage 5/5: ROOT privesc complete -> ${BOX_META.rootFlag}`, tone: 'flag' },
        { text: '[!] BOX PWNED — All Intel Dossiers are now unlocked in the right panel.', tone: 'white' },
      ],
    };
  }

  // Help
  if (cmd === 'help' || cmd === '?') {
    return {
      nextState: state,
      lines: [
        { text: '── ATTACK KILL-CHAIN ───────────────────────────────────────', tone: 'cyan' },
        { text: `  nmap -sV ${BOX_META.ip}       Scan open ports (unlocks About)`, tone: 'default' },
        { text: `  gobuster dir -u http://${BOX_META.ip}  Enumerate web routes (Experience & Projects)`, tone: 'default' },
        { text: `  ssh guest@${BOX_META.ip}      Exploit foothold (unlocks Research + user.txt)`, tone: 'default' },
        { text: '  sudo -l                       Inspect root privesc vector', tone: 'default' },
        { text: '  sudo /usr/local/bin/roshan-vault  Escalate to root (Vault + root.txt)', tone: 'default' },
        { text: '── SHELL & NAVIGATION ──────────────────────────────────────', tone: 'cyan' },
        { text: '  ls / pwd / id / whoami        Inspect current box session & files', tone: 'default' },
        { text: '  cat <about|experience|projects|research|vault|user.txt|root.txt>', tone: 'default' },
        { text: '  open <github|linkedin|twitter|medium|ieee>  Launch external profile', tone: 'default' },
        { text: '  flags / autopwn / clear / reset', tone: 'default' },
      ],
    };
  }

  // Stage 1: Nmap / Recon
  if (cmd === 'nmap' || cmd === 'scan' || cmd === 'recon') {
    const nextState: BoxState = {
      ...state,
      access: state.access === 'unauth' ? 'recon' : state.access,
      unlocked: { ...state.unlocked, about: true },
      activeTab: 'about',
    };
    return {
      nextState,
      lines: [
        { text: `Starting Nmap 7.95 against ${BOX_META.hostname} (${BOX_META.ip})...`, tone: 'muted' },
        { text: 'PORT     STATE SERVICE  VERSION', tone: 'cyan' },
        { text: '22/tcp   open  ssh      OpenSSH 9.6p1 (guest auth enabled?)', tone: 'default' },
        { text: '80/tcp   open  http     nginx 1.26 (About / Identity Portal)', tone: 'emerald' },
        { text: '443/tcp  open  https    Career & Experience API', tone: 'default' },
        { text: '3000/tcp open  http     Projects & Open Source Lab', tone: 'default' },
        { text: '8080/tcp open  http     IEEE Research & @C4PTR4 Write-ups', tone: 'default' },
        { text: '9000/tcp open  vault    Credentials & Contact [ROOT ONLY]', tone: 'amber' },
        { text: '', tone: 'default' },
        { text: '[+] INTEL UNLOCKED: Module 01 (About & Focus) loaded in Dossier.', tone: 'emerald' },
        { text: `[*] Next step: Run "gobuster dir -u http://${BOX_META.ip}" to enumerate endpoints.`, tone: 'cyan' },
      ],
    };
  }

  // Whois
  if (cmd === 'whois') {
    const nextState: BoxState = {
      ...state,
      access: state.access === 'unauth' ? 'recon' : state.access,
      unlocked: { ...state.unlocked, about: true },
      activeTab: 'about',
    };
    return {
      nextState,
      lines: [
        { text: `Target Name : ${PROFILE.name} (${PROFILE.handle})`, tone: 'emerald' },
        { text: `Role        : ${PROFILE.tagline}`, tone: 'default' },
        { text: `Location    : ${PROFILE.location}`, tone: 'default' },
        { text: `Education   : Northeastern University (MS) · RSET (B.Tech)`, tone: 'default' },
        { text: `Highlights  : Google Security Intern · H&R Block AppSec/CSIRT · CEH Hall of Fame`, tone: 'cyan' },
        { text: '[+] Loaded About & Focus dossier.', tone: 'emerald' },
      ],
    };
  }

  // Stage 2: Gobuster / Enumeration
  if (cmd === 'gobuster' || cmd === 'ffuf' || cmd === 'dirb' || cmd === 'enum') {
    const nextState: BoxState = {
      ...state,
      access: state.access === 'unauth' ? 'recon' : state.access,
      unlocked: {
        ...state.unlocked,
        about: true,
        experience: true,
        projects: true,
      },
      activeTab: 'experience',
    };
    return {
      nextState,
      lines: [
        { text: `Gobuster v3.6 :: Directory enumeration on http://${BOX_META.ip}`, tone: 'muted' },
        { text: '/about                (Status: 200) [Identity & Focus Areas]', tone: 'default' },
        { text: '/experience           (Status: 200) [Google, H&R Block, Capgemini]', tone: 'emerald' },
        { text: '/education            (Status: 200) [Northeastern Univ, RSET]', tone: 'emerald' },
        { text: '/projects             (Status: 200) [Phishector, Nikto_capt.r4, CTF]', tone: 'emerald' },
        { text: '/.ssh_hint            (Status: 200) [FOUND: ssh guest@10.10.11.24]', tone: 'amber' },
        { text: '/vault                (Status: 403) [Forbidden — Requires root]', tone: 'rose' },
        { text: '', tone: 'default' },
        { text: '[+] INTEL UNLOCKED: Modules 02 (Experience) & 03 (Projects) decrypted!', tone: 'emerald' },
        { text: `[*] Foothold discovered! Run "ssh guest@${BOX_META.ip}" to shell the box.`, tone: 'cyan' },
      ],
    };
  }

  // Curl endpoints
  if (cmd === 'curl') {
    if (argStr.includes('project')) {
      const nextState: BoxState = {
        ...state,
        unlocked: { ...state.unlocked, about: true, projects: true },
        activeTab: 'projects',
      };
      return {
        nextState,
        lines: [
          { text: `HTTP/1.1 200 OK — GET /projects (${PROJECTS.length} items)`, tone: 'emerald' },
          ...PROJECTS.slice(0, 4).map((p) => ({
            text: `  • ${p.title} [${p.category}]`,
            tone: 'default' as const,
          })),
          { text: '[+] Focused Projects & Arsenal dossier.', tone: 'cyan' },
        ],
      };
    }
    if (argStr.includes('exp') || argStr.includes('career') || argStr.includes('edu')) {
      const nextState: BoxState = {
        ...state,
        unlocked: { ...state.unlocked, about: true, experience: true },
        activeTab: 'experience',
      };
      return {
        nextState,
        lines: [
          { text: `HTTP/1.1 200 OK — GET /experience`, tone: 'emerald' },
          ...EXPERIENCE.map((e) => ({
            text: `  • ${e.role} @ ${e.organization} (${e.period})`,
            tone: 'default' as const,
          })),
          { text: '[+] Focused Experience & Education dossier.', tone: 'cyan' },
        ],
      };
    }
    if (argStr.includes('vault')) {
      if (state.access !== 'root') {
        return {
          nextState: state,
          lines: [
            { text: 'HTTP/1.1 403 Forbidden — /vault requires root privileges.', tone: 'rose' },
            { text: '[*] Gain SSH foothold first, then inspect "sudo -l".', tone: 'muted' },
          ],
        };
      }
      return {
        nextState: { ...state, activeTab: 'vault' },
        lines: [{ text: '[+] HTTP/1.1 200 OK — Vault dossier opened.', tone: 'emerald' }],
      };
    }
    return {
      nextState: { ...state, unlocked: { ...state.unlocked, about: true }, activeTab: 'about' },
      lines: [
        { text: `HTTP/1.1 200 OK — ${PROFILE.name} (${PROFILE.handle}) · ${PROFILE.tagline}`, tone: 'emerald' },
        { text: 'Tip: try "curl http://10.10.11.24/experience" or "curl http://10.10.11.24/projects".', tone: 'muted' },
      ],
    };
  }

  // Stage 3: SSH Foothold
  if (cmd === 'ssh' || cmd === 'exploit') {
    const nextState: BoxState = {
      ...state,
      access: state.access === 'root' ? 'root' : 'user',
      cwd: state.access === 'root' ? '/root' : '/home/guest',
      unlocked: {
        ...state.unlocked,
        about: true,
        experience: true,
        projects: true,
        research: true,
      },
      activeTab: 'research',
      flags: { ...state.flags, user: true },
    };
    return {
      nextState,
      lines: [
        { text: `Connecting to guest@${BOX_META.ip}:22...`, tone: 'muted' },
        { text: 'Authenticated with key [id_ed25519_c4ptr4]. Welcome to ROSHAN-01!', tone: 'emerald' },
        { text: `Linux ${BOX_META.hostname.toLowerCase()} 6.8.0-sec #1 SMP Chicago x86_64`, tone: 'muted' },
        { text: '', tone: 'default' },
        { text: `[FLAG CAPTURED] user.txt => ${BOX_META.userFlag}`, tone: 'flag' },
        { text: '[+] INTEL UNLOCKED: Module 04 (IEEE Research & Medium Write-ups) decrypted!', tone: 'emerald' },
        { text: '[*] Shell upgraded to guest@roshan-01. Check "sudo -l" for privilege escalation!', tone: 'cyan' },
      ],
    };
  }

  // Stage 4 & 5: sudo -l / privesc
  if (cmd === 'sudo' || cmd === 'privesc' || cmd === 'escalate') {
    if (state.access !== 'user' && state.access !== 'root') {
      return {
        nextState: state,
        lines: [
          { text: '[-] You are still on your local Kali host! Gain a shell on the box first.', tone: 'rose' },
          { text: `[*] Run "ssh guest@${BOX_META.ip}" to establish foothold.`, tone: 'cyan' },
        ],
      };
    }

    if (cmd === 'sudo' && argStr === '-l') {
      const nextState: BoxState = { ...state, discoveredSudo: true };
      return {
        nextState,
        lines: [
          { text: 'Matching Defaults entries for guest on roshan-01:', tone: 'muted' },
          { text: '    env_reset, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin', tone: 'muted' },
          { text: 'User guest may run the following commands on roshan-01:', tone: 'white' },
          { text: '    (root) NOPASSWD: /usr/local/bin/roshan-vault', tone: 'amber' },
          { text: '', tone: 'default' },
          { text: '[!] Misconfiguration found! Run "sudo /usr/local/bin/roshan-vault" to escalate to root.', tone: 'emerald' },
        ],
      };
    }

    if (
      cmd === 'privesc' ||
      cmd === 'escalate' ||
      argStr.includes('roshan-vault') ||
      argStr === 'su' ||
      argStr === '-i' ||
      argStr.includes('bash') ||
      argStr.includes('sh')
    ) {
      const nextState: BoxState = {
        ...state,
        access: 'root',
        cwd: '/root',
        discoveredSudo: true,
        unlocked: {
          briefing: true,
          about: true,
          experience: true,
          projects: true,
          research: true,
          vault: true,
        },
        activeTab: 'vault',
        flags: { user: true, root: true },
      };
      return {
        nextState,
        lines: [
          { text: '[*] Invoking /usr/local/bin/roshan-vault as UID=0 (root)...', tone: 'cyan' },
          { text: '[+] UID=0(root) GID=0(root) — ROOT SHELL OBTAINED!', tone: 'emerald' },
          { text: `[FLAG CAPTURED] root.txt => ${BOX_META.rootFlag}`, tone: 'flag' },
          { text: '[+] INTEL UNLOCKED: Module 05 (Vault: Certs, Awards & Direct Contact) decrypted!', tone: 'emerald' },
          { text: '🏆 MACHINE PWNED! Every section of Roshan Reju’s dossier is now unlocked.', tone: 'white' },
        ],
      };
    }

    return {
      nextState: state,
      lines: [
        { text: `sudo: unable to run "${argStr || '(empty)'}" — try "sudo -l" first.`, tone: 'amber' },
      ],
    };
  }

  // Filesystem & Identity Inspection
  if (cmd === 'whoami') {
    if (state.access === 'root') {
      return { nextState: state, lines: [{ text: 'root (uid=0 · Full access to ROSHAN-01)', tone: 'emerald' }] };
    }
    if (state.access === 'user') {
      return { nextState: state, lines: [{ text: 'guest (uid=1001 · Standard shell on ROSHAN-01)', tone: 'cyan' }] };
    }
    return {
      nextState: state,
      lines: [
        { text: 'attacker (Kali Linux · Remote operator targeting ROSHAN-01)', tone: 'amber' },
        { text: 'Tip: run "whois roshan" to inspect the target, or "nmap -sV 10.10.11.24" to scan.', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'id') {
    if (state.access === 'root') {
      return { nextState: state, lines: [{ text: 'uid=0(root) gid=0(root) groups=0(root),27(sudo),1337(redteam)', tone: 'emerald' }] };
    }
    if (state.access === 'user') {
      return { nextState: state, lines: [{ text: 'uid=1001(guest) gid=1001(guest) groups=1001(guest),100(recon)', tone: 'cyan' }] };
    }
    return { nextState: state, lines: [{ text: 'uid=1000(attacker) gid=1000(kali) groups=1000(kali),27(sudo)', tone: 'default' }] };
  }

  if (cmd === 'pwd') {
    return { nextState: state, lines: [{ text: state.cwd, tone: 'default' }] };
  }

  if (cmd === 'uname') {
    return {
      nextState: state,
      lines: [
        {
          text:
            state.access === 'user' || state.access === 'root'
              ? `Linux ${BOX_META.hostname.toLowerCase()} 6.8.0-49-sec #1 SMP x86_64 GNU/Linux`
              : 'Linux kali 6.11.2-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
          tone: 'default',
        },
      ],
    };
  }

  if (cmd === 'ls' || cmd === 'dir') {
    if (state.access === 'root') {
      return {
        nextState: state,
        lines: [
          { text: 'root.txt   certs.pem   awards.log   contact.txt   /home/guest/user.txt', tone: 'emerald' },
          { text: 'Tip: run "cat root.txt", "cat certs.pem", or "cat contact.txt".', tone: 'muted' },
        ],
      };
    }
    if (state.access === 'user') {
      return {
        nextState: state,
        lines: [
          { text: 'user.txt   research.md   experience.log   projects.json   about.txt', tone: 'cyan' },
          { text: 'Tip: run "cat user.txt", "cat research.md", or "sudo -l".', tone: 'muted' },
        ],
      };
    }
    return {
      nextState: state,
      lines: [
        { text: 'target.txt   wordlists/   notes.md', tone: 'default' },
        { text: `Tip: run "nmap -sV ${BOX_META.ip}" to start attacking ROSHAN-01.`, tone: 'muted' },
      ],
    };
  }

  if (cmd === 'cd') {
    const dest = parts[1] || (state.access === 'root' ? '/root' : state.access === 'user' ? '/home/guest' : '/home/attacker/roshan-box');
    if (dest.startsWith('/root') && state.access !== 'root') {
      return { nextState: state, lines: [{ text: 'bash: cd: /root: Permission denied', tone: 'rose' }] };
    }
    return { nextState: { ...state, cwd: dest }, lines: [] };
  }

  // Cat files & direct tab jump
  if (cmd === 'cat') {
    if (!argStr) {
      return { nextState: state, lines: [{ text: 'Usage: cat <filename> (e.g. cat user.txt, cat about.txt)', tone: 'muted' }] };
    }
    if (argStr.includes('user.txt')) {
      if (state.access !== 'user' && state.access !== 'root') {
        return { nextState: state, lines: [{ text: 'cat: user.txt: Permission denied (gain SSH foothold first)', tone: 'rose' }] };
      }
      return {
        nextState: { ...state, flags: { ...state.flags, user: true } },
        lines: [{ text: BOX_META.userFlag, tone: 'flag' }],
      };
    }
    if (argStr.includes('root.txt')) {
      if (state.access !== 'root') {
        return { nextState: state, lines: [{ text: 'cat: /root/root.txt: Permission denied (root required)', tone: 'rose' }] };
      }
      return {
        nextState: { ...state, flags: { ...state.flags, root: true }, activeTab: 'vault' },
        lines: [{ text: BOX_META.rootFlag, tone: 'flag' }],
      };
    }
    if (argStr.includes('about') || argStr.includes('target')) {
      return {
        nextState: { ...state, unlocked: { ...state.unlocked, about: true }, activeTab: 'about' },
        lines: [
          { text: `${PROFILE.name} (${PROFILE.handle}) — ${PROFILE.tagline}`, tone: 'emerald' },
          { text: PROFILE.heroBio, tone: 'default' },
        ],
      };
    }
    if (argStr.includes('exp') || argStr.includes('edu') || argStr.includes('career')) {
      if (!state.unlocked.experience) {
        return {
          nextState: state,
          lines: [{ text: `[-] File not enumerated yet. Run "gobuster dir -u http://${BOX_META.ip}" first.`, tone: 'amber' }],
        };
      }
      return {
        nextState: { ...state, activeTab: 'experience' },
        lines: [
          ...EXPERIENCE.map((e) => ({ text: `[EXP] ${e.role} @ ${e.organization} (${e.period})`, tone: 'emerald' as const })),
          ...EDUCATION.map((ed) => ({ text: `[EDU] ${ed.degree} — ${ed.institution}`, tone: 'cyan' as const })),
        ],
      };
    }
    if (argStr.includes('project')) {
      if (!state.unlocked.projects) {
        return {
          nextState: state,
          lines: [{ text: `[-] File not enumerated yet. Run "gobuster dir -u http://${BOX_META.ip}" first.`, tone: 'amber' }],
        };
      }
      return {
        nextState: { ...state, activeTab: 'projects' },
        lines: PROJECTS.map((p) => ({ text: `[*] ${p.title} — ${p.stack.join(', ')}`, tone: 'default' })),
      };
    }
    if (argStr.includes('research') || argStr.includes('ieee') || argStr.includes('blog')) {
      if (!state.unlocked.research) {
        return {
          nextState: state,
          lines: [{ text: `[-] Locked! Run "ssh guest@${BOX_META.ip}" to unlock Research & Write-ups.`, tone: 'amber' }],
        };
      }
      return {
        nextState: { ...state, activeTab: 'research' },
        lines: PUBLICATIONS.map((pub) => ({ text: `[${pub.type}] ${pub.title} (${pub.date})`, tone: 'cyan' })),
      };
    }
    if (argStr.includes('cert') || argStr.includes('award') || argStr.includes('contact') || argStr.includes('vault')) {
      if (!state.unlocked.vault) {
        return {
          nextState: state,
          lines: [{ text: '[-] Vault encrypted! Escalate to root ("sudo -l" -> "sudo /usr/local/bin/roshan-vault").', tone: 'rose' }],
        };
      }
      return {
        nextState: { ...state, activeTab: 'vault' },
        lines: [
          ...CERTIFICATIONS.map((c) => ({ text: `[CERT] ${c.name} — ${c.issuer}`, tone: 'emerald' as const })),
          ...AWARDS.slice(0, 3).map((a) => ({ text: `[AWARD] ${a.title} (${a.date})`, tone: 'cyan' as const })),
          { text: `[CONTACT] ${PROFILE.email} · ${PROFILE.location}`, tone: 'white' },
        ],
      };
    }
    return {
      nextState: state,
      lines: [{ text: `cat: ${argStr}: No such file or directory`, tone: 'rose' }],
    };
  }

  // Flags status
  if (cmd === 'flags' || cmd === 'status') {
    const unlockedCount = Object.entries(state.unlocked).filter(([k, v]) => k !== 'briefing' && v).length;
    return {
      nextState: state,
      lines: [
        { text: `Box        : ${BOX_META.hostname} (${BOX_META.ip})`, tone: 'cyan' },
        { text: `Access     : ${state.access.toUpperCase()}`, tone: state.access === 'root' ? 'emerald' : 'amber' },
        { text: `Modules    : ${unlockedCount}/5 Intel Dossiers unlocked`, tone: 'default' },
        { text: `user.txt   : ${state.flags.user ? BOX_META.userFlag : '[LOCKED]'}`, tone: state.flags.user ? 'flag' : 'muted' },
        { text: `root.txt   : ${state.flags.root ? BOX_META.rootFlag : '[LOCKED]'}`, tone: state.flags.root ? 'flag' : 'muted' },
      ],
    };
  }

  // Open external links
  if (cmd === 'open') {
    const match = SOCIALS.find(
      (s) => s.label.toLowerCase().includes(argStr) || s.handle.toLowerCase().includes(argStr)
    );
    if (match && argStr) {
      return {
        nextState: state,
        lines: [{ text: `[+] Launching ${match.label} -> ${match.href}`, tone: 'emerald' }],
        openUrl: match.href,
      };
    }
    return {
      nextState: state,
      lines: [{ text: 'Usage: open <github|linkedin|twitter|medium|ieee>', tone: 'muted' }],
    };
  }

  // Unknown command
  return {
    nextState: state,
    lines: [
      { text: `bash: ${cmd}: command not found`, tone: 'rose' },
      { text: 'Type "help" to list valid commands, or click the guided mission step above.', tone: 'muted' },
    ],
  };
}

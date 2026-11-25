import {
  AWARDS,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  FOCUS_AREAS,
  PROFILE,
  PROJECTS,
  PUBLICATIONS,
  SKILL_GROUPS,
  SOCIALS,
  VOLUNTEERING,
} from '../data/portfolio';

export interface FsFile {
  type: 'file';
  content: string;
  hidden?: boolean;
  rootOnly?: boolean;
  perms?: string;
}

export interface FsDir {
  type: 'dir';
  children: Record<string, FsNode>;
  hidden?: boolean;
  rootOnly?: boolean;
}

export type FsNode = FsFile | FsDir;

export interface ShellLine {
  text: string;
  tone?: 'default' | 'red' | 'white' | 'muted' | 'dir' | 'exec' | 'badge';
}

export interface ShellBlock {
  id: string;
  prompt: string;
  command: string;
  lines: ShellLine[];
}

export interface ShellState {
  cwd: string;
  isRoot: boolean;
  history: string[];
}

const ROOT_FLAG = 'C4PTR4{r00t_sh3ll_0wn3d_ch1c4g0_r3dt34m}';
const SECRET_HINT_B64 = 'QzRQVFJMezM1YzRsNHQzX3cxdGhfInN1ZG8gLWwifQ=='; // C4PTRL{35c4l4t3_w1th_"sudo -l"}

function buildFileSystem(): FsDir {
  const aboutContent = [
    `# ${PROFILE.name} (${PROFILE.handle})`,
    `${PROFILE.tagline}`,
    `Location: ${PROFILE.location}`,
    '',
    ...PROFILE.aboutParagraphs.flatMap((p) => [p, '']),
    '## Core Focus Areas',
    ...FOCUS_AREAS.map((f) => `- ${f.title}: ${f.summary}`),
    '',
    '## Technical Arsenal',
    ...SKILL_GROUPS.map((g) => `- ${g.category}: ${g.items.join(', ')}`),
  ].join('\n');

  const contactContent = [
    `Name     : ${PROFILE.name} (${PROFILE.handle})`,
    `Location : ${PROFILE.location}`,
    `Email    : ${PROFILE.email}`,
    '',
    'Profiles:',
    ...SOCIALS.map((s) => `  ${s.label.padEnd(12)} ${s.href}`),
    '',
    'Tip: run "open linkedin" or "open github" directly from this shell.',
  ].join('\n');

  const expFiles: Record<string, FsFile> = {};
  const expSlugs = [
    '01-google-red-team.log',
    '02-khoury-ta.log',
    '03-google-intern.log',
    '04-hrblock-appsec.log',
    '05-hrblock-csirt.log',
    '06-capgemini-intern.log',
    '07-moh-medical-it.log',
  ];

  EXPERIENCE.forEach((exp, idx) => {
    const filename = expSlugs[idx] ?? `0${idx + 1}-role.log`;
    expFiles[filename] = {
      type: 'file',
      content: [
        `ROLE         : ${exp.role}`,
        `ORGANIZATION : ${exp.organization}`,
        `PERIOD       : ${exp.period}`,
        `LOCATION     : ${exp.location}`,
        `STACK        : ${exp.tags.join(' · ')}`,
        '',
        'KEY IMPACT:',
        ...exp.highlights.map((h) => `  * ${h}`),
      ].join('\n'),
    };
  });

  const projectFiles: Record<string, FsFile> = {};
  const projSlugs = [
    'phishector.md',
    'nikto-captr4.md',
    'ctf-cheatsheet.md',
    'keras-facial-recognition.md',
    'covkart.md',
    'trashtalker-iot.md',
  ];

  PROJECTS.forEach((p, idx) => {
    const filename = projSlugs[idx] ?? `project-${idx + 1}.md`;
    projectFiles[filename] = {
      type: 'file',
      content: [
        `# ${p.title}`,
        `Category : ${p.category}`,
        `Stack    : ${p.stack.join(', ')}`,
        `Link     : ${p.link}`,
        '',
        p.description,
      ].join('\n'),
    };
  });

  const certsContent = [
    '# Licenses & Certifications',
    '',
    ...CERTIFICATIONS.flatMap((c) => [
      `[+] ${c.name}`,
      `    Issuer : ${c.issuer}${c.date ? ` (${c.date})` : ''}`,
      ...(c.credentialId ? [`    ID     : ${c.credentialId}`] : []),
      ...(c.url ? [`    Verify : ${c.url}`] : []),
      '',
    ]),
  ].join('\n');

  const awardsContent = [
    '# Honors, Press & Awards',
    '',
    ...AWARDS.flatMap((a) => [
      `★ ${a.title} [${a.date}]`,
      `  Issuer : ${a.issuer}`,
      `  Notes  : ${a.description}`,
      '',
    ]),
  ].join('\n');

  const educationContent = [
    '# Education',
    '',
    ...EDUCATION.flatMap((e) => [
      `[${e.period}] ${e.degree}`,
      `  ${e.institution} · ${e.location}`,
      `  ${e.details}`,
      '',
    ]),
    '# Volunteering & Community',
    ...VOLUNTEERING.map(
      (v) => `- ${v.role} @ ${v.organization}${v.period ? ` (${v.period})` : ''}`
    ),
  ].join('\n');

  const researchContent = [
    '# Publications & Technical Write-ups',
    '',
    ...PUBLICATIONS.flatMap((pub) => [
      `[${pub.type}] ${pub.title}`,
      `  Venue : ${pub.venue} (${pub.date})`,
      ...(pub.badge ? [`  Note  : ${pub.badge}`] : []),
      `  URL   : ${pub.url}`,
      `  ${pub.summary}`,
      '',
    ]),
  ].join('\n');

  return {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          roshan: {
            type: 'dir',
            children: {
              'README.md': {
                type: 'file',
                content: [
                  'roshan@c4ptr4 — Chicago',
                  '',
                  'look around:',
                  '  ls -la',
                  '  cd experience && ls',
                  '  cat about.md',
                  '  tree',
                  '  grep -i google -r .',
                ].join('\n'),
              },
              'about.md': { type: 'file', content: aboutContent },
              'contact.txt': { type: 'file', content: contactContent },
              '.secret.b64': {
                type: 'file',
                hidden: true,
                content: `${SECRET_HINT_B64}\n# Hint: decode me with "base64 -d .secret.b64"`,
              },
              experience: { type: 'dir', children: expFiles },
              projects: { type: 'dir', children: projectFiles },
              research: {
                type: 'dir',
                children: {
                  'publications.md': { type: 'file', content: researchContent },
                  'education.txt': { type: 'file', content: educationContent },
                },
              },
              credentials: {
                type: 'dir',
                children: {
                  'certifications.txt': { type: 'file', content: certsContent },
                  'awards.txt': { type: 'file', content: awardsContent },
                },
              },
            },
          },
        },
      },
      etc: {
        type: 'dir',
        children: {
          hostname: { type: 'file', content: 'c4ptr4' },
          os_release: {
            type: 'file',
            content: 'NAME="C4PTR4 Red-Team OS"\nVERSION="2026.11 (Chicago)"\nID=redteam',
          },
          motd: {
            type: 'file',
            content: 'try "sudo -l" or "ls -la".',
          },
        },
      },
      root: {
        type: 'dir',
        rootOnly: true,
        children: {
          'flag.txt': {
            type: 'file',
            rootOnly: true,
            perms: '-r--------',
            content: [
              `FLAG: ${ROOT_FLAG}`,
              '',
              'root acquired.',
            ].join('\n'),
          },
        },
      },
    },
  };
}

export const ROOT_FS: FsDir = buildFileSystem();
export const HOME_DIR = '/home/roshan';

export const INITIAL_SHELL_STATE: ShellState = {
  cwd: HOME_DIR,
  isRoot: false,
  history: [],
};

export function normalizePath(inputPath: string, cwd: string): string {
  let path = inputPath.trim();
  if (!path || path === '~') return HOME_DIR;
  if (path.startsWith('~/')) {
    path = `${HOME_DIR}/${path.slice(2)}`;
  } else if (!path.startsWith('/')) {
    path = `${cwd}/${path}`;
  }

  const parts = path.split('/').filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return '/' + resolved.join('/');
}

export function getNodeAt(absPath: string): FsNode | null {
  if (absPath === '/') return ROOT_FS;
  const parts = absPath.split('/').filter(Boolean);
  let current: FsNode = ROOT_FS;
  for (const part of parts) {
    if (current.type !== 'dir') return null;
    const next: FsNode | undefined = current.children[part];
    if (!next) return null;
    current = next;
  }
  return current;
}

export function formatPromptPath(cwd: string): string {
  if (cwd === HOME_DIR) return '~';
  if (cwd.startsWith(`${HOME_DIR}/`)) return `~/${cwd.slice(HOME_DIR.length + 1)}`;
  return cwd;
}

export function getShellPrompt(state: ShellState): string {
  const user = state.isRoot ? 'root' : 'visitor';
  const symbol = state.isRoot ? '#' : '$';
  return `${user}@c4ptr4:${formatPromptPath(state.cwd)}${symbol}`;
}

export function getWelcomeBlock(): ShellBlock {
  return {
    id: 'boot-welcome',
    prompt: 'visitor@c4ptr4:~$',
    command: 'neofetch --brief',
    lines: [
      { text: '   ██████╗██╗  ██╗██████╗ ████████╗██████╗ ██╗  ██╗', tone: 'red' },
      { text: '  ██╔════╝██║  ██║██╔══██╗╚══██╔══╝██╔══██╗██║  ██║', tone: 'red' },
      { text: '  ██║     ███████║██████╔╝   ██║   ██████╔╝███████║', tone: 'red' },
      { text: '  ╚██████╗     ██║██║        ██║   ██║  ██║     ██║', tone: 'red' },
      { text: '', tone: 'default' },
      { text: `  operator  :: ${PROFILE.name} (${PROFILE.handle})`, tone: 'white' },
      { text: '  role      :: Associate Red Team Consultant @ Google', tone: 'default' },
      { text: '  location  :: Chicago, IL', tone: 'default' },
      { text: '  certs     :: OffSec LLM Red Teaming · CompTIA PenTest+ · CEH (Hall of Fame)', tone: 'default' },
      { text: '', tone: 'default' },
      { text: '  type "ls" to look around, or "help" for commands.', tone: 'muted' },
    ],
  };
}

const KNOWN_COMMANDS = [
  'ls',
  'cd',
  'pwd',
  'cat',
  'tree',
  'grep',
  'find',
  'head',
  'tail',
  'wc',
  'echo',
  'whoami',
  'id',
  'uname',
  'hostname',
  'date',
  'env',
  'history',
  'neofetch',
  'base64',
  'nmap',
  'sudo',
  'open',
  'visual',
  'stage',
  'help',
  'clear',
];

export function autocompleteInput(raw: string, state: ShellState): string | null {
  const parts = raw.split(/\s+/);
  // Command completion
  if (parts.length <= 1 && !raw.endsWith(' ')) {
    const prefix = parts[0].toLowerCase();
    if (!prefix) return null;
    return KNOWN_COMMANDS.find((c) => c.startsWith(prefix) && c !== prefix) ?? null;
  }

  // File / directory completion for the last token
  const token = raw.endsWith(' ') ? '' : parts[parts.length - 1];
  const lastSlash = token.lastIndexOf('/');
  const dirPrefix = lastSlash >= 0 ? token.slice(0, lastSlash + 1) : '';
  const namePrefix = lastSlash >= 0 ? token.slice(lastSlash + 1) : token;

  const targetDirAbs = normalizePath(dirPrefix || '.', state.cwd);
  const dirNode = getNodeAt(targetDirAbs);
  if (!dirNode || dirNode.type !== 'dir') return null;

  const matchName = Object.keys(dirNode.children).find((name) => {
    const child = dirNode.children[name];
    if (child.hidden && !namePrefix.startsWith('.')) return false;
    return name.startsWith(namePrefix);
  });

  if (!matchName) return null;
  const matchedNode = dirNode.children[matchName];
  const suffix = matchedNode.type === 'dir' ? '/' : '';
  const completedToken = `${dirPrefix}${matchName}${suffix}`;

  if (raw.endsWith(' ')) {
    return `${raw}${completedToken}`;
  }
  const head = parts.slice(0, -1).join(' ');
  return `${head} ${completedToken}`;
}

function collectTree(node: FsDir, prefix: string, isRoot: boolean, lines: ShellLine[]) {
  const entries = Object.entries(node.children).filter(
    ([, child]) => !child.hidden && (!child.rootOnly || isRoot)
  );
  entries.forEach(([name, child], idx) => {
    const isLast = idx === entries.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    lines.push({
      text: `${prefix}${branch}${name}${child.type === 'dir' ? '/' : ''}`,
      tone: child.type === 'dir' ? 'dir' : 'default',
    });
    if (child.type === 'dir') {
      collectTree(child, `${prefix}${isLast ? '    ' : '│   '}`, isRoot, lines);
    }
  });
}

function collectAllFiles(
  node: FsDir,
  basePath: string,
  isRoot: boolean,
  out: { path: string; content: string }[]
) {
  for (const [name, child] of Object.entries(node.children)) {
    if (child.rootOnly && !isRoot) continue;
    const fullPath = basePath === '/' ? `/${name}` : `${basePath}/${name}`;
    if (child.type === 'file') {
      out.push({ path: fullPath, content: child.content });
    } else {
      collectAllFiles(child, fullPath, isRoot, out);
    }
  }
}

export interface ShellExecutionResult {
  nextState: ShellState;
  lines: ShellLine[];
  clear?: boolean;
  openUrl?: string;
  switchMode?: 'visual' | 'stage';
}

export function executeShellCommand(rawInput: string, state: ShellState): ShellExecutionResult {
  const trimmed = rawInput.trim();
  if (!trimmed) return { nextState: state, lines: [] };

  const nextHistory = [...state.history, trimmed].slice(-50);
  const baseNext: ShellState = { ...state, history: nextHistory };

  // Support simple "&&" chaining (e.g. "cd experience && ls")
  if (trimmed.includes('&&')) {
    const segments = trimmed
      .split('&&')
      .map((s) => s.trim())
      .filter(Boolean);
    let curState = baseNext;
    const allLines: ShellLine[] = [];
    for (const seg of segments) {
      const res = executeSingle(seg, curState);
      curState = res.nextState;
      allLines.push(...res.lines);
      if (res.openUrl || res.switchMode) {
        return { ...res, nextState: curState, lines: allLines };
      }
    }
    return { nextState: curState, lines: allLines };
  }

  return executeSingle(trimmed, baseNext);
}

function executeSingle(trimmed: string, state: ShellState): ShellExecutionResult {
  const tokens = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
  const cleanTokens = tokens.map((t) => t.replace(/^["']|["']$/g, ''));
  const cmd = (cleanTokens[0] ?? '').toLowerCase();
  const args = cleanTokens.slice(1);

  if (cmd === 'clear' || cmd === 'cls') {
    return { nextState: state, lines: [], clear: true };
  }

  if (cmd === 'help' || cmd === '?') {
    return {
      nextState: state,
      lines: [
        { text: 'FILESYSTEM COMMANDS', tone: 'red' },
        { text: '  ls [-la] [dir]       List files and directories (try ls -la)', tone: 'default' },
        { text: '  cd [dir]             Change directory (cd experience, cd .., cd ~)', tone: 'default' },
        { text: '  pwd                  Print working directory', tone: 'default' },
        { text: '  cat <file>           Read any file (cat about.md, cat contact.txt)', tone: 'default' },
        { text: '  tree [dir]           Print directory tree', tone: 'default' },
        { text: '  grep [-i] <pat> [f]  Search text across files (try: grep -i google -r .)', tone: 'default' },
        { text: '  find [name]          Find files matching name', tone: 'default' },
        { text: '  head / tail / wc     Inspect file slices or line counts', tone: 'default' },
        { text: '', tone: 'default' },
        { text: 'OFFENSIVE & SYSTEM COMMANDS', tone: 'red' },
        { text: '  neofetch             Display operator profile banner', tone: 'default' },
        { text: '  nmap                 Scan local box services', tone: 'default' },
        { text: '  base64 -d <file|str> Decode Base64 data (hint: ls -la)', tone: 'default' },
        { text: '  sudo -l              Inspect sudo privileges', tone: 'default' },
        { text: '  open <github|linkedin|twitter|medium|ieee>', tone: 'default' },
        { text: '  resume / home        Switch to Resume view or Home', tone: 'default' },
        { text: '  whoami · id · uname -a · history · clear', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'pwd') {
    return { nextState: state, lines: [{ text: state.cwd, tone: 'white' }] };
  }

  if (cmd === 'whoami') {
    return {
      nextState: state,
      lines: [{ text: state.isRoot ? 'root' : 'visitor', tone: state.isRoot ? 'red' : 'white' }],
    };
  }

  if (cmd === 'id') {
    return {
      nextState: state,
      lines: [
        {
          text: state.isRoot
            ? 'uid=0(root) gid=0(root) groups=0(root),1337(redteam)'
            : 'uid=1000(visitor) gid=1000(visitor) groups=1000(visitor),100(guests)',
          tone: state.isRoot ? 'red' : 'default',
        },
      ],
    };
  }

  if (cmd === 'hostname') {
    return { nextState: state, lines: [{ text: 'c4ptr4', tone: 'white' }] };
  }

  if (cmd === 'uname') {
    return {
      nextState: state,
      lines: [
        {
          text: args.includes('-a')
            ? 'Linux c4ptr4 6.12.0-redteam #1 SMP Chicago x86_64 GNU/Linux'
            : 'Linux',
          tone: 'default',
        },
      ],
    };
  }

  if (cmd === 'date') {
    return { nextState: state, lines: [{ text: new Date().toString(), tone: 'default' }] };
  }

  if (cmd === 'env') {
    return {
      nextState: state,
      lines: [
        { text: `USER=${state.isRoot ? 'root' : 'visitor'}`, tone: 'default' },
        { text: `HOME=${state.isRoot ? '/root' : HOME_DIR}`, tone: 'default' },
        { text: `PWD=${state.cwd}`, tone: 'default' },
        { text: 'SHELL=/bin/zsh', tone: 'default' },
        { text: 'OPERATOR=Roshan Reju (@C4PTR4)', tone: 'red' },
        { text: 'ROLE=Associate Red Team Consultant @ Google', tone: 'default' },
      ],
    };
  }

  if (cmd === 'echo') {
    return { nextState: state, lines: [{ text: args.join(' '), tone: 'default' }] };
  }

  if (cmd === 'history') {
    return {
      nextState: state,
      lines: state.history.map((h, i) => ({
        text: `${String(i + 1).padStart(4)}  ${h}`,
        tone: 'muted',
      })),
    };
  }

  if (cmd === 'neofetch' || cmd === 'fastfetch') {
    return { nextState: state, lines: getWelcomeBlock().lines };
  }

  if (cmd === 'ls' || cmd === 'll') {
    const flags = args.filter((a) => a.startsWith('-')).join('');
    const showAll = cmd === 'll' || flags.includes('a');
    const longFmt = cmd === 'll' || flags.includes('l');
    const pathArg = args.find((a) => !a.startsWith('-')) ?? '.';
    const targetAbs = normalizePath(pathArg, state.cwd);
    const node = getNodeAt(targetAbs);

    if (!node) {
      return {
        nextState: state,
        lines: [{ text: `ls: cannot access '${pathArg}': No such file or directory`, tone: 'red' }],
      };
    }
    if (node.rootOnly && !state.isRoot) {
      return {
        nextState: state,
        lines: [{ text: `ls: cannot open directory '${pathArg}': Permission denied`, tone: 'red' }],
      };
    }
    if (node.type === 'file') {
      return { nextState: state, lines: [{ text: pathArg, tone: 'default' }] };
    }

    const entries = Object.entries(node.children).filter(([, child]) => {
      if (child.hidden && !showAll) return false;
      return true;
    });

    if (longFmt) {
      const lines: ShellLine[] = [];
      if (showAll) {
        lines.push({ text: 'drwxr-xr-x  roshan  redteam   4096  .', tone: 'dir' });
        lines.push({ text: 'drwxr-xr-x  roshan  redteam   4096  ..', tone: 'dir' });
      }
      for (const [name, child] of entries) {
        const perm =
          child.type === 'dir'
            ? child.rootOnly
              ? 'drwx------'
              : 'drwxr-xr-x'
            : child.perms ?? '-rw-r--r--';
        const owner = child.rootOnly ? 'root  ' : 'roshan';
        const size =
          child.type === 'file' ? String(child.content.length).padStart(5) : ' 4096';
        lines.push({
          text: `${perm}  ${owner}  redteam  ${size}  ${name}${child.type === 'dir' ? '/' : ''}`,
          tone: child.type === 'dir' ? 'dir' : child.hidden ? 'muted' : 'default',
        });
      }
      return { nextState: state, lines };
    }

    return {
      nextState: state,
      lines: [
        {
          text: entries
            .map(([name, child]) => (child.type === 'dir' ? `${name}/` : name))
            .join('   '),
          tone: 'white',
        },
      ],
    };
  }

  if (cmd === 'cd') {
    const dest = args[0] ?? '~';
    const targetAbs = normalizePath(dest, state.cwd);
    const node = getNodeAt(targetAbs);

    if (!node) {
      return {
        nextState: state,
        lines: [{ text: `cd: no such file or directory: ${dest}`, tone: 'red' }],
      };
    }
    if (node.type !== 'dir') {
      return {
        nextState: state,
        lines: [{ text: `cd: not a directory: ${dest}`, tone: 'red' }],
      };
    }
    if (node.rootOnly && !state.isRoot) {
      return {
        nextState: state,
        lines: [{ text: `cd: permission denied: ${dest} (hint: check "sudo -l")`, tone: 'red' }],
      };
    }

    return { nextState: { ...state, cwd: targetAbs }, lines: [] };
  }

  if (cmd === 'cat' || cmd === 'head' || cmd === 'tail' || cmd === 'wc') {
    const fileArgs = args.filter((a) => !a.startsWith('-'));
    if (fileArgs.length === 0) {
      return {
        nextState: state,
        lines: [{ text: `Usage: ${cmd} <file>`, tone: 'muted' }],
      };
    }

    const lines: ShellLine[] = [];
    for (const fileArg of fileArgs) {
      const targetAbs = normalizePath(fileArg, state.cwd);
      const node = getNodeAt(targetAbs);
      if (!node) {
        lines.push({ text: `${cmd}: ${fileArg}: No such file or directory`, tone: 'red' });
        continue;
      }
      if (node.rootOnly && !state.isRoot) {
        lines.push({ text: `${cmd}: ${fileArg}: Permission denied`, tone: 'red' });
        continue;
      }
      if (node.type === 'dir') {
        lines.push({ text: `${cmd}: ${fileArg}: Is a directory`, tone: 'red' });
        continue;
      }

      const fileLines = node.content.split('\n');
      if (cmd === 'wc') {
        const words = node.content.trim().split(/\s+/).filter(Boolean).length;
        lines.push({
          text: `  ${fileLines.length} lines  ${words} words  ${node.content.length} bytes  ${fileArg}`,
          tone: 'default',
        });
      } else if (cmd === 'head') {
        fileLines.slice(0, 10).forEach((l) => lines.push({ text: l, tone: 'default' }));
      } else if (cmd === 'tail') {
        fileLines.slice(-10).forEach((l) => lines.push({ text: l, tone: 'default' }));
      } else {
        fileLines.forEach((l) => {
          const isHeader = l.startsWith('#') || l.startsWith('FLAG:') || l.startsWith('★');
          lines.push({ text: l, tone: isHeader ? 'red' : 'default' });
        });
      }
    }
    return { nextState: state, lines };
  }

  if (cmd === 'tree') {
    const pathArg = args[0] ?? '.';
    const targetAbs = normalizePath(pathArg, state.cwd);
    const node = getNodeAt(targetAbs);
    if (!node || node.type !== 'dir') {
      return {
        nextState: state,
        lines: [{ text: `tree: '${pathArg}': Not a directory`, tone: 'red' }],
      };
    }
    if (node.rootOnly && !state.isRoot) {
      return {
        nextState: state,
        lines: [{ text: `tree: '${pathArg}': Permission denied`, tone: 'red' }],
      };
    }
    const lines: ShellLine[] = [{ text: formatPromptPath(targetAbs), tone: 'red' }];
    collectTree(node, '', state.isRoot, lines);
    return { nextState: state, lines };
  }

  if (cmd === 'find') {
    const query = (args.find((a) => !a.startsWith('-')) ?? '').toLowerCase();
    const files: { path: string; content: string }[] = [];
    const startNode = getNodeAt(state.cwd);
    if (startNode && startNode.type === 'dir') {
      collectAllFiles(startNode, state.cwd, state.isRoot, files);
    }
    const matched = files.filter((f) => !query || f.path.toLowerCase().includes(query));
    return {
      nextState: state,
      lines:
        matched.length > 0
          ? matched.map((f) => ({ text: formatPromptPath(f.path), tone: 'default' }))
          : [{ text: 'No matching files found.', tone: 'muted' }],
    };
  }

  if (cmd === 'grep') {
    const nonFlags = args.filter((a) => !a.startsWith('-'));
    const pattern = nonFlags[0];
    if (!pattern) {
      return {
        nextState: state,
        lines: [{ text: 'Usage: grep [-i] <pattern> [file_or_dir]', tone: 'muted' }],
      };
    }
    const targetArg = nonFlags[1] ?? '.';
    const targetAbs = normalizePath(targetArg, state.cwd);
    const node = getNodeAt(targetAbs);
    if (!node) {
      return {
        nextState: state,
        lines: [{ text: `grep: ${targetArg}: No such file or directory`, tone: 'red' }],
      };
    }

    const searchFiles: { path: string; content: string }[] = [];
    if (node.type === 'file') {
      if (!node.rootOnly || state.isRoot) {
        searchFiles.push({ path: targetAbs, content: node.content });
      }
    } else {
      collectAllFiles(node, targetAbs, state.isRoot, searchFiles);
    }

    const needle = pattern.toLowerCase();
    const lines: ShellLine[] = [];
    for (const f of searchFiles) {
      f.content.split('\n').forEach((line, idx) => {
        if (line.toLowerCase().includes(needle)) {
          lines.push({
            text: `${formatPromptPath(f.path)}:${idx + 1}: ${line.trim()}`,
            tone: 'default',
          });
        }
      });
    }
    return {
      nextState: state,
      lines:
        lines.length > 0
          ? lines.slice(0, 30)
          : [{ text: `No matches for "${pattern}".`, tone: 'muted' }],
    };
  }

  if (cmd === 'base64') {
    if (!args.includes('-d') && !args.includes('--decode')) {
      return {
        nextState: state,
        lines: [{ text: 'Usage: base64 -d <file_or_string>', tone: 'muted' }],
      };
    }
    const target = args.find((a) => !a.startsWith('-'));
    if (!target) {
      return { nextState: state, lines: [{ text: 'base64: missing operand', tone: 'red' }] };
    }
    const maybeNode = getNodeAt(normalizePath(target, state.cwd));
    const rawStr =
      maybeNode && maybeNode.type === 'file'
        ? maybeNode.content.split('\n')[0].trim()
        : target;
    try {
      const decoded = atob(rawStr);
      return { nextState: state, lines: [{ text: decoded, tone: 'badge' }] };
    } catch {
      return { nextState: state, lines: [{ text: 'base64: invalid input', tone: 'red' }] };
    }
  }

  if (cmd === 'nmap') {
    return {
      nextState: state,
      lines: [
        { text: 'Starting Nmap 7.95 against c4ptr4.local (127.0.0.1)...', tone: 'muted' },
        { text: 'PORT     STATE  SERVICE', tone: 'red' },
        { text: '22/tcp   open   ssh        OpenSSH 9.8 (visitor shell active)', tone: 'default' },
        { text: '443/tcp  open   https      roshanreju.github.io', tone: 'default' },
        { text: '9001/tcp open   sudoers    local privesc? (sudo -l)', tone: 'muted' },
      ],
    };
  }

  if (cmd === 'sudo') {
    const sub = args.join(' ').toLowerCase();
    if (sub === '-l') {
      return {
        nextState: state,
        lines: [
          { text: 'User visitor may run the following commands on c4ptr4:', tone: 'default' },
          { text: '    (root) NOPASSWD: /usr/local/bin/promote', tone: 'red' },
          { text: 'Hint: run "sudo /usr/local/bin/promote" or "sudo su" to get root.', tone: 'muted' },
        ],
      };
    }
    if (
      sub.includes('promote') ||
      sub === 'su' ||
      sub === '-i' ||
      sub.includes('bash') ||
      sub.includes('sh')
    ) {
      return {
        nextState: { ...state, isRoot: true, cwd: '/root' },
        lines: [
          { text: 'UID=0 (root) // PRIVILEGE ESCALATION SUCCESSFUL', tone: 'badge' },
          { text: 'Moved to /root. Run "cat flag.txt" to capture the root flag.', tone: 'white' },
        ],
      };
    }
    return {
      nextState: state,
      lines: [{ text: 'sudo: try "sudo -l" to see allowed commands.', tone: 'muted' }],
    };
  }

  if (cmd === 'visual' || cmd === 'gui' || cmd === 'profile' || cmd === 'resume') {
    return {
      nextState: state,
      lines: [{ text: '[+] Switching to Visual Profile View...', tone: 'red' }],
      switchMode: 'visual',
    };
  }

  if (cmd === 'home' || cmd === 'stage' || cmd === 'exit') {
    return {
      nextState: state,
      lines: [{ text: '[+] Returning home...', tone: 'muted' }],
      switchMode: 'stage',
    };
  }

  if (cmd === 'open') {
    const query = (args[0] ?? '').toLowerCase();
    const social = SOCIALS.find(
      (s) => s.label.toLowerCase().includes(query) || s.handle.toLowerCase().includes(query)
    );
    if (social && query) {
      return {
        nextState: state,
        lines: [{ text: `[+] Opening ${social.label} -> ${social.href}`, tone: 'red' }],
        openUrl: social.href,
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
      { text: `zsh: command not found: ${cmd}`, tone: 'red' },
      { text: 'Type "help" to list commands, or click any file in the sidebar.', tone: 'muted' },
    ],
  };
}

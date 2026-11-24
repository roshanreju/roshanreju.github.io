import { FormEvent, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  Bot,
  Briefcase,
  Bug,
  Check,
  Copy,
  Crosshair,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  Mail,
  MapPin,
  Play,
  Send,
  ShieldAlert,
  Unlock,
  Zap,
} from 'lucide-react';
import {
  AWARDS,
  BOX_META,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  FOCUS_AREAS,
  PROFILE,
  ProjectItem,
  PROJECTS,
  PUBLICATIONS,
  SKILL_GROUPS,
  SOCIALS,
} from '../data/portfolio';
import { BoxState, DossierTab, getNextMission } from '../engine/boxEngine';

interface IntelDossierProps {
  boxState: BoxState;
  onSelectTab: (tab: DossierTab) => void;
  onRunCommand: (command: string) => void;
  onAutoPwn: () => void;
}

const TABS: {
  id: DossierTab;
  code: string;
  label: string;
  unlockCommand: string;
  unlockHint: string;
}[] = [
  {
    id: 'briefing',
    code: '00',
    label: 'Briefing',
    unlockCommand: '',
    unlockHint: 'Mission briefing',
  },
  {
    id: 'about',
    code: '01',
    label: 'About',
    unlockCommand: `nmap -sV ${BOX_META.ip}`,
    unlockHint: 'Run Nmap port reconnaissance against 10.10.11.24 to expose target identity & focus areas.',
  },
  {
    id: 'experience',
    code: '02',
    label: 'Experience',
    unlockCommand: `gobuster dir -u http://${BOX_META.ip}`,
    unlockHint: 'Enumerate hidden web endpoints with Gobuster to dump career history & education.',
  },
  {
    id: 'projects',
    code: '03',
    label: 'Projects',
    unlockCommand: `gobuster dir -u http://${BOX_META.ip}`,
    unlockHint: 'Enumerate port 3000 / web routes to uncover Phishector, Nikto_capt.r4, and open-source tools.',
  },
  {
    id: 'research',
    code: '04',
    label: 'Research',
    unlockCommand: `ssh guest@${BOX_META.ip}`,
    unlockHint: 'Establish an SSH foothold as guest to capture user.txt and decrypt IEEE papers & @C4PTR4 write-ups.',
  },
  {
    id: 'vault',
    code: '05',
    label: 'Root Vault',
    unlockCommand: 'sudo /usr/local/bin/roshan-vault',
    unlockHint: 'Escalate privileges to root (UID=0) to unlock CEH Hall of Fame credentials, awards & direct contact.',
  },
];

const FOCUS_ICON_MAP = {
  'red-team': Crosshair,
  'ai-security': Bot,
  appsec: Layers,
  csirt: Bug,
} as const;

const FOCUS_ACCENT_MAP = {
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
} as const;

type ProjectFilter = 'All' | ProjectItem['category'];
const PROJECT_FILTERS: ProjectFilter[] = ['All', 'Security & AI', 'Tools & Labs', 'Engineering'];

export default function IntelDossier({
  boxState,
  onSelectTab,
  onRunCommand,
  onAutoPwn,
}: IntelDossierProps) {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('All');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const activeMeta = TABS.find((t) => t.id === boxState.activeTab) ?? TABS[0];
  const isUnlocked = boxState.unlocked[boxState.activeTab];
  const nextMission = getNextMission(boxState);
  const recommendedLockedCmd =
    boxState.activeTab === 'vault' && boxState.access !== 'user' && boxState.access !== 'root'
      ? nextMission?.command ?? `ssh guest@${BOX_META.ip}`
      : activeMeta.unlockCommand;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subj = encodeURIComponent(contactSubject || `Message from ${contactName || 'ROSHAN-01'}`);
    const body = encodeURIComponent(`Hi Roshan,\n\n${contactMessage}\n\n— ${contactName}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subj}&body=${body}`;
  };

  const filteredProjects =
    projectFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === projectFilter);

  return (
    <div className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
      {/* Dossier Module Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
        {TABS.map((tab) => {
          const unlocked = boxState.unlocked[tab.id];
          const active = boxState.activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                active
                  ? unlocked
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                  : unlocked
                    ? 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                    : 'border-white/[0.05] bg-black/20 text-slate-500 hover:border-white/15 hover:text-slate-300'
              }`}
            >
              {tab.id !== 'briefing' &&
                (unlocked ? (
                  <Unlock className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Lock className="h-3 w-3 text-slate-500" />
                ))}
              <span className="text-[10px] opacity-60">{tab.code}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dossier Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7">
        {/* LOCKED MODULE STATE */}
        {!isUnlocked ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/[0.03] p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <Lock className="h-7 w-7" />
            </div>
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
              403 FORBIDDEN // INTEL ENCRYPTED
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              Module {activeMeta.code}: {activeMeta.label} is Locked
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              {activeMeta.unlockHint}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onRunCommand(recommendedLockedCmd)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-mono text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run: {recommendedLockedCmd}</span>
              </button>
              <button
                type="button"
                onClick={onAutoPwn}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Auto-Pwn All</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 00: MISSION BRIEFING */}
            {boxState.activeTab === 'briefing' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <img
                    src={PROFILE.avatarUrl}
                    alt={PROFILE.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-2xl border border-emerald-500/30 object-cover shadow-lg shadow-emerald-500/15"
                  />
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>MACHINE ONLINE · {BOX_META.ip}</span>
                    </div>
                    <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
                      {PROFILE.name}{' '}
                      <span className="font-mono text-lg font-medium text-emerald-400">
                        {PROFILE.handle}
                      </span>
                    </h1>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                      <span>{PROFILE.tagline}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {PROFILE.location}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  {PROFILE.heroBio}
                </p>

                {/* Engagement Instructions Card */}
                <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] via-surface to-cyan-500/[0.05] p-5">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    // ENGAGEMENT RULES OF PLAY
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    This portfolio is an interactive target machine (<code className="text-emerald-300">{BOX_META.hostname}</code>).
                    Use the attacker terminal on the left to perform <strong>reconnaissance</strong>,{' '}
                    <strong>enumeration</strong>, <strong>SSH foothold</strong>, and{' '}
                    <strong>root privilege escalation</strong>—unlocking each section of my career dossier and capturing{' '}
                    <code className="text-cyan-300">user.txt</code> &amp; <code className="text-emerald-300">root.txt</code>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onRunCommand(`nmap -sV ${BOX_META.ip}`)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-mono text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Start Recon (nmap -sV {BOX_META.ip})
                    </button>
                    <button
                      type="button"
                      onClick={onAutoPwn}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 font-mono text-xs font-medium text-white transition hover:border-emerald-400/40 hover:bg-white/[0.09]"
                    >
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      Auto-Pwn (Recruiter Quick View)
                    </button>
                  </div>
                </div>

                {/* Highlight Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PROFILE.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                    >
                      <div className="font-display text-lg font-bold text-white">{stat.value}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kill Chain Map */}
                <div>
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Target Kill-Chain Map
                  </h2>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {TABS.filter((t) => t.id !== 'briefing').map((tab) => {
                      const unlocked = boxState.unlocked[tab.id];
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => onSelectTab(tab.id)}
                          className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition ${
                            unlocked
                              ? 'border-emerald-500/30 bg-emerald-500/[0.06] hover:bg-emerald-500/10'
                              : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                          }`}
                        >
                          <div>
                            <div className="font-mono text-xs font-semibold text-white">
                              {tab.code} // {tab.label}
                            </div>
                            <div className="mt-0.5 font-mono text-[10.5px] text-slate-400">
                              {unlocked ? 'DECRYPTED — Click to view' : tab.unlockCommand}
                            </div>
                          </div>
                          {unlocked ? (
                            <Unlock className="h-4 w-4 shrink-0 text-emerald-400" />
                          ) : (
                            <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 01: ABOUT & FOCUS */}
            {boxState.activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <div className="section-kicker">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>01 // RECON INTEL · ABOUT &amp; FOCUS</span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                    Offensive mindset. Engineering rigor.
                  </h2>
                </div>

                <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm leading-relaxed text-slate-300">
                  {PROFILE.aboutParagraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {FOCUS_AREAS.map((area) => {
                    const Icon = FOCUS_ICON_MAP[area.id as keyof typeof FOCUS_ICON_MAP] ?? Crosshair;
                    return (
                      <div
                        key={area.id}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-emerald-500/30"
                      >
                        <div
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${FOCUS_ACCENT_MAP[area.accent]}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="mt-3 font-display text-base font-semibold text-white">
                          {area.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {area.summary}
                        </p>
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {area.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-3">
                  {SKILL_GROUPS.map((group) => (
                    <div
                      key={group.category}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                    >
                      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        {group.category}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/[0.07] bg-black/30 px-2 py-0.5 text-[11px] text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 02: EXPERIENCE & EDUCATION */}
            {boxState.activeTab === 'experience' && (
              <div className="space-y-7">
                <div>
                  <div className="section-kicker">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>02 // ENUMERATION · CAREER &amp; EDUCATION</span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                    Industry trajectory
                  </h2>
                </div>

                <div className="relative space-y-4 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-px before:bg-gradient-to-b before:from-emerald-400/70 before:via-white/10 before:to-transparent">
                  {EXPERIENCE.map((item) => (
                    <article
                      key={`${item.role}-${item.organization}`}
                      className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-emerald-500/30"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-6 -left-[19px] h-2.5 w-2.5 rounded-full border-2 border-emerald-400 bg-canvas"
                      />
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-base font-semibold text-white">
                            {item.role}
                          </h3>
                          <p className="text-xs font-medium text-emerald-400">
                            {item.organization}{' '}
                            <span className="font-normal text-slate-500">· {item.location}</span>
                          </p>
                        </div>
                        <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-300">
                          {item.period}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-300">
                        {item.highlights.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-white/[0.07] bg-black/30 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-300">
                    <GraduationCap className="h-4 w-4" />
                    <span>Education</span>
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {EDUCATION.map((edu) => (
                      <div
                        key={edu.institution}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                      >
                        <span className="inline-block rounded border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10.5px] text-cyan-300">
                          {edu.period}
                        </span>
                        <h3 className="mt-2.5 font-display text-sm font-semibold text-white">
                          {edu.degree}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-300">{edu.institution}</p>
                        <p className="font-mono text-[11px] text-slate-500">{edu.location}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">{edu.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 03: PROJECTS */}
            {boxState.activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <div className="section-kicker">
                      <FolderGit2 className="h-3.5 w-3.5" />
                      <span>03 // PORT 3000 · PROJECTS &amp; TOOLING</span>
                    </div>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                      Builds &amp; open source
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {PROJECT_FILTERS.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProjectFilter(cat)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                          projectFilter === cat
                            ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                            : 'border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredProjects.map((project) => (
                    <article
                      key={project.title}
                      className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-emerald-500/35"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="font-mono text-[10px] text-cyan-400">★ Featured</span>
                          )}
                        </div>
                        <h3 className="mt-3 font-display text-base font-semibold text-white group-hover:text-emerald-300">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded border border-white/[0.07] bg-black/30 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3.5 inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-400 hover:text-emerald-300"
                        >
                          {project.linkLabel}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 04: RESEARCH & WRITEUPS */}
            {boxState.activeTab === 'research' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="section-kicker">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>04 // USER SHELL · RESEARCH &amp; WRITE-UPS</span>
                    </div>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                      Publications &amp; @C4PTR4 articles
                    </h2>
                  </div>
                  {boxState.flags.user && (
                    <span className="rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
                      🚩 {BOX_META.userFlag}
                    </span>
                  )}
                </div>

                {PUBLICATIONS.map((pub, index) => (
                  <a
                    key={pub.title}
                    href={pub.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group block rounded-xl border p-5 transition ${
                      index === 0
                        ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.09] via-surface to-cyan-500/[0.06] hover:border-emerald-400/60'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-emerald-500/35'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                          <FileText className="h-3 w-3" />
                          {pub.type}
                        </span>
                        {pub.badge && (
                          <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                            {pub.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{pub.date}</span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold text-white group-hover:text-emerald-300">
                      {pub.title}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-slate-400">{pub.venue}</p>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">{pub.summary}</p>
                    <div className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-emerald-400">
                      Open publication
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* 05: ROOT VAULT (CERTS, AWARDS & CONTACT) */}
            {boxState.activeTab === 'vault' && (
              <div className="space-y-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="section-kicker">
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>05 // ROOT VAULT · CREDENTIALS, HONORS &amp; CONTACT</span>
                    </div>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                      Root access achieved
                    </h2>
                  </div>
                  {boxState.flags.root && (
                    <span className="rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
                      🏆 {BOX_META.rootFlag}
                    </span>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Certifications</span>
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CERTIFICATIONS.map((cert) => (
                      <div
                        key={cert.name}
                        className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <BadgeCheck className="h-4 w-4 text-emerald-400" />
                            {cert.highlight && (
                              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                                {cert.highlight}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-2.5 font-display text-sm font-semibold text-white">
                            {cert.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-400">{cert.issuer}</p>
                        </div>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 hover:text-emerald-300"
                          >
                            Verify badge
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards & Press */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-300">
                    <Award className="h-4 w-4" />
                    <span>Honors, Press &amp; Awards</span>
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {AWARDS.map((award) => (
                      <div
                        key={award.title}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-sm font-semibold text-white">
                            {award.title}
                          </h4>
                          <span className="shrink-0 font-mono text-[10px] text-slate-500">
                            {award.date}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-cyan-300/90">
                          {award.issuer}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {award.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact */}
                <div className="rounded-xl border border-emerald-500/25 bg-black/30 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                        <Mail className="h-4 w-4 text-emerald-400" />
                        Direct Encrypted Comms
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Reach out for Red Team, AI Security, or AppSec collaborations.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${PROFILE.email}`}
                        className="font-mono text-xs text-emerald-300 hover:underline"
                      >
                        {PROFILE.email}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-slate-200 hover:border-emerald-500/40"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
                      >
                        <span>{social.label}</span>
                        <ArrowUpRight className="h-3 w-3 text-slate-500" />
                      </a>
                    ))}
                  </div>

                  <form onSubmit={handleContactSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Subject (e.g. Red Team / AI Security)"
                      className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                    />
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Your message..."
                      className="resize-none rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none sm:col-span-2"
                    />
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-mono text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Transmit via Email
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

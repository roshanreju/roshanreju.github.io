import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
  FolderGit2,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Send,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  AWARDS,
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
  VOLUNTEERING,
} from '../data/portfolio';
import { ChapterId, CHAPTERS, StoryState } from '../engine/storyEngine';

interface StoryPanelsProps {
  state: StoryState;
  onSelectChapter: (chapter: ChapterId) => void;
  onToggleOverdrive: () => void;
  onOpenConsole: () => void;
  onShowAll: () => void;
}

const FOCUS_ICONS = {
  'red-team': Crosshair,
  'ai-security': Bot,
  appsec: Layers,
  csirt: Bug,
} as const;

type ProjectFilter = 'All' | ProjectItem['category'];
const FILTERS: ProjectFilter[] = ['All', 'Security & AI', 'Tools & Labs', 'Engineering'];

export default function StoryPanels({
  state,
  onSelectChapter,
  onToggleOverdrive,
  onOpenConsole,
  onShowAll,
}: StoryPanelsProps) {
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const currentMeta = CHAPTERS.find((c) => c.id === state.chapter) ?? CHAPTERS[0];
  const prevChapter = CHAPTERS[currentMeta.index - 1] ?? null;
  const nextChapter = CHAPTERS[currentMeta.index + 1] ?? null;

  const visibleProjects =
    filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const s = encodeURIComponent(subject || `Hello from ${name || 'MARK-R4'}`);
    const b = encodeURIComponent(`Hi Roshan,\n\n${message}\n\n— ${name}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${s}&body=${b}`;
  };

  // Position panel opposite to 3D character on wide screens so the 3D Iron-Hacker is always visible!
  const alignmentClass = state.showAll
    ? 'mx-auto max-w-5xl'
    : state.chapter === 'origin' || state.chapter === 'lab'
      ? 'lg:ml-auto lg:w-[60%]'
      : state.chapter === 'missions'
        ? 'lg:mr-auto lg:w-[60%]'
        : 'mx-auto max-w-4xl';

  // CHAPTER 00: FULL CINEMATIC 3D SUIT BOOT HERO
  if (!state.showAll && state.chapter === 'boot') {
    return (
      <section className="flex min-h-[calc(100vh-5.5rem)] flex-col justify-between py-6 sm:py-10">
        {/* Top Stark HUD telemetry strip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-black/65 px-3.5 py-1.5 font-mono text-xs text-red-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>SUIT MARK-R4 · ONLINE</span>
            <span className="text-red-500/40">|</span>
            <span className="inline-flex items-center gap-1 text-zinc-300">
              <MapPin className="h-3 w-3 text-amber-400" />
              {PROFILE.location}
            </span>
          </div>

          <div className="hidden rounded-full border border-amber-500/25 bg-black/60 px-3.5 py-1.5 font-mono text-[11px] text-amber-300/90 backdrop-blur-md sm:inline-flex">
            MOVE CURSOR TO TRACK SENTINEL · INTERACTIVE 3D WEBGL
          </div>
        </div>

        {/* Bottom cinematic title overlay (keeps center open for 3D Iron Man character!) */}
        <div className="mt-auto pt-44 sm:pt-56">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-black/70 p-6 text-center shadow-[0_0_60px_-20px_rgba(220,38,38,0.45)] backdrop-blur-xl sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-400">
              J.A.R.V.I.S. // RED TEAM STORYLINE
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {PROFILE.name}{' '}
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                {PROFILE.handle}
              </span>
            </h1>
            <p className="mt-2.5 font-mono text-xs text-red-300 sm:text-sm">{PROFILE.tagline}</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
              {currentMeta.narration}
            </p>

            {/* Clear Primary Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onSelectChapter('origin')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/30 transition hover:from-red-500 hover:to-amber-500 sm:text-sm"
              >
                <span>Begin Mission: Chapter 01</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onToggleOverdrive}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-mono text-xs font-semibold transition ${
                  state.overdrive
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-[0_0_24px_-6px_rgba(245,158,11,0.6)]'
                    : 'border-red-500/35 bg-black/60 text-zinc-200 hover:border-amber-400/60 hover:text-amber-300'
                }`}
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{state.overdrive ? 'Overdrive: MAX' : 'Reactor Overdrive'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenConsole}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 font-mono text-xs text-zinc-200 transition hover:border-red-500/50 hover:text-white"
              >
                <Terminal className="h-4 w-4 text-red-400" />
                <span>J.A.R.V.I.S. Console</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const showOrigin = state.showAll || state.chapter === 'origin';
  const showMissions = state.showAll || state.chapter === 'missions';
  const showLab = state.showAll || state.chapter === 'lab';
  const showVault = state.showAll || state.chapter === 'vault';

  return (
    <div className={`${alignmentClass} space-y-10 pb-24 pt-4`}>
      {/* J.A.R.V.I.S. Story Narration Banner */}
      {!state.showAll && (
        <div className="rounded-2xl border border-amber-500/30 bg-black/75 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              CHAPTER {currentMeta.code} // {currentMeta.headline}
            </span>
            <button
              type="button"
              onClick={onOpenConsole}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600/15 px-2.5 py-1 font-mono text-[11px] text-red-300 transition hover:bg-red-600/25"
            >
              <Terminal className="h-3 w-3" />
              Open J.A.R.V.I.S.
            </button>
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-300 sm:text-[13px]">
            {currentMeta.narration}
          </p>
        </div>
      )}

      {/* CHAPTER 01: THE ORIGIN */}
      {showOrigin && (
        <section className="space-y-6 rounded-3xl border border-red-500/25 bg-black/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              <Shield className="h-3.5 w-3.5" />
              CHAPTER 01 // THE ORIGIN
            </span>
            <h2 className="mt-1.5 font-display text-3xl font-bold text-white">
              Offensive mindset. Stark-grade execution.
            </h2>
          </div>

          <div className="space-y-3.5 text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
            {PROFILE.aboutParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => {
              const Icon = FOCUS_ICONS[area.id as keyof typeof FOCUS_ICONS] ?? Crosshair;
              return (
                <div
                  key={area.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/45"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/35 bg-red-600/15 text-red-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-white">
                    {area.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{area.summary}</p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {area.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10.5px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3.5 md:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  {group.category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/[0.08] bg-black/50 px-2 py-0.5 text-[11px] text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHAPTER 02: FIELD MISSIONS */}
      {showMissions && (
        <section className="space-y-6 rounded-3xl border border-red-500/25 bg-black/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              <Briefcase className="h-3.5 w-3.5" />
              CHAPTER 02 // FIELD MISSIONS
            </span>
            <h2 className="mt-1.5 font-display text-3xl font-bold text-white">
              Experience, Education &amp; Community
            </h2>
          </div>

          <div className="relative space-y-4 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-px before:bg-gradient-to-b before:from-amber-400 before:via-red-500 before:to-transparent">
            {EXPERIENCE.map((item) => (
              <article
                key={`${item.role}-${item.organization}`}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/45"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-6 -left-[19px] h-2.5 w-2.5 rounded-full border-2 border-amber-400 bg-black"
                />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                      {item.role}
                    </h3>
                    <p className="text-xs font-medium text-red-400 sm:text-sm">
                      {item.organization}{' '}
                      <span className="font-normal text-zinc-500">· {item.location}</span>
                    </p>
                  </div>
                  <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] text-amber-200">
                    {item.period}
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                  {item.highlights.map((bullet, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10.5px] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {EDUCATION.map((edu) => (
              <div
                key={edu.institution}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="font-mono text-[11px] text-red-300">{edu.period}</span>
                </div>
                <h3 className="mt-2.5 font-display text-sm font-semibold text-white sm:text-base">
                  {edu.degree}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-300">{edu.institution}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{edu.details}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-amber-400">
              Volunteering &amp; Cyber Community
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {VOLUNTEERING.map((vol) => (
                <div
                  key={vol.organization}
                  className="rounded-xl border border-white/10 bg-black/50 p-3.5"
                >
                  <div className="font-display text-sm font-semibold text-white">{vol.role}</div>
                  <div className="text-xs text-red-400">{vol.organization}</div>
                  {vol.period && (
                    <div className="mt-0.5 font-mono text-[10.5px] text-zinc-500">{vol.period}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CHAPTER 03: THE STARK LAB */}
      {showLab && (
        <section className="space-y-6 rounded-3xl border border-red-500/25 bg-black/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
                <FolderGit2 className="h-3.5 w-3.5" />
                CHAPTER 03 // THE STARK LAB
              </span>
              <h2 className="mt-1.5 font-display text-3xl font-bold text-white">
                Projects, IEEE Research &amp; Write-ups
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                    filter === cat
                      ? 'border border-red-500 bg-red-600/25 text-white'
                      : 'border border-white/10 bg-black/50 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {visibleProjects.map((project) => (
              <article
                key={project.title}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-red-500/45"
              >
                <div>
                  <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    {project.category}
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold text-white group-hover:text-red-300">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3.5 inline-flex items-center gap-1 font-mono text-xs font-medium text-red-400 hover:text-amber-300"
                  >
                    {project.linkLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400">
              <BookOpen className="h-4 w-4" />
              IEEE Publication &amp; @C4PTR4 Security Write-ups
            </h3>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {PUBLICATIONS.map((pub) => (
                <a
                  key={pub.title}
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-400/50"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="rounded border border-red-500/35 bg-red-600/15 px-2 py-0.5 text-red-300">
                        {pub.badge ?? pub.type}
                      </span>
                      <span className="text-zinc-500">{pub.date}</span>
                    </div>
                    <h4 className="mt-2.5 font-display text-sm font-semibold text-white group-hover:text-amber-300 sm:text-base">
                      {pub.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{pub.summary}</p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-red-400">
                    Read article <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CHAPTER 04: ROOT VAULT & OVERDRIVE */}
      {showVault && (
        <section className="space-y-7 rounded-3xl border border-amber-500/35 bg-black/80 p-6 shadow-[0_0_50px_-15px_rgba(245,158,11,0.3)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-amber-400">
                <Award className="h-3.5 w-3.5" />
                CHAPTER 04 // ROOT VAULT &amp; DIRECT COMMS
              </span>
              <h2 className="mt-1.5 font-display text-3xl font-bold text-white">
                Certifications, Honors &amp; Contact
              </h2>
            </div>

            <button
              type="button"
              onClick={onToggleOverdrive}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition ${
                state.overdrive
                  ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                  : 'border-red-500/40 bg-red-600/15 text-red-200 hover:border-amber-400'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              {state.overdrive ? 'Overdrive Active' : 'Engage Overdrive'}
            </button>
          </div>

          {/* Certs */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-400/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <BadgeCheck className="h-4 w-4 text-red-400" />
                    {cert.highlight && (
                      <span className="rounded border border-amber-400/35 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-200">
                        {cert.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2.5 font-display text-sm font-semibold text-white">
                    {cert.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-400">{cert.issuer}</p>
                  {(cert.date || cert.credentialId) && (
                    <p className="mt-1 font-mono text-[10.5px] text-zinc-500">
                      {[cert.date, cert.credentialId ? `ID: ${cert.credentialId}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-red-400 hover:text-amber-300"
                  >
                    Verify badge <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Awards */}
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {AWARDS.map((award) => (
              <article
                key={award.title}
                className="rounded-2xl border border-white/10 bg-black/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{award.title}</h3>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-500">{award.date}</span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-amber-400">{award.issuer}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{award.description}</p>
              </article>
            ))}
          </div>

          {/* Direct Contact */}
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-2xl border border-red-500/25 bg-black/60 p-5 lg:col-span-5">
              <div>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <Mail className="h-4 w-4 text-red-400" />
                  Open Comms Channel
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  Based in {PROFILE.location}. Reach out for Red Teaming, AI/LLM Security, talks, or
                  collaborations.
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/70 p-3">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="truncate font-mono text-xs text-red-300 hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:border-red-500/50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-amber-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-zinc-300 transition hover:border-red-500/50 hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="rounded-2xl border border-white/10 bg-black/60 p-5 lg:col-span-7"
            >
              <h3 className="font-display text-base font-semibold text-white">
                Transmit Direct Message
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="rounded-xl border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="resize-none rounded-xl border border-white/10 bg-black/70 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none sm:col-span-2"
                />
              </div>
              <button
                type="submit"
                className="mt-3.5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/25 transition hover:from-red-500 hover:to-amber-500"
              >
                <Send className="h-3.5 w-3.5" />
                Send Transmission
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Storyline Prev / Next Navigation Footer */}
      {!state.showAll && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/70 px-5 py-4 backdrop-blur-xl">
          {prevChapter ? (
            <button
              type="button"
              onClick={() => onSelectChapter(prevChapter.id)}
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 text-red-400" />
              <span>
                Back: {prevChapter.code} {prevChapter.label}
              </span>
            </button>
          ) : (
            <span />
          )}

          {nextChapter ? (
            <button
              type="button"
              onClick={() => onSelectChapter(nextChapter.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-mono text-xs font-semibold text-white transition hover:from-red-500 hover:to-amber-500"
            >
              <span>{currentMeta.ctaLabel}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onShowAll}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/15 px-4 py-2 font-mono text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25"
            >
              <span>View All Chapters Together</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

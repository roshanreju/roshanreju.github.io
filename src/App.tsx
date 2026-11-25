import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Bug,
  Check,
  Copy,
  Crosshair,
  ExternalLink,
  Layers,
  Send,
  Sparkles,
  Terminal,
} from 'lucide-react';
import CommandPalette from './components/CommandPalette';
import SecretVoid from './components/SecretVoid';
import SpatialCore3D from './components/SpatialCore3D';
import TiltCard from './components/TiltCard';
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
} from './data/portfolio';

const NAV_ITEMS = [
  { id: 'about', label: 'whoami/' },
  { id: 'experience', label: 'xp/' },
  { id: 'work', label: 'work/' },
  { id: 'credentials', label: 'certs/' },
  { id: 'contact', label: 'comms/' },
];

const FOCUS_ICONS = {
  'red-team': Crosshair,
  'ai-security': Bot,
  appsec: Layers,
  csirt: Bug,
} as const;

type ProjectFilter = 'All' | ProjectItem['category'];
const FILTERS: ProjectFilter[] = ['All', 'Security & AI', 'Tools & Labs', 'Engineering'];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('top');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Track global scroll progress for 3D sculpture choreography
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section for floating pill navbar
  useEffect(() => {
    const ids = ['top', ...NAV_ITEMS.map((i) => i.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Cmd/Ctrl + K opens sleek hacker command palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const triggerCorePulse = () => {
    setPulseTrigger((n) => n + 1);
  };

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
    const s = encodeURIComponent(subject || `Hello from ${name || 'your portfolio'}`);
    const b = encodeURIComponent(`Hi Roshan,\n\n${message}\n\n— ${name}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${s}&body=${b}`;
  };

  return (
    <div className="relative min-h-screen bg-canvas text-zinc-200">
      {/* Live Minimalist 3D Obsidian Gyro-Core */}
      <SpatialCore3D scrollProgress={scrollProgress} pulseTrigger={pulseTrigger} />

      {/* Subtle ambient crimson vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.09),transparent_55%)]"
      />

      {/* Subtle right-edge scroll progress hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 right-4 z-30 hidden h-36 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 lg:block"
      >
        <div
          className="w-full rounded-full bg-red-500 transition-all duration-150"
          style={{ height: `${Math.max(10, Math.round(scrollProgress * 100))}%` }}
        />
      </div>

      {/* Floating Spatial Pill Navbar (williamle.design inspired) */}
      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-white/[0.1] bg-[#09090d]/75 p-1.5 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('top');
            }}
            className="flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs font-bold tracking-tight text-white transition hover:text-red-300 sm:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>C4PTR4</span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`rounded-full px-3 py-1.5 font-mono text-xs transition ${
                    active
                      ? 'bg-white/[0.1] text-white'
                      : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setVoidOpen(true)}
              title="Enter the void..."
              className="rounded-full px-3 py-1.5 font-mono text-xs font-semibold text-red-400 transition hover:bg-red-600/15 hover:text-red-200"
            >
              ???
            </button>
          </div>

          <button
            type="button"
            onClick={() => setVoidOpen(true)}
            title="Enter the void..."
            className="rounded-full px-2.5 py-1.5 font-mono text-xs font-semibold text-red-400 transition hover:bg-red-600/15 hover:text-red-200 md:hidden"
          >
            ???
          </button>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title="Open Hacker Shell (Ctrl+K / ⌘K)"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-red-500/35 bg-red-600/15 px-3 py-1.5 font-mono text-[11px] font-medium text-red-200 transition hover:border-red-400 hover:bg-red-600/25 hover:text-white"
          >
            <Terminal className="h-3 w-3 text-red-400" />
            <span className="hidden sm:inline">Shell</span>
            <kbd className="hidden rounded bg-black/50 px-1 py-0.5 text-[9.5px] text-zinc-400 sm:inline">
              ⌘K
            </kbd>
          </button>
        </nav>
      </header>

      {/* Main Content Flow */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        {/* 00 // FULL-VIEWPORT EDITORIAL HERO */}
        <section
          id="top"
          className="flex min-h-screen flex-col justify-center pt-24 pb-16 lg:max-w-[58%]"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3.5 py-1.5 font-mono text-[11px] tracking-wider text-zinc-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{PROFILE.handle}</span>
            <span className="text-zinc-600">·</span>
            <span>{PROFILE.location}</span>
          </div>

          <h1 className="mt-7 font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Adversarial thinking.{' '}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-zinc-200 bg-clip-text text-transparent">
              Precision defense.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Associate Red Team Consultant at <span className="text-white">Google</span>. I emulate
            real-world adversaries across networks, cloud infrastructure, and AI systems — helping
            organizations harden defenses before real attackers strike.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(220,38,38,0.8)] transition hover:bg-red-500"
            >
              <span>Explore Story</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={triggerCorePulse}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-5 py-3 text-sm font-medium text-zinc-200 backdrop-blur-md transition hover:border-red-500/50 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              <span>Pulse 3D Core</span>
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs text-zinc-300 backdrop-blur-md transition hover:border-red-500/40 hover:text-white"
            >
              <Terminal className="h-3.5 w-3.5 text-red-400" />
              <span>Open Shell</span>
            </button>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-500">
            <span>Google Red Team</span>
            <span className="text-zinc-700">/</span>
            <span>OffSec LLM Red Teaming</span>
            <span className="text-zinc-700">/</span>
            <span>CompTIA PenTest+</span>
            <span className="text-zinc-700">/</span>
            <span>CEH Hall of Fame</span>
          </div>
        </section>

        {/* 01 // PERSPECTIVE & FOCUS */}
        <section id="about" className="scroll-mt-28 py-24">
          <div className="lg:ml-auto lg:max-w-[78%]">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-500">
              01 — Perspective
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From AppSec &amp; 24/7 CSIRT to full-scope adversary emulation.
            </h2>

            <TiltCard className="mt-8 p-6 sm:p-8">
              <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                {PROFILE.aboutParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </TiltCard>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {FOCUS_AREAS.map((area) => {
                const Icon = FOCUS_ICONS[area.id as keyof typeof FOCUS_ICONS] ?? Crosshair;
                return (
                  <TiltCard key={area.id} className="p-6">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-600/15 text-red-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{area.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {area.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10.5px] text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.category}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a0a0e]/70 p-5 backdrop-blur-xl"
                >
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-red-400">
                    {group.category}
                  </h3>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-white/[0.07] bg-black/50 px-2 py-0.5 text-[11.5px] text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 // EXPERIENCE & EDUCATION */}
        <section id="experience" className="scroll-mt-28 py-24">
          <div className="lg:max-w-[78%]">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-500">
              02 — Experience
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Career trajectory &amp; academic foundation.
            </h2>

            <div className="relative mt-10 space-y-5 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[6px] before:w-px before:bg-gradient-to-b before:from-red-500 before:via-white/15 before:to-transparent">
              {EXPERIENCE.map((item) => (
                <TiltCard key={`${item.role}-${item.organization}`} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{item.role}</h3>
                      <p className="text-sm font-medium text-red-400">
                        {item.organization}{' '}
                        <span className="font-normal text-zinc-500">· {item.location}</span>
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/50 px-3 py-0.5 font-mono text-[11px] text-zinc-300">
                      {item.period}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-300">
                    {item.highlights.map((bullet, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.08] bg-black/50 px-2.5 py-0.5 font-mono text-[10.5px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {EDUCATION.map((edu) => (
                <TiltCard key={edu.institution} className="p-6">
                  <span className="font-mono text-[11px] text-red-400">{edu.period}</span>
                  <h3 className="mt-2 font-display text-base font-semibold text-white">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-300">{edu.institution}</p>
                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">{edu.details}</p>
                </TiltCard>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {VOLUNTEERING.map((vol) => (
                <div
                  key={vol.organization}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a0a0e]/70 p-4 backdrop-blur-xl"
                >
                  <div className="font-display text-sm font-semibold text-white">{vol.role}</div>
                  <div className="mt-0.5 text-xs text-red-400">{vol.organization}</div>
                  {vol.period && (
                    <div className="mt-1 font-mono text-[10.5px] text-zinc-500">{vol.period}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 // SELECTED WORK & RESEARCH */}
        <section id="work" className="scroll-mt-28 py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-500">
                03 — Selected Work &amp; Research
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Projects, IEEE paper &amp; security writing.
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${
                    filter === cat
                      ? 'bg-red-600 text-white'
                      : 'border border-white/10 bg-black/50 text-zinc-400 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <TiltCard key={project.title} className="group flex flex-col justify-between p-6">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-red-400">
                    {project.category}
                  </span>
                  <h3 className="mt-2.5 font-display text-lg font-semibold text-white transition group-hover:text-red-300">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/[0.07] bg-black/50 px-2 py-0.5 font-mono text-[10.5px] text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-red-400 transition hover:text-white"
                  >
                    {project.linkLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PUBLICATIONS.map((pub) => (
              <a
                key={pub.title}
                href={pub.url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <TiltCard className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-red-400">{pub.badge ?? pub.type}</span>
                      <span className="text-zinc-500">{pub.date}</span>
                    </div>
                    <h3 className="mt-2.5 font-display text-base font-semibold text-white transition group-hover:text-red-300 sm:text-lg">
                      {pub.title}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">{pub.venue}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{pub.summary}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-red-400 group-hover:text-white">
                    Read publication <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </TiltCard>
              </a>
            ))}
          </div>
        </section>

        {/* 04 // CREDENTIALS & HONORS */}
        <section id="credentials" className="scroll-mt-28 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-500">
            04 — Credentials &amp; Recognition
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Certifications &amp; honors.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <TiltCard key={cert.name} className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <BadgeCheck className="h-4 w-4 text-red-500" />
                    {cert.highlight && (
                      <span className="rounded-full border border-red-500/30 bg-red-600/15 px-2.5 py-0.5 font-mono text-[10px] text-red-300">
                        {cert.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-white">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{cert.issuer}</p>
                  {(cert.date || cert.credentialId) && (
                    <p className="mt-1.5 font-mono text-[10.5px] text-zinc-500">
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
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-red-400 hover:text-white"
                  >
                    Verify credential <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </TiltCard>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AWARDS.map((award) => (
              <div
                key={award.title}
                className="rounded-2xl border border-white/[0.08] bg-[#0a0a0e]/70 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{award.title}</h3>
                  <span className="shrink-0 font-mono text-[10.5px] text-zinc-500">
                    {award.date}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-red-400">{award.issuer}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{award.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 05 // CONTACT */}
        <section id="contact" className="scroll-mt-28 py-24 pb-32">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-red-500">
              05 — Contact
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let&apos;s connect.
            </h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <TiltCard className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
                <div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    Based in {PROFILE.location}. Always open to connecting on offensive security,
                    AI &amp; LLM red teaming, security research, or speaking opportunities.
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/60 p-3">
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
                          <Check className="h-3 w-3 text-red-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] text-zinc-300 transition hover:border-red-500/50 hover:text-white"
                    >
                      {social.label}
                      <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                    </a>
                  ))}
                </div>
              </TiltCard>

              <TiltCard className="p-6 sm:p-7 lg:col-span-7">
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Email
                  </button>
                </form>
              </TiltCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-black/60 py-7 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 font-mono text-xs text-zinc-500 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} ({PROFILE.handle})
          </p>
          <p>
            Press ⌘K for shell · Click{' '}
            <button
              type="button"
              onClick={() => setVoidOpen(true)}
              className="text-red-400 hover:underline"
            >
              ???
            </button>{' '}
            if you&apos;re curious
          </p>
        </div>
      </footer>

      {/* Optional Spotlight-Style Hacker Command Palette (⌘K) */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigateTo}
        onPulseCore={triggerCorePulse}
        onOpenVoid={() => setVoidOpen(true)}
      />

      {/* Hidden ??? Crimson Matrix + Playable Mini-Game */}
      <SecretVoid open={voidOpen} onClose={() => setVoidOpen(false)} />
    </div>
  );
}

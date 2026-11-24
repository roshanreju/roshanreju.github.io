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
  FolderGit2,
  GraduationCap,
  Layers,
  Mail,
  Send,
  Shield,
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
import { SectionId } from '../engine/boxEngine';

interface PortfolioContentProps {
  activeSection: SectionId | null;
  showAll: boolean;
}

const FOCUS_ICONS = {
  'red-team': Crosshair,
  'ai-security': Bot,
  appsec: Layers,
  csirt: Bug,
} as const;

type ProjectFilter = 'All' | ProjectItem['category'];
const FILTERS: ProjectFilter[] = ['All', 'Security & AI', 'Tools & Labs', 'Engineering'];

export default function PortfolioContent({ activeSection, showAll }: PortfolioContentProps) {
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!showAll && !activeSection) {
    return null;
  }

  const showAbout = showAll || activeSection === 'about';
  const showExperience = showAll || activeSection === 'experience';
  const showProjects = showAll || activeSection === 'projects';
  const showContact = showAll || activeSection === 'contact';

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
    const s = encodeURIComponent(subject || `Hello from ${name || 'your site'}`);
    const b = encodeURIComponent(`Hi Roshan,\n\n${message}\n\n— ${name}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${s}&body=${b}`;
  };

  return (
    <div className="space-y-16">
      {/* 01 // ABOUT & FOCUS */}
      {showAbout && (
        <section id="section-about" className="scroll-mt-24 space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              <Shield className="h-3.5 w-3.5" />
              01 // About &amp; What I Do
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              Offensive mindset. Engineering rigor.
            </h2>
          </div>

          <div className="carbon-card space-y-4 p-6 text-sm leading-relaxed text-zinc-300 sm:p-8 sm:text-[15px]">
            {PROFILE.aboutParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => {
              const Icon = FOCUS_ICONS[area.id as keyof typeof FOCUS_ICONS] ?? Crosshair;
              return (
                <div key={area.id} className="carbon-card-hover p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-600/15 text-red-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{area.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {area.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.08] bg-black/50 px-2.5 py-0.5 font-mono text-[11px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <div key={group.category} className="carbon-card p-5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
                  {group.category}
                </h3>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/[0.08] bg-black/40 px-2.5 py-1 text-xs text-zinc-300"
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

      {/* 02 // EXPERIENCE & EDUCATION */}
      {showExperience && (
        <section id="section-experience" className="scroll-mt-24 space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              <Briefcase className="h-3.5 w-3.5" />
              02 // Career &amp; Education
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">Where I&apos;ve worked</h2>
          </div>

          <div className="relative space-y-5 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-red-500 before:via-red-500/30 before:to-transparent">
            {EXPERIENCE.map((item) => (
              <article
                key={`${item.role}-${item.organization}`}
                className="carbon-card-hover relative p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-7 -left-[22px] h-3 w-3 rounded-full border-2 border-red-500 bg-canvas"
                />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{item.role}</h3>
                    <p className="text-sm font-medium text-red-400">
                      {item.organization}{' '}
                      <span className="font-normal text-zinc-500">· {item.location}</span>
                    </p>
                  </div>
                  <span className="rounded-md border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-xs text-zinc-300">
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
                      className="rounded border border-white/[0.08] bg-black/50 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <GraduationCap className="h-4 w-4 text-red-400" />
              Education
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {EDUCATION.map((edu) => (
                <div key={edu.institution} className="carbon-card p-6">
                  <span className="inline-block rounded border border-red-500/30 bg-red-600/15 px-2.5 py-0.5 font-mono text-xs text-red-300">
                    {edu.period}
                  </span>
                  <h4 className="mt-3 font-display text-base font-semibold text-white">
                    {edu.degree}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-300">{edu.institution}</p>
                  <p className="font-mono text-xs text-zinc-500">{edu.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Community &amp; Volunteering
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {VOLUNTEERING.map((vol) => (
                <div key={vol.organization} className="carbon-card p-4">
                  <div className="font-display text-sm font-semibold text-white">{vol.role}</div>
                  <div className="mt-0.5 text-xs text-red-400">{vol.organization}</div>
                  {vol.period && (
                    <div className="mt-1 font-mono text-[11px] text-zinc-500">{vol.period}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 03 // PROJECTS & RESEARCH */}
      {showProjects && (
        <section id="section-projects" className="scroll-mt-24 space-y-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
                <FolderGit2 className="h-3.5 w-3.5" />
                03 // Projects &amp; Research
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                Builds, papers &amp; write-ups
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition ${
                    filter === cat
                      ? 'border border-red-500 bg-red-600/20 text-red-200'
                      : 'border border-white/10 bg-surface text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <article
                key={project.title}
                className="carbon-card-hover group flex flex-col justify-between p-6"
              >
                <div>
                  <span className="rounded border border-red-500/25 bg-red-600/10 px-2 py-0.5 font-mono text-[11px] text-red-300">
                    {project.category}
                  </span>
                  <h3 className="mt-3.5 font-display text-lg font-semibold text-white group-hover:text-red-300">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-white/[0.08] bg-black/50 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-red-400 hover:text-red-300"
                  >
                    {project.linkLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Publications & Medium Write-ups */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <BookOpen className="h-4 w-4 text-red-400" />
              IEEE Research &amp; Security Write-ups
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {PUBLICATIONS.map((pub) => (
                <a
                  key={pub.title}
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="carbon-card-hover group flex flex-col justify-between p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="rounded border border-red-500/30 bg-red-600/15 px-2 py-0.5 text-red-300">
                        {pub.badge ?? pub.type}
                      </span>
                      <span className="text-zinc-500">{pub.date}</span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-semibold text-white group-hover:text-red-300">
                      {pub.title}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{pub.venue}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{pub.summary}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-red-400">
                    Read more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 04 // ROOT VAULT: CERTS, AWARDS & CONTACT */}
      {showContact && (
        <section id="section-contact" className="scroll-mt-24 space-y-10">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              <Award className="h-3.5 w-3.5" />
              04 // Root Vault — Credentials, Awards &amp; Contact
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              Recognition &amp; how to reach me
            </h2>
          </div>

          {/* Certs */}
          <div className="grid gap-4 md:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className="carbon-card-hover flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <BadgeCheck className="h-5 w-5 text-red-500" />
                    {cert.highlight && (
                      <span className="rounded border border-red-500/30 bg-red-600/15 px-2 py-0.5 font-mono text-[10px] text-red-300">
                        {cert.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-white">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{cert.issuer}</p>
                  {(cert.date || cert.credentialId) && (
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">
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
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-red-400 hover:text-red-300"
                  >
                    Verify badge <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Awards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AWARDS.map((award) => (
              <article key={award.title} className="carbon-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{award.title}</h3>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-500">{award.date}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-red-400">{award.issuer}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{award.description}</p>
              </article>
            ))}
          </div>

          {/* Contact Box */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="carbon-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
              <div>
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                  <Mail className="h-5 w-5 text-red-500" />
                  Let&apos;s connect
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Based in {PROFILE.location}. Open to chatting about Red Teaming, AI/LLM Security,
                  AppSec, or collaborating on research.
                </p>

                <div className="mt-6 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/50 p-3.5">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="truncate font-mono text-sm text-red-300 hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-xs text-zinc-200 hover:border-red-500/40"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-red-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-white"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="carbon-card p-6 sm:p-8 lg:col-span-7">
              <h3 className="font-display text-lg font-semibold text-white">Send a quick message</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none sm:col-span-2"
                />
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500"
              >
                <Send className="h-3.5 w-3.5" />
                Send Email
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

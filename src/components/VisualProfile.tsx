import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Check,
  Copy,
  ExternalLink,
  Send,
  Terminal,
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

interface VisualProfileProps {
  onBackToStage: () => void;
  onSwitchTerminal: () => void;
  onOpenJailbreak: () => void;
}

type ProjectFilter = 'All' | ProjectItem['category'];
const FILTERS: ProjectFilter[] = ['All', 'Security & AI', 'Tools & Labs', 'Engineering'];

export default function VisualProfile({
  onBackToStage,
  onSwitchTerminal,
  onOpenJailbreak,
}: VisualProfileProps) {
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const s = encodeURIComponent(subject || `Hello from ${name || 'your portfolio'}`);
    const b = encodeURIComponent(`Hi Roshan,\n\n${message}\n\n— ${name}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${s}&body=${b}`;
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050507]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-red-400" />
              <span>3D Stage</span>
            </button>
            <span className="font-mono text-xs font-bold text-white">{PROFILE.handle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenJailbreak}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/35 bg-red-600/15 px-3 py-1.5 font-mono text-xs text-red-200 transition hover:bg-red-600/25 hover:text-white"
            >
              <Bot className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">LLM Jailbreak</span>
            </button>

            <button
              type="button"
              onClick={onSwitchTerminal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-mono text-xs font-semibold text-white transition hover:bg-red-500"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Open Terminal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-20 px-4 py-14 sm:px-6">
        {/* Intro */}
        <section className="space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-500">
              {PROFILE.handle} · {PROFILE.location}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {PROFILE.name}
            </h1>
            <p className="mt-2 font-mono text-sm text-red-400">{PROFILE.tagline}</p>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6 text-sm leading-relaxed text-zinc-300 sm:p-8 sm:text-base">
            {PROFILE.aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6 transition hover:border-red-500/35"
              >
                <h2 className="font-display text-lg font-semibold text-white">{area.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{area.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {area.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 font-mono text-[10.5px] text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SKILL_GROUPS.map((g) => (
              <div key={g.category} className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
                  {g.category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/[0.07] bg-black/50 px-2 py-0.5 text-xs text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <section className="space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-500">
              Experience &amp; Education
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">Career trajectory</h2>
          </div>

          <div className="space-y-4">
            {EXPERIENCE.map((item) => (
              <article
                key={`${item.role}-${item.organization}`}
                className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{item.role}</h3>
                    <p className="text-sm font-medium text-red-400">
                      {item.organization}{' '}
                      <span className="font-normal text-zinc-500">· {item.location}</span>
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/50 px-3 py-0.5 font-mono text-xs text-zinc-300">
                    {item.period}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-300">
                  {item.highlights.map((b, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {EDUCATION.map((edu) => (
              <div key={edu.institution} className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6">
                <span className="font-mono text-xs text-red-400">{edu.period}</span>
                <h3 className="mt-2 font-display text-base font-semibold text-white">
                  {edu.degree}
                </h3>
                <p className="mt-1 text-sm text-zinc-300">{edu.institution}</p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{edu.details}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {VOLUNTEERING.map((v) => (
              <div key={v.organization} className="rounded-xl border border-white/[0.08] bg-[#0b0b10] p-4">
                <div className="font-display text-sm font-semibold text-white">{v.role}</div>
                <div className="text-xs text-red-400">{v.organization}</div>
                {v.period && <div className="mt-1 font-mono text-[11px] text-zinc-500">{v.period}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Projects & Research */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-500">
                Projects &amp; Research
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                Builds, IEEE paper &amp; writing
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition ${
                    filter === f
                      ? 'bg-red-600 text-white'
                      : 'border border-white/10 bg-[#0b0b10] text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((p) => (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-5"
              >
                <div>
                  <span className="font-mono text-[10.5px] uppercase text-red-400">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{p.description}</p>
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-white"
                >
                  {p.linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PUBLICATIONS.map((pub) => (
              <a
                key={pub.title}
                href={pub.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-5 transition hover:border-red-500/40"
              >
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-red-400">{pub.badge ?? pub.type}</span>
                  <span className="text-zinc-500">{pub.date}</span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-white">
                  {pub.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{pub.summary}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Credentials & Contact */}
        <section className="space-y-6 pb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-500">
              Credentials &amp; Contact
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              Certifications, awards &amp; links
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((c) => (
              <div key={c.name} className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-5">
                <BadgeCheck className="h-4 w-4 text-red-500" />
                <h3 className="mt-2.5 font-display text-sm font-semibold text-white">{c.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-400">{c.issuer}</p>
                {c.date && <p className="mt-1 font-mono text-[11px] text-zinc-500">{c.date}</p>}
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-white"
                  >
                    Verify <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AWARDS.map((a) => (
              <div key={a.title} className="rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-5">
                <h3 className="font-display text-sm font-semibold text-white">{a.title}</h3>
                <p className="mt-0.5 font-mono text-[11px] text-red-400">
                  {a.issuer} · {a.date}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{a.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6 lg:col-span-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Direct Contact</h3>
                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/60 p-3">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="truncate font-mono text-xs text-red-300 hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-zinc-200"
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
              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] text-zinc-300 hover:border-red-500/50 hover:text-white"
                  >
                    {s.label} <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#0b0b10] p-6 lg:col-span-7"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                <Send className="h-3.5 w-3.5" />
                Send Email
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

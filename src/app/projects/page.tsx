// src/app/projects/page.tsx
import Link from "next/link";
import { Section } from "@/components/Section";
import { getFeaturedProjects, PROJECTS } from "@/data/projects";
import { DOCS_BASE_URL } from "@/lib/config";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label =
    status === "featured" ? "Featured" : status === "active" ? "Active" : status === "planned" ? "Planned" : "Archived";
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
      {label}
    </span>
  );
}

export default function ProjectsPage() {
  const featured = getFeaturedProjects();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">
          Projects are documented with an evidence-first model. Each project page links to deeper artifacts
          (dossier, ADRs, threat model, runbooks) in the Documentation App where applicable.
        </p>
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Evidence engine:{" "}
          <a className="underline hover:text-zinc-950 dark:hover:text-white" href={DOCS_BASE_URL}>
            open Documentation App
          </a>
        </div>
      </header>

      <Section title="Featured" subtitle="Best entry points for reviewers. Each has a defined evidence trail.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map((p) => (
            <div key={p.slug} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    <Link className="hover:underline" href={`/projects/${p.slug}`}>
                      {p.title}
                    </Link>
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{p.summary}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              {p.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.slice(0, 6).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Link className="underline" href={`/projects/${p.slug}`}>
                  View details
                </Link>
                {p.repoUrl ? (
                  <a className="underline" href={p.repoUrl}>
                    Repo
                  </a>
                ) : null}
                {p.demoUrl ? (
                  <a className="underline" href={p.demoUrl}>
                    Demo
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="All projects (registry placeholder)"
        subtitle="This list will become filterable once the registry expands."
      >
        <div className="flex flex-col gap-3">
          {PROJECTS.map((p) => (
            <div key={p.slug} className="flex flex-col gap-1 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link className="font-medium hover:underline" href={`/projects/${p.slug}`}>
                  {p.title}
                </Link>
                <StatusBadge status={p.status} />
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{p.summary}</div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <Link className="underline" href={`/projects/${p.slug}`}>
                  Details
                </Link>
                {p.repoUrl ? (
                  <a className="underline" href={p.repoUrl}>
                    Repo
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

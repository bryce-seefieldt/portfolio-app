// src/app/cv/page.tsx
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_BASE_URL, docsUrl, GITHUB_URL, LINKEDIN_URL } from "@/lib/config";
import { TIMELINE } from "@/data/cv";

export default function CVPage() {
  return (
    <div className="flex flex-col gap-8">
      <ScrollFadeIn>
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Experience & Capabilities</h1>
          <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">
            Evidence-first CV: each role links to proofs (projects, dossiers, architecture
            decisions, operational maturity). This CV is designed for rapid review and verification
            by senior engineers and technical hiring managers.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="text-sm font-medium text-zinc-800 underline hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
            >
              Browse projects
            </Link>
            <a
              href={DOCS_BASE_URL}
              className="text-sm font-medium text-zinc-800 underline hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
            >
              Open evidence docs
            </a>
            {GITHUB_URL ? (
              <a className="text-sm font-medium underline" href={GITHUB_URL}>
                GitHub
              </a>
            ) : null}
            {LINKEDIN_URL ? (
              <a className="text-sm font-medium underline" href={LINKEDIN_URL}>
                LinkedIn
              </a>
            ) : null}
          </div>
        </header>
      </ScrollFadeIn>

      <ScrollFadeIn delay={50}>
        <Callout>
          <div className="flex flex-col gap-2">
            <div className="font-medium">Suggested reviewer path</div>
            <ol className="list-decimal pl-5 text-sm">
              <li>
                Start with the Portfolio App gold standard project page:{" "}
                <Link className="underline" href="/projects/portfolio-app">
                  /projects/portfolio-app
                </Link>{" "}
                — includes 5-minute verification checklist
              </li>
              <li>
                Review the threat model to validate security awareness:{" "}
                <a
                  className="underline"
                  href={docsUrl("/docs/security/threat-models/portfolio-app")}
                >
                  STRIDE analysis
                </a>
              </li>
              <li>
                Scan operational maturity:{" "}
                <a className="underline" href={docsUrl("/docs/operations/runbooks/")}>
                  runbooks
                </a>{" "}
                (deploy, rollback, CI triage, secrets incident)
              </li>
              <li>
                Browse architectural decisions:{" "}
                <a className="underline" href={docsUrl("/docs/architecture/adr/")}>
                  ADR index
                </a>
              </li>
            </ol>
          </div>
        </Callout>
      </ScrollFadeIn>

      {TIMELINE.map((entry, idx) => (
        <ScrollFadeIn key={idx} delay={idx * 100}>
          <Section title={entry.title} subtitle={`${entry.organization} — ${entry.period}`}>
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">{entry.description}</p>

            <div className="mb-4">
              <h4 className="font-medium text-zinc-900 dark:text-white">Key Capabilities</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.keyCapabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-zinc-900 dark:text-white">Proofs & Evidence</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {entry.proofs.map((proof, pIdx) => (
                  <li key={pIdx}>
                    <a
                      className="underline hover:text-zinc-950 dark:hover:text-white"
                      href={proof.href}
                    >
                      {proof.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </ScrollFadeIn>
      ))}

      <ScrollFadeIn delay={400}>
        <Section title="Evidence Hubs" subtitle="Primary entry points for comprehensive review">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-zinc-900 dark:text-white">Project Evidence</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <a className="underline" href={docsUrl("/docs/projects/portfolio-app/")}>
                    Portfolio App Dossier
                  </a>{" "}
                  — Complete project documentation
                </li>
                <li>
                  <a className="underline" href={docsUrl("/docs/projects/portfolio-docs-app/")}>
                    Documentation App Dossier
                  </a>{" "}
                  — Docusaurus documentation site
                </li>
                <li>
                  <a className="underline" href={docsUrl("/docs/portfolio/roadmap")}>
                    Program Roadmap
                  </a>{" "}
                  — Multi-phase delivery plan
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-zinc-900 dark:text-white">
                Architecture & Operations
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>
                  <a className="underline" href={docsUrl("/docs/architecture/adr/")}>
                    ADR Index
                  </a>{" "}
                  — Architecture decision records
                </li>
                <li>
                  <a className="underline" href={docsUrl("/docs/security/threat-models/")}>
                    Threat Models
                  </a>{" "}
                  — STRIDE security analysis
                </li>
                <li>
                  <a className="underline" href={docsUrl("/docs/operations/runbooks/")}>
                    Operational Runbooks
                  </a>{" "}
                  — Deploy, rollback, triage procedures
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </ScrollFadeIn>
    </div>
  );
}

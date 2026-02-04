// src/app/page.tsx
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_BASE_URL, GITHUB_URL, LINKEDIN_URL, docsUrl } from "@/lib/config";

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 dark:border-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* HERO */}
      <ScrollFadeIn>
        <header className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Full-stack engineering • Enterprise SDLC • Evidence-first delivery
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A reviewer-ready portfolio with traceable engineering evidence.
          </h1>

          <p className="max-w-3xl text-base text-zinc-700 dark:text-zinc-300">
            This site is the portfolio front door. The proof—ADRs, threat models, runbooks, and
            release notes—lives in the companion Documentation App for fast validation.
          </p>

          {/* PRIMARY CTA ROW */}
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton href="/cv">Start with the CV</PrimaryButton>
            <SecondaryLink href="/projects">Browse projects</SecondaryLink>
            <a
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              href={DOCS_BASE_URL}
            >
              Open evidence docs
            </a>
          </div>

          {/* EXTERNAL LINKS */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {GITHUB_URL ? (
              <a className="hover:text-zinc-950 dark:hover:text-white" href={GITHUB_URL}>
                GitHub
              </a>
            ) : null}
            {LINKEDIN_URL ? (
              <a className="hover:text-zinc-950 dark:hover:text-white" href={LINKEDIN_URL}>
                LinkedIn
              </a>
            ) : null}
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>Evidence-first delivery model</span>
          </div>
        </header>

        {/* CALLOUT: HOW TO EVALUATE */}
        <Callout>
          <div className="flex flex-col gap-2">
            <div className="font-medium">How to evaluate this portfolio (fast path)</div>
            <ol className="list-decimal pl-5">
              <li>
                Read the{" "}
                <Link className="underline" href="/cv">
                  CV
                </Link>{" "}
                for impact, scope, and seniority signals.
              </li>
              <li>
                Open a project page in{" "}
                <Link className="underline" href="/projects">
                  Projects
                </Link>{" "}
                and follow the evidence links.
              </li>
              <li>
                In the Documentation App, review the{" "}
                <a className="underline" href={docsUrl("projects/portfolio-app/")}>
                  Portfolio App dossier
                </a>{" "}
                plus at least one ADR and runbook.
              </li>
            </ol>
          </div>
        </Callout>
      </ScrollFadeIn>

      {/* SECTIONS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScrollFadeIn>
          <Section
            title="What this portfolio proves"
            subtitle="Designed to be reviewed like a real production service."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Modern TypeScript web engineering (Next.js App Router).</li>
              <li>Enterprise SDLC: PR discipline, CI quality gates, and release governance.</li>
              <li>
                Security posture: safe-publication rules, supply chain hygiene, threat modeling.
              </li>
              <li>Operational readiness: deploy/rollback runbooks and failure-mode triage.</li>
            </ul>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={100}>
          <Section
            title="Evidence engine"
            subtitle="Deep technical documentation lives in the companion docs site."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                Architecture decisions (ADRs):{" "}
                <a className="underline" href={docsUrl("10-architecture/adr/")}>
                  view ADR index
                </a>
              </li>
              <li>
                Threat models:{" "}
                <a className="underline" href={docsUrl("40-security/threat-models/")}>
                  view threat models
                </a>
              </li>
              <li>
                Runbooks:{" "}
                <a className="underline" href={docsUrl("50-operations/runbooks/")}>
                  view runbooks
                </a>
              </li>
              <li>
                Roadmap:{" "}
                <a className="underline" href={docsUrl("00-portfolio/roadmap")}>
                  portfolio program roadmap
                </a>
              </li>
            </ul>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={200}>
          <Section
            title="Featured work"
            subtitle="Data-driven projects with evidence links and reviewer-ready dossiers."
          >
            <div className="flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="font-medium">Portfolio Documentation App</div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Docusaurus evidence engine: dossiers, ADRs, threat models, runbooks.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a className="underline" href={docsUrl("projects/portfolio-docs-app/")}>
                    Read dossier
                  </a>
                  <a className="underline" href={docsUrl("architecture/adr/")}>
                    ADRs
                  </a>
                  <a className="underline" href={docsUrl("operations/runbooks/")}>
                    Runbooks
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="font-medium">Portfolio App (this site)</div>
                <div className="mt-1 text-zinc-600 dark:text-zinc-400">
                  Next.js + TypeScript web application designed to be reviewed like production.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a className="underline" href={docsUrl("projects/portfolio-app/")}>
                    Read dossier
                  </a>
                  <a
                    className="underline"
                    href={docsUrl("security/threat-models/portfolio-app-threat-model")}
                  >
                    Threat model
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </ScrollFadeIn>

        <ScrollFadeIn delay={300}>
          <Section
            title="Phase 5 focus"
            subtitle="Professionalization, validation, and release readiness."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Refine narrative clarity and reviewer entry points.</li>
              <li>Audit evidence and remove unsupported claims.</li>
              <li>Finalize a v1.0 release with known limitations documented.</li>
            </ul>
            <div className="mt-4">
              <a className="underline" href={docsUrl("00-portfolio/roadmap")}>
                See the roadmap
              </a>
            </div>
          </Section>
        </ScrollFadeIn>
      </div>
    </div>
  );
}

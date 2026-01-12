// src/app/cv/page.tsx
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { Section } from "@/components/Section";
import { DOCS_BASE_URL, docsUrl, GITHUB_URL, LINKEDIN_URL } from "@/lib/config";

type TimelineItem = {
  title: string;
  org: string;
  period: string;
  highlights: string[];
};

const EXPERIENCE: TimelineItem[] = [
  {
    title: "CIO / IT Executive + Full-Stack Developer",
    org: "Education-sector enterprise IT",
    period: "Current",
    highlights: [
      "Enterprise IT leadership with hands-on delivery across platform, operations, and application development.",
      "Docs-as-code governance: ADRs, runbooks, threat models, and release discipline as first-class artifacts.",
      "Systems thinking: reliability, recoverability, and security posture integrated into delivery workflows.",
    ],
  },
  {
    title: "Full-Stack / Platform Engineering (Representative Scope)",
    org: "Portfolio Program (public proof)",
    period: "Ongoing",
    highlights: [
      "Next.js + TypeScript application delivery with enterprise CI gates and promotion governance.",
      "Operational credibility: deterministic deploy/rollback procedures and CI triage playbooks.",
      "Security-informed design: safe-publication rules and supply chain hygiene as baseline controls.",
    ],
  },
];

type Capability = {
  category: string;
  items: { label: string; proof?: { text: string; href: string } }[];
};

const CAPABILITIES: Capability[] = [
  {
    category: "Full-stack web engineering",
    items: [
      {
        label: "Next.js (App Router), React, TypeScript",
        proof: { text: "Portfolio App dossier", href: docsUrl("projects/portfolio-app/") },
      },
      {
        label: "Component architecture and scalable content models",
        proof: {
          text: "Architecture evidence",
          href: docsUrl("projects/portfolio-app/architecture"),
        },
      },
      {
        label: "Performance and accessibility fundamentals (phased hardening)",
        proof: { text: "Roadmap", href: docsUrl("portfolio/roadmap") },
      },
    ],
  },
  {
    category: "DevOps / platform delivery",
    items: [
      {
        label: "CI quality gates (lint/format/typecheck/build)",
        proof: { text: "Testing & gates", href: docsUrl("projects/portfolio-app/testing") },
      },
      {
        label: "Release governance with promotion checks",
        proof: {
          text: "Hosting ADR",
          href: docsUrl(
            "architecture/adr/adr-0007-portfolio-app-hosting-vercel-with-promotion-checks",
          ),
        },
      },
      {
        label: "Operational readiness: deploy/rollback/triage runbooks",
        proof: { text: "Runbooks", href: docsUrl("operations/runbooks/") },
      },
    ],
  },
  {
    category: "Security-minded engineering",
    items: [
      {
        label: "Threat modeling and SDLC controls",
        proof: { text: "Threat models", href: docsUrl("security/threat-models/") },
      },
      {
        label: "Supply chain hygiene and dependency governance",
        proof: {
          text: "Threat model (Portfolio App)",
          href: docsUrl("security/threat-models/portfolio-app-threat-model"),
        },
      },
      {
        label: "Public-safe documentation and evidence discipline",
        proof: { text: "Documentation App dossier", href: docsUrl("projects/portfolio-docs-app/") },
      },
    ],
  },
];

function EvidenceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </a>
  );
}

export default function CVPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Interactive CV</h1>
        <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">
          This CV is designed for rapid review and verification. It prioritizes evidence links over
          claims. Deep technical artifacts (ADRs, threat models, runbooks) live in the Documentation
          App.
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

      <Callout>
        <div className="flex flex-col gap-2">
          <div className="font-medium">Suggested reviewer path</div>
          <ol className="list-decimal pl-5">
            <li>
              Pick one featured project and review its dossier:{" "}
              <a className="underline" href={docsUrl("projects/portfolio-app/")}>
                Portfolio App dossier
              </a>
              .
            </li>
            <li>
              Scan the architectural decision record index:{" "}
              <a className="underline" href={docsUrl("10-architecture/adr/")}>
                ADR index
              </a>
              .
            </li>
            <li>
              Review operational maturity:{" "}
              <a className="underline" href={docsUrl("50-operations/runbooks/")}>
                runbooks
              </a>{" "}
              and the roadmap:{" "}
              <a className="underline" href={docsUrl("00-portfolio/roadmap")}>
                roadmap
              </a>
              .
            </li>
          </ol>
        </div>
      </Callout>

      <Section
        title="Professional summary"
        subtitle="Senior full-stack delivery with enterprise IT operational context."
      >
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          I build and operate production-grade systems with an evidence-first mindset: planning
          artifacts are version-controlled, decisions are recorded, risks are assessed, and
          operational procedures are documented. This portfolio program is intentionally designed to
          demonstrate that discipline publicly and reproducibly.
        </p>
      </Section>

      <Section
        title="Capabilities (with proof links)"
        subtitle="Each capability maps to evidence artifacts where possible."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.category}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="font-medium">{cap.category}</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {cap.items.map((it) => (
                  <li key={it.label} className="mt-1">
                    <span>{it.label}</span>
                    {it.proof ? (
                      <>
                        {" "}
                        <span className="text-zinc-400 dark:text-zinc-600">—</span>{" "}
                        <EvidenceLink href={it.proof.href}>{it.proof.text}</EvidenceLink>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Experience timeline (first-pass)"
        subtitle="Replace placeholder entries with real roles and outcomes; keep proof links."
      >
        <div className="flex flex-col gap-4">
          {EXPERIENCE.map((item) => (
            <div
              key={`${item.title}-${item.org}`}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{item.period}</div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.org}</div>
              </div>

              <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {item.highlights.map((h) => (
                  <li key={h} className="mt-1">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Evidence hubs" subtitle="Primary evidence entry points for deeper review.">
        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            Portfolio App dossier:{" "}
            <a className="underline" href={docsUrl("projects/portfolio-app/")}>
              open dossier
            </a>
          </li>
          <li>
            Roadmap:{" "}
            <a className="underline" href={docsUrl("portfolio/roadmap")}>
              open roadmap
            </a>
          </li>
          <li>
            ADR index:{" "}
            <a className="underline" href={docsUrl("10-architecture/adr/")}>
              open ADR index
            </a>
          </li>
          <li>
            Threat models:{" "}
            <a className="underline" href={docsUrl("40-security/threat-models/")}>
              open threat models
            </a>
          </li>
          <li>
            Runbooks:{" "}
            <a className="underline" href={docsUrl("50-operations/runbooks/")}>
              open runbooks
            </a>
          </li>
        </ul>
      </Section>

      <Section
        title="Next actions"
        subtitle="If you want to validate ongoing work, these are the current program priorities."
      >
        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Finalize CI gates and Vercel promotion checks for the Portfolio App repo.</li>
          <li>Implement the first “gold standard” project page with a complete evidence trail.</li>
          <li>
            Convert projects to a data-driven registry (filters, tags, repeatable publishing).
          </li>
        </ul>
      </Section>
    </div>
  );
}

// src/app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { Callout } from "@/components/Callout";
import { BadgeGroup } from "@/components/BadgeGroup";
import { EvidenceBlock } from "@/components/EvidenceBlock";
import { getProjectBySlug } from "@/data/projects";
import { docsUrl, githubUrl, SITE_URL } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const projectUrl = SITE_URL ? `${SITE_URL}/projects/${slug}` : `/projects/${slug}`;

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "website",
      url: projectUrl,
      siteName: "Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  const isGoldStandard = slug === "portfolio-app";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          <Link className="underline hover:text-zinc-950 dark:hover:text-white" href="/projects">
            Projects
          </Link>{" "}
          <span className="text-zinc-400 dark:text-zinc-600">/</span> {project.title}
        </div>

        <BadgeGroup project={project} />

        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">{project.summary}</p>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {project.repoUrl ? (
            <a className="underline" href={project.repoUrl}>
              Repo
            </a>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400">Repo: (add when ready)</span>
          )}
          {project.demoUrl ? (
            <a className="underline" href={project.demoUrl}>
              Demo
            </a>
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400">Demo: (add when deployed)</span>
          )}
        </div>
      </header>

      {isGoldStandard ? (
        <>
          <Section title="What This Project Proves">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">Technical Competency</h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>• Next.js 15+ (App Router, React Server Components)</li>
                  <li>• TypeScript 5+ (strict mode)</li>
                  <li>• Tailwind CSS 4 (responsive design)</li>
                  <li>• Evidence-first UX</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">
                  Engineering Discipline
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>• CI quality gates (lint, format, typecheck, secrets scan)</li>
                  <li>• Automated smoke testing (Playwright)</li>
                  <li>• Frozen lockfile builds (determinism)</li>
                  <li>• PR-only merge discipline</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">Security Awareness</h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>• Public-safe by design (no secrets)</li>
                  <li>• CodeQL + Dependabot (supply chain)</li>
                  <li>• Least-privilege CI permissions</li>
                  <li>• Secrets incident response runbook</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">Operational Maturity</h3>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>• Deploy/rollback runbooks</li>
                  <li>• CI triage procedures</li>
                  <li>• Vercel promotion gating</li>
                  <li>• Evidence-based release notes</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Evidence Artifacts">
            <EvidenceBlock project={project} />
          </Section>

          <Section title="Verification Checklist">
            <Callout type="info">
              The following checklist allows a reviewer to verify gold standard claims in &lt; 5
              minutes without running local builds.
            </Callout>

            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <div>
                <strong>Enforced quality gates:</strong> Open{" "}
                <a className="underline" href={githubUrl("blob/main/.github/workflows/ci.yml")}>
                  .github/workflows/ci.yml
                </a>{" "}
                → see <code>quality</code>, <code>secrets-scan</code>, <code>build-and-test</code>,{" "}
                <code>codeql</code> jobs all required.
              </div>

              <div>
                <strong>PR discipline:</strong> Open{" "}
                <a className="underline" href={githubUrl("settings/branches")}>
                  Branch Protection
                </a>{" "}
                → confirm require-PR + status-checks enabled.
              </div>

              <div>
                <strong>Secrets safety:</strong> Grep <code>src/</code> for API_KEY, PASSWORD,
                SECRET → zero matches expected. See{" "}
                <a
                  className="underline"
                  href={docsUrl("/docs/projects/portfolio-app/04-security#public-safety-rules")}
                >
                  public-safety rules
                </a>
                .
              </div>

              <div>
                <strong>Smoke tests:</strong> Check{" "}
                <a className="underline" href={githubUrl("actions")}>
                  recent CI runs
                </a>{" "}
                → see Playwright smoke tests passing post-build.
              </div>

              <div>
                <strong>Dependencies:</strong> Open{" "}
                <a className="underline" href={githubUrl("blob/main/package.json")}>
                  package.json
                </a>{" "}
                → see Next 15+, React 19, Tailwind 4, TypeScript 5.
              </div>
            </div>
          </Section>

          <Section title="Tech Stack">
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 15+",
                "React 19",
                "TypeScript 5",
                "Tailwind CSS 4",
                "Playwright",
                "ESLint 9",
                "Prettier",
                "pnpm",
                "Vercel",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>
        </>
      ) : (
        <>
          <Section
            title="What this project proves"
            subtitle="A reviewer-oriented proof checklist (expand as you mature)."
          >
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Clear technical scope, boundaries, and design rationale.</li>
              <li>Enterprise SDLC posture: PR discipline and CI quality gates.</li>
              <li>Security-aware delivery: threat modeling and safe-publication rules.</li>
              <li>Operational readiness: deploy/rollback/triage procedures where relevant.</li>
            </ul>
          </Section>

          <Section title="Evidence Artifacts">
            <EvidenceBlock project={project} />
          </Section>

          <Section
            title="Technical summary (first-pass)"
            subtitle="Keep this concise; link to dossiers for depth."
          >
            <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                This page is intentionally structured to scale: project data will move into a
                validated registry, and evidence links will remain stable. Long-form technical
                details and operational artifacts live in the Documentation App to preserve a clean
                front-of-house experience.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Next step: replace placeholder proof statements with project-specific evidence and
                add diagrams/screenshots where public-safe.
              </p>
            </div>
          </Section>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link className="underline" href="/projects">
          Back to projects
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeGroup } from "@/components/BadgeGroup";
import { Callout } from "@/components/Callout";
import { ControlButton } from "@/components/ControlButton";
import { EvidenceBlock } from "@/components/EvidenceBlock";
import { LabelTag } from "@/components/LabelTag";
import { Panel } from "@/components/Panel";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { getProjectBySlug, PROJECTS } from "@/data/projects";
import { docsUrl, githubUrl, SITE_URL } from "@/lib/config";

export const revalidate = 3600;

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

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
      siteName: "Bryce Seefieldt | Portfolio",
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
    <div className="flex flex-col gap-10 pb-6">
      <ScrollFadeIn>
        <header className="flex flex-col gap-3">
          <LabelTag>{`CASE FILE / ${project.slug.toUpperCase()}`}</LabelTag>
          <h1 className="type-h1 text-ink">{project.title}</h1>
          <p className="text-ink-muted max-w-3xl text-sm">{project.summary}</p>

          <BadgeGroup project={project} />

          <div className="flex flex-wrap gap-2">
            {project.repoUrl ? (
              <ControlButton href={project.repoUrl} external>
                REPO
              </ControlButton>
            ) : null}
            {project.demoUrl ? (
              <ControlButton href={project.demoUrl} external>
                DEMO
              </ControlButton>
            ) : null}
            <ControlButton href="/projects">BACK TO PROJECTS</ControlButton>
          </div>
        </header>
      </ScrollFadeIn>

      {isGoldStandard ? (
        <>
          <ScrollFadeIn delay={60}>
            <section className="space-y-4">
              <LabelTag>MODULE 00 / WHAT THIS PROVES</LabelTag>
              <h2 className="type-h2 text-ink">Project capability profile.</h2>
              <Panel label="CARD / WHAT THIS PROVES" variant="default">
                <div className="grid gap-4 md:grid-cols-2">
                  <Panel label="SIGNAL / TECHNICAL COMPETENCY" variant="inset" showRivets={false}>
                    <h3 className="text-ink text-base font-medium">Technical competency</h3>
                    <ul className="text-ink-muted mt-2 space-y-1 text-sm">
                      <li>• Next.js 15+ (App Router, React Server Components)</li>
                      <li>• TypeScript 5+ (strict mode)</li>
                      <li>• Tailwind CSS 4 (responsive design)</li>
                      <li>• Evidence-first UX</li>
                    </ul>
                  </Panel>

                  <Panel label="SIGNAL / ENGINEERING DISCIPLINE" variant="inset" showRivets={false}>
                    <h3 className="text-ink text-base font-medium">Engineering discipline</h3>
                    <ul className="text-ink-muted mt-2 space-y-1 text-sm">
                      <li>• CI quality gates (lint, format, typecheck, secrets scan)</li>
                      <li>• Automated smoke testing (Playwright)</li>
                      <li>• Frozen lockfile builds (determinism)</li>
                      <li>• PR-only merge discipline</li>
                    </ul>
                  </Panel>

                  <Panel label="SIGNAL / SECURITY AWARENESS" variant="inset" showRivets={false}>
                    <h3 className="text-ink text-base font-medium">Security awareness</h3>
                    <ul className="text-ink-muted mt-2 space-y-1 text-sm">
                      <li>• Public-safe by design (no secrets)</li>
                      <li>• CodeQL + Dependabot (supply chain)</li>
                      <li>• Least-privilege CI permissions</li>
                      <li>• Secrets incident response runbook</li>
                    </ul>
                  </Panel>

                  <Panel label="SIGNAL / OPERATIONAL MATURITY" variant="inset" showRivets={false}>
                    <h3 className="text-ink text-base font-medium">Operational maturity</h3>
                    <ul className="text-ink-muted mt-2 space-y-1 text-sm">
                      <li>• Deploy/rollback runbooks</li>
                      <li>• CI triage procedures</li>
                      <li>• Vercel promotion gating</li>
                      <li>• Evidence-based release notes</li>
                    </ul>
                  </Panel>
                </div>
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={120}>
            <section className="space-y-4">
              <LabelTag>MODULE 01 / EVIDENCE ARTIFACTS</LabelTag>
              <h2 className="type-h2 text-ink">Inspectable evidence trail.</h2>
              <Panel label="CARD / EVIDENCE ARTIFACTS" variant="default">
                <EvidenceBlock project={project} />
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={180}>
            <section className="space-y-4">
              <LabelTag>MODULE 02 / VERIFICATION</LabelTag>
              <h2 className="type-h2 text-ink">Five-minute verification checklist.</h2>
              <Panel label="CARD / VERIFICATION CHECKLIST" variant="default">
                <Callout type="info">
                  The following checklist allows a reviewer to verify gold standard claims in &lt; 5
                  minutes without running local builds.
                </Callout>

                <div className="mt-4 space-y-3">
                  <Panel label="CHECK / QUALITY GATES" variant="inset" showRivets={false}>
                    <p className="text-ink-muted mb-3 text-sm">
                      Confirm required CI jobs for quality, secrets scan, build/test, and CodeQL.
                    </p>
                    <ControlButton href={githubUrl("blob/main/.github/workflows/ci.yml")} external>
                      OPEN CI WORKFLOW
                    </ControlButton>
                  </Panel>

                  <Panel label="CHECK / PR DISCIPLINE" variant="inset" showRivets={false}>
                    <p className="text-ink-muted mb-3 text-sm">
                      Confirm branch protection is configured for PR reviews plus required status
                      checks.
                    </p>
                    <ControlButton href={githubUrl("settings/branches")} external>
                      OPEN BRANCH PROTECTION
                    </ControlButton>
                  </Panel>

                  <Panel label="CHECK / PUBLIC SAFETY" variant="inset" showRivets={false}>
                    <p className="text-ink-muted mb-3 text-sm">
                      Validate public-safe publication rules and secret-handling constraints.
                    </p>
                    <ControlButton
                      href={docsUrl("/docs/projects/portfolio-app/04-security#public-safety-rules")}
                      external
                    >
                      OPEN SAFETY RULES
                    </ControlButton>
                  </Panel>

                  <Panel label="CHECK / SMOKE TESTS" variant="inset" showRivets={false}>
                    <p className="text-ink-muted mb-3 text-sm">
                      Inspect recent GitHub Actions runs and confirm Playwright smoke tests pass.
                    </p>
                    <ControlButton href={githubUrl("actions")} external>
                      OPEN ACTIONS
                    </ControlButton>
                  </Panel>

                  <Panel label="CHECK / DEPENDENCIES" variant="inset" showRivets={false}>
                    <p className="text-ink-muted mb-3 text-sm">
                      Verify stack versions in package metadata (Next, React, Tailwind, TypeScript).
                    </p>
                    <ControlButton href={githubUrl("blob/main/package.json")} external>
                      OPEN PACKAGE.JSON
                    </ControlButton>
                  </Panel>
                </div>
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={220}>
            <section className="space-y-4">
              <LabelTag>MODULE 03 / TECH STACK</LabelTag>
              <h2 className="type-h2 text-ink">Runtime stack snapshot.</h2>
              <Panel label="CARD / TECH STACK" variant="default">
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
                    <LabelTag key={tech}>{tech}</LabelTag>
                  ))}
                </div>
              </Panel>
            </section>
          </ScrollFadeIn>
        </>
      ) : (
        <>
          <ScrollFadeIn delay={60}>
            <section className="space-y-4">
              <LabelTag>MODULE 00 / WHAT THIS PROVES</LabelTag>
              <h2 className="type-h2 text-ink">Project proof checklist.</h2>
              <Panel label="CARD / WHAT THIS PROVES" variant="default">
                <ul className="text-ink-muted list-disc space-y-2 pl-5 text-sm">
                  <li>Clear technical scope, boundaries, and design rationale.</li>
                  <li>Enterprise SDLC posture: PR discipline and CI quality gates.</li>
                  <li>Security-aware delivery: threat modeling and safe-publication rules.</li>
                  <li>Operational readiness: deploy/rollback/triage procedures where relevant.</li>
                </ul>
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={120}>
            <section className="space-y-4">
              <LabelTag>MODULE 01 / EVIDENCE ARTIFACTS</LabelTag>
              <h2 className="type-h2 text-ink">Inspectable evidence trail.</h2>
              <Panel label="CARD / EVIDENCE ARTIFACTS" variant="default">
                <EvidenceBlock project={project} />
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={180}>
            <section className="space-y-4">
              <LabelTag>MODULE 02 / VERIFICATION</LabelTag>
              <h2 className="type-h2 text-ink">Operational verification notes.</h2>
              <Panel label="CARD / VERIFICATION" variant="default">
                <div className="text-ink-muted space-y-2 text-sm">
                  <p>
                    This page is intentionally structured to scale: project data will move into a
                    validated registry, and evidence links will remain stable. Long-form technical
                    details and operational artifacts live in the Documentation App to preserve a
                    clean front-of-house experience.
                  </p>
                  <p>
                    Next step: replace placeholder proof statements with project-specific evidence
                    and add diagrams/screenshots where public-safe.
                  </p>
                </div>
              </Panel>
            </section>
          </ScrollFadeIn>

          <ScrollFadeIn delay={220}>
            <section className="space-y-4">
              <LabelTag>MODULE 03 / TECH STACK</LabelTag>
              <h2 className="type-h2 text-ink">Current stack markers.</h2>
              <Panel label="CARD / TECH STACK" variant="default">
                <div className="flex flex-wrap gap-2">
                  {(project.tags?.length ? project.tags : ["Documentation in progress"]).map(
                    (tag) => (
                      <LabelTag key={`${project.slug}-${tag}`}>{tag}</LabelTag>
                    ),
                  )}
                </div>
              </Panel>
            </section>
          </ScrollFadeIn>
        </>
      )}
    </div>
  );
}

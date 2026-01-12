// src/app/projects/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { getProjectBySlug } from "@/data/projects";
import { docsUrl } from "@/lib/config";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return notFound();

  const evidence = project.evidence;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          <Link className="underline hover:text-zinc-950 dark:hover:text-white" href="/projects">
            Projects
          </Link>{" "}
          <span className="text-zinc-400 dark:text-zinc-600">/</span> {project.title}
        </div>

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

      <Section
        title="Evidence links"
        subtitle="Deep artifacts live in the Documentation App (Docusaurus)."
      >
        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {evidence?.dossierPath ? (
            <li>
              Dossier:{" "}
              <a className="underline" href={docsUrl(evidence.dossierPath)}>
                open dossier
              </a>
            </li>
          ) : (
            <li className="text-zinc-500 dark:text-zinc-400">Dossier: (not yet published)</li>
          )}

          {evidence?.threatModelPath ? (
            <li>
              Threat model:{" "}
              <a className="underline" href={docsUrl(evidence.threatModelPath)}>
                open threat model
              </a>
            </li>
          ) : null}

          {evidence?.adrIndexPath ? (
            <li>
              ADRs:{" "}
              <a className="underline" href={docsUrl(evidence.adrIndexPath)}>
                open ADR index
              </a>
            </li>
          ) : null}

          {evidence?.runbooksPath ? (
            <li>
              Runbooks:{" "}
              <a className="underline" href={docsUrl(evidence.runbooksPath)}>
                open runbooks
              </a>
            </li>
          ) : null}
        </ul>
      </Section>

      <Section
        title="Technical summary (first-pass)"
        subtitle="Keep this concise; link to dossiers for depth."
      >
        <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            This page is intentionally structured to scale: project data will move into a validated
            registry, and evidence links will remain stable. Long-form technical details and
            operational artifacts live in the Documentation App to preserve a clean front-of-house
            experience.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Next step: replace placeholder proof statements with project-specific evidence and add
            diagrams/screenshots where public-safe.
          </p>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link className="underline" href="/projects">
          Back to projects
        </Link>
      </div>
    </div>
  );
}

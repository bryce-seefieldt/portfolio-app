// src/data/projects.ts
//
// Minimal project registry placeholder.
// This intentionally starts small and static so the app can scale cleanly later.
// Do not store secrets or sensitive/internal data here.

import { DOCS_BASE_URL, DOCS_GITHUB_URL, GITHUB_URL } from "@/lib/config";

export type EvidenceLinks = {
  dossierPath?: string; // Docusaurus path relative to DOCS_BASE_URL, e.g. "projects/portfolio-app/"
  threatModelPath?: string; // e.g. "security/threat-models/portfolio-app-threat-model"
  adrIndexPath?: string; // e.g. "architecture/adr/"
  runbooksPath?: string; // e.g. "operations/runbooks/"
};

export type Project = {
  slug: string; // stable URL slug
  title: string;
  summary: string; // 1–2 lines, reviewer-friendly
  tags: string[]; // used later for filtering
  status: "featured" | "active" | "archived" | "planned";
  repoUrl?: string;
  demoUrl?: string;
  evidence?: EvidenceLinks;
};

export const PROJECTS: Project[] = [
  {
    slug: "portfolio-app",
    title: "Portfolio App (Next.js + TypeScript)",
    summary:
      "Production-quality portfolio application designed to be reviewed like a real service (CI gates, release governance, security posture).",
    tags: ["TypeScript", "Next.js", "Vercel", "CI/CD", "Security", "Docs-as-code"],
    status: "featured",
    repoUrl: GITHUB_URL || undefined,
    demoUrl: undefined, // Will be set once production domain is finalized
    evidence: {
      dossierPath: "projects/portfolio-app/",
      threatModelPath: "security/threat-models/portfolio-app-threat-model",
      adrIndexPath: "architecture/adr/",
      runbooksPath: "operations/runbooks/",
    },
  },
  {
    slug: "portfolio-docs-app",
    title: "Portfolio Documentation App (Docusaurus Evidence Engine)",
    summary:
      "Enterprise documentation platform hosting dossiers, ADRs, threat models, runbooks, and release notes for the portfolio program.",
    tags: ["Docusaurus", "Docs-as-code", "Vercel", "Governance", "Operations"],
    status: "featured",
    repoUrl: DOCS_GITHUB_URL || undefined,
    demoUrl: DOCS_BASE_URL || undefined,
    evidence: {
      dossierPath: "projects/portfolio-docs-app/",
      adrIndexPath: "architecture/adr/",
      runbooksPath: "operations/runbooks/",
    },
  },
];

// Helpers

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.status === "featured");
}

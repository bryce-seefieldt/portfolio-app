// src/lib/registry.ts
//
// YAML-backed project registry with Zod validation and helper functions.
// - Single source of truth for portfolio projects
// - Validates at load time (fail fast during build)
// Load environment variables when running standalone (not through Next.js)
if (typeof process !== "undefined" && !process.env.NEXT_RUNTIME) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config({ path: ".env.local" });
}

import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { z } from "zod";
import { docsUrl } from "@/lib/config";

// ----- Schemas -----

// ----- Placeholder Interpolation -----

/**
 * Interpolate environment variable placeholders in strings.
 * Supports: {GITHUB_URL}, {DOCS_GITHUB_URL}, {DOCS_BASE_URL}, {SITE_URL}
 * Returns null if placeholder can't be resolved or result is empty.
 */
function interpolate(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;

  // Read from process.env directly for better reliability with tsx/node
  const DOCS_BASE_URL =
    process.env.NEXT_PUBLIC_DOCS_BASE_URL?.trim()?.replace(/\/+$/, "") || "/docs";
  const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL?.trim()?.replace(/\/+$/, "") || "";
  const DOCS_GITHUB_URL =
    process.env.NEXT_PUBLIC_DOCS_GITHUB_URL?.trim()?.replace(/\/+$/, "") || "";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") || "";

  const result = value
    .replace(/\{GITHUB_URL\}/g, GITHUB_URL)
    .replace(/\{DOCS_GITHUB_URL\}/g, DOCS_GITHUB_URL)
    .replace(/\{DOCS_BASE_URL\}/g, DOCS_BASE_URL)
    .replace(/\{SITE_URL\}/g, SITE_URL);

  // Return null if result is empty or still contains unresolved placeholders
  if (!result || result.trim() === "" || result.includes("{")) {
    return null;
  }

  return result;
}

// ----- Schemas -----

export const TechStackItemSchema = z
  .object({
    name: z.string().min(1),
    category: z.enum(["language", "framework", "library", "tool", "platform"]),
    rationale: z.string().min(1).optional(),
  })
  .strict();

export type TechStackItem = z.infer<typeof TechStackItemSchema>;

export const EvidenceLinkItemSchema = z
  .object({
    title: z.string().min(1),
    url: z.string().min(1),
  })
  .strict();

export type EvidenceLinkItem = z.infer<typeof EvidenceLinkItemSchema>;

export const EvidenceLinksSchema = z
  .object({
    dossierPath: z.string().min(1).optional(),
    threatModelPath: z.string().min(1).optional(),
    adrIndexPath: z.string().min(1).optional(),
    runbooksPath: z.string().min(1).optional(),
    adr: z.array(EvidenceLinkItemSchema).optional(),
    runbooks: z.array(EvidenceLinkItemSchema).optional(),
    github: z.string().url().nullable().optional(),
  })
  .strict();

export type EvidenceLinks = z.infer<typeof EvidenceLinksSchema>;

export const ProjectSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, "slug must be lowercase, hyphenated, no spaces"),
    title: z.string().min(3),
    summary: z.string().min(10),
    category: z
      .enum(["fullstack", "frontend", "backend", "devops", "data", "mobile", "other"])
      .optional(),
    tags: z.array(z.string().min(1)).min(1),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/u, "startDate must be YYYY-MM format")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/u, "endDate must be YYYY-MM format")
      .optional(),
    ongoing: z.boolean().optional(),
    status: z.enum(["featured", "active", "archived", "planned"]).default("active"),
    techStack: z.array(TechStackItemSchema).min(1).optional(),
    keyProofs: z.array(z.string().min(1)).min(1).optional(),
    repoUrl: z.string().url().nullable().optional(),
    demoUrl: z.string().url().nullable().optional(),
    evidence: EvidenceLinksSchema.optional(),
    isGoldStandard: z.boolean().optional(),
    goldStandardReason: z.string().min(10).optional(),
  })
  .strict();

export type Project = z.infer<typeof ProjectSchema>;
type RegistryArray = Array<z.infer<typeof ProjectSchema>>;
type RegistryWithMeta = {
  metadata?: { version: number; lastUpdated: string };
  projects: RegistryArray;
};

type RegistryInput = RegistryArray | RegistryWithMeta;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRegistryInput(input: unknown): unknown[] {
  // Accept either an array of projects or an object with { metadata, projects }
  // Extract raw projects without validation (validation happens after interpolation)
  if (Array.isArray(input)) {
    return input;
  }
  if (typeof input === "object" && input !== null && "projects" in input) {
    const obj = input as { projects?: unknown };
    if (Array.isArray(obj.projects)) {
      return obj.projects;
    }
  }
  throw new Error(`Invalid registry format. Expected array or { metadata, projects } object.`);
}

// ----- Loader -----

let cachedProjects: Project[] | null = null;

/** Absolute path to the YAML registry file. */
function registryPath(): string {
  return path.join(process.cwd(), "src", "data", "projects.yml");
}

/**
 * Load and validate the project registry from YAML.
 * Result is cached for the lifetime of the Node process.
 */
export function loadProjectRegistry(): Project[] {
  if (cachedProjects) return cachedProjects;
  const filePath = registryPath();
  if (!fs.existsSync(filePath)) {
    throw new Error(`Project registry not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw) as RegistryInput;
  const projects = parseRegistryInput(parsed).map((p) => {
    if (!isRecord(p)) {
      throw new Error("Invalid project entry: expected object");
    }

    const evidence = isRecord(p.evidence) ? p.evidence : undefined;

    // Interpolate placeholders before validation
    const interpolated = {
      ...p,
      repoUrl: interpolate(p.repoUrl as string | null | undefined),
      demoUrl: interpolate(p.demoUrl as string | null | undefined),
      evidence: evidence
        ? {
            ...evidence,
            github: interpolate(evidence.github as string | null | undefined),
          }
        : undefined,
    };

    return ProjectSchema.parse(interpolated);
  });

  // Enforce slug uniqueness
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) {
      throw new Error(`Duplicate slug detected in registry: ${p.slug}`);
    }
    seen.add(p.slug);
  }

  cachedProjects = projects;
  return projects;
}

// ----- Helpers -----

export function getAllProjects(): Project[] {
  return loadProjectRegistry();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loadProjectRegistry().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return loadProjectRegistry().filter((p) => p.status === "featured");
}

export function evidenceLinks(project: Project): {
  dossier?: string;
  threatModel?: string;
  adrs?: string;
  runbooks?: string;
} {
  const e = project.evidence;
  return {
    dossier: e?.dossierPath ? docsUrl(e.dossierPath) : undefined,
    threatModel: e?.threatModelPath ? docsUrl(e.threatModelPath) : undefined,
    adrs: e?.adrIndexPath ? docsUrl(e.adrIndexPath) : undefined,
    runbooks: e?.runbooksPath ? docsUrl(e.runbooksPath) : undefined,
  };
}

/**
 * Validate evidence links follow expected patterns.
 * Returns array of validation warnings (non-blocking).
 */
export function validateEvidenceLinks(project: Project): string[] {
  const warnings: string[] = [];
  const e = project.evidence;
  if (!e) return warnings;

  // Check dossier path pattern
  if (
    e.dossierPath &&
    !e.dossierPath.startsWith("projects/") &&
    !e.dossierPath.startsWith("docs/60-projects/")
  ) {
    warnings.push(
      `[${project.slug}] dossierPath should start with 'projects/' or 'docs/60-projects/'`,
    );
  }

  // Check threat model pattern
  if (e.threatModelPath && !e.threatModelPath.includes("threat-model")) {
    warnings.push(`[${project.slug}] threatModelPath should include 'threat-model'`);
  }

  // Validate ADR array URLs
  if (e.adr) {
    for (const item of e.adr) {
      if (!item.url.startsWith("docs/") && !item.url.startsWith("http")) {
        warnings.push(
          `[${project.slug}] ADR url '${item.url}' should start with 'docs/' or be absolute`,
        );
      }
    }
  }

  // Validate runbook array URLs
  if (e.runbooks) {
    for (const item of e.runbooks) {
      if (!item.url.startsWith("docs/") && !item.url.startsWith("http")) {
        warnings.push(
          `[${project.slug}] Runbook url '${item.url}' should start with 'docs/' or be absolute`,
        );
      }
    }
  }

  return warnings;
}

// ----- CLI entrypoint -----

export function runRegistryCli(
  arg: string = "",
  overrides?: {
    loadProjectRegistry?: typeof loadProjectRegistry;
    evidenceLinks?: typeof evidenceLinks;
    validateEvidenceLinks?: typeof validateEvidenceLinks;
  },
): number {
  try {
    const loader = overrides?.loadProjectRegistry ?? loadProjectRegistry;
    const buildLinks = overrides?.evidenceLinks ?? evidenceLinks;
    const validator = overrides?.validateEvidenceLinks ?? validateEvidenceLinks;
    const projects = loader();
    if (arg === "--list") {
      for (const p of projects) {
        console.log(`${p.slug}\t${p.title}`);
      }
      return 0;
    }
    // Default / --validate
    // Do a shallow evidence link materialization check
    const allWarnings: string[] = [];
    for (const p of projects) {
      void buildLinks(p); // Ensure no throw
      const warnings = validator(p);
      allWarnings.push(...warnings);
    }
    if (allWarnings.length > 0) {
      console.warn("⚠️  Evidence link warnings:");
      for (const w of allWarnings) {
        console.warn(`  ${w}`);
      }
    }
    console.log(`Registry OK (projects: ${projects.length})`);
    return 0;
  } catch (err) {
    console.error(
      "Registry validation failed:\n",
      err instanceof Error ? err.message : String(err),
    );
    return 1;
  }
}

if (require.main === module) {
  const arg = process.argv[2] || "";
  process.exit(runRegistryCli(arg));
}

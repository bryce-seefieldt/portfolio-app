// src/lib/registry.ts
//
// YAML-backed project registry with Zod validation and helper functions.
// - Single source of truth for portfolio projects
// - Validates at load time (fail fast during build)

import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { z } from "zod";
import { docsUrl } from "@/lib/config";

// ----- Schemas -----

export const EvidenceLinksSchema = z
  .object({
    dossierPath: z.string().min(1).optional(),
    threatModelPath: z.string().min(1).optional(),
    adrIndexPath: z.string().min(1).optional(),
    runbooksPath: z.string().min(1).optional(),
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
    tags: z.array(z.string().min(1)).min(1),
    status: z.enum(["featured", "active", "archived", "planned"]).default("active"),
    repoUrl: z.string().url().nullable().optional(),
    demoUrl: z.string().url().nullable().optional(),
    evidence: EvidenceLinksSchema.optional(),
  })
  .strict();

export type Project = z.infer<typeof ProjectSchema>;

const RegistryArraySchema = z.array(ProjectSchema);

const RegistryWithMetaSchema = z
  .object({
    metadata: z
      .object({
        version: z.number().int().positive(),
        lastUpdated: z.string().min(4),
      })
      .strict()
      .optional(),
    projects: z.array(ProjectSchema),
  })
  .strict();

type RegistryInput = z.infer<typeof RegistryArraySchema> | z.infer<typeof RegistryWithMetaSchema>;

function parseRegistryInput(input: unknown): Project[] {
  // Accept either an array of projects or an object with { metadata, projects }
  const asWithMeta = RegistryWithMetaSchema.safeParse(input);
  if (asWithMeta.success) return asWithMeta.data.projects;
  const asArray = RegistryArraySchema.safeParse(input);
  if (asArray.success) return asArray.data;
  // If neither schema matches, throw the more informative error message
  const sample = JSON.stringify(input, null, 2).slice(0, 2000);
  throw new Error(`Invalid registry format. Expected array or { metadata, projects } object.\nSample: ${sample}`);
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
  const projects = parseRegistryInput(parsed).map((p) => ProjectSchema.parse(p));

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

// ----- CLI entrypoint -----

if (require.main === module) {
  const arg = process.argv[2] || "";
  try {
    const projects = loadProjectRegistry();
    if (arg === "--list") {
      for (const p of projects) {
        console.log(`${p.slug}\t${p.title}`);
      }
      process.exit(0);
    }
    // Default / --validate
    // Do a shallow evidence link materialization check
    for (const p of projects) {
      void evidenceLinks(p); // Ensure no throw
    }
    console.log(`Registry OK (projects: ${projects.length})`);
    process.exit(0);
  } catch (err) {
    console.error("Registry validation failed:\n", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

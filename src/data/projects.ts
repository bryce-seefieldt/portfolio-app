// src/data/projects.ts
//
// Export projects from the YAML-backed registry with validation.
// Do not store secrets or sensitive/internal data here.

import type { Project } from "@/lib/registry";
import {
  getAllProjects as _getAll,
  getProjectBySlug as _bySlug,
  getFeaturedProjects as _featured,
} from "@/lib/registry";

export type { Project };

export const PROJECTS: Project[] = _getAll();

export function getProjectBySlug(slug: string): Project | undefined {
  return _bySlug(slug);
}

export function getFeaturedProjects(): Project[] {
  return _featured();
}

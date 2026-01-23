// src/components/BadgeGroup.tsx

import type { Project } from "@/lib/registry";
import { VerificationBadge } from "./VerificationBadge";

/**
 * BadgeGroup Component
 *
 * Conditionally renders multiple evidence badges based on project data.
 * Analyzes project.evidence structure to determine which badges to display.
 *
 * Badge Logic:
 * - gold-standard: Shows if project.isGoldStandard === true
 * - docs-available: Shows if project.evidence.dossierPath exists
 * - threat-model: Shows if project.evidence.threatModelPath exists
 * - adr-complete: Shows if project.evidence.adr array has items
 */

export interface BadgeGroupProps {
  project: Project;
  className?: string;
}

export function BadgeGroup({ project, className = "" }: BadgeGroupProps) {
  const badges: Array<{
    type: "docs-available" | "threat-model" | "gold-standard" | "adr-complete";
    title?: string;
  }> = [];

  // Gold Standard badge (highest priority)
  if (project.isGoldStandard) {
    badges.push({
      type: "gold-standard",
      title: "Comprehensive Phase 2 completion with full enterprise SDLC posture",
    });
  }

  // Docs Available badge
  if (project.evidence?.dossierPath) {
    badges.push({
      type: "docs-available",
      title: "Project dossier with comprehensive documentation",
    });
  }

  // Threat Model badge
  if (project.evidence?.threatModelPath) {
    badges.push({
      type: "threat-model",
      title: "STRIDE security analysis available",
    });
  }

  // ADR Complete badge
  if (project.evidence?.adr && project.evidence.adr.length > 0) {
    badges.push({
      type: "adr-complete",
      title: `${project.evidence.adr.length} architecture decision record(s)`,
    });
  }

  // Return null if no badges to display
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {badges.map((badge) => (
        <VerificationBadge key={badge.type} type={badge.type} title={badge.title} />
      ))}
    </div>
  );
}

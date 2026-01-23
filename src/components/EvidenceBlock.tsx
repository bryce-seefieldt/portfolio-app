// src/components/EvidenceBlock.tsx

import type { Project } from "@/lib/registry";
import { docsUrl } from "@/lib/config";

/**
 * EvidenceBlock Component
 *
 * Displays project evidence artifacts in a responsive grid layout.
 * Renders 5 evidence categories with links to documentation and source code.
 *
 * Categories:
 * 1. Dossier - Comprehensive project documentation
 * 2. Threat Model - STRIDE security analysis
 * 3. Architecture Decisions - ADR records
 * 4. Runbooks - Operational procedures
 * 5. GitHub Repository - Source code
 *
 * Layout: Responsive grid (1 col mobile → 2 col tablet → 3 col desktop)
 * Empty states: Placeholder cards with muted styling for unavailable evidence
 */

export interface EvidenceBlockProps {
  project: Project;
  className?: string;
}

interface EvidenceCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  available: boolean;
}

export function EvidenceBlock({ project, className = "" }: EvidenceBlockProps) {
  const evidence = project.evidence;

  // Evidence categories configuration
  const categories: EvidenceCategory[] = [
    // 1. Dossier
    {
      title: "Project Dossier",
      description: "Comprehensive documentation",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      available: !!evidence?.dossierPath,
      content: evidence?.dossierPath ? (
        <a
          className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          href={docsUrl(`/docs/${evidence.dossierPath}`)}
        >
          View Dossier →
        </a>
      ) : (
        <span className="text-sm text-zinc-400 dark:text-zinc-600">Not available yet</span>
      ),
    },

    // 2. Threat Model
    {
      title: "Threat Model",
      description: "STRIDE security analysis",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      available: !!evidence?.threatModelPath,
      content: evidence?.threatModelPath ? (
        <a
          className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          href={docsUrl(`/docs/${evidence.threatModelPath}`)}
        >
          View Threat Model →
        </a>
      ) : (
        <span className="text-sm text-zinc-400 dark:text-zinc-600">Not available yet</span>
      ),
    },

    // 3. Architecture Decisions
    {
      title: "Architecture Decisions",
      description: "ADR decision records",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      available: !!(evidence?.adr && evidence.adr.length > 0) || !!evidence?.adrIndexPath,
      content:
        evidence?.adr && evidence.adr.length > 0 ? (
          <div className="flex flex-col gap-1">
            {evidence.adr.map((adr, index) => (
              <a
                key={index}
                className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                href={docsUrl(`/${adr.url}`)}
              >
                {adr.title} →
              </a>
            ))}
          </div>
        ) : evidence?.adrIndexPath ? (
          <a
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            href={docsUrl(`/docs/${evidence.adrIndexPath}`)}
          >
            View ADR Index →
          </a>
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-600">Not available yet</span>
        ),
    },

    // 4. Runbooks
    {
      title: "Operational Runbooks",
      description: "Deploy, rollback, triage",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      available: !!(evidence?.runbooks && evidence.runbooks.length > 0) || !!evidence?.runbooksPath,
      content:
        evidence?.runbooks && evidence.runbooks.length > 0 ? (
          <div className="flex flex-col gap-1">
            {evidence.runbooks.map((runbook, index) => (
              <a
                key={index}
                className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                href={docsUrl(`/${runbook.url}`)}
              >
                {runbook.title} →
              </a>
            ))}
          </div>
        ) : evidence?.runbooksPath ? (
          <a
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            href={docsUrl(`/docs/${evidence.runbooksPath}`)}
          >
            View Runbooks →
          </a>
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-600">Not available yet</span>
        ),
    },

    // 5. GitHub Repository
    {
      title: "Source Code",
      description: "View on GitHub",
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      available: !!(project.repoUrl || evidence?.github),
      content:
        project.repoUrl || evidence?.github ? (
          <a
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            href={project.repoUrl || evidence?.github || "#"}
          >
            View Repository →
          </a>
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-600">Not available yet</span>
        ),
    },
  ];

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`flex flex-col gap-3 rounded-lg border bg-white p-4 dark:bg-zinc-900 ${
            category.available
              ? "border-zinc-200 dark:border-zinc-800"
              : "border-zinc-200 opacity-50 dark:border-zinc-800"
          }`}
        >
          {/* Icon + Title */}
          <div className="flex items-center gap-2">
            <div className="text-zinc-600 dark:text-zinc-400">{category.icon}</div>
            <h3 className="font-medium text-zinc-900 dark:text-white">{category.title}</h3>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{category.description}</p>

          {/* Links / Content */}
          <div className="mt-auto">{category.content}</div>
        </div>
      ))}
    </div>
  );
}

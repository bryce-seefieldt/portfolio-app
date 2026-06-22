// src/components/VerificationBadge.tsx

/**
 * VerificationBadge Component
 *
 * Displays a status indicator badge for evidence artifacts with icon and label.
 * Supports multiple badge types with consistent Tailwind styling and dark mode.
 *
 * Badge Types:
 * - docs-available: Blue theme, document icon
 * - threat-model: Purple theme, shield icon
 * - gold-standard: Amber theme, check-circle icon
 * - adr-complete: Green theme, archive icon
 */

export type BadgeType = "docs-available" | "threat-model" | "gold-standard" | "adr-complete";

export interface VerificationBadgeProps {
  type: BadgeType;
  title?: string; // Optional tooltip text
}

export function VerificationBadge({ type, title }: VerificationBadgeProps) {
  const config = getBadgeConfig(type);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${config.colorClasses}`}
      title={title}
    >
      {config.icon}
      {config.label}
    </div>
  );
}

function getBadgeConfig(type: BadgeType): {
  label: string;
  icon: React.ReactNode;
  colorClasses: string;
} {
  switch (type) {
    case "docs-available":
      return {
        label: "Docs Available",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        colorClasses:
          "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100",
      };
    case "threat-model":
      return {
        label: "Threat Model",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
        colorClasses:
          "border-purple-500 bg-purple-50 text-purple-900 dark:border-purple-400 dark:bg-purple-950 dark:text-purple-100",
      };
    case "gold-standard":
      return {
        label: "Gold Standard",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        colorClasses:
          "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100",
      };
    case "adr-complete":
      return {
        label: "ADR Complete",
        icon: (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        ),
        colorClasses:
          "border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950 dark:text-green-100",
      };
  }
}

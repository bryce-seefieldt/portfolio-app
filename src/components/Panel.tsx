import type { ReactNode } from "react";

type PanelVariant = "default" | "inset";

interface PanelProps {
  children: ReactNode;
  label?: string;
  variant?: PanelVariant;
  showRivets?: boolean;
  className?: string;
}

const rivetPositions = [
  "left-2 top-2",
  "right-2 top-2",
  "left-2 bottom-2",
  "right-2 bottom-2",
] as const;

export function Panel({
  children,
  label,
  variant = "default",
  showRivets = true,
  className = "",
}: PanelProps) {
  const variantClass = variant === "inset" ? "bg-surface-2" : "bg-surface";

  return (
    <section
      className={`border-line text-ink relative rounded-md border px-5 pt-6 pb-5 ${variantClass} ${className}`.trim()}
    >
      {label ? <div className="type-label text-ink-muted mb-4">{label}</div> : null}

      {showRivets
        ? rivetPositions.map((position) => (
            <span
              key={position}
              className={`pointer-events-none absolute ${position}`}
              aria-hidden="true"
            >
              <svg width="6" height="6" viewBox="0 0 6 6" className="text-rivet" aria-hidden="true">
                <circle cx="3" cy="3" r="2" fill="currentColor" />
              </svg>
            </span>
          ))
        : null}

      {children}
    </section>
  );
}

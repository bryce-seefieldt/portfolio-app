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
  const panelStyle =
    variant === "default"
      ? {
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 18%, rgba(255, 255, 255, 0.02) 42%, transparent 70%), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px 6px)",
          boxShadow:
            "inset 1px 1px 0 rgba(255, 255, 255, 0.08), inset -1px -1px 0 rgba(0, 0, 0, 0.34), 0 16px 28px rgba(0, 0, 0, 0.16), 0 5px 12px rgba(0, 0, 0, 0.2)",
        }
      : {
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 18%, transparent 48%)",
          boxShadow:
            "inset 2px 2px 3px rgba(0, 0, 0, 0.28), inset -1px -1px 0 rgba(255, 255, 255, 0.05), inset 0 10px 20px rgba(0, 0, 0, 0.14)",
        };
  const rivetStyle = {
    background:
      "radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.18) 18%, color-mix(in srgb, var(--rivet) 92%, transparent) 48%, color-mix(in srgb, var(--rivet) 65%, black) 78%, color-mix(in srgb, var(--rivet) 40%, black) 100%)",
    boxShadow:
      "inset -1px -1px 1px rgba(255, 255, 255, 0.18), inset 1.5px 1.5px 2px rgba(0, 0, 0, 0.4), 0.75px 1.25px 1.5px rgba(0, 0, 0, 0.35)",
  } as const;

  return (
    <section
      className={`border-line text-ink relative rounded-md border px-5 pt-6 pb-5 ${variantClass} ${className}`.trim()}
      style={panelStyle}
    >
      {label ? <div className="type-label text-ink-muted mb-4">{label}</div> : null}

      {showRivets
        ? rivetPositions.map((position) => (
            <span
              key={position}
              className={`pointer-events-none absolute ${position} h-3 w-3 rounded-full`}
              aria-hidden="true"
              style={rivetStyle}
            >
              <span
                className="absolute top-0.5 left-0.5 h-0.5 w-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}
              />
            </span>
          ))
        : null}

      {children}
    </section>
  );
}

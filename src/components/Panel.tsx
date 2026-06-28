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
            "linear-gradient(135deg, color-mix(in srgb, white 22%, transparent) 0%, color-mix(in srgb, white 10%, transparent) 24%, color-mix(in srgb, white 3%, transparent) 48%, transparent 72%), repeating-linear-gradient(135deg, color-mix(in srgb, white 2%, transparent) 0 1px, transparent 1px 6px)",
          boxShadow:
            "inset 0 2px 0 var(--depth-edge-highlight), inset 0 -2px 0 var(--depth-edge-shadow), var(--depth-cast-shadow), var(--depth-lift-halo)",
        }
      : {
          backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, white 10%, transparent) 0%, color-mix(in srgb, white 3%, transparent) 20%, transparent 50%)",
          boxShadow:
            "inset 0 3px 0 var(--depth-inset-shell-highlight), inset 0 -4px 0 var(--depth-inset-shell-shadow), inset 0 10px 20px rgba(0, 0, 0, 0.22)",
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

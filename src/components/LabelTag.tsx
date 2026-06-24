import type { ReactNode } from "react";

type LabelTagTone = "default" | "accent" | "warn";

interface LabelTagProps {
  children: ReactNode;
  tone?: LabelTagTone;
  className?: string;
}

function getToneClasses(tone: LabelTagTone): string {
  switch (tone) {
    case "accent":
      return "border-accent text-accent bg-transparent";
    case "warn":
      return "border-accent-warn text-accent-warn bg-transparent";
    default:
      return "border-line text-ink-muted bg-transparent";
  }
}

export function LabelTag({ children, tone = "default", className = "" }: LabelTagProps) {
  return (
    <span
      className={`type-label inline-flex items-center rounded-md border px-2 py-1 ${getToneClasses(tone)} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

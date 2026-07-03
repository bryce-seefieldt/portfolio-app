import type { CSSProperties } from "react";
import { LOGO_REGISTRY } from "@/icons/logo-registry";

interface KeycapLegendProps {
  id: string;
}

export function KeycapLegend({ id }: KeycapLegendProps) {
  const entry = Object.values(LOGO_REGISTRY).find((candidate) => candidate.id === id);

  if (!entry) {
    return <span aria-hidden className="obl__legend--text">?</span>;
  }

  const style = { "--legend-scale": entry.opticalScale } as CSSProperties;

  if (entry.tier === "text") {
    return (
      <span aria-hidden className="obl__legend--text" style={style}>
        {entry.text ?? entry.label}
      </span>
    );
  }

  if (entry.tier === "mask") {
    return (
      <span
        aria-hidden
        className="obl__legend--mask"
        style={{ ...style, "--logo": `url(${entry.asset ?? ""})` } as CSSProperties}
      />
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" style={style}>
      <path d={entry.asset ?? ""} />
    </svg>
  );
}

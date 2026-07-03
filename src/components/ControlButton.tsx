import Link from "next/link";
import { ObliqueSurface } from "@/components/ObliqueSurface";
import type { ReactNode } from "react";
import type { CSSProperties } from "react";

interface ControlButtonProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}

export function ControlButton({
  href,
  children,
  external = false,
  className = "",
}: ControlButtonProps) {
  const wrapperClassName = `control-button ${className}`.trim();
  const isCompact = className.includes("control-button--compact");
  const surfaceStyle = {
    "--topw": isCompact ? "5.4rem" : "7.1rem",
    "--toph": isCompact ? "1.75rem" : "2.1rem",
    "--radius": "8px",
    "--obl-depth": "4px",
    "--obl-lean": "3px",
    "--obl-taper": "0.06",
  } as CSSProperties;

  if (external) {
    return (
      <ObliqueSurface
        className={wrapperClassName}
        capClassName="control-button__cap"
        capColor="var(--surface-2)"
        legendColor="var(--ink)"
        legend={children}
        style={surfaceStyle}
        renderCap={({ className: capClassName, children: capChildren }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className={capClassName}>
            {capChildren}
          </a>
        )}
      />
    );
  }

  return (
    <ObliqueSurface
      className={wrapperClassName}
      capClassName="control-button__cap"
      capColor="var(--surface-2)"
      legendColor="var(--ink)"
      legend={children}
      style={surfaceStyle}
      renderCap={({ className: capClassName, children: capChildren }) => (
        <Link href={href} className={capClassName}>
          {capChildren}
        </Link>
      )}
    />
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

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
  const baseClassName = `control-button type-label ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      {children}
    </Link>
  );
}

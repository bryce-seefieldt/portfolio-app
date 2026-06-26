"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ControlButton } from "./ControlButton";
import { ThemeToggle } from "./ThemeToggle";
import { DOCS_BASE_URL, GITHUB_BASE_URL } from "@/lib/config";

/**
 * NavigationEnhanced Component
 *
 * Enhanced sticky navigation header with:
 * - Sticky positioning on scroll with visual feedback
 * - Theme toggle integration
 * - Smooth transitions and animations
 *
 * Design decisions:
 * - Sticky header improves discoverability (industry standard)
 * - Shadow on scroll provides visual feedback of sticky state
 * - One-click theme toggle for accessibility
 */

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="control-button control-button--compact type-label"
    >
      {children}
    </Link>
  );
}

export function NavigationEnhanced() {
  const [isScrolled, setIsScrolled] = useState(false);
  const githubHref = GITHUB_BASE_URL ?? "https://github.com/bryce-seefieldt";

  // Detect scroll for visual feedback (shadow on scroll)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`control-strip sticky top-0 z-50 w-full transition-shadow duration-200 ${
        isScrolled ? "shadow-[0_10px_22px_rgba(0,0,0,0.28)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-ink text-lg font-semibold tracking-tight">
            Bryce Seefieldt
          </span>
          <span className="type-label text-ink-muted mt-1">Full-Stack Developer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex flex-wrap items-center gap-2 lg:justify-end">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/projects">Work</NavLink>
          <NavLink href="/cv">CV</NavLink>
          <ControlButton href={DOCS_BASE_URL} external className="control-button--compact">
            Docs
          </ControlButton>
          <NavLink href="/contact">Contact</NavLink>
          <ControlButton href={githubHref} external className="control-button--compact">
            GitHub
          </ControlButton>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

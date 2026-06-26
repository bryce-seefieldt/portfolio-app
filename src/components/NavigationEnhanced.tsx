"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ControlButton } from "./ControlButton";
import { ThemeToggle } from "./ThemeToggle";
import { DOCS_BASE_URL, GITHUB_BASE_URL } from "@/lib/config";

/**
 * NavigationEnhanced Component
 *
 * Enhanced sticky navigation header with:
 * - Sticky positioning on scroll with visual feedback
 * - Mobile-responsive hamburger menu
 * - Theme toggle integration
 * - Smooth transitions and animations
 * - Keyboard accessible navigation
 *
 * Design decisions:
 * - Sticky header improves discoverability (industry standard)
 * - Mobile hamburger menu for space efficiency on small screens
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`control-strip sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled ? "shadow-[0_10px_22px_rgba(0,0,0,0.28)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none" onClick={closeMobileMenu}>
          <span className="font-display text-ink text-lg font-semibold tracking-tight">
            Bryce Seefieldt
          </span>
          <span className="type-label text-ink-muted mt-1">Full-Stack Developer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
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
          {/* TO DO: Add search button here in the future, currently disabled as search is not implemented. */}
          {/* <button
            type="button"
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Search (coming soon)"
            title="Search (coming soon)"
            disabled
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </button> */}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="control-button control-button--compact md:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            // X icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-line bg-surface mt-2 border-t md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4">
            <NavLink href="/" onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink href="/projects" onClick={closeMobileMenu}>
              Work
            </NavLink>
            <NavLink href="/cv" onClick={closeMobileMenu}>
              CV
            </NavLink>
            <ControlButton
              href={DOCS_BASE_URL}
              external
              className="control-button--compact justify-center"
            >
              Docs
            </ControlButton>
            <NavLink href="/contact" onClick={closeMobileMenu}>
              Contact
            </NavLink>
            <ControlButton
              href={githubHref}
              external
              className="control-button--compact justify-center"
            >
              GitHub
            </ControlButton>

            <div className="mt-2 flex items-center gap-2">
              <span className="type-label text-ink-muted">Theme</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { DOCS_BASE_URL, GITHUB_URL } from "@/lib/config";

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
      className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export function NavigationEnhanced() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      className={`sticky top-0 z-50 border-b border-zinc-200 bg-white transition-shadow duration-200 dark:border-zinc-800 dark:bg-zinc-950 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="font-semibold tracking-tight" onClick={closeMobileMenu}>
          Portfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/cv">CV</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <a
            href={DOCS_BASE_URL}
            className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
          >
            Evidence (Docs)
          </a>
          <NavLink href="/contact">Contact</NavLink>
          {GITHUB_URL ? (
            <a
              href={GITHUB_URL}
              className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              GitHub
            </a>
          ) : null}
          <button
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
          </button>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 transition-colors hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
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
        <div className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4">
            <NavLink href="/" onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink href="/cv" onClick={closeMobileMenu}>
              CV
            </NavLink>
            <NavLink href="/projects" onClick={closeMobileMenu}>
              Projects
            </NavLink>
            <a
              href={DOCS_BASE_URL}
              className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              onClick={closeMobileMenu}
            >
              Evidence (Docs)
            </a>
            <NavLink href="/contact" onClick={closeMobileMenu}>
              Contact
            </NavLink>
            {GITHUB_URL ? (
              <a
                href={GITHUB_URL}
                className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                onClick={closeMobileMenu}
              >
                GitHub
              </a>
            ) : null}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Theme:</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

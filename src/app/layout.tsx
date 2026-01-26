// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { DOCS_BASE_URL, GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/lib/config";

/**
 * Viewport configuration for responsive rendering optimization.
 * Ensures proper device scaling and responsive behavior across all screen sizes.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description:
    "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).",
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL || "/",
    siteName: "Portfolio",
    title: "Portfolio",
    description:
      "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description:
      "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).",
  },
};

function TopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              Portfolio
            </Link>

            <nav className="flex items-center gap-4">
              <TopNavLink href="/cv">CV</TopNavLink>
              <TopNavLink href="/projects">Projects</TopNavLink>
              <a
                href={DOCS_BASE_URL}
                className="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Evidence (Docs)
              </a>
              <TopNavLink href="/contact">Contact</TopNavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-wrap items-center gap-3">
              {GITHUB_URL ? (
                <a className="hover:text-zinc-950 dark:hover:text-white" href={GITHUB_URL}>
                  GitHub
                </a>
              ) : null}
              {LINKEDIN_URL ? (
                <a className="hover:text-zinc-950 dark:hover:text-white" href={LINKEDIN_URL}>
                  LinkedIn
                </a>
              ) : null}
              <a className="hover:text-zinc-950 dark:hover:text-white" href={DOCS_BASE_URL}>
                Documentation (Evidence)
              </a>
            </div>
            <div>
              This site is built with an enterprise evidence model: ADRs, threat models, runbooks,
              and release notes are maintained in the Documentation App.
            </div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NavigationEnhanced } from "@/components/NavigationEnhanced";
import { BackToTop } from "@/components/BackToTop";
import { headers } from "next/headers";
import "./globals.css";

import { DOCS_BASE_URL, GITHUB_URL, LINKEDIN_URL, SITE_URL } from "@/lib/config";
import {
  generatePersonSchema,
  generateWebsiteSchema,
  formatSchemaAsScript,
} from "@/lib/structured-data";

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
  alternates: {
    canonical: SITE_URL || "/",
  },
  keywords: [
    "full-stack engineer",
    "portfolio",
    "Next.js",
    "TypeScript",
    "DevOps",
    "software engineering",
    "enterprise architecture",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL || "/",
    siteName: "Portfolio",
    title: "Portfolio",
    description:
      "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Portfolio — enterprise-grade full-stack engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description:
      "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).",
    images: ["/og-image.svg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme initialization script: runs before paint to prevent flash of wrong theme.
            This ensures the correct theme is applied immediately on page load,
            preventing a visible flash when the page loads in the wrong theme.
            Uses stored preference or system preference as fallback. */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: formatSchemaAsScript(generatePersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: formatSchemaAsScript(generateWebsiteSchema()),
          }}
        />
      </head>
      <body className="min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <NavigationEnhanced />

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
        <BackToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

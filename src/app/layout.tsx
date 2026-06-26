import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { NavigationEnhanced } from "@/components/NavigationEnhanced";
import { BackToTop } from "@/components/BackToTop";
import { headers } from "next/headers";
import "./globals.css";

import { DOCS_BASE_URL, GITHUB_BASE_URL, LINKEDIN_URL, SITE_URL } from "@/lib/config";
import {
  generatePersonSchema,
  generateWebsiteSchema,
  formatSchemaAsScript,
} from "@/lib/structured-data";

const APP_TITLE = "Bryce Seefieldt | Portfolio";
const APP_DESCRIPTION =
  "Enterprise-grade full-stack portfolio: interactive CV, verified projects, and engineering evidence (ADRs, threat models, runbooks).";
const OG_IMAGE = "/og-image.svg";
const FALLBACK_GITHUB_URL = "https://github.com/bryce-seefieldt";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description: APP_DESCRIPTION,
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
    siteName: APP_TITLE,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Bryce Seefieldt | Full-Stack Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await headers();
  const githubHref = GITHUB_BASE_URL ?? FALLBACK_GITHUB_URL;
  const jsonLdScripts = [generatePersonSchema(), generateWebsiteSchema()];

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Theme initialization script: runs before paint to prevent flash of wrong theme.
            This ensures the correct theme is applied immediately on page load,
            preventing a visible flash when the page loads in the wrong theme.
            Uses stored preference or system preference as fallback. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{const saved=localStorage.getItem('theme');const isLight=saved==='light';if(isLight){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();",
          }}
        />

        {/* JSON-LD Structured Data for SEO */}
        {jsonLdScripts.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: formatSchemaAsScript(schema) }}
          ></script>
        ))}
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-body min-h-dvh`}
      >
        <NavigationEnhanced />

        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        <footer className="px-4 pb-8">
          <div className="footer-inset mx-auto flex max-w-5xl flex-col gap-4 rounded-md px-4 py-6 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <a
                className="control-link"
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              {LINKEDIN_URL ? (
                <a
                  className="control-link"
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
              <a
                className="control-link"
                href={DOCS_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Engineering Docs
              </a>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-ink">Bryce Seefieldt · Full-Stack Developer · Toronto, Canada</p>
              <p className="text-ink-muted">
                Built with Next.js, TypeScript, and Tailwind. Inspect the source on GitHub.
              </p>
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

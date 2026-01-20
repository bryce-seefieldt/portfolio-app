// src/lib/config.ts
//
// Centralized, public-safe runtime configuration for the Portfolio App.
// Notes:
// - Only values prefixed with NEXT_PUBLIC_ are safe to expose to the client.
// - Do not add secrets here. Treat this file as client-readable.

type Env = {
  // Public-facing
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_DOCS_BASE_URL?: string;

  // Optional public links
  NEXT_PUBLIC_GITHUB_URL?: string;
  NEXT_PUBLIC_DOCS_GITHUB_URL?: string;
  NEXT_PUBLIC_LINKEDIN_URL?: string;
  NEXT_PUBLIC_CONTACT_EMAIL?: string;

  // Environment hint (Vercel commonly provides this)
  VERCEL_ENV?: "production" | "preview" | "development";
};

const env = process.env as Env;

/**
 * Best-effort helper to normalize URLs (no trailing slash).
 */
function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Best-effort helper to validate absolute URLs.
 * Falls back to `null` if not a valid absolute URL.
 */
function asAbsoluteUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

/**
 * Public site URL (optional). If not set, we do not guess a production domain.
 * Use for generating absolute metadata URLs or canonical links when desired.
 *
 * Examples:
 * - https://yourdomain.com
 * - https://portfolio.yourdomain.com
 */
export const SITE_URL: string | null = asAbsoluteUrl(env.NEXT_PUBLIC_SITE_URL);

/**
 * Documentation base URL (strongly recommended).
 * Supports either:
 * - docs path on same domain (e.g., https://yourdomain.com/docs)
 * - docs subdomain (e.g., https://docs.yourdomain.com)
 *
 * For local dev, you may leave this unset and it will default to "/docs".
 */
export const DOCS_BASE_URL: string = normalizeBaseUrl(
  env.NEXT_PUBLIC_DOCS_BASE_URL?.trim() || "/docs",
);

/**
 * Public profile links (optional). Prefer these over hardcoding URLs in components.
 */
export const GITHUB_URL: string | null = asAbsoluteUrl(env.NEXT_PUBLIC_GITHUB_URL);
export const DOCS_GITHUB_URL: string | null = asAbsoluteUrl(env.NEXT_PUBLIC_DOCS_GITHUB_URL);
export const LINKEDIN_URL: string | null = asAbsoluteUrl(env.NEXT_PUBLIC_LINKEDIN_URL);

/**
 * Optional public contact email (kept explicit; do not invent defaults).
 * If unset, prefer linking to LinkedIn/GitHub.
 */
export const CONTACT_EMAIL: string | null = env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;

/**
 * Runtime environment hint. Useful for showing non-sensitive banners or diagnostics.
 */
export const DEPLOY_ENV: Env["VERCEL_ENV"] = env.VERCEL_ENV;

/**
 * Convenience builders
 */
export function docsUrl(pathname: string): string {
  // Accept "foo/bar", "/foo/bar", or "".
  const p = pathname.replace(/^\/+/, "");
  return p ? `${DOCS_BASE_URL}/${p}` : DOCS_BASE_URL;
}

export function githubUrl(pathname: string): string {
  // Build URL from GITHUB_URL with optional path
  if (!GITHUB_URL) {
    console.warn("GITHUB_URL not configured, returning placeholder");
    return "#";
  }
  const p = pathname.replace(/^\/+/, "");
  return p ? `${GITHUB_URL}/${p}` : GITHUB_URL;
}

export function docsGithubUrl(pathname: string): string {
  // Build URL from DOCS_GITHUB_URL with optional path
  if (!DOCS_GITHUB_URL) {
    console.warn("DOCS_GITHUB_URL not configured, returning placeholder");
    return "#";
  }
  const p = pathname.replace(/^\/+/, "");
  return p ? `${DOCS_GITHUB_URL}/${p}` : DOCS_GITHUB_URL;
}

export function mailtoUrl(email: string, subject?: string): string {
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${s}`;
}

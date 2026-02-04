import Link from "next/link";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { DOCS_BASE_URL, docsUrl } from "@/lib/config";
import { log } from "@/lib/observability";

/**
 * Custom 404 Not Found Page
 *
 * Displayed when a route doesn't exist.
 * Logs 404 occurrences for monitoring broken links and user navigation patterns.
 * Uses ScrollFadeIn for smooth visual effect and provides helpful navigation links.
 */
export default function NotFound() {
  // Log 404 for monitoring (helps identify broken links)
  if (typeof window !== "undefined") {
    log({
      level: "warn",
      message: "404 Not Found",
      context: {
        route: window.location.pathname,
        referrer: document.referrer || "direct",
      },
    });
  }

  return (
    <ScrollFadeIn>
      <div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
        <div>
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <p className="mt-4 text-2xl font-semibold">Page not found</p>
        </div>

        <p className="max-w-lg text-zinc-600 dark:text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Projects
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left text-sm sm:grid-cols-4">
          <Link
            href="/"
            className="rounded-lg p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <div className="font-semibold">Home</div>
            <div className="text-zinc-600 dark:text-zinc-400">Back to the main page</div>
          </Link>
          <Link
            href="/cv"
            className="rounded-lg p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <div className="font-semibold">CV</div>
            <div className="text-zinc-600 dark:text-zinc-400">View my experience</div>
          </Link>
          <Link
            href="/projects"
            className="rounded-lg p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <div className="font-semibold">Projects</div>
            <div className="text-zinc-600 dark:text-zinc-400">Browse my work</div>
          </Link>
          <a
            href={DOCS_BASE_URL}
            className="rounded-lg p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <div className="font-semibold">Docs</div>
            <div className="text-zinc-600 dark:text-zinc-400">Evidence documentation</div>
          </a>
          <a
            href={docsUrl("portfolio/reviewer-guide")}
            className="rounded-lg p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <div className="font-semibold">Reviewer guide</div>
            <div className="text-zinc-600 dark:text-zinc-400">Fast validation path</div>
          </a>
        </div>
      </div>
    </ScrollFadeIn>
  );
}

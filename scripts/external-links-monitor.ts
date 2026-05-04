import { docsUrl } from "@/lib/config";
import { evidenceLinks, loadProjectRegistry, type Project } from "@/lib/registry";

type LinkCheckResult = {
  url: string;
  ok: boolean;
  status?: number;
  method?: "HEAD" | "GET";
  error?: string;
};

const DEFAULT_TIMEOUT_MS = Number(process.env.EXTERNAL_LINK_TIMEOUT_MS ?? "12000");
const DEFAULT_RETRIES = Number(process.env.EXTERNAL_LINK_RETRIES ?? "2");
const USER_AGENT =
  process.env.EXTERNAL_LINK_USER_AGENT ??
  "portfolio-app-external-link-monitor/1.0 (+https://github.com/bryce-seefieldt/portfolio-app)";

const FALLBACK_TO_GET_STATUSES = new Set([401, 403, 405]);
const NON_FATAL_REACHABLE_STATUSES = new Set([401, 403]);

function toAbsoluteUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function materializeEvidenceUrls(project: Project): string[] {
  const urls = new Set<string>();

  if (project.repoUrl) urls.add(project.repoUrl);
  if (project.demoUrl) urls.add(project.demoUrl);
  if (project.evidence?.github) urls.add(project.evidence.github);

  const computed = evidenceLinks(project);
  if (computed.dossier) urls.add(computed.dossier);
  if (computed.threatModel) urls.add(computed.threatModel);
  if (computed.adrs) urls.add(computed.adrs);
  if (computed.runbooks) urls.add(computed.runbooks);

  for (const adr of project.evidence?.adr ?? []) {
    urls.add(adr.url.startsWith("http") ? adr.url : docsUrl(adr.url));
  }

  for (const runbook of project.evidence?.runbooks ?? []) {
    urls.add(runbook.url.startsWith("http") ? runbook.url : docsUrl(runbook.url));
  }

  return Array.from(urls);
}

function collectExternalUrls(): { urls: string[]; skippedNonAbsolute: number } {
  const projects = loadProjectRegistry();
  const urls = new Set<string>();
  let skippedNonAbsolute = 0;

  for (const project of projects) {
    for (const candidate of materializeEvidenceUrls(project)) {
      const absolute = toAbsoluteUrl(candidate);
      if (!absolute) {
        skippedNonAbsolute += 1;
        continue;
      }
      urls.add(absolute);
    }
  }

  return {
    urls: Array.from(urls).sort((a, b) => a.localeCompare(b)),
    skippedNonAbsolute,
  };
}

function isSuccessfulStatus(status: number): boolean {
  return status < 400 || NON_FATAL_REACHABLE_STATUSES.has(status);
}

async function fetchWithMethod(url: string, method: "HEAD" | "GET"): Promise<Response> {
  return fetch(url, {
    method,
    redirect: "follow",
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
}

async function checkUrl(url: string): Promise<LinkCheckResult> {
  for (let attempt = 1; attempt <= DEFAULT_RETRIES + 1; attempt += 1) {
    try {
      const headResponse = await fetchWithMethod(url, "HEAD");

      if (isSuccessfulStatus(headResponse.status)) {
        return { url, ok: true, status: headResponse.status, method: "HEAD" };
      }

      if (FALLBACK_TO_GET_STATUSES.has(headResponse.status)) {
        const getResponse = await fetchWithMethod(url, "GET");
        if (isSuccessfulStatus(getResponse.status)) {
          return { url, ok: true, status: getResponse.status, method: "GET" };
        }

        if (attempt > DEFAULT_RETRIES || getResponse.status < 500) {
          return {
            url,
            ok: false,
            status: getResponse.status,
            method: "GET",
            error: `HTTP ${getResponse.status}`,
          };
        }
      } else if (attempt > DEFAULT_RETRIES || headResponse.status < 500) {
        return {
          url,
          ok: false,
          status: headResponse.status,
          method: "HEAD",
          error: `HTTP ${headResponse.status}`,
        };
      }
    } catch (error) {
      if (attempt > DEFAULT_RETRIES) {
        return {
          url,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  return { url, ok: false, error: "Unknown error" };
}

async function run(): Promise<number> {
  const { urls, skippedNonAbsolute } = collectExternalUrls();

  if (urls.length === 0) {
    console.log("No external URLs found in registry evidence data. Nothing to check.");
    return 0;
  }

  console.log(`Checking ${urls.length} external links from project registry evidence...`);
  if (skippedNonAbsolute > 0) {
    console.log(
      `Skipped ${skippedNonAbsolute} non-absolute URLs (expected locally when DOCS_BASE_URL is relative).`,
    );
  }
  const results: LinkCheckResult[] = [];

  for (const url of urls) {
    const result = await checkUrl(url);
    results.push(result);

    if (result.ok) {
      const via = result.method ? ` via ${result.method}` : "";
      const status = result.status ? ` (${result.status})` : "";
      console.log(`OK${status}${via}: ${url}`);
    } else {
      const detail = result.error ?? (result.status ? `HTTP ${result.status}` : "unknown failure");
      console.error(`FAIL: ${url} -> ${detail}`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;

  console.log("\nExternal link monitor summary");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.error("\nFailed URLs:");
    for (const failure of failed) {
      const detail =
        failure.error ?? (failure.status ? `HTTP ${failure.status}` : "unknown failure");
      console.error(`- ${failure.url} (${detail})`);
    }
    return 1;
  }

  return 0;
}

void run().then((code) => {
  process.exit(code);
});

---
title: "GitHub Copilot Agent Instructions — Portfolio App Repository"
description: "Comprehensive agent instructions for maintaining and evolving the Portfolio App (Next.js + TypeScript) with enterprise-grade governance, security posture, and evidence-first documentation integration."
tags: [copilot, agent, instructions, portfolio-app, governance, ci, security, docs-as-code]
---

# GitHub Copilot Agent Instructions — Portfolio App Repository

## 0) Purpose and operating constraints

You are assisting in the **Portfolio App** repository only. This is a public, production-quality portfolio site built with **Next.js (App Router) + TypeScript**. It is intentionally designed to be reviewed like a real service: clear product experience, enforceable delivery controls, and deep “engineering evidence” hosted externally in a companion **Documentation App (Docusaurus)**.

Your work must uphold the program’s enterprise-grade posture:

- **Evidence-first delivery**: the Portfolio App links to verifiable artifacts (dossiers, ADRs, threat models, runbooks, release notes) hosted in the Documentation App.
- **Governance discipline**: changes must be PR-based and must pass required CI checks before merge.
- **Public-safe security hygiene**: do not introduce secrets, sensitive internal endpoints, or private infrastructure details.
- **Operational credibility**: implement changes with deterministic builds, clear rollback paths, and documented failure modes.

If a request conflicts with these constraints, propose a compliant alternative.

---

## 1) Repository identity (what this app is)

### 1.1 What the Portfolio App does

The Portfolio App is the **front-of-house** experience:

- `/` Landing page: reviewer path + evidence links
- `/cv`: Interactive CV skeleton
- `/projects`: Project list
- `/projects/[slug]`: Project detail (evidence-first standard shape)
- `/contact`: Static contact surface (no backend form; no auth)

### 1.2 What the Portfolio App does NOT do (unless explicitly planned)

- No authentication
- No contact form backend (mailto / static links only)
- No private content or hidden routes
- No secrets, tokens, or private infrastructure configuration

---

## 2) Architecture overview (what to understand first)

Before proposing changes, review and internalize the existing architecture and conventions:

### 2.1 Key app files

- `src/lib/config.ts`
  - **Public-safe configuration** and URL builders (`DOCS_BASE_URL`, `docsUrl()`, `mailtoUrl()`)
  - **All client-exposed config must be `NEXT_PUBLIC_*` only**
- `src/lib/registry.ts`
  - Zod-validated registry loader for YAML data with env placeholder interpolation
  - Supports `{GITHUB_URL}`, `{DOCS_BASE_URL}`, `{DOCS_GITHUB_URL}`, `{SITE_URL}` → resolved from `NEXT_PUBLIC_*`
- `src/data/projects.yml`
  - Canonical project registry (validated by `pnpm registry:validate`)
  - Evidence links (dossier, ADR index, threat model, runbooks, repo) must be present when available
- `src/data/projects.ts`
  - Re-exports loaded registry data for use in pages/components
- `src/app/layout.tsx`
  - global layout + navigation
- `src/app/page.tsx`
  - evidence-first landing page

### 2.2 Conventions

- Use the import alias `@/*` for internal imports (configured in `tsconfig.json`).
- Keep route pages simple and reviewer-focused. Deep technical details belong in the Documentation App.
- Prefer small, composable components under `src/components/`.
- Follow the code commentary standard: https://bns-portfolio-docs.vercel.app/docs/engineering/commentary-standard (examples: https://bns-portfolio-docs.vercel.app/docs/reference/commentary-examples).

**Phase status:** Phase 3 Stages 3.1–3.3 are complete (registry, evidence components, unit/E2E coverage integrated into CI); Stage 3.4 documentation alignment is next.

---

## 3) Public-safe security rules (non-negotiable)

### 3.1 Secrets and sensitive information

You must never:

- commit secrets (API keys, tokens, passwords, private URLs)
- add internal/private endpoints or infrastructure hostnames
- add telemetry or analytics that exfiltrates user data without explicit approval and documentation

### 3.2 Environment variables

- Anything prefixed with `NEXT_PUBLIC_` is client-exposed.
- Only non-sensitive values belong in `NEXT_PUBLIC_*` vars.
- Local dev uses `.env.local` (not committed).
- The repo commits `.env.example` only.

### 3.3 Dependencies

- Avoid introducing new dependencies without clear benefit.
- Any dependency addition must be justified in the PR description and should not expand attack surface unnecessarily.

### 3.4 React2Shell hardening guardrails

- Treat React/Next.js as a backend surface; never deserialize untrusted payloads into rich objects.
- All mutation endpoints must validate input with Zod and reject unknown shapes.
- Use CSRF protection and rate limiting on any non-idempotent routes.
- Inline scripts must include CSP nonces; do not reintroduce `unsafe-inline` for scripts.
- Do not add generic "execute" or dynamic evaluation helpers.

---

## 4) Delivery governance and CI gates

### 4.1 Required checks (do not break these)

The following GitHub checks are required for merge and must remain stable:

- `ci / quality`
- `ci / test`
- `ci / build`

**Do not rename**:

- the GitHub Actions workflow name `ci`
- the job names `quality`, `test`, and `build` (or their displayed names)

If a change would rename or re-scope these checks, you must:

- treat it as a governance-breaking change
- propose an ADR update and coordinated updates to branch rulesets and Vercel promotion checks (once enabled)

### 4.2 Deterministic installs

CI installs must use:

- `pnpm install --frozen-lockfile`

Lockfile changes must be committed intentionally and reviewed in PRs.

### 4.3 Local quality contract (must stay valid)

These commands must continue to work and be referenced in PR “Evidence”:

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm build`

Linting uses ESLint CLI (not `next lint`).

Formatting uses Prettier with an ESM config (`prettier.config.mjs`) to support ESM plugins.

### 4.4 PR discipline

All changes go through PRs (even solo). PRs must include:

- summary (what changed)
- rationale (why)
- evidence (commands/checks)
- security note (“no secrets added”)
- documentation impact assessment (what needs updating)

Use `.github/pull_request_template.md`.

### 4.5 Issue closure via PRs

- Include a closing keyword in the PR description when the PR should close an issue on merge to `main` (e.g., `Closes #123`, `Fixes #123`, `Resolves #123`).
- For multiple issues: list each on its own line with a closing keyword.
- If multiple PRs relate to the same issue: only the PR targeting `main` should auto-close; use non-closing phrasing (`Refs #123`) in supporting PRs.
- After merge, verify the issue closed; otherwise close manually with a brief note.

### 4.6 Documentation updates required when CI or verification changes

**Mandatory:** When making changes to CI workflows or local verification processes, you MUST update the following files in the same PR:

**README.md updates required when:**

- Adding/removing/renaming CI jobs (`.github/workflows/ci.yml` or `.github/workflows/*.yml`)
  - Update: "Governance (Implemented)" section → Required CI checks list
  - Update: "Deployment" section → GitHub Deployment Checks list
- Adding/removing/changing local verification steps (`scripts/verify-local.sh` or `pnpm verify` behavior)
  - Update: "Full verification" step-by-step list (steps 1-10)
  - Update: "Quick verification" description
- Adding/removing pnpm scripts related to quality/testing/validation
  - Update: "Available scripts reference" section → appropriate subsection
  - Update: "Pre-deploy checklist" if script is part of verification
- Changing verification command names or parameters
  - Update: All references to the command throughout README.md

**scripts/verify-local.sh updates required when:**

- Adding/removing/changing verification steps in the local development workflow
  - Add: New step section with appropriate print_section, command execution, success/failure handling
  - Remove: Obsolete step sections
  - Update: Step numbers and descriptions to maintain sequential flow (Step 1, Step 2, etc.)
- Adding/removing pnpm scripts that should be run during local verification
  - Add: Execution block with appropriate error handling and troubleshooting guidance
  - Update: Summary section to reflect new check count
- Changing verification tools or their invocation (e.g., new linter, test framework)
  - Update: Tool version checks in "Environment Check" section
  - Update: Troubleshooting guidance for the affected step
- Adding new validation gates (e.g., new registry validation, link checking)
  - Add: Dedicated step section with detailed output parsing and error messages
  - Update: "Next steps" guidance in summary if gate is pre-commit requirement

**PULL_REQUEST_TEMPLATE.md updates required when:**

- Adding/removing/renaming CI jobs or changing job names displayed in GitHub UI
  - Update: "CI Status" checklist section → add/remove/rename checkbox with job description
- Changing CI job dependencies or execution order
  - Update: Job descriptions in parentheses (e.g., "depends on quality, test, link-validation")
- Adding new CI-only gates (like `secrets-scan` being PR-only)
  - Update: Add note about when job runs (e.g., "PR-only gate")

**Validation before merge:**

- Verify README.md "Governance" section lists all current required CI jobs
- Verify README.md verification steps match actual `pnpm verify` behavior
- Verify PULL_REQUEST_TEMPLATE.md CI Status checklist matches `.github/workflows/ci.yml` jobs
- Confirm script references in README match `package.json` scripts
- Verify scripts/verify-local.sh steps match README.md "Full verification" list and `pnpm verify` execution

**Failure to update these files will cause:**

- Contributor confusion (documentation doesn't match reality)
- PR template checklist drift (missing/outdated CI jobs)
- Onboarding friction (new contributors follow outdated steps)
- Evidence gaps in PRs (checklist doesn't cover all required checks)
- Local verification script drift (developers run outdated checks)

**Example:** If you add a new `ci / security-scan` job:

1. Update README.md:
   - Add `ci / security-scan` to "Required CI checks" list in Governance section
   - Add to Deployment "GitHub Deployment Checks" list
   - Add to "Full verification" step list (e.g., "Step 6: Security scan")
2. Update PULL_REQUEST_TEMPLATE.md:
   - Add `- [ ] \`ci / security-scan\` passed (description)` to CI Status section
3. Update scripts/verify-local.sh:
   - Add Step 6 section with `pnpm security:scan` execution
   - Add error handling and troubleshooting guidance
   - Update step numbers for subsequent steps (old Step 6 → Step 7, etc.)

---

## 5) Issue and planning templates

### When to create GitHub issues

All work in portfolio-app should be tracked as issues (unless it's a hot-fix or tiny refactor that's already in an issue).

### Phase-based work (Stage X.Y implementation)

When implementing a **Phase Stage**, use **Phase Stage App Issue** template:

- **Template:** Located in `portfolio-docs/docs/_meta/templates/template-phase-stage-app-issue.md`
- **Usage:** Create issue using this template in `portfolio-app` repository
- **Title format:** `Stage X.Y: [Stage Title] — App Implementation`
- **Key sections to fill:**
  - Overview and objectives
  - Design specifications (schema, API signatures)
  - Files to create/update
  - Implementation tasks (broken into phases)
  - Testing strategy (unit, integration, E2E)
  - Acceptance criteria
  - Linked companion docs issue
- **Post-merge:** Reference this issue in PR with `Closes #[issue-number]`

**Example phase stage issue:**

- Title: `Stage 3.1: Data-Driven Project Registry — App Implementation`
- Companion: `Stage 3.1: Data-Driven Project Registry — Documentation` (in portfolio-docs)

### Standalone work (non-phase issues)

For work **NOT tied to a phase stage**, use **Generic GitHub Issue** template:

- **Template:** Located in `portfolio-docs/docs/_meta/templates/template-github-issue-generic.md`
- **Usage:** Copy template when creating new issue
- **Types supported:** Bug, Feature, Enhancement, Documentation, Refactoring, Maintenance, Other
- **Sections to fill:** Adapt to issue type (use relevant sections only)
- **Examples:**
  - `Bug: Fix contact form email validation` (generic issue)
  - `Refactor: Extract CV fetching logic` (generic issue)
  - `Fix: Broken link in projects page` (generic issue)

### Cross-repository coordination

When phase work spans both repositories:

1. Create both issues (app + docs)
2. Link them together in "Related Issues"
3. Reference app issue in app PRs (`Closes #X`)
4. Reference docs issue in docs PRs (`Closes #Y`)
5. Verify both PRs merged before marking phase stage complete

**Reference:** See [Template Usage Guide](https://bns-portfolio-docs.vercel.app/docs/_meta/templates) for full details on all templates.

---

## 6) Branch protection (GitHub Rulesets)

The `main` branch is protected using GitHub **Rulesets** (not classic branch protection).

Rulesets enforce at minimum:

- PR required before merge
- required checks: `ci / quality` and `ci / build`
- block force-push
- prevent deletion
- require conversation resolution (recommended)

If work requires temporarily adjusting protections, propose a documented exception and immediate restoration.

---

## 7) Documentation integration (evidence-first model)

### 7.1 The Documentation App is the evidence engine

The Portfolio App must link to evidence artifacts hosted in Docusaurus via `DOCS_BASE_URL`.

- Use `docsUrl("path")` to build links.
- Evidence paths should be stable and maintained in `src/data/projects.ts` where possible.

### 7.2 What belongs in Portfolio App vs Docs App

- Portfolio App: concise, user-facing summaries, navigation, and entry points
- Documentation App: deep technical content (ADRs, threat models, runbooks, dossiers, diagrams, release notes)

Do not copy deep operational or security content into the Portfolio App. Link to it.

### 7.3 URL linking strategy (required for all documentation links)

When linking to Portfolio Documentation, use environment variables to ensure portability and correctness:

#### Links to rendered Docusaurus pages (`/portfolio/portfolio-docs/docs/*`)

Use `NEXT_PUBLIC_DOCS_BASE_URL` to construct links to published docs.

**Rules:**

- Prefix: `NEXT_PUBLIC_DOCS_BASE_URL` (replaces the base `/portfolio/portfolio-docs/docs/` path)
- Path: start with `docs/` then the documentation path
- **Do NOT include** section prefix numbers (e.g., use `portfolio` not `00-portfolio`)
- **Do NOT include** `.md` file extension
- Append path components with `/` (not `.`)

**Examples:**

- ✅ `NEXT_PUBLIC_DOCS_BASE_URL + "docs/portfolio/roadmap"` → `https://bns-portfolio-docs.vercel.app/docs/portfolio/roadmap`
- ✅ `docsUrl("portfolio/architecture")` (use the helper function)
- ❌ `NEXT_PUBLIC_DOCS_BASE_URL + "docs/00-portfolio/roadmap.md"` (wrong prefix + extension)
- ❌ `NEXT_PUBLIC_DOCS_BASE_URL + "portfolio.roadmap"` (wrong separator)

#### Links to non-rendered portfolio-docs files (configuration, CI, etc.)

Use `NEXT_PUBLIC_DOCS_GITHUB_URL` for files NOT under `/portfolio/portfolio-docs/docs/`:

**Rules:**

- Prefix: `NEXT_PUBLIC_DOCS_GITHUB_URL + "blob/main/"`
- Path: relative from `/portfolio/portfolio-docs/` root
- **DO include** file extensions (`.md`, `.yml`, `.ts`, etc.)

**Examples:**

- ✅ `NEXT_PUBLIC_DOCS_GITHUB_URL + "blob/main/package.json"` → `https://github.com/bryce-seefieldt/portfolio-docs/blob/main/package.json`
- ✅ `NEXT_PUBLIC_DOCS_GITHUB_URL + "blob/main/docusaurus.config.ts"`
- ✅ `NEXT_PUBLIC_DOCS_GITHUB_URL + "blob/main/.github/workflows/ci.yml"`
- ❌ `NEXT_PUBLIC_DOCS_GITHUB_URL + "package.json"` (missing `/blob/main/` prefix)

#### Links to portfolio-app repository files

Use full GitHub URLs for non-rendered files in portfolio-app:

**Rules:**

- Format: `https://github.com/bryce-seefieldt/portfolio-app/blob/main/<path>`
- Include file extensions
- Use for: CI workflows, config files, source not meant to be viewed as docs

**Examples:**

- ✅ `https://github.com/bryce-seefieldt/portfolio-app/blob/main/.github/workflows/ci.yml`
- ✅ `https://github.com/bryce-seefieldt/portfolio-app/blob/main/src/lib/config.ts`

#### Diagram standard when proposing docs changes

- If you add/update diagrams in `portfolio-docs/docs/`, use **Mermaid code blocks only** (no PNG/SVG/ASCII/external tools)
- Fence with ` ```mermaid ` blocks and include a brief caption explaining the diagram
- Keep diagrams focused and readable; test rendering locally in the docs repo (`pnpm build && pnpm serve`)

### 6.4 Environment variable contract

Ensure these `NEXT_PUBLIC_*` variables are defined (checked in CI):

```typescript
// .env.example
NEXT_PUBLIC_DOCS_BASE_URL=https://bns-portfolio-docs.vercel.app/docs/
NEXT_PUBLIC_DOCS_GITHUB_URL=https://github.com/bryce-seefieldt/portfolio-docs/
NEXT_PUBLIC_GITHUB_URL=https://github.com/bryce-seefieldt/portfolio-app
NEXT_PUBLIC_SITE_URL=https://bns-portfolio.vercel.app/
```

### 6.5 Documentation updates expectation

When you make changes that materially affect behavior/architecture:

## 7) Content strategy (portfolio-grade writing standards)

### 7.1 Tone and structure

- Write like an engineer communicating to a hiring panel.
- Avoid marketing language and filler.
- Prefer:
  - explicit claims tied to evidence links
  - short, structured sections
  - reviewer instructions (“how to evaluate”)

### 7.2 Evidence link patterns

Every major claim should have an evidence path:

- dossier
- ADR
- threat model
- runbooks
- roadmap

---

## 8) Phase 3 Implementation Patterns

This section documents architectural and code patterns established in Phase 3 Stages 3.1–3.3. Use these as reference for all subsequent feature work in Portfolio App.

### 8.1 Data-Driven Registry Pattern (Stage 3.1)

**Decision reference:** [ADR-0011: Data-Driven Project Registry](/docs/10-architecture/adr/adr-0011-data-driven-project-registry.md)

**Core pattern:**

- Projects are defined in `src/data/projects.yml` (YAML format)
- Schema is validated by Zod in `src/lib/registry.ts` at build time
- Typing is exported via `src/data/projects.ts` for use in components
- Environment variables interpolate URLs at build time: `{GITHUB_URL}`, `{DOCS_BASE_URL}`, `{DOCS_GITHUB_URL}`, `{SITE_URL}`

**When to use this pattern:**

- Adding a new project? Edit `projects.yml` and add dossier links. Do not modify code.
- Extending project schema? Update Zod schema in `registry.ts`, add tests, update schema guide in docs.
- Adding new evidence category? Update schema, add placeholder in `projects.yml`, reference in components.

**Schema validation (non-negotiable):**

```yaml
- slug: lowercase-hyphenated-id (required, unique across all projects)
  title: Human-readable title (required)
  summary: Proof-focused summary (required, ≥10 chars)
  category: [fullstack | frontend | backend | devops | data | mobile | other] (optional)
  tags: [Technology1, Technology2] (required, array)
  status: [featured | active | archived | planned] (required)
  evidence:
    dossierPath: projects/example/  (optional, path in /docs/)
    threatModelPath: security/threat-models/example  (optional)
    adrIndexPath: architecture/adr/  (optional)
    runbooksPath: operations/runbooks/  (optional)
    github: "{GITHUB_URL}/repo-name"  (optional, supports placeholders)
```

**Examples:**

```yaml
# Minimal project
- slug: sample
  title: Sample
  summary: A sample project demonstrating evidence-first methodology.
  tags: [Next.js]
  status: active

# Gold standard project (portfolio-app itself)
- slug: portfolio-app
  title: Portfolio App
  summary: Production-quality TypeScript portfolio with CI gates and evidence-first architecture.
  category: fullstack
  tags: [Next.js, TypeScript, CI/CD]
  status: featured
  evidence:
    dossierPath: projects/portfolio-app/
    threatModelPath: security/threat-models/portfolio-app-threat-model
    adrIndexPath: architecture/adr/
    runbooksPath: operations/runbooks/
    github: "{GITHUB_URL}"
  isGoldStandard: true
  goldStandardReason: Comprehensive testing, threat model, CI gates, and operational runbooks.
```

**Testing the registry:**

```bash
# Validate schema locally
pnpm registry:validate

# List all projects
pnpm registry:list

# Full verification (included in pnpm verify)
pnpm verify
```

**Build-time contract:**

When `pnpm build` runs:

1. `src/data/projects.ts` imports `projects.yml`
2. YAML parsed and placeholders interpolated
3. Zod schema validates all entries
4. Invalid entries → build failure with clear error message
5. Valid entries → typed export available to components

### 8.2 Environment-First URL Construction (Stage 3.1)

**Decision reference:** [ADR-0012: Cross-Repo Documentation Linking Strategy](/docs/10-architecture/adr/adr-0012-cross-repo-documentation-linking.md)

**Core pattern:**

URLs to external services (docs, GitHub, etc.) are resolved from environment variables at build time. This keeps the app portable across local dev, CI, staging, and production.

**Helper functions in `src/lib/config.ts`:**

```typescript
// Documentation base URL (default: /docs)
export const DOCS_BASE_URL: string;

// Constructs link to docs page
export function docsUrl(path: string): string;
// Usage: docsUrl("projects/portfolio-app") → https://docs.example.com/projects/portfolio-app

// GitHub organization URL
export const GITHUB_URL: string | null;

// Constructs link to GitHub repository
export function githubUrl(path: string): string;
// Usage: githubUrl("portfolio-app") → https://github.com/yourname/portfolio-app

// Docs repository GitHub URL
export const DOCS_GITHUB_URL: string | null;

// Constructs link to docs repo files
export function docsGithubUrl(path: string): string;
// Usage: docsGithubUrl("blob/main/package.json") → https://github.com/yourname/portfolio-docs/blob/main/package.json

// Site URL (optional)
export const SITE_URL: string | null;
```

**Environment variables (public-safe):**

```
NEXT_PUBLIC_DOCS_BASE_URL=https://docs.yourdomain.com     (or /docs for local)
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourname
NEXT_PUBLIC_DOCS_GITHUB_URL=https://github.com/yourname/portfolio-docs
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**When to use these helpers:**

- Linking to documentation pages? Use `docsUrl("path")`
- Linking to GitHub repos? Use `githubUrl("repo-name")`
- Linking to docs GitHub files? Use `docsGithubUrl("blob/main/file")`
- Hardcoding URLs? **Never**—always use helpers for portability

**Registry placeholders:**

The registry loader automatically interpolates these placeholders in `projects.yml`:

```yaml
github: "{GITHUB_URL}"
repoUrl: "{GITHUB_URL}/my-repo"
demoUrl: "{SITE_URL}/feature"
```

**Testing with environment variables:**

```bash
# Local dev (unset env vars)
NEXT_PUBLIC_DOCS_BASE_URL="" npm run build
# docsUrl() falls back to "/docs"

# Staging
NEXT_PUBLIC_DOCS_BASE_URL=https://staging-docs.example.com npm run build

# Production
NEXT_PUBLIC_DOCS_BASE_URL=https://docs.example.com npm run build
```

**Fallback behavior:**

When environment variables are unset:

- `DOCS_BASE_URL` defaults to `"/docs"` (relative path)
- `GITHUB_URL`, `DOCS_GITHUB_URL`, `SITE_URL` return `null`
- Links using these values fail gracefully in tests (placeholder `"#"`)

### 8.3 Evidence Link Construction & Testing

**Testing strategy:**

All evidence links are validated at build time AND in E2E tests:

```bash
# Build-time validation
pnpm build  # Zod validates all URLs in registry

# Unit tests (Vitest)
pnpm test:unit  # Tests link helpers with env vars set/unset

# E2E tests (Playwright)
pnpm test:e2e  # Tests that evidence links render and resolve correctly
```

**Unit test patterns:**

```typescript
import { docsUrl, githubUrl } from "@/lib/config";

describe("Link helpers", () => {
  beforeEach(() => {
    // Mock env vars for test
    process.env.NEXT_PUBLIC_DOCS_BASE_URL = "https://docs.example.com";
    process.env.NEXT_PUBLIC_GITHUB_URL = "https://github.com/testuser";
  });

  it("constructs docs URLs correctly", () => {
    expect(docsUrl("projects/portfolio")).toBe("https://docs.example.com/projects/portfolio");
  });

  it("returns placeholder when env unset", () => {
    delete process.env.NEXT_PUBLIC_GITHUB_URL;
    expect(githubUrl("repo")).toBe("#"); // Fallback for undefined env
  });
});
```

**E2E test patterns:**

```typescript
import { test, expect } from "@playwright/test";

test("evidence links resolve to docs", async ({ page }) => {
  await page.goto("/projects/portfolio-app");

  // Find evidence link
  const docLink = page.locator('a[href*="docs.example.com"]');
  await expect(docLink).toBeVisible();

  // Verify link target
  const href = await docLink.getAttribute("href");
  expect(href).toMatch(/https:\/\/docs\.example\.com\/docs\//);
});
```

### 8.4 Registry Schema Reference

Complete schema documentation: [Registry Schema Guide](/docs/70-reference/registry-schema-guide.md)

Key validation rules enforced:

- **slug:** Required; format `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase, hyphenated)
- **slug uniqueness:** Two projects cannot have the same slug (enforced by Zod)
- **title:** Required; minimum 3 characters
- **summary:** Required; minimum 10 characters (proof-focused, not marketing)
- **tags:** Required; at least one tag; each tag ≥1 character
- **status:** Required enum: `featured | active | archived | planned`
- **URLs:** Must be valid absolute URLs or null
- **Strict mode:** Schema rejects unknown fields (prevents typos)

When adding new fields to the registry schema:

1. Update Zod schema in `src/lib/registry.ts`
2. Add tests in `src/lib/__tests__/registry.test.ts`
3. Document field in [Registry Schema Guide](/docs/70-reference/registry-schema-guide.md)
4. Update dossier pages if field affects evidence/proof model
5. Reference ADRs if field changes validation semantics

### 8.5 Cross-Repository Link Examples

**Reference:** [ADR-0012: Cross-Repo Documentation Linking](/docs/10-architecture/adr/adr-0012-cross-repo-documentation-linking.md)

Linking to documentation pages:

```typescript
// Docs pages (rendered Docusaurus content)
docsUrl("portfolio/roadmap"); // → https://docs.example.com/portfolio/roadmap
docsUrl("projects/portfolio-app"); // → https://docs.example.com/projects/portfolio-app
docsUrl("security/threat-models/portfolio-app-threat-model");
docsUrl("architecture/adr/adr-0011-data-driven-project-registry");

// GitHub files in portfolio-docs repo
docsGithubUrl("blob/main/package.json");
docsGithubUrl("blob/main/.github/workflows/ci.yml");
docsGithubUrl("blob/main/docusaurus.config.ts");

// GitHub files/repos in portfolio-app repo
githubUrl("portfolio-app"); // → https://github.com/yourname/portfolio-app
githubUrl("portfolio-app/blob/main/.env.example");
githubUrl("portfolio-app/tree/main/src/lib");
```

Storing in registry:

```yaml
evidence:
  dossierPath: projects/portfolio-app/ # Rendered docs path
  threatModelPath: security/threat-models/portfolio-app-threat-model
  adrIndexPath: architecture/adr/
  adr:
    - title: "ADR-0011: Data-Driven Registry"
      url: "architecture/adr/adr-0011-data-driven-project-registry" # Relative to DOCS_BASE_URL
  runbooks:
    - title: "Deploy to Vercel"
      url: "operations/runbooks/rbk-portfolio-app-deploy"
  github: "{GITHUB_URL}/portfolio-app" # Interpolated at build time
```

---

## 9) Phase 3 Stage 3.2 — EvidenceBlock Components

### 9.1 Component Library Overview

Stage 3.2 introduces three reusable React components for standardized evidence visualization:

**`EvidenceBlock.tsx`** — Evidence card display

- Purpose: Render a grid of evidence artifact links (dossier, threat model, ADRs, runbooks, GitHub)
- Props: `project: Project`, `className?: string`
- Behavior: Displays each evidence category in a responsive grid; placeholders for unavailable categories
- Styling: Tailwind CSS with `dark:` support, `hover:` effects, rounded corners, borders

**`VerificationBadge.tsx`** — Status indicator badges

- Purpose: Display evidence completeness and project quality signals
- Props: `type: 'docs-available' | 'threat-model' | 'gold-standard' | 'adr-complete'`, `title?: string`
- Behavior: Each badge type has specific color scheme (gold for gold-standard, blue for docs, etc.)
- Styling: Inline badges with icon, text, and subtle shadow effects

**`BadgeGroup.tsx`** — Multi-badge container

- Purpose: Conditionally render multiple badges based on project evidence
- Props: `project: Project`, `className?: string`
- Behavior: Analyzes project's evidence links and renders appropriate badges; responsive flex wrapping
- Example output for portfolio-app: [Gold Standard badge] [Docs Available] [Threat Model Complete]

### 9.2 Component Architecture

**File Structure:**

```
src/components/
  EvidenceBlock.tsx          (new)
  VerificationBadge.tsx      (new)
  BadgeGroup.tsx             (new)
  GoldStandardBadge.tsx      (existing — reference for styling patterns)
```

**Design Pattern:**

- All components are functional React components (not class-based)
- Use TypeScript strict mode with full type annotations
- Export named exports for each component
- Use React.ReactNode for children/content props
- Keep components small, focused, single-responsibility

**Integration:**

- Import components in `src/app/projects/[slug]/page.tsx`
- Place `BadgeGroup` in header near project title
- Place `EvidenceBlock` after "What This Project Proves" section
- Use responsive class names for mobile-first design

### 9.3 Component Specifications

**EvidenceBlock Component:**

```typescript
interface EvidenceBlockProps {
  project: Project;
  className?: string;
}

// Renders evidence in responsive grid:
// Mobile (1 col) → Tablet (2 cols) → Desktop (3 cols)
// Each cell: title + icon + link (or placeholder)
```

**Evidence categories to display:**

1. Dossier (`evidence.dossierPath`)
2. Threat Model (`evidence.threatModelPath`)
3. ADR Index (`evidence.adrIndexPath`)
4. Runbooks (`evidence.runbooksPath`)
5. GitHub Repository (`evidence.github` or fallback to `repoUrl`)

**VerificationBadge Component:**

```typescript
type BadgeType = "docs-available" | "threat-model" | "gold-standard" | "adr-complete";

interface VerificationBadgeProps {
  type: BadgeType;
  title?: string;
}

// Renders a single badge with:
// - Icon (SVG or emoji)
// - Label (type-specific text)
// - Color scheme (Tailwind border/bg/text classes)
// - Hover effect and accessibility attributes
```

**BadgeGroup Component:**

```typescript
interface BadgeGroupProps {
  project: Project;
  className?: string;
}

// Logic: render badges if evidence is present
// - Gold standard status: show if project.isGoldStandard === true
// - Docs available: show if dossierPath exists
// - Threat model: show if threatModelPath exists
// - ADR complete: show if adrIndexPath exists
```

### 9.4 Styling Guidelines

**Color Scheme (Tailwind 4):**

- Gold Standard: amber (use existing GoldStandardBadge as reference)
- Docs Available: blue (`border-blue-500`, `bg-blue-50`, `text-blue-900`)
- Threat Model: violet (`border-violet-500`, `bg-violet-50`, `text-violet-900`)
- ADR Complete: indigo (`border-indigo-500`, `bg-indigo-50`, `text-indigo-900`)

**Responsive Pattern:**

```tsx
// Mobile-first, build up
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{/* children */}</div>
```

**Dark Mode Support:**

- Use `dark:` modifier for all color classes
- Example: `border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950`

### 9.5 Testing Strategy (for PR)

**Manual testing:**

- [ ] Components render without TypeScript errors
- [ ] Project page still renders for both featured projects
- [ ] EvidenceBlock displays correctly on mobile (DevTools: iPhone 12)
- [ ] EvidenceBlock displays correctly on desktop
- [ ] Badges show for projects with evidence, hide for projects without
- [ ] Dark mode: verify color contrast and readability
- [ ] Hover states work on badges (shadow/opacity changes)

**Automated testing (Playwright):**

- [ ] Evidence block renders on `/projects/[slug]` page
- [ ] All evidence links are present in the DOM (if evidence data exists)
- [ ] Badge count matches expected evidence completeness

---

## 10) Implementation protocols (how you should work)

- `package.json` scripts and `packageManager`
- `src/lib/config.ts` contract and usage
- route structure in `src/app/`
- `src/data/projects.ts` registry shape
- CI workflows under `.github/workflows/`
- `.env.example` contract

### 8.2 Preferred implementation style

- Keep changes minimal and reversible.
- Add small helper components rather than duplicating markup.
- Maintain accessibility basics:
  - semantic headings
  - clear link text
  - keyboard-friendly interactions
- Avoid over-engineering (no premature frameworks, complex state management, or heavy UI libraries without justification).
- add it under `src/app/<route>/page.tsx`
- update navigation if it’s a top-level reviewer concern

### 8.4 Adding a new project entry

When adding projects:

- update `src/data/projects.yml` (YAML registry) and ensure it validates via `pnpm registry:validate`
- include:
  - stable `slug` (lowercase, hyphenated)
  - short `summary` and meaningful `tags`
  - evidence links (dossier, ADR index, threat model, runbooks, repo/github) using placeholders where appropriate
- use `pnpm registry:list` to verify interpolation and slug visibility
- schema reference lives in [portfolio-docs/docs/70-reference/registry-schema-guide.md](portfolio-docs/docs/70-reference/registry-schema-guide.md); decision rationale in [portfolio-docs/docs/10-architecture/adr/adr-0011-data-driven-project-registry.md](portfolio-docs/docs/10-architecture/adr/adr-0011-data-driven-project-registry.md)

YAML template (minimal to gold-standard-ready):

```yaml
- slug: sample-project
  title: "Sample Project"
  summary: "Concise 1–2 sentence summary (>=10 chars)."
  category: frontend
  tags: ["Next.js"]
  status: active
  repoUrl: "{GITHUB_URL}"
  evidence:
    dossierPath: "projects/sample-project/"
    adrIndexPath: "architecture/adr/"
    runbooksPath: "operations/runbooks/"
    github: "{DOCS_GITHUB_URL}"
```

Cross-repo linking reminders:

- Use `NEXT_PUBLIC_DOCS_BASE_URL` for rendered docs links (strip numeric prefixes and `.md`).
- Use `NEXT_PUBLIC_DOCS_GITHUB_URL + "blob/main/"` for non-rendered files in `portfolio-docs` (keep extensions).
- Use `NEXT_PUBLIC_GITHUB_URL + "blob/main/"` for `portfolio-app` file links when needed.

---

## 11) Testing Patterns (Stage 3.3)

### 9.1 Unit Test File Naming & Location

**File naming convention:**

- Location: `src/lib/__tests__/`
- Pattern: `[module].test.ts`
- Examples:
  - `src/lib/__tests__/registry.test.ts` — Tests for `src/lib/registry.ts`
  - `src/lib/__tests__/config.test.ts` — Tests for `src/lib/config.ts`
  - `src/lib/__tests__/slugHelpers.test.ts` — Tests for slug validation

### 9.2 Unit Test Template (Vitest)

```typescript
import { describe, it, expect } from "vitest";
import { functionToTest } from "../module";

describe("Module Name", () => {
  describe("functionToTest", () => {
    it("should [expected behavior]", () => {
      // Arrange: Set up test inputs
      const input = {
        /* test data */
      };

      // Act: Call the function
      const result = functionToTest(input);

      // Assert: Verify the output
      expect(result).toBe(expectedValue);
    });

    it("should handle edge cases", () => {
      expect(functionToTest(null)).toThrow();
      expect(functionToTest(undefined)).toThrow();
    });
  });
});
```

### 9.3 E2E Test File Naming & Location

**File naming convention:**

- Location: `e2e/`
- Pattern: `[feature].spec.ts`
- Examples:
  - `e2e/evidence-links.spec.ts` — Evidence link resolution tests
  - `e2e/smoke.spec.ts` — Smoke tests for all routes

### 9.4 E2E Test Template (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should [user-facing behavior]", async ({ page }) => {
    // Navigate to the page
    await page.goto("/projects/portfolio-app");

    // Interact with the page
    await page.locator("button").click();

    // Verify expected outcome
    await expect(page.locator("text=Success")).toBeVisible();
  });

  test("should handle error case", async ({ page }) => {
    await page.goto("/projects/invalid-slug");
    await expect(page.locator("text=Not Found")).toBeVisible();
  });
});
```

### 9.5 Testing Best Practices

**Do:**

1. Use descriptive test names that explain expected behavior
   - ✅ `should accept valid project entries`
   - ❌ `test validation`

2. Follow arrange/act/assert pattern

   ```typescript
   // Arrange
   const input = "/portfolio/roadmap";
   // Act
   const result = docsUrl(input);
   // Assert
   expect(result).toBe("/docs/portfolio/roadmap");
   ```

3. Test behavior, not implementation
   - ✅ `expect(result).toBe('/docs/portfolio/roadmap')`
   - ❌ `expect(docsUrl).toHaveBeenCalledWith(...)`

4. Use specific assertions
   - ✅ `expect(result).toBe('/docs/portfolio/roadmap')`
   - ❌ `expect(result).toBeTruthy()`

5. Test edge cases: null, undefined, empty strings
   ```typescript
   it("should handle empty pathname", () => {
     expect(docsUrl("")).toBe("/docs");
   });
   ```

**Don't:**

1. Skip tests in CI (all tests must run and pass)
2. Mock more than necessary (prefer integration over isolated unit tests)
3. Test implementation details or private functions
4. Leave `.only()` or `.skip()` in committed code

### 9.6 Running Tests Locally

```bash
# All unit tests in watch mode (development)
pnpm test

# Unit tests once (for CI verification)
pnpm test:unit

# With coverage report
pnpm test:coverage

# Visual UI dashboard
pnpm test:ui

# All E2E tests
pnpm playwright test

# E2E tests interactive UI (recommended for development)
pnpm playwright test --ui

# E2E tests debug mode
pnpm playwright test --debug
```

### 9.7 Coverage Expectations

**Unit tests:**

- ≥80% for all `src/lib/` modules
- Coverage report: `coverage/index.html` after running `pnpm test:coverage`
- Required for CI to pass

**E2E tests:**

- 100% route coverage for all project pages
- Tests run across Chromium, Firefox, WebKit
- 2 retries in CI for flaky test resilience

### 9.8 When to Add Tests

Add or update tests when:

1. Adding new utility functions in `src/lib/`
2. Modifying registry schema or validation rules
3. Changing link construction helpers
4. Adding new routes that should have E2E coverage
5. Fixing a bug (add regression test first)

Do NOT add tests for:

1. React components rendering (unless testing business logic)
2. Re-exports or simple pass-through code
3. Configuration that's verified in CI (e.g., build-time validation)

### 9.9 Test Reference Documentation

- **Comprehensive Testing Guide:** [docs/70-reference/testing-guide.md](https://bns-portfolio-docs.vercel.app/docs/reference/testing-guide)
- **Vitest Documentation:** https://vitest.dev
- **Playwright Documentation:** https://playwright.dev
- **Implementation Issue:** [stage-3-3-app-issue.md](https://bns-portfolio-docs.vercel.app/docs/portfolio/roadmap/issues/stage-3-3-app-issue)

---

## 12) Current baseline and planned evolution

### 10.1 Prettier ESM plugin errors

Symptoms:

- Prettier fails with ESM/CJS require() errors (often involving Tailwind plugin).
  Mitigation:
- ensure `prettier.config.mjs` is used
- specify plugins by name (`plugins: ["prettier-plugin-tailwindcss"]`)

### 10.2 CI required checks missing or renamed

Symptoms:

- merges blocked or unexpectedly allowed
  Mitigation:
- ensure workflow name `ci` and jobs `quality`/`build` are stable
- ensure workflow name `ci` and jobs `quality`/`test`/`build` are stable
- run CI on PR and `main`
- update GitHub ruleset required checks if a deliberate change is made (requires governance documentation)

### 10.3 Frozen lockfile failures

Symptoms:

- CI fails on `pnpm install --frozen-lockfile`
  Mitigation:
- update lockfile in a dedicated PR
- document why dependency graph changed
- ensure `pnpm install` runs clean locally before pushing

---

## 13) What to produce in PRs (required format)

Every PR must include:

- **Summary**: what changed
- **Rationale**: why
- **Evidence**:
  - local: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`
  - CI: confirm `ci / quality`, `ci / test`, and `ci / build` pass
- **Security note**: “No secrets added; no sensitive endpoints introduced.”
- **Documentation impact**: list any Documentation App updates needed

If the change is a durable decision:

- propose an ADR update (in Docs App) rather than burying rationale in PR text

---

## 12) Scope boundaries: what not to change without explicit approval

Do not change or introduce the following without an explicit request and documented rationale:

- Authentication
- Backend services (databases, APIs)
- Contact form handling
- Analytics/telemetry
- Large UI frameworks or component libraries
- Significant URL structure changes (routes/slugs)
- Renaming required CI checks (`ci / quality`, `ci / test`, `ci / build`)
- Removing CodeQL or Dependabot baselines

---

## 13) Quick start: “safe default” tasks you can autonomously improve

If asked to “improve” the app without specific direction, prioritize:

1. Accessibility/semantics improvements (headings, link labels, focus states)
2. Reducing duplication via small components
3. Improving clarity of reviewer path and evidence links
4. Expanding `src/data/projects.ts` with one new credible project entry (only if evidence exists)
5. Improving error handling (e.g., `notFound()` path for unknown project slugs)

Always keep changes PR-sized and reversible.

---

## 14) Repository file additions and updates (common patterns)

### 14.1 Environment variable additions

- Update `.env.example` with placeholder keys and comments.
- Update `src/lib/config.ts` to read `process.env.NEXT_PUBLIC_*`.
- Do not add secrets.
- Update README env section to reflect new keys.

### 14.2 CI modifications

- Preserve stable check names.
- Keep install deterministic.
- Keep CI runtime reasonable; avoid adding slow steps without justification.
- If adding new required checks, propose them as a phased change and document in ADR (Docs App).

---

## 15) Links and external references policy

Do not embed raw URLs in Markdown in this repo unless:

- they are stable and public
- they do not reveal sensitive infrastructure
- they are not secrets

Prefer linking to:

- the Documentation App evidence pages (via `DOCS_BASE_URL`)
- GitHub repos and public demos

---

## 16) Final instruction

Your default posture is **enterprise discipline**:

- minimal surface area
- deterministic builds
- enforceable governance
- public-safe content
- evidence-first linking

When uncertain, choose the more conservative, auditable approach and explain tradeoffs in PR rationale.

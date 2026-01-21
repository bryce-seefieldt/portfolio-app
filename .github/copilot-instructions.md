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

---

## 4) Delivery governance and CI gates

### 4.1 Required checks (do not break these)

The following GitHub checks are required for merge and must remain stable:

- `ci / quality`
- `ci / build`

**Do not rename**:

- the GitHub Actions workflow name `ci`
- the job names `quality` and `build` (or their displayed names)

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

## 8) Implementation protocols (how you should work)

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

## 9) Testing strategy (current state and planned evolution)

### 9.1 Current baseline

At this stage, the app uses CI gates focused on:

- lint
- format check
- typecheck
- build

### 9.2 Planned next steps (do not implement unless requested)

- Unit tests with Vitest for registry validation and utility functions
- E2E smoke tests with Playwright for critical routes (`/`, `/cv`, `/projects`, one project detail)
- Performance and accessibility validation gates (phased)

If asked to add tests, propose an ADR-level rationale and ensure CI remains fast and stable.

---

## 10) Known failure modes and how to respond

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

## 11) What to produce in PRs (required format)

Every PR must include:

- **Summary**: what changed
- **Rationale**: why
- **Evidence**:
  - local: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`
  - CI: confirm `ci / quality` and `ci / build` pass
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
- Renaming required CI checks (`ci / quality`, `ci / build`)
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

# Portfolio App

A production-quality **Next.js (App Router) + TypeScript** web application that serves as the **front-of-house** experience for a verification-first development portfolio.

This app intentionally remains concise and product-oriented. Deep engineering evidence—**project dossiers, ADRs, threat models, runbooks, and release notes**—lives in a companion **Documentation App** (Docusaurus).

---

## What this is

The Portfolio App provides:

- A polished landing experience (`/`)
- An interactive CV skeleton (`/cv`)
- A projects index and detail view (`/projects`, `/projects/[slug]`)
- A static contact surface (`/contact`)
- First-class links into the evidence engine (Documentation App)

The design goal is for reviewers to evaluate the portfolio like a real service: clear UX, stable routes, and verifiable evidence trails.

## Documentation App (Evidence Engine)

Enterprise-grade documentation is hosted separately to preserve a clean product surface and maintain governance discipline.

- Docs base URL is configured via: `NEXT_PUBLIC_DOCS_BASE_URL`
- The code constructs evidence links through: `src/lib/config.ts`

## Tech stack

- Next.js (App Router)
- React + TypeScript
- pnpm
- Tailwind CSS (baseline styling)
- Minimal internal modules:
  - `src/lib/config.ts` (public-safe runtime configuration)
  - `src/lib/registry.ts` (YAML-backed registry loader with Zod validation and env interpolation)
  - `src/data/projects.yml` (canonical project registry data)
  - `src/data/projects.ts` (typed export of the validated registry)

## Data-driven project registry (Stage 3.1)

- Source of truth: `src/data/projects.yml`
- Validation and interpolation: `src/lib/registry.ts` resolves placeholders `{GITHUB_URL}`, `{DOCS_BASE_URL}`, `{DOCS_GITHUB_URL}`, `{SITE_URL}` from `NEXT_PUBLIC_*` env vars and enforces schema/slug rules.
- Scripts:
  - `pnpm registry:validate` — fail-fast validation during CI/local
  - `pnpm registry:list` — list slugs/titles after interpolation

## Local development

### Prerequisites

- Node.js (LTS recommended)
- pnpm

### Setup

```bash
pnpm install
cp .env.example .env.local
```

Edit `.env.local` to set at least:

- `NEXT_PUBLIC_DOCS_BASE_URL` (path strategy or subdomain strategy)
- `NEXT_PUBLIC_DOCS_GITHUB_URL` (link to docs repo source when needed)
- `NEXT_PUBLIC_GITHUB_URL` (portfolio-app repo URL for interpolation)
- `NEXT_PUBLIC_SITE_URL` (production site URL for demos)

#### Run dev server

```bash
pnpm dev
```

#### Build

```bash
pnpm build
```

## Environment variables

See `.env.example` for the public-safe configuration contract.

### Public-safety rule (non-negotiable)

All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not place secrets, tokens, private endpoints, or sensitive values in `NEXT_PUBLIC_*`.

## Governance (Implemented)

Phase 1–3 governance is enforced:

- Required CI checks with stable names:
  - `ci / quality` (lint, format:check, typecheck)
  - `ci / link-validation` (registry validation + evidence link checks; Stage 3.5)
  - `ci / build` (Next.js build; depends on quality and link-validation)
- Deterministic installs in CI: `pnpm install --frozen-lockfile`
- Supply chain and static analysis: CodeQL (JS/TS) and Dependabot (weekly; majors excluded)

### Local quality contract

**Pre-deploy validation (required before every commit/PR):**

```bash
# Recommended: Full verification (catches all issues)
pnpm verify

# Alternative: Quick verification (during active development)
pnpm verify:quick

# Manual sequence (if verify script unavailable):
pnpm format:write && pnpm lint && pnpm typecheck && pnpm registry:validate && pnpm build && pnpm test
```

**What each verification command does:**

**Full verification** (`pnpm verify`) — Complete pre-deploy validation (~2-3 minutes):

1. Environment validation (Node, pnpm, .env.local, required vars)
2. Auto-formats code (`format:write` then `format:check`)
3. Runs ESLint with zero-warning enforcement
4. Validates TypeScript types
5. Quick scan for secrets
6. Validates the project registry (YAML + Zod schema)
7. Builds the Next.js app
8. Runs Vitest unit tests (70+ tests: registry validation, slug helpers, link construction)
9. Runs Playwright link validation (12 checks: evidence link resolution, route coverage)
10. Provides detailed troubleshooting guidance for any failures

**Quick verification** (`pnpm verify:quick`) — Fast iteration during development (~60-90s):

- Runs steps 1-7 above, **skips unit and link validation tests** (steps 8-9)
- Use when making frequent small changes and need rapid feedback
- Run full `pnpm verify` before final commit/push

### Available scripts reference

**Development:**

```bash
pnpm dev          # Start Next.js dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server (requires build first)
```

**Quality checks (individual):**

```bash
pnpm lint              # ESLint (zero warnings enforced)
pnpm typecheck         # TypeScript type checking
pnpm format:check      # Check if files are formatted
pnpm format:write      # Auto-format all files with Prettier
pnpm quality           # Combined: lint + format:check + typecheck
```

**Unit tests (Vitest):**

```bash
pnpm test:unit         # Run all unit tests (70+ tests)
pnpm test:coverage     # Run tests with coverage report (80% target)
pnpm test:ui           # Visual UI dashboard for test debugging
pnpm test:debug        # Debug mode with inspector
```

**E2E tests (Playwright):**

```bash
pnpm playwright test   # Run all E2E tests (12 tests)
pnpm playwright test --ui # Run tests in interactive UI mode
pnpm playwright test --debug # Debug mode with inspector
npx playwright show-report # View HTML test report
```

**Security:**

```bash
pnpm secrets:scan      # Scan for accidentally committed secrets (TruffleHog)
                       # Requires TruffleHog CLI binary (see installation below)
```

**TruffleHog installation (Optional, Runs in CI Workdlow):**

```bash
# macOS
brew install trufflesecurity/trufflehog/trufflehog

# Linux: Download binary from GitHub releases
# https://github.com/trufflesecurity/trufflehog/releases/
# Then add to PATH or /usr/local/bin

# Alternative: Use pre-commit hook
pip install pre-commit
pre-commit install
# This will scan automatically on commit
```

### Local secret scanning (recommended)

To prevent accidental commits of secrets, configure the pre-commit hook for automatic scanning:

```bash
# Install pre-commit framework
pip install pre-commit

# Install hooks (runs TruffleHog on every commit attempt)
pre-commit install

# Verify setup
pre-commit run --all-files
```

**How it works:**

- `.pre-commit-config.yaml` defines a TruffleHog hook (v3.63.0)
- Before each commit, TruffleHog scans for verified secrets
- If secrets are found, the commit is blocked until they are removed
- False positives can be ignored with inline comments (see TruffleHog docs)

**If pre-commit is not set up:**

Secrets will still be scanned in CI (GitHub Actions), but setting up the local hook catches issues earlier and prevents commits in the first place.

**Registry and link validation (Stage 3.5):**

```bash
pnpm registry:validate # Validate projects.yml schema and integrity
pnpm registry:list     # List all projects with interpolated values
pnpm links:check       # Run Playwright link validation (evidence URL smoke tests)
```

**Comprehensive validation:**

```bash
pnpm verify            # Full pre-deploy validation (all checks + tests)
pnpm verify:quick      # Fast validation (all checks, skip tests)
```

### Pre-deploy checklist (step-by-step)

If running commands manually instead of using `pnpm verify`:

```bash
# 1. Ensure environment is configured
test -f .env.local || { echo "Missing .env.local - copy from .env.example"; exit 1; }

# 2. Auto-format code (prevents format failures)
pnpm format:write

# 3. Validate code quality
pnpm lint              # ESLint must pass with 0 warnings
pnpm typecheck         # TypeScript must have no errors

# 4. Validate data integrity
pnpm registry:validate # Projects YAML must be valid

# 5. Validate evidence links (Stage 3.5)
pnpm links:check       # Playwright link validation (must connect to /docs)

# 6. Ensure production build works
pnpm build

# 7. Run unit tests
pnpm test:unit

# 8. Security scan (recommended if TruffleHog installed)
pnpm secrets:scan || echo "TruffleHog not installed - skipping secret scan"
```

**Or use the automated workflow:**

```bash
pnpm verify    # Runs all above steps with detailed error reporting
```

## Deployment Workflow (Live — Phase 4 Enhanced)

✅ **Three-tier deployment model:**

The Portfolio App uses a **staging-first deployment workflow** to ensure changes are validated in a production-like environment before reaching end users.

### Environments

| Environment | Branch      | Domain                                     | Purpose                                   |
| ----------- | ----------- | ------------------------------------------ | ----------------------------------------- |
| Preview     | PR branches | Auto-generated (`*.vercel.app`)            | PR review and feature validation          |
| Staging     | `staging`   | `https://staging-bns-portfolio.vercel.app` | Pre-production validation and smoke tests |
| Production  | `main`      | `https://bns-portfolio.vercel.app`         | Live public site                          |

### Local Development → Staging → Production Workflow

#### Step 1: Local Development and Testing

```bash
# Create feature branch from main
git checkout main && git pull
git checkout -b feat/your-feature

# Make changes, validate locally
pnpm verify  # Comprehensive validation (all checks + tests)

# Commit and push
git add . # Adding specific filenames is recommended over `.` wildcard
git commit -m "feat: your feature description"
git push origin feat/your-feature
```

#### Step 2: PR Review with Preview

```bash
# Open PR targeting STAGING branch (via GitHub UI)
# - Vercel creates preview deployment automatically
# - CI runs quality gates (lint, format, typecheck, tests)
# - Review preview URL and validate changes
# - Ensure all CI checks pass
```

#### Step 3: Merge to Staging

After PR approval and CI passing:

```bash
# Merge PR to staging (via GitHub UI or CLI)
# This automatically triggers staging deployment

# If merging via CLI:
git checkout staging
git pull origin staging
git merge feat/your-feature  # Merge your feature branch
git push origin staging
```

This triggers:

- Vercel deployment to `staging-bns-portfolio.vercel.app`
- CI quality gates run again on staging branch

#### Step 4: Validate on Staging

1. **Open staging domain**: `https://staging-bns-portfolio.vercel.app`
2. **Validate critical flows**:
   - [ ] Home page loads (`/`)
   - [ ] Navigation works (`/cv`, `/projects`, `/contact`)
   - [ ] Project detail pages render (`/projects/[slug]`)
   - [ ] Evidence links to Documentation App resolve correctly
   - [ ] No console errors or broken links
3. **Run smoke tests** (optional but recommended):
   ```bash
   # Point tests at staging domain
   PLAYWRIGHT_TEST_BASE_URL=https://staging-bns-portfolio.vercel.app pnpm playwright test
   ```

#### Step 5: Promote to Production

Only after staging validation passes:

```bash
# Promote staging to production by merging to main
git checkout main
git pull origin main
git merge staging
git push origin main
```

**Production deployment happens automatically** when:

- Staging changes are merged to `main`
- GitHub Deployment Checks pass (`ci / quality`, `ci / link-validation`, `ci / build`)
- Vercel promotes main branch to production domain

### Quick Reference Commands

```bash
# Full local validation before commit
pnpm verify

# Fast validation during development
pnpm verify:quick

# Manual step-by-step validation
pnpm format:write && pnpm lint && pnpm typecheck && pnpm build && pnpm test

# Deploy to staging (merge feature branch to staging)
git checkout staging && git pull && git merge feat/your-feature && git push

# Promote to production (merge staging to main)
git checkout main && git pull && git merge staging && git push

# Validate staging deployment
open https://staging-bns-portfolio.vercel.app
```

### Governance and Protection

- **GitHub Ruleset** protects `main` and `staging` branches
- **Required CI checks** before merge: `ci / quality`, `ci / test`, `ci / link-validation`, `ci / build`
- **Vercel Deployment Checks** gate production promotion
- **Staging validation** required before production deployment

For detailed setup and troubleshooting, see:

- [Vercel Setup Runbook](/docs/50-operations/runbooks/rbk-vercel-setup-and-promotion-validation.md)
- [Deployment Runbook](/docs/50-operations/runbooks/rbk-portfolio-deploy.md)

## Security note

- This repo is public-facing by design.
- Do not commit secrets.
- Treat all documentation and configuration as public unless explicitly stored in internal-only locations.
- `NEXT_PUBLIC_*` variables are client-readable—only store non-sensitive values.

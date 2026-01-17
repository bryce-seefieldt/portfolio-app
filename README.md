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
  - `src/data/projects.ts` (project registry placeholder)

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

Phase 1 governance is enforced:

- Required CI checks with stable names:
  - `ci / quality` (lint, format:check, typecheck)
  - `ci / build` (Next.js build; depends on quality)
- Deterministic installs in CI: `pnpm install --frozen-lockfile`
- Supply chain and static analysis: CodeQL (JS/TS) and Dependabot (weekly; majors excluded)

### Local quality contract

Run locally before pushing:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

## Deployment (Live — Phase 1 Complete)

✅ **Production is live on Vercel:**

- PR → preview deployments (Vercel auto-generates preview URLs)
- `main` → production deployment at `https://portfolio-app.vercel.app`
- Production promotion gated by GitHub Deployment Checks (`ci / quality`, `ci / build`)
- GitHub Ruleset protects `main` branch

For Phase 1 setup details, see [Vercel Setup Runbook](/docs/50-operations/runbooks/rbk-vercel-setup-and-promotion-validation.md) in the documentation app.

## Security note

- This repo is public-facing by design.
- Do not commit secrets.
- Treat all documentation and configuration as public unless explicitly stored in internal-only locations.
- `NEXT_PUBLIC_*` variables are client-readable—only store non-sensitive values.

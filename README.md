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

## Governance (Current State)

At this stage, this repo provides the baseline application skeleton and content structure.

Next steps (planned):

- Enforce PR discipline with required CI checks (lint/format/typecheck/build)
- Add CodeQL and dependency governance (Dependabot)
- Deploy to Vercel with preview deployments and production promotion gated by checks

## Deployment (planned)

The intended deployment platform is Vercel:

- PR → preview deployments
- `main` → production deployment
- production promotion gated by GitHub checks (imported into Vercel)

## Security note

- This repo is public-facing by design.
- Do not commit secrets.
- Treat all documentation and configuration as public unless explicitly stored in internal-only locations.
- `NEXT_PUBLIC_*` variables are client-readable—only store non-sensitive values.

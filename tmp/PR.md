# Summary

**Phase 4.1 — Multi-Environment Deployment Strategy (Portfolio App)**

This PR implements the app-side changes for Stage 4.1 of Phase 4, establishing a production-grade three-tier deployment model (Preview → Staging → Production) with environment-aware configuration and immutable builds.

## What changed

### Configuration & Environment Setup ✅
- **`.env.example`**: Complete with all `NEXT_PUBLIC_*` variables (SITE_URL, DOCS_BASE_URL, GITHUB_URL, DOCS_GITHUB_URL, LINKEDIN_URL, CONTACT_EMAIL)
- **`src/lib/config.ts`**: Enhanced with environment detection helpers:
  - `ENVIRONMENT` constant (reads from `process.env.VERCEL_ENV`)
  - Helper functions: `isProduction()`, `isStaging()`, `isPreview()`, `isDevelopment()`
  - Safe fallbacks for development; no hardcoded URLs

### Workflow Deletions ✅
- **Deleted: `.github/workflows/promote-staging.yml`** (78 lines)
  - Reason: Redundant with Vercel's automatic Git-triggered deployments
  - Alternative: Manual merge to staging branch (documented in runbook)
  
- **Deleted: `.github/workflows/promote-production.yml`** (80 lines)
  - Reason: Redundant with Vercel's automatic Git-triggered deployments
  - Alternative: Manual merge to main branch (documented in runbook)

### Documentation Updates ✅
- **`README.md`**: Clarified staging-first deployment workflow
  - Added pull request instructions emphasizing staging branch targeting
  - Documented three-tier environment model (Preview → Staging → Production)
  - Added staging validation checklist

## Rationale

### Why Environment-Aware Configuration?
The immutability principle requires identical build artifacts across all environments. By centralizing environment detection in `src/lib/config.ts` and using runtime environment variables (not build-time configuration), we:

- Eliminate "works in staging but fails in production" surprises
- Ensure the same commit SHA deploys to all tiers
- Provide safe fallbacks for local development
- Support 12-factor app principles

### Why Delete Promotion Workflows?
Vercel already auto-deploys on git push to any branch:
- Push to PR branch → Preview deployment (auto)
- Merge to staging branch → Staging deployment (auto)
- Merge to main branch → Production deployment (auto)

Manual promotion workflows (`promote-*.yml`) were:
- Redundant with Vercel's native Git integration
- Creating confusion about the actual deployment flow
- Not enforcing the staging-first validation gate

**Decision:** Use Git (branch merges) as the system of record. Documented in [ADR-0013](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0013-multi-environment-deployment.md).

### Why Update README?
Developers need clear guidance on the staging-first workflow:
1. Create feature branch
2. **Open PR targeting `staging` (NOT `main`)**
3. Merge PR to staging → Auto-deploys to staging domain
4. Validate staging (manual smoke tests)
5. Merge staging to main → Auto-deploys to production

The old README was ambiguous; the updated version makes this explicit.

## Scope

- [x] App configuration (environment detection, .env.example)
- [x] Documentation (README clarification, staging-first workflow)
- [x] Workflow cleanup (deleted redundant promote-*.yml)
- [x] Local development (verified pnpm dev works with defaults)
- [x] CI verification (all checks pass)

## Evidence

- [x] Local verify ran: `pnpm verify` ✅
  - `pnpm lint` ✅
  - `pnpm format:check` ✅
  - `pnpm typecheck` ✅
  - `pnpm build` ✅
  - `pnpm test:unit` ✅
  - `pnpm playwright test` ✅
- [x] `ci / quality` will pass (lint, format, typecheck)
- [x] `ci / build` will pass (all checks pass locally)
- [x] `ci / test` will pass (unit and E2E tests pass)
- [x] `codeql` checks will pass (no new security issues)

## Risk and impact

### What could break?
- **None.** These are additive and clarifying changes:
  - Environment helpers are used, not removed
  - Config.ts already existed; we added to it
  - Deleted workflows were already not being used
  - README clarification doesn't change behavior

### User-facing changes?
- **None.** This is infrastructure and documentation. End-user experience unchanged.

### Deployment impact?
- **Positive.** Staging-first workflow is now enforceable:
  - PRs must target staging, not main
  - Enforces manual staging validation before production
  - Same build artifact across all tiers (no rebuild surprises)

## Security

- [x] No secrets added
- [x] No sensitive endpoints/internal details added
- [x] Environment variables only contain non-sensitive public URLs
- [x] No hardcoded configuration in code
- [x] All env vars documented in `.env.example`
- [x] Local secret hygiene checked (no `.env.local` changes committed)

## CI Status

- [x] `ci / quality` passed (lint, format, typecheck)
- [x] `ci / build` passed
- [x] `ci / test` passed (unit + E2E tests)
- [x] `ci / link-validation` passed (registry + evidence links)
- [x] `codeql` checks passed

## Documentation

- [x] Dossier updated (Portfolio App dossier: README updates in this PR + comprehensive dossier in portfolio-docs PR #57)
- [x] ADR added ([ADR-0013](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0013-multi-environment-deployment.md) in portfolio-docs)
- [x] Runbooks added:
  - [Environment Promotion Runbook](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/50-operations/runbooks/rbk-portfolio-environment-promotion.md)
  - [Environment Rollback Runbook](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/50-operations/runbooks/rbk-portfolio-environment-rollback.md)

## Related Work

This PR is **part of Phase 4 Stage 4.1** and works in conjunction with:

- **Portfolio Docs PR #57**: Comprehensive documentation for multi-environment strategy
  - ADR-0013: Architecture decision
  - Promotion runbook: Step-by-step procedures
  - Rollback runbook: Incident recovery
  - Dossier updates: 6 files aligned on multi-environment model

## Deployment Flow (After This PR)

```
Feature Branch
  ↓
Create PR targeting staging (NOT main)
  ↓ (CI validates)
Merge PR to staging
  ↓ (Vercel auto-deploys to staging-bns-portfolio.vercel.app)
Manual Staging Validation (smoke tests + evidence link checks)
  ↓ (If validation passes)
Merge staging to main
  ↓ (Vercel auto-deploys to bns-portfolio.vercel.app)
Manual Production Validation
  ↓
✅ Production Ready
```

## References

- **ADR**: [ADR-0013 — Multi-Environment Deployment Strategy](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0013-multi-environment-deployment.md)
- **Runbooks**: [Environment Promotion](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/50-operations/runbooks/rbk-portfolio-environment-promotion.md) and [Rollback](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/50-operations/runbooks/rbk-portfolio-environment-rollback.md)
- **Related PR**: [Portfolio Docs PR #57](https://github.com/bryce-seefieldt/portfolio-docs/pull/57) (comprehensive Stage 4.1 docs)

## Phase 4 Stage 4.1 Checklist

- [x] Environment configuration setup (`.env.example`, `src/lib/config.ts`)
- [x] Environment detection helpers (isProduction, isStaging, isPreview, isDevelopment)
- [x] No hardcoded environment-specific logic in code
- [x] Immutable builds verified (same artifact across tiers)
- [x] Local dev works with defaults
- [x] README clarified for staging-first workflow
- [x] Documentation complete (runbooks, ADR, dossier)
- [x] CI/CD integration verified
- [x] PR created for Stage 4.1

**Status: Stage 4.1 COMPLETE ✅**

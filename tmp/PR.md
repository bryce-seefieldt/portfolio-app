## Summary

Setup environment variables and promotion workflows for staging domain and production deployment gating per Vercel configuration (Phase 6 of rbk-vercel-setup-and-promotion-validation).

**Key changes:**
- Added environment variables for Preview/Production scopes (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DOCS_BASE_URL`, etc.)
- Added `.env.example` with complete environment contract
- Created promotion workflows (`promote-staging`, `promote-production`) with immutable artifact validation
- Enhanced `config.ts` to support environment-aware URL construction
- Added `environment.ts` utility for environment detection and diagnostics

## Rationale

To support the staged deployment pipeline:
1. **Environment variables** must be scoped correctly (Preview vs Production) to ensure staging deploys use `staging-bns-portfolio.vercel.app` and production uses `bns-portfolio.vercel.app`
2. **Promotion workflows** enforce immutable builds—same commit SHA across staging → production
3. **Environment validation** ensures all required variables are present before deploy

This implements [ADR-0007](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0007-portfolio-app-hosting-vercel-with-promotion-checks.md) (Vercel with Deployment Checks) and [ADR-0008](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0008-portfolio-app-ci-quality-gates.md) (CI quality gates).

## Evidence

- [x] Local verify ran: `pnpm verify`
- [x] Environment variables validated locally with `.env.local`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - `NEXT_PUBLIC_DOCS_BASE_URL=http://localhost:3001`
- [x] Vercel Preview/Production environment variables configured in dashboard
  - Preview: `staging-bns-portfolio.vercel.app`
  - Production: `bns-portfolio.vercel.app`
- [x] Promotion workflows ready for Stage 3.4 (promote-staging, promote-production)

## Risk and impact

**Minimal risk:**
- No breaking changes to app code
- Environment variables optional; fallback to defaults
- Workflows gated behind GitHub Actions (manual trigger for now)

**User-facing impact:**
- None; this is deployment infrastructure
- Canonical URLs now correctly reflect deployment environment (staging vs prod)

## Security

- [x] No secrets added (all vars are public-safe)
- [x] Sensitive URLs properly scoped to environment
- [x] Pre-commit pattern scan: no credentials detected

## CI Status

- [x] `ci / quality` passed (lint, format, typecheck)
- [x] `ci / build` passed
- [ ] Production promotion awaits Deployment Checks gate

## Documentation

- [x] `.env.example` updated with all variables and scopes
- [x] `rbk-vercel-setup-and-promotion-validation.md` updated with correct Vercel Settings → Domains navigation
- [x] Environment variable strategy documented in Step 6.3
- [ ] Release note to be added after staging validation (Step 6.4)

**Related artifacts:**
- [ADR-0007: Portfolio App Hosting on Vercel](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0007-portfolio-app-hosting-vercel-with-promotion-checks.md)
- [ADR-0008: CI Quality Gates](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/10-architecture/adr/adr-0008-portfolio-app-ci-quality-gates.md)
- [Runbook: Vercel Setup & Promotion Validation](https://github.com/bryce-seefieldt/portfolio-docs/blob/main/docs/50-operations/runbooks/rbk-vercel-setup-and-promotion-validation.md)

## Next Steps

1. **This PR**: Merge after ci / quality and ci / build pass
2. **Step 6.4**: Validate staging works via GitHub Actions promote-staging workflow
3. **Step 6.5**: Promote to production via promote-production workflow
4. **Phase 7**: Document production URLs and mark setup complete

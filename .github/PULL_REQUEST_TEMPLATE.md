## Summary

- What changed?

## Rationale

- Why was this change made?
- What requirement or issue does it address?

## Evidence

- [ ] Local verify ran (recommended): `pnpm verify`
  - Or individually: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm audit`, `pnpm build`
- Links/screenshots (optional):

## Risk and impact

- What could break?
- Any user-facing changes?

## Security

- [ ] No secrets added
- [ ] No sensitive endpoints/internal details added
- [ ] Local secret hygiene checked (lightweight pattern scan or pre-commit)
- Notes (if any):

## CI Status

- [ ] `ci / quality` passed (lint, format, typecheck)
- [ ] `ci / secrets-scan` passed (PR-only gate)
- [ ] `ci / test` passed (unit + E2E tests)
- [ ] `ci / link-validation` passed (registry + evidence links; Stage 3.5)
- [ ] `ci / build` passed (depends on quality, test, link-validation)
- [ ] `codeql` checks passed

## Documentation

- [ ] Dossier updated (if behavior/architecture changed)
- [ ] ADR added/updated (if decision is durable)
- [ ] Threat model updated (if surface area changed)
- [ ] Runbooks updated (if deploy/rollback/triage changed)
- Notes:

# PRD-005: Release v5.0.0 (Feature Line)

## Why This PRD Exists

v5 is the new feature line and must be released with explicit support boundaries and auditable release gates. This PRD coordinates release execution after PRD-003 (runtime diff replacement) and PRD-004 (tooling/security remediation) are complete.

## Outcome Required

Publish `sequelize-paper-trail@5.0.0` with:

- Sequelize v6 as primary supported adapter,
- Node >=20 runtime policy,
- clear migration path from v4,
- complete release evidence and post-release policy updates.

## In Scope

- v5 release-line contract and branch strategy lock.
- Runtime support boundary documentation and enforcement validation.
- Migration/docs/examples updates for v5.
- Release gates, publish/tag/release-note evidence.
- Post-release deprecation plan for v4 line.

## Out of Scope

- New runtime features unrelated to release requirements.
- Sequelize v7 full support commitment (experimental only unless explicitly approved).
- Future majors or ecosystem expansion (dialects/typescript roadmap).

## Preconditions

- PRD-003 WI-001..003 complete.
- PRD-004 WI-001..002 complete (or explicit approved risk exception marked non-blocking).

## Support Contract for v5

- Node: `>=20` required.
- Sequelize: v6 supported; v7 marked experimental only if included.
- v5 is primary development line after release.

## Execution Structure

- `PRD-005 WI-001`: lock release contract + branch/release policy for v5.
- `PRD-005 WI-002`: finalize runtime support matrix and migration behavior checks.
- `PRD-005 WI-003`: docs/examples refresh for v5 public guidance.
- `PRD-005 WI-004`: execute release gates and publish readiness evidence.
- `PRD-005 WI-005`: publish v5.0.0 + tag + GitHub release + post-release deprecation actions.
- `PRD-005 WI-006`: post-release packaging-footprint reduction plan for `v5.0.1` (lowest priority).

## Required Gates

- `npm run lint`
- `npm test -- --coverage`
- `npm run test:v6`
- Demo snapshot parity
- Examples smoke checks
- Security evidence gate (including exception list review)

## Acceptance Criteria

- `5.0.0` published to npm with correct `latest` dist-tag.
- Git tag and GitHub release point to release commit.
- README/MIGRATION/RELEASE-POLICY/CI docs are consistent with v5 contract.
- v4 deprecation action is executed or explicitly deferred with owner/date.
- Packaging-footprint reduction for `v5.0.1` is tracked as a separate low-priority WI with explicit scope.

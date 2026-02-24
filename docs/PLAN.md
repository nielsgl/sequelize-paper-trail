# Execution Plan

This file tracks execution order at plan level. Runtime WI state is tracked in `docs/STATUS.md`.

## Canonical Execution Sources

- PRD index and wave order: `docs/INDEX.md`
- Runtime WI lifecycle and lock metadata: `docs/STATUS.md`
- Active PRDs: `docs/prd/`
- Per-WI implementation plans and gate prompts: `docs/impl/`
- Release/branch policy: `RELEASE-POLICY.md`

## Immediate Next Steps

1. Execute `PRD-003 WI-001` (Wave 4): golden diff-behavior fixture matrix.
2. Execute `PRD-003 WI-002` (Wave 4): local diff adapter compatibility plan.
3. Execute `PRD-003 WI-003` (Wave 4): remove `deep-diff`, then update changelog/status.
4. Start `PRD-004 WI-001..WI-002` (Wave 5) after PRD-003 is done.

## Milestones

- **v3.1.0 release line (`PRD-001`)**
  - Hard gates include demo snapshot parity plus v5/v6 test gates.
  - Output: published 3.1.0, verified tags, release-branch alignment evidence.

- **v4.0.0 release line (`PRD-002`)**
  - Enforce Node >=20 and finalize migration/support-policy updates.
  - Output: published 4.0.0, `release/v4` contract in place, v3 deprecation executed.

- **deep-diff replacement (`PRD-003`)**
  - Lock behavior with golden fixtures before dependency removal.
  - Output: `deep-diff` removed without behavior drift.

## Deferred Until After Active Waves

- Tooling major review (`docs/prd/PRD-004-tooling-major-review.md`, `PRD-004 WI-001`).
- TypeScript adoption track.
- Multi-dialect expansion (postgres/mysql).
- v4/v5 example modernization.

## Notes

- Historical phase/demo PRDs stay archived in `docs/archive/`.
- Completed work evidence and historical reconciliation remain in `docs/STATUS.md` under historical context.

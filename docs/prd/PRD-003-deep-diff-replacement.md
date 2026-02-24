# PRD-003: Replace `deep-diff` With Local Adapter (No Behavior Drift)

## Why This PRD Exists

`deep-diff@1.0.2` is deprecated/unmaintained and emits dependency warnings. We must remove it without changing user-visible revision behavior.

This PRD is the runtime-behavior track only. It does not include v5 release execution.

## Outcome Required

Ship a local diff adapter implementation that is behavior-compatible with current output, remove `deep-diff` from runtime dependencies, and prove zero drift through deterministic fixtures and parity gates.

## In Scope

- Build golden diff fixture matrix for current behavior.
- Implement local adapter behind `lib/adapters/diff.js` seam.
- Run full gates (`npm test -- --coverage`, `npm run test:v6`, demo parity).
- Remove `deep-diff` from `package.json` and lockfile.
- Record evidence and update release notes/status.

## Out of Scope

- v5.0.0 release/tag/publish work.
- Tooling-major upgrades (tracked in PRD-004).
- Feature additions to diff semantics.
- Sequelize v7 support expansion.

## Immutable Compatibility Contract

The replacement must preserve all of the following:

1. **Row creation behavior**
   - Same operations produce `RevisionChange` rows as before.
2. **Path semantics**
   - Equivalent path location and nesting representation.
3. **Value semantics**
   - Same value payload behavior for scalars, arrays, objects, `null`, and type transitions.
4. **Ordering semantics**
   - Stable deterministic ordering for snapshots/parity.
5. **Failure semantics**
   - No new uncaught errors for supported data paths.

## Execution Structure

- `PRD-003 WI-001`: lock behavior with a golden fixture matrix.
- `PRD-003 WI-002`: implement local adapter and prove compatibility.
- `PRD-003 WI-003`: remove dependency and finish evidence/docs.

## Required Gates

- `npm test -- --coverage`
- `npm run test:v6`
- Demo snapshot parity across baseline/v5/v6

## Rollback Strategy

If any compatibility gate fails:

1. Revert local adapter changes.
2. Restore `deep-diff` dependency state.
3. Keep PRD-003 open with explicit failure evidence and unresolved cases list.

## Acceptance Criteria

- `deep-diff` is removed from runtime dependencies.
- Golden fixtures and compatibility assertions pass on v5 and v6 test runs.
- Demo parity passes with zero mismatches.
- `CHANGELOG` and `docs/STATUS.md` include explicit PRD-003 completion evidence.

# PRD-003: Replace `deep-diff` (No Behavior Drift)

## Context
`deep-diff@1.0.2` is deprecated/unmaintained. The current code isolates diffing behind an adapter seam. We want a maintained solution **without any behavior drift** in revision change output.

## Goals
- Remove `deep-diff` dependency while keeping diff semantics stable for consumers.
- Preserve exact revision change payloads (paths/values/type markers) as relied upon by existing tests and demo parity.
- Keep the public API unchanged.

## Non-Goals
- Changing the shape of `RevisionChange` rows.
- Introducing new diff features or configurability.
- Performance tuning beyond “no regression”.

## Options (Decision Already Made)
- Keep a local diff implementation behind the adapter seam (no new third-party dependency) until we choose a maintained library with proven parity.

## Compatibility Contract (Diff Output)
The following must remain stable:
- Which updates create `RevisionChange` rows.
- How paths are represented.
- How old/new values are serialized (including `null`, arrays, objects).
- Ordering stability for deterministic snapshots.

## Required Gates
- `npm test -- --coverage`
- `npm run test:v6`
- Demo snapshot parity across baseline/v5/v6

## Execution Plan (Checklist)
1) Capture golden fixtures:
   - Add/confirm unit tests that assert diff output for nested objects/arrays/nulls and edge types used by the library.
2) Implement local diff adapter:
   - Replace `deep-diff` calls with local implementation behind `lib/adapters/diff.js` (or equivalent).
3) Run full gates:
   - Local coverage + v6 suite + demo parity.
4) Remove dependency:
   - Remove `deep-diff` from `package.json` and lockfile.
5) Document:
   - Update `docs/STATUS.md` and mention in `CHANGELOG` (no user migration expected).

## Rollback Plan
- If parity fails: revert diff adapter change and keep `deep-diff` until a parity-safe approach is ready.

## Acceptance Criteria
- `deep-diff` removed from runtime dependencies.
- Full test suite and demo parity pass with zero snapshot diffs.


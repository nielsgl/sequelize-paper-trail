# PRD: Sequelize v6 Demo (modernized local pack)

## Status
- State: Done
- Evidence: v6 demo tests + parity snapshots pass.
- Deferred: None.

## Purpose
Validate the modernized library against Sequelize v6 using a local demo project that installs a packed build of the current working tree. This is the v6 support gate before declaring compatibility.

## Scope
- Local‑only demo under `demos/v6`.
- Uses the shared test suite in `demos/_shared/test` (full user‑journey matrix from `docs/TESTS.md`).
- Installs the local pack of the current branch.

## Non‑Goals
- Publishing to npm.
- CI integration for demos.

## Package Source (Local Pack)
1) From repo root on the current branch, run `npm run build`.
2) Run `npm pack` to produce `sequelize-paper-trail-<version>.tgz`.
3) Place the tarball at `demos/_artifacts/sequelize-paper-trail-local.tgz`.

## Dependencies
- Node: use repo `.node-version`.
- Sequelize: `6.x` via alias `sequelize-v6` (npm alias in `package.json`).
- CLS: `cls-hooked` (explicit dependency for v6 CLS behavior).
- sqlite3: `^5.1.7` (Node 22 compatible).
- Jest: `^29.7.0`.

## Demo Layout
- `demos/v6/package.json`
- `demos/v6/jest.config.js`
- Shared tests: `demos/_shared/test/**`

## Test Commands
- `npm test` (from `demos/v6`) runs the full user‑journey suite with `SEQUELIZE_PACKAGE=sequelize-v6` and `SEQUELIZE_CLS=cls-hooked`.
- `npm run test:coverage` for optional coverage.

## Acceptance Criteria
- All tests in the user‑journey matrix pass with Sequelize v6.
- Any deltas vs v5 are documented and explicitly accepted as v6‑specific changes.

## Notes
- The alias keeps the test harness consistent with the existing adapter tests.
- If CLS behavior diverges from v5, document the difference and confirm expected behavior.
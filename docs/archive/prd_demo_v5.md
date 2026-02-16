# PRD: Sequelize v5 Demo (modernized local pack)

## Status
- State: Done
- Evidence: v5 demo tests + parity snapshots pass.
- Deferred: None.

## Purpose
Validate the modernized library against Sequelize v5 using a local demo project that installs a packed build of the current working tree. This is the v5 compatibility gate for all refactors.

## Scope
- Local‑only demo under `demos/v5`.
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
- Sequelize: `^5.14.0`.
- sqlite3: `^5.1.7` (Node 22 compatible).
- Jest: `^29.7.0`.

## Demo Layout
- `demos/v5/package.json`
- `demos/v5/jest.config.js`
- Shared tests: `demos/_shared/test/**`

## Test Commands
- `npm test` (from `demos/v5`) runs the full user‑journey suite.
- `npm run test:coverage` for optional coverage.

## Acceptance Criteria
- All tests in the user‑journey matrix pass with Sequelize v5.
- Any breaking deltas vs baseline are documented and accepted before moving to v6.

## Notes
- The demo uses the packed build rather than a path dependency to mirror npm install behavior.
- If sqlite3 build issues arise, document them and pin a compatible version for Node 22.
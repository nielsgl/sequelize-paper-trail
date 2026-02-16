# PRD: Baseline Demo (npm latest)

## Status
- State: Done
- Evidence: Baseline demo tests + DB snapshot parity with v5/v6 (Node 16 for sqlite3@4).
- Deferred: None.

## Purpose
Validate the published baseline behavior of `sequelize-paper-trail` using a local demo project that mirrors how a consumer would `npm install` the package. This is the regression safety net for the pre‑modernization behavior.

## Scope
- Local‑only demo under `demos/baseline`.
- Uses the shared test suite in `demos/_shared/test` (full user‑journey matrix from `docs/TESTS.md`).
- Installs the baseline package as if from npm.

## Non‑Goals
- Publishing to npm.
- CI integration for demos.

## Package Source (Baseline)
- Use the published package: `npm install sequelize-paper-trail@latest` (or pin to a specific published version).
- Only fall back to a tarball if npm does not have a usable release.

## Dependencies
- Node: use repo `.node-version`.
- Sequelize: `^5.14.0` (baseline parity with `origin/master`).
- sqlite3: `^4.0.9` (matches `origin/master`; may not build on Node 22).
- Jest: `^29.7.0`.

## Demo Layout
- `demos/baseline/package.json`
- `demos/baseline/jest.config.js`
- Shared tests: `demos/_shared/test/**`

## Test Commands
- `npm test` (from `demos/baseline`) runs the full user‑journey suite.
- `npm run test:coverage` for optional coverage.

## Acceptance Criteria
- All tests in the user‑journey matrix pass on the baseline package.
- Any divergence from `origin/master` behavior is documented before proceeding.

## Notes
- The shared test suite targets the public API (`require('sequelize-paper-trail')`), with limited internal coverage for adapter behavior.
- Baseline deps are aligned to `origin/master`; if sqlite3 fails on Node 22, document the deviation before upgrading.
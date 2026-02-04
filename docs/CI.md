# CI Intent (Active)

## Purpose
Capture the CI matrix and quality gates for the Phase 5 release workflow that now runs on GitHub Actions.

## Workflows
- **CI:** `.github/workflows/ci.yml`
  - Triggers: push + pull_request on `master` (current default), `main` (if renamed), `feature/next`, `release/v3`, `release/v4`.
  - Runs: `npm ci`, `npm test -- --coverage`.
  - Runs `npm run test:v6` for all branches **except** `release/v3`.
- **Release (npm):** `.github/workflows/release.yml`
  - Trigger: `workflow_dispatch` only (manual).
  - Runs: `npm ci`, `npm test -- --coverage`, `npm run test:v6` (skippable only for `release/v3`).
  - Publishes to **npm** using `NPM_TOKEN` and release environment approval.
- **Demo Parity:** `.github/workflows/demo-parity.yml`
  - Trigger: `workflow_dispatch` only (manual).
  - Runs snapshot export for baseline/v5/v6 demos and compares parity.

## Matrix (Target)
- Node.js: active LTS (20.x, 22.x).
- Sequelize: v5 (required), v6 (required for release), v7 (evaluate later).
- Dialect: sqlite only (in-memory).

## Required Checks
- Install: `npm ci`
- Tests: `npm test -- --coverage`
- Sequelize v6 tests: `npm run test:v6` (required for `main`, `feature/next`, `release/v4`)
- Lint: `npm run lint` (opt-in for now; schedule a dedicated lint job once the tooling stabilizes)

## Notes
- Coverage thresholds enforce 100% branches/functions/lines/statements for `lib/index.js` and `lib/helpers.js`.
- Demo parity is a manual gate (run it before tagging or publishing).
- Branch protection should require the `CI` workflow for `master` (or `main`), `release/v3`, and `release/v4`.

# CI Intent (Active)

## Purpose
Capture the CI matrix and quality gates for the Phase 5 release workflow that now runs on GitHub Actions.

## Workflows
- **CI:** `.github/workflows/ci.yml`
  - Triggers: push + pull_request on `main`, `feature/next`, `release/v3`, `release/v4`.
  - Runs: `npm ci`, `npm test -- --coverage`.
  - Runs `npm run test:v6` for `main`, `feature/next`, and `release/v4` (`release/v3` is exempt).
- **Release (npm):** `.github/workflows/release.yml`
  - Trigger: `workflow_dispatch` only (manual).
  - Runs: `npm ci`, `npm test -- --coverage`, and `npm run test:v6` (required except for `release/v3`).
  - Publishes to **npm** using `NPM_TOKEN` and release environment approval.
- **Demo Parity:** `.github/workflows/demo-parity.yml`
  - Trigger: `workflow_dispatch` only (manual).
  - Runs snapshot export for baseline/v5/v6 demos and compares parity.

## Matrix (Target)
- Node.js: 20.20.0 (current enforced CI baseline).
- Sequelize: v5 (required), v6 (required for release), v7 (evaluate later).
- Dialect: sqlite only (in-memory).

## Required Checks
- Install: `npm ci`
- Tests: `npm test -- --coverage`
- Sequelize v6 tests: `npm run test:v6` (required for `main`, `feature/next`, `release/v4`; optional for `release/v3`)
- Lint: `npm run lint` (opt-in for now; schedule a dedicated lint job once the tooling stabilizes)

## Notes
- Coverage thresholds enforce 100% branches/functions/lines/statements for `lib/index.js` and `lib/helpers.js`.
- Demo parity is a manual gate (run it before tagging or publishing).
- Branch protection should require the `CI` workflow for `main`, `release/v3`, and `release/v4`.
- Node 22.x remains a future expansion target after v4/v5 release stabilization.

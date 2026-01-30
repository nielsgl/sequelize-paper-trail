# CI Intent (Planned)

## Purpose
Capture the CI matrix and quality gates for the Phase 5 release workflow that now runs on GitHub Actions.

## Workflow
- Workflow file: `.github/workflows/release.yml`
- Runs on pushes/pull requests to `main` and can be triggered manually via `workflow_dispatch`.
- Steps: install (`npm ci`), `npm test -- --coverage`, and `npm run test:v6` (coverage included by default).
- The v6 step is gateable via the `skip-v6` input so contributors can iterate quickly, but release candidates must run with `skip-v6=false`.
- The job should be required before merging to `main` (protect the branch to enforce it).

## Matrix (Target)
- Node.js: active LTS (20.x, 22.x).
- Sequelize: v5 (required), v6 (required for release), v7 (evaluate later).
- Dialect: sqlite only (in-memory).

## Required Checks
- Install: `npm ci`
- Tests: `npm test -- --coverage`
- Sequelize v6 tests: `npm run test:v6` (with coverage, gateable via the workflow input)
- Lint: `npm run lint` (opt-in for now; schedule a dedicated lint job once the tooling stabilizes)

## Notes
- Coverage thresholds enforce 100% branches/functions/lines/statements for `lib/index.js` and `lib/helpers.js`.
- Keep v6 runs enabled for release candidates; use `skip-v6` only for fast iteration on PRs/feature branches.

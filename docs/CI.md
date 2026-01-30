# CI Intent (Planned)

## Purpose
Define the target CI matrix and checks for future GitHub Actions setup. This is a planning doc only; CI is not yet implemented.

## Matrix (Target)
- Node.js: active LTS (20.x, 22.x).
- Sequelize: v5 (required), v6 (future non-blocking), v7 (evaluate later).
- Dialect: sqlite only (in-memory).

## Required Checks
- Install: `npm install`
- Tests: `npm test -- --coverage`
- Lint: `npm run lint`
- Sequelize v6 tests: `npm run test:v6` (required once Phase 4 is active)

## Notes
- Coverage thresholds should enforce full non-debug branch coverage for `lib/index.js` and `lib/helpers.js`.
- v6 runs should start as allowed failures until adapter support is complete.

# PRD: Phase 3 — Tooling & Dependency Modernization (v5‑Safe)

## Status
- State: Partial
- Evidence: Tooling updated, Node policy set, CI workflow active, diff adapter shim added.
- Deferred: Lint CI gate and tooling-major review deferred to Phase 6.

## Overview
Phase 3 modernizes development tooling and dependencies while preserving v5 runtime behavior. This phase updates linting/testing/build tooling and sets a clear Node support policy, without changing the public API or runtime semantics.

## Problem Statement
Tooling and dependency versions are outdated and fragile on modern systems, creating build/install friction and increasing upgrade risk. We need stable, modern tooling to support ongoing maintenance and upcoming v6+ work.

## Goals
- Upgrade dev tooling (lint, tests, build) to modern, supported versions.
- Align Node support with active LTS versions and document it.
- Keep runtime behavior and public API unchanged.
- Minimize contributor friction (install, build, test).

## Non‑Goals
- No Sequelize v6 support in this phase.
- No feature additions or behavior changes.
- No module format changes (CJS remains for now).

## Users and Stakeholders
- Maintainers: need stable CI and fewer install issues.
- Contributors: need predictable local dev setup.
- Consumers: must see no runtime changes.

## Scope
### In Scope
- Tooling dependencies (Jest, ESLint, Prettier, Babel).
- CI/test scripts if needed for stability.
- Node version policy and dev env guidance.
- sqlite build compatibility notes.
- Lockfile policy and contributor guidance (npm vs yarn).

### Out of Scope
- Runtime dependency upgrades (unless needed for tooling).
- Adapter or feature changes.

## Functional Requirements
1) **Tooling Upgrades**
- Jest to a maintained major compatible with Node LTS.
- ESLint + Prettier to current major; ensure lint rules still match existing code style.
- Babel toolchain updates if required by Jest/Node.

2) **Node Support Policy**
- Define supported Node versions (active LTS only).
- Update `.node-version` and documentation to match.

3) **Build & Test Stability**
- Keep `npm test` and `npm run lint` stable.
- Ensure snapshots continue to work unchanged.
- Confirm sqlite native build guidance is accurate for macOS.

4) **Documentation Updates**
- Update `docs/PROJECT.md` and/or README with new tooling and Node policy.
- Document the lockfile policy (npm as the canonical package manager).
- Document the CI matrix (Node LTS + Sequelize v5) even if CI is not yet implemented.

## Non‑Functional Requirements
- No runtime behavior changes.
- No public API changes.
- CI runtime should not regress.

## Implementation Notes
- Prefer incremental upgrades; adjust lint configs only if required to keep prior formatting.
- If upgrading Jest, ensure Babel config remains compatible.
- Use minimal config changes to avoid formatting churn.

## Acceptance Criteria
- `npm test` passes on Node LTS versions.
- `npm run lint` passes (or known existing lint issues documented).
- Build output unchanged (CJS in `dist/`).
- Documentation reflects updated tooling and Node policy.
- Test suite covers all non-debug branches in `lib/` (no room for regression gaps).

## Risks and Mitigations
- **Risk:** Tooling upgrades introduce lint/style churn.
  - **Mitigation:** Preserve existing rules; avoid automatic reformatting.
- **Risk:** Native sqlite builds break on newer Node.
  - **Mitigation:** Document required Node/Python setup; consider sqlite3 upgrade.
- **Risk:** Jest upgrade breaks snapshots or test APIs.
  - **Mitigation:** Run full suite and update snapshots only if output is unchanged.

## Test Plan
- `npm test`
- `npm test -- --coverage`
- `npm run lint`

## Open Questions
- Do we keep Babel or move to Jest native ESM/CJS handling?
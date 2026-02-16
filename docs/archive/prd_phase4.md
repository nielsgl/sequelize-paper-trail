# PRD: Phase 4 — Sequelize v6+ Compatibility

## Status
- State: Done
- Evidence: v6 adapter, npm run test:v6, peer deps ^5 || ^6, cls-hooked support.
- Deferred: ALS evaluation deferred.

## Overview
Phase 4 adds Sequelize v6 compatibility while preserving the v5 behavior contract. We will implement a v6 adapter behind the existing adapter layer, pin a latest v6.x baseline for deterministic testing, and require a dedicated v6 test run before declaring support.

## Problem Statement
Sequelize v6 introduces API and behavior differences (hooks, CLS/ALS guidance, metadata access) that can break audit behavior or user attribution if handled inline. We need a safe, isolated implementation that preserves the v5 contract and explicitly documents any v6 deltas.

## Goals
- Support Sequelize v6 without breaking v5 behavior.
- Keep all ORM-specific changes isolated to the adapter layer.
- Require v6 tests as a gate before claiming compatibility.
- Preserve CLS-based user attribution via `cls-hooked` (ALS deferred).
- Define deterministic v6 testing via a pinned v6.x baseline and a dedicated test script.

## Non‑Goals
- No Sequelize v7 support.
- No ALS migration (defer until after Phase 5).
- No TypeScript/ESM refactors.
- No CI implementation (document intent only).

## Users and Stakeholders
- Maintainers: need safe v6 support without regressions.
- Consumers: require backward compatibility and stable audit semantics.
- Contributors: need clear compatibility rules and a deterministic test matrix.

## Scope
### In Scope
- v6 adapter implementation (`lib/adapters/sequelize-v6.js`).
- Adapter selection by Sequelize major version at `init`.
- `cls-hooked` integration for v6 CLS compatibility (lazy require; optional dependency).
- Dedicated v6 test script (`npm run test:v6`) with sqlite only.
- Pinned latest v6.x devDependency for reproducible testing.
- npm alias strategy for v6 testing (keep v5 as primary dependency).
- Peer dependency policy for Sequelize v5/v6 support.
- v6 compatibility notes and sign‑off checklist in docs.

### Out of Scope
- v7 support or dialect expansion.
- ALS implementation.
- CI pipeline changes (documented only).

## Functional Requirements
1) **Adapter Support**
- Add a v6 adapter that implements all adapter methods used by core logic.
- Adapter selection must be automatic based on Sequelize major version.
- No v5 behavior regressions.

2) **CLS Compatibility**
- Use `cls-hooked` behind the adapter for v6 when CLS is configured.
- Prefer lazy require with a clear error if CLS is enabled but `cls-hooked` is missing.
- Preserve existing `continuationNamespace`/`continuationKey` semantics.

3) **Testing**
- Add `npm run test:v6` to execute the full user‑journey suite against v6.
- Pin Sequelize v6.x exactly in devDependencies and document the baseline version.
- Use npm alias for v6 (e.g., `sequelize-v6`) and route v6 tests via an env flag.
- v6 tests are required for Phase 4 sign‑off.

4) **Documentation**
- Document v6 compatibility notes, deltas, and a sign‑off checklist.
- Document peerDependencies support range (`^5 || ^6`).
- Explicitly note ALS is deferred until after Phase 5.

## Non‑Functional Requirements
- v5 test suite remains green and unchanged in behavior.
- v6 tests are deterministic and stable on sqlite.
- No new runtime dependencies for v5 users.

## Implementation Notes
- Prefer a new adapter file rather than inline conditionals.
- Ensure adapter handles v6 changes in hook signatures and metadata access.
- Keep sqlite as the only required dialect for tests.
- Select adapter by module version (Sequelize package version), with an env override for v6 tests.

## Test Plan
- `npm test` (v5 baseline).
- `npm run test:v6` (pinned v6 baseline).
- Update snapshots only when intentional, documented v6 deltas exist.

## Acceptance Criteria
- All v5 tests pass without changes to behavior.
- All v6 tests pass on the pinned latest v6.x baseline.
- CLS user attribution works in v6 via `cls-hooked`.
- v6 compatibility notes and sign‑off checklist are documented.
- Peer dependency policy includes Sequelize v5/v6 range.

## Risks and Mitigations
- **Risk:** Subtle hook/metadata changes cause silent regressions.
  - **Mitigation:** Adapter isolation + full user‑journey tests on v6.
- **Risk:** CLS behavior differs in v6.
  - **Mitigation:** Use `cls-hooked` and test CLS attribution explicitly.
- **Risk:** v6 introduces unavoidable behavior deltas.
  - **Mitigation:** Document deltas and decide release strategy before shipping.

## Open Questions
- Do we keep v6 tests as a separate required script after Phase 4, or fold into default `npm test` later?

## API Verification Checklist (v6)
- Confirm hook signatures used by the adapter (create/update/destroy).
- Verify model metadata access (`getAttributes` vs `rawAttributes`).
- Verify table naming (`getTableName` return shape).
- Validate `refreshAttributes` availability and usage.

## API Verification Results (v6.37.7)
- Hooks: before/after create/update/destroy still accept `(instance, options)`.
- Metadata: `Model.getAttributes()` exists; defined models still expose `rawAttributes`.
- Table name: `getTableName()` returns a string in sqlite; may return an object when schemas are used.
- `refreshAttributes`: still present on models in v6.
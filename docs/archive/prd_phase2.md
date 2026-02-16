# PRD: Phase 2 — Sequelize Adapter Layer

## Status
- State: Done
- Evidence: Adapter layer in lib/adapters/ + selection in lib/index.js; adapter tests.
- Deferred: ALS evaluation deferred.

## Overview
Phase 2 introduces an internal adapter layer that isolates Sequelize-specific behavior behind a stable interface, enabling future v6+ support without changing the public API or runtime behavior. The adapter is a refactor-only change: the test suite must remain green, and existing behavior (including quirks) must be preserved.

## Problem Statement
Sequelize v5 and v6 differ in hooks, metadata APIs, CLS/ALS, and data type handling. Today, these differences are embedded in core logic, making upgrades risky. We need a clean seam where ORM-specific behavior can be swapped without touching the rest of the library.

## Goals
- Add a Sequelize adapter interface and a v5 implementation.
- Refactor core logic to call the adapter, preserving existing behavior.
- Keep the public API and output schema unchanged.
- Prepare explicit extension points for v6/v7 without enabling them yet.

## Non-Goals
- No Sequelize v6 support claim in this phase.
- No runtime behavior changes or feature additions.
- No tooling or dependency upgrades unless required for the refactor.

## Users and Stakeholders
- Maintainers: need isolated change surface for v6.
- Contributors: need clear boundaries for ORM logic.
- Consumers: require full backward compatibility.

## Scope
### In Scope
- Adapter interface definition and v5 adapter implementation.
- Refactor core to route all Sequelize-specific calls through adapter.
- Small internal file re-organization if needed.

### Out of Scope
- CLS replacement (ALS) implementation.
- New dialect support or matrix expansion.
- Breaking changes to options or schema.

## Functional Requirements
1) **Adapter Interface**
- Provide a single adapter module with explicit methods for:
  - Hook registration (`before/after` create/update/destroy).
  - Model metadata (`getTableName`, `getPrimaryKey`, `getAttributes`).
  - Model definition and association helpers.
  - Transaction access and option extraction.
  - Async context access (CLS namespace + keys), but do not change behavior.

2) **Refactor Core to Use Adapter**
- All Sequelize calls in `lib/index.js` must go through the adapter.
- Behavior must remain identical to Phase 1 baseline tests.

3) **Compatibility Preservation**
- Preserve existing quirks (noPaperTrail, CLS nulls, strict diff behavior, etc.).
- Preserve schema naming and revision payload shapes.

4) **Extensibility**
- Adapter should be structured to allow `v6` adapter drop-in later.
- Avoid “if v6” conditionals in core logic.

## Non-Functional Requirements
- No measurable change in test runtime.
- Minimal code churn outside `lib/`.
- No new runtime dependencies.

## Implementation Notes
- Suggested structure:
  - `lib/adapters/adapter.js` (interface contract in JSDoc)
  - `lib/adapters/sequelize-v5.js` (implementation)
  - `lib/index.js` calls adapter methods only.
- Keep existing option names; adapter may normalize internally.

## Acceptance Criteria
- All Phase 1 tests pass without modification.
- No snapshot changes.
- Adapter is the only place that touches Sequelize APIs directly.
- Clear TODO markers for v6 adapter differences.

## Risks and Mitigations
- **Risk:** Subtle behavior changes during refactor.
  - **Mitigation:** Use golden snapshots and targeted tests; refactor in small commits.
- **Risk:** Adapter becomes a thin pass-through without real separation.
  - **Mitigation:** Require all Sequelize calls to route through adapter.

## Test Plan
- Run full test suite (`npm test` / `npm test -- --coverage`).
- Confirm no snapshots change.
- Add a small adapter unit test if needed to lock interface shape.

## Open Questions
- Should the adapter live under `lib/adapters/` or `lib/adapter/`?
- Do we need a formal TypeScript interface for the adapter, or JSDoc is enough for now?
- How do we want to expose adapter versioning (internal only vs. future public hook)?
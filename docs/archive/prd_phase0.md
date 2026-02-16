# PRD: Phase 0 — Inventory and Baseline (v5)

## Status
- State: Done
- Evidence: docs/PROJECT.md (behavior + schema inventory); docs/TESTS.md (gap list → matrix); docs/PLAN.md (support policy).
- Deferred: None.

## Overview
This phase establishes an explicit, testable compatibility contract for sequelize-paper-trail on Sequelize v5. It produces a complete inventory of public API behavior and internal integration points so future refactors (adapter layer, tooling updates, v6 support) can be validated without regressions.

## Problem Statement
The library’s behavior is partly implicit and under-tested. Without a clear contract, modernization risks breaking user workflows, revision integrity, or audit compliance.

## Goals
- Define the **compatibility contract**: what must not change for v5 users.
- Produce a **full behavior and integration inventory** (hooks, schema, options, CLS usage, transactions).
- Identify **gaps** in tests and documentation.
- Establish **support policy constraints** and initial v5→v6 diff scan to inform design.

## Non-Goals
- No runtime behavior changes.
- No dependency upgrades beyond what is needed for discovery.
- No v6 support work beyond the initial diff scan.

## Users and Stakeholders
- Maintainers: need a stable baseline for refactors and releases.
- Library consumers: depend on unchanged behavior and revision data integrity.
- Contributors: need clear guidance on invariants and test expectations.

## Scope
### In Scope
- API surface inventory: `init`, `defineModels`, `hasPaperTrail`, options, defaults.
- Behavior inventory: hooks, revision fields, diff/compression, user tracking, migration option.
- Schema inventory: revision tables and fields, default names and types.
- CLS/async context behavior as currently implemented.
- Initial Sequelize v5→v6 diff scan focused on library touchpoints.
- Define support policy constraints and deprecation rules (draft).

### Out of Scope
- Code refactors or adapter layer changes.
- Tooling upgrades or dependency changes.
- New tests (beyond identifying missing coverage).

## Requirements
### Functional Requirements
- Document exact revision lifecycle behavior (create/update/destroy, ordering, revision increments).
- Document expected schema and field naming conventions.
- Document options and defaults; note side effects.
- Document transactional assumptions (current behavior).
- List CLS requirements and limitations.

### Non-Functional Requirements
- Documentation must be precise enough to guide future test writing.
- Findings must be traceable to source files or README sections.

## Deliverables
- Compatibility contract section in `PROJECT.md` (or a new dedicated doc if preferred).
- Behavior inventory notes (hooks, options, schema, side effects).
- Initial v5→v6+ diff checklist tailored to this library.
- A test gap list that drives Phase 1.

## Success Metrics
- All public-facing behaviors are explicitly listed and traceable.
- No ambiguous behavior remains undocumented for core flows.
- A reviewer can use the contract to verify whether a change is safe.

## Risks and Mitigations
- **Risk:** Missing an implicit behavior used in the wild.
  - **Mitigation:** Review README, tests, source, and known issues/PRs.
- **Risk:** Overlooking transactional or concurrency edge cases.
  - **Mitigation:** Call out uncertainties explicitly in the contract.

## Open Questions
- Which behaviors are considered “breaking” vs “acceptable change” if tightened?
- Are there known production usage patterns not documented in README/tests?

## Acceptance Criteria
- Compatibility contract drafted and reviewed.
- Inventory of options, schema, hooks, and CLS usage completed.
- v5→v6 diff scan completed at least for hook APIs, model metadata, and transaction/context handling.
- Test gap list prepared for Phase 1 planning.
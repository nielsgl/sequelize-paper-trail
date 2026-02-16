# PRD: Phase 1 — User-Centric Test Suite (v5 Baseline)

## Status
- State: Done
- Evidence: Full Jest user-journey suite with 100% coverage; snapshots + demo parity.
- Deferred: Multi-dialect and performance/stress testing (explicitly deferred).

## Overview
Phase 1 builds a comprehensive, user‑journey test suite that locks the v5 behavior of sequelize‑paper‑trail. The suite must validate real user flows (model lifecycle, revisions, options, metadata, and transactions) and produce golden outputs to detect regressions during modernization and future v6+ support.

## Problem Statement
Current tests are minimal and do not protect the behavioral contract. Without comprehensive tests, refactors and upgrades risk silent regressions in revision integrity, user attribution, and schema semantics.

## Goals
- Create a user‑centric test suite that validates all public features and configuration paths.
- Establish golden revision outputs for deterministic regression detection.
- Cover concurrency, transactional integrity, and edge cases that impact audit correctness.
- Enable a matrix‑ready test structure for future Sequelize v6+ validation.

## Non‑Goals
- No production code changes beyond what is required for tests.
- No Sequelize v6 support claims yet (tests may run in v6 later).
- No new features beyond test scaffolding.

## Users and Stakeholders
- Maintainers: need a safety net for refactors and dependency upgrades.
- Consumers: rely on backward compatibility and audit integrity.
- Contributors: need clear, deterministic test expectations.

## Scope
### In Scope
- End‑to‑end tests for all public features and options.
- Golden outputs for revisions and diffs.
- Transaction and concurrency tests for revision ordering integrity.
- Test fixtures and helpers to make scenarios deterministic.

### Out of Scope
- Adapter layer changes.
- Tooling upgrades not required for tests.
- Any API changes or deprecations.

## Functional Requirements (Test Coverage)

### 1) Basic Lifecycle
- Create / update / destroy generate revisions as expected.
- Revision increment logic is correct.
- No‑op update produces no revision.

### 2) Bulk Operations
- `bulkCreate` with individual hooks produces revisions per instance.
- `bulkUpdate` with `individualHooks: true` produces per‑instance diffs.
- `bulkDestroy` with `individualHooks: true` produces revisions.

### 3) User Attribution
- CLS userId is currently not captured in the v5 baseline (assert null to lock behavior).
- Missing userId does not block revision creation (unless fail‑hard).
- Concurrent CLS values do not leak between requests.

### 4) RevisionChange Model
- When enabled, path + diff recorded correctly.
- When disabled, no RevisionChange rows are created.

### 5) Compression and Strict Diff
- enableCompression limits document payloads to default fields (not full snapshots).
- strict vs non‑strict comparisons follow current v5 behavior (string/number changes still create revisions).

### 6) Migration Option
- enableMigration adds revisionAttribute if missing.
- disableMigration does not modify schema.

### 7) Naming and Schema Options
- underscored / underscoredAttributes behavior verified.
- UUID option creates UUID id/documentId.
- custom revisionAttribute respected.
- tableName option for revision models honored.

### 8) Paranoid / Soft Deletes
- Paranoid destroy creates a revision.
- Restore does not create a revision (current v5 baseline).

### 9) Edge Data Types
- JSON values (sqlite).
- Arrays, nulls, default values.

### 10) Transactions and Consistency
- Revisions created in same transaction as original write.
- Rollback does not leave orphan revisions.
- Parallel updates preserve correct revision order.

### 11) Exclusions and noPaperTrail
- Global exclude list is honored.
- `noPaperTrail` on update does not bypass revisions (current v5 baseline).

### 12) Failure Handling
- Hook failures do not create partial revisions.
- Logging/debug options do not alter behavior.

## Non‑Functional Requirements
- Tests must be deterministic and non‑flaky.
- Golden outputs are stable and versioned.
- Run time should be reasonable (CI‑friendly).
- Snapshot stability must be enforced (strip volatile fields, normalize UUIDs, sort keys).

## Test Artifacts and Structure
- `TESTS.md` drives the scenario list and expectations.
- Golden outputs stored alongside fixtures.
- Shared helpers to reduce duplication.

## Acceptance Criteria
- All user‑journey tests pass on Sequelize v5.
- Golden outputs exist for revision payloads and diffs.
- Coverage includes all public options and critical edge cases.

## Risks and Mitigations
- **Risk:** Flaky transaction/concurrency tests.
  - **Mitigation:** use sqlite in‑memory with deterministic sequences and explicit awaits.
- **Risk:** Golden outputs become brittle.
  - **Mitigation:** snapshot only stable fields; document expected variability.
- **Risk:** CI time increases.
  - **Mitigation:** keep fixtures small and reuse setup where possible.

## Dependencies
- Current test harness (Jest) and sqlite in‑memory configuration.
- CLS library behavior for user attribution tests.

## Open Questions
- Which dialects (if any) should be added to test matrix in Phase 1?
- Should we include performance/stress tests at this phase or defer?
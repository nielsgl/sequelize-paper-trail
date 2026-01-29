# Test Strategy and User-Journey Matrix

## Goals
- Validate behavior from a user perspective, not just line coverage.
- Lock backward-compatible behavior before refactors.
- Provide a clear acceptance suite for Sequelize v5 and future v6+ support.

## Principles
- Every public feature must have at least one end-to-end test.
- Golden outputs for revision payloads to detect regressions.
- Tests should be deterministic and avoid time-based flakiness.

## Snapshot Stability Rules
- Strip volatile fields (e.g., `id`, `createdAt`, `updatedAt`) before snapshotting.
- Normalize UUID-like values to a placeholder (`<uuid>`).
- Sort object keys recursively to avoid JSON ordering noise.
- Keep snapshots focused on user-visible behavior, not DB internals.

## User-Journey Matrix

### 1) Basic Lifecycle (Happy Path)
- Create a model with paper trail enabled, verify revision created.
- Update a model, verify revision increment and payload correctness.
- Destroy a model, verify revision created with operation = destroy.
- Verify ordering and `revisionAttribute` behavior.

### 2) Bulk Operations
- Bulk create with hooks, ensure revisions created for each instance.
- Bulk update with individual hooks enabled; verify diff per instance.
- Bulk destroy with paranoid models; verify revision behavior.

### 3) User Attribution
- CLS-based user ID is currently not recorded (assert null to lock baseline).
- Missing user ID does not break revision creation.
- Concurrent requests with different CLS values do not leak context.

### 4) RevisionChange Model
- When enabled: per-field diffs recorded correctly.
- When disabled: no RevisionChange records created.
- Verify fields and data types match expectations.

### 5) Compression and Diff Strictness
- enableCompression: limit document payloads to default fields (not full snapshots).
- enableStrictDiff: numeric/string comparisons still create revisions (baseline).

### 6) Migration Option
- enableMigration: revisionAttribute column added when missing.
- disableMigration: no migration side-effects.
- Migration works for custom `tableName`.

### 7) Naming and Schema Options
- underscored and underscoredAttributes settings.
- UUID mode for revisions when supported.
- Custom revisionAttribute name.
- Custom tableName option for Revision models.

### 8) Paranoid and Soft Deletes
- Paranoid model destroy should create a revision.
- Restore does not create a revision (current baseline).

### 9) Edge Data Types
- JSON fields (sqlite).
- Arrays, nested objects, null values.
- Default values.

### 10) Transactions and Consistency
- Revisions created in the same transaction as the original write.
- Rollback does not persist revisions.
- Concurrent updates do not corrupt revision order.

### 11) Exclusions and noPaperTrail
- Global exclude list is respected.
- noPaperTrail does not prevent revision creation for single call (current baseline).

### 12) Error and Failure Handling
- Hook failure does not create partial revisions.
- Logging/debug options do not alter behavior.

## Fixtures and Golden Data
- Use deterministic fixtures per feature.
- Persist golden JSON snapshots for revisions and diffs.
- Version golden outputs by Sequelize major when behavior differs.

## Version and Dialect Matrix
- Sequelize: v5 (required), v6 (target), v7 (evaluate).
- Dialects: sqlite (required), postgres/mysql (optional when available).
- Node LTS: all active LTS versions.

## Acceptance Criteria
- All user-journey tests pass on Sequelize v5.
- v6 tests pass (or are explicitly tracked as expected failures).
- No behavioral drift without updated golden snapshots and release notes.

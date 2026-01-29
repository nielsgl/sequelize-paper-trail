# Modernization Plan (v5-first, v6-ready)

## Goals
- Preserve backward compatibility for existing Sequelize v5 users.
- Modernize tooling, dependencies, and tests without changing runtime behavior.
- Establish a clear path to Sequelize v6+ support with minimal risk.

## Principles
- Compatibility first: behavior is a contract, verified by tests.
- Small, reversible steps with explicit release notes and migration guides.
- Separate adapter layer for ORM-specific differences.
- Each phase starts with a PRD captured in `docs/prd_{phase}.md` (kept local, not committed).

## Scope
- In: library code, dependencies, build tooling, tests/CI, documentation, release process.
- Out: new features unrelated to stability/compatibility, ORM support beyond Sequelize.

## Phases and Deliverables

### Phase 0: Inventory and Baseline (v5)
- Document public API and implicit behaviors (hooks, schema, diffing, user tracking).
- Enumerate Sequelize usage and integration points (hooks, model definition, transactions).
- Capture current limitations (composite PKs, sqlite-only tests).
- Add a compatibility contract doc (what must not change).
- Define transactional semantics (same-transaction vs out-of-band revisions) and expected ordering.
- Define data retention/indexing guidance and PII redaction expectations.
- Publish a support policy (Node LTS + Sequelize versions) and deprecation rules.
- Perform an initial v5→v6 diff scan to inform adapter boundaries and test design.

### Phase 1: Stabilize v5 and Expand Tests
- Add a user-centric test suite that validates behavior from the public API:
  - Model lifecycle: create/update/destroy, bulk ops, paranoid deletes, restores.
  - Revision outputs: schema, ordering, document snapshots vs diffs, strict diff behavior.
  - User attribution: CLS/ALS contexts, missing user IDs, concurrent requests.
  - Transactional integrity: revisions created atomically with writes, rollback behavior.
  - Concurrency: parallel updates and revision ordering correctness.
  - Configuration matrix: underscored/underscoredAttributes, UUID, tableName, revisionAttribute.
  - RevisionChange model: enabled/disabled and correctness of per-attribute diffs.
  - Migration option: enabling/disabling revision column auto-migration.
  - Edge cases: JSON/JSONB, default values, nulls, arrays, timestamps, soft deletes.
- Create fixtures and golden expectations per feature, not per file.
- Keep runtime behavior unchanged while increasing coverage.

### Phase 2: Introduce an Adapter Layer
- Add a Sequelize adapter module to isolate ORM-specific logic:
  - Hook registration
  - Model metadata access
  - Transaction handling and options
  - Column naming conventions
  - Async context handling (CLS vs ALS)
- Refactor internals to use adapter APIs.
- Keep API surface stable.

### Phase 3: Tooling and Dependency Modernization (v5-safe)
- Upgrade dev tooling (lint, tests, CI) with minimal runtime impact.
- Align Node support to active LTS.
- Harden build output (CJS or dual CJS/ESM) without changing exports.
- Publish modernization guide for contributors.
- Add release governance (deprecation windows, semver rules, support policy).

### Phase 4: Sequelize v6+ Compatibility
- Enable v6 tests as non-blocking CI initially.
- Implement adapter changes for v6 differences.
- Lock v6 behavior with tests before declaring support.
- Decide release strategy (same major vs new major).
- Perform a formal v5→v6+ API diff review and sign-off checklist before release.

### Phase 5: Release and Migration
- Publish versioned release notes and a migration guide.
- Provide deprecation warnings and safe fallbacks.
- Document any unavoidable breaking changes.

## Options and Recommendations

### Language and Typing
- Option A: Full TypeScript
  - Pros: strong types, safer refactors, better editor support.
  - Cons: build complexity, ESM/CJS interop pitfalls.
  - Recommendation: adopt after adapter layer is in place.
- Option B: JSDoc + .d.ts generation
  - Pros: lower risk, minimal refactor.
  - Cons: weaker guarantees, less maintainable long-term.
  - Recommendation: acceptable interim step if timelines are tight.

### Module Format
- Option A: CJS only
  - Pros: minimal change, safest for existing users.
  - Cons: modern ESM consumers need interop.
  - Recommendation: keep CJS during v5 stabilization.
- Option B: Dual CJS/ESM
  - Pros: modern compatibility.
  - Cons: more build and packaging complexity.
  - Recommendation: adopt when v6 support lands.

### CLS / Async Context
- Option A: continuation-local-storage (current)
  - Pros: zero behavior change for v5.
  - Cons: unmaintained, not ideal for new Node versions.
  - Recommendation: keep for v5, add abstraction.
- Option B: AsyncLocalStorage (Node)
  - Pros: maintained and standard.
  - Cons: Node LTS floor, behavioral differences.
  - Recommendation: support behind adapter with fallback.

### SQLite Test Dependency
- Option A: sqlite3@4 (current)
  - Pros: stable with v5 tests.
  - Cons: build issues on modern Node.
  - Recommendation: upgrade to sqlite3@5+ with pinned Node toolchain.

## Testing/CI Matrix (Target)
- Node LTS: current active LTS versions.
- Sequelize: v5 (required), v6 (target), v7 (evaluate).
- Dialects: sqlite (required), optional postgres/mysql if feasible.

## Risks and Mitigations
- Risk: behavioral regressions from refactors.
  - Mitigation: expand regression tests before refactors.
- Risk: v6 incompatibility hidden by adapter.
  - Mitigation: add v6 CI and golden tests.
- Risk: dependency upgrades introduce breaking behavior.
  - Mitigation: upgrade incrementally with explicit test coverage.
- Risk: data growth and performance degradation in revision tables.
  - Mitigation: index/retention guidance and stress tests on large datasets.
- Risk: PII leakage into audit logs.
  - Mitigation: redaction/allowlist guidance and tests for excluded fields.
- Risk: transactional inconsistencies and race conditions.
  - Mitigation: concurrency and rollback tests in CI.

## Open Questions
- Should we publish a legacy line for v5 once v6 is fully supported?
- How wide should the Node LTS support matrix be?
- Do we want strict PII redaction defaults (allowlist) or user-configured exclusions?

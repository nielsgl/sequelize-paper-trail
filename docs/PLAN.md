# Modernization Plan (v5-first, v6-ready)

## Immediate Next Steps (Do These First)
### 3.1.0 Minor (Node deprecation warning)
- Source of truth: `docs/prd/PRD-001-release-v3-1-0.md`
- [ ] Confirm docs + messaging are consistent (README/CHANGELOG/MIGRATION/RELEASE-POLICY).
- [ ] Run gates: `npm test -- --coverage`, `npm run test:v6`, demo snapshot parity (baseline/v5/v6).
- [ ] Tag + publish 3.1.0 via the manual Release workflow and align `release/v3` to the tag.

## Near-Term Milestone
### 4.0.0 Major (Node >=20 + Sequelize v6 bridge)
- Source of truth: `docs/prd/PRD-002-release-v4-0-0.md`
- [ ] Enforce Node >=20 (replace warning with error) and publish 4.0.0 via the manual Release workflow.
- [ ] Run gates: `npm test -- --coverage`, `npm run test:v6`, demo snapshot parity.
- [ ] Deprecate v3 on npm after v4 is confirmed stable.

## Later Milestone
### 5.0.0 Feature Line
- [ ] Draft PRD/scope for dropping Sequelize v5, keep v6, evaluate v7 experimental.
- [ ] Decide on support policy for v4 (bugfix-only) and deprecate v4 after 5.0.0.
- [ ] Schedule refactor work and add non-blocking v7 test job when ready.

## Deferred / Later Considerations
- Tooling major upgrades (Jest 30, ESLint 9, Prettier latest) after 4.0.0.
- TypeScript adoption (full vs incremental) after adapter stability.
- Multi-dialect testing (postgres/mysql) when bandwidth allows.
- Review and modernize v4/v5 example apps once those lines ship.

## Status Summary (Snapshot)
- Completed: Phases 0–4 (inventory, tests, adapter layer, v6 compatibility), demo parity suite, and v3 examples (full scenario coverage + README).
- Partial: Phase 5 (release/migration/checklist docs and CI are done; publish/tag/deprecate pending).
- Deferred: Phase 6 (tooling major upgrades) and Phase 7 (TypeScript adoption).
- Source of truth: `docs/STATUS.md`.

## Done (Evidence)
- `docs/STATUS.md`
- `docs/CI.md`
- `docs/TESTS.md`
- `docs/MIGRATION.md`
- `docs/RELEASE-CHECKLIST.md`
- `examples/v3/README.md`

## Principles
- Compatibility first: behavior is a contract, verified by tests.
- Small, reversible steps with explicit release notes and migration guides.
- Separate adapter layer for ORM-specific differences.
- Active PRDs live under `docs/prd/` and are committed to the repo.
- Keep this plan temporary; once the release policy is complete and stable, retain only `RELEASE-POLICY.md`.

## Working Conventions (Branching + Worktrees)
- **Authoritative policy:** `RELEASE-POLICY.md`.
- `master`/`main`: current stable major (latest released).
- `feature/next`: integration branch for the next major (v4 now, v5 later).
- Maintenance branches: `release/v3` (hotfix-only), `release/v4` (bugfix-only bridge).
- Backports: land fixes on the highest supported major first, then cherry-pick down to older maintenance branches.
- Use worktrees for PRDs/phases to keep changes isolated and scoped.

## Scope
- In: library code, dependencies, build tooling, tests/CI, documentation, release process.
- Out: new features unrelated to stability/compatibility, ORM support beyond Sequelize.

## Phase Reference (Detailed)

### Phase 0: Inventory and Baseline (v5)
- Document public API and implicit behaviors (hooks, schema, diffing, user tracking).
- Enumerate Sequelize usage and integration points (hooks, model definition, transactions).
- Capture current limitations (composite PKs, sqlite-only tests).
- Add a compatibility contract doc (what must not change).
- Define transactional semantics (same-transaction vs out-of-band revisions) and expected ordering.
- Define data retention/indexing guidance and PII redaction expectations.
- Publish a support policy (Node LTS + Sequelize versions) and deprecation rules.
- Perform an initial v5->v6 diff scan to inform adapter boundaries and test design.

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
- Introduce a diff adapter layer to isolate `deep-diff` (no behavior change) and prepare for a future swap to a maintained library.

### Phase 4: Sequelize v6+ Compatibility
- Enable v6 tests as non-blocking CI initially.
- Implement adapter changes for v6 differences.
- Lock v6 behavior with tests before declaring support.
- Decide release strategy (same major vs new major).
- Perform a formal v5->v6+ API diff review and sign-off checklist before release.
- Keep CLS support by using `cls-hooked` behind the adapter; defer ALS evaluation until after Phase 5.

### Phase 5: Release and Migration
- Publish versioned release notes and a migration guide.
- Ship a minor release that warns on Node <20 (init-time warning; opt-out via env).
- Ship a major release that enforces Node >=20 and declares Sequelize v6 support.
- Document any unavoidable breaking changes.

### Phase 6: Tooling Major Upgrade Review
- Evaluate upgrading dev tooling to latest majors (Jest 30, ESLint 9, Prettier latest).
- Document required config migrations and risk assessment.
- Decide go/no-go and schedule if approved.

### Phase 7: TypeScript Adoption
- Choose approach: full TS conversion vs incremental TS vs JSDoc + .d.ts.
- If full TS: define build pipeline (tsc + Babel vs tsup) and module format strategy.
- If incremental: migrate adapters/helpers first and keep runtime stable.
- Publish typed API surface and migration notes for contributors.

## Options and Recommendations (Reference)

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

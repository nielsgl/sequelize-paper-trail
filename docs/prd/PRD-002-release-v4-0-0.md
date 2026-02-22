# PRD-002: Release v4.0.0 (Bridge Line: Node>=20 + Sequelize v5/v6)

## Context
v4.x is a **bridge** line: bugfix-only, focused on getting users safely from the legacy v3 line to the v5 feature line. v4 formalizes support for **Node >= 20** and **Sequelize v5 + v6**.

## Goals
- Ship `4.0.0` as the first v4 release with explicit support guarantees:
  - Node >= 20 (enforced)
  - Sequelize `^5 || ^6` (peer deps)
- Keep behavior stable (validated by tests + demo snapshot parity).
- Deprecate v3 on npm after v4 is stable (separate post-release step).

## Non-Goals
- No Sequelize v7 support.
- No TypeScript conversion.
- No “new features”; v4 is bugfix-only.

## Support Contract (v4)
- **Node:** enforce `>=20` (hard error at runtime on `init()`; no opt-out).
- **Sequelize:** compatible with v5 and v6 (adapter layer is the seam).
- **CLS:** supported via adapter; `cls-hooked` required when CLS is used.

## Required Gates
- `npm test -- --coverage`
- `npm run test:v6`
- Demo snapshot parity across baseline/v5/v6
- CI workflow success on the v4 release branch

## Execution Plan (Checklist)
1) Cut the bridge branch:
   - Create `release/v4` from the v4 release commit (or cut from `feature/next` once v4 changes land).
2) Implement enforcement + docs:
   - Replace Node<20 warning with Node<20 **error** on `init()`.
   - Update README support policy + migration guide for v4.
3) Run gates (local + CI) and demo parity.
4) Publish v4.0.0 via `.github/workflows/release.yml` (manual only).
5) Post-release:
   - `npm deprecate` v3 major with a clear upgrade message pointing to v4/v5.
   - Keep `release/v3` hotfix-only.

## Rollback Plan
- If Node enforcement breaks unexpectedly: publish `4.0.1` with improved diagnostics (do not revert enforcement; document remediation).
- If Sequelize v6 regressions appear: patch release on `release/v4` with adapter fixes + add regression tests.

## Acceptance Criteria
- v4.0.0 published to npm.
- README + `docs/MIGRATION.md` clearly instruct Node>=20 and Sequelize v5/v6 usage.
- v3 is deprecated on npm (after v4 release is confirmed stable).

## Work Items (Mirrors `docs/STATUS.md`)

### PRD-002 WI-005 Rename default branch and reconcile workflows/docs
- Status: `In Progress` (mirrors `docs/STATUS.md`)

### PRD-002 WI-001 Node >=20 enforcement design and impact checklist
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-002 WI-002 v4 docs, migration, and support-policy updates
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-002 WI-003 Create `release/v4` branch and CI gate contract setup
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-002 WI-004 v4 release workflow execution and v3 deprecate plan
- Status: `Planned` (mirrors `docs/STATUS.md`)

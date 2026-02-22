# PRD-001: Release v3.1.0 (Legacy Line + Node<20 Deprecation)

## Context
This PRD captures the work required to ship `sequelize-paper-trail@3.1.0` as the **v3 legacy** line. v3 is **hotfix-only** going forward, but `3.1.0` establishes the deprecation messaging + CI gates that protect current users and sets up the upgrade path to v4/v5.

## Goals
- Publish v3.1.0 from `master` using the manual GitHub Actions release workflow.
- Keep runtime behavior stable for Sequelize v5 users (no behavioral regressions).
- Deprecate **Node <20** at runtime (warning) with a documented opt-out.
- Ensure release quality is enforced by repeatable gates (coverage, v6 suite, demo snapshot parity).

## Non-Goals
- No breaking API changes (v3 remains the “legacy” compatibility line).
- No TypeScript, ESLint/Jest major upgrades, or deep-diff replacement in this PRD.

## Release Line Policy (v3)
- v3.x is **hotfix-only** after 3.1.0 ships.
- New features land in v5; v4 is a short-lived bridge.
- v3 users get explicit messaging (README + npm warnings + migration guide).

## Quality Gates (Must Pass)
- Local:
  - `npm test -- --coverage`
  - `npm run test:v6`
- CI:
  - GitHub Actions `CI` workflow must pass on the release commit.
  - GitHub Actions `Demo Snapshot Parity` workflow must pass for baseline/v5/v6.
- Evidence retention:
  - Coverage summary/artifacts are captured and linked in release evidence.
  - Release notes include migration/support-policy deltas for this release.

## User-Facing Messaging (Must Be True)
- README “Supported Versions” clearly states:
  - v3.x is legacy/hotfix-only.
  - Node <20 is deprecated (warning) and will be removed in v4.
- Migration guide (`docs/MIGRATION.md`) includes:
  - How to suppress warning: `SUPPRESS_NODE_DEPRECATION=1`.
  - Upgrade path: v3 -> v4 (bridge) -> v5 (feature line).

## Execution Plan (Checklist)
1) Confirm docs are correct and consistent:
   - `README.md`
   - `CHANGELOG`
   - `RELEASE-POLICY.md`
   - `docs/MIGRATION.md`
   - `docs/CI.md`
2) Run local gates:
   - `npm test -- --coverage`
   - `npm run test:v6`
3) Run demo parity gate (recommended from `master`):
   - Trigger `.github/workflows/demo-parity.yml` and validate “mismatches: 0”.
4) Release using GitHub Actions (manual):
   - Trigger `.github/workflows/release.yml` on `master`
   - Use `dry-run=true` first, then `dry-run=false`
   - Confirm npm package contents (dist built, correct `main`, correct `peerDependencies`)
5) Tag and verify:
   - Create `v3.1.0` tag from `master` (or via the workflow if it tags)
   - Validate `npm view sequelize-paper-trail@3.1.0` and `npm pack` integrity
6) Align maintenance branch:
   - Fast-forward `release/v3` to the v3.1.0 tag (or set it to the tag) for future hotfix-only patches.

## Rollback Plan
- If publish is wrong: unpublish only if allowed and within npm policy; otherwise publish `3.1.1` patch to fix packaging/docs.
- If runtime warning is noisy/incorrect: patch-release on `release/v3` to adjust messaging (no behavior changes).

## Acceptance Criteria
- v3.1.0 is published to npm from `master` via the manual workflow.
- All quality gates pass (coverage, v6 suite, demo parity).
- `release/v3` points at the v3.1.0 tag and is protected by the required checks.

## Work Item Mirror Status

### PRD-001 WI-001 Orchestrator bootstrap for PRD-001
- Status: `In Progress` (mirrors `docs/STATUS.md`)

### PRD-001 WI-002 Docs and messaging consistency pass
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-001 WI-003 Release gates and evidence
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-001 WI-004 Manual release run and tag verification
- Status: `Planned` (mirrors `docs/STATUS.md`)

### PRD-001 WI-005 Align `release/v3` and protection evidence
- Status: `Planned` (mirrors `docs/STATUS.md`)

# Release Policy

## Purpose
Define how we maintain, release, and deprecate versions of sequelize-paper-trail. This file is the long-term reference; `docs/PLAN.md` is temporary and can be removed once this policy is stable.

## Supported Release Lines
- **v3.x (legacy):** hotfix-only line for critical fixes. No new features.
- **v4.x (bridge):** bugfix-only line supporting **Sequelize v5 + v6** and **Node >= 20**.
- **v5.x (feature line):** primary development line, **Sequelize v6** (v7 experimental later), **Node >= 20**.

## Deprecation & Warnings
- **Install-time deprecation:** After a new major ships, deprecate the prior major with `npm deprecate` and a clear migration message.
- **Runtime warnings:** v3.1.0 emits a Node <20 runtime warning once on `init()` (opt-out: `SUPPRESS_NODE_DEPRECATION=1`).
- **Policy messaging:** README + CHANGELOG + migration notes must call out support levels and upgrade paths.

## Versioning Strategy
- **Minor releases:** new warnings, documentation, safe tooling changes, and additive behavior that does not break API/behavior.
- **Major releases:** Node/Sequelize support changes or any breaking behavior.
- **Patch releases:** urgent hotfixes only for v3.x; bugfix-only for v4.x; regular fixes for v5.x.

## Quality Gates (Required)
- `npm test -- --coverage` (coverage must pass)
- `npm run test:v6` (required for `main`, `feature/next`, and `release/v4`; optional for `release/v3`)
- **Demo snapshot parity** across baseline/v5/v6
- CI workflow success on the release branch
- Security evidence gate (required before release approval):
  - `npm audit --omit=dev --json` shows zero runtime/prod vulnerabilities,
  - full `npm audit --json` findings are triaged,
  - unresolved high/critical dev-tooling findings have explicit exceptions with owner + follow-up target WI/version.

## Release Flow
All publishing is manual via the Release workflow; no branch push should auto-publish.

### v3.x (legacy)
- Only critical fixes.
- Publish patch releases (e.g., 3.1.1) with explicit deprecation warning.
- Keep deprecation language consistent in README/CHANGELOG.

### v4.x (bridge)
- Bugfix-only. No new features.
- Maintain Sequelize v5 + v6 compatibility.
- Publish major (4.0.0), then patch releases as needed.

#### v4 Bridge Operating Policy (Enforced)
- Required runtime contract:
  - Node `<20` is unsupported and must fail fast at runtime (`ERR_UNSUPPORTED_NODE_VERSION`).
  - Sequelize support remains limited to v5 and v6 adapters for the full v4 line.
- Allowed change classes:
  - correctness bugfixes,
  - compatibility fixes for Sequelize v5/v6 and Node>=20,
  - documentation and release-process clarifications.
- Disallowed change classes:
  - net-new features,
  - support expansion to new Sequelize majors,
  - behavior rewrites that belong to v5 line planning.
- Documentation ownership across PRD-002:
  - WI-002 owns support-policy and migration wording alignment,
  - WI-004 owns release-note and `CHANGELOG` finalization for the release event.

### v5.x (feature)
- Primary development line.
- Drop Sequelize v5 support; v6 is default; evaluate v7 experimentally.
- Publish major (5.0.0), then standard minor/patch cadence.

## Branching & Backports
### Branch Roles (Authoritative)
- `main`: current stable major (latest released).
- `feature/next`: integration branch for the next major.
- `release/v3`: maintenance for v3.x hotfixes (critical only).
- `release/v4`: maintenance for v4.x bugfix-only bridge.

### Branch Protection (Required)
- Protect `main`, `release/v3`, and `release/v4`.
- Require the `Test (v5 + optional v6)` status check to pass before merge.
- Require PR reviews for changes to release branches.

### How Releases Flow
1. **Normal work** lands on `feature/next` (future major) or `main` (current major).
2. **Release branches** are cut from the appropriate major line when needed:
   - v3 hotfixes: `release/v3` (cut from the last v3 tag).
   - v4 bugfixes: `release/v4` (cut from the last v4 tag).
3. **Tags** are always created from the release branch or `main` for that major.
4. **Backports**: land fixes on the highest supported major first, then cherry-pick down to older maintenance branches when relevant.

### Backport Rules
- If a fix applies to multiple supported majors, **land it in the highest supported major first** and cherry-pick to older maintenance branches.
- Do **not** merge older maintenance branches upward; always cherry-pick.
- Hotfixes for v3 should not introduce new dependencies or behavior changes.

## Worktrees & PRD Workflow
- Active PRDs live in `docs/prd/` and use `PRD-<NNN>-slug.md` (committed).
- Historical PRDs are archived under `docs/archive/`.
- Use worktrees to isolate phases and keep changes scoped.

## Required Documentation Updates per Release
- README support policy section
- CHANGELOG entry
- Migration guide (if behavior or support changes)
- CI status and gate results recorded
- For PRD-002 sequencing: WI-002 updates support-policy/migration wording; WI-004 owns release-note and `CHANGELOG` finalization.

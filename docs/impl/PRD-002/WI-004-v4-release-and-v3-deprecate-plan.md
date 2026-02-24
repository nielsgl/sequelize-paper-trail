# PRD-002 WI-004 - v4 Release And v3 Deprecate Plan

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-003`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Execute v4.0.0 release end-to-end with complete evidence trail, then apply controlled v3 deprecation messaging on npm.

## In Scope

- Version bump on `release/v4` to `4.0.0` with committed release candidate SHA.
- Manual release workflow execution (dry-run then publish).
- npm publish verification (version/tag/package metadata).
- git tag/release commit integrity verification.
- GitHub release entry creation so the releases page reflects v4 as latest.
- `npm deprecate` plan and execution for v3 major line.
- Rollback decision tree documentation for release failures.

## Out Of Scope

- New runtime feature work.
- Branch policy redesign beyond release execution needs.
- Tooling-major security remediation (tracked under PRD-004).

## Execution Branch Contract

- Release execution branch: `release/v4` only.
- `main` may continue receiving development commits before/during release prep, but those commits are not part of the v4 release unless cherry-picked or merged into `release/v4`.
- Return-to-main rule: after v4 release verification, tag/deprecation steps, and WI-004 close-out are complete, switch active development back to `main`.

## Required Release Inputs/Constraints

- Workflow: `.github/workflows/release.yml`
- Target ref: `release/v4` only (no v4 publish from `main`).
- Required inputs:
  - `version=4.0.0`
  - `dist-tag=latest` (unless explicitly approved alternative)
  - `dry-run=true` first, then `dry-run=false`
  - `skip-v6=false` (v4 must run v6 suite)
- Release candidate SHA lock:
  - record `origin/release/v4` SHA before dry-run,
  - verify same SHA before publish.

## Required Deprecation Policy

- Deprecate only v3 major range after v4 release verification is complete.
- Deprecation message must include:
  - upgrade target (`v4` bridge and/or `v5` feature line),
  - brief reason (support/runtime policy),
  - migration-doc reference.
- Command template:
  - `npm deprecate "sequelize-paper-trail@<4.0.0" "v3 is legacy. Upgrade to v4 (bridge) or v5 (feature line). See docs/MIGRATION.md."`

## Non-Sufficient Completion Rule

The following is not sufficient:

- publish command without workflow evidence,
- tag existence without commit integrity check,
- deprecate message draft without execution or explicit deferred decision,
- release without required demo parity pass evidence,
- release without `CHANGELOG` and release notes finalization,
- npm publish without corresponding GitHub release entry update.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Bump `package.json`/lockfile to `4.0.0` on `release/v4` and commit release candidate.
- [ ] Record release candidate SHA and verify it remains unchanged before publish.
- [ ] Run release workflow dry-run and record run evidence.
- [ ] Run release workflow publish execution and record run evidence.
- [ ] Run demo parity workflow for release candidate and record pass evidence (`mismatches: 0`).
- [ ] Verify npm package visibility and metadata integrity for `4.0.0`.
- [ ] Create/push `v4.0.0` tag (if not created by tooling) and verify tag points to expected release commit.
- [ ] Create/update GitHub release entry for `v4.0.0` so Releases page latest release is current.
- [ ] Finalize `CHANGELOG` and release notes content for v4.0.0 before publish sign-off.
- [ ] Execute or explicitly approve deferred `npm deprecate` for v3 with final message text.
- [ ] Record rollback/support decision tree outcome for any failed step.
- [ ] Reconcile `docs/STATUS.md`, PRD mirror status, and WI evidence summary at close-out.

## Verification / Evidence

- [ ] Workflow evidence:
  - dry-run run URL + conclusion + key logs
  - publish run URL + conclusion + key logs
- [ ] Release candidate SHA evidence:
  - pre-dry-run `git rev-parse origin/release/v4`
  - pre-publish `git rev-parse origin/release/v4` (must match)
- [ ] Demo parity evidence:
  - workflow run URL + conclusion
  - parity summary (`mismatches: 0`) captured
- [ ] npm evidence:
  - `npm view sequelize-paper-trail@4.0.0 version`
  - `npm view sequelize-paper-trail dist-tags --json`
  - package metadata checks (`main`, peer deps, files) as applicable
- [ ] Tag/repo evidence:
  - `git rev-parse v4.0.0^{}` matches intended release commit
  - release notes URL/reference
  - GitHub release URL/reference for `v4.0.0` (latest designation confirmed)
- [ ] Docs/release-note evidence:
  - `CHANGELOG` includes v4.0.0 entry with migration/support highlights
  - release notes include gate evidence links and upgrade guidance
- [ ] Deprecation evidence:
  - executed `npm deprecate` command and exact message text,
  - verification output (or explicitly approved defer decision with owner/date target).
- [ ] Rollback evidence:
  - if failure occurred, documented branch of decision tree and follow-up action.

## Rollback Decision Tree (Required)

- Publish failed before package visible:
  - fix root cause, rerun workflow; do not advance tag/deprecate steps.
- Publish succeeded but metadata incorrect:
  - publish corrective patch (`4.0.1`) and document issue.
- Deprecate failed:
  - keep release done, open follow-up WI with owner and target completion window.

## Acceptance Criteria

- v4.0.0 is published and verifiably installable from npm.
- Publish executed from `release/v4` and not from `main`.
- Release workflow evidence for dry-run and publish is attached.
- Demo parity evidence is attached and shows no mismatches for required comparison set.
- Tag integrity and release notes references are captured.
- GitHub Releases page is updated with `v4.0.0` release entry and current latest release marker.
- `CHANGELOG` and release notes are finalized and linked.
- v3 deprecation step is either executed with evidence or explicitly deferred with tracked owner/follow-up.
- Post-release execution context is switched back to `main` for ongoing development.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-004 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

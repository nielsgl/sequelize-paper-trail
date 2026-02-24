# PRD-005 WI-005 - Publish v5.0.0, Tag, Release, and Post-Release Actions

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-005 WI-004`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Execute the v5.0.0 release transaction end-to-end and finalize post-release policy actions.

## Tasks

- [ ] Bump release metadata to `5.0.0` on the approved release branch.
- [ ] Run release workflow dry-run with locked inputs.
- [ ] Run release workflow publish with locked inputs.
- [ ] Verify npm package availability and dist-tags.
- [ ] Create/push `v5.0.0` tag and verify tag SHA.
- [ ] Create GitHub release entry and verify it is latest.
- [ ] Execute or explicitly defer v4 deprecation command with owner/date.
- [ ] Update `docs/STATUS.md` and PRD records with final evidence and completion state.

## Required Publish Inputs (Must Be Recorded)

- workflow ref branch
- `version=5.0.0`
- `dist-tag=latest`
- `dry-run=true/false`
- `skip-v6=false`

## Verification / Evidence

- [ ] Dry-run and publish workflow URLs with conclusions.
- [ ] `npm view sequelize-paper-trail@5.0.0 version` output.
- [ ] `npm view sequelize-paper-trail dist-tags --json` output.
- [ ] Tag verification (`git rev-parse v5.0.0^{}`).
- [ ] GitHub release URL.
- [ ] v4 deprecation evidence or approved deferred record.

## Acceptance Criteria

- `5.0.0` is published and marked as latest.
- Tag and GitHub release are aligned to release commit.
- Post-release policy actions are complete or explicitly deferred with tracking metadata.
- PRD-005 can be marked done with no untracked release steps.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-005 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-005 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

# PRD-002 WI-003 - Release/v4 Branch And CI Contract

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Create and verify `release/v4` branch strategy and CI/protection contract for the v4 line.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Create `release/v4` branch from approved v4 release commit.
- [ ] Define required CI checks for v4 maintenance.
- [ ] Configure branch protection settings for `release/v4`.
- [ ] Document backport/cherry-pick flow between active lines.

## Verification / Evidence

- [ ] branch exists and tracks expected remote.
- [ ] required checks match policy.
- [ ] protection settings evidence recorded.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

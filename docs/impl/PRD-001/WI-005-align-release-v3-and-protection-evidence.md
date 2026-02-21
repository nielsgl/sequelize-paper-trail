# PRD-001 WI-005 - Align Release/v3 And Protection Evidence

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-004`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Align `release/v3` to the `v3.1.0` release point and capture branch-protection evidence.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-005 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Confirm `release/v3` points to the intended commit/tag.
- [ ] Verify branch protection requirements and required checks.
- [ ] Record evidence of configured protection behavior.
- [ ] Record hotfix-only support reminder for v3 line.

## Verification / Evidence

- [ ] `git rev-parse release/v3`
- [ ] `git rev-parse v3.1.0`
- [ ] branch protection screenshot or API evidence reference.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-005 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

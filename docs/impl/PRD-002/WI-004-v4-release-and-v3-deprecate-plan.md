# PRD-002 WI-004 - v4 Release And v3 Deprecate Plan

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-003`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Run v4 release flow and define post-release `npm deprecate` plan for v3 packages.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Execute manual release workflow for v4.0.0.
- [ ] Verify npm publish and tag integrity.
- [ ] Draft/execute `npm deprecate` message for v3 line.
- [ ] Record rollback and support messaging if issues are found.

## Verification / Evidence

- [ ] workflow run URL and status.
- [ ] npm visibility for `4.0.0`.
- [ ] deprecate command and message evidence.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-004 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

# PRD-003 WI-002 - Local Diff Adapter Compatibility Proof

- PRD: `docs/prd/PRD-003-deep-diff-replacement.md`
- Depends on: `PRD-003 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Implement local diff adapter behavior and prove compatibility against golden fixtures.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-003 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Implement adapter behavior to satisfy golden fixture matrix.
- [ ] Compare adapter output with baseline behavior.
- [ ] Record compatibility proof points and any intentional exceptions.
- [ ] Ensure no regression in current test suites.

## Verification / Evidence

- [ ] targeted diff fixture suite output.
- [ ] full test run evidence for affected suites.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-003 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

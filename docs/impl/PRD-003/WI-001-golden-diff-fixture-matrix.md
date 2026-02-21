# PRD-003 WI-001 - Golden Diff Fixture Matrix

- PRD: `docs/prd/PRD-003-deep-diff-replacement.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Create a golden fixture matrix that locks current diff behavior before dependency replacement.

Coverage targets:

- nested objects,
- arrays and ordering,
- null/undefined transitions,
- type changes and strict-diff cases.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-003 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Add fixture cases for all identified behavior classes.
- [ ] Add snapshot/assertion output for deterministic expected diffs.
- [ ] Verify fixtures pass against current adapter behavior.
- [ ] Record known edge-cases that must not drift.

## Verification / Evidence

- [ ] fixture test run output with pass status.
- [ ] snapshot references checked into repo.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-003 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

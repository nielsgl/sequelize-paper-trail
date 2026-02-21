# PRD-001 WI-003 - Release Gates And Evidence

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Execute release quality gates for v3.1.0 and record reproducible evidence.

Required gates:

- `npm test -- --coverage`
- `npm run test:v6`
- demo snapshot parity suite

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Run required test gates from clean environment.
- [ ] Capture pass/fail and command outputs.
- [ ] Capture and retain coverage artifacts as release evidence.
- [ ] Store evidence references in release docs/checklist.
- [ ] Record any non-determinism and mitigation steps.

## Verification / Evidence

- [ ] `npm test -- --coverage`
- [ ] coverage artifact retained and linked (summary + location)
- [ ] `npm run test:v6`
- [ ] demo parity command(s) and resulting snapshot-diff summary

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

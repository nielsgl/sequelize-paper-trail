# PRD-005 WI-002 - v5 Runtime Support Matrix and Migration Contract

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-005 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Finalize and validate runtime compatibility contract for v5 (Node/Sequelize matrix + migration expectations from v4).

## Tasks

- [ ] Confirm Node >=20 runtime enforcement behavior remains correct for v5.
- [ ] Confirm Sequelize v6 supported path is fully validated.
- [ ] If Sequelize v7 is mentioned, label as experimental-only with explicit non-guarantees.
- [ ] Define migration contract from v4 to v5 (breaking/non-breaking behaviors).
- [ ] Capture required user validation checklist for adopters.

## Verification / Evidence

- [ ] Matrix table in this WI with explicit support labels.
- [ ] Test evidence references for supported matrix rows.
- [ ] Migration contract section committed in `docs/MIGRATION.md`.

## Acceptance Criteria

- Runtime support policy is explicit and test-backed.
- Migration expectations are actionable and unambiguous.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

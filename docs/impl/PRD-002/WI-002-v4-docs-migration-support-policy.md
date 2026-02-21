# PRD-002 WI-002 - v4 Docs, Migration, And Support Policy

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Update docs for v4 bridge release (Sequelize v5+v6, Node >=20) and support policy.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Update README support matrix for v4 bridge behavior.
- [ ] Update migration notes from v3 to v4.
- [ ] Update `RELEASE-POLICY.md` for line ownership and maintenance mode.
- [ ] Update release checklist for v4 release artifacts.

## Verification / Evidence

- [ ] `rg -n "v4|Node >=20|Sequelize v6|bridge" README.md docs/MIGRATION.md RELEASE-POLICY.md docs/RELEASE-CHECKLIST.md`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

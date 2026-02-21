# PRD-001 WI-001 - Orchestrator Bootstrap For PRD-001

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Bootstrap the orchestration primitives for `PRD-001`:

- canonical index wiring,
- runtime status board structure,
- implementation-plan wiring.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Verify `docs/INDEX.md` reflects PRD/WI wave ordering.
- [ ] Verify `docs/STATUS.md` has required runtime sections.
- [ ] Verify `docs/impl/README.md` conventions match orchestrator contract.
- [ ] Ensure `PRD-001` WI file set exists (`WI-001..WI-005`).

## Verification / Evidence

- [ ] `rg -n "PRD-001 WI-00[1-5]" docs/STATUS.md docs/INDEX.md`
- [ ] `rg --files docs/impl/PRD-001 | sort`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

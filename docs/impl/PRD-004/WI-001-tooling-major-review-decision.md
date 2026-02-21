# PRD-004 WI-001 - Tooling Major Review Decision

- PRD: `docs/prd/PRD-004-tooling-major-review.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Create a formal decision record for tooling-major upgrades (Jest 30, ESLint 9, Prettier latest).

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-004 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Inventory current toolchain constraints and config deltas.
- [ ] Assess compatibility/risk for each major upgrade.
- [ ] Propose rollout ordering and fallback plan.
- [ ] Record final decision (`go`, `no-go`, or `defer`) with rationale.

## Verification / Evidence

- [ ] Decision note linked in `docs/PLAN.md` and reflected in `docs/STATUS.md`.
- [ ] Risk summary includes test/lint/format impact surface.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-004 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

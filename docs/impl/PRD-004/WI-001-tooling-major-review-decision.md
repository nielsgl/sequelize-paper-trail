# PRD-004 WI-001 - Tooling Major Decision Record

- PRD: `docs/prd/PRD-004-tooling-major-review.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Produce a decision-complete tooling strategy for Jest/ESLint/Prettier and vulnerability remediation ordering, with zero ambiguity for WI-002 implementation.

## Scope

- Evaluate upgrade feasibility and migration impact.
- Define exact rollout order and fallback path.
- Classify risks as release-blocking or non-blocking for PRD-005.

## Tasks

- [ ] Inventory current toolchain versions and pinned constraints.
- [ ] Assess major upgrade deltas:
  - Jest 30 migration requirements,
  - ESLint 9 flat-config impact,
  - Prettier major impact and lint/prettier plugin interactions.
- [ ] Map each deferred vulnerability from PRD-002 WI-006 to one remediation path.
- [ ] Produce final decision table with one outcome per area: `go`, `no-go`, or `defer`.
- [ ] Define WI-002 execution order and rollback path.

## Required Deliverable Format

Decision table must include columns:

- component,
- current version,
- target version,
- decision (`go`/`no-go`/`defer`),
- blocking risks,
- migration notes,
- owner,
- target WI/release.

## Non-Sufficient Completion

- Generic recommendation text without concrete decision rows.
- Missing owner/target for deferred items.
- No explicit statement whether PRD-005 can proceed.

## Verification / Evidence

- [ ] Decision table committed in this WI file.
- [ ] Link references to impacted config/files.
- [ ] Explicit handoff checklist for WI-002.

## Acceptance Criteria

- WI-002 can execute without making new strategic decisions.
- PRD-005 blocker/non-blocker status is explicit for tooling/security items.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-004 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-004 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

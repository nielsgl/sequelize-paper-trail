# PRD-005 WI-003 - v5 Docs, Migration, and Examples Refresh

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-005 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Update public and maintainer-facing docs/examples so v5 usage and migration are clear before release execution.

## Tasks

- [ ] Update `README.md` support-line section to reflect v5 as current feature line.
- [ ] Update `docs/MIGRATION.md` with v4 -> v5 upgrade checklist.
- [ ] Update `examples/README.md` index and package-source guidance for v5 lifecycle.
- [ ] Ensure docs map (`README` documentation map) references any new/changed release docs.
- [ ] Verify no stale v4-only statements remain where v5 should be authoritative.

## Verification / Evidence

- [ ] Diff references for all updated docs.
- [ ] Explicit checklist confirming doc consistency across README/MIGRATION/RELEASE-POLICY.
- [ ] Example run instructions validated for current supported lines.

## Acceptance Criteria

- A new user can determine supported versions and migration path from docs alone.
- No contradictory support-policy messaging remains.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

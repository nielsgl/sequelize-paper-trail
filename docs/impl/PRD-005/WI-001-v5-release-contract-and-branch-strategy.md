# PRD-005 WI-001 - v5 Release Contract and Branch Strategy Lock

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-003 WI-003`, `PRD-004 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Lock decision-complete release rules for v5 so all downstream WIs execute without policy ambiguity.

## Tasks

- [ ] Define authoritative release source branch for v5 (`main` or `release/v5`) and lock it.
- [ ] Define branch protection/check requirements for the chosen release branch.
- [ ] Define backport rules across `release/v4` and v5 line after release.
- [ ] Define post-release default development branch policy (`main` vs `feature/next`).
- [ ] Record all decisions in release policy docs with no conflicting wording.

## Verification / Evidence

- [ ] Decision record in this WI with explicit branch names and rules.
- [ ] `RELEASE-POLICY.md` and `docs/CI.md` updated consistently.

## Acceptance Criteria

- Downstream v5 WIs can execute without branch-policy decisions.
- No conflicting release-source statements remain in docs.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

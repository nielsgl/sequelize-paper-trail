# PRD-001 WI-002 - Docs And Messaging Consistency

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Make release-line messaging consistent across docs and policy files.

Target files:

- `README.md`
- `CHANGELOG`
- `docs/MIGRATION.md`
- `RELEASE-POLICY.md`
- `docs/CI.md`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Align version support language for v3/v4/v5.
- [ ] Align Node policy language for current and upcoming majors.
- [ ] Reconcile CLS migration guidance (`cls-hooked` for v6, legacy v5 path).
- [ ] Align release gate language (`coverage`, `test:v6`, demo parity).
- [ ] Remove contradictory phrasing between checklist/policy/readme.

## Verification / Evidence

- [ ] `rg -n "v3|v4|v5|Node|cls-hooked|continuation-local-storage|demo snapshot parity|test:v6" README.md CHANGELOG docs/MIGRATION.md RELEASE-POLICY.md docs/CI.md`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`
- `external-dependency-blocked`

# PRD-004 WI-002 - Remediate Deferred Security Findings

- PRD: `docs/prd/PRD-004-tooling-major-review.md`
- Depends on: `PRD-004 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Remediate deferred high/critical dev-tooling vulnerabilities documented in `PRD-002 WI-006`, based on the decision output from `PRD-004 WI-001`.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-004 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Import approved upgrade path from `PRD-004 WI-001`.
- [ ] Apply tooling dependency upgrades and required config migrations.
- [ ] Re-run lint/test/release-tooling validation.
- [ ] Update exception list by closing resolved items and carrying only intentional deferrals.

## Verification / Evidence

- [ ] Updated vulnerability snapshot with before/after counts.
- [ ] `npm run lint` and test suite results captured.
- [ ] Remaining exceptions (if any) include risk/owner/target version.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-004 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

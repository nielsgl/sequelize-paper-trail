# PRD-004 WI-002 - Execute Tooling/Security Remediation

- PRD: `docs/prd/PRD-004-tooling-major-review.md`
- Depends on: `PRD-004 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Apply the approved remediation plan from WI-001 and deliver updated tooling/security evidence suitable for v5 release readiness review.

## Scope

- Implement approved tooling updates/config migrations.
- Re-run full validation gates.
- Refresh vulnerability snapshots and exception list.

## Required Inputs

- WI-001 decision table (final, approved).
- Deferred findings list from PRD-002 WI-006.

## Tasks

- [ ] Apply all WI-001 `go` decisions (dependency + config updates).
- [ ] Apply only explicitly approved `defer` exceptions (no silent carry-over).
- [ ] Run `npm run lint` and fix any migration fallout.
- [ ] Run `npm test -- --coverage`.
- [ ] Run `npm run test:v6`.
- [ ] Capture `npm audit --json` and `npm audit --omit=dev --json` outputs.
- [ ] Update exception list with before/after counts and residual risk entries.
- [ ] Declare PRD-005 release impact status: `blocking` or `non-blocking` with rationale.

## Non-Sufficient Completion

- Upgrading packages without updated vulnerability evidence.
- Carrying exceptions without owner/target.
- Passing tests but leaving lint/config broken.

## Verification / Evidence

- [ ] Before/after vulnerability summary table.
- [ ] Lint/test/test:v6 outputs.
- [ ] Updated exception list with owner + target version/date.
- [ ] Explicit PRD-005 release impact statement.

## Acceptance Criteria

- Approved remediation work is implemented and validated.
- Security posture is clearly improved or explicitly exceptioned.
- PRD-005 can consume this output without ambiguity.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-004 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-004 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

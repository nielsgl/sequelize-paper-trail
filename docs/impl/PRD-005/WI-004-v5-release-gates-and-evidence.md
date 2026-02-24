# PRD-005 WI-004 - v5 Release Gates and Evidence Pack

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-005 WI-003`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Execute all pre-publish gates for v5 and assemble a complete evidence pack before publish approval.

## Required Gates

- `npm run lint`
- `npm test -- --coverage`
- `npm run test:v6`
- Demo parity workflow
- Examples smoke workflow
- Security evidence (`npm audit --json`, `npm audit --omit=dev --json`)

## Tasks

- [ ] Run each required gate from the release candidate commit.
- [ ] Capture command output/run URLs for every gate.
- [ ] Record before-publish candidate SHA lock.
- [ ] Validate release checklist items are complete before WI-005 starts.
- [ ] Explicitly classify any residual security exceptions as blocking/non-blocking for publish.

## Verification / Evidence

- [ ] Gate output artifacts and workflow URLs.
- [ ] Candidate SHA evidence (`git rev-parse` pre/post gate window).
- [ ] Security snapshot + exception status table.

## Acceptance Criteria

- All required gates are green.
- Evidence pack is complete and linked in this WI.
- WI-005 can execute without additional test/security decisions.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-004 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

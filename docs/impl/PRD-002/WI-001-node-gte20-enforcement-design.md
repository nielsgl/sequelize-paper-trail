# PRD-002 WI-001 - Node >=20 Enforcement Design

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Define the v4 runtime enforcement behavior for Node >=20 and impact checklist.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Define runtime error semantics for unsupported Node versions.
- [ ] Define package metadata enforcement (`engines` and docs messaging).
- [ ] Define migration impact checklist for current users.
- [ ] Define test coverage expectations for enforcement path.

## Verification / Evidence

- [ ] design decision documented in PRD and migration docs.
- [ ] edge-case behavior listed for unsupported runtimes.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

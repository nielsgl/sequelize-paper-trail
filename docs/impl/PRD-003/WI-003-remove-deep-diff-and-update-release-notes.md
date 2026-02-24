# PRD-003 WI-003 - Remove `deep-diff` + Finalize Release Evidence

- PRD: `docs/prd/PRD-003-deep-diff-replacement.md`
- Depends on: `PRD-003 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Complete dependency removal and close-out documentation after compatibility has already been proven in WI-002.

## Scope

- Remove `deep-diff` from runtime dependency declarations.
- Ensure lockfile and install graph are consistent.
- Record completion evidence in status/release docs.

## Required Preconditions

- WI-002 is marked done with full parity evidence.
- No unresolved compatibility exceptions are open.

## Tasks

- [ ] Remove `deep-diff` from `package.json` dependencies.
- [ ] Regenerate/update lockfile without `deep-diff` runtime entry.
- [ ] Run `npm test -- --coverage`.
- [ ] Run `npm run test:v6`.
- [ ] Run demo parity and confirm mismatch count remains zero.
- [ ] Update `CHANGELOG` with user-facing note: dependency maintenance change, no migration action required.
- [ ] Update `docs/STATUS.md` with PRD-003 completion evidence.

## Non-Sufficient Completion

The following do **not** satisfy this WI:

- Removing dependency without lockfile normalization.
- Removing dependency without full gate reruns.
- Updating docs without executable verification evidence.

## Verification / Evidence (Required)

- [ ] `package.json` diff confirms `deep-diff` removed.
- [ ] Lockfile diff confirms runtime graph cleanup.
- [ ] v5 + v6 test outputs.
- [ ] Demo parity run URL + mismatch summary.
- [ ] Updated changelog/status references.

## Acceptance Criteria

- `deep-diff` is absent from runtime dependencies.
- All gates pass after removal.
- Documentation is updated and traceable.
- PRD-003 can be marked complete with no unresolved action items.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-003 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-003 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

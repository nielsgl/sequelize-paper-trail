# PRD-003 WI-002 - Local Diff Adapter Implementation + Compatibility Proof

- PRD: `docs/prd/PRD-003-deep-diff-replacement.md`
- Depends on: `PRD-003 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Implement the local adapter replacement in code and prove compatibility against the WI-001 fixture matrix with zero behavior drift.

## Scope

- Replace `deep-diff` adapter usage with local implementation behind existing seam.
- Preserve output contract and failure behavior.
- Produce proof evidence that fixture outputs are unchanged.

## Implementation Requirements

1. Keep adapter boundary stable (`lib/adapters/diff.js` call shape unchanged unless explicitly documented and backward compatible).
2. Avoid cross-file semantic rewrites unrelated to diff behavior.
3. Maintain deterministic output order.
4. Keep runtime complexity reasonable (no pathological regressions for common payload sizes).

## Non-Sufficient Completion

The following do **not** satisfy this WI:

- Implementing adapter without fixture parity evidence.
- Passing tests only by weakening assertions.
- Silent output-shape changes without explicit approved exception.

## Tasks

- [ ] Implement local adapter logic to satisfy WI-001 matrix.
- [ ] Run targeted fixture suite and compare outputs against baseline behavior.
- [ ] Run `npm test -- --coverage`.
- [ ] Run `npm run test:v6`.
- [ ] Run demo snapshot parity and confirm no mismatches.
- [ ] Document any intentionally accepted exception (expected: none).

## Verification / Evidence (Required)

- [ ] Fixture suite output (v5 and v6).
- [ ] Full test run outputs for v5 and v6.
- [ ] Demo parity run URL + mismatch summary.
- [ ] Brief compatibility summary table in this WI file.

## Acceptance Criteria

- Local adapter is active in runtime path.
- WI-001 fixture matrix passes unchanged.
- Full gates pass with no snapshot/parity drift.
- No approved exceptions remain open.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-003 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-003 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

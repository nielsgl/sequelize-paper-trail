# PRD-003 WI-001 - Golden Diff Fixture Matrix (Behavior Lock)

- PRD: `docs/prd/PRD-003-deep-diff-replacement.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Objective

Create a deterministic fixture matrix that captures current diff behavior before any adapter rewrite. This WI is complete only when the matrix would catch a behavior regression introduced by a replacement adapter.

## Scope

- Enumerate all relevant behavior classes.
- Add explicit fixture tests with expected outputs.
- Ensure fixture outputs are deterministic and CI-stable.

## Behavior Classes (Must Be Covered)

1. Scalar create/update/delete transitions.
2. Nested object field edits.
3. Array operations (append/remove/reorder/item edit).
4. `null` <-> value transitions.
5. Type transitions (`'1'` <-> `1`, object <-> scalar).
6. Empty string/`null` strict-diff paths.
7. Excluded-field behavior (no false-positive diffs).
8. Existing revision-change edge paths already covered by regression tests.

## Required Deliverables

- Fixture suite committed under `test/` (no ad-hoc scripts only).
- Stable assertions/snapshots with deterministic ordering.
- Explicit note for any intentionally unsupported/legacy edge case.

## Non-Sufficient Completion

The following do **not** satisfy this WI:

- Only adding narrative docs without executable fixtures.
- Fixtures that pass only on one Sequelize major.
- Snapshot tests that depend on nondeterministic ordering.

## Tasks

- [ ] Inventory existing diff assertions and identify gaps against behavior classes.
- [ ] Add missing fixture cases with explicit expected output assertions.
- [ ] Ensure fixture suite executes in default + `test:v6` paths.
- [ ] Capture fixture matrix summary in this WI evidence section.

## Verification / Evidence (Required)

- [ ] `npm test -- test/paper-trail.revision-change.spec.js` (or dedicated fixture suite) output.
- [ ] `npm run test:v6 -- test/paper-trail.revision-change.spec.js` (or equivalent) output.
- [ ] List of fixture cases mapped to behavior classes above.

## Acceptance Criteria

- Every behavior class has at least one explicit executable fixture.
- Fixture outputs are deterministic and pass on both Sequelize v5 and v6.
- WI-002 can use this matrix as authoritative compatibility gate.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-003 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-003 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

# PRD-002 WI-002 - v4 Docs, Migration, And Support Policy

## Work Item Metadata

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-001`
- Status: `Done` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-002-wi-002-v4-docs-migration-support-policy`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-002`

## Work Item Status

- Current phase: `Step 7 cleanup completed`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Deliver complete, user-facing v4 bridge documentation updates across README, migration, release policy, and release checklist.

## In Scope

- `README.md`: v4 support contract language for Node >=20 enforcement and Sequelize v5+v6 bridge behavior.
- `docs/MIGRATION.md`: concrete v3 -> v4 migration steps, including CLS guidance and runtime enforcement impact.
- `RELEASE-POLICY.md`: explicit v4 line policy (bugfix-only bridge) and release governance wording.
- `docs/RELEASE-CHECKLIST.md`: v4 release-time documentation and evidence expectations.
- `docs/prd/PRD-002-release-v4-0-0.md`: mirror status updates for WI lifecycle.

## Out Of Scope

- Publishing v4.0.0 (owned by `PRD-002 WI-004`).
- Running branch protection/config changes (owned by `PRD-002 WI-003`).
- Tooling-major remediation (owned by `PRD-004`).
- `CHANGELOG` final release entry finalization (owned by `PRD-002 WI-004`).

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-002 / WI-002`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override.
- Ownership signals observed: no active `In Progress` row for `PRD-002 WI-002` before claim in `docs/STATUS.md`; no matching ownership branch/worktree for `codex/prd-002-wi-002*`.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Pre-Mutation Context Assertion (Recorded)

- expected branch: `codex/prd-002-wi-002-v4-docs-migration-support-policy`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-002`
- current branch: `codex/prd-002-wi-002-v4-docs-migration-support-policy`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-002`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN:` including the full phased execution plan and gate sequence for `PRD-002 WI-002`.

## Tasks

- [x] Claim `PRD-002 WI-002` in `docs/STATUS.md` with required lock metadata.
- [x] Update README support policy wording for v4 bridge consistency.
- [x] Update migration guide wording for bridge sequencing and scope boundaries.
- [x] Update `RELEASE-POLICY.md` to align WI sequencing and release-note ownership.
- [x] Update release checklist to add explicit WI-004 follow-up for changelog/release-note finalization.
- [x] Expand v4 bridge documentation with substantive contract details (support matrix/checklist/operating policy).
- [x] Remove internal WI references from user-facing `README.md`/`docs/MIGRATION.md` sections.
- [x] Reconcile status mirrors (`docs/STATUS.md` runtime state and PRD WI status line) at close-out.

## Implementation Findings

### Scope Decision (Recorded)

- Decision: `CHANGELOG` remains out of WI-002 scope.
- Rationale: WI-002 is documentation and support-policy alignment; release-note entry ownership remains in `PRD-002 WI-004` to avoid release-timing drift.
- Follow-up target: `PRD-002 WI-004`.

### Review Feedback Resolution

- Feedback: user-facing docs should not include internal WI workflow references.
- Change applied: removed WI-specific references from `README.md` and `docs/MIGRATION.md`; retained WI ownership sequencing only in internal workflow docs (`docs/impl/*` and release-process artifacts).

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: `README.md` update in claimed worktree branch (`codex/prd-002-wi-002-v4-docs-migration-support-policy`) via patch operation.
- main-branch mutation guard: passed (`current branch != main`) before implementation edits.

### Command Re-Run Safety Validation

- `rg -n "v4|Node >=20|Sequelize v5 \\+ v6|bridge|upgrade path|bugfix-only|WI-004|changelog" ...`
  - classification: `safe-no-op retry`
  - outcome: passed on first run.

- `npm run lint` (claimed worktree)
  - classification: `guarded retry`
  - outcome: failed with one pre-existing resolver issue in `examples/v3/index.js` (`import/no-unresolved` self-import path in nested worktree).
  - safety path: no in-place fixer run; baseline lint was executed from primary worktree for separation evidence.

- `npm run lint` (primary worktree baseline)
  - classification: `safe-no-op retry`
  - outcome: passed.

- `uv run skillhub-validate-workflow-docs --repo-root /Users/niels.van.Galen.last/code/sequelize-paper-trail`
  - classification: `safe-no-op retry`
  - outcome: `validator-unavailable` (`No such file or directory: skillhub-validate-workflow-docs`).

- `skills-ref validate`
  - classification: `safe-no-op retry`
  - outcome: `strict-validator-unavailable` (`command not found: skills-ref`).

### Decision Risks And Mitigations

- Risk: documentation wording drift between README, migration guide, and policy docs can re-introduce ambiguity about v4 support boundaries.
- Mitigation: apply synchronized wording updates and verify with one cross-file `rg` evidence query.

- Risk: sequencing confusion if changelog ownership appears split across WIs.
- Mitigation: keep user-facing docs free of internal WI identifiers while preserving internal ownership notes in implementation/release-process docs.

## Execution Risks And Mitigations

- Risk: lint/tooling checks may surface unrelated pre-existing issues and block clean evidence capture.
- Mitigation: record deterministic retry classification and separate WI-scope from pre-existing baseline issues.

- Risk: lifecycle-state drift across implementation file, runtime status board, and PRD mirror.
- Mitigation: keep `docs/STATUS.md` as runtime truth and reconcile mirrored PRD/WI status updates in close-out sequence.

## Verification / Evidence

- [x] `rg -n "v4|Node >=20|Sequelize v5 \+ v6|bridge|upgrade path|bugfix-only|WI-004|changelog" README.md docs/MIGRATION.md RELEASE-POLICY.md docs/RELEASE-CHECKLIST.md docs/impl/PRD-002/WI-002-v4-docs-migration-support-policy.md` (pass)
- [x] `npm run lint` (claimed-worktree run fails only with known nested-worktree resolver issue; primary-worktree baseline lint pass recorded)
- [x] `uv run skillhub-validate-workflow-docs --repo-root /Users/niels.van.Galen.last/code/sequelize-paper-trail` (advisory: tool unavailable)
- [x] `skills-ref validate` (advisory: strict validator unavailable in environment)

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- First response: `not approved — expand WI-002 to include substantive v4 docs/policy updates (not only sequencing notes), then re-present evidence and diff for review`.
- Action taken: expanded WI-002 content across README/MIGRATION/RELEASE-POLICY/RELEASE-CHECKLIST, removed internal WI references from user-facing docs, and re-ran verification.
- Final approval response: `approved`.

## Final Comprehensive Summary

### What changed

- Claimed `PRD-002 WI-002` and delivered substantive v4 docs/policy updates in `README.md`, `docs/MIGRATION.md`, `RELEASE-POLICY.md`, and `docs/RELEASE-CHECKLIST.md`.
- Added explicit v4 bridge contract details (Node>=20 enforcement, Sequelize v5/v6 support, bugfix-only scope) and a concrete v3->v4 migration checklist.
- Addressed review feedback by removing internal WI references from user-facing docs while retaining ownership sequencing in internal workflow artifacts.
- Reconciled runtime/PRD/WI mirrors to `Done`.

### Why this option was chosen

- It satisfies WI-002 acceptance by providing actionable, externally usable v4 guidance and consistent policy language without leaking internal workflow mechanics into user-facing docs.

### What alternatives were rejected and why

- Minimal sequencing-only notes were rejected because they did not provide sufficient operational guidance for users or release operators.
- Keeping WI identifiers in README/MIGRATION was rejected after review feedback to keep user docs external-facing and implementation-agnostic.

### Validation executed and results

- `rg` cross-file consistency scan: pass for v4 bridge policy/migration/support wording.
- `npm run lint` in claimed worktree: known nested-worktree self-import resolver issue in `examples/v3/index.js`.
- `npm run lint` in primary worktree: pass.
- `uv run skillhub-validate-workflow-docs`: unavailable in environment.
- `skills-ref validate`: unavailable in environment.

### Edge cases considered

- Node `<20` and malformed runtime metadata documentation alignment with runtime enforcement.
- Mixed Sequelize v5/v6 consumer paths and CLS guidance parity.
- Separation of external consumer docs from internal WI sequencing metadata.

### Residual risks

- Worktree-specific lint resolver behavior can still report false positives in nested worktree paths; baseline primary-worktree lint remains clean.

### Follow-up recommendations, if any

- Execute `PRD-002 WI-003` next for release/v4 branch and CI contract setup.
- Keep release-note and `CHANGELOG` finalization in `PRD-002 WI-004` as documented.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

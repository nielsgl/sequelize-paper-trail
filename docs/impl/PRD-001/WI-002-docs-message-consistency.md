# PRD-001 WI-002 - Docs And Messaging Consistency

## Work Item Metadata

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-001`
- Status: `Done` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-001-wi-002-docs-message-consistency`
- Worktree: `.worktrees/prd-001-wi-002`

## Work Item Status

- Current phase: `Step 7 cleanup completed`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Make release-line messaging consistent across docs and policy files.

Target files:

- `README.md`
- `CHANGELOG`
- `docs/MIGRATION.md`
- `RELEASE-POLICY.md`
- `docs/CI.md`

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-001 / WI-002`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override; also valid because `PRD-001` is active and `WI-002` is in earliest open wave (`Wave 2`) with `WI-001` already `Done`.
- Ownership signals observed: `docs/STATUS.md` had no `In Progress` row and `git worktree list` had no `codex/prd-001-wi-002*` ownership signal before claim.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved in-session before implementation.

## Tasks

- [x] Align version support language for v3/v4/v5.
- [x] Align Node policy language for current and upcoming majors.
- [x] Reconcile CLS migration guidance (`cls-hooked` for v6, legacy v5 path).
- [x] Align release gate language (`coverage`, `test:v6`, demo parity).
- [x] Remove contradictory phrasing between checklist/policy/readme.

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-001-wi-002-docs-message-consistency`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-002`
- current branch: `codex/prd-001-wi-002-docs-message-consistency`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-002`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: claim-state update in `docs/STATUS.md` for `PRD-001 WI-002`.
- command path context: claimed worktree on branch `codex/prd-001-wi-002-docs-message-consistency`.
- main-branch mutation guard: passed (`current branch != master`).

### Command Re-Run Safety Validation

- `git worktree add .worktrees/prd-001-wi-002 -b codex/prd-001-wi-002-docs-message-consistency`
  - classification: `guarded retry`
  - guard: only retry when branch/worktree do not already exist.
  - recovery path: if branch/worktree exists, reuse existing claimed context.
- `rg -n "v3|v4|v5|Node|cls-hooked|continuation-local-storage|demo snapshot parity|test:v6" README.md CHANGELOG docs/MIGRATION.md RELEASE-POLICY.md docs/CI.md`
  - classification: `safe-no-op retry`
  - guard: none required; read-only command.
- `uv run pytest`
  - classification: `guarded retry`
  - guard: retry only after confirming `pytest` is installed and available in the active environment.
  - recovery path: capture tool-availability evidence and record `strict-validator-unavailable` advisory when required executables are missing.

### Docs Consistency Changes Applied

- `README.md`: normalized supported-line and Node deprecation wording; aligned release-gate references.
- `CHANGELOG`: normalized deprecation timeline wording and explicit gate names.
- `docs/MIGRATION.md`: normalized Node policy wording and explicit `v3 -> v4 -> v5` upgrade path.
- `RELEASE-POLICY.md`: replaced ambiguous runtime warning statement with explicit Node<20 warning behavior and aligned `test:v6` requirement exception for `release/v3`.
- `docs/CI.md`: removed required-vs-skippable contradiction by documenting `release/v3` exemption consistently.
- Review follow-up: standardized branch transition wording for `test:v6` scope to `master` (current default) / `main` (post-rename) across policy/readme/CI docs.

## Verification / Evidence

- [x] `rg -n "v3|v4|v5|Node|cls-hooked|continuation-local-storage|demo snapshot parity|test:v6" README.md CHANGELOG docs/MIGRATION.md RELEASE-POLICY.md docs/CI.md`
  - result: required terms remain present with aligned v3/v4/v5, Node, CLS, and release-gate messaging across all scope files.
- [x] Tool availability checks for validation closure:
  - `command -v rg` -> available (`/opt/homebrew/bin/rg`)
  - `command -v git` -> available (`/opt/homebrew/bin/git`)
  - `command -v node` -> available (`/Users/niels.van.Galen.last/.nodenv/shims/node`)
  - `command -v npm` -> available (`/Users/niels.van.Galen.last/.nodenv/shims/npm`)
  - `command -v uv` -> available
  - `command -v skills-ref` -> unavailable
  - `command -v pytest` -> unavailable
  - `command -v ruff` -> unavailable
- [x] `uv run pytest`
  - result: failed with `Failed to spawn: pytest` (`No such file or directory (os error 2)`).
  - advisory record: `strict-validator-unavailable` for WI-002 environment due to missing required executables (`pytest`, `ruff`, `skills-ref`).

### Decision Risks And Mitigations

- Risk: wording normalization accidentally changes release intent instead of clarifying it.
- Mitigation: keep edits constrained to existing documented policy and avoid adding new release commitments.

## Execution Risks And Mitigations

- Risk: runtime `docs/STATUS.md` and mirrored PRD/WI status drift during execution.
- Mitigation: update `docs/STATUS.md` as source-of-truth first and mirror `PRD-001` status line in the same WI change set.
- Risk: contradictory gate wording remains across docs.
- Mitigation: run required cross-file grep evidence and manual diff review before Ship Gate.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved in-session (`approved`).

## Final Comprehensive Summary

### What changed

- Aligned support-line, Node deprecation, CLS, and release-gate messaging across `README.md`, `CHANGELOG`, `docs/MIGRATION.md`, `RELEASE-POLICY.md`, and `docs/CI.md`.
- Resolved branch naming consistency for release-gate wording by documenting `master` (current default) / `main` (post-rename).
- Updated runtime and mirrored WI lifecycle documents (`docs/STATUS.md`, PRD status mirror, and this implementation plan).

### Why this option was chosen

- Chosen option preserved current repository reality (`master` still default) while documenting deterministic post-rename behavior (`main`) without prematurely asserting a branch migration.

### What alternatives were rejected and why

- `main`-only wording now: rejected because repository and CI docs still acknowledge `master` as active default.
- No branch naming change: rejected because review identified a real cross-doc inconsistency.

### Validation executed and results

- Required terminology verification grep completed and confirmed aligned messaging across all scoped docs.
- Tool availability verification completed with explicit executable presence/absence evidence.
- `uv run pytest` executed and failed due to missing `pytest` binary; recorded as environment evidence with advisory `strict-validator-unavailable`.

### Edge cases considered

- Transition period where both `master` and `main` documentation references coexist.
- `release/v3` exemption for `test:v6` retained and aligned across policy/readme/CI context.

### Residual risks

- Future branch rename can still reintroduce stale wording if not followed by a targeted cleanup WI.
- Strict validator paths remain unavailable in current environment until missing executables are installed.

### Follow-up recommendations, if any

- After default-branch rename completes, run a short follow-up WI to make `main` canonical across all docs and CI references.
- Provision `pytest`, `ruff`, and `skills-ref` in the execution environment before WI-003 verification-heavy steps.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`
- `external-dependency-blocked`

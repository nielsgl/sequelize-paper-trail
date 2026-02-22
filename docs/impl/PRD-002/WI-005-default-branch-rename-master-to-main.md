# PRD-002 WI-005 - Default Branch Rename master -> main

## Work Item Metadata

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `-`
- Status: `Done` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-002-wi-005-default-branch-rename-master-to-main`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-005`

## Work Item Status

- Current phase: `Step 7 cleanup completed`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Rename the default branch from `master` to `main`, ensure branch protection and workflow triggers align to `main`, and reconcile operational documentation references while leaving historical evidence files unchanged.

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-002 / WI-005`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override; also matches `docs/INDEX.md` Wave 3 ordering where `PRD-002 WI-005` is first.
- Ownership signals observed: no active `In Progress` claim row for `PRD-002 WI-005` in `docs/STATUS.md`; no existing `codex/prd-002-wi-005*` branch/worktree ownership.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-005 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN`.

## Tasks

- [x] Rename default branch on GitHub (`master` -> `main`).
- [x] Verify branch protection on `main`.
- [x] Update workflows/docs references that still assume `master` for operational behavior.
- [x] Verify lint/reference hygiene and local branch alignment.
- [x] Complete ship sequence and lifecycle reconciliation (`Done` post-merge).

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-002-wi-005-default-branch-rename-master-to-main`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-005`
- current branch: `codex/prd-002-wi-005-default-branch-rename-master-to-main`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-005`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: workflow/docs file updates in claimed worktree after claim.
- command path context: claimed worktree on branch `codex/prd-002-wi-005-default-branch-rename-master-to-main`.
- main-branch mutation guard: passed (`current branch != main`).

### Command Re-Run Safety Validation

- `gh api -X POST repos/nielsgl/sequelize-paper-trail/branches/master/rename -f new_name=main`
  - classification: `guarded retry`
  - guard: retry only once if transient API/network failure occurs.
  - precheck tuple before any retry: default branch still `master`, no `main` protection mismatch, claimed context unchanged.
  - outcome: succeeded on first attempt.
- `gh api repos/nielsgl/sequelize-paper-trail/branches/main/protection`
  - classification: `safe-no-op retry`
  - guard: retry once on transient API read failure.
  - outcome: succeeded.

### Execution-Context Boundary Checks

- commit stage context: executed from claimed WI worktree branch `codex/prd-002-wi-005-default-branch-rename-master-to-main` (commit `f7a9a72`).
- merge stage context: executed from primary `main` using `git merge --no-ff codex/prd-002-wi-005-default-branch-rename-master-to-main` (merge commit `359b62d`).
- status-finalization stage context: runtime transition to `Done` applied post-merge from primary `main` context.
- cleanup stage context: worktree removal and branch deletion executed from primary `main` context (`git worktree remove .worktrees/prd-002-wi-005`; `git branch -d codex/prd-002-wi-005-default-branch-rename-master-to-main`).

## Verification / Evidence

- [x] `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` returns `main`.
- [x] `gh api repos/nielsgl/sequelize-paper-trail/branches/main/protection` captured.
- [x] Workflow trigger branch list in `.github/workflows/ci.yml` updated to `main` and no `master` entry.
- [x] `rg -n "\\bmaster\\b"` reviewed outside historical scopes.
- [x] `npm run lint` completed.
- [x] local primary branch aligned to `main` tracking `origin/main`.

Evidence captured so far:
- default branch before rename: `master`.
- default branch after rename: `main`.
- `master` protection endpoint after rename returns HTTP 404 (`Branch not found`).
- `main` protection shows required status check context `Test (v5 + optional v6)` and PR approval requirements preserved.
- residual `master` matches outside excluded historical scopes are limited to WI title/status metadata in `docs/INDEX.md` and `docs/STATUS.md`.
- `npm run lint` completed successfully from primary `main` context.
- primary local branch alignment evidence:
  - `git symbolic-ref --short HEAD` => `main`.
  - `git branch -vv` shows `main [origin/main]`.
- merge and cleanup evidence:
  - `git log --oneline -n 1` after merge => `359b62d Merge branch 'codex/prd-002-wi-005-default-branch-rename-master-to-main'`.
  - `git worktree list` after cleanup no longer lists `.worktrees/prd-002-wi-005`.

### Decision Risks And Mitigations

- Risk: incomplete operational reference updates could leave mixed `master`/`main` guidance.
- Mitigation: scope updates are constrained to active workflows/current docs and validated with targeted `rg` output.
- Risk: branch-protection drift during rename.
- Mitigation: captured pre/post protection API output and included explicit fallback to reapply policy if needed.

## Execution Risks And Mitigations

- Risk: local branch alignment may diverge across existing worktrees after remote rename.
- Mitigation: perform explicit local rename/switch/upstream alignment and record branch tracking output.
- Risk: lifecycle inconsistency between runtime status and PRD/WI mirrored status lines.
- Mitigation: reconcile `docs/STATUS.md`, `docs/prd/PRD-002-release-v4-0-0.md`, and this WI file during close-out in the same change sequence.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-005 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved via explicit user instruction to implement the full provided execution plan, including ship actions.

## Final Comprehensive Summary

### What changed

- Renamed GitHub default branch from `master` to `main`.
- Verified branch protection state on `main` and confirmed `master` protection endpoint is removed.
- Updated operational branch references in `.github/workflows/ci.yml`, `docs/CI.md`, `RELEASE-POLICY.md`, `README.md`, and `demos/baseline/package.json`.
- Added mirrored PRD-002 WI status block in `docs/prd/PRD-002-release-v4-0-0.md`.
- Claimed WI-005 in `docs/STATUS.md` with lock metadata and recorded implementation evidence in this file.

### Why this option was chosen

- This directly satisfies PRD-002 WI-005 by aligning repository operations and policy docs to the actual default branch contract (`main`) without rewriting historical evidence files.

### What alternatives were rejected and why

- Repository-wide historical rewrite was rejected because it would modify archival/evidence context outside operational scope.
- Deferring GitHub rename outside this session was rejected because authenticated `gh` access was available and WI scope explicitly includes settings reconciliation.

### Validation executed and results

- `gh repo view nielsgl/sequelize-paper-trail --json defaultBranchRef -q .defaultBranchRef.name` => `main`.
- `gh api repos/nielsgl/sequelize-paper-trail/branches/main/protection` => required checks/reviews preserved.
- `gh api repos/nielsgl/sequelize-paper-trail/branches/master/protection` => HTTP 404 `Branch not found`.
- `rg -n "\\bmaster\\b" --glob '!docs/archive/**' --glob '!docs/impl/**' --glob '!docs/prd/**'` => only intentional WI title/status metadata references.
- `npm run lint` => pass.
- `git symbolic-ref --short HEAD` (primary) => `main`; `git branch -vv` confirms tracking `origin/main`.

### Edge cases considered

- Branch rename propagation: explicitly validated both default-branch state and post-rename protection endpoint behavior.
- Mixed-reference risk: constrained reference audit to operational paths while preserving historical records.
- Local tracking drift after remote rename: resolved with explicit local branch rename and upstream/head reset.

### Residual risks

- No additional runtime risks introduced by this WI; changes are branch-contract and documentation/workflow scope.

### Follow-up recommendations, if any

- Keep future branch-policy references aligned to `main` in upcoming PRD-002 WIs.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

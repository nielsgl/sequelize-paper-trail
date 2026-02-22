# PRD-001 WI-005 - Align Release/v3 And Protection Evidence

## Work Item Metadata

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-004`
- Status: `In Progress` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-001-wi-005-align-release-v3-and-protection-evidence`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-005`

## Work Item Status

- Current phase: `Step 7 shipment in progress`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Align `release/v3` to the `v3.1.0` release point and capture branch-protection evidence without changing branch-protection configuration.

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-001 / WI-005`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override; also valid under active PRD (`PRD-001`) and earliest open wave precedence (`Wave 2`).
- Ownership signals observed: no `PRD-001 WI-005` claim row in `docs/STATUS.md` `In Progress`; no `codex/prd-001-wi-005*` branch; no claimed WI worktree before claim.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-005 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved in-session via explicit instruction to implement this WI-005 plan exactly as written.

## Tasks

- [x] Confirm `release/v3` and `v3.1.0` commit relationship.
- [x] Verify branch protection requirements and required checks.
- [x] Record evidence of configured protection behavior.
- [x] Align `release/v3` to `v3.1.0`.
- [x] Record hotfix-only support reminder for v3 line.

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-001-wi-005-align-release-v3-and-protection-evidence`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-005`
- current branch: `codex/prd-001-wi-005-align-release-v3-and-protection-evidence`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-005`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: claim-state update in `docs/STATUS.md` for `PRD-001 WI-005`.
- command path context: claimed worktree on branch `codex/prd-001-wi-005-align-release-v3-and-protection-evidence`.
- main-branch mutation guard: passed (`current branch != master`).

### Command Re-Run Safety Validation

- `git fetch origin release/v3 --tags --prune`
  - classification: `safe-no-op retry`
  - guard: retry only if transient network failure occurs before refs update.
  - recovery path: rerun once and verify refs with `git rev-parse`.
- `git push origin <tag-sha>:refs/heads/release/v3`
  - classification: `guarded retry`
  - first attempt failed due malformed local refspec token expansion (`$tag_sha:...` without braces).
  - precheck tuple before retry:
    - context: claimed WI worktree + claimed branch.
    - state snapshot: `origin/release/v3` still `a92b9cc84938eb279c2fdd2227fae56e226998a2`.
    - recovery path: retry once using corrected refspec `${tag_sha}:refs/heads/release/v3`.
  - retry outcome: rejected as non-fast-forward by remote.
- `git push --force-with-lease=refs/heads/release/v3:<expected-sha> origin <tag-sha>:refs/heads/release/v3`
  - classification: `guarded retry` (owner-authorized override path)
  - owner decision evidence: explicit instruction `2` (force-reset), followed by owner update that protection was adjusted.
  - precheck tuple before force path:
    - context: claimed WI worktree + claimed branch.
    - state snapshot: remote `release/v3` expected SHA still matches lease value.
    - recovery path: single force-with-lease push attempt only.
  - outcome: success (`forced update`), branch now points to tag commit.
- `gh api repos/nielsgl/sequelize-paper-trail/branches/release/v3/protection`
  - classification: `safe-no-op retry`
  - guard: retry once only for transient API failures.
  - outcome: succeeded.

### Execution-Context Boundary Checks

- commit stage context: pending Ship Gate approval.
- merge stage context: pending Ship Gate approval; will run on primary `master` using `git merge --no-ff`.
- status-finalization stage context: pending Ship Gate approval; must run post-merge on primary `master`.
- cleanup stage context: pending Ship Gate approval; must run on primary worktree.

## Verification / Evidence

- [x] `git ls-remote --heads origin release/v3`
- [x] `git ls-remote --tags origin 'v3.1.0^{}'`
- [x] `git rev-list -n 1 v3.1.0`
- [x] branch protection API evidence.

- release branch before alignment:
  - `a92b9cc84938eb279c2fdd2227fae56e226998a2`.
- release tag target commit:
  - `b044d684d60988664b392fd095ff59c8be332593`.
- final release branch:
  - `git ls-remote --heads origin release/v3` => `b044d684d60988664b392fd095ff59c8be332593 refs/heads/release/v3`.
- tag commit verification:
  - `git ls-remote --tags origin 'v3.1.0^{}'` => `b044d684d60988664b392fd095ff59c8be332593 refs/tags/v3.1.0^{}`.
  - `git rev-list -n 1 v3.1.0` => `b044d684d60988664b392fd095ff59c8be332593`.
- force-with-lease alignment evidence:
  - push output included `+ a92b9cc...b044d68 ... -> release/v3 (forced update)`.
  - remote noted bypass of PR-only rule for this update.
- branch protection API evidence:
  - `allow_force_pushes.enabled: true`.
  - required status checks: `Test (v5 + optional v6)`.
  - strict required status checks: `true`.
  - required PR approvals: `1`.
  - dismiss stale reviews: `true`.
- check-context decision:
  - WI-005 captures current configured check context as-is (`Test (v5 + optional v6)`), with no protection-policy mutation beyond temporary unblock needed for alignment.
- support reminder evidence:
  - `RELEASE-POLICY.md` and `docs/MIGRATION.md` continue to document v3 as hotfix-only.

## Decision Risks And Mitigations

- Risk: force-updating `release/v3` rewrites branch history.
- Mitigation: only executed after explicit owner approval and temporary policy change; used `--force-with-lease` guard with expected SHA.
- Risk: widening WI scope into check-name/policy redesign.
- Mitigation: retain as-is evidence for current checks and defer naming normalization to follow-up.

## Execution Risks And Mitigations

- Risk: malformed refspec can obscure true push behavior.
- Mitigation: corrected one guarded retry and recorded both failure and success paths.
- Risk: status drift across runtime and mirrored docs.
- Mitigation: updated `docs/STATUS.md` first as runtime source and mirrored PRD/WI status in same change set.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-005 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved in-session (`approved`).

## Final Comprehensive Summary

### What changed

- Claimed WI-005 with required lock metadata.
- Verified branch/tag mismatch, captured protection evidence, and handled retry/failure paths deterministically.
- Aligned remote `release/v3` to `v3.1.0` commit using owner-authorized `--force-with-lease` after protection update.
- Verified branch/tag parity and current protection configuration.

### Why this option was chosen

- PRD-001 acceptance requires `release/v3` to point to `v3.1.0`; non-fast-forward reality required explicit owner decision and guarded force update.

### What alternatives were rejected and why

- Leaving branch misaligned was rejected because it fails PRD acceptance.
- Unbounded retries were rejected; only one guarded retry path per command was used.

### Validation executed and results

- `git ls-remote --heads origin release/v3`: equals `b044d684d60988664b392fd095ff59c8be332593`.
- `git ls-remote --tags origin 'v3.1.0^{}'`: equals `b044d684d60988664b392fd095ff59c8be332593`.
- `git rev-list -n 1 v3.1.0`: equals `b044d684d60988664b392fd095ff59c8be332593`.
- `gh api .../protection`: confirms required checks/review policy and force-push setting at execution time.

### Edge cases considered

- Refspec-construction error on first push path and non-fast-forward rejection were both captured.
- Force path used lease guard to avoid clobbering unexpected remote changes.

### Residual risks

- Force-push allowance on `release/v3` should be revisited after WI-005 close-out.

### Follow-up recommendations, if any

- Normalize docs/check naming (`CI` vs `Test (v5 + optional v6)`) in a dedicated follow-up WI.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

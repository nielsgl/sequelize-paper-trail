# PRD-002 WI-003 - Release/v4 Branch And CI Contract

## Work Item Metadata

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-002`
- Status: `Done` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-002-wi-003-release-v4-branch-and-ci-contract`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-003`

## Work Item Status

- Current phase: `Step 7 cleanup completed`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Create `release/v4` and enforce an explicit, auditable CI + branch-protection contract for v4 maintenance.

## In Scope

- Create/sync `release/v4` from approved base.
- Define required status checks for v4 branch protection.
- Configure and verify branch protection settings on `release/v4`.
- Document backport/cherry-pick behavior for v4 maintenance.
- Capture API-backed evidence for all protection settings.
- Unblock `PRD-002 WI-004` once protection and CI evidence is complete.

## Out Of Scope

- Publishing v4.0.0 (`PRD-002 WI-004`).
- Runtime feature/bug changes unrelated to branch governance.
- Broad branch-policy redesign outside v4 branch requirements.

## Execution Branch Contract

- Base branch for implementation work: `main`.
- `release/v4` is created/configured as part of this WI and becomes the release source branch for `WI-004`.
- Do not publish from this WI.

## Required CI/Protection Contract (Must Match)

For `release/v4`, minimum contract:

- Required status check context: `Test (v5 + optional v6)`.
- Pull request review required:
  - `required_approving_review_count >= 1`
- Force pushes disabled after setup.
- Admin bypass documented and set to match `main` (`enforce_admins=false`).
- Required checks strict (`strict=true`).
- WI-004 precondition: `release/v4` protection evidence complete before release execution starts.

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-002 / WI-003`
- Selection rationale (precedence rule): explicit user-selected override (`PRD-002 WI-003`); dependency `PRD-002 WI-002` is `Done`.
- Ownership signals observed: no active `In Progress` row for `PRD-002 WI-003`; no matching `codex/prd-002-wi-003*` ownership branch/worktree before claim.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Pre-Mutation Context Assertion (Recorded)

- expected branch: `codex/prd-002-wi-003-release-v4-branch-and-ci-contract`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-003`
- current branch: `codex/prd-002-wi-003-release-v4-branch-and-ci-contract`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-003`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN:` including full phased execution and gate expectations for `PRD-002 WI-003`.

## Tasks

- [x] Create `release/v4` from approved base commit/branch and push to origin.
- [x] Apply branch protection for `release/v4` per required CI/protection contract.
- [x] Verify effective protection settings via GitHub API (`gh api`) and save evidence.
- [x] Verify CI workflow behavior on `release/v4` (required check context resolves correctly).
- [x] Update policy docs to match actual check contract (`docs/CI.md`, `RELEASE-POLICY.md`).
- [x] Record explicit `WI-004` unblock note once protection contract is verified.
- [x] Document maintenance flow statement for v4: land fixes on highest supported line first, cherry-pick to `release/v4` as needed.

## Implementation Findings

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: `git fetch origin && git push origin origin/main:refs/heads/release/v4`
- execution context at first mutation:
  - branch: `codex/prd-002-wi-003-release-v4-branch-and-ci-contract`
  - cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-003`
- main-branch mutation guard: passed (`current branch != main`).

### Command Re-Run Safety Validation

- `gh api -X PUT repos/nielsgl/sequelize-paper-trail/branches/release/v4/protection ...` (form flags)
  - classification: `guarded retry`
  - first outcome: shell expansion failure on unquoted `contexts[]` argument.
  - retry outcome: schema mismatch (`HTTP 422`) with form encoding.
  - recovery path: switched to one full JSON payload request (`--input`) for the same endpoint; succeeded.

- `gh api -X PUT repos/nielsgl/sequelize-paper-trail/branches/release/v4/protection/required_status_checks --input ...`
  - classification: `safe-no-op retry`
  - outcome: `HTTP 404` because parent protection object did not yet exist.
  - recovery path: applied full protection object first, then verified via consolidated protection endpoint.

### CI/Protection Contract Evidence

- `release/v4` initially created at stale commit `345f14e320798778911a8aa6a62a091d714d77fd`; corrected by fast-forwarding `release/v4` to current `origin/main`.
- Corrected `release/v4` head commit: `572367455711b15c943f713ff897866db6f248f1`.
- Explicit baseline ancestry checks passed:
  - `99024c0` (`PRD-002 WI-001`) is ancestor of `origin/release/v4`.
  - `277016b` (`PRD-002 WI-002`) is ancestor of `origin/release/v4`.
  - `origin/main` equals `origin/release/v4` at verification time.
- Effective protection values on `release/v4`:
  - `required_status_checks.strict=true`
  - `required_status_checks.contexts=["Test (v5 + optional v6)"]`
  - `required_pull_request_reviews.required_approving_review_count=1`
  - `enforce_admins=false`
  - `allow_force_pushes=false`
- CI run evidence:
  - workflow: `CI`
  - prior run URL (stale head): `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22344297444`
  - current run URL (corrected head): `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22344834094`
  - branch: `release/v4`
  - status/conclusion: `completed/success`
  - head SHA: `572367455711b15c943f713ff897866db6f248f1`

### WI-004 Unblock Note

- `PRD-002 WI-004` was temporarily blocked while `release/v4` pointed to stale head `345f14e...` missing required WI-001/WI-002 commits.
- Precondition is now satisfied after baseline correction to `5723674...` and explicit ancestor checks for required commits (`99024c0`, `277016b`) with matching protection contract evidence.

### Decision Risks And Mitigations

- Risk: required check naming could drift from workflow/job labels and silently break merge gating.
- Mitigation: enforce explicit required context `Test (v5 + optional v6)` and verify via branch protection API output plus a real `release/v4` CI run.

- Risk: admin bypass policy ambiguity could diverge from established repository governance.
- Mitigation: lock policy to match `main` (`enforce_admins=false`) and record this rationale and evidence.

## Execution Risks And Mitigations

- Risk: API payload/encoding mismatches can create partial or failed protection updates.
- Mitigation: use full JSON payload for protection object and validate effective state immediately via `gh api .../protection`.

- Risk: lifecycle drift across runtime status board, PRD mirror, and WI implementation file.
- Mitigation: set runtime `In Progress` row first, mirror PRD WI status to `In Progress`, and defer `Done` transitions until post-merge close-out.

## Verification / Evidence

- [x] `git ls-remote --heads origin release/v4`
  - result: `572367455711b15c943f713ff897866db6f248f1 refs/heads/release/v4`
- [x] `git merge-base --is-ancestor 99024c0 origin/release/v4`
  - result: success (`WI001:0`)
- [x] `git merge-base --is-ancestor 277016b origin/release/v4`
  - result: success (`WI002:0`)
- [x] `git rev-parse origin/main origin/release/v4`
  - result: both refs resolve to `572367455711b15c943f713ff897866db6f248f1` at verification time.
- [x] `gh api repos/nielsgl/sequelize-paper-trail/branches/release/v4/protection`
  - result: strict checks + required review count + force-push disabled + admin bypass value all match contract.
- [x] `gh run list --branch release/v4 --limit 10 --json ...`
  - result: prior stale-head run `22344297444` succeeded; corrected-head run `22344834094` captured for `5723674...`.
- [x] docs parity check
  - `docs/CI.md` branch-protection note updated to required status check context.
  - `RELEASE-POLICY.md` branch-protection note updated to required status check context.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved via explicit user reply: `approved`.

## Final Comprehensive Summary

### What changed

- Claimed `PRD-002 WI-003` and moved runtime status to `In Progress` with lock metadata.
- Created `release/v4` from `origin/main` and pushed branch to remote.
- Applied and verified `release/v4` branch protection contract with strict required checks, review requirement, force-push disabled, and admin bypass matching `main`.
- Verified CI success on `release/v4` and captured run evidence.
- Updated `docs/CI.md` and `RELEASE-POLICY.md` to align branch-protection wording with actual required status check context.
- Updated PRD mirror status for WI-003 to `In Progress`.
- Corrected release baseline after review: `release/v4` now points to `572367455711b15c943f713ff897866db6f248f1` (same as `origin/main` at verification), and explicit ancestor checks for `99024c0` and `277016b` are recorded.
- Completed merge to `main` and reconciled lifecycle statuses in `docs/STATUS.md` and PRD mirror to `Done`.

### Why this option was chosen

- Fast-forwarding `release/v4` to current `origin/main` directly satisfies the WI-003 precondition for WI-004 by guaranteeing required PRD-002 changes are present before release execution.
- Using explicit commit ancestry checks for WI-001/WI-002 closes the verification gap that allowed stale branch validation to pass.

### What alternatives were rejected and why

- Keeping `release/v4` on stale head `345f14e...` was rejected because it excluded required WI-001/WI-002 content and invalidated release readiness.
- Relying only on `origin/main` ancestor checks was rejected because it can pass even when release branch content is outdated.

### Validation executed and results

- `git ls-remote --heads origin release/v4`: pass; head is `572367455711b15c943f713ff897866db6f248f1`.
- `git merge-base --is-ancestor 99024c0 origin/release/v4`: pass.
- `git merge-base --is-ancestor 277016b origin/release/v4`: pass.
- `git rev-parse origin/main origin/release/v4`: both refs equal at verification time.
- `gh api repos/nielsgl/sequelize-paper-trail/branches/release/v4/protection`: pass for strict required context, review count, force-push disabled, admin bypass configured as expected.
- `gh run view 22344834094 --json ...`: `completed/success` for corrected `release/v4` head SHA.

### Edge cases considered

- Initial stale release branch baseline despite successful prior CI/protection setup.
- API payload and endpoint-path failures during protection setup (`zsh` expansion, 422 form schema mismatch, subresource 404 before base protection object).
- Branch protection bypass message during direct branch update; mitigated by retaining verified protection contract and explicit evidence.

### Residual risks

- None identified beyond normal ongoing governance risk if required status-check names change in future workflows.

### Follow-up recommendations, if any

- Execute `PRD-002 WI-004` from `release/v4` now that preconditions are satisfied and documented.
- Keep branch-protection required context and workflow job naming synchronized when CI workflows evolve.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

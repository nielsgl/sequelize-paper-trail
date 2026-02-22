# PRD-001 WI-004 - Manual Release Run And Tag Verification

## Work Item Metadata

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-003`
- Status: `In Progress` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-001-wi-004-manual-release-run-and-tag-verification`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-004`

## Work Item Status

- Current phase: `Step 6 ship-gate pending approval`
- Plan Gate: `Approved`
- Ship Gate: `Pending`

## Scope

Document and execute the manual release workflow path for v3.1.0:

- dry-run path,
- publish path,
- tag verification notes.

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-001 / WI-004`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override; `PRD-001` is active and `WI-004` is in earliest open wave (`Wave 2`) with dependency `WI-003` already `Done`.
- Ownership signals observed: no owned `PRD-001 WI-004` row in `docs/STATUS.md` `In Progress`; no `codex/prd-001-wi-004*` branch in `git branch --all`; no matching worktree in `git worktree list`.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved in-session via explicit instruction: `PLEASE IMPLEMENT THIS PLAN`.

## Tasks

- [x] Trigger manual release workflow in GitHub Actions.
- [x] Verify npm publish path and provenance notes.
- [x] Verify tag creation and commit association.
- [x] Record release-note checklist evidence (content, links, migration notes).
- [x] Record operator steps and outcomes in checklist artifacts.

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-001-wi-004-manual-release-run-and-tag-verification`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-004`
- current branch: `codex/prd-001-wi-004-manual-release-run-and-tag-verification`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-004`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: claim-state update in `docs/STATUS.md` for `PRD-001 WI-004`.
- command path context: claimed worktree on branch `codex/prd-001-wi-004-manual-release-run-and-tag-verification`.
- main-branch mutation guard: passed (`current branch != master`).

### Command Re-Run Safety Validation

- `gh workflow run release.yml --ref master ...`
  - classification: `guarded retry`
  - guard: retry only if dispatch does not return a run id and no duplicate release run is created.
  - recovery path: rerun once with identical inputs and record resulting run id.
- `gh run watch <run-id> --exit-status`
  - classification: `safe-no-op retry`
  - guard: retry only for transient API timeout/disconnect.
  - recovery path: rerun once against same `run-id`.
- `npm view sequelize-paper-trail@3.1.0 version dist-tags --json`
  - classification: `safe-no-op retry`
  - guard: retry once after a short delay if registry propagation is incomplete.
  - recovery path: rerun once and capture eventual consistency note.
- publish run failure path (`run 22275867957`)
  - classification: `unsafe retry`
  - guard: do not retry until `NPM_TOKEN` exists in GitHub Actions `release` environment and has publish permissions.
  - recovery path: owner fixes secret configuration, then run exactly one new publish workflow dispatch.
- publish rerun after secret remediation (`run 22275995037`)
  - classification: `guarded retry` (dependency-remediated retry)
  - guard: rerun only after explicit dependency fix evidence from owner and monitor for successful publish completion.
  - recovery path: single rerun executed; publish step succeeded and no further retries required.

## Verification / Evidence

- [x] Workflow run URL and status.
- [x] npm package/version visibility evidence.
- [x] `git tag` and release note linkage evidence.
- [x] release notes/checklist evidence links captured.

- dry-run workflow (pass):
  - run id: `22275852286`
  - URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22275852286`
  - conclusion: `success`
  - key steps: v5 suite `success`, v6 suite `success`, `Publish (dry run)` `success`, `Publish` `skipped`.
- publish workflow (blocked/fail):
  - run id: `22275867957`
  - URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22275867957`
  - conclusion: `failure`
  - key steps: v5 suite `success`, v6 suite `success`, `Publish` `failure`.
  - failure evidence: `npm error code ENEEDAUTH` and `This command requires you to be logged in to https://registry.npmjs.org/`.
  - failure evidence: publish step env showed `NODE_AUTH_TOKEN:` empty.
- npm visibility evidence:
  - `npm view sequelize-paper-trail@3.1.0 version dist-tags --json` -> `E404` (version not published).
  - `npm view sequelize-paper-trail dist-tags --json` -> `{"latest":"3.0.1","rc":"3.0.0-rc.11"}`.
- publish workflow (pass after dependency fix):
  - run id: `22275995037`
  - URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22275995037`
  - conclusion: `success`
  - key steps: v5 suite `success`, v6 suite `success`, `Publish` `success`.
  - auth evidence: publish step env included masked `NODE_AUTH_TOKEN: ***`.
  - publish evidence: `+ sequelize-paper-trail@3.1.0`.
- npm visibility evidence after successful publish:
  - `npm view sequelize-paper-trail@3.1.0 version --json` -> `"3.1.0"`.
  - `npm view sequelize-paper-trail dist-tags --json` -> `{"rc":"3.0.0-rc.11","latest":"3.1.0"}`.
- tag evidence after publish:
  - created and pushed annotated tag: `git tag -a v3.1.0 b044d684d60988664b392fd095ff59c8be332593 -m "Release v3.1.0"` then `git push origin v3.1.0`.
  - remote tag presence: `git ls-remote --tags origin 'v3.1.0'` -> `094ffc766a939bccbffb0771c33086bbd1ebb884 refs/tags/v3.1.0`.
  - tag target commit: `git rev-list -n 1 v3.1.0` -> `b044d684d60988664b392fd095ff59c8be332593`.
  - target commit summary: `Merge pull request #136 from nielsgl/codex/demo-parity-lock`.
- checklist linkage:
  - release evidence captured in this file for `docs/RELEASE-CHECKLIST.md` sections `3) Release Automation`, `5) Publishing`, and `6) Post-Release`.

## Blocker Update (Resolved)

- Blocked item (PRD/WI): `PRD-001 / WI-004`
- Reason code: `external-dependency-blocked`
- What is blocked: production publish and downstream tag verification for `v3.1.0` (historical state).
- Dependency / evidence: publish run `22275867957` failed in `Publish` with `ENEEDAUTH`; `NODE_AUTH_TOKEN` was empty in step environment.
- Owner action required: add `NPM_TOKEN` secret to GitHub Actions `release` environment with publish permission for `sequelize-paper-trail`.
- Resume condition: satisfied via successful publish run `22275995037`, npm visibility confirmation, and remote `v3.1.0` tag evidence.

## Decision Risks And Mitigations

- Risk: workflow publish succeeds but npm registry propagation lags and immediate verification appears stale.
- Mitigation: allow one safe retry for `npm view` and record timestamped evidence from successful read.
- Risk: secrets drift causes false-success confidence from dry-run while publish remains blocked.
- Mitigation: treat missing `NPM_TOKEN` as hard blocker; require publish-run success evidence before Ship Gate.

## Execution Risks And Mitigations

- Risk: duplicate release workflow dispatch could publish twice.
- Mitigation: dispatch publish only after dry-run success; verify run id uniqueness and stop on ambiguity.
- Risk: runtime/mirrored status drift across STATUS/PRD/WI docs.
- Mitigation: keep `docs/STATUS.md` as runtime source and reconcile mirrored PRD status in the same close-out.
- Risk: retrying publish without credential fix creates noisy failures and no forward progress.
- Mitigation: classify retry as unsafe until credential dependency is fixed.

## Ship Gate Prompt

`Ship Approval Gate: Do you approve commit + merge + status update + cleanup for PRD-001 WI-004? Reply with "ship approved" or "approved".`

## Ship Gate Decision

- Approved in-session (`approved`).

## Final Comprehensive Summary

### What changed

- Claimed WI-004 and recorded deterministic startup/context evidence.
- Executed release workflow dry-run successfully.
- Executed release workflow publish path and captured failure evidence (`ENEEDAUTH` due missing `NPM_TOKEN`).
- Re-ran publish after dependency remediation; publish succeeded and npm now serves `3.1.0` as `latest`.
- Created and pushed tag `v3.1.0` to the published commit SHA.
- Updated runtime and mirrored WI state back to `In Progress` pending Ship Gate actions.

### Why this option was chosen

- This preserved deterministic evidence across failure and recovery, then completed publish/tag verification only after dependency remediation.

### What alternatives were rejected and why

- Blindly retrying publish was rejected because failure is deterministic (`NODE_AUTH_TOKEN` missing), making retry unsafe and non-productive.
- Skipping tag creation was rejected because WI-004 scope requires tag verification and commit association notes.

### Validation executed and results

- `gh workflow run release.yml --ref master -f version=3.1.0 -f dist-tag=latest -f dry-run=true -f skip-v6=false`: pass (run `22275852286`).
- `gh workflow run release.yml --ref master -f version=3.1.0 -f dist-tag=latest -f dry-run=false -f skip-v6=false`: fail at publish auth (run `22275867957`).
- `gh workflow run release.yml --ref master -f version=3.1.0 -f dist-tag=latest -f dry-run=false -f skip-v6=false`: pass (run `22275995037`).
- `npm view sequelize-paper-trail@3.1.0 version --json`: `"3.1.0"`.
- `npm view sequelize-paper-trail dist-tags --json`: `latest` is `"3.1.0"`.
- `git ls-remote --tags origin 'v3.1.0'`: present and resolves to commit `b044d684d60988664b392fd095ff59c8be332593`.

### Edge cases considered

- Dry-run can succeed even when publish credentials are missing; release readiness requires separate publish-step auth evidence.
- Annotated tag object SHA differs from commit SHA; commit association must use `git rev-list -n 1 <tag>`.

### Residual risks

- None beyond standard post-release monitoring; WI-005 can proceed after WI-004 close-out.

### Follow-up recommendations, if any

- Request Ship Gate approval to allow commit + merge + status finalization + cleanup.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

# PRD-002 WI-004 - v4 Release And v3 Deprecate Plan

## Work Item Metadata

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-003`
- Status: `In Progress` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-002-wi-004-v4-release-and-v3-deprecate-plan`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-004`

## Work Item Status

- Current phase: `Step 6 ship-gate approved`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Execute v4.0.0 release end-to-end with complete evidence trail, then apply controlled v3 deprecation messaging on npm.

## In Scope

- Version bump to `4.0.0` with committed release candidate SHA on `release/v4`.
- Manual release workflow execution (dry-run then publish).
- npm publish verification (version/dist-tag/peer dependency metadata).
- Git tag/release commit integrity verification.
- GitHub release entry creation so the Releases page reflects v4 as latest.
- Controlled `npm deprecate` execution for v3 major range with evidence.
- Rollback decision tree documentation for release failures.

## Out Of Scope

- New runtime feature work.
- Branch policy redesign beyond release execution needs.
- Tooling-major security remediation (tracked under PRD-004).

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-002 / WI-004`
- Selection rationale (precedence rule): explicit user-selected override (`PRD-002 WI-004`)
- Ownership signals observed: no active `In Progress` lock row for `PRD-002 WI-004`; no matching `codex/prd-002-wi-004*` branch/worktree ownership signal before claim.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved via explicit user response: `Approve Plan Gate (Recommended)`.

## Tasks

- [x] Bump `package.json`/lockfile to `4.0.0` on `release/v4` and commit release candidate.
- [x] Record release candidate SHA and verify it remains unchanged before publish.
- [x] Run release workflow dry-run and record run evidence.
- [x] Run release workflow publish execution and record run evidence.
- [x] Run demo parity workflow for release candidate and record pass evidence (`mismatches: 0`).
- [x] Verify npm package visibility and metadata integrity for `4.0.0`.
- [x] Create/push `v4.0.0` tag and verify tag points to expected release commit.
- [x] Create GitHub release entry for `v4.0.0` so Releases latest release is current.
- [x] Finalize `CHANGELOG` and release notes content for v4.0.0 before publish sign-off.
- [x] Add manual deprecate workflow (`deprecate.yml`) and bind it to `release` environment secrets.
- [x] Run deprecate workflow dry-run and verify printed command.
- [x] Run deprecate workflow real execution and verify success.
- [x] Verify deprecation externally for v3 (`3.1.0`, `2.5.2`).
- [ ] Reconcile `docs/STATUS.md`, PRD mirror status, and WI evidence summary at close-out (post-merge).

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-002-wi-004-v4-release-and-v3-deprecate-plan`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-004`
- current branch: `codex/prd-002-wi-004-v4-release-and-v3-deprecate-plan`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-004`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: `npm version 4.0.0 --no-git-tag-version`
- execution context at first mutation:
  - branch: `codex/prd-002-wi-004-v4-release-and-v3-deprecate-plan`
  - cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-004`
- main-branch mutation guard: passed (`current branch != main`).

### Command Re-Run Safety Validation

- `git add package.json package-lock.json CHANGELOG && git commit -m "Release 4.0.0 candidate metadata"`
  - classification: `guarded retry`
  - first outcome: failed with stale worktree `index.lock` contention.
  - safety precheck tuple:
    - context: claimed branch/worktree verified.
    - state snapshot: only expected WI-004 files modified.
    - recovery path: verify lock/process state, then single retry.
  - retry outcome: success (`8b6b4cf`).

- release run polling loop variable name
  - classification: `safe-no-op retry`
  - first outcome: `zsh` read-only variable conflict (`status`).
  - recovery path: rename shell variable to `st` and retry once.
  - retry outcome: success.

- deprecate workflow discovery on non-default branch before merge
  - classification: `guarded retry`
  - first outcome: `404 workflow ... not found on the default branch` for `deprecate.yml`.
  - recovery path: merge workflow file to `main`, then dispatch from target ref.
  - retry outcome: dispatch succeeded.

### Deprecation Workflow Rollout Evidence

- Initial dry-run on `main` failed due missing secret:
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22346124212`
  - failure: `npm whoami` with empty `NODE_AUTH_TOKEN` (`ENEEDAUTH`).
- Workflow update applied:
  - `.github/workflows/deprecate.yml` now uses `environment: release`.
- Dry-run after environment binding:
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22346218146`
  - conclusion: `success`
  - printed command:
    - `npm deprecate "sequelize-paper-trail@<4.0.0" "v3 is legacy. Upgrade to v4 (bridge) or v5 (feature line). See docs/MIGRATION.md."`
- Real deprecate execution:
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22346237023`
  - conclusion: `success`
  - executed command:
    - `npm deprecate "sequelize-paper-trail@<4.0.0" "v3 is legacy. Upgrade to v4 (bridge) or v5 (feature line). See docs/MIGRATION.md."`

## Verification / Evidence

- [x] Release candidate SHA evidence
  - pre-dry-run: `git rev-parse origin/release/v4` -> `8b6b4cf553bf6038aba59a5f074006d624adbbb3`
  - pre-publish: `git rev-parse origin/release/v4` -> `8b6b4cf553bf6038aba59a5f074006d624adbbb3`
  - result: unchanged SHA lock.

- [x] Workflow evidence (Release dry-run)
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22345512600`
  - head SHA: `8b6b4cf553bf6038aba59a5f074006d624adbbb3`
  - conclusion: `success`

- [x] Workflow evidence (Release publish)
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22345549896`
  - head SHA: `8b6b4cf553bf6038aba59a5f074006d624adbbb3`
  - conclusion: `success`

- [x] Demo parity evidence
  - run URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22345579771`
  - head SHA: `8b6b4cf553bf6038aba59a5f074006d624adbbb3`
  - conclusion: `success`
  - parity summary: `common files: 84; mismatches: 0`.

- [x] npm release evidence
  - `npm view sequelize-paper-trail@4.0.0 version` -> `4.0.0`
  - `npm view sequelize-paper-trail dist-tags --json` -> `{ "rc": "3.0.0-rc.11", "latest": "4.0.0" }`
  - `npm view sequelize-paper-trail@4.0.0 peerDependencies --json` -> `{ "sequelize": "^5 || ^6" }`

- [x] Tag/repo evidence
  - tag push: `refs/tags/v4.0.0`
  - `git rev-parse v4.0.0^{}` -> `8b6b4cf553bf6038aba59a5f074006d624adbbb3`

- [x] GitHub release evidence
  - release URL: `https://github.com/nielsgl/sequelize-paper-trail/releases/tag/v4.0.0`
  - latest API: `tag_name: v4.0.0`, `target_commitish: 8b6b4cf553bf6038aba59a5f074006d624adbbb3`

- [x] Deprecation verification evidence
  - `npm view sequelize-paper-trail@3.1.0 deprecated` -> `v3 is legacy. Upgrade to v4 (bridge) or v5 (feature line). See docs/MIGRATION.md.`
  - `npm view sequelize-paper-trail@2.5.2 deprecated` -> `v3 is legacy. Upgrade to v4 (bridge) or v5 (feature line). See docs/MIGRATION.md.`

## Rollback Decision Tree (Required)

- Publish failed before package visible:
  - fix root cause, rerun workflow; do not advance tag/deprecate steps.
- Publish succeeded but metadata incorrect:
  - publish corrective patch (`4.0.1`) and document issue.
- Deprecate failed:
  - keep release done, open follow-up task with owner and target completion window.

### Decision Risks And Mitigations

- Risk: release evidence could be incomplete across workflow/test/parity/tag/release/deprecation surfaces.
- Mitigation: capture all required run URLs, SHA lock checks, registry outputs, release references, and deprecate verification outputs in one WI record before close-out.

- Risk: secret scope mismatch between repository and environment secrets.
- Mitigation: bind deprecate job to `environment: release` and verify `npm whoami` before deprecate command execution.

## Execution Risks And Mitigations

- Risk: branch protection bypass warning on direct branch pushes could obscure release integrity.
- Mitigation: rely on workflow gate success + immutable SHA lock + tag/release target parity evidence.

- Risk: transient command failures during release operations.
- Mitigation: apply one-retry policy with safety precheck tuple and classify retry type in findings.

## Acceptance Criteria Check

- [x] v4.0.0 published and installable from npm.
- [x] Publish executed from `release/v4` and not from `main`.
- [x] Dry-run and publish workflow evidence attached.
- [x] Demo parity evidence attached with no mismatches.
- [x] Tag integrity and release references captured.
- [x] GitHub Releases page updated with `v4.0.0` as latest.
- [x] `CHANGELOG` and release notes finalized and linked.
- [x] v3 deprecation executed with evidence and verified on published v3 versions.
- [ ] Runtime status close-out to `Done` after merge.

## Ship Gate Prompt

`Ship Approval Gate: Do you approve commit + merge + status update + cleanup for PRD-002 WI-004? Reply with "ship approved" or "approved".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

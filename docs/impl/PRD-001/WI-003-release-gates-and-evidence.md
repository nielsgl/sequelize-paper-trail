# PRD-001 WI-003 - Release Gates And Evidence

## Work Item Metadata

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-002`
- Status: `Done` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-001-wi-003-release-gates-and-evidence`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-003`

## Work Item Status

- Current phase: `Step 7 cleanup completed`
- Plan Gate: `Approved`
- Ship Gate: `Approved`

## Scope

Execute release quality gates for v3.1.0 and record reproducible evidence.

Required gates:

- `npm test -- --coverage`
- `npm run test:v6`
- demo snapshot parity suite (local run plus GitHub Actions run link)

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-001 / WI-003`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override; also valid because `PRD-001` is active and `WI-003` is in earliest open wave (`Wave 2`) with dependency `WI-002` already `Done`.
- Ownership signals observed: `docs/STATUS.md` had no `In Progress` row for `PRD-001 WI-003` and `git worktree list` had no `codex/prd-001-wi-003*` ownership signal before claim.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved in-session via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN`.

## Tasks

- [x] Run required test gates from clean environment.
- [x] Capture pass/fail and command outputs.
- [x] Capture and retain coverage artifacts as release evidence.
- [x] Store evidence references in release docs/checklist.
- [x] Record any non-determinism and mitigation steps.

## Implementation Findings

### Context-Armed Checkpoint

- expected branch: `codex/prd-001-wi-003-release-gates-and-evidence`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-003`
- current branch: `codex/prd-001-wi-003-release-gates-and-evidence`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-003`

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: claim-state update in `docs/STATUS.md` for `PRD-001 WI-003`.
- command path context: claimed worktree on branch `codex/prd-001-wi-003-release-gates-and-evidence`.
- main-branch mutation guard: passed (`current branch != master`).

### Command Re-Run Safety Validation

- `npm test -- --coverage`
  - classification: `guarded retry`
  - guard: retry only after confirming dependency install state and no concurrent repository mutation.
  - recovery path: rerun once in same claimed worktree context.
- `npm run test:v6`
  - classification: `guarded retry`
  - guard: retry only after confirming `sequelize-v6` alias resolves from installed dependencies.
  - recovery path: rerun once in same claimed worktree context.
- local demo parity command group (`npm pack`, demo installs, three `test:export`, parity compare script)
  - classification: `guarded retry`
  - guard: retry only after cleaning `demos/_artifacts` tarball and using a fresh snapshot directory.
  - recovery path: rerun command group once with new snapshot directory.
- `gh workflow run demo-parity.yml --ref master`
  - classification: `guarded retry`
  - guard: retry only when previous dispatch failed before creating a run record.
  - recovery path: rerun dispatch once and record the resulting run id.

### Non-Determinism Notes

- Observed repeated `npm warn deprecated` warnings during demo dependency installs in local parity and CI parity jobs.
- Assessment: non-blocking for WI-003 because warnings did not alter command outcomes or parity results.
- Mitigation: retain warning evidence in logs and keep parity pass criteria bound to snapshot comparison output (`mismatches: 0`).

## Verification / Evidence

- [x] clean-environment proof for gate execution
  - dedicated claimed context used for all gates:
    - branch: `codex/prd-001-wi-003-release-gates-and-evidence`
    - worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-001-wi-003`
  - demo parity executed from fresh, explicit inputs:
    - rebuilt package tarball immediately before exports (`npm pack --pack-destination demos/_artifacts`)
    - demo lockfiles removed before install (`rm -f demos/{baseline,v5,v6}/package-lock.json`)
    - demo dependencies reinstalled (`npm install --no-package-lock` per demo)
    - fresh snapshot root per run (`/tmp/demo-parity-prd001-wi003-1771756832`)
  - CI parity evidence is from a fresh GitHub-hosted runner (`ubuntu-latest`) on run `22275554617`.
- [x] `npm test -- --coverage`
  - result: `14 passed, 14 total`; `105 passed`; `Snapshots: 5 passed`.
  - coverage summary: `All files 100%` (`helpers.js` and `index.js` at 100% statements/branches/functions/lines).
- [x] coverage artifact retained and linked (summary + location)
  - artifacts:
    - `coverage/lcov.info` (6742 bytes)
    - `coverage/coverage-final.json` (45762 bytes)
    - `coverage/lcov-report/index.html`
- [x] `npm run test:v6`
  - result: `14 passed, 14 total`; `105 passed`; `Snapshots: 5 passed`.
  - coverage summary: `All files 100%` (`helpers.js` and `index.js` at 100% statements/branches/functions/lines).
- [x] local demo parity command(s) and snapshot-diff summary (`mismatches: 0`)
  - tarball build:
    - `npm pack --pack-destination demos/_artifacts`
    - tarball copied to `demos/_artifacts/sequelize-paper-trail-local.tgz`
  - demo export commands:
    - `(cd demos/baseline && DB_SNAPSHOT_DIR=\"$SNAPDIR\" npm run test:export)`
    - `(cd demos/v5 && DB_SNAPSHOT_DIR=\"$SNAPDIR\" npm run test:export)`
    - `(cd demos/v6 && DB_SNAPSHOT_DIR=\"$SNAPDIR\" npm run test:export)`
  - snapshot root: `/tmp/demo-parity-prd001-wi003-1771756832`
  - compare output:
    - `extras in v6: 2`
    - `extras in baseline: 0`
    - `extras in v5: 2`
    - `common files: 82; mismatches: 0`
- [x] CI Demo Snapshot Parity run URL and success conclusion
  - workflow: `Demo Snapshot Parity`
  - run id: `22275554617`
  - URL: `https://github.com/nielsgl/sequelize-paper-trail/actions/runs/22275554617`
  - event/branch: `workflow_dispatch` on `master`
  - conclusion: `success` (`status: completed`)
  - key compare output from CI log:
    - `extras in v5: 2`
    - `extras in baseline: 0`
    - `extras in v6: 2`
    - `common files: 82; mismatches: 0`
- [x] release checklist linkage explicitly recorded
  - `docs/RELEASE-CHECKLIST.md` section `2) Testing (Required Gates)` is satisfied by this WI evidence block.
  - `docs/RELEASE-CHECKLIST.md` section `6) Post-Release` item "links to gate evidence" is satisfied by linking release evidence to this WI file: `docs/impl/PRD-001/WI-003-release-gates-and-evidence.md`.

## Decision Risks And Mitigations

- Risk: local gate pass but CI parity diverges due environment differences.
- Mitigation: require both local parity output and successful CI workflow run URL evidence.

## Execution Risks And Mitigations

- Risk: status drift between runtime `docs/STATUS.md` and mirrored PRD/WI metadata.
- Mitigation: update runtime state first and mirror WI status changes in the same change set.
- Risk: demo parity mismatch due stale local tarball or snapshot directory reuse.
- Mitigation: rebuild tarball and use fresh timestamped snapshot directory each run.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved in-session (`approved`).

## Final Comprehensive Summary

### What changed

- Executed all required WI-003 release gates: `npm test -- --coverage`, `npm run test:v6`, local demo parity, and CI Demo Snapshot Parity workflow.
- Recorded reproducible evidence including coverage artifacts, local snapshot parity output, CI run URL, and non-determinism notes.
- Added explicit clean-environment proof and explicit release-checklist linkage evidence for WI-003.

### Why this option was chosen

- Requiring both local parity output and CI parity workflow evidence gives stronger release-gate confidence than either signal alone.

### What alternatives were rejected and why

- Local-only parity evidence: rejected because it does not capture runner/environment parity with GitHub Actions.
- CI-only parity evidence: rejected because it weakens local reproducibility and developer-side debugging evidence.

### Validation executed and results

- `npm test -- --coverage`: pass (`14/14` suites, `105` tests, coverage `100%` all tracked files).
- `npm run test:v6`: pass (`14/14` suites, `105` tests, coverage `100%` all tracked files).
- local parity compare: pass (`common files: 82; mismatches: 0`).
- CI parity run `22275554617`: pass (`conclusion: success`).

### Edge cases considered

- Dependency deprecation warnings during demo installs were treated as non-blocking because parity and test outputs remained deterministic.
- Snapshot export extras differed by demo flavor (`v5` and `v6` extras), while mismatch count remained zero for common snapshot set.

### Residual risks

- Upstream package deprecations can increase warning noise in future parity runs.
- Future dependency drift may alter demo install behavior despite current pass state.

### Follow-up recommendations, if any

- Keep monitoring parity workflow durations/install warnings and prune deprecated dependencies where feasible.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

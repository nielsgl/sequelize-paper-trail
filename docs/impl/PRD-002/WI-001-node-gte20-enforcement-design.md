# PRD-002 WI-001 - Node >=20 Enforcement Design

## Work Item Metadata

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-006`
- Status: `In Progress` (mirrors `docs/STATUS.md`)
- Branch: `codex/prd-002-wi-001-node-gte20-enforcement-design`
- Worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-001`

## Work Item Status

- Current phase: `Step 4 implementation in progress`
- Plan Gate: `Approved`
- Ship Gate: `Pending`

## Scope

Implement hard runtime enforcement for Node >=20 in `init()` and update user-facing policy/docs and tests to match v4 support semantics.

## Startup Output (Recorded)

- Selected PRD/WI: `PRD-002 / WI-001`
- Selection rationale (precedence rule): explicit user-selected PRD/WI override.
- Ownership signals observed: no active `In Progress` claim row for WI-001 before claim and no matching `codex/prd-002-wi-001*` ownership branch/worktree.
- Skip/reselection rationale: not applicable.
- Planning-path trace: `plan-mode`

## Pre-Mutation Context Assertion (Recorded)

- expected branch: `codex/prd-002-wi-001-node-gte20-enforcement-design`
- expected worktree: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-001`
- current branch: `codex/prd-002-wi-001-node-gte20-enforcement-design`
- cwd: `/Users/niels.van.Galen.last/code/sequelize-paper-trail/.worktrees/prd-002-wi-001`

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-001 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Plan Gate Decision

- Approved via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN:` followed by full phase 0-7 execution runbook for WI-001.

## Tasks

- [x] Replace Node<20 warning path with hard runtime enforcement.
- [x] Remove suppression behavior (`SUPPRESS_NODE_DEPRECATION`) from v4 runtime path.
- [x] Define deterministic error contract (`ERR_UNSUPPORTED_NODE_VERSION`) for unsupported runtime.
- [x] Update tests to assert throw behavior across supported and unsupported runtime scenarios.
- [x] Update README and migration policy text for v4 enforcement semantics.
- [x] Execute verification command set and record results.
- [ ] Reconcile runtime/PRD/WI status labels at close-out.

## Implementation Findings

### Runtime Enforcement Contract

- `init()` now calls `assertSupportedNodeVersion()` before adapter selection.
- Supported runtime criterion: parsed Node major version exists and `>= 20`.
- Unsupported runtime criterion:
  - parsed major is `< 20`, or
  - version is missing/unparseable (`fail-closed`).
- Error contract for unsupported runtime:
  - throws `Error`,
  - `error.code = 'ERR_UNSUPPORTED_NODE_VERSION'`,
  - deterministic message includes current observed runtime token and required floor (`Node >=20`).

### Test Contract Updates

- `test/node-deprecation.spec.js` converted from warning assertions to enforcement assertions.
- Coverage includes:
  - Node `18.19.0` throws with `ERR_UNSUPPORTED_NODE_VERSION`,
  - Node `22.22.0` does not throw,
  - missing `process.versions.node` throws with `ERR_UNSUPPORTED_NODE_VERSION`,
  - malformed version (`not-a-version`) throws with `ERR_UNSUPPORTED_NODE_VERSION`,
  - `SUPPRESS_NODE_DEPRECATION=1` does not bypass enforcement.

### Documentation Contract Updates

- `README.md` support-policy language now states v4 runtime enforcement and explicit error code behavior.
- `docs/MIGRATION.md` prerequisite language now states fail-closed v4 enforcement behavior.
- `docs/prd/PRD-002-release-v4-0-0.md` WI-001 mirror status updated to `In Progress`.

### First-Mutating-Command Context Proof

- first non-Step-2/2A mutation: `lib/index.js` update in claimed worktree.
- command path context: claimed worktree on branch `codex/prd-002-wi-001-node-gte20-enforcement-design`.
- main-branch mutation guard: passed (`current branch != main`).

### Command Re-Run Safety Validation

- `npm test -- test/node-deprecation.spec.js`
  - classification: `safe-no-op retry`
  - outcome: passed on first run and re-run after lint-related test refactor.

- `npm test`
  - classification: `safe-no-op retry`
  - outcome: passed on first run and re-run after lint-related test refactor.

- `npm run test:v6`
  - classification: `safe-no-op retry`
  - outcome: passed on first run and re-run after lint-related test refactor.

- `npm run lint` (claimed worktree)
  - classification: `guarded retry`
  - first outcome: failed (`jest/no-conditional-expect` in `test/node-deprecation.spec.js` and one `import/no-unresolved` in `examples/v3/index.js`).
  - remediation: refactored tests to remove conditional expects; re-ran lint once.
  - second outcome: remaining `import/no-unresolved` in `examples/v3/index.js` only.
  - safety rationale: stopped after one retry per retry policy.

- `npm run lint` (primary worktree baseline check)
  - classification: `safe-no-op retry`
  - outcome: passed on `main`; indicates worktree-specific self-import resolver behavior rather than WI-001 logic regression.

### Decision Risks And Mitigations

- Risk: fail-closed behavior for unknown/malformed Node runtime metadata may reject unusual embedding/runtime setups.
- Mitigation: deterministic error code + explicit message provide immediate remediation path and reduce silent undefined behavior.

- Risk: ecosystem users may rely on `SUPPRESS_NODE_DEPRECATION` from v3 semantics.
- Mitigation: docs now explicitly state no runtime bypass in v4 and migration guidance points to Node upgrade as required path.

## Execution Risks And Mitigations

- Risk: enforcement tests can be flaky if global module cache and `process.versions` overrides leak across cases.
- Mitigation: keep `jest.resetModules()` + `jest.isolateModules()` and restore `process.versions` in `finally`.

- Risk: runtime/PRD/implementation status drift during lifecycle updates.
- Mitigation: treat `docs/STATUS.md` as source of truth and reconcile mirrored statuses in same close-out change.

## Verification / Evidence

- [x] `npm test -- test/node-deprecation.spec.js` (pass)
- [x] `npm test` (pass)
- [x] `npm run test:v6` (pass)
- [x] `npm run lint` (claimed worktree failed due remaining `examples/v3/index.js` self-import resolver mismatch; baseline root lint pass recorded)
- [x] command re-run safety classification recorded for failed/retried command paths.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-001 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Ship Gate Decision

- Approved via explicit user instruction: `PLEASE IMPLEMENT THIS PLAN:` including phase 6-7 ship steps (`commit + merge + status update + cleanup`).

## Final Comprehensive Summary

### What changed

- Claimed `PRD-002 WI-001` with required lock metadata in `docs/STATUS.md`.
- Replaced Node deprecation warning behavior with hard runtime enforcement in `lib/index.js`.
- Added deterministic unsupported-runtime error contract (`ERR_UNSUPPORTED_NODE_VERSION`) for Node `<20` and unknown/malformed runtime metadata.
- Updated `test/node-deprecation.spec.js` to assert throw semantics and no-op suppression env behavior.
- Updated v4 policy text in `README.md` and `docs/MIGRATION.md`.
- Updated mirrored PRD status for WI-001 to `In Progress` in `docs/prd/PRD-002-release-v4-0-0.md`.

### Why this option was chosen

- It matches PRD-002 support contract for v4 (`Node >=20` enforced at runtime) and removes ambiguous warning-only behavior.

### What alternatives were rejected and why

- Warning-only compatibility mode was rejected because WI-001 requires hard runtime enforcement, not deprecation messaging.
- Suppression-env bypass (`SUPPRESS_NODE_DEPRECATION`) was rejected because opt-out conflicts with v4 enforcement semantics.

### Validation executed and results

- `npm test -- test/node-deprecation.spec.js`: pass.
- `npm test`: pass.
- `npm run test:v6`: pass.
- `npm run lint` in claimed worktree: one remaining resolver error in `examples/v3/index.js` (`import/no-unresolved` for package self-import).
- `npm run lint` in primary worktree baseline: pass.

### Edge cases considered

- Missing `process.versions.node`.
- Malformed `process.versions.node` string.
- Legacy environment variable `SUPPRESS_NODE_DEPRECATION=1` set.

### Residual risks

- Worktree-local eslint resolver behavior for package self-import path in `examples/v3/index.js` remains, but WI-001 runtime/test behavior is validated.

### Follow-up recommendations, if any

- For workflow runs that lint from nested worktrees, evaluate a repo-level lint invocation convention (primary worktree or resolver override) to avoid false positives unrelated to current WI scope.

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

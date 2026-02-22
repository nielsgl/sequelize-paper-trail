# PRD-002 WI-005 - Default Branch Rename master -> main

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `-`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Rename the default branch from `master` to `main` and reconcile all impacted settings and docs before continuing PRD-002 execution.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-005 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Rename default branch on GitHub (`master` -> `main`).
- [ ] Update branch protection rules for `main` and verify required checks.
- [ ] Update workflows/docs references that still assume `master`.
- [ ] Verify release workflow dispatch and CI behavior on `main`.
- [ ] Confirm local repo and active worktrees are aligned to `main`.

## Verification / Evidence

- [ ] `gh repo view --json defaultBranchRef -q .defaultBranchRef.name` returns `main`.
- [ ] branch protection evidence captured for `main`.
- [ ] `rg -n "\\bmaster\\b"` run and reviewed for intended remaining mentions.
- [ ] CI and release workflow run evidence linked.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-005 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

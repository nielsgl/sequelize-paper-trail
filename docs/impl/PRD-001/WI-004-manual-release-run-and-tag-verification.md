# PRD-001 WI-004 - Manual Release Run And Tag Verification

- PRD: `docs/prd/PRD-001-release-v3-1-0.md`
- Depends on: `PRD-001 WI-003`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Document and execute the manual release workflow path for v3.1.0:

- dry-run path,
- publish path,
- tag verification notes.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-001 WI-004 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Trigger manual release workflow in GitHub Actions.
- [ ] Verify npm publish path and provenance notes.
- [ ] Verify tag creation and commit association.
- [ ] Record release-note checklist evidence (content, links, migration notes).
- [ ] Record operator steps and outcomes in checklist artifacts.

## Verification / Evidence

- [ ] Workflow run URL and status.
- [ ] npm package/version visibility evidence.
- [ ] `git tag` and release note linkage evidence.
- [ ] release notes/checklist evidence links captured.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-001 WI-004 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

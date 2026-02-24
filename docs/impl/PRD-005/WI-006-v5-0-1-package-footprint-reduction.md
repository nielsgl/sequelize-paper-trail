# PRD-005 WI-006 - v5.0.1 Package Footprint Reduction (Lowest Priority)

- PRD: `docs/prd/PRD-005-release-v5-0-0.md`
- Depends on: `PRD-005 WI-005`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Priority

Lowest priority follow-up after v5.0.0 is released.

## Objective

Reduce published npm package footprint for `v5.0.1` by excluding non-runtime artifacts from the tarball while preserving consumer functionality.

## Scope

- Introduce explicit package include strategy (`files` in `package.json` and/or `.npmignore`).
- Exclude docs, tests, coverage artifacts, demos, and local automation artifacts from npm payload.
- Preserve required runtime/build outputs (`dist/`, license, readme, changelog, package metadata).

## Tasks

- [ ] Capture current npm tarball baseline (`npm pack --json` size + file count).
- [ ] Define and implement include/exclude policy.
- [ ] Regenerate tarball and compare before/after metrics.
- [ ] Validate install/require smoke path from packed artifact.
- [ ] Document policy and evidence in release docs.

## Verification / Evidence

- [ ] Before/after tarball size and file-count table.
- [ ] `npm pack --json` output references.
- [ ] Smoke verification output using packed artifact install.

## Acceptance Criteria

- Published artifact is materially smaller with no runtime regressions.
- Exclusion policy is explicit, version-controlled, and maintainable.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-005 WI-006 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-005 WI-006 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`
- `policy-decision-required`

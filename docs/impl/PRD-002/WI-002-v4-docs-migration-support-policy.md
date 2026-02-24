# PRD-002 WI-002 - v4 Docs, Migration, And Support Policy

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-001`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Deliver complete, user-facing v4 bridge documentation updates across README, migration, release policy, and release checklist.

This WI is complete only when each target file contains actionable v4 guidance (not just sequencing notes) and all cross-file statements are internally consistent.

## In Scope

- `README.md`: v4 support contract language for Node >=20 enforcement and Sequelize v5+v6 bridge behavior.
- `docs/MIGRATION.md`: concrete v3 -> v4 migration steps, including CLS guidance and runtime enforcement impact.
- `RELEASE-POLICY.md`: explicit v4 line policy (bugfix-only bridge) and release governance wording.
- `docs/RELEASE-CHECKLIST.md`: v4 release-time documentation and evidence expectations.
- `docs/prd/PRD-002-release-v4-0-0.md`: mirror status updates for WI lifecycle.

## Out Of Scope

- Publishing v4.0.0 (owned by `PRD-002 WI-004`).
- Running branch protection/config changes (owned by `PRD-002 WI-003`).
- Tooling-major remediation (owned by `PRD-004`).
- `CHANGELOG` final release entry finalization (owned by `PRD-002 WI-004`).

## Execution Branch Contract

- Base branch for this WI: `main`.
- Perform implementation on the claimed feature/worktree branch cut from `main`.
- Do not run publish actions from this WI.

## Required Content Outcomes (Must Exist)

1. README support section states:
   - v4 is bugfix-only bridge.
   - Node <20 is unsupported and `init()` throws `ERR_UNSUPPORTED_NODE_VERSION`.
   - Sequelize v5 and v6 are both supported for v4.
   - v3 -> v4 -> v5 upgrade path is explicit.
2. Migration guide states:
   - prereqs for v4 (Node >=20),
   - what breaks when runtime is below floor,
   - CLS package expectations by Sequelize version,
   - ordered migration checklist users can execute.
3. Release policy states:
   - v4 maintenance boundaries (no new features),
   - required release gates and security evidence gate references,
   - ownership boundary between WI-002 docs alignment and WI-004 release-note/changelog finalization.
4. Release checklist states:
   - explicit v4 docs verification items prior to publish,
   - required evidence links expected at release time.

## Non-Sufficient Completion Rule

The following by itself is not sufficient for WI completion:

- adding only sequencing/ownership notes,
- grep-only keyword presence without actionable guidance,
- status updates without substantive file content changes.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-002 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Update `README.md` support section to reflect final v4 contract language and upgrade path.
- [ ] Update `docs/MIGRATION.md` with concrete v3 -> v4 migration steps and v4 runtime enforcement behavior.
- [ ] Update `RELEASE-POLICY.md` with explicit v4 maintenance boundaries and release-governance wording.
- [ ] Update `docs/RELEASE-CHECKLIST.md` with v4-specific docs/evidence expectations.
- [ ] Ensure cross-file consistency for Node floor, Sequelize support, and line ownership semantics.
- [ ] Update `docs/prd/PRD-002-release-v4-0-0.md` mirror status at close-out.

## Verification / Evidence

- [ ] Content diff review confirms substantive updates in all target files:
  - `README.md`
  - `docs/MIGRATION.md`
  - `RELEASE-POLICY.md`
  - `docs/RELEASE-CHECKLIST.md`
- [ ] Cross-file consistency checks:
  - `rg -n "v4|bugfix-only|Node >=20|ERR_UNSUPPORTED_NODE_VERSION|Sequelize v5|Sequelize v6|v3 -> v4 -> v5" README.md docs/MIGRATION.md RELEASE-POLICY.md docs/RELEASE-CHECKLIST.md`
  - `rg -n "WI-004|CHANGELOG" RELEASE-POLICY.md docs/RELEASE-CHECKLIST.md docs/impl/PRD-002/WI-002-v4-docs-migration-support-policy.md`
- [ ] Lint/docs sanity check:
  - `npm run lint`
- [ ] Ship gate packet includes:
  - changed-file list,
  - key before/after wording excerpts,
  - unresolved ambiguity list (must be empty or explicitly blocked).

## Acceptance Criteria

- All required content outcomes are present and internally consistent.
- No contradiction remains between README, migration, policy, and checklist wording.
- WI-002 implementation file includes completed verification evidence (not placeholders).
- Runtime status and PRD mirror status are reconciled during close-out.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-002 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `policy-decision-required`

# Implementation Plan Files

This directory stores one implementation-plan file per work item (WI).

## Path Convention

- PRD folder: `docs/impl/PRD-<num>/`
- WI file: `WI-<num>-<slug>.md`
- Example: `docs/impl/PRD-001/WI-003-release-gates-evidence.md`

There must be exactly one file matching each WI key:

- `docs/impl/PRD-001/WI-001-*.md`
- `docs/impl/PRD-001/WI-002-*.md`
- ...

## Required Metadata In Each WI File

Each WI file must include:

1. Canonical ID (`PRD-XXX WI-YYY`)
2. Link to source PRD (`docs/prd/PRD-XXX-*.md`)
3. Dependencies (`Depends on`)
4. Mirrored runtime status line:
   - `- Status: \`Planned|In Progress|Blocked|Done\` (mirrors \`docs/STATUS.md\`)`
5. Plan Gate prompt
6. Ship Gate prompt
7. Verification/evidence section
8. Deterministic blocked reason codes

## Gate Lifecycle

1. Claim WI in `docs/STATUS.md` (`In Progress`) with lock metadata.
2. Resolve Plan Gate using the WI's `Plan Gate Prompt`.
3. Execute implementation and record evidence.
4. Resolve Ship Gate using the WI's `Ship Gate Prompt`.
5. Move WI to `Done` or `Blocked` in `docs/STATUS.md`.
6. Keep WI file status in sync with runtime status.

## Standard Gate Prompts

- Plan Gate:
  - `PLAN GATE: Approve implementation for PRD-XXX WI-YYY exactly as scoped in this file? Reply: "Approve Plan Gate".`
- Ship Gate:
  - `SHIP GATE: Approve ship actions for PRD-XXX WI-YYY after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `stale-lock-recovery-required`
- `external-dependency-blocked`
- `policy-decision-required`

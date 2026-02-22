# Runtime Work Item Status

`docs/STATUS.md` is the runtime source of truth for WI lifecycle state during workflow-orchestrator execution.

## Backlog

Ordered by execution wave and dependency.

| ID | PRD | WI | Title | Wave | Depends On | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `PRD-001 WI-001` | `PRD-001` | `WI-001` | Orchestrator bootstrap for PRD-001 (index/status/impl wiring) | 1 | - | Done |
| `PRD-001 WI-002` | `PRD-001` | `WI-002` | Docs and messaging consistency pass (`README`, `CHANGELOG`, `MIGRATION`, `RELEASE-POLICY`, `CI`) | 2 | `PRD-001 WI-001` | Done |
| `PRD-001 WI-003` | `PRD-001` | `WI-003` | Execute release gates (`test --coverage`, `test:v6`, demo parity) and record evidence | 2 | `PRD-001 WI-002` | Done |
| `PRD-001 WI-004` | `PRD-001` | `WI-004` | Manual release workflow dry-run, publish path, and tag verification notes | 2 | `PRD-001 WI-003` | Done |
| `PRD-001 WI-005` | `PRD-001` | `WI-005` | Align `release/v3` to `v3.1.0` and record branch-protection evidence | 2 | `PRD-001 WI-004` | Done |
| `PRD-002 WI-001` | `PRD-002` | `WI-001` | Node >=20 enforcement design and impact checklist | 3 | - | Planned |
| `PRD-002 WI-002` | `PRD-002` | `WI-002` | v4 docs, migration, and support-policy updates | 3 | `PRD-002 WI-001` | Planned |
| `PRD-002 WI-003` | `PRD-002` | `WI-003` | Create `release/v4` branch and CI gate contract setup | 3 | `PRD-002 WI-002` | Planned |
| `PRD-002 WI-004` | `PRD-002` | `WI-004` | v4 release workflow execution and post-release `npm deprecate` plan for v3 | 3 | `PRD-002 WI-003` | Planned |
| `PRD-003 WI-001` | `PRD-003` | `WI-001` | Golden diff-behavior fixture matrix (nested/object/array/null/ordering) | 4 | - | Planned |
| `PRD-003 WI-002` | `PRD-003` | `WI-002` | Local diff adapter implementation plan and compatibility proof points | 4 | `PRD-003 WI-001` | Planned |
| `PRD-003 WI-003` | `PRD-003` | `WI-003` | Remove `deep-diff` from runtime deps and update changelog/status | 4 | `PRD-003 WI-002` | Planned |
| `PRD-004 WI-001` | `PRD-004` | `WI-001` | Tooling-major review decision (Jest 30, ESLint 9, Prettier latest) | 5 | - | Planned |

## In Progress

One claimed WI per session. Use one row per active claim with concrete values.

| ID | Title | owner | branch | worktree | impl | plan-gate | claim-state | claim-owner | claim-token | claimed-at | Depends On | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _(none)_ | - | - | - | - | - | - | - | - | - | - | - | - |

## Blocked

Use deterministic reason codes in `reason-code`.

| ID | Title | reason-code | blocked-by | owner action | Notes |
| --- | --- | --- | --- | --- | --- |
| _(none)_ | - | - | - | - | - |

## Done

Record completion and evidence location.

| ID | Title | completed-at | Evidence |
| --- | --- | --- | --- |
| `PRD-001 WI-001` | Orchestrator bootstrap for PRD-001 (index/status/impl wiring) | `2026-02-22T10:15:47Z` | `docs/impl/PRD-001/WI-001-orchestrator-bootstrap-for-prd-001.md` |
| `PRD-001 WI-002` | Docs and messaging consistency pass (`README`, `CHANGELOG`, `MIGRATION`, `RELEASE-POLICY`, `CI`) | `2026-02-22T10:31:29Z` | `docs/impl/PRD-001/WI-002-docs-message-consistency.md` |
| `PRD-001 WI-003` | Execute release gates (`test --coverage`, `test:v6`, demo parity) and record evidence | `2026-02-22T10:52:19Z` | `docs/impl/PRD-001/WI-003-release-gates-and-evidence.md` |
| `PRD-001 WI-004` | Manual release workflow dry-run, publish path, and tag verification notes | `2026-02-22T11:21:02Z` | `docs/impl/PRD-001/WI-004-manual-release-run-and-tag-verification.md` |
| `PRD-001 WI-005` | Align `release/v3` to `v3.1.0` and record branch-protection evidence | `2026-02-22T11:46:28Z` | `docs/impl/PRD-001/WI-005-align-release-v3-and-protection-evidence.md` |

## Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `stale-lock-recovery-required`
- `external-dependency-blocked`
- `policy-decision-required`

## Historical Context (Reference Only)

- Historical phase and demo PRDs remain in `docs/archive/`.
- Active PRDs remain in `docs/prd/`.
- Runtime WI execution now uses this file plus `docs/INDEX.md` and `docs/impl/`.

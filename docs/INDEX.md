# PRD Index

This is the canonical PRD selector for workflow-orchestrator claim precedence.

## Active PRDs
- PRD-001: release-v3-1-0 | Active: yes | Priority: P0 | Execution waves: 1,2
- PRD-002: release-v4-0-0 | Active: no | Priority: P1 | Execution waves: 3
- PRD-003: deep-diff-replacement | Active: no | Priority: P2 | Execution waves: 4
- PRD-004: tooling-major-review | Active: no | Priority: P3 | Execution waves: 5

## Execution Waves
- Wave 1: PRD-001 WI-001
- Wave 2: PRD-001 WI-002, PRD-001 WI-003, PRD-001 WI-004, PRD-001 WI-005
- Wave 3: PRD-002 WI-005, PRD-002 WI-006, PRD-002 WI-001, PRD-002 WI-002, PRD-002 WI-003, PRD-002 WI-004
- Wave 4: PRD-003 WI-001, PRD-003 WI-002, PRD-003 WI-003
- Wave 5: PRD-004 WI-001

## PRD to WI Mapping
### PRD-001 release-v3-1-0
- WI-001: Orchestrator bootstrap wiring for PRD-001.
- WI-002: Docs and messaging consistency pass.
- WI-003: Release gates execution and evidence capture.
- WI-004: Manual release workflow dry-run, publish, and tag verification notes.
- WI-005: Align `release/v3` to `v3.1.0` and verify branch protection evidence.

### PRD-002 release-v4-0-0
- WI-005: Rename default branch `master` to `main` and reconcile branch protections/workflows/docs.
- WI-006: Security vulnerability triage and remediation plan before v4 release.
- WI-001: Node >=20 enforcement design and impact checklist.
- WI-002: v4 docs, migration, and support policy updates.
- WI-003: `release/v4` branch and CI gate contract setup.
- WI-004: v4 release execution and post-release `npm deprecate` plan for v3.

### PRD-003 deep-diff-replacement
- WI-001: Golden diff behavior fixture matrix.
- WI-002: Local diff adapter implementation plan and compatibility proof points.
- WI-003: `deep-diff` removal and changelog/status updates.

### PRD-004 tooling-major-review
- WI-001: Formal tooling-major review decision (Jest 30, ESLint 9, Prettier latest).

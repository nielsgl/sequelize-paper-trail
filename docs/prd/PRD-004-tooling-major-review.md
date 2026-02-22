# PRD-004: Tooling Major Upgrade Review

## Context

Phase 6 work (tooling major review) is intentionally deferred, but it must stay traceable as a PRD/WI item so it is not lost between release lines.

## Goals

- Run a formal go/no-go review for major upgrades:
  - Jest 30
  - ESLint 9
  - Prettier latest major
- Produce migration risk notes and rollout sequencing.
- Decide whether to execute in v5 line or defer again with explicit rationale.

## Non-Goals

- No tooling major upgrade implementation in this PRD.
- No runtime behavior changes.

## Acceptance Criteria

- A single WI tracks the review outcome with explicit decision (`go` / `no-go` / `defer`).
- Decision includes required config migration notes and test impact notes.
- `docs/STATUS.md` and `docs/PLAN.md` reference this PRD as tracked deferred work.
- Deferred high/critical dev-tooling vulnerabilities from `PRD-002 WI-006` have a remediation WI linked under this PRD.

# PRD: Phase 6 — Tooling Major Upgrade Review

## Status
- State: Deferred
- Evidence: No implementation yet (review-only phase).
- Deferred: Go/no-go decision and upgrade plan pending.

## Overview
Phase 4 evaluates whether we can safely upgrade tooling to the latest major versions (e.g., Jest 30, ESLint 9, Prettier latest) after Phase 3 stabilizes. This is a review-only phase that results in a go/no-go decision and a concrete upgrade plan if feasible.

## Goals
- Assess impact of major tooling upgrades on tests, lint, and build flow.
- Identify required config migrations (e.g., ESLint flat config).
- Produce a risk-aware upgrade proposal or defer with rationale.

## Non-Goals
- No runtime/library API changes.
- No Sequelize version changes.

## Scope
### In Scope
- Jest, ESLint, Prettier, Babel tooling.
- Dev-only dependency updates and config migrations.

### Out of Scope
- Runtime dependencies.
- CI pipeline implementation (document only).

## Acceptance Criteria
- Clear go/no-go recommendation documented.
- If go: draft upgrade steps and expected config changes.
- If no-go: document blockers and revisit timing.
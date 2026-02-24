# PRD-004: Tooling and Security Remediation for v5 Readiness

## Why This PRD Exists

Current CI/install output includes multiple deprecated tooling dependencies and unresolved dev-tooling vulnerability backlog from PRD-002 WI-006 exceptions. We need a decision-complete remediation path before final v5 release execution.

## Outcome Required

Produce a concrete tooling/security decision and execute the approved remediation set so v5 release can proceed with explicit risk posture.

## In Scope

- Formal go/no-go/defer decision for major tooling upgrades:
  - Jest 30
  - ESLint 9
  - Prettier latest major
- Remediation of deferred high/critical dev-tooling vulnerabilities where feasible.
- Explicit exception carry-forward for anything intentionally deferred.

## Out of Scope

- Runtime feature changes.
- Diff adapter replacement (PRD-003).
- v5 publish/tag execution (PRD-005).

## Decision Rules

1. Every deferred high/critical item must end in one of:
   - fixed,
   - accepted exception with owner/date/reason,
   - blocked by external dependency with tracked follow-up.
2. No ambiguous “we should” outputs.
3. Release-impacting risks must be explicitly labeled as blocking or non-blocking for PRD-005.

## Execution Structure

- `PRD-004 WI-001`: tooling-major decision record and sequencing.
- `PRD-004 WI-002`: implement approved remediation and refresh exception list.

## Required Gates

- `npm run lint`
- `npm test -- --coverage`
- `npm run test:v6`
- Security evidence refresh (`npm audit --json`, `npm audit --omit=dev --json`)

## Acceptance Criteria

- WI-001 decision is explicit (`go`/`no-go`/`defer`) with rationale and rollout order.
- WI-002 applies approved changes and updates vulnerability evidence.
- Remaining exceptions (if any) are explicit and linked to PRD-005 release risk decision.

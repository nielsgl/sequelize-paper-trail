# PRD-002 WI-003 - Release/v4 Branch And CI Contract

- PRD: `docs/prd/PRD-002-release-v4-0-0.md`
- Depends on: `PRD-002 WI-002`
- Status: `Planned` (mirrors `docs/STATUS.md`)

## Scope

Create `release/v4` and enforce an explicit, auditable CI + branch-protection contract for v4 maintenance.

## In Scope

- Create/sync `release/v4` from approved base.
- Define required status checks for v4 branch protection.
- Configure and verify branch protection settings on `release/v4`.
- Document backport/cherry-pick behavior for v4 maintenance.
- Capture API-backed evidence for all protection settings.

## Out Of Scope

- Publishing v4.0.0 (`PRD-002 WI-004`).
- Runtime feature/bug changes unrelated to branch governance.
- Broad branch-policy redesign outside v4 branch requirements.

## Execution Branch Contract

- Base branch for implementation work: `main`.
- `release/v4` is created/configured as part of this WI and becomes the release source branch for `WI-004`.
- Do not publish from this WI.

## Required CI/Protection Contract (Must Match)

For `release/v4`, minimum contract:

- Required status check context includes `Test (v5 + optional v6)` (or the repo's canonical equivalent if renamed; document exact final name).
- Pull request review required:
  - `required_approving_review_count >= 1`
- Force pushes disabled after setup.
- Admin bypass policy explicitly documented (enabled or disabled) with rationale.
- Required checks are strict (`strict=true`) unless an explicit policy exception is approved and recorded.
- WI-004 precondition: `release/v4` protection evidence must be complete before release execution starts.

## Non-Sufficient Completion Rule

The following is not sufficient:

- creating branch without protection verification,
- screenshots without reproducible API/CLI evidence,
- documenting intended policy without showing actual configured values.

## Plan Gate Prompt

`PLAN GATE: Approve implementation for PRD-002 WI-003 exactly as scoped in this file? Reply: "Approve Plan Gate".`

## Tasks

- [ ] Create `release/v4` from approved base commit/branch and push to origin.
- [ ] Apply branch protection for `release/v4` per required CI/protection contract.
- [ ] Verify effective protection settings via GitHub API (`gh api`) and save evidence.
- [ ] Verify CI workflow behavior on `release/v4` (required check context resolves correctly).
- [ ] Update policy docs if check name/policy differs from prior assumptions.
- [ ] Record explicit WI-004 unblock note once protection contract is verified.
- [ ] Document maintenance flow:
  - forward fixes land on highest supported line first,
  - cherry-pick into `release/v4` when applicable.

## Verification / Evidence

- [ ] Branch exists and points to expected base:
  - `git ls-remote --heads origin release/v4`
  - `git merge-base --is-ancestor <base_sha> origin/release/v4`
- [ ] Branch protection evidence captured:
  - `gh api repos/<owner>/<repo>/branches/release/v4/protection`
  - extracted fields include required checks, review count, force-push setting, strict mode.
- [ ] CI evidence on `release/v4`:
  - workflow run URL(s) and status,
  - check context names as seen in branch protection vs workflow output.
- [ ] Docs evidence:
  - `RELEASE-POLICY.md` and/or `docs/CI.md` updated if needed to match actual settings.
- [ ] Handoff evidence:
  - WI-003 summary explicitly states WI-004 is blocked until this contract is complete, then marks it unblocked.

## Acceptance Criteria

- `release/v4` exists remotely with verified base ancestry.
- Branch protection is active and matches the required contract (or documented approved exception).
- CI check context mapping is unambiguous and reproducible.
- Maintenance/backport guidance for v4 is explicitly documented.
- WI-004 unblock condition is explicitly documented as satisfied.

## Ship Gate Prompt

`SHIP GATE: Approve ship actions for PRD-002 WI-003 after listed verification evidence is present? Reply: "Approve Ship Gate".`

## Blocked Reason Codes

- `awaiting-plan-gate-response`
- `awaiting-ship-gate-response`
- `external-dependency-blocked`

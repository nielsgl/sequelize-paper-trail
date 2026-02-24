# Release Checklist

## Purpose
Single, reusable checklist for shipping any release (minor/major) of sequelize-paper-trail. Use this instead of phase‑specific checklists.

## Update When
Update this document whenever release gates or publishing steps change.

## Checklist

### 1) Docs & Messaging
- [ ] Update README “Supported Versions” and deprecation warnings.
- [ ] Update `CHANGELOG` with user‑visible changes and migration notes.
- [ ] For `PRD-002 WI-002`, record the follow-up to finalize release-note + `CHANGELOG` entries in `PRD-002 WI-004` (do not finalize changelog in WI-002).
- [ ] Ensure `RELEASE-POLICY.md` and `docs/CI.md` reflect any process changes.
- [ ] Update the migration guide if behavior or support changes.

### 1A) v4 Bridge Contract Checks (When Shipping v4)
- [ ] README contains explicit v4 bridge contract details (Node>=20 enforcement + Sequelize v5/v6 support scope).
- [ ] Migration guide contains a concrete `v3 -> v4` checklist with runtime/CLS verification steps.
- [ ] Release policy includes v4 allowed/disallowed change classes (bugfix-only, no feature expansion).
- [ ] Release-note and `CHANGELOG` finalization is tracked in WI-004 before publish approval.

### 2) Testing (Required Gates)
- [ ] `npm test -- --coverage`
- [ ] Save coverage artifact reference (summary + location/link) in release notes or PR evidence.
- [ ] `npm run test:v6`
- [ ] Demo snapshot parity across baseline/v5/v6

### 2A) Security Gate Evidence (Required)
- [ ] `npm audit --omit=dev --json` confirms zero runtime/prod vulnerabilities.
- [ ] `npm audit --json` snapshot is captured and triaged (runtime vs dev/test/release path).
- [ ] Any unresolved high/critical findings are listed as explicit exceptions with risk, owner, and follow-up target WI/version.
- [ ] Security-gate evidence is linked from the active WI file in `docs/impl/PRD-<num>/WI-<num>-*.md`.

### 3) Release Automation
- [ ] Confirm `.github/workflows/release.yml` is required on the release branch.
- [ ] Verify the workflow runs install/test/test:v6 and uses any required flags.

### 4) Versioning & Tags
- [ ] Bump version with `npm version` (patch/minor/major as appropriate).
- [ ] Tag the release from the correct branch (`main` or `release/v*`).

### 5) Publishing
- [ ] Push release branch and ensure CI passes.
- [ ] Publish to npm once automation succeeds.

### 6) Post‑Release
- [ ] Deprecate the prior major on npm when a new major ships.
- [ ] Monitor issues for CLS/metadata regressions and parity drift.
- [ ] Confirm release notes include migration/support-policy deltas and links to gate evidence.
- [ ] Link gate evidence to the current WI implementation file (`docs/impl/PRD-<num>/WI-<num>-*.md`).

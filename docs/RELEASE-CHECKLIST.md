# Release Checklist

## Purpose
Single, reusable checklist for shipping any release (minor/major) of sequelize-paper-trail. Use this instead of phase‑specific checklists.

## Update When
Update this document whenever release gates or publishing steps change.

## Checklist

### 1) Docs & Messaging
- [ ] Update README “Supported Versions” and deprecation warnings.
- [ ] Update `CHANGELOG` with user‑visible changes and migration notes.
- [ ] Ensure `RELEASE-POLICY.md` and `docs/CI.md` reflect any process changes.
- [ ] Update the migration guide if behavior or support changes.

### 2) Testing (Required Gates)
- [ ] `npm test -- --coverage`
- [ ] Save coverage artifact reference (summary + location/link) in release notes or PR evidence.
- [ ] `npm run test:v6`
- [ ] Demo snapshot parity across baseline/v5/v6

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

# PRD: Phase 5 — Release, Migration, and CI Governance

## Status
- State: Partial
- Evidence: CI workflow, migration guide, release checklist, deprecation warning.
- Deferred: Release execution (bump/tag/publish) + npm deprecate old major.

## Overview
Phase 5 is the “ship” phase: we lock in the Sequelize v5 ↔ v6 compatibility promise, publish a release that documents the migration path, and put the supporting CI/release scaffolding in place so that future work can keep the contract without accidental regressions.

## Problem Statement
The modernization so far introduced parallel adapter support and a v6-focused test matrix, but there is no formal release that communicates the compatibility promise, documents how to migrate, or automates the quality checks (coverage, v6 runs) that underpin that promise. Continuing to develop without those artifacts risks shipping a release that consumers cannot trust and failing to capture important migration signals (CLS, metadata, CLI overrides).

## Goals
1. Publish a release that explicitly states “Sequelize v5 and v6 (6.37.7)” support, referencing the dedicated `npm run test:v6` gate and the coverage guarantees.
2. Provide migration guidance and notes for users upgrading to the modernized library to avoid surprises (CLS setup, metadata fields, `SEQUELIZE_ADAPTER` override, peer dependency pinning).
3. Transition CI/release automation from CircleCI to GitHub Actions, ensuring the new workflow runs `npm test`, `npm run test:v6`, and the lint/coverage rules that define the stability contract.
4. Establish release governance (version bump, changelog, release notes, tagging) plus risk mitigations for migration failures or breakages.

## Non-Goals
- TypeScript adoption, ALS migration, or major API additions.
- Supporting Sequelize v7 at this point.
- Branching tactics beyond a single-trunk release unless we discover a real need after this release.

## Users & Stakeholders
- **Maintainers**: need repeatable release scripts, changelog discipline, and clear governance to publish the v5/v6 compatibility claim.
- **Consumers**: expect a step-by-step migration story, release notes describing behavior deltas, and the assurance that the library still protects CLS metadata and revision behaviors.
- **Contributors**: require a documented CI matrix to run locally (now targeting GitHub Actions) and a checklist that verifies both test suites before cutting a release.

## Scope

### In Scope
- Release artifacts: changelog updates, README support section, release notes summarizing Phase 4 deliverables, and a documented migration guide (per-phase sign-off).
- Migration guidance: step-by-step instructions for upgrading to the newly modernized release (Node LTS 22.22.0, Sequelize v5/v6, CLS/`cls-hooked`, `SEQUELIZE_ADAPTER`, metadata fields, warning about unsupported patterns).
- CI transition: author a GitHub Actions workflow (stored in `.github/workflows/release.yml`) that installs deps, runs `npm test`, runs `npm run test:v6`, logs coverage, and optionally runs lint (deferred for future when ready).
- Release governance: define `npm version` bump strategy, release checklist (tests, docs, coverage, tags), and risk mitigation plan (fallback instructions, how to revert if metadata migrations fail).
- Documentation updates (docs/PROJECT, docs/TESTS, docs/CI) to reflect the release, GitHub Actions, coverage thresholds, and the migration story.
- Release governance artifacts include `docs/release_checklist_phase5.md` and the migration narrative at `docs/migration_phase5.md`.

### Out of Scope
- Rewriting code for TypeScript, ESM, or asynchronous storage changes.
- Supporting any other dialect than sqlite for the time being.
- Rolling out CI workflow for CircleCI; all new CI is handled via GitHub Actions.

## Functional Requirements
1. **Release Artifacts**
   - Update `CHANGELOG` with Phase 5 entries describing the v6 support and documentation improvements.
   - Add release notes (or use GitHub release template) that reference the dedicated v6 test script, coverage guarantees, and CLS behavior.
   - Ensure README/AGENTS/docs mention the new release and describe the `npm run test:v6` gate.

2. **Migration Guide**
   - Document the expected upgrade path (Node 22.22.0 + SQLite/`cls-hooked` steps, peer dependency acceptance, `SEQUELIZE_ADAPTER`, metadata field enforcement).
   - Highlight any breaking deltas (metaDataFields enforcement, no CLS namespace run, `enableMigration` behavior, etc.) and how to remediate them.
   - Provide a checklist that maintainer or consumer can follow before hitting `npm install`.

3. **CI & Testing Automation**
   - Invest in a GitHub Actions workflow that installs dependencies, runs `npm test -- --coverage`, runs `npm run test:v6 -- --coverage`, and records the results in logs/artifacts.
   - Ensure the workflow exposes a flag to optionally skip v6 runs for fast branches but requires them for release candidate merges.
   - Document the CI requirements in `docs/CI.md` along with the schedule for coverage thresholds.

4. **Release Governance & Risk Controls**
   - Define a release checklist covering version bump, changelog update, docs update, tests, and tagging.
   - Add runtime warnings or logging (docs at least) when an unsupported Sequelize version or missing `cls-hooked` is detected.
   - Document rollback/revert steps if a release introduces regressions (e.g., revert tag, publish patch).

## Non-Functional Requirements
- Release must keep compatibility with all documented v5 behaviors; any deviations require a documented justification.
- The release gating must include 100% coverage for `lib/index.js` and `lib/helpers.js` via both test commands.
- GitHub Actions must run on Node LTS (≥20) and enforce the coverage thresholds.
- Migration docs must be concise (≤800 words) and include code snippets for the reader to follow.

## Implementation Notes
- Use the `npm version` command to bump downstream release once the PR checklist is green; tie the GitHub Actions workflow to push events on the release branch.
- Record the migration guide under `docs/migration_phase5.md` (or a dedicated section in this PRD) so the doc is easy to find by consumers.
- In the workflow, set `SEQUELIZE_PACKAGE=sequelize-v6` for the v6 job; use `npm run test:v6` with coverage, ensuring Jest writes coverage artifacts for both runs.
- Add a script or alias in `package.json` to run coverage for `npm run test:v6` automatically (the script already sets env, just wrap with `-- --coverage` by default).
- Document in docs/CI that the GitHub Actions job should be required before merging to default branch.

## Test Plan
- Run `npm test -- --coverage` locally and record the success in the Phase 5 PRD checklist.
- Run `npm run test:v6 -- --coverage` locally (and in GitHub Actions) and capture the coverage artifacts.
- Validate that the release checklist (tests passing, docs updated, version bumped) is completed before creating a release candidate.

## Acceptance Criteria
1. Both v5 and v6 test suites pass with coverage and are recorded in the Phase 5 doc or workflow logs.
2. The migration guide clearly explains how to upgrade, how to configure CLS/`cls-hooked`, and how to reason about metadata enforcement.
3. README/CHANGELOG/docs mention the release and the compatibility promise, referencing the dedicated `npm run test:v6` gate.
4. GitHub Actions workflow exists and runs the required commands (install, test, test:v6).
5. Release checklist is defined, and the release artifact (tag) includes the necessary notes for consumers.

## Risks & Mitigations
- **Risk:** Migration missteps cause CLS metadata loss or failing tests for downstream users.
  - **Mitigation:** Document the CLS/metadata steps, include diagnostics in the release guide, and keep `npm run test:v6` tooling accessible.
- **Risk:** Coverage thresholds fail after release, undermining the compatibility contract.
  - **Mitigation:** Run coverage in both `npm test` and `npm run test:v6` during development and require passing statuses on GitHub Actions.
- **Risk:** GitHub Actions workflow is flaky or slow.
  - **Mitigation:** Keep jobs straight-forward (install, test, coverage) and allow optional skipping for non-release merges while requiring it for release candidates.

## Release Plan
1. Update docs/README and `docs/prd_phase5.md` with release/migration narrative.
2. Push changes to a release branch, run GitHub Actions (test + test:v6).
3. Bump version (e.g., `npm version 3.1.0`), update changelog/release notes, and tag the release.
4. Publish (`npm publish`), confirm coverage results, and announce compatibility in README/CHANGELOG/PRD.

## Open Questions
- Do we gate the v6 job only on release-branch merges, or should it run on every PR to `main`/`release`?
- Should the migration guide include sample code that exercises CLS namespaces for clarity?
- After Phase 5, shall we keep the legacy v5 line alive or move entirely to the new release cadence? 
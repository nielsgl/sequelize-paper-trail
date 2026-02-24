# Examples

This folder contains runnable examples for each support line. Each example is a minimal SQLite app that exercises the core paper-trail flow (create -> update -> destroy) and prints the resulting revisions.

## How to run
From any example folder:

```bash
npm install
npm run start
```

### Note on package source
Package source is version-specific:
- `examples/v3` uses published `sequelize-paper-trail@^3.1.0`.
- `examples/v4` uses published `sequelize-paper-trail@^4.0.0`.
- `examples/v5` uses a local tarball (`file:../_artifacts/sequelize-paper-trail-local.tgz`) for unreleased feature-line testing.

To refresh the local tarball for `examples/v5`, run from the repo root:

```bash
npm pack --pack-destination examples/_artifacts
cp examples/_artifacts/sequelize-paper-trail-*.tgz examples/_artifacts/sequelize-paper-trail-local.tgz
```

If you want to switch package source for a given example, edit `sequelize-paper-trail` in that example's `package.json`.

## Example index
- `examples/v3` - legacy line (Sequelize v5 + sqlite3@4); intended for hotfix-only scenarios.
- `examples/v4` - bridge line (Sequelize v6, Node >=20).
- `examples/v5` - feature line (Sequelize v6; v7 experimental later).

## Notes
- `examples/` are **human-readable** and intended for manual verification.
- `demos/` are **automated parity harnesses** used for snapshot gating.

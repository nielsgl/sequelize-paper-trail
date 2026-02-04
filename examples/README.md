# Examples

This folder contains runnable examples for each support line. Each example is a minimal SQLite app that exercises the core paper-trail flow (create -> update -> destroy) and prints the resulting revisions.

## How to run
From any example folder:

```bash
npm install
npm run start
```

### Note on package source
By default, the examples use a local tarball (`file:../_artifacts/sequelize-paper-trail-local.tgz`) so you can test the current working tree without publishing.
To refresh the tarball after changes, run from the repo root:

```bash
npm pack --pack-destination examples/_artifacts
cp examples/_artifacts/sequelize-paper-trail-*.tgz examples/_artifacts/sequelize-paper-trail-local.tgz
```

If you want to test the published package instead, replace `sequelize-paper-trail` in the example's `package.json` with the desired version (e.g., `^3.1.0`, `^4.0.0`).

## Example index
- `examples/v3` - legacy line (Sequelize v5 + sqlite3@4); intended for hotfix-only scenarios.
- `examples/v4` - bridge line (Sequelize v6, Node >=20).
- `examples/v5` - feature line (Sequelize v6; v7 experimental later).

## Notes
- `examples/` are **human-readable** and intended for manual verification.
- `demos/` are **automated parity harnesses** used for snapshot gating.

# Migration Guide (Living)

## Purpose
Provide maintainers and consumers a single, version‑indexed migration guide. This replaces phase‑specific migration notes.

## Update When
Update this document whenever runtime requirements, peer support, or behavioral expectations change.

## Current Baseline (v5/v6 Compatibility)
This library is verified against Sequelize **v5** and **v6.37.7**.

### Prerequisites
- **Node**: use 20.20.0 as the recommended baseline (active LTS >=20 is acceptable). On v4, Node <20 is unsupported and `init()` throws `ERR_UNSUPPORTED_NODE_VERSION` for Node <20 or unknown/malformed Node runtime metadata.
- **npm**: canonical package manager (lockfile `package-lock.json`).
- **Sequelize**: use `^5` for v5 apps or `^6` for v6 apps (both are accepted as peer deps).
- **CLS package**:
  - Sequelize v6: `cls-hooked` is required when using `continuationNamespace`.
  - Sequelize v5: legacy `continuation-local-storage` still works; `cls-hooked` is also supported via `SEQUELIZE_CLS=cls-hooked`.

### Upgrade Steps
1. Install the latest compatible release:
   ```bash
   npm install --save sequelize-paper-trail@latest
   ```
2. If you use CLS, configure one of the supported paths:
   - Sequelize v6 (recommended for v6 apps): install and configure `cls-hooked`.
   - Sequelize v5 (legacy path): keep `continuation-local-storage`, or migrate to `cls-hooked` using `SEQUELIZE_CLS=cls-hooked`.

   Example using `cls-hooked`:
   ```javascript
   const cls = require('cls-hooked');
   const namespace = cls.createNamespace('paper-trail');

   sequelizePaperTrail.init(sequelize, {
     continuationNamespace: 'paper-trail',
     continuationKey: 'userId',
   });

   namespace.run(() => {
     namespace.set('userId', currentUser.id);
     // your Sequelize write here
   });
   ```
3. Ensure required metadata fields are provided if `metaDataFields` is configured.
4. Run the required test gates:
   ```bash
   npm test -- --coverage
   npm run test:v6
   ```
5. (Optional) Use `SEQUELIZE_ADAPTER` to force a version for validation:
   ```bash
   SEQUELIZE_ADAPTER=v6 npm test
   ```

### Rollback Strategy
- Revert to the previous tag and reinstall dependencies.
- If CLS fails, confirm the namespace and key are set before your write.
- If adapter behavior is suspect, set `SEQUELIZE_ADAPTER=v5` temporarily and file an issue.

## Version‑Specific Notes
- **v3.x**: hotfix‑only line (critical fixes only). v3.1.0 adds a runtime warning on Node <20 (opt-out via `SUPPRESS_NODE_DEPRECATION=1`).
- **v4.x**: bugfix‑only bridge supporting Sequelize v5 + v6, Node >=20.
- **v5.x**: feature line; Sequelize v6 primary, v7 experimental later.
- Upgrade path: `v3 -> v4 -> v5`.

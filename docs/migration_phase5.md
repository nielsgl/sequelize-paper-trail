# Migration Guide: Releasing the Modernized Library

## Purpose
This guide walks maintainers and consumers through upgrading to the Phase 5 release that guarantees Sequelize **v5** and **v6.37.7** compatibility, CLS metadata preservation, and the new GitHub Actions quality gates.

## Prerequisites
- **Node**: align with `.node-version` (22.22.0) or any active Node LTS ≥20; this ensures the `sqlite3` native build succeeds with the shipped binaries. Node <20 is deprecated and will be unsupported in the next major release. The library logs a warning on `init()` unless `SUPPRESS_NODE_DEPRECATION=1` is set.
- **npm**: use the repository’s `package-lock.json` (npm is the canonical package manager; avoid mixing yarn).
- **Sequelize dependency**: pin to `^5` for v5-only consumers or `^6` for the v6 line; both are accepted as peer dependencies.
- **cls-hooked**: if you rely on CLS/continuation namespaces, install `cls-hooked@^4.2.2` before upgrading; the adapter performs a lazy require and will throw if CLS is requested but the dependency is missing.

## Upgrade Steps
1. **Update your dependency**:
   ```bash
   npm install --save sequelize-paper-trail@latest
   ```
   For upstream projects that still pin Sequelize v5, keep their `sequelize` dependency at `^5`. For apps already using Sequelize v6 or newer, keep `sequelize@^6` installed; the adapter will detect the major version automatically.

2. **Verify CLS support** (if you use `continuationNamespace`):
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
   If `cls-hooked` is missing, the adapter logs a descriptive error that mentions the missing optional dependency. Install it manually and rerun your CLI.

3. **Duplicate your metadata expectations**:
   - Keep `metaDataFields` configured with all required keys.
   - Provide metadata either via options (`{ metaData: { requestId: 'req' } }`) or via CLS (`metaDataContinuationKey` defaults to `metaData`).
   - Expect the library to throw when a required metadata field is missing—this is intentional to keep migration contracts explicit.

4. **Use the `SEQUELIZE_ADAPTER` environment override** (for testing or deterministic upgrade validation):
   ```bash
   SEQUELIZE_ADAPTER=v6 npm run test
   ```
   The adapter automatically picks the Sequelize major from the loaded `sequelize` package, but the override is handy when you run the test suite against a different version or when bumping Sequelize in consumer apps before the upgrade is fully merged.

5. **Review your `enableMigration`/`revisionAttribute` setup**:
   - Keep `enableMigration` disabled unless you want the library to attempt adding the `revisionAttribute` column.
   - The behavior is the same as before; the adapter simply routes to `addColumn` through the Sequelize `QueryInterface`.
   - If you hit errors, use the documented rollback steps below instead of forcing schema changes.

6. **Run both test suites**:
   ```bash
   npm test -- --coverage
   npm run test:v6
   ```
   The second command runs the same user-journey suites with Sequelize v6. Coverage is collected automatically so you can verify branch coverage for `lib/index.js` and `lib/helpers.js`.

## Migration Checklist
| Step | Status |
| --- | --- |
| Node >=22.22.0 + npm 10 | |
| `cls-hooked` installed (if using CLS) | |
| `sequelize` peer aligned (`^5` or `^6`) | |
| Metadata fields configured/tested | |
| `npm test -- --coverage` executed | |
| `npm run test:v6` executed | |

## Rollback Strategy
- If the release causes issues, revert to the previous tag, reinstall dependencies (`npm install`), and rerun the failing command.
- When in doubt, set `SEQUELIZE_ADAPTER=v5` in your CI job temporarily to force the legacy adapter while you debug.
- If CLS setup fails, confirm the namespace exists and the key is set before your write operation; the library throws early with descriptive errors.

## Additional Notes
- The new GitHub Actions workflow (`.github/workflows/release.yml`) enforces the same suite; update your fork to mirror that job to guard against regressions.
- Keep an eye on the `docs/TESTS.md` matrix—any new behavior branch you introduce must remain covered by each test command before merging.
- Deprecation plan: ship a minor release with the Node <20 warning, then enforce Node >=20 in the next major alongside Sequelize v6 support.

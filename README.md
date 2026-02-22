# Sequelize Paper Trail


> Track changes to your models, for auditing or versioning. See how a model looked at any stage in its lifecycle, revert it to any version, or restore it after it has been destroyed. Record the user who created the version.



<!-- [![NPM](https://nodei.co/npm/sequelize-paper-trail.png?downloads=true)](https://nodei.co/npm/sequelize-paper-trail/) -->

![Release Quality Gate](https://github.com/nielsgl/sequelize-paper-trail/actions/workflows/release.yml/badge.svg)
[![npm-version](https://img.shields.io/npm/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![node-version](https://img.shields.io/node/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![npm-downloads-monthly](https://img.shields.io/npm/dm/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![npm-downloads-total](https://img.shields.io/npm/dt/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![license](https://img.shields.io/npm/l/sequelize-paper-trail.svg)](https://github.com/nielsgl/sequelize-paper-trail/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/release/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub tag](https://img.shields.io/github/tag/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub commits](https://img.shields.io/github/commits-since/nielsgl/sequelize-paper-trail/1.2.0.svg)]()

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples (Current Version)](#examples-current-version)
  - [Example](#example)
- [User Tracking](#user-tracking)
- [Disable logging for a single call](#disable-logging-for-a-single-call)
- [Options](#options)
  - [Default options](#default-options)
  - [Options documentation](#options-documentation)
- [Limitations](#limitations)
- [Testing](#testing)
- [Documentation Map](#documentation-map)
- [Support](#support)
  - [Supported Versions](#supported-versions)
- [Contributing](#contributing)
- [Author](#author)
- [Thanks](#thanks)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install --save sequelize-paper-trail
# or with yarn:
# yarn add sequelize-paper-trail
```

## Usage

Sequelize Paper Trail assumes that you already set up your Sequelize connection, for example, like this:
```javascript
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password');
```

then adding Sequelize Paper Trail is as easy as:

```javascript
const PaperTrail = require('sequelize-paper-trail').init(sequelize, options);
PaperTrail.defineModels();
```

which loads the Paper Trail library, and the `defineModels()` method sets up a `Revisions` and `RevisionHistory` table.

*Note: If you pass `userModel` option to `init` in order to enable user tracking, `userModel` should be setup before `defineModels()` is called.*

Then for each model that you want to keep a paper trail you simply add:

```javascript
Model.hasPaperTrail();
```

`hasPaperTrail` returns the `hasMany` association to the `revisionModel` so you can keep track of the association for reference later.

## Examples (Current Version)

The current example for this line lives in `examples/v3`. The folder contains a runnable SQLite app that prints revisions and revision changes.

```bash
cd examples/v3
npm install
npm run start
```

For the full archive (v3/v4/v5), see `examples/README.md`.

### Example

```javascript
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password');

const PaperTrail = require('sequelize-paper-trail').init(sequelize, options || {});
PaperTrail.defineModels();

const User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

User.Revisions = User.hasPaperTrail();
```

## User Tracking

There are 2 steps to enable user tracking, ie, recording the user who created a particular revision.
1. Enable user tracking by passing `userModel` option to `init`, with the name of the model which stores users in your application as the value.

```javascript
const options = {
  /* ... */
  userModel: 'user',
};
```
2. Pass the id of the user who is responsible for the database operation to `sequelize-paper-trail` either by sequelize options or by using CLS context.

```javascript
Model.update({
  /* ... */
}, {
  userId: user.id
}).then(() {
  /* ... */
});
```
OR

```javascript
const cls = require('cls-hooked');
const session = cls.createNamespace('my session');

session.set('userId', user.id);

Model.update({
  /* ... */
}).then(() {
  /* ... */
});

```

To enable CLS, set `continuationNamespace` in initialization options.

- Sequelize v6: use `cls-hooked` (required for CLS path).
- Sequelize v5: legacy `continuation-local-storage` still works; you can opt into `cls-hooked` by setting `SEQUELIZE_CLS=cls-hooked`.

You may also have to call `.run()` or `.bind()` on your CLS namespace depending on your framework integration.

## Disable logging for a single call

To not log a specific change to a revisioned object, just pass a `noPaperTrail` with a truthy (true, 1, ' ') value.

```javascript
const instance = await Model.findOne();
instance.update({ noPaperTrail: true }).then(() {
  /* ... */
});
```

## Options

Paper Trail supports various options that can be passed into the initialization. The following are the default options:

### Default options

```javascript
// Default options
const options = {
  exclude: [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'created_at',
    'updated_at',
    'deleted_at'
  ],
  revisionAttribute: 'revision',
  revisionModel: 'Revision',
  revisionChangeModel: 'RevisionChange',
  enableRevisionChangeModel: false,
  UUID: false,
  underscored: false,
  underscoredAttributes: false,
  defaultAttributes: {
    documentId: 'documentId',
    revisionId: 'revisionId'
  },
  enableCompression: false,
  enableMigration: false,
  enableStrictDiff: true,
  continuationKey: 'userId',
  belongsToUserOptions: undefined,
  metaDataFields: undefined,
  metaDataContinuationKey: 'metaData'
};
```

### Options documentation

| Option                      | Type    | Default Value                                                                                                        | Description                                                                                                                                                                                                            |
| --------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [debug]                     | Boolean | false                                                                                                                | Enables logging to the console.                                                                                                                                                                                        |
| [exclude]                   | Array   | ['id', 'createdAt', 'updatedAt', 'deletedAt', 'created_at', 'updated_at', 'deleted_at', [options.revisionAttribute]] | Array of global attributes to exclude from the paper trail.                                                                                                                                                            |
| [revisionAttribute]         | String  | 'revision'                                                                                                           | Name of the attribute in the table that corresponds to the current revision.                                                                                                                                           |
| [revisionModel]             | String  | 'Revision'                                                                                                           | Name of the model that keeps the revision models.                                                                                                                                                                      |
| [tableName]                 | String  | undefined                                                                                                            | Name of the table that keeps the revision models. Passed to Sequelize. Necessary in Sequelize 5+ when underscored is true and the table is camelCase or PascalCase.                                                    |
| [revisionChangeModel]       | String  | 'RevisionChange'                                                                                                     | Name of the model that tracks all the attributes that have changed during each create and update call.                                                                                                                 |
| [enableRevisionChangeModel] | Boolean | false                                                                                                                | Disable the revision change model to save space.                                                                                                                                                                       |
| [UUID]                      | Boolean | false                                                                                                                | The [revisionModel] has id attribute of type UUID for postgresql.                                                                                                                                                      |
| [underscored]               | Boolean | false                                                                                                                | The [revisionModel] and [revisionChangeModel] have 'createdAt' and 'updatedAt' attributes, by default, setting this option to true changes it to 'created_at' and 'updated_at'.                                        |
| [underscoredAttributes]     | Boolean | false                                                                                                                | The [revisionModel] has a [defaultAttribute] 'documentId', and the [revisionChangeModel] has a  [defaultAttribute] 'revisionId, by default, setting this option to true changes it to 'document_id' and 'revision_id'. |
| [defaultAttributes]         | Object  | { documentId: 'documentId', revisionId: 'revisionId' }                                                               |                                                                                                                                                                                                                        |
| [userModel]                 | String  |                                                                                                                      | Name of the model that stores users in your application.                                                                                                                                                                           |
| [enableCompression]         | Boolean | false                                                                                                                | Compresses the revision attribute in the [revisionModel] to only the diff instead of all model attributes.                                                                                                             |
| [enableMigration]           | Boolean | false                                                                                                                | Automatically adds the [revisionAttribute] via a migration to the models that have paper trails enabled.                                                                                                               |
| [enableStrictDiff]          | Boolean | true                                                                                                                 | Reports integers and strings as different, e.g. `3.14` !== `'3.14'`                                                                                                                                                    |
| [continuationNamespace]     | String  |                                                                                                                      | Name of the CLS namespace used for user attribution (`cls-hooked` for v6; legacy CLS path for v5).                                                                                                                   |
| [continuationKey]           | String  | 'userId'                                                                                                             | The CLS key that contains the user id.                                                                                                                                                                                 |
| [belongsToUserOptions]      | Object  | undefined                                                                                                            | The options used for belongsTo between userModel and Revision model                                                                                                                                                    |
| [metaDataFields]            | Object  | undefined                                                                                                            | The keys that will be provided in the meta data object. { key: isRequired (boolean)} format. Can be used to privovide additional fields - other associations, dates, etc to the Revision model                         |
| [metaDataContinuationKey]   | String  | 'metaData'                                                                                                           | The CLS key that contains the meta data object, from where the metaDataFields are extracted.                                                                                                                          |

## Limitations

* This project does not support models with composite primary keys. You can work around using a unique index with multiple fields.

## Testing

The tests are designed to run on SQLite3 in-memory tables, built from Sequelize migration files. If you want to actually generate a database file, change the storage option to a filename and run the tests.

```bash
npm install
npm test
```

Notes:
- Node.js **20.20.0** (recommended dev baseline) or any active LTS **>=20** is required for development.
- npm is the canonical package manager for this repo.

## Documentation Map

Core references:
- `RELEASE-POLICY.md`: authoritative release/support policy (branches, deprecations, gates).
- `docs/PROJECT.md`: product and runtime reference (behavior, structure, scripts).
- `docs/PLAN.md`: execution-order overview for active milestones.
- `docs/INDEX.md`: canonical PRD index, priorities, and execution waves.
- `docs/STATUS.md`: runtime WI board (`Backlog`, `In Progress`, `Blocked`, `Done`).
- `docs/impl/README.md`: implementation-plan format and Plan/Ship gate lifecycle.
- `docs/TESTS.md`: test strategy + coverage expectations.
- `docs/CI.md`: CI workflows and required gates.
- `docs/MIGRATION.md`: living migration guide for maintainers and users.
- `docs/RELEASE-CHECKLIST.md`: reusable checklist for releases.
- `examples/README.md`: index of runnable example apps for each support line.

Tracked PRDs (current + deferred):
- `docs/prd/PRD-001-release-v3-1-0.md`: v3.1.0 release PRD (legacy line + Node<20 deprecation).
- `docs/prd/PRD-002-release-v4-0-0.md`: v4.0.0 release PRD (bridge line).
- `docs/prd/PRD-003-deep-diff-replacement.md`: deep-diff removal plan (no behavior drift).
- `docs/prd/PRD-004-tooling-major-review.md`: tooling-major review backlog (Jest/ESLint/Prettier).

PRD index:
- `docs/INDEX.md`: ordered execution plan from PRD wave selection down to WI ordering.

Archived PRDs (historical context):
- `docs/archive/`: completed phase PRDs and demo PRDs preserved for reference.

Legacy pointers (safe to ignore; kept for continuity):
- `docs/release_checklist_phase5.md`: pointer to `docs/RELEASE-CHECKLIST.md`.
- `docs/migration_phase5.md`: pointer to `docs/MIGRATION.md`.

## Support

Please use:
* GitHub's [issue tracker](https://github.com/nielsgl/sequelize-paper-trail/issues)
* Migration guide: see `docs/MIGRATION.md` for the in-place upgrade path (CLS, metadata, adapter overrides)

### Supported Versions

The library is verified against Sequelize **v5** (current baseline) and **v6.37.7**. Release-quality checks include `npm test -- --coverage`, `npm run test:v6` (required for `main`, `feature/next`, and `release/v4`), and demo snapshot parity for baseline/v5/v6.

Support lines:
- **v3.x**: hotfix-only line (critical fixes only).
- **v4.x**: bugfix-only bridge supporting Sequelize v5 + v6, Node >=20.
- **v5.x**: feature line; Sequelize v6 primary, v7 experimental later.

Node versions **<20** are deprecated on the v3 line. A runtime warning is emitted once on `init()` unless `SUPPRESS_NODE_DEPRECATION=1` is set. Node **>=20** becomes required in the next major release.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Install dependencies with `npm install`
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request

## Author

© [Niels van Galen Last](https://nielsgl.com) – [@nielsgl](https://twitter.com/nielsgl) – nvangalenlast@gmail.com
Distributed under the MIT license. See ``LICENSE`` for more information.
[https://github.com/nielsgl/sequelize-paper-trail](https://github.com/nielsgl/)

## Thanks

This project was inspired by:
* [Sequelize-Revisions](https://github.com/bkniffler/sequelize-revisions)
* [Paper Trail](https://github.com/airblade/paper_trail)

Contributors:
 [https://github.com/nielsgl/sequelize-paper-trail/graphs/contributors](https://github.com/nielsgl/sequelize-paper-trail/graphs/contributors)

## Links
* [Example application](https://github.com/nielsgl/sequelize-paper-trail-example)

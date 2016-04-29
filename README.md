# Sequelize Paper Trail

> Track changes to your models, for auditing or versioning. See how a model looked at any stage in its lifecycle, revert it to any version, or restore it after it has been destroyed.

## Installation

```bash
npm install --save sequelize-paper-trail
```

## Basic Setup

Sequelize Paper Trail assumes that you already set up your Sequelize connection, for example, like this:
```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');
```

then adding Sequelize Paper Trail is as easy as:

```javascript
var PaperTrail = require('sequelize-paper-trail')(sequelize, options={});
PaperTrail.defineModels();
```

which loads the Paper Trail library, and the `defineModels()` method sets up a `Revisions` and `RevisionHistory` table. Then for each model that you want to keep a paper trail you simply add:

```javascript
Model.hasPaperTrail();
```

## Full Example

```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');

var PaperTrail = require('sequelize-paper-trail')(sequelize, options || {});
PaperTrail.defineModels();

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

User.hasPaperTrail();
```

## Options

Paper Trail supports various options that can be passed into the initialization. The following are the default options:

```javascript
// Default options
var options = {
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
  revisionModel: 'Revisions',
  revisionChangeModel: 'RevisionChanges',
  UUID: false,
  underscored: false,
  underscoredAttributes: false,
  defaultAttributes: {
    documentId: 'documentId',
    revisionId: 'revisionId'
  },
  userModel: 'User',
  enableCompression: false,
  enableMigration: true
};
```

## Local development and running tests

Clone repo:

```bash
git clone git@github.com:nielsgl/sequelize-paper-trail.git
```

Install dependencies:
```bash
npm install
```

Run test script:
```bash
npm test
```


*Note: the current test suite is very limited in coverage.*

## Problems

Please use GitHub's [issue tracker](https://github.com/nielsgl/sequelize-paper-trail/issues).

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Inspirations

* [Sequelize-Revisions](https://github.com/bkniffler/sequelize-revisions)
* [Paper Trail](https://github.com/airblade/paper_trail)

---

Copyright (c) 2016 Niels van Galen Last (nvangalenlast@gmail.com).
Released under the MIT license.

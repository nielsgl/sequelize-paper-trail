# Sequelize Paper Trail

> Track changes to your models, for auditing or versioning. See how a model looked at any stage in its lifecycle, revert it to any version, or restore it after it has been destroyed.


<!-- [![NPM](https://nodei.co/npm/sequelize-paper-trail.png?downloads=true)](https://nodei.co/npm/sequelize-paper-trail/) -->

* [![node-version](https://img.shields.io/node/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![npm-version](https://img.shields.io/npm/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![David](https://img.shields.io/david/nielsgl/sequelize-paper-trail.svg?maxAge=3600)]()
[![David](https://img.shields.io/david/dev/nielsgl/sequelize-paper-trail.svg?maxAge=3600)]()

* [![GitHub release](https://img.shields.io/github/release/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub tag](https://img.shields.io/github/tag/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub commits](https://img.shields.io/github/commits-since/nielsgl/sequelize-paper-trail/v0.2.3.svg)]()
[![npm-downloads](https://img.shields.io/npm/dt/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)

* [![license](https://img.shields.io/github/license/nielsgl/sequelize-paper-trail.svg)]()


## Installation

```bash
npm install --save sequelize-paper-trail
```

## Usage

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

## Example

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

## Support

Please use
* GitHub's [issue tracker](https://github.com/nielsgl/sequelize-paper-trail/issues)
* Tweet directly to ``

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Author

Your Name – [@nielsgl](https://twitter.com/nielsgl) – nvangalenlast@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/nielsgl/sequelize-paper-trail](https://github.com/nielsgl/)

## Inspirations

* [Sequelize-Revisions](https://github.com/bkniffler/sequelize-revisions)
* [Paper Trail](https://github.com/airblade/paper_trail)



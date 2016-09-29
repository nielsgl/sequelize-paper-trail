# Sequelize Paper Trail

> Track changes to your models, for auditing or versioning. See how a model looked at any stage in its lifecycle, revert it to any version, or restore it after it has been destroyed.


<!-- [![NPM](https://nodei.co/npm/sequelize-paper-trail.png?downloads=true)](https://nodei.co/npm/sequelize-paper-trail/) -->

[![node-version](https://img.shields.io/node/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![npm-version](https://img.shields.io/npm/v/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![David](https://img.shields.io/david/nielsgl/sequelize-paper-trail.svg?maxAge=3600)]()
[![David](https://img.shields.io/david/dev/nielsgl/sequelize-paper-trail.svg?maxAge=3600)]()

[![GitHub release](https://img.shields.io/github/release/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub tag](https://img.shields.io/github/tag/nielsgl/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)
[![GitHub commits](https://img.shields.io/github/commits-since/nielsgl/sequelize-paper-trail/1.2.0.svg)]()
[![npm-downloads](https://img.shields.io/npm/dt/sequelize-paper-trail.svg)](https://www.npmjs.org/package/sequelize-paper-trail)

[![license](https://img.shields.io/github/license/nielsgl/sequelize-paper-trail.svg)](https://github.com/nielsgl/sequelize-paper-trail/blob/master/LICENSE)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
- [Options](#options)
- [Local development and running tests](#local-development-and-running-tests)
- [Support](#support)
- [Contributing](#contributing)
- [Author](#author)
- [Thanks](#thanks)
- [Links](#links)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install --save sequelize-paper-trail
```

*Note: the current test suite is very limited in coverage.*

## Usage

Sequelize Paper Trail assumes that you already set up your Sequelize connection, for example, like this:
```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');
```

then adding Sequelize Paper Trail is as easy as:

```javascript
var PaperTrail = require('sequelize-paper-trail')(sequelize, options={});
PaperTrail.defineModels({});
```

which loads the Paper Trail library, and the `defineModels()` method sets up a `Revisions` and `RevisionHistory` table. Then for each model that you want to keep a paper trail you simply add:

```javascript
Model.hasPaperTrail();
```

### Example

```javascript
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password');

var PaperTrail = require('sequelize-paper-trail')(sequelize, options || {});
PaperTrail.defineModels();

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

User.hasPaperTrail();
```

## Options

Paper Trail supports various options that can be passed into the initialization. The following are the default options:

### Default options

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
  revisionModel: 'Revision',
  revisionChangeModel: 'RevisionChange',
  enableRevisionChangeModel: false,
  underscored: false,
  underscoredAttributes: false,
  defaultAttributes: {
    documentId: 'documentId',
    revisionId: 'revisionId'
  },
  userModel: 'User',
  enableCompression: false,
  enableMigration: true,
  enableStrictDiff: true,
  continuationNamespace: 'com.name-space',
  continuationKey: 'userId'
};
```

### Options documentation

| Option | Type | Default Value | Description |
|-------------------------|---------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [debug] | Boolean | false | Enables logging to the console. |
| [exclude] | Array | ['id', 'createdAt', 'updatedAt', 'deletedAt', 'created_at', 'updated_at', 'deleted_at', [options.revisionAttribute]] | Array of global attributes to exclude from the paper trail. |
| [revisionAttribute] | String | 'revision' | Name of the attribute in the table that corresponds to the current revision. |
| [revisionModel] | String | 'Revision' | Name of the model that keeps the revision models. |
| [revisionChangeModel] | String | 'RevisionChange' | Name of the model that tracks all the attributes that have changed during each create and update call. |
| [enableRevisionChangeModel] | Boolean | false | Disable the revision change model to save space. |
| [underscored] | Boolean | false | The [revisionModel] and [revisionChangeModel] have 'createdAt' and 'updatedAt' attributes, by default, setting this option to true changes it to 'created_at' and 'updated_at'. |
| [underscoredAttributes] | Boolean | false | The [revisionModel] has a [defaultAttribute] 'documentId', and the [revisionChangeModel] has a  [defaultAttribute] 'revisionId, by default, setting this option to true changes it to 'document_id' and 'revision_id'. |
| [defaultAttributes] | Object | { documentId: 'documentId', revisionId: 'revisionId' } |  |
| [enableCompression] | Boolean | false | Compresses the revision attribute in the [revisionModel] to only the diff instead of all model attributes. |
| [enableMigration] | Boolean | false | Automatically adds the [revisionAttribute] via a migration to the models that have paper trails enabled. |
| [enableStrictDiff] | Boolean | true | Reports integers and strings as different, e.g. `3.14` !== `'3.14'` |
| [continuationNamespace] | String | 'com.nameSpace' | Name of the name space used with the continuation-local-storage module. |
| [continuationKey] | String | 'userId' | The continuation-local-storage key that contains the user id. |


## Support

Please use:
* GitHub's [issue tracker](https://github.com/nielsgl/sequelize-paper-trail/issues)
* Tweet directly to ``

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Author

© [Niels van Galen Last](https://nielsgl.com) – [@nielsgl](https://twitter.com/nielsgl) – nvangalenlast@gmail.com  
Distributed under the MIT license. See ``LICENSE`` for more information.  
[https://github.com/nielsgl/sequelize-paper-trail](https://github.com/nielsgl/)  

## Thanks

This project was inspired by:
* [Sequelize-Revisions](https://github.com/bkniffler/sequelize-revisions)
* [Paper Trail](https://github.com/airblade/paper_trail)

## Links

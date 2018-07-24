'use strict';

var Sequelize = require('sequelize');
var diff = require('deep-diff').diff;
var jsdiff = require('diff');
var _ = require('lodash');
var helpers = require('./helpers');
var cls = require('continuation-local-storage');

var failHard = false;

exports.init = function (sequelize, optionsArg) {
  // console.log(message); // eslint-disable-line

  // In case that options is being parsed as a readonly attribute.
  var options = _.cloneDeep(optionsArg);
  var defaultAttributes = {
    documentId: 'documentId',
    revisionId: 'revisionId'
  };

  // if no options are passed the function
  if (!options) {
    options = {};
  }
  // enable debug logging
  var debug = false;
  if (options.debug) {
    debug = options.debug;
  }

  // TODO: implement logging option
  var log = options.log || console.log;

  // show the current sequelize and options objects
  if (debug) {
    // log('sequelize object:');
    // log(sequelize);
    log('options object:');
    log(options);
  }

  // attribute name for revision number in the models
  if (!options.revisionAttribute) {
    options.revisionAttribute = "revision";
  }

  // fields we want to exclude from audit trails
  if (!options.exclude) {
    options.exclude = ["id", "createdAt", "updatedAt", "deletedAt", // if the model is paranoid
    "created_at", "updated_at", "deleted_at", options.revisionAttribute];
  }

  // model name for revision table
  if (!options.revisionModel) {
    options.revisionModel = "Revision";
  }

  // model name for revision changes tables
  if (!options.revisionChangeModel) {
    options.revisionChangeModel = "RevisionChange";
  }

  if (!options.enableRevisionChangeModel) {
    options.enableRevisionChangeModel = false;
  }
  // support UUID for postgresql
  if (options.UUID === undefined) {
    options.UUID = false;
  }

  // underscored created and updated attributes
  if (!options.underscored) {
    options.underscored = false;
  }

  if (!options.underscoredAttributes) {
    options.underscoredAttributes = false;
    options.defaultAttributes = defaultAttributes;
  } else {
    options.defaultAttributes = helpers.toUnderscored(defaultAttributes);
  }

  // To track the user that made the changes
  if (!options.userModel) {
    options.userModel = false;
  }

  // full revisions or compressed revisions (track only the difference in models)
  // default: full revisions
  if (!options.enableCompression) {
    options.enableCompression = false;
  }

  // add the column to the database if it doesn't exist
  if (!options.enableMigration) {
    options.enableMigration = false;
  }

  // enable strict diff
  // when true: 10 !== '10'
  // when false: 10 == '10'
  // default: true
  if (!options.enableStrictDiff) {
    options.enableStrictDiff = true;
  }

  if (!options.continuationNamespace) {
    options.continuationNamespace = 'current_user_request';
  }

  if (!options.continuationKey) {
    options.continuationKey = 'userId';
  }

  if (debug) {
    log('parsed options:');
    log(options);
  }

  var ns = cls.getNamespace(options.continuationNamespace);
  if (!ns) {
    ns = cls.createNamespace(options.continuationNamespace);
  }

  // order in which sequelize processes the hooks
  // (1)
  // beforeBulkCreate(instances, options, fn)
  // beforeBulkDestroy(instances, options, fn)
  // beforeBulkUpdate(instances, options, fn)
  // (2)
  // beforeValidate(instance, options, fn)
  // (-)
  // validate
  // (3)
  // afterValidate(instance, options, fn)
  // - or -
  // validationFailed(instance, options, error, fn)
  // (4)
  // beforeCreate(instance, options, fn)
  // beforeDestroy(instance, options, fn)
  // beforeUpdate(instance, options, fn)
  // (-)
  // create
  // destroy
  // update
  // (5)
  // afterCreate(instance, options, fn)
  // afterDestroy(instance, options, fn)
  // afterUpdate(instance, options, fn)
  // (6)
  // afterBulkCreate(instances, options, fn)
  // afterBulkDestroy(instances, options, fn)
  // afterBulkUpdate(instances, options, fn)

  // Extend model prototype with "hasPaperTrail" function
  // Call model.hasPaperTrail() to enable revisions for model
  _.extend(sequelize.Model, {
    hasPaperTrail: function hasPaperTrail() {
      if (debug) {
        log('Enabling paper trail on', this.name);
      }

      this.attributes[options.revisionAttribute] = {
        type: Sequelize.INTEGER,
        defaultValue: 0
      };
      this.revisionable = true;
      this.refreshAttributes();

      if (options.enableMigration) {
        var tableName = this.getTableName();
        sequelize.getQueryInterface().describeTable(tableName).then(function (attributes) {
          if (!attributes[options.revisionAttribute]) {
            if (debug) {
              log('adding revision attribute to the database');
            }
            sequelize.getQueryInterface().addColumn(tableName, options.revisionAttribute, {
              type: Sequelize.INTEGER,
              defaultValue: 0
            }).then(function () {
              return null;
            }).catch(function (err) {
              log('something went really wrong..');
              log(err);
              return null;
            });
          }
          return null;
        });
      }

      this.addHook("beforeCreate", beforeHook);
      this.addHook("beforeUpdate", beforeHook);
      this.addHook("afterCreate", afterHook);
      this.addHook("afterUpdate", afterHook);

      // create association
      return this.hasMany(sequelize.models[options.revisionModel], {
        foreignKey: options.defaultAttributes.documentId,
        constraints: false,
        scope: {
          model: this.name
        }
      });
    }
  });

  var beforeHook = function beforeHook(instance, opt) {
    if (debug) {
      log('beforeHook called');
      log('instance:');
      log(instance);
      log('opt:');
      log(opt);
    }

    if (options.enableCompression) {
      var previousVersion = {};
      var currentVersion = {};

      _.forEach(opt.defaultFields, function (a) {
        console.log(a);
        if (!instance._previousDataValues[a].dataValues && !instance.dataValues[a].dataValues) {
          previousVersion[a] = instance._previousDataValues[a];
          currentVersion[a] = instance.dataValues[a];
        }
      });
    } else {
      var previousVersion = instance._previousDataValues;
      var currentVersion = instance.dataValues;
    }
    // Supported nested models.
    previousVersion = _.omitBy(previousVersion, function (i) {return typeof i === 'object'});
    currentVersion = _.omitBy(currentVersion, function (i) {return typeof i === 'object'});

    // Disallow change of revision
    instance.set(options.revisionAttribute, instance._previousDataValues[options.revisionAttribute]);

    // Get diffs
    var delta = helpers.calcDelta(previousVersion, currentVersion, options.exclude, options.enableStrictDiff);
    var currentRevisionId = instance.get(options.revisionAttribute);
    if (failHard && !currentRevisionId && opt.type === 'UPDATE') {
      throw new Error('Revision Id was undefined');
    }
    if (debug) {
      log('delta:');
      log(delta);
      log('revisionId', currentRevisionId);
    }

    instance.set(options.revisionAttribute, (currentRevisionId || 0) + 1);
    if (delta && delta.length > 0) {
      if (!instance.context) {
        instance.context = {};
      }
      instance.context.delta = delta;
    }
    if (debug) {
      log('end of beforeHook');
    }
  };

  var afterHook = function afterHook(instance, opt) {
    if (debug) {
      log('afterHook called');
      log('instance:', instance);
      log('opt:', opt);
      log(`CLS ${options.continuationKey}:`, ns.get(options.continuationKey));
    }

    if (instance.context && instance.context.delta && instance.context.delta.length > 0) {
      var Revision = sequelize.model(options.revisionModel);
      if (options.enableRevisionChangeModel) {
        var RevisionChange = sequelize.model(options.revisionChangeModel);
      }
      var delta = instance.context.delta;

      if (options.enableCompression) {
        var previousVersion = {};
        var currentVersion = {};

        _.forEach(opt.defaultFields, function (a) {
          previousVersion[a] = instance._previousDataValues[a];
          currentVersion[a] = instance.dataValues[a];
        });
      } else {
        var previousVersion = instance._previousDataValues;
        var currentVersion = instance.dataValues;
      }

      // Supported nested models.
      previousVersion = _.omitBy(previousVersion, function (i) {return typeof i === 'object'});
      currentVersion = _.omitBy(currentVersion, function (i) {return typeof i === 'object'});

      if (failHard && !ns.get(options.continuationKey)) {
        throw new Error('The CLS continuationKey ' + options.continuationKey + ' was not defined.');
      }

      // Build revision
      var revision = Revision.build({
        model: this.name,
        documentId: instance.id,
        document: JSON.stringify(currentVersion),
        userId: ns.get(options.continuationKey) || opt[options.continuationKey]
      });

      revision[options.revisionAttribute] = instance.get(options.revisionAttribute);

      // Save revision
      return revision.save(opt).then(function (revision) {
        // Loop diffs and create a revision-diff for each
        if (options.enableRevisionChangeModel) {
          _.forEach(delta, function (difference) {
            var o = helpers.diffToString(difference.item ? difference.item.lhs : difference.lhs);
            var n = helpers.diffToString(difference.item ? difference.item.rhs : difference.rhs);

            var d = RevisionChange.build({
              path: difference.path[0],
              document: JSON.stringify(difference),
              //revisionId: data.id,
              diff: JSON.stringify(o || n ? jsdiff.diffChars(o, n) : [])
            });

            d.save(opt).then(function (d) {
              // Add diff to revision
              revision['add' + helpers.capitalizeFirstLetter(options.revisionChangeModel)](d);

              return null;
            }).catch(function (err) {
              log('RevisionChange save error');
              log(err);
              throw err;
            });
          });
        }
        return null;
      }).catch(function (err) {
        log('Revision save error');
        log(err);
        throw err;
      });
    }

    if (debug) {
      log('end of afterHook');
    }
  };

  return {
    // Return defineModels()
    defineModels: function defineModels(db) {
      var attributes = {
        model: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        document: {
          type: Sequelize.JSON,
          allowNull: false
        }
      };

      if (options.mysql) {
        attributes.document.type = Sequelize.TEXT('MEDIUMTEXT');
      }

      attributes[options.defaultAttributes.documentId] = {
        type: Sequelize.INTEGER,
        allowNull: false
      };

      attributes[options.revisionAttribute] = {
        type: Sequelize.INTEGER,
        allowNull: false
      };

      if (debug) {
        log('attributes');
        log(attributes);
      }
      if (options.UUID) {
        attributes.id = {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        };
        attributes.documentId.type = Sequelize.UUID;
      }
      // Revision model
      var Revision = sequelize.define(options.revisionModel, attributes, {
        underscored: options.underscored
      });
      Revision.associate = function associate(models) {
          Revision.belongsTo(sequelize.model(options.userModel));
      }

      attributes = {
        path: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        document: {
          type: Sequelize.JSON,
          allowNull: false
        },
        diff: {
          type: Sequelize.JSON,
          allowNull: false
        }
      };
      if (options.mysql) {
        attributes.document.type = Sequelize.TEXT('MEDIUMTEXT');
        attributes.diff.type = Sequelize.TEXT('MEDIUMTEXT');
      }
      if (options.UUID) {
        attributes.id = {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        };
      }

      if (options.enableRevisionChangeModel) {
        // RevisionChange model
        var RevisionChange = sequelize.define(options.revisionChangeModel, attributes, {
          underscored: options.underscored
        });

        // Set associations
        Revision.hasMany(RevisionChange, {
          foreignKey: options.defaultAttributes.revisionId,
          constraints: false
        });

        RevisionChange.belongsTo(Revision);
        db[RevisionChange.name] = RevisionChange;
      }

      db[Revision.name] = Revision;


      if (options.userModel) {
        Revision.belongsTo(sequelize.model(options.userModel));
      }
      return Revision;
    }
  };
};

/**
 * Throw exceptions when the user identifier from CLS is not set or if the
 * revisionAttribute was not loaded on the model.
 */
exports.enableFailHard = function () {
  failHard = true;
},

module.exports = exports;

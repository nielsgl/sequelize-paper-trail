'use strict';
var Sequelize = require('sequelize');
var diff = require('deep-diff').diff;
var jsdiff = require('diff');
var _ = require('lodash');
var helpers = require('./helpers');

export default (sequelize: sequelize, options: object): object => {
  // console.log(message); // eslint-disable-line
  var defaultAttributes = {
    documentId: 'documentId',
    revisionId: 'revisionId'
  };

  // if no options are passed the function
  if(!options){
    options = {};
  }
  // enable debug logging
  var debug = false;
  if(options.debug) {
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
  if(!options.revisionAttribute){
    options.revisionAttribute = "revision";
  }

  // fields we want to exclude from audit trails
  if(!options.exclude){
    options.exclude = [
      "id",
      "createdAt",
      "updatedAt",
      "deletedAt", // if the model is paranoid
      "created_at",
      "updated_at",
      "deleted_at",
      options.revisionAttribute
    ];
  }

  // model name for revision table
  if(!options.revisionModel){
    options.revisionModel = "Revision";
  }

  // model name for revision changes tables
  if(!options.revisionChangeModel){
    options.revisionChangeModel = "RevisionChange";
  }

  // support UUID for postgresql
  if(options.UUID === undefined){
    options.UUID = false;
  }

  // underscored created and updated attributes
  if(!options.underscored) {
    options.underscored = false;
  }

  if(!options.underscoredAttributes) {
    options.underscoredAttributes = false;
    options.defaultAttributes = defaultAttributes;
  } else {
    options.defaultAttributes = helpers.toUnderscored(defaultAttributes);
  }

  // HACK to track the user that made the changes
  // TODO: needs to be implemented
  if(!options.userModel) {
    options.userModel = false;
  }

  // full revisions or compressed revisions (track only the difference in models)
  // default: full revisions
  if(!options.enableCompression) {
    options.enableCompression = false;
  }

  // add the column to the database if it doesn't exist
  if(!options.enableMigration) {
    options.enableMigration = false;
  }
  
  // enable strict diff
  // when true: 10 !== '10'
  // when false: 10 == '10'
  // default: true
  if(!options.enableStrictDiff) {
    options.enableStrictDiff = true;
  }

  if (debug) {
    log('parsed options:');
    log(options);
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

  // Extend model prototype with "enableAuditTrails" function
  // Call model.enableAuditTrails() to enable revisions for model
  _.extend(sequelize.Model.prototype, {
    hasPaperTrail: function () {
      if(debug) { log('Enabling paper trail on', this.name); }

      this.attributes[options.revisionAttribute] = {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
      this.revisionable = true;
      this.refreshAttributes();

      if(options.enableMigration) {
        var tableName: string = this.getTableName();
        sequelize.getQueryInterface().describeTable(tableName)
        .then(function(attributes: any) {
          if(!attributes[options.revisionAttribute]) {
            if(debug) { log('adding revision attribute to the database'); }
            sequelize.getQueryInterface().addColumn(
                tableName,
                options.revisionAttribute,
                {
                  type: Sequelize.INTEGER,
                  defaultValue: 0
                }
            ).then(() => {
              return null;
            }).catch((err: any) => {
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
      this.hasMany(sequelize.models[options.revisionModel], {
        foreignKey: "document_id",
        constraints: false,
        scope: {
          model: this.name
        }
      });

      return this;
    }
  });

  var beforeHook = function(instance: object, opt: object) {
    if(debug) {
      log('beforeHook called');
      log('instance:');
      log(instance);
      log('opt:');
      log(opt);
    }

    if(options.enableCompression) {
      var previousVersion = {};
      var currentVersion = {};

      _.forEach(opt.defaultFields, (a: string) => {
        previousVersion[a] = instance._previousDataValues[a];
        currentVersion[a] = instance.dataValues[a];
      });
    } else {
      var previousVersion = instance._previousDataValues;
      var currentVersion = instance.dataValues;
    }


    // Disallow change of revision
    instance.set(options.revisionAttribute, instance._previousDataValues[options.revisionAttribute]);

    // Get diffs
    var delta = helpers.calcDelta(previousVersion, currentVersion, options.exclude, options.enableStrictDiff);

    if(debug) {
      log('delta:');
      log(delta);
    }
    if(delta && delta.length > 0){
      instance.set(options.revisionAttribute, (instance.get(options.revisionAttribute) || 0) + 1);
      if(!instance.context){
        instance.context = {};
      }
      instance.context.delta = delta;
    }
    if(debug) { log('end of beforeHook'); }
  };

  var afterHook = function(instance: object, opt: object) {
    if(debug) {
      log('afterHook called');
      log('instance:', instance);
      log('opt:', opt);
    }

    var ns = process.namespaces['current_user_request'];

    if(instance.context && instance.context.delta && instance.context.delta.length > 0) {
      var Revision = sequelize.model(options.revisionModel);
      var RevisionChange = sequelize.model(options.revisionChangeModel);
      var delta = instance.context.delta;

      if(options.enableCompression) {
        var previousVersion = {};
        var currentVersion = {};

        _.forEach(opt.defaultFields, (a: string) => {
          previousVersion[a] = instance._previousDataValues[a];
          currentVersion[a] = instance.dataValues[a];
        });
      } else {
        var previousVersion = instance._previousDataValues;
        var currentVersion = instance.dataValues;
      }

      // TODO: so we can also track who made the changes to the model
      if (false) {
        var user = opt.user;
        if(!user && instance.context && instance.context.user){
          user = instance.context.user;
        }
      }

      // Build revision
      var revision = Revision.build({
        model: opt.model.name,
        document_id: instance.get("id"),
        // TODO: Hacky, but necessary to get immutable current representation
        document: currentVersion,
        user_id: ns.get('current_user_id')
      });
      revision[options.revisionAttribute] = instance.get(options.revisionAttribute);

      // Save revision
      return revision.save()
      .then(function(revision: any) {
        // Loop diffs and create a revision-diff for each
        _.forEach(delta, function(difference: any) {
          var o = helpers.diffToString(difference.item ? difference.item.lhs : difference.lhs);
          var n = helpers.diffToString(difference.item ? difference.item.rhs : difference.rhs);

          var d = RevisionChange.build({
            path: difference.path[0],
            document: difference,
            //revisionId: data.id,
            diff: o || n ? jsdiff.diffChars(o, n) : []
          });

          d.save()
          .then(function(d: any){
            // Add diff to revision
            revision['add' + options.revisionChangeModel](d);
            return null;
          })
          .catch((err: any) => {
            log('RevisionChange save error');
            log(err);
            throw err;
          });
        });

        return null;
      })
      .catch((err: object) => {
        log('Revision save error');
        log(err);
        throw err;
      });
    }

    if(debug) { log('end of afterHook'); }
  };

  return {
    // Return defineModels()
    defineModels: function(db: object) {
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

      attributes[options.defaultAttributes.documentId] =  {
        type: Sequelize.INTEGER,
        allowNull: false,
      };

      attributes[options.revisionAttribute] = {
        type: Sequelize.INTEGER,
        allowNull: false
      };

      if(debug) {
        log('attributes');
        log(attributes);
      }
      if(options.UUID){
        attributes.id = {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        };
        attributes.documentId.type = Sequelize.UUID;
      }
      // Revision model
      var Revision = sequelize.define(options.revisionModel, attributes, {
        classMethods: {
          associate: function(models: any) {
            Revision.belongsTo(sequelize.model(options.userModel));
          }
        },
        underscored: options.underscored
      });
    
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
      if(options.UUID){
        attributes.id = {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        };
      }

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

      db[Revision.name] = Revision;
      db[RevisionChange.name] = RevisionChange;

      // TODO: Option to track the user that triggered the revision
      if (false && options.userModel) {
        Revision.belongsTo(sequelize.model(options.userModel), {
          foreignKey: "user_id",
          constraints: true,
          as: "user"
        });
      }
      return Revision;
    },
    enableUserRevisions: function(db: object) {
      console.log('hello user');
      console.log(options)

      if(!db[options.revisionChangeModel].attributes['user_id']) {
        console.log('adding user_id');
        // sequelize.getQueryInterface().addColumn(
        //     'Brokerages',
        //     'id',
        //     {
        //       allowNull: false,
        //       autoIncrement: true,
        //       primaryKey: true,
        //       type: Sequelize.INTEGER
        //     }
        // ).then(function (x) {
        //   // console.log(x);
        // })
        // console.log(db.sequelize)
        db.sequelize.models[options.revisionChangeModel].belongsTo(sequelize.model(options.userModel), {
          foreignKey: "user_id",
          constraints: false,
          as: "user"
        });
      }


      console.log(db[options.revisionChangeModel].attributes)
      // db[options.revisionChangeModel].belongsTo(db[options.userModel], {
      //   foreignKey: 'user_id',
      //   constraints: false
      // });
      // return db;
    }
  }
};

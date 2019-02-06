

const Sequelize = require('sequelize');
// const diff = require('deep-diff').diff;
const jsdiff = require('diff');
const _ = require('lodash');
const cls = require('continuation-local-storage');
const helpers = require('./helpers');

let failHard = false;

exports.init = function (sequelize: Object, optionsArg: Object): Object {
    // In case that options is being parsed as a readonly attribute.
    let options = _.cloneDeep(optionsArg);
    const defaultAttributes = {
        documentId: 'documentId',
        revisionId: 'revisionId'
    };

    if (optionsArg && optionsArg.defaultAttributes) {
        if (optionsArg.defaultAttributes.documentId) {
            defaultAttributes.documentId = optionsArg.defaultAttributes.documentId;
        }
        if (optionsArg.defaultAttributes.revisionId) {
            defaultAttributes.revisionId = optionsArg.defaultAttributes.revisionId;
        }
    }

    // if no options are passed the function
    if (!options) {
        options = {};
    }
    // enable debug logging
    let debug = false;
    if (options.debug) {
        debug = options.debug;
    }

    // TODO: implement logging option
    let log = options.log || console.log;

    // show the current sequelize and options objects
    if (debug) {
    // log('sequelize object:');
    // log(sequelize);
        log('options object:');
        log(options);
    }

    // attribute name for revision number in the models
    if (!options.revisionAttribute) {
        options.revisionAttribute = 'revision';
    }

    if (!options.useVersioning) {
        options.useVersioning = false;
    } else if (!options.versionAttribute) {
        options.versionAttribute = 'version';
    }

    // fields we want to exclude from audit trails
    // we do want to track the version number, since that's
    // an explicit change to the record
    if (!options.exclude) {
        options.exclude = ['id', 'createdAt', 'updatedAt', 'deletedAt', // if the model is paranoid
            'created_at', 'updated_at', 'deleted_at', options.revisionAttribute];
    }

    // model name for revision table
    if (!options.revisionModel) {
        options.revisionModel = 'Revision';
    }

    // model name for revision changes tables
    if (!options.revisionChangeModel) {
        options.revisionChangeModel = 'RevisionChange';
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

    let ns;
    if (options.continuationNamespace) {
        ns = cls.getNamespace(options.continuationNamespace);
        if (!ns) {
            ns = cls.createNamespace(options.continuationNamespace);
        }

        if (!options.continuationKey) {
            options.continuationKey = 'userId';
        }
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

    // Extend model prototype with "hasPaperTrail" function
    // Call model.hasPaperTrail() to enable revisions for model
    _.extend(sequelize.Model, {
        hasPaperTrail: function hasPaperTrail (): Promise {
            if (debug) {
                log('Enabling paper trail on', this.name);
            }

            this.attributes[options.revisionAttribute] = {
                type: Sequelize.INTEGER,
                defaultValue: 0
            };
            if(options.useVersioning) {
	            this.attributes[options.versionAttribute] = {
	                type: Sequelize.INTEGER,
	                defaultValue: 1
	            };
                this.versionable = true;
            }
            this.revisionable = true;
            this.refreshAttributes();

            if (options.enableMigration) {
                let tableName = this.getTableName();
                sequelize.getQueryInterface().describeTable(tableName).then(function (attributes: Array): void {
                    if (this.versionable && !attributes[options.versionAttribute]) {
                        if (debug) {
                            log('adding version attribute to the database');
                        }
                        sequelize.getQueryInterface().addColumn(tableName, options.versionAttribute, {
                            type: Sequelize.INTEGER,
                            defaultValue: 1
                        }).then(function (): void {
                            return null;
                        }).catch(function (err: String): void {
                            log('something went really wrong..');
                            log(err);
                            return null;
                        });
                    }

                    if (!attributes[options.revisionAttribute]) {
                        if (debug) {
                            log('adding revision attribute to the database');
                        }
                        sequelize.getQueryInterface().addColumn(tableName, options.revisionAttribute, {
                            type: Sequelize.INTEGER,
                            defaultValue: 0
                        }).then(function (): void {
                            return null;
                        }).catch(function (err: String): void {
                            log('something went really wrong..');
                            log(err);
                            return null;
                        });
                    }
                    return null;
                });
            }

            this.addHook('beforeCreate', createBeforeHook('create'));
            this.addHook('beforeUpdate', createBeforeHook('update'));
            this.addHook('beforeDestroy', createBeforeHook('destroy'));
            this.addHook('afterCreate', createAfterHook('create'));
            this.addHook('afterUpdate', createAfterHook('update'));
            this.addHook('afterDestroy', createAfterHook('destroy'));

            // create association
            return this.hasMany(sequelize.models[options.revisionModel], {
                foreignKey: options.defaultAttributes.documentId,
                constraints: false,
                scope: {
                    model: this.name
                }
            });
        },
        newVersion: function newVersion (instance: sequelize.model): Promise {
            if (this.versionable) {
                let currVer = instance.get(options.versionAttribute) || 1;
                instance.set(options.versionAttribute, currVer + 1);
                return instance.save();
            }
        }
    });

    function createBeforeHook (operation: 'create' | 'update' | 'destroy'): Function {
        let beforeHook = function beforeHook (instance: Object, opt: Object): void {
            let previousRevision = {};
            let currentRevision = {};
		        if (debug) {
                log('beforeHook called');
                log('instance:');
                log(instance);
                log('opt:');
                log(opt);
            }
      	let destroyOperation = operation === 'destroy';

      	if (!destroyOperation && options.enableCompression) {

        	_.forEach(opt.defaultFields, function (a: Object): void {
                    const previousDataValuesOfA = instance._previousDataValues[a] === undefined ? null : instance._previousDataValues[a];
	          		previousRevision[a] = previousDataValuesOfA;
	          		currentRevision[a] = instance.dataValues[a];
	        	});
      	} else {
        	previousRevision = instance._previousDataValues;
        	currentRevision = instance.dataValues;
      	}
      	// Supported nested models.
      	previousRevision = _.omitBy(previousRevision, function (i: Object): Boolean {
        	return typeof i === 'object';
      	});
      	currentRevision = _.omitBy(currentRevision, function (i: Object): Boolean {
        	return typeof i === 'object';
      	});

      	// Disallow change of revision
      	instance.set(options.revisionAttribute, instance._previousDataValues[options.revisionAttribute]);

      	// Get diffs
      	let delta = helpers.calcDelta(previousRevision, currentRevision, options.exclude, options.enableStrictDiff);
      	let currentRevisionId = instance.get(options.revisionAttribute);
      	if (failHard && !currentRevisionId && opt.type === 'UPDATE') {
        	throw new Error('Revision Id was undefined');
      	}
      	if (debug) {
	        log('delta:');
	        log(delta);
	        log('revisionId', currentRevisionId);
      	}

      	if (destroyOperation || delta && delta.length > 0) {
        	let revisionId = ((instance.versionable && instance._changed.version) || instance.isNewRecord ? -1 : currentRevisionId) + 1;
        	instance.set(options.revisionAttribute, revisionId);

        	if (!instance.context) {
          		instance.context = {};
        	}
        	instance.context.delta = delta;
      	}
      	if (debug) {
        	log('end of beforeHook');
      	}
    	};
    	return beforeHook;
  	}

    function createAfterHook (operation: 'create' | 'update' | 'destroy'): Function {
        let afterHook = function afterHook (instance: {}, opt: {}): Promise {
            let RevisionChange = null;
            let previousRevision = {};
            let currentRevision = {};
            if (debug) {
                log('afterHook called');
                log('instance:', instance);
                log('opt:', opt);
                if (ns) {
                    log(`CLS ${options.continuationKey}:`, ns.get(options.continuationKey));
                }
            }

            let destroyOperation = operation === 'destroy';

            if (instance.context && (instance.context.delta && instance.context.delta.length > 0 || destroyOperation)) {
                let Revision = sequelize.model(options.revisionModel);
                if (options.enableRevisionChangeModel) {
                    RevisionChange = sequelize.model(options.revisionChangeModel);
                }
                let delta = instance.context.delta;

                if (!destroyOperation && options.enableCompression) {
                    _.forEach(opt.defaultFields, function (a: Object): void {
		          		previousRevision[a] = instance._previousDataValues[a];
		          		currentRevision[a] = instance.dataValues[a];
                    });
                } else {
                    previousRevision = instance._previousDataValues;
                    currentRevision = instance.dataValues;
                }

                // Supported nested models.
                previousRevision = _.omitBy(previousRevision, function (i: any): Boolean {
                    return typeof i === 'object';
                });
                currentRevision = _.omitBy(currentRevision, function (i: any): Boolean {
                    return typeof i === 'object';
                });

                if (failHard && !ns.get(options.continuationKey)) {
                    throw new Error('The CLS continuationKey ' + options.continuationKey + ' was not defined.');
                }

                let document = currentRevision;

                if (options.mysql) {
                    document = JSON.stringify(document);
                }

                // Build revision
                let query = {
                    model: this.name,
                    document,
                    userId: ns && ns.get(options.continuationKey) || opt.userId,
                    operation
                };
                query[options.defaultAttributes.documentId] = instance.id;

                let revision = Revision.build(query);

                revision[options.revisionAttribute] = instance.get(options.revisionAttribute);
                revision[options.versionAttribute] = instance.get(options.versionAttribute);

                // Save revision
                return revision.save({transaction: opt.transaction}).then(function (revision: Object): void {
                    // Loop diffs and create a revision-diff for each
                    if (options.enableRevisionChangeModel) {
                        _.forEach(delta, function (difference: Object): void {
                            let o = helpers.diffToString(difference.item ? difference.item.lhs : difference.lhs);
                            let n = helpers.diffToString(difference.item ? difference.item.rhs : difference.rhs);

                            let document = difference;
                            let diff = o || n ? jsdiff.diffChars(o, n) : [];

                            if (options.mysql) {
                                document = JSON.stringify(document);
                                diff = JSON.stringify(diff);
                            }

                            let d = RevisionChange.build({
                                path: difference.path[0],
                                document,
                                //revisionId: data.id,
                                diff
                            });

                            d.save({transaction: opt.transaction}).then(function (d: Object): void {
                                // Add diff to revision
                                revision['add' + helpers.capitalizeFirstLetter(options.revisionChangeModel)](d);

                                return null;
                            }).catch(function (err: String): void {
                                log('RevisionChange save error');
                                log(err);
                                throw err;
                            });
                        });
                    }
                    return null;
                }).catch(function (err: String): void {
                    log('Revision save error');
                    log(err);
                    throw err;
                });
            }

            if (debug) {
                log('end of afterHook');
            }
        };
        return afterHook;
    };

    return {
    // Return defineModels()
        defineModels: function defineModels (db: Object): Promise {
            let attributes = {
                model: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                document: {
                    type: Sequelize.JSON,
                    allowNull: false
                },
                operation: Sequelize.STRING(7)
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
            if(options.useVersioning) {
	            attributes[options.versionAttribute] = {
	                type: Sequelize.INTEGER,
	                allowNull: false
	            };
            }
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
                attributes[options.defaultAttributes.documentId].type = Sequelize.UUID;
            }
            // Revision model
            let Revision = sequelize.define(options.revisionModel, attributes, {
                underscored: options.underscored
            });
            Revision.associate = function associate (models: Object): void {
                Revision.belongsTo(sequelize.model(options.userModel));
            };

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
                let RevisionChange = sequelize.define(options.revisionChangeModel, attributes, {
                    underscored: options.underscored
                });

                // Set associations
                Revision.hasMany(RevisionChange, {
                    foreignKey: options.defaultAttributes.revisionId,
                    constraints: false
                });

                RevisionChange.belongsTo(Revision);
                if (db) {db[RevisionChange.name] = RevisionChange;}
            }

            if (db) {db[Revision.name] = Revision;}

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
exports.enableFailHard = function (): void {
    failHard = true;
},

module.exports = exports;

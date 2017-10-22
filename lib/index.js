

const sequelize_lib = require('sequelize');
const diff = require('deep-diff').diff;
const jsdiff = require('diff');
const _ = require('lodash');
const helpers = require('./helpers');
const cls = require('continuation-local-storage');

let ns = cls.getNamespace('com.churchdesk');

if (!ns) {
	// throw new Error('CLS namespace required');
	ns = cls.createNamespace('current_user_request');
}

let failHard = false;

exports.init = function (sequelize, optionsArg) {
	// console.log(message); // eslint-disable-line

	// In case that options is being parsed as a readonly attribute.
	let options = _.cloneDeep(optionsArg);
	const defaultAttributes = {
		documentId: 'documentId',
		revisionId: 'revisionId',
	};

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
	const log = options.log || console.log;

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

	// fields we want to exclude from audit trails
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
	_.extend(sequelize.Model, {
		hasPaperTrail: function hasPaperTrail() {
			if (debug) {
				log('Enabling paper trail on', this.name);
			}

			this.attributes[options.revisionAttribute] = {
				type: sequelize_lib.INTEGER,
				defaultValue: 0,
			};
			this.revisionable = true;
			this.refreshAttributes();

			if (options.enableMigration) {
				const tableName = this.getTableName();
				sequelize.getQueryInterface().describeTable(tableName).then((attributes) => {
					if (!attributes[options.revisionAttribute]) {
						if (debug) {
							log('adding revision attribute to the database');
						}
						sequelize.getQueryInterface().addColumn(tableName, options.revisionAttribute, {
							type: sequelize_lib.INTEGER,
							defaultValue: 0,
						}).then(() => null).catch((err) => {
							log('something went really wrong..');
							log(err);
							return null;
						});
					}
					return null;
				});
			}

			this.addHook('beforeCreate', beforeHook);
			this.addHook('beforeUpdate', beforeHook);
			this.addHook('afterCreate', afterHook);
			this.addHook('afterUpdate', afterHook);

			// create association
			this.hasMany(sequelize.models[options.revisionModel], {
				foreignKey: options.defaultAttributes.documentId,
				constraints: false,
				scope: {
					model: this.name,
				},
			});

			return this;
		},
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

			_.forEach(opt.defaultFields, (a) => {
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
		previousVersion = _.omitBy(previousVersion, i => typeof i === 'object');
		currentVersion = _.omitBy(currentVersion, i => typeof i === 'object');

		// Disallow change of revision
		instance.set(options.revisionAttribute, instance._previousDataValues[options.revisionAttribute]);

		// Get diffs
		const delta = helpers.calcDelta(previousVersion, currentVersion, options.exclude, options.enableStrictDiff);
		const currentRevisionId = instance.get(options.revisionAttribute);
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
			log('CLS userId:', ns.get('userId'));
		}

		if (instance.context && instance.context.delta && instance.context.delta.length > 0) {
			const Revision = sequelize.model(options.revisionModel);
			if (options.enableRevisionChangeModel) {
				var RevisionChange = sequelize.model(options.revisionChangeModel);
			}
			const delta = instance.context.delta;

			if (options.enableCompression) {
				var previousVersion = {};
				var currentVersion = {};

				_.forEach(opt.defaultFields, (a) => {
					previousVersion[a] = instance._previousDataValues[a];
					currentVersion[a] = instance.dataValues[a];
				});
			} else {
				var previousVersion = instance._previousDataValues;
				var currentVersion = instance.dataValues;
			}

			// Supported nested models.
			previousVersion = _.omitBy(previousVersion, i => typeof i === 'object');
			currentVersion = _.omitBy(currentVersion, i => typeof i === 'object');

			if (failHard && !ns.get(options.continuationKey)) {
				throw new Error(`The CLS continuationKey ${options.continuationKey} was not defined.`);
			}

			// Build revision
			const revision = Revision.build({
				model: this.name,
				documentId: instance.id,
				document: JSON.stringify(currentVersion),
				userId: ns.get(options.continuationKey) || opt.userId,
			});

			revision[options.revisionAttribute] = instance.get(options.revisionAttribute);

			// Save revision
			return revision.save().then((revision) => {
				// Loop diffs and create a revision-diff for each
				if (options.enableRevisionChangeModel) {
					_.forEach(delta, (difference) => {
						const o = helpers.diffToString(difference.item ? difference.item.lhs : difference.lhs);
						const n = helpers.diffToString(difference.item ? difference.item.rhs : difference.rhs);

						const d = RevisionChange.build({
							path: difference.path[0],
							document: JSON.stringify(difference),
							// revisionId: data.id,
							diff: JSON.stringify(o || n ? jsdiff.diffChars(o, n) : []),
						});

						d.save().then((d) => {
							// Add diff to revision
							revision[`add${helpers.capitalizeFirstLetter(options.revisionChangeModel)}`](d);

							return null;
						}).catch((err) => {
							log('RevisionChange save error');
							log(err);
							throw err;
						});
					});
				}
				return null;
			}).catch((err) => {
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
			let attributes = {
				model: {
					type: sequelize_lib.TEXT,
					allowNull: false,
				},
				document: {
					type: sequelize_lib.JSON,
					allowNull: false,
				},
			};

			if (options.mysql) {
				attributes.document.type = sequelize_lib.TEXT('MEDIUMTEXT');
			}

			attributes[options.defaultAttributes.documentId] = {
				type: sequelize_lib.INTEGER,
				allowNull: false,
			};

			attributes[options.revisionAttribute] = {
				type: sequelize_lib.INTEGER,
				allowNull: false,
			};

			if (debug) {
				log('attributes');
				log(attributes);
			}
			if (options.UUID) {
				attributes.id = {
					primaryKey: true,
					type: sequelize_lib.UUID,
					defaultValue: sequelize_lib.UUIDV4,
				};
				attributes.documentId.type = sequelize_lib.UUID;
			}
			// Revision model
			var Revision = sequelize.define(options.revisionModel, attributes, {
				classMethods: {
					associate: function associate(models) {
						Revision.belongsTo(sequelize.model(options.userModel));
					},
				},
				underscored: options.underscored,
			});

			attributes = {
				path: {
					type: sequelize_lib.TEXT,
					allowNull: false,
				},
				document: {
					type: sequelize_lib.JSON,
					allowNull: false,
				},
				diff: {
					type: sequelize_lib.JSON,
					allowNull: false,
				},
			};
			if (options.mysql) {
				attributes.document.type = sequelize_lib.TEXT('MEDIUMTEXT');
				attributes.diff.type = sequelize_lib.TEXT('MEDIUMTEXT');
			}
			if (options.UUID) {
				attributes.id = {
					primaryKey: true,
					type: sequelize_lib.UUID,
					defaultValue: sequelize_lib.UUIDV4,
				};
			}

			if (options.enableRevisionChangeModel) {
				// RevisionChange model
				const RevisionChange = sequelize.define(options.revisionChangeModel, attributes, {
					underscored: options.underscored,
				});

				// Set associations
				Revision.hasMany(RevisionChange, {
					foreignKey: options.defaultAttributes.revisionId,
					constraints: false,
				});

				RevisionChange.belongsTo(Revision);
				db[RevisionChange.name] = RevisionChange;
			}

			db[Revision.name] = Revision;


			if (options.userModel) {
				Revision.belongsTo(sequelize.model(options.userModel));
			}
			return Revision;
		},
	};
};

/**
* Throw exceptions when the user identifier from CLS is not set or if the
* revisionAttribute was not loaded on the model.
*/
exports.enableFailHard = () => {
	failHard = true;
};

module.exports = exports;

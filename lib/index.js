import cls from 'continuation-local-storage';
import * as jsdiff from 'diff';
import _ from 'lodash';
import helpers from './helpers';

let failHard = false;

exports.init = (Sequelize, sequelize, optionsArg) => {
	// In case that options is being parsed as a readonly attribute.
	// Or it is not passed at all
	const optsArg = _.cloneDeep(optionsArg || {});

	const defaultOptions = {
		debug: false,
		log: null,
		exclude: [
			'id',
			'createdAt',
			'updatedAt',
			'deletedAt',
			'created_at',
			'updated_at',
			'deleted_at',
			'revision',
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
			revisionId: 'revisionId',
		},
		userModel: false,
		userModelAttribute: 'userId',
		enableCompression: false,
		enableMigration: false,
		enableStrictDiff: true,
		continuationNamespace: null,
		continuationKey: 'userId',
		mysql: false,
	};

	let ns = null;
	if (optsArg.continuationNamespace) {
		ns = cls.getNamespace(optsArg.continuationNamespace);
		if (!ns) {
			ns = cls.createNamespace(optsArg.continuationNamespace);
		}
	}

	if (optsArg.underscoredAttributes) {
		helpers.toUnderscored(defaultOptions.defaultAttributes);
	}

	const options = _.defaults(optsArg, defaultOptions);

	// if (optionsArg.defaultAttributes) {
	// 	if (optionsArg.defaultAttributes.documentId) {
	// 		defaultAttributes.documentId =
	// 			optionsArg.defaultAttributes.documentId;
	// 	}
	// 	if (optionsArg.defaultAttributes.revisionId) {
	// 		defaultAttributes.revisionId =
	// 			optionsArg.defaultAttributes.revisionId;
	// 	}
	// }

	// // if no options are passed the function
	// if (!options) options = {};

	// enable debug logging
	// let debug = false;
	// const { debug } = options;

	// TODO: implement logging option
	const log = options.log || console.log;

	// show the current sequelize and options objects
	// if (options.debug) {
	// 	// log('sequelize object:');
	// 	// log(sequelize);
	// 	log('options object:');
	// 	log(options);
	// }

	// // attribute name for revision number in the models
	// if (!options.revisionAttribute) {
	// 	options.revisionAttribute = 'revision';
	// }

	// // fields we want to exclude from audit trails
	// if (!options.exclude) {
	// 	options.exclude = [
	// 		'id',
	// 		'createdAt',
	// 		'updatedAt',
	// 		'deletedAt', // if the model is paranoid
	// 		'created_at',
	// 		'updated_at',
	// 		'deleted_at',
	// 		options.revisionAttribute,
	// 	];
	// }

	// // model name for revision table
	// if (!options.revisionModel) {
	// 	options.revisionModel = 'Revision';
	// }

	// // model name for revision changes tables
	// if (!options.revisionChangeModel) {
	// 	options.revisionChangeModel = 'RevisionChange';
	// }

	// if (!options.enableRevisionChangeModel) {
	// 	options.enableRevisionChangeModel = false;
	// }
	// // support UUID for postgresql
	// if (options.UUID === undefined) {
	// 	options.UUID = false;
	// }

	// // underscored created and updated attributes
	// if (!options.underscored) {
	// 	options.underscored = false;
	// }

	// if (!options.underscoredAttributes) {
	// 	options.underscoredAttributes = false;
	// 	options.defaultAttributes = defaultAttributes;
	// } else {
	// 	options.defaultAttributes = helpers.toUnderscored(defaultAttributes);
	// }

	// // To track the user that made the changes
	// if (!options.userModel) {
	// 	options.userModel = false;
	// }

	// // full revisions or compressed revisions (track only the difference in models)
	// // default: full revisions
	// if (!options.enableCompression) {
	// 	options.enableCompression = false;
	// }

	// // add the column to the database if it doesn't exist
	// if (!options.enableMigration) {
	// 	options.enableMigration = false;
	// }

	// // enable strict diff
	// // when true: 10 !== '10'
	// // when false: 10 == '10'
	// // default: true
	// if (!options.enableStrictDiff) {
	// 	options.enableStrictDiff = true;
	// }

	// let ns;
	// if (options.continuationNamespace) {
	// 	ns = cls.getNamespace(options.continuationNamespace);
	// 	if (!ns) {
	// 		ns = cls.createNamespace(options.continuationNamespace);
	// 	}

	// 	if (!options.continuationKey) {
	// 		options.continuationKey = 'userId';
	// 	}
	// }

	// if (options.debug) {
	// 	log('parsed options:');
	// 	log(options);
	// }

	function createBeforeHook(operation) {
		const beforeHook = function beforeHook(instance, opt) {
			if (options.debug) {
				log('beforeHook called');
				log('instance:', instance);
				log('opt:', opt);
			}

			const destroyOperation = operation === 'destroy';

			let previousVersion = {};
			let currentVersion = {};
			if (!destroyOperation && options.enableCompression) {
				_.forEach(opt.defaultFields, a => {
					previousVersion[a] = instance._previousDataValues[a];
					currentVersion[a] = instance.dataValues[a];
				});
			} else {
				previousVersion = instance._previousDataValues;
				currentVersion = instance.dataValues;
			}
			// Supported nested models.
			previousVersion = _.omitBy(
				previousVersion,
				i => i != null && typeof i === 'object' && !(i instanceof Date),
			);
			previousVersion = _.omit(previousVersion, options.exclude);

			currentVersion = _.omitBy(
				currentVersion,
				i => i != null && typeof i === 'object' && !(i instanceof Date),
			);
			currentVersion = _.omit(currentVersion, options.exclude);

			// Disallow change of revision
			instance.set(
				options.revisionAttribute,
				instance._previousDataValues[options.revisionAttribute],
			);

			// Get diffs
			const delta = helpers.calcDelta(
				previousVersion,
				currentVersion,
				options.exclude,
				options.enableStrictDiff,
			);

			const currentRevisionId = instance.get(options.revisionAttribute);

			if (failHard && !currentRevisionId && opt.type === 'UPDATE') {
				throw new Error('Revision Id was undefined');
			}

			if (options.debug) {
				log('delta:', delta);
				log('revisionId', currentRevisionId);
			}

			if (destroyOperation || (delta && delta.length > 0)) {
				const revisionId = (currentRevisionId || 0) + 1;
				instance.set(options.revisionAttribute, revisionId);

				if (!instance.context) {
					instance.context = {};
				}
				instance.context.delta = delta;
			}

			if (options.debug) {
				log('end of beforeHook');
			}
		};
		return beforeHook;
	}

	function createAfterHook(operation) {
		const afterHook = function afterHook(instance, opt) {
			if (options.debug) {
				log('afterHook called');
				log('instance:', instance);
				log('opt:', opt);
				if (ns) {
					log(
						`CLS ${options.continuationKey}:`,
						ns.get(options.continuationKey),
					);
				}
			}

			const destroyOperation = operation === 'destroy';

			if (
				instance.context &&
				((instance.context.delta &&
					instance.context.delta.length > 0) ||
					destroyOperation)
			) {
				const Revision = sequelize.model(options.revisionModel);
				let RevisionChange;

				if (options.enableRevisionChangeModel) {
					RevisionChange = sequelize.model(
						options.revisionChangeModel,
					);
				}

				const { delta } = instance.context;

				let previousVersion = {};
				let currentVersion = {};
				if (!destroyOperation && options.enableCompression) {
					_.forEach(opt.defaultFields, a => {
						previousVersion[a] = instance._previousDataValues[a];
						currentVersion[a] = instance.dataValues[a];
					});
				} else {
					previousVersion = instance._previousDataValues;
					currentVersion = instance.dataValues;
				}

				// Supported nested models.
				previousVersion = _.omitBy(
					previousVersion,
					i =>
						i != null &&
						typeof i === 'object' &&
						!(i instanceof Date),
				);
				previousVersion = _.omit(previousVersion, options.exclude);

				currentVersion = _.omitBy(
					currentVersion,
					i =>
						i != null &&
						typeof i === 'object' &&
						!(i instanceof Date),
				);
				currentVersion = _.omit(currentVersion, options.exclude);

				if (failHard && ns && !ns.get(options.continuationKey)) {
					throw new Error(
						`The CLS continuationKey ${
							options.continuationKey
						} was not defined.`,
					);
				}

				let document = currentVersion;

				if (options.mysql) {
					document = JSON.stringify(document);
				}

				const source = ns && ns.get(options.continuationKey) ? ns.get(options.continuationKey) : opt[options.continuationKey];
				const sourceType = source.constructor.name;
				const sourceId = source.id;
				const { transaction } = opt;

				// Build revision
				const query = {
					model: this.name,
					document,
					operation,
					sourceType,
					sourceId,
					transactionId: transaction ? transaction.id : null
				};

				// in case of custom user models that are not 'userId'
				query[options.userModelAttribute] =
					(ns && ns.get(options.continuationKey)) || opt.userId;

				query[options.defaultAttributes.documentId] = instance.id;

				const revision = Revision.build(query);

				revision[options.revisionAttribute] = instance.get(
					options.revisionAttribute,
				);

				// Save revision
				return revision
					.save({ transaction })
					.then(revision => {
						// Loop diffs and create a revision-diff for each
						if (options.enableRevisionChangeModel) {
							return Promise.all(_.map(delta, difference => {
								const o = helpers.diffToString(
									difference.item
										? difference.item.lhs
										: difference.lhs,
								);
								const n = helpers.diffToString(
									difference.item
										? difference.item.rhs
										: difference.rhs,
								);

								// let document = difference;
								document = difference;
								let diff = o || n ? jsdiff.diffChars(o, n) : [];

								if (options.mysql) {
									document = JSON.stringify(document);
									diff = JSON.stringify(diff);
								}

								const d = RevisionChange.build({
									path: difference.path[0],
									document,
									diff,
								});

								return d.save({ transaction })
									.then(d => {
										// Add diff to revision
										revision[
											`add${helpers.capitalizeFirstLetter(
												options.revisionChangeModel,
											)}`
										](d, { transaction });

										return null;
									})
									.catch(err => {
										log('RevisionChange save error', err);
										throw err;
									});
          		})).then(() => null);
						}
						return null;
					})
					.catch(err => {
						log('Revision save error', err);
						throw err;
					});
			}

			if (options.debug) {
				log('end of afterHook');
			}

			return null;
		};
		return afterHook;
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
	_.assignIn(Sequelize.Model, {
		hasPaperTrail: function hasPaperTrail() {
			if (options.debug) {
				log('Enabling paper trail on', this.name);
			}

			this.rawAttributes[options.revisionAttribute] = {
				type: Sequelize.INTEGER,
				defaultValue: 0,
			};
			this.revisionable = true;

			// not sure if we need this
			this.refreshAttributes();

			if (options.enableMigration) {
				const tableName = this.getTableName();

				const queryInterface = sequelize.getQueryInterface();

				queryInterface.describeTable(tableName).then(attributes => {
					if (!attributes[options.revisionAttribute]) {
						if (options.debug) {
							log('adding revision attribute to the database');
						}

						queryInterface
							.addColumn(tableName, options.revisionAttribute, {
								type: Sequelize.INTEGER,
								defaultValue: 0,
							})
							.then(() => null)
							.catch(err => {
								log('something went really wrong..', err);
								return null;
							});
					}
					return null;
				});
			}

			this.addHook('beforeCreate', createBeforeHook('create'));
			this.addHook('beforeDestroy', createBeforeHook('destroy'));
			this.addHook('beforeUpdate', createBeforeHook('update'));
			this.addHook('afterCreate', createAfterHook('create'));
			this.addHook('afterDestroy', createAfterHook('destroy'));
			this.addHook('afterUpdate', createAfterHook('update'));

			// create association
			return this.hasMany(sequelize.models[options.revisionModel], {
				foreignKey: options.defaultAttributes.documentId,
				constraints: false,
				scope: {
					model: this.name,
				},
			});
		},
	});

	return {
		// Return defineModels()
		defineModels: function defineModels(db) {
			// Attributes for RevisionModel
			let attributes = {
				model: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				document: {
					type: Sequelize.JSONB,
					allowNull: false,
				},
				operation: Sequelize.STRING(7),
				sourceType: {
          type: Sequelize.STRING
        },
        sourceId: {
          type: Sequelize.INTEGER
        },
        transactionId: {
          type: Sequelize.STRING
        }
			};

			if (options.mysql) {
				attributes.document.type = Sequelize.TEXT('MEDIUMTEXT');
			}

			attributes[options.defaultAttributes.documentId] = {
				type: Sequelize.INTEGER,
				allowNull: false,
			};

			attributes[options.revisionAttribute] = {
				type: Sequelize.INTEGER,
				allowNull: false,
			};

			if (options.UUID) {
				attributes.id = {
					primaryKey: true,
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
				};
				attributes[options.defaultAttributes.documentId].type =
					Sequelize.UUID;
			}

			if (options.debug) {
				log('attributes', attributes);
			}

			// Revision model
			const Revision = sequelize.define(
				options.revisionModel,
				attributes,
				{
					underscored: options.underscored,
				},
			);
			Revision.associate = function associate(models) {
				log('models', models);

				Revision.belongsTo(sequelize.model(options.userModel));
			};

			if (options.enableRevisionChangeModel) {
				// Attributes for RevisionChangeModel
				attributes = {
					path: {
						type: Sequelize.TEXT,
						allowNull: false,
					},
					document: {
						type: Sequelize.JSONB,
						allowNull: false,
					},
					diff: {
						type: Sequelize.JSONB,
						allowNull: false,
					},
				};

				if (options.mysql) {
					attributes.document.type = Sequelize.TEXT('MEDIUMTEXT');
					attributes.diff.type = Sequelize.TEXT('MEDIUMTEXT');
				}

				if (options.UUID) {
					attributes.id = {
						primaryKey: true,
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4,
					};
				}
				// RevisionChange model
				const RevisionChange = sequelize.define(
					options.revisionChangeModel,
					attributes,
					{
						underscored: options.underscored,
					},
				);

				// Set associations
				Revision.hasMany(RevisionChange, {
					foreignKey: options.defaultAttributes.revisionId,
					constraints: false,
				});

				// https://github.com/nielsgl/sequelize-paper-trail/issues/10
				// RevisionChange.belongsTo(Revision, {
				// 	foreignKey: options.defaultAttributes.revisionId,
				// });
				RevisionChange.belongsTo(Revision);

				if (db) db[RevisionChange.name] = RevisionChange;
			}

			if (db) db[Revision.name] = Revision;

			/*
			 * We could extract this to a separate function so that having a
			 * user model doesn't require different loading
			 *
			 * or perhaps we could omit this because we are creating the
			 * association through the associate call above.
			 */
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

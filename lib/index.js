/* eslint-disable import/no-import-module-exports */
import * as jsdiff from 'diff';
import _ from 'lodash';
import helpers from './helpers';
import createSequelizeV5Adapter from './adapters/sequelize-v5';
import createSequelizeV6Adapter from './adapters/sequelize-v6';

let failHard = false;
const MIN_NODE_MAJOR = 20;

const getNodeMajor = () => {
	if (!process || !process.versions || !process.versions.node) {
		return null;
	}
	const major = Number.parseInt(
		String(process.versions.node).split('.')[0],
		10,
	);
	return Number.isNaN(major) ? null : major;
};

const assertSupportedNodeVersion = () => {
	const major = getNodeMajor();
	if (major !== null && major >= MIN_NODE_MAJOR) {
		return;
	}
	const current =
		process && process.versions && process.versions.node
			? process.versions.node
			: 'unknown';
	const err = new Error(
		`sequelize-paper-trail: Unsupported Node runtime "${current}". ` +
			`Node >=${MIN_NODE_MAJOR} is required.`,
	);
	err.code = 'ERR_UNSUPPORTED_NODE_VERSION';
	throw err;
};

const resolveSequelizeMajor = sequelize => {
	const forcedAdapter = process.env.SEQUELIZE_ADAPTER;
	if (forcedAdapter === 'v5') {
		return 5;
	}
	if (forcedAdapter === 'v6') {
		return 6;
	}
	const version =
		(sequelize && sequelize.Sequelize && sequelize.Sequelize.version) ||
		(sequelize && sequelize.constructor && sequelize.constructor.version);
	if (!version) {
		return null;
	}
	const major = Number.parseInt(String(version).split('.')[0], 10);
	return Number.isNaN(major) ? null : major;
};

const createAdapter = sequelize => {
	const major = resolveSequelizeMajor(sequelize);
	if (major && major >= 6) {
		return createSequelizeV6Adapter(sequelize);
	}
	return createSequelizeV5Adapter(sequelize);
};

exports.init = (sequelize, optionsArg) => {
	assertSupportedNodeVersion();
	const adapter = createAdapter(sequelize);
	const DataTypes = adapter.types;

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
		metaDataFields: null,
		metaDataContinuationKey: 'metaData',
		mysql: false,
	};

	const sequelizeDialect =
		sequelize && typeof sequelize.getDialect === 'function'
			? sequelize.getDialect()
			: null;
	let isMysqlDialect =
		sequelizeDialect &&
		['mysql', 'mariadb'].includes(String(sequelizeDialect).toLowerCase());

	let ns = null;
	if (optsArg.continuationNamespace) {
		ns = adapter.getNamespace(optsArg.continuationNamespace);
	}

	if (optsArg.underscoredAttributes) {
		helpers.toUnderscored(defaultOptions.defaultAttributes);
	}

	const options = _.defaults(optsArg, defaultOptions);
	isMysqlDialect = options.mysql || isMysqlDialect;

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
			/* istanbul ignore next */
			if (options.debug) {
				log('beforeHook called');
				log('instance:', instance);
				log('opt:', opt);
			}

			if (opt.noPaperTrail) {
				/* istanbul ignore next */
				if (options.debug) {
					log('noPaperTrail opt: is true, not logging');
				}
				return;
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

			/* istanbul ignore next */
			if (options.debug) {
				log('delta:', delta);
				log('revisionId', currentRevisionId);
			}
			// Check if all required fields have been provided to the opts / CLS
			if (options.metaDataFields) {
				// get all required field keys as an array
				const requiredFields = _.keys(
					_.pickBy(options.metaDataFields, required => required),
				);
				if (requiredFields && requiredFields.length) {
					const metaData =
						adapter.getNamespaceValue(
							ns,
							options.metaDataContinuationKey,
						) || opt.metaData;
					const requiredFieldsProvided = _.filter(
						requiredFields,
						field => metaData[field] !== undefined,
					);
					if (
						requiredFieldsProvided.length !== requiredFields.length
					) {
						log(
							'Required fields: ',
							options.metaDataFields,
							requiredFields,
						);
						log(
							'Required fields provided: ',
							metaData,
							requiredFieldsProvided,
						);
						throw new Error(
							'Not all required fields are provided to paper trail!',
						);
					}
				}
			}

			if (destroyOperation || (delta && delta.length > 0)) {
				const revisionId = (currentRevisionId || 0) + 1;
				instance.set(options.revisionAttribute, revisionId);

				if (!instance.context) {
					instance.context = {};
				}
				instance.context.delta = delta;
			}

			/* istanbul ignore next */
			if (options.debug) {
				log('end of beforeHook');
			}
		};
		return beforeHook;
	}

	function createAfterHook(operation) {
		const afterHook = function afterHook(instance, opt) {
			/* istanbul ignore next */
			if (options.debug) {
				log('afterHook called');
				log('instance:', instance);
				log('opt:', opt);
				if (ns) {
					log(
						`CLS ${options.continuationKey}:`,
						adapter.getNamespaceValue(ns, options.continuationKey),
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
				const Revision = adapter.getModel(options.revisionModel);
				let RevisionChange;

				if (options.enableRevisionChangeModel) {
					RevisionChange = adapter.getModel(
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

				const continuationValue = adapter.getNamespaceValue(
					ns,
					options.continuationKey,
				);
				if (failHard && ns && !continuationValue) {
					throw new Error(
						`The CLS continuationKey ${options.continuationKey} was not defined.`,
					);
				}

				let document = currentVersion;

				/* istanbul ignore next */
				if (options.mysql && isMysqlDialect) {
					document = JSON.stringify(document);
				}

				// Build revision
				const query = {
					model: this.name,
					document,
					operation,
				};

				// Add all extra data fields to the query object
				if (options.metaDataFields) {
					const metaData =
						adapter.getNamespaceValue(
							ns,
							options.metaDataContinuationKey,
						) || opt.metaData;
					if (metaData) {
						_.forEach(options.metaDataFields, (required, field) => {
							const value = metaData[field];
							/* istanbul ignore next */
							if (options.debug) {
								log(
									`Adding metaData field to Revision - ${field} => ${value}`,
								);
							}
							/* istanbul ignore else */
							if (!(field in query)) {
								query[field] = value;
								/* istanbul ignore next */
							} else if (options.debug) {
								log(
									`Revision object already has a value at ${field} => ${query[field]}`,
								);
								log('Not overwriting the original value');
							}
						});
					}
				}

				// in case of custom user models that are not 'userId'
				query[options.userModelAttribute] =
					adapter.getNamespaceValue(ns, options.continuationKey) ||
					opt.userId;

				query[options.defaultAttributes.documentId] = instance.id;

				const revision = Revision.build(query);

				revision[options.revisionAttribute] = instance.get(
					options.revisionAttribute,
				);

				// Save revision
				return revision
					.save({ transaction: opt.transaction })
					.then(objectRevision => {
						// Loop diffs and create a revision-diff for each
						if (options.enableRevisionChangeModel) {
							_.forEach(delta, difference => {
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

								/* istanbul ignore next */
								if (options.mysql && isMysqlDialect) {
									document = JSON.stringify(document);
									diff = JSON.stringify(diff);
								}

								const d = RevisionChange.build({
									path: difference.path[0],
									document,
									diff,
									revisionId: objectRevision.id,
								});

								d.save({ transaction: opt.transaction })
									.then(savedD => {
										// Add diff to revision
										objectRevision[
											`add${helpers.capitalizeFirstLetter(
												options.revisionChangeModel,
											)}`
										](savedD);

										return null;
									})
									.catch(err => {
										log('RevisionChange save error', err);
										throw err;
									});
							});
						}
						return null;
					})
					.catch(err => {
						log('Revision save error', err);
						throw err;
					});
			}

			/* istanbul ignore next */
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
	_.assignIn(adapter.getModelClass(), {
		hasPaperTrail: function hasPaperTrail() {
			/* istanbul ignore next */
			if (options.debug) {
				log('Enabling paper trail on', this.name);
			}

			adapter.setRawAttribute(this, options.revisionAttribute, {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			});
			adapter.setRevisionable(this, true);

			// not sure if we need this
			adapter.refreshAttributes(this);

			if (options.enableMigration) {
				const tableName = adapter.getTableName(this);
				const queryInterface = adapter.getQueryInterface();

				adapter
					.describeTable(queryInterface, tableName)
					.then(attributes => {
						if (!attributes[options.revisionAttribute]) {
							/* istanbul ignore next */
							if (options.debug) {
								log(
									'adding revision attribute to the database',
								);
							}

							adapter
								.addColumn(
									queryInterface,
									tableName,
									options.revisionAttribute,
									{
										type: DataTypes.INTEGER,
										defaultValue: 0,
									},
								)
								.then(() => null)
								.catch(err => {
									log('something went really wrong..', err);
									return null;
								});
						}
						return null;
					});
			}

			adapter.addHook(this, 'beforeCreate', createBeforeHook('create'));
			adapter.addHook(this, 'beforeDestroy', createBeforeHook('destroy'));
			adapter.addHook(this, 'beforeUpdate', createBeforeHook('update'));
			adapter.addHook(this, 'afterCreate', createAfterHook('create'));
			adapter.addHook(this, 'afterDestroy', createAfterHook('destroy'));
			adapter.addHook(this, 'afterUpdate', createAfterHook('update'));

			// create association
			return adapter.hasMany(
				this,
				adapter.getModel(options.revisionModel),
				{
					foreignKey: options.defaultAttributes.documentId,
					constraints: false,
					scope: {
						model: this.name,
					},
				},
			);
		},
	});

	return {
		// Return defineModels()
		defineModels: function defineModels(db) {
			// Attributes for RevisionModel
			let attributes = {
				model: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				document: {
					type: DataTypes.JSONB,
					allowNull: false,
				},
				operation: DataTypes.STRING(7),
			};

			/* istanbul ignore next */
			if (options.mysql && isMysqlDialect) {
				attributes.document.type = DataTypes.TEXT('MEDIUMTEXT');
			}

			attributes[options.defaultAttributes.documentId] = {
				type: DataTypes.INTEGER,
				allowNull: false,
			};

			attributes[options.revisionAttribute] = {
				type: DataTypes.INTEGER,
				allowNull: false,
			};

			if (options.UUID) {
				attributes.id = {
					primaryKey: true,
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
				};
				attributes[options.defaultAttributes.documentId].type =
					DataTypes.UUID;
			}

			/* istanbul ignore next */
			if (options.debug) {
				log('attributes', attributes);
			}

			// Revision model
			const Revision = adapter.defineModel(
				options.revisionModel,
				attributes,
				{
					underscored: options.underscored,
					tableName: options.tableName,
				},
			);
			Revision.associate = function associate(models) {
				/* istanbul ignore next */
				if (options.debug) {
					log('models', models);
				}

				adapter.belongsTo(
					Revision,
					adapter.getModel(options.userModel),
					options.belongsToUserOptions,
				);
			};

			if (options.enableRevisionChangeModel) {
				// Attributes for RevisionChangeModel
				attributes = {
					path: {
						type: DataTypes.TEXT,
						allowNull: false,
					},
					document: {
						type: DataTypes.JSONB,
						allowNull: false,
					},
					diff: {
						type: DataTypes.JSONB,
						allowNull: false,
					},
				};

				/* istanbul ignore next */
				if (options.mysql && isMysqlDialect) {
					attributes.document.type = DataTypes.TEXT('MEDIUMTEXT');
					attributes.diff.type = DataTypes.TEXT('MEDIUMTEXT');
				}

				if (options.UUID) {
					attributes.id = {
						primaryKey: true,
						type: DataTypes.UUID,
						defaultValue: DataTypes.UUIDV4,
					};
				}
				// RevisionChange model
				const RevisionChange = adapter.defineModel(
					options.revisionChangeModel,
					attributes,
					{
						underscored: options.underscored,
					},
				);

				// Set associations
				adapter.hasMany(Revision, RevisionChange, {
					foreignKey: options.defaultAttributes.revisionId,
					constraints: false,
				});

				// https://github.com/nielsgl/sequelize-paper-trail/issues/10
				// RevisionChange.belongsTo(Revision, {
				// 	foreignKey: options.defaultAttributes.revisionId,
				// });
				adapter.belongsTo(RevisionChange, Revision, {
					foreignKey: options.defaultAttributes.revisionId,
					constraints: false,
				});

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
				adapter.belongsTo(
					Revision,
					adapter.getModel(options.userModel),
					options.belongsToUserOptions,
				);
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

exports._resolveSequelizeMajor = resolveSequelizeMajor;
exports._createAdapter = createAdapter;

module.exports = exports;

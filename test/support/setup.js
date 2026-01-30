const Sequelize = require('./sequelize');
const PaperTrailLib = require('../../lib/index');

const defaultSequelizeOptions = {
	dialect: 'sqlite',
	storage: ':memory:',
	logging: false,
};

const createSequelize = (sequelizeOptions = {}) =>
	new Sequelize({ ...defaultSequelizeOptions, ...sequelizeOptions });

const setupDatabase = async ({
	paperTrailOptions = {},
	modelName = 'User',
	modelAttributes = { name: Sequelize.STRING },
	modelOptions = {},
	userModelName = null,
	userModelAttributes = { name: Sequelize.STRING },
	userModelOptions = {},
	enableHasPaperTrail = true,
	sync = true,
	sequelizeOptions = {},
} = {}) => {
	const sequelize = createSequelize(sequelizeOptions);

	let userModel;
	const configuredUserModel = userModelName || paperTrailOptions.userModel;
	if (configuredUserModel) {
		userModel = sequelize.define(
			configuredUserModel,
			userModelAttributes,
			userModelOptions,
		);
	}

	const PaperTrail = PaperTrailLib.init(sequelize, paperTrailOptions);
	PaperTrail.defineModels();

	const Model = sequelize.define(modelName, modelAttributes, modelOptions);
	if (enableHasPaperTrail) {
		Model.Revisions = Model.hasPaperTrail();
	}

	if (sync) {
		await sequelize.sync({ force: true });
	}

	const revisionModelName = paperTrailOptions.revisionModel || 'Revision';
	const revisionChangeModelName =
		paperTrailOptions.revisionChangeModel || 'RevisionChange';

	return {
		sequelize,
		Sequelize,
		PaperTrail,
		Model,
		userModel,
		Revision: sequelize.model(revisionModelName),
		RevisionChange: paperTrailOptions.enableRevisionChangeModel
			? sequelize.model(revisionChangeModelName)
			: null,
	};
};

const normalizeDocument = document => {
	if (typeof document === 'string') {
		try {
			return JSON.parse(document);
		} catch (err) {
			return document;
		}
	}
	return document;
};

const sortKeysDeep = value => {
	if (Array.isArray(value)) {
		return value.map(sortKeysDeep);
	}
	if (value && typeof value === 'object' && !(value instanceof Date)) {
		return Object.keys(value)
			.sort()
			.reduce((acc, key) => {
				acc[key] = sortKeysDeep(value[key]);
				return acc;
			}, {});
	}
	return value;
};

const isUuid = value =>
	typeof value === 'string' &&
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
		value,
	);

const serializeRevision = revision => {
	const plain = revision.get({ plain: true });
	const { id, createdAt, updatedAt, ...rest } = plain;
	return {
		...rest,
		documentId: isUuid(plain.documentId) ? '<uuid>' : plain.documentId,
		document: sortKeysDeep(normalizeDocument(plain.document)),
	};
};

const serializeRevisionChange = change => {
	const plain = change.get({ plain: true });
	const { id, createdAt, updatedAt, ...rest } = plain;
	return {
		...rest,
		document: sortKeysDeep(normalizeDocument(plain.document)),
		diff: sortKeysDeep(normalizeDocument(plain.diff)),
	};
};

module.exports = {
	createSequelize,
	setupDatabase,
	normalizeDocument,
	sortKeysDeep,
	serializeRevision,
	serializeRevisionChange,
};

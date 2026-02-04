const sequelizePaperTrailOptions = {
	versionAttribute: 'version',
	revisionAttribute: 'revision',
	revisionModel: 'Revisions',
	revisionChangeModel: 'RevisionChange',
	enableRevisionChangeModel: false,
	UUID: false,
	underscored: false,
	underscoredAttributes: false,
	defaultAttributes: {
		documentId: 'documentId',
		revisionId: 'revisionId',
	},
	enableCompression: false,
	enableMigration: true,
	enableStrictDiff: true,
	continuationKey: 'userId',
};

/* eslint no-unused-vars: off */
module.exports = {
	up(queryInterface, Sequelize) {
		// Load default options.
		sequelizePaperTrailOptions.defaultAttributes = {
			documentId: 'documentId',
			revisionId: 'revisionId',
		};

		// Revision model
		const modelAttributes = {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			model: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			document: {
				// type: Sequelize.TEXT('MEDIUMTEXT'),
				type: Sequelize.TEXT,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			operation: {
				type: Sequelize.STRING(7),
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		};
		modelAttributes[
			sequelizePaperTrailOptions.defaultAttributes.documentId
		] = {
			type: Sequelize.INTEGER,
			allowNull: false,
		};
		modelAttributes[sequelizePaperTrailOptions.revisionAttribute] = {
			type: Sequelize.INTEGER,
			allowNull: false,
		};

		const changeModelAttributes = {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			path: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			document: {
				// type: Sequelize.TEXT('MEDIUMTEXT'),
				type: Sequelize.TEXT,
				allowNull: false,
			},
			diff: {
				// type: Sequelize.TEXT('MEDIUMTEXT'),
				type: Sequelize.TEXT,
				allowNull: false,
			},
			revision_id: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		};

		// RevisionChange model
		return Promise.all([
			queryInterface.createTable(
				sequelizePaperTrailOptions.revisionModel,
				modelAttributes,
			),
			queryInterface.createTable(
				sequelizePaperTrailOptions.revisionChangeModel,
				changeModelAttributes,
			),
		]);
	},

	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.dropTable(sequelizePaperTrailOptions.revisionModel),
			queryInterface.dropTable(
				sequelizePaperTrailOptions.revisionChangeModel,
			),
		]);
	},
};

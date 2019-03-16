'use strict';
/* eslint "flowtype/require-return-type": "off", "flowtype/require-parameter-type": "off" */
let sequelizePaperTrailOptions = {
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
		revisionId: 'revisionId'
	},
	enableCompression: false,
	enableMigration: false,
	enableStrictDiff: true,
	continuationKey: 'userId'

};

module.exports = {
	up(queryInterface, Sequelize) {
		// Load default options.
		sequelizePaperTrailOptions.defaultAttributes = {
			documentId: 'documentId',
			revisionId: 'revisionId'
		};

		// Revision model
		let modelAttributes = {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			model: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			document: {
				type: Sequelize.TEXT('MEDIUMTEXT'),
				allowNull: false
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			operation: {
				type: Sequelize.STRING(7)
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		};
		modelAttributes[sequelizePaperTrailOptions.defaultAttributes.documentId] = {
			type: Sequelize.INTEGER,
			allowNull: false
		};
		modelAttributes[sequelizePaperTrailOptions.revisionAttribute] = {
			type: Sequelize.INTEGER,
			allowNull: false
		};

		let changeModelAttributes = {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			path: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			document: {
				type: Sequelize.TEXT('MEDIUMTEXT'),
				allowNull: false
			},
			diff: {
				type: Sequelize.TEXT('MEDIUMTEXT'),
				allowNull: false
			},
			revision_id: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		};

		// RevisionChange model
		return Promise.all([
			queryInterface.createTable(sequelizePaperTrailOptions.revisionModel, modelAttributes),
			queryInterface.createTable(sequelizePaperTrailOptions.revisionChangeModel, changeModelAttributes)
		]);
	},

	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.dropTable(sequelizePaperTrailOptions.revisionModel),
			queryInterface.dropTable(sequelizePaperTrailOptions.revisionChangeModel)
		]);
	}
};

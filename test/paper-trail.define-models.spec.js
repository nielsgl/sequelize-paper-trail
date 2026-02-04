const PaperTrailLib = require('../lib/index');
const { createSequelize } = require('./support/setup');

describe('sequelize-paper-trail defineModels registration', () => {
	it('adds models to the provided db object', async () => {
		const sequelize = createSequelize();
		const PaperTrail = PaperTrailLib.init(sequelize, {
			enableRevisionChangeModel: true,
		});
		const db = {};

		PaperTrail.defineModels(db);

		expect(db.Revision).toBeDefined();
		expect(db.RevisionChange).toBeDefined();

		await sequelize.close();
	});
});

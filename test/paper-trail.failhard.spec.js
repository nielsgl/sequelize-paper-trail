const Sequelize = require('sequelize');

const runIsolated = async fn =>
	new Promise((resolve, reject) => {
		jest.isolateModules(() => {
			Promise.resolve(fn()).then(resolve).catch(reject);
		});
	});

describe('sequelize-paper-trail failHard behavior (v5 baseline)', () => {
	it('throws when CLS userId is missing', async () => {
		await runIsolated(async () => {
			const PaperTrailLib = require('../lib/index');
			PaperTrailLib.enableFailHard();

			const { setupDatabase } = require('./support/setup');
			const ctx = await setupDatabase({
				paperTrailOptions: {
					continuationNamespace: 'failHardTest',
				},
				modelAttributes: { name: Sequelize.STRING },
			});

			await expect(ctx.Model.create({ name: 'Fail' })).rejects.toThrow(
				/continuationKey/,
			);

			await ctx.sequelize.close();
		});
	});

	it('throws when revisionAttribute is missing on update', async () => {
		await runIsolated(async () => {
			const PaperTrailLib = require('../lib/index');
			PaperTrailLib.enableFailHard();

			const { setupDatabase } = require('./support/setup');
			const ctx = await setupDatabase();
			const user = await ctx.Model.create({ name: 'FailHard' });

			const originalGet = user.get.bind(user);
			const getSpy = jest
				.spyOn(user, 'get')
				.mockImplementation(key =>
					key === 'revision' ? undefined : originalGet(key),
				);

			await expect(
				user.update({ name: 'FailHard-2' }, { type: 'UPDATE' }),
			).rejects.toThrow('Revision Id was undefined');

			getSpy.mockRestore();
			await ctx.sequelize.close();
		});
	});
});

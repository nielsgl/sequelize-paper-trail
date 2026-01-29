const cls = require('continuation-local-storage');
const Sequelize = require('sequelize');
const { setupDatabase } = require('./support/setup');
const { getModelRevisions } = require('./support/behavior');

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('user attribution', () => {
		let ctx;
		beforeEach(async () => {
			const ns = cls.createNamespace('paperTrailTest');
			ctx = await setupDatabase({
				paperTrailOptions: {
					userModel: 'Account',
					continuationNamespace: 'paperTrailTest',
					belongsToUserOptions: { foreignKey: 'userId' },
				},
				modelName: 'Post',
				modelAttributes: { title: Sequelize.STRING },
				userModelName: 'Account',
				userModelAttributes: { name: Sequelize.STRING },
			});
			ctx.namespace = ns;
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('records userId from options when provided', async () => {
			const { Model, Revision, userModel } = ctx;
			const account = await userModel.create({ name: 'Owner' });

			await Model.create({ title: 'Post 1' }, { userId: account.id });

			const revisions = await getModelRevisions(Revision, 'Post');
			expect(revisions[0].userId).toEqual(account.id);
		});

		it('records userId from CLS context', async () => {
			const { Model, Revision, userModel, namespace } = ctx;
			const account = await userModel.create({ name: 'Owner' });

			await new Promise((resolve, reject) => {
				namespace.run(async () => {
					try {
						namespace.set('userId', account.id);
						await Model.create({ title: 'Post 2' });
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});

			const revisions = await getModelRevisions(Revision, 'Post');
			expect(revisions[0].userId).toEqual(account.id);
		});

		it('does not leak CLS values across runs', async () => {
			const { Model, Revision, userModel, namespace } = ctx;
			const accountA = await userModel.create({ name: 'UserA' });
			const accountB = await userModel.create({ name: 'UserB' });

			await new Promise((resolve, reject) => {
				namespace.run(async () => {
					try {
						namespace.set('userId', accountA.id);
						await Model.create({ title: 'Post A' });
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});

			await new Promise((resolve, reject) => {
				namespace.run(async () => {
					try {
						namespace.set('userId', accountB.id);
						await Model.create({ title: 'Post B' });
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});

			const revisions = await getModelRevisions(Revision, 'Post');
			expect(revisions.map(revision => revision.userId)).toEqual([
				accountA.id,
				accountB.id,
			]);
		});

		it('exposes a Revision.associate helper for user models', async () => {
			const assocCtx = await setupDatabase({
				paperTrailOptions: {
					userModel: 'Account',
					continuationNamespace: 'paperTrailTest',
					belongsToUserOptions: { foreignKey: 'userId' },
					debug: true,
				},
				modelName: 'Post',
				modelAttributes: { title: Sequelize.STRING },
				userModelName: 'Account',
				userModelAttributes: { name: Sequelize.STRING },
			});

			const { Revision, sequelize } = assocCtx;
			const originalBelongsTo = Revision.belongsTo;
			const belongsToSpy = jest.fn();
			Revision.belongsTo = belongsToSpy;

			Revision.associate(sequelize.models);
			expect(belongsToSpy).toHaveBeenCalled();

			Revision.belongsTo = originalBelongsTo;
			await assocCtx.sequelize.close();
		});

		it('allows Revision.associate without debug logging', async () => {
			const assocCtx = await setupDatabase({
				paperTrailOptions: {
					userModel: 'Account',
					belongsToUserOptions: { foreignKey: 'userId' },
				},
				modelName: 'Post',
				modelAttributes: { title: Sequelize.STRING },
				userModelName: 'Account',
				userModelAttributes: { name: Sequelize.STRING },
			});

			expect(() => {
				assocCtx.Revision.associate(assocCtx.sequelize.models);
			}).not.toThrow();

			await assocCtx.sequelize.close();
		});
	});
});

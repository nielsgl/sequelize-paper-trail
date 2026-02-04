const Sequelize = require('./support/sequelize');
const { setupDatabase } = require('./support/setup');
const { getModelRevisions } = require('./support/behavior');

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('transactions and rollback', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('rolls back revisions with the transaction', async () => {
			const { Model, Revision, sequelize } = ctx;
			const transaction = await sequelize.transaction();
			await Model.create({ name: 'Alice' }, { transaction });
			await transaction.rollback();

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(0);
		});

		it('persists revisions when the transaction commits', async () => {
			const { Model, Revision, sequelize } = ctx;
			const transaction = await sequelize.transaction();
			await Model.create({ name: 'Alice' }, { transaction });
			await transaction.commit();

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
		});
	});

	describe('concurrency', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('handles concurrent updates across distinct instances', async () => {
			const { Model, Revision } = ctx;
			const [userA, userB] = await Model.bulkCreate(
				[{ name: 'A' }, { name: 'B' }],
				{ returning: true, individualHooks: true },
			);

			await Promise.all([
				userA.update({ name: 'A-1' }),
				userB.update({ name: 'B-1' }),
			]);

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(4);

			const byDoc = revisions.reduce((acc, revision) => {
				if (!acc[revision.documentId]) {
					acc[revision.documentId] = [];
				}
				acc[revision.documentId].push(revision.revision);
				return acc;
			}, {});

			expect(byDoc[userA.id]).toEqual([1, 2]);
			expect(byDoc[userB.id]).toEqual([1, 2]);
		});
	});

	describe('paranoid models', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				modelAttributes: { name: Sequelize.STRING },
				modelOptions: { paranoid: true },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates revisions for destroy on paranoid models', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			await user.destroy();
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
		});

		it('does not create a revision for restore', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			await user.destroy();
			await user.restore();

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
		});
	});

	describe('failure handling', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('does not create a revision when a model hook throws', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			Model.addHook('beforeUpdate', 'fail-test', () => {
				throw new Error('hook-fail');
			});

			await expect(user.update({ name: 'Alicia' })).rejects.toThrow(
				'hook-fail',
			);

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
		});

		it('surfaces errors when revision saving fails', async () => {
			const { Model, Revision } = ctx;
			const saveSpy = jest
				.spyOn(Revision.prototype, 'save')
				.mockRejectedValue(new Error('save-fail'));

			await expect(Model.create({ name: 'Fail' })).rejects.toThrow(
				'save-fail',
			);

			saveSpy.mockRestore();
		});
	});
});

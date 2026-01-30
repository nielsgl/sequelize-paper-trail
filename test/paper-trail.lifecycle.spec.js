const Sequelize = require('./support/sequelize');
const { setupDatabase, normalizeDocument } = require('./support/setup');
const { getModelRevisions } = require('./support/behavior');

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('basic lifecycle', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates revisions on create, update, destroy', async () => {
			const { Model, Revision } = ctx;

			const user = await Model.create({ name: 'Alice' });
			expect(user.get('revision')).toEqual(1);

			let revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);

			await user.update({ name: 'Alicia' });
			const refreshed = await Model.findByPk(user.id);
			expect(refreshed.get('revision')).toEqual(2);

			revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);

			await refreshed.destroy();
			revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(3);
		});

		it('does not create a revision for a no-op update', async () => {
			const { Model, Revision } = ctx;

			const user = await Model.create({ name: 'Alice' });
			const initial = await getModelRevisions(Revision, 'User');
			expect(initial).toHaveLength(1);

			await user.update({ name: 'Alice' });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
		});
	});

	describe('bulk operations', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates revisions for bulkCreate with individualHooks', async () => {
			const { Model, Revision } = ctx;

			await Model.bulkCreate([{ name: 'A' }, { name: 'B' }], {
				individualHooks: true,
			});

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
		});

		it('creates revisions for bulkUpdate with individualHooks', async () => {
			const { Model, Revision } = ctx;

			await Model.bulkCreate([{ name: 'A' }, { name: 'B' }], {
				individualHooks: true,
			});

			await Model.update(
				{ name: 'Updated' },
				{ where: {}, individualHooks: true },
			);

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(4);
		});

		it('creates revisions for bulkDestroy with individualHooks', async () => {
			const { Model, Revision } = ctx;

			await Model.bulkCreate([{ name: 'A' }, { name: 'B' }], {
				individualHooks: true,
			});

			await Model.destroy({ where: {}, individualHooks: true });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(4);
		});
	});

	describe('bulk operations with paranoid models', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				modelOptions: { paranoid: true },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates revisions for bulkDestroy with individualHooks', async () => {
			const { Model, Revision } = ctx;

			await Model.bulkCreate([{ name: 'A' }, { name: 'B' }], {
				individualHooks: true,
			});

			await Model.destroy({ where: {}, individualHooks: true });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(4);
		});
	});

	describe('exclude list', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					exclude: [
						'id',
						'createdAt',
						'updatedAt',
						'deletedAt',
						'created_at',
						'updated_at',
						'deleted_at',
						'revision',
						'name',
					],
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('skips revisions when excluded fields remove all deltas', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			await user.update({ name: 'Alicia' });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(0);
		});
	});

	describe('noPaperTrail', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('does not prevent revisions when set on update options', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			await user.update({ name: 'Alicia' }, { noPaperTrail: true });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
		});
	});

	describe('edge data types', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				modelAttributes: {
					name: {
						type: Sequelize.STRING,
						allowNull: true,
					},
					status: {
						type: Sequelize.STRING,
						defaultValue: 'new',
					},
					tags: Sequelize.JSON,
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates revisions for null-to-value changes on scalars', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: null });
			await user.update({ name: 'Alice' });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
			expect(revisions[1].revision).toEqual(2);
		});

		it('stores default values in revision documents', async () => {
			const { Model, Revision } = ctx;
			await Model.create({ name: 'Default' });
			const revisions = await getModelRevisions(Revision, 'User');
			const document = normalizeDocument(revisions[0].document);
			expect(document.status).toEqual('new');
		});

		it('creates revisions for array changes but does not increment revision attribute', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Tags', tags: ['a'] });
			await user.update({ tags: ['a', 'b'] });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
			expect(revisions[1].revision).toEqual(1);
		});
	});

	describe('object field updates', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				modelAttributes: {
					name: Sequelize.STRING,
					meta: Sequelize.JSON,
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('creates a revision without incrementing the revision attribute', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({
				name: 'Alice',
				meta: { count: 1 },
			});

			await user.update({ meta: { count: 2 } });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
			expect(revisions[1].revision).toEqual(1);
		});
	});
});

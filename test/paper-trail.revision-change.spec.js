const Sequelize = require('sequelize');
const { setupDatabase, normalizeDocument } = require('./support/setup');

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('revision change model and diffs', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
			});
		});
		afterEach(async () => {
			if (ctx) {
				await ctx.sequelize.close();
			}
		});

		it('records per-attribute diffs when enabled', async () => {
			const { Model, RevisionChange, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });

			await user.update({ name: 'Alicia' });
			const changes = await RevisionChange.findAll({
				order: [['createdAt', 'ASC']],
			});
			expect(changes.length).toBeGreaterThan(0);
			expect(changes[0].path).toEqual('name');
			const diff = normalizeDocument(changes[0].diff);
			expect(diff).not.toEqual(null);
			expect(
				diff.some(entry =>
					String(entry.value || '').includes('Alice'),
				),
			).toEqual(true);

			const revisions = await Revision.findAll({
				order: [['createdAt', 'ASC']],
			});
			const revisionIds = revisions.map(revision => revision.id);
			expect(revisionIds).toContain(changes[0].RevisionId);
		});

		it('does not create RevisionChange rows when disabled', async () => {
			const disabledCtx = await setupDatabase({
				paperTrailOptions: { enableRevisionChangeModel: false },
			});
			const { Model } = disabledCtx;
			await Model.create({ name: 'NoChange' });
			await Model.update({ name: 'NoChange-2' }, { where: {} });

			expect(disabledCtx.RevisionChange).toEqual(null);
			expect(disabledCtx.sequelize.models.RevisionChange).toBeUndefined();
			await disabledCtx.sequelize.close();
		});

		it('surfaces errors when RevisionChange save fails', async () => {
			const { Model, RevisionChange } = ctx;

			const saveSpy = jest
				.spyOn(RevisionChange.prototype, 'save')
				.mockImplementation(() => ({
					then: () => ({
						catch: handler => {
							handler(new Error('change-fail'));
							return null;
						},
					}),
				}));

			await expect(Model.create({ name: 'Fail' })).rejects.toThrow(
				'change-fail',
			);

			saveSpy.mockRestore();
		});

		it('records array diffs using the item branch', async () => {
			const helpers =
				require('../lib/helpers').default || require('../lib/helpers');
			const calcSpy = jest.spyOn(helpers, 'calcDelta').mockReturnValue([
				{
					kind: 'A',
					path: ['tags'],
					item: { kind: 'E', lhs: 'a', rhs: 'b' },
				},
			]);

			const arrayCtx = await setupDatabase({
				paperTrailOptions: {
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
				modelAttributes: {
					name: Sequelize.STRING,
					tags: Sequelize.JSON,
				},
			});
			const { Model, RevisionChange } = arrayCtx;

			const user = await Model.create({ name: 'Tags', tags: ['a'] });
			await user.update({ tags: ['a', 'b'] });

			const changes = await RevisionChange.findAll({
				order: [['createdAt', 'ASC']],
			});
			expect(changes.length).toBeGreaterThan(0);
			const document = normalizeDocument(changes[0].document);
			expect(document.item).toBeDefined();

			calcSpy.mockRestore();
			await arrayCtx.sequelize.close();
		});

		it('creates empty diff arrays when both sides stringify to empty', async () => {
			const emptyCtx = await setupDatabase({
				paperTrailOptions: {
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
				modelAttributes: {
					name: {
						type: Sequelize.STRING,
						allowNull: true,
					},
				},
			});
			const { Model, RevisionChange } = emptyCtx;

			const user = await Model.create({ name: '' });
			await user.update({ name: null });

			const changes = await RevisionChange.findAll({
				order: [['createdAt', 'ASC']],
			});
			expect(changes.length).toBeGreaterThan(0);
			expect(normalizeDocument(changes[0].diff)).toEqual([]);

			await emptyCtx.sequelize.close();
		});
	});
});

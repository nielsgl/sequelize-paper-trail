const Sequelize = require('sequelize');
const {
	setupDatabase,
	serializeRevision,
	serializeRevisionChange,
} = require('./support/setup');
const { getModelRevisions } = require('./support/behavior');

const waitForRevisionChangeIds = async (RevisionChange, attempts = 5) => {
	const changes = await RevisionChange.findAll({
		order: [['createdAt', 'ASC']],
	});
	const hasNullRevisionId = changes.some(
		change => change.get('RevisionId') == null,
	);
	if (!hasNullRevisionId || attempts <= 1) {
		return changes;
	}
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});
	return waitForRevisionChangeIds(RevisionChange, attempts - 1);
};

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('golden snapshots', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase();
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('captures stable revision payloads for create/update/destroy', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Alice' });
			await user.update({ name: 'Alicia' });
			await user.destroy();

			const revisions = await getModelRevisions(Revision, 'User');
			const serialized = revisions.map(serializeRevision);
			expect(serialized).toMatchSnapshot();
		});

		it('captures underscored revision payloads', async () => {
			const underscoredCtx = await setupDatabase({
				paperTrailOptions: {
					underscored: true,
					underscoredAttributes: true,
					enableRevisionChangeModel: true,
				},
				modelName: 'Order',
				modelAttributes: { total: Sequelize.INTEGER },
			});

			const { Model, Revision } = underscoredCtx;
			const order = await Model.create({ total: 10 });
			await order.update({ total: 20 });

			const revisions = await getModelRevisions(Revision, 'Order');
			const serialized = revisions.map(serializeRevision);
			expect(serialized).toMatchSnapshot();
			await underscoredCtx.sequelize.close();
		});

		it('captures UUID revision payloads', async () => {
			const uuidCtx = await setupDatabase({
				paperTrailOptions: { UUID: true },
				modelName: 'Asset',
				modelAttributes: { name: Sequelize.STRING },
			});

			const { Model, Revision } = uuidCtx;
			const asset = await Model.create({ name: 'Device' });
			await asset.update({ name: 'Device-2' });

			const revisions = await getModelRevisions(Revision, 'Asset');
			const serialized = revisions.map(serializeRevision);
			expect(serialized).toMatchSnapshot();
			await uuidCtx.sequelize.close();
		});

		it('captures metadata fields on revisions', async () => {
			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: true },
				},
			});
			const { Model, Revision } = metaCtx;

			await Model.create(
				{ name: 'Meta' },
				{ metaData: { requestId: 'req-100' } },
			);

			const revisions = await getModelRevisions(Revision, 'User');
			const serialized = revisions.map(serializeRevision);
			expect(serialized).toMatchSnapshot();
			await metaCtx.sequelize.close();
		});

		it('captures revision change diffs', async () => {
			const diffCtx = await setupDatabase({
				paperTrailOptions: {
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
			});
			const { Model, RevisionChange } = diffCtx;
			const user = await Model.create({ name: 'Diff' });
			await user.update({ name: 'Diff-2' });

			const changes = await waitForRevisionChangeIds(RevisionChange);
			const serialized = changes.map(serializeRevisionChange);
			expect(serialized).toMatchSnapshot();
			await diffCtx.sequelize.close();
		});
	});
});

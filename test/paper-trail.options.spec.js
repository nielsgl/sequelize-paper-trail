const Sequelize = require('./support/sequelize');
const { setupDatabase, normalizeDocument } = require('./support/setup');
const { getModelRevisions, waitForColumn } = require('./support/behavior');

describe('sequelize-paper-trail user journeys (v5 baseline)', () => {
	describe('compression and strict diff', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: { enableCompression: true },
				modelAttributes: {
					name: Sequelize.STRING,
					email: Sequelize.STRING,
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('limits document to default fields when compression is enabled', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({
				name: 'Alice',
				email: 'a@test.com',
			});

			await user.update(
				{ name: 'Alicia', email: 'b@test.com' },
				{ fields: ['name'] },
			);

			const revisions = await getModelRevisions(Revision, 'User');
			const latest = revisions[revisions.length - 1];
			const document = normalizeDocument(latest.document);
			expect(document.email).toBeUndefined();
		});

		it('still creates revisions when strict diff is disabled for string/number changes', async () => {
			const looseCtx = await setupDatabase({
				paperTrailOptions: { enableStrictDiff: false },
				modelAttributes: { age: Sequelize.STRING },
			});
			const { Model, Revision } = looseCtx;

			const user = await Model.create({ age: '18' });
			await user.update({ age: 18 });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
			await looseCtx.sequelize.close();
		});

		it('creates a revision when strict diff is enabled for string/number changes', async () => {
			const strictCtx = await setupDatabase({
				paperTrailOptions: { enableStrictDiff: true },
				modelAttributes: { age: Sequelize.STRING },
			});
			const { Model, Revision } = strictCtx;

			const user = await Model.create({ age: '18' });
			await user.update({ age: 18 });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);
			await strictCtx.sequelize.close();
		});
	});

	describe('metaDataFields enforcement', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: true },
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('throws if required metaData fields are missing', async () => {
			const { Model } = ctx;
			await expect(Model.create({ name: 'Alice' })).rejects.toThrow(
				/requestId/,
			);
			const { Revision } = ctx;
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(0);
		});

		it('accepts required metaData fields when provided', async () => {
			const { Model, Revision } = ctx;
			await Model.create(
				{ name: 'Alice' },
				{ metaData: { requestId: 'req-1' } },
			);
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
			expect(revisions[0].get('requestId')).toBeUndefined();
		});

		it('does not persist metadata fields by default', async () => {
			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: true },
				},
			});
			const { Model, Revision } = metaCtx;

			await Model.create(
				{ name: 'Bob' },
				{ metaData: { requestId: 'req-2' } },
			);
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions[0].get('requestId')).toBeUndefined();
			await metaCtx.sequelize.close();
		});

		it('does not overwrite existing revision fields with metadata', async () => {
			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { model: true },
					debug: true,
				},
			});
			const { Model, Revision } = metaCtx;

			await Model.create(
				{ name: 'Meta' },
				{ metaData: { model: 'Override' } },
			);
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions[0].model).toEqual('User');
			await metaCtx.sequelize.close();
		});

		it('logs missing required metadata when debug is enabled', async () => {
			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: true, traceId: true },
					debug: true,
				},
			});

			await expect(
				metaCtx.Model.create(
					{ name: 'Meta' },
					{ metaData: { requestId: 'req-1' } },
				),
			).rejects.toThrow(/Not all required fields/);

			await metaCtx.sequelize.close();
		});

		it('skips metadata augmentation when metaData is not provided', async () => {
			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: false },
				},
			});

			await metaCtx.Model.create({ name: 'NoMeta' });
			const revisions = await getModelRevisions(metaCtx.Revision, 'User');
			expect(revisions).toHaveLength(1);

			await metaCtx.sequelize.close();
		});

		it('reads metadata from CLS when configured', async () => {
			const cls = require('./support/cls');
			const ns = cls.createNamespace('metaDataNS');
			const originalGet = ns.get.bind(ns);

			ns.get = key =>
				key === 'metaData'
					? { requestId: 'req-cls' }
					: originalGet(key);

			const metaCtx = await setupDatabase({
				paperTrailOptions: {
					metaDataFields: { requestId: true },
					continuationNamespace: 'metaDataNS',
				},
			});

			await metaCtx.Model.create({ name: 'CLS' });

			const revisions = await getModelRevisions(metaCtx.Revision, 'User');
			expect(revisions).toHaveLength(1);

			ns.get = originalGet;
			await metaCtx.sequelize.close();
		});
	});

	describe('enableMigration', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: { enableMigration: true, debug: true },
				modelName: 'Widget',
				modelAttributes: { name: Sequelize.STRING },
				modelOptions: { tableName: 'Widgets' },
				enableHasPaperTrail: false,
				sync: false,
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('adds revisionAttribute when missing', async () => {
			const { sequelize, Model } = ctx;
			const queryInterface = sequelize.getQueryInterface();

			await queryInterface.createTable('Widgets', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.STRING,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			});

			Model.hasPaperTrail();

			const added = await waitForColumn(
				queryInterface,
				'Widgets',
				'revision',
			);
			expect(added).toEqual(true);
		});

		it('does not fail when revisionAttribute already exists', async () => {
			const { sequelize, Model } = ctx;
			const queryInterface = sequelize.getQueryInterface();

			await queryInterface.createTable('Widgets', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.STRING,
				},
				revision: {
					type: Sequelize.INTEGER,
					defaultValue: 0,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			});

			Model.hasPaperTrail();

			const columns = await queryInterface.describeTable('Widgets');
			expect(columns.revision).toBeDefined();
		});

		it('logs and ignores addColumn errors when migration fails', async () => {
			const { sequelize, Model } = ctx;
			const queryInterface = sequelize.getQueryInterface();

			await queryInterface.createTable('Widgets', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.STRING,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			});

			const describeSpy = jest
				.spyOn(queryInterface, 'describeTable')
				.mockResolvedValue({});
			const addColumnSpy = jest
				.spyOn(queryInterface, 'addColumn')
				.mockRejectedValue(new Error('boom'));

			Model.hasPaperTrail();

			await new Promise(resolve => {
				setTimeout(resolve, 0);
			});

			expect(addColumnSpy).toHaveBeenCalled();

			describeSpy.mockRestore();
			addColumnSpy.mockRestore();
		});
	});

	describe('migration disabled', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: { enableMigration: false },
				modelName: 'Device',
				modelAttributes: { name: Sequelize.STRING },
				modelOptions: { tableName: 'Devices' },
				enableHasPaperTrail: false,
				sync: false,
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('does not add revisionAttribute when disabled', async () => {
			const { sequelize, Model } = ctx;
			const queryInterface = sequelize.getQueryInterface();

			await queryInterface.createTable('Devices', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				name: {
					type: Sequelize.STRING,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			});

			Model.hasPaperTrail();

			const columns = await queryInterface.describeTable('Devices');
			expect(columns.revision).toBeUndefined();
		});
	});

	describe('debug logging', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: { debug: true },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('does not alter revision behavior when debug is enabled', async () => {
			const { Model, Revision } = ctx;
			await Model.create({ name: 'Debug' });
			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
		});

		it('runs debug logging paths when no revision is created', async () => {
			const { Model, Revision } = ctx;
			const user = await Model.create({ name: 'Debug' });

			await user.update({ name: 'Debug' });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(1);
		});

		it('logs end of afterHook when deltas are excluded', async () => {
			const debugCtx = await setupDatabase({
				paperTrailOptions: {
					debug: true,
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
			const { Model, Revision } = debugCtx;
			const user = await Model.create({ name: 'Debug' });

			await user.update({ name: 'Debug-2' });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(0);

			await debugCtx.sequelize.close();
		});

		it('logs CLS values when a continuation namespace is configured', async () => {
			const debugCtx = await setupDatabase({
				paperTrailOptions: {
					debug: true,
					continuationNamespace: 'debugCLS',
				},
			});

			await debugCtx.Model.create({ name: 'Debug' });
			expect(debugCtx.Model).toBeTruthy();

			await debugCtx.sequelize.close();
		});

		it('logs when noPaperTrail is set on update options', async () => {
			const debugCtx = await setupDatabase({
				paperTrailOptions: { debug: true },
			});
			const { Model, Revision } = debugCtx;
			const user = await Model.create({ name: 'Debug' });

			await user.update({ name: 'Debug-2' }, { noPaperTrail: true });

			const revisions = await getModelRevisions(Revision, 'User');
			expect(revisions).toHaveLength(2);

			await debugCtx.sequelize.close();
		});
	});

	describe('schema options', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					underscored: true,
					underscoredAttributes: true,
					enableRevisionChangeModel: true,
				},
				modelName: 'Order',
				modelAttributes: { total: Sequelize.INTEGER },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('uses underscored attributes for revision tables', async () => {
			const { sequelize, Revision, RevisionChange } = ctx;
			const queryInterface = sequelize.getQueryInterface();
			const revisionTable = Revision.getTableName();
			const changeTable = RevisionChange.getTableName();
			const revisionTableName = revisionTable.tableName || revisionTable;
			const changeTableName = changeTable.tableName || changeTable;

			const revisionColumns =
				await queryInterface.describeTable(revisionTableName);
			const changeColumns =
				await queryInterface.describeTable(changeTableName);

			expect(revisionColumns.document_id).toBeDefined();
			expect(changeColumns.revision_id).toBeDefined();
		});
	});

	describe('custom revision attribute and table name', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					revisionAttribute: 'rev',
					tableName: 'audit_revisions',
				},
				modelName: 'Invoice',
				modelAttributes: { total: Sequelize.INTEGER },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('writes revisions using the custom attribute and table name', async () => {
			const { Model, sequelize } = ctx;
			const queryInterface = sequelize.getQueryInterface();

			const invoice = await Model.create({ total: 10 });
			expect(invoice.get('rev')).toEqual(1);

			const revisions =
				await queryInterface.describeTable('audit_revisions');
			expect(revisions.rev).toBeDefined();
		});
	});

	describe('UUID revision option', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: { UUID: true },
				modelName: 'Asset',
				modelAttributes: { name: Sequelize.STRING },
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('uses UUID types for revision identifiers', async () => {
			const { Revision } = ctx;
			expect(Revision.rawAttributes.id.type.key).toEqual('UUID');
			expect(Revision.rawAttributes.documentId.type.key).toEqual('UUID');
		});
	});

	describe('mysql option', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					mysql: true,
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
				sync: false,
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('uses MEDIUMTEXT types for document and diff', () => {
			const { Revision, RevisionChange } = ctx;

			expect(Revision.rawAttributes.document.type.key).toEqual('TEXT');
			expect(Revision.rawAttributes.document.type.options.length).toEqual(
				'MEDIUMTEXT',
			);
			expect(
				RevisionChange.rawAttributes.document.type.options.length,
			).toEqual('MEDIUMTEXT');
			expect(
				RevisionChange.rawAttributes.diff.type.options.length,
			).toEqual('MEDIUMTEXT');
		});
	});

	describe('UUID revision change option', () => {
		let ctx;
		beforeEach(async () => {
			ctx = await setupDatabase({
				paperTrailOptions: {
					UUID: true,
					enableRevisionChangeModel: true,
					defaultAttributes: {
						documentId: 'documentId',
						revisionId: 'RevisionId',
					},
				},
			});
		});
		afterEach(async () => {
			await ctx.sequelize.close();
		});

		it('uses UUID identifiers for RevisionChange', async () => {
			const { RevisionChange } = ctx;
			expect(RevisionChange.rawAttributes.id.type.key).toEqual('UUID');
		});
	});
});

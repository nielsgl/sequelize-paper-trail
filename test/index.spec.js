/* eslint-disable no-unused-vars */
import SequelizeTrails from '../lib/index';

const cls = require('continuation-local-storage');
const Sequelize = require('sequelize');

const namespace = cls.createNamespace('testNamespace');
Sequelize.useCLS(namespace);

const db = require('./models/index.js');

const { sequelize } = db;

let User;
let PaperTrails;
let Revision;

describe('import', () => {
	it('loads the library', () => {
		// console.log(helpers);
		expect(true).toEqual(true);
	});
});

describe('PaperTrails', () => {
	beforeAll(() => {
		PaperTrails = SequelizeTrails.init(sequelize, {
			enableMigration: true,
			continuationNamespace: 'testNamespace',
		});
		Revision = PaperTrails.defineModels();
		User = sequelize.model('User');
		User.Revisions = User.hasPaperTrail();
		User.refreshAttributes();
	});

	it('model is revisionable', () => {
		expect.assertions(1);

		expect(User.revisionable).toEqual(true);
	});

	describe('sets the revision for a model', () => {
		it('creates the user', async () => {
			expect.assertions(1);

			const [user, created] = await User.findOrCreate({
				where: { name: 'Dave' },
			});
			console.log('user', created);

			expect(created).toEqual(true);
		});

		it('is the first revision', async () => {
			expect.assertions(1);

			const res = await User.findOrCreate({
				where: { name: 'Dave' },
			});

			expect(res[0].get('revision')).toEqual(1);
		});
		it('increments the revision', async () => {
			expect.assertions(1);

			// eslint-disable-next-line prefer-const
			let [user, created] = await User.findOrCreate({
				where: { name: 'Dave' },
			});

			user = await user
				.update({ name: 'David' })
				.then(() => user.reload());

			expect(user.get('revision')).toEqual(2);
		});
	});

	describe('audit tracking may be disabled', () => {
		[
			{
				noPaperTrail: false,
				revision: 1,
				revisionCount: 1,
			},
			{
				noPaperTrail: true,
				revision: 0,
				revisionCount: 0,
			},
			{
				noPaperTrail: 1,
				revision: 0,
				revisionCount: 0,
			},
			{
				noPaperTrail: ' ',
				revision: 0,
				revisionCount: 0,
			},
		].forEach(test => {
			it(`noPaperTrail option is set to ${test.noPaperTrail}`, async () => {
				const user = await User.create(
					{
						name: 'Eugene',
					},
					{
						noPaperTrail: test.noPaperTrail,
					},
				);

				expect(user.revision).toEqual(test.revision);

				const revisionList = await Revision.findAll({
					where: {
						model: 'User',
						documentId: user.id,
					},
				});

				expect(revisionList.length).toEqual(test.revisionCount);
			});

			it(`noPaperTrail continuation attribute is set to ${test.noPaperTrail}`, async () => {
				await new Promise((resolve, reject) => {
					namespace.run(async () => {
						namespace.set('noPaperTrail', test.noPaperTrail);

						const user = await User.create(
							{
								name: 'Fred',
							},
							{
								noPaperTrail: test.noPaperTrail,
							},
						);

						expect(user.revision).toEqual(test.revision);

						const revisionList = await Revision.findAll({
							where: {
								model: 'User',
								documentId: user.id,
							},
						});

						expect(revisionList.length).toEqual(test.revisionCount);
						resolve();
					});
				});
			});
		});
	});
});

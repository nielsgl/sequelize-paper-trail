/* eslint-disable no-unused-vars */
import SequelizeTrails from '../lib/index';

const db = require('./models/index.js');

const { sequelize } = db;

let User;
let PaperTrails;

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
		});
		PaperTrails.defineModels();
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
});

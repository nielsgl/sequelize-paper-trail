/* eslint-disable no-unused-vars */
import SequelizeTrails from '../lib/index';

const db = require('../models/index.js');

const { sequelize } = db;

let User;
let PaperTrails;

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

	it('can do something cool', async () => {
		const [foo, bar] = await Promise.resolve(['foo', true]);
		expect(bar).toEqual(true);
	});

	describe('sets the revision for a model', () => {
		it('creates the user', async () => {
			expect.assertions(1);

			const [user, created] = await User.findOrCreate({
				where: { name: 'Dave' },
			});
			expect(created).toEqual(true);

			// .spread((user, created) => {
			// 	// console.log(user.get({plain: true}));

			// 	expect(user.get('revision')).toEqual(1);

			// 	user.update({ name: 'David' })
			// 		.then(() => {
			// 			user.reload()
			// 				.then(() => {
			// 					// console.log(user.get({plain: true}));
			// 					expect(user.get('revision')).toEqual(2);
			// 					done();
			// 				})
			// 				.catch(err => {
			// 					done(err);
			// 				});
			// 		})
			// 		.catch(err => {
			// 			done(err);
			// 		});
			// })
			// .catch(err => {
			// 	done(err);
			// });
		});

		it('is the first revision', async () => {
			expect.assertions(1);

			const res = await User.findOrCreate({
				where: { name: 'Dave' },
			});

			expect(res[0].get('revision')).toEqual(1);

			// .spread((user, created) => {
			// 	// console.log(user.get({plain: true}));

			// 	// expect(created).toEqual(true);

			// 	user.update({ name: 'David' })
			// 		.then(() => {
			// 			user.reload()
			// 				.then(() => {
			// 					// console.log(user.get({plain: true}));
			// 					expect(user.get('revision')).toEqual(2);
			// 					done();
			// 				})
			// 				.catch(err => {
			// 					done(err);
			// 				});
			// 		})
			// 		.catch(err => {
			// 			done(err);
			// 		});
			// })
			// .catch(err => {
			// 	done(err);
			// });
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

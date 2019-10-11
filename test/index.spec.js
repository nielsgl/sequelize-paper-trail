/* eslint-disable no-unused-vars */
import SequelizeTrails from '../lib/index';

const db = require('./models/index.js');

const { sequelize } = db;

describe('import', () => {
	it('loads the library', () => {
		// console.log(helpers);
		expect(true).toEqual(true);
	});
});

describe('PaperTrails', () => {
	let User;
	let PaperTrails;

	beforeAll(async () => {
		PaperTrails = SequelizeTrails.init(sequelize, {
			enableMigration: true,
		});
		PaperTrails.defineModels();
		User = sequelize.model('User');
		User.Revisions = User.hasPaperTrail();
		User.refreshAttributes();

		await sequelize.sync({ force: true });
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

describe('PaperTrails with User Tracking', () => {
	let Revision;
	let Todo;
	let User;
	let PaperTrails;

	beforeAll(async () => {
		Revision = sequelize.model('Revision');
		Todo = sequelize.model('Todo');
		User = sequelize.model('User');
		PaperTrails = SequelizeTrails.init(sequelize, {
			enableMigration: true,
			userModel: 'User',
			// userModelAttribute: 'user_id',
		});
		PaperTrails.defineModels();
		Todo.Revisions = Todo.hasPaperTrail();
		Todo.refreshAttributes();

		await sequelize.sync({ force: true });
	});

	it('model is revisionable', () => {
		expect.assertions(1);

		expect(Todo.revisionable).toEqual(true);
	});

	describe('tracks the user that made the revision', () => {
		it('sets the user that made the change', async () => {
			const user = await User.create({ name: 'Dave' });
			const todo = await Todo.create({ title: 'My Todo' }, { userId: user.id });
			const revision = await Revision.findOne({
				where: {
					model: 'Todo',
					documentId: todo.get('id'),
					revision: todo.get('revision'),
					UserId: user.get('id'),
				}
			});

			expect(revision).not.toBeNull();
		})
	});
});




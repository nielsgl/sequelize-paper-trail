/* eslint-disable import/no-unresolved */
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: ':memory:',
	logging: false,
});

const PaperTrail = require('sequelize-paper-trail').init(sequelize, {
	enableRevisionChangeModel: true,
	continuationKey: 'userId',
});

PaperTrail.defineModels();

const User = sequelize.define('User', {
	name: DataTypes.STRING,
	role: DataTypes.STRING,
});

User.hasPaperTrail();

const run = async () => {
	await sequelize.sync({ force: true });

	const user = await User.create(
		{ name: 'Alice', role: 'admin' },
		{ userId: 'example-user' },
	);

	await user.update({ role: 'editor' }, { userId: 'example-user' });
	await user.destroy({ userId: 'example-user' });

	const { Revision, RevisionChange } = sequelize.models;
	const revisions = await Revision.findAll({ order: [['id', 'ASC']] });
	const changes = await RevisionChange.findAll({ order: [['id', 'ASC']] });

	console.log(
		'revisions:',
		revisions.map(r => r.get({ plain: true })),
	);
	console.log(
		'revision changes:',
		changes.map(c => c.get({ plain: true })),
	);

	await sequelize.close();
};

run().catch(error => {
	console.error(error);
	process.exitCode = 1;
});

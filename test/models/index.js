const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../../config/config.json`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config,
	);
}

// eslint-disable-next-line import/no-dynamic-require
const PaperTrail = require(`${__dirname}/../../lib/index.js`).init(sequelize);
PaperTrail.defineModels();

fs.readdirSync(__dirname)
	.filter(
		file =>
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js',
	)
	.forEach(file => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

fs.readdirSync(`${__dirname}/../migrations/`)
	.filter(
		file =>
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js',
	)
	.forEach(file => {
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const migration = require(path.join(
			`${__dirname}/../migrations/`,
			file,
		));
		migration.up(sequelize.getQueryInterface(), Sequelize);
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

// sequelize.sync({ force: true }).then(() => true);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
	.readdirSync(__dirname)
	.filter((file: string) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach((file: string) => {
		const model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

fs
	.readdirSync(__dirname + '/../migrations/')
	.filter((file: string) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach((file: string) => {
		let migration = require(path.join(__dirname + '/../migrations/', file));
		migration.up(sequelize.getQueryInterface(), Sequelize);
	});


Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

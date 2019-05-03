// const fs = require('fs');
// const path = require('path');
const Sequelize = require('sequelize');

// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.json`)[env];
// const db = {};

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

describe('Upgrade test', () => {
	it('should figure something out', () => {
		// console.log('sequelize.Model', sequelize.Model);
		expect(true).toBe(true);
	});
});

import SequelizeTrails from '../lib/index';

require('./helper');
// const SequelizeTrails = require('../lib/index');


const Sequelize = require('sequelize');

describe('SequelizeTrails', () => {
	it('returns string', () => {
		const sequelize = new Sequelize('', '', '', {
			dialect: 'sqlite',
			logging: console.log,
		});
		// const User = sequelize.define('User', {
		// 	name: Sequelize.STRING,
		// });
		console.log('sequelize', sequelize);
		console.log('SequelizeTrails', SequelizeTrails);
		// console.log('SequelizeTrails(sequelize)', SequelizeTrails(sequelize));
		// console.log('typeof(SequelizeTrails)', typeof(SequelizeTrails));
		// expect(typeof (SequelizeTrails(sequelize))).to.equal('object');
	});
});

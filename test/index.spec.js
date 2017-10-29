import SequelizeTrails from '../lib/index';
var Sequelize = require('sequelize');

describe('SequelizeTrails', () => {
  it('init returns object', () => {
    var sequelize = new Sequelize('','','',{
        dialect: 'sqlite',
        logging: console.log
    });
    var User = sequelize.define('User', {
        name: Sequelize.STRING
    });
    // console.log(sequelize);
    // console.log(SequelizeTrails);
    // console.log(SequelizeTrails(sequelize));
    // console.log(typeof(SequelizeTrails));
    expect(typeof(SequelizeTrails.init(sequelize))).to.equal('object');
   });
});

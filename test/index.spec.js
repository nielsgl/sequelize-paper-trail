import SequelizeTrails from 'index';
var Sequelize = require('sequelize');

describe('SequelizeTrails', () => {
  it('returns string', () => {
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
    expect(typeof(SequelizeTrails(sequelize))).to.equal('object');
   });
});

import SequelizeTrails from '../lib/index';

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('database_test', 'root', null, {dialect: 'sqlite', storage: 'test.db'});
const db = require('../models/index.js');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

let User;
let PaperTrails;

describe('PaperTrails', function () {

    it('initialize PaperTrails', function (done) {
        PaperTrails = SequelizeTrails.init(sequelize, {enableMigration: true} );
        PaperTrails.defineModels();
        User = sequelize.model('User');
        User.Revisions = User.hasPaperTrail();
        User.refreshAttributes();
        done();
    });
    it('model is revisionable', function () {
        expect(User.revisionable).to.equal(true);
    });
    it('revision increments', function (done) {
        User.findOrCreate({where: {name: 'Dave'}}).spread((user, created) => {
        // console.log(user.get({plain: true}));
            expect(created).to.equal(true);
            expect(user.get('revision')).to.equal(0);
            user.update({name:'David'}).then(() => {
                user.reload().then(() => {
                // console.log(user.get({plain: true}));
                    expect(user.get('revision')).to.equal(1);
                    done();
                }).catch(function (err) { done(err); });
            }).catch(function (err) { done(err); });
        }).catch(function (err) { done(err); });
    });

});

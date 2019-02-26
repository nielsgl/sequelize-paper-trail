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
        PaperTrails = SequelizeTrails.init(sequelize, {enableMigration: true, useVersioning: true} );
        PaperTrails.defineModels();
        User = sequelize.model('User');
        User.Revisions = User.hasPaperTrail();
        User.refreshAttributes();
        done();
    });

    describe.skip('#unversioned form', function (done) {
        it('model is revisionable', function () {
            expect(User.revisionable).to.equal(true);
        });
        it('model is not versionable', function () {
            expect(User.versionable).to.equal(false);
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
        it('version doesn\'t increment', function (done) {
            User.findOrCreate({where: {name: 'David'}}).spread((user, created) => {
            // console.log(user.get({plain: true}));
                expect(created).to.equal(false);
                expect(user.get('version')).to.equal(1);
                expect(user.get('revision')).to.equal(1);
                user.set('name', 'Billy');
                User.newVersion(user).then(() => {
                    user.reload().then(() => {
                        // console.log(user.get({plain: true}));
                        expect(user.get('version')).to.equal(1);
                        expect(user.get('revision')).to.equal(2);
                        user.update({name: 'William'}).then(() => {
                            user.reload().then(() => {
                            // console.log(user.get({plain: true}));
                                expect(user.get('name')).to.equal('William');
                                expect(user.get('version')).to.equal(1);
                                expect(user.get('revision')).to.equal(3);
                                done();
                            }).catch(function (err) { done(err); });
                        }).catch(function (err) { done(err); });
                    }).catch(function (err) { done(err); });
                }).catch(function (err) { done(err); });
            }).catch(function (err) { done(err); });
        });
    });
    describe('#versioned form', function (done) {
        it('model is revisionable', function () {
            expect(User.revisionable).to.equal(true);
        });
        it('model is versionable', function () {
            expect(User.versionable).to.equal(true);
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
        it('version increments independently from revision', function (done) {
            User.findOrCreate({where: {name: 'David'}}).spread((user, created) => {
            // console.log(user.get({plain: true}));
                expect(created).to.equal(false);
                expect(user.get('version')).to.equal(1);
                expect(user.get('revision')).to.equal(1);
                user.set('name', 'Billy');
                User.newVersion(user).then(() => {
                    user.reload().then(() => {
                    // console.log(user.get({plain: true}));
                        expect(user.get('version')).to.equal(2);
                        expect(user.get('revision')).to.equal(0);
                        user.update({name: 'William'}).then(() => {
                            user.reload().then(() => {
                            // console.log(user.get({plain: true}));
                                expect(user.get('name')).to.equal('William');
                                expect(user.get('version')).to.equal(2);
                                expect(user.get('revision')).to.equal(1);
                                done();
                            }).catch(function (err) { done(err); });
                        }).catch(function (err) { done(err); });
                    }).catch(function (err) { done(err); });
                }).catch(function (err) { done(err); });
            }).catch(function (err) { done(err); });
        });
    });
});

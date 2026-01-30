const createV5Adapter = require('../lib/adapters/sequelize-v5').default;
const createV6Adapter = require('../lib/adapters/sequelize-v6').default;
const { createSequelize } = require('./support/setup');

describe('sequelize adapter (v5)', () => {
	it('exposes the adapter surface needed by core', async () => {
		const sequelize = createSequelize();
		const adapter = createV5Adapter(sequelize);

		expect(adapter.types).toBeDefined();
		expect(typeof adapter.getNamespace).toEqual('function');
		expect(typeof adapter.getNamespaceValue).toEqual('function');
		expect(typeof adapter.getModelClass).toEqual('function');
		expect(typeof adapter.defineModel).toEqual('function');
		expect(typeof adapter.getModel).toEqual('function');
		expect(typeof adapter.getModels).toEqual('function');
		expect(typeof adapter.getQueryInterface).toEqual('function');
		expect(typeof adapter.describeTable).toEqual('function');
		expect(typeof adapter.addColumn).toEqual('function');
		expect(typeof adapter.addHook).toEqual('function');
		expect(typeof adapter.hasMany).toEqual('function');
		expect(typeof adapter.belongsTo).toEqual('function');
		expect(typeof adapter.refreshAttributes).toEqual('function');
		expect(typeof adapter.setRawAttribute).toEqual('function');
		expect(typeof adapter.setRevisionable).toEqual('function');
		expect(typeof adapter.getTableName).toEqual('function');

		await sequelize.close();
	});

	it('passes schema options when describing tables', () => {
		const adapter = createV5Adapter(createSequelize());
		const queryInterface = { describeTable: jest.fn() };
		const tableName = {
			tableName: 'Widgets',
			schema: 'audit',
			delimiter: '.',
		};

		adapter.describeTable(queryInterface, tableName);

		expect(queryInterface.describeTable).toHaveBeenCalledWith('Widgets', {
			schema: 'audit',
			schemaDelimiter: '.',
		});
	});
});

describe('sequelize adapter (v6)', () => {
	it('exposes the adapter surface needed by core', async () => {
		const Sequelize = require('sequelize-v6');
		const sequelize = new Sequelize('sqlite::memory:', { logging: false });
		const adapter = createV6Adapter(sequelize);

		expect(adapter.types).toBeDefined();
		expect(typeof adapter.getNamespace).toEqual('function');
		expect(typeof adapter.getNamespaceValue).toEqual('function');
		expect(typeof adapter.getModelClass).toEqual('function');
		expect(typeof adapter.defineModel).toEqual('function');
		expect(typeof adapter.getModel).toEqual('function');
		expect(typeof adapter.getModels).toEqual('function');
		expect(typeof adapter.getQueryInterface).toEqual('function');
		expect(typeof adapter.describeTable).toEqual('function');
		expect(typeof adapter.addColumn).toEqual('function');
		expect(typeof adapter.addHook).toEqual('function');
		expect(typeof adapter.hasMany).toEqual('function');
		expect(typeof adapter.belongsTo).toEqual('function');
		expect(typeof adapter.refreshAttributes).toEqual('function');
		expect(typeof adapter.setRawAttribute).toEqual('function');
		expect(typeof adapter.setRevisionable).toEqual('function');
		expect(typeof adapter.getTableName).toEqual('function');

		await sequelize.close();
	});

	it('passes schema options when describing tables', async () => {
		const Sequelize = require('sequelize-v6');
		const sequelize = new Sequelize('sqlite::memory:', { logging: false });
		const adapter = createV6Adapter(sequelize);
		const queryInterface = { describeTable: jest.fn() };
		const tableName = {
			tableName: 'Widgets',
			schema: 'audit',
			delimiter: '.',
		};

		adapter.describeTable(queryInterface, tableName);

		expect(queryInterface.describeTable).toHaveBeenCalledWith('Widgets', {
			schema: 'audit',
			schemaDelimiter: '.',
		});

		await sequelize.close();
	});

	it('uses cls-hooked when requesting a namespace', async () => {
		jest.resetModules();
		const getNamespace = jest.fn(() => null);
		const createNamespace = jest.fn(() => ({ get: jest.fn() }));

		jest.doMock('cls-hooked', () => ({
			getNamespace,
			createNamespace,
		}));

		const createAdapter = require('../lib/adapters/sequelize-v6').default;
		const Sequelize = require('sequelize-v6');
		const sequelize = new Sequelize('sqlite::memory:', { logging: false });
		const adapter = createAdapter(sequelize);

		adapter.getNamespace('paperTrail');

		expect(getNamespace).toHaveBeenCalledWith('paperTrail');
		expect(createNamespace).toHaveBeenCalledWith('paperTrail');

		await sequelize.close();
		jest.dontMock('cls-hooked');
	});
});

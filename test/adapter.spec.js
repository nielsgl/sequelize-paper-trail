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
		const sequelizeOptions = {
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		};
		const sequelize = new Sequelize(sequelizeOptions);
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
		const sequelizeOptions = {
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		};
		const sequelize = new Sequelize(sequelizeOptions);
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
		const sequelizeOptions = {
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		};
		const sequelize = new Sequelize(sequelizeOptions);
		const adapter = createAdapter(sequelize);

		adapter.getNamespace('paperTrail');

		expect(getNamespace).toHaveBeenCalledWith('paperTrail');
		expect(createNamespace).toHaveBeenCalledWith('paperTrail');

		await sequelize.close();
		jest.dontMock('cls-hooked');
	});
});

describe('adapter selection helper', () => {
	const { _resolveSequelizeMajor } = require('../lib/index');
	let originalEnv;

	beforeAll(() => {
		originalEnv = process.env.SEQUELIZE_ADAPTER;
	});

	afterEach(() => {
		if (originalEnv === undefined) {
			delete process.env.SEQUELIZE_ADAPTER;
		} else {
			process.env.SEQUELIZE_ADAPTER = originalEnv;
		}
	});

	it('returns major from the Sequelize version string', () => {
		expect(
			_resolveSequelizeMajor({
				Sequelize: { version: '6.12.0' },
			}),
		).toEqual(6);
	});

	it('falls back to constructor version when necessary', () => {
		expect(
			_resolveSequelizeMajor({
				constructor: { version: '5.20.0' },
			}),
		).toEqual(5);
	});

	it('supports forced adapter selection via env', () => {
		process.env.SEQUELIZE_ADAPTER = 'v6';
		expect(_resolveSequelizeMajor({})).toEqual(6);
		process.env.SEQUELIZE_ADAPTER = 'v5';
		expect(_resolveSequelizeMajor({})).toEqual(5);
	});

	it('returns null for malformed versions', () => {
		expect(
			_resolveSequelizeMajor({
				Sequelize: { version: 'foo' },
			}),
		).toBeNull();
	});
});

describe('cls-hooked error handling', () => {
	it('throws when cls-hooked is missing in v6', async () => {
		await jest.isolateModules(async () => {
			jest.resetModules();
			jest.doMock('cls-hooked', () => {
				throw new Error('module not found');
			});

			const createAdapter =
				require('../lib/adapters/sequelize-v6').default;
			const Sequelize = require('sequelize-v6');
			const sequelizeOptions = {
				dialect: 'sqlite',
				storage: ':memory:',
				logging: false,
			};
			const sequelize = new Sequelize(sequelizeOptions);
			const adapter = createAdapter(sequelize);

			expect(() => adapter.getNamespace('paperTrail')).toThrow(
				/cls-hooked is required/,
			);

			await sequelize.close();

			jest.dontMock('cls-hooked');
		});
	});
});

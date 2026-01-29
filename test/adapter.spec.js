const createAdapter = require('../lib/adapters/sequelize-v5').default;
const { createSequelize } = require('./support/setup');

describe('sequelize adapter (v5)', () => {
	it('exposes the adapter surface needed by core', async () => {
		const sequelize = createSequelize();
		const adapter = createAdapter(sequelize);

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
});

import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';
import getClsHooked from './cls-hooked';

const getNamespaceProvider = () =>
	process.env.SEQUELIZE_CLS === 'cls-hooked' ? getClsHooked() : cls;

const createSequelizeV5Adapter = sequelize => ({
	// TODO(v6): swap continuation-local-storage for CLS adapter or ALS wrapper.
	types: Sequelize,
	getNamespace: name => {
		const provider = getNamespaceProvider();
		let ns = provider.getNamespace(name);
		if (!ns) {
			ns = provider.createNamespace(name);
		}
		return ns;
	},
	getNamespaceValue: (ns, key) => (ns ? ns.get(key) : undefined),
	// TODO(v6): Sequelize may change Model export/shape; keep behind adapter.
	getModelClass: () => Sequelize.Model,
	defineModel: (name, attributes, options) =>
		sequelize.define(name, attributes, options),
	// TODO(v6): model lookup changes (e.g., modelManager) belong here.
	getModel: name => sequelize.model(name),
	getModels: () => sequelize.models,
	getQueryInterface: () => sequelize.getQueryInterface(),
	describeTable: (queryInterface, tableName) => {
		if (tableName && typeof tableName === 'object') {
			return queryInterface.describeTable(tableName.tableName, {
				schema: tableName.schema,
				schemaDelimiter: tableName.delimiter,
			});
		}
		return queryInterface.describeTable(tableName);
	},
	addColumn: (queryInterface, tableName, columnName, attributes) =>
		queryInterface.addColumn(tableName, columnName, attributes),
	// TODO(v6): hook signature changes are handled here.
	addHook: (model, hookName, hook) => model.addHook(hookName, hook),
	hasMany: (model, target, options) => model.hasMany(target, options),
	belongsTo: (model, target, options) => model.belongsTo(target, options),
	refreshAttributes: model => model.refreshAttributes(),
	setRawAttribute: (model, name, attributes) => {
		model.rawAttributes[name] = attributes;
	},
	setRevisionable: (model, value) => {
		model.revisionable = value;
	},
	// TODO(v6): metadata access may change; isolate here.
	getTableName: model => model.getTableName(),
});

export default createSequelizeV5Adapter;

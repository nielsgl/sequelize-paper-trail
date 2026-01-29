import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';

const createSequelizeV5Adapter = sequelize => ({
	types: Sequelize,
	getNamespace: name => {
		let ns = cls.getNamespace(name);
		if (!ns) {
			ns = cls.createNamespace(name);
		}
		return ns;
	},
	getNamespaceValue: (ns, key) => (ns ? ns.get(key) : undefined),
	getModelClass: () => Sequelize.Model,
	defineModel: (name, attributes, options) =>
		sequelize.define(name, attributes, options),
	getModel: name => sequelize.model(name),
	getModels: () => sequelize.models,
	getQueryInterface: () => sequelize.getQueryInterface(),
	describeTable: (queryInterface, tableName) =>
		queryInterface.describeTable(tableName),
	addColumn: (queryInterface, tableName, columnName, attributes) =>
		queryInterface.addColumn(tableName, columnName, attributes),
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
	getTableName: model => model.getTableName(),
});

export default createSequelizeV5Adapter;

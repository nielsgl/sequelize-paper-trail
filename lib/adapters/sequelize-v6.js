const getClsHooked = require('./cls-hooked');

const createSequelizeV6Adapter = sequelize => {
	const Sequelize = sequelize.Sequelize || sequelize.constructor;

	return {
		types: Sequelize,
		getNamespace: name => {
			const cls = getClsHooked();
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
	};
};

module.exports = createSequelizeV6Adapter;
module.exports.default = createSequelizeV6Adapter;

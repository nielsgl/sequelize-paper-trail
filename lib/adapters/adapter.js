/**
 * @typedef {Object} PaperTrailAdapter
 * @property {Object} types
 * @property {(name: string) => any} getNamespace
 * @property {(ns: any, key: string) => any} getNamespaceValue
 * @property {() => any} getModelClass
 * @property {(name: string, attributes: Object, options: Object) => any} defineModel
 * @property {(name: string) => any} getModel
 * @property {() => Object} getModels
 * @property {() => any} getQueryInterface
 * @property {(queryInterface: any, tableName: string) => Promise<Object>} describeTable
 * @property {(queryInterface: any, tableName: string, columnName: string, attributes: Object) => Promise<any>} addColumn
 * @property {(model: any, hookName: string, hook: Function) => void} addHook
 * @property {(model: any, target: any, options: Object) => any} hasMany
 * @property {(model: any, target: any, options?: Object) => any} belongsTo
 * @property {(model: any) => void} refreshAttributes
 * @property {(model: any, name: string, attributes: Object) => void} setRawAttribute
 * @property {(model: any, value: boolean) => void} setRevisionable
 * @property {(model: any) => string|Object} getTableName
 */

// Interface only; implementations are adapter-specific.
export default {};

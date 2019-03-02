'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

const _typeof =
	typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ?
		function (obj: Object): String { return typeof obj; } :
		function (obj: Object): String {
			return obj && typeof Symbol === 'function' && obj.constructor === Symbol ? 'symbol' : typeof obj;
		};

// const Sequelize = require('sequelize');
const diff = require('deep-diff').diff;
// const jsdiff = require('diff');
const _ = require('lodash');

exports.default = {
	calcDelta: function calcDelta(current: Object, next: Object, exclude: Object, strict: Boolean): Object {
		const DEBUG = false;
		if (DEBUG) {
			console.log('current', current);
			console.log('next', next);
			console.log('exclude', exclude);
		}

		let di = diff(current, next);

		if (DEBUG) {
			console.log('di', di);

			let diffs2 = di ? di.map(function (i: Object): Object {
				let str = JSON.stringify(i).replace('"__data",', '');
				return JSON.parse(str);
			}) : [];
			console.log('diffs2', diffs2);

			console.log('filter1', diffs2.filter(function (i: Object): Boolean {
				return i.path.join(',').indexOf('_') === -1;
			}));

			console.log('filter2', diffs2.filter(function (i: Object): Object {
				return exclude.every(function (x: Object): Boolean {
					return i.path.indexOf(x) === -1;
				});
			}));
		}

		let diffs = di ? di.map(function (i: Object): Object {
			let str = JSON.stringify(i).replace('"__data",', '');
			return JSON.parse(str);
		}).filter(function (i: Object): Object {
			// return i.path.join(",").indexOf("_") === -1;
			// console.log('i', i)
			if (!strict && i.kind === 'E') {
				// console.log('str & num', i.lhs == i.rhs)
				// console.log('str & num (strict)', i.lhs === i.rhs)
				if (i.lhs != i.rhs) {
					return i;
				}
			} else {
				return i;
			}
		}).filter(function (i: Object): Array {
			// console.log('i', i);
			return exclude.every(function (x: Integer): Boolean {
				return i.path.indexOf(x) === -1;
			});
		}) : [];
		if (diffs.length > 0) {
			return diffs;
		} else {
			return null;
		}
	},
	capitalizeFirstLetter(string: String): String {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	diffToString: function diffToString(val: Object): String {
		if (typeof val === 'undefined' || val === null) {
			return '';
		} else if (val === true) {
			return '1';
		} else if (val === false) {
			return '0';
		} else if (typeof val === 'string') {
			return val;
		} else if (!isNaN(val)) {
			return String(val) + '';
		} else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
			return JSON.stringify(val) + '';
		} else if (Array.isArray(val)) {
			return JSON.stringify(val) + '';
		}
		return '';
	},
	toUnderscored: function toUnderscored(obj: Object): Object {
		_.forEach(obj, function (k: String, v: Object): undefined {
			obj[k] = v.replace(/(?:^|\.?)([A-Z])/g, function (x: String, y: String): String {
				return '_' + y.toLowerCase();
			}).replace(/^_/, '');
		});
		return obj;
	}
};
module.exports = exports.default;

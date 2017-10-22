

Object.defineProperty(exports, '__esModule', {
	value: true,
});

const my_typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol ? 'symbol' : typeof obj; };

const Sequelize = require('sequelize');
const diff = require('deep-diff').diff;
const jsdiff = require('diff');
const _ = require('lodash');

exports.default = {
	test: function test() {
		return true;
	},
	calcDelta: function calcDelta(current, next, exclude, strict) {
		const DEBUG = false;
		if (DEBUG) {
			console.log('current', current);
			console.log('next', next);
			console.log('exclude', exclude);
		}

		const di = diff(current, next);

		if (DEBUG) {
			console.log('di', di);

			const diffs2 = di ? di.map((i) => {
				const str = JSON.stringify(i).replace('"__data",', '');
				return JSON.parse(str);
			}) : [];
			console.log('diffs2', diffs2);

			console.log('filter1', diffs2.filter(i => i.path.join(',').indexOf('_') === -1));

			console.log('filter2', diffs2.filter(i => exclude.every(x => i.path.indexOf(x) === -1)));
		}

		const diffs = di ? di.map((i) => {
			const str = JSON.stringify(i).replace('"__data",', '');
			return JSON.parse(str);
		}).filter((i) => {
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
		}).filter(i =>
			// console.log('i', i);
			 exclude.every(x => i.path.indexOf(x) === -1)) : [];
		if (diffs.length > 0) {
			return diffs;
		}
		return null;
	},
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	diffToString: function diffToString(val) {
		if (typeof val === 'undefined' || val === null) {
			return '';
		} else if (val === true) {
			return '1';
		} else if (val === false) {
			return '0';
		} else if (typeof val === 'string') {
			return val;
		} else if (!isNaN(val)) {
			return `${String(val)}`;
		} else if ((typeof val === 'undefined' ? 'undefined' : my_typeof(val)) === 'object') {
			return `${JSON.stringify(val)}`;
		} else if (Array.isArray(val)) {
			return `${JSON.stringify(val)}`;
		}
		return '';
	},
	toUnderscored: function toUnderscored(obj) {
		_.forEach(obj, (k, v) => {
			obj[k] = v.replace(/(?:^|\.?)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
		});
		return obj;
	},
};
module.exports = exports.default;

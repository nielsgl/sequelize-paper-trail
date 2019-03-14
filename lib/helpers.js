// const _typeof =
// 	typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
// 		? function (obj) {
// 			return typeof obj;
// 		  }
// 		: function (obj) {
// 			return obj &&
// 					typeof Symbol === 'function' &&
// 					obj.constructor === Symbol
// 				? 'symbol'
// 				: typeof obj;
// 		  };

const { diff } = require('deep-diff');
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

			const diffs2 = di
				? di.map(i =>
					JSON.parse(JSON.stringify(i).replace('"__data",', '')),
				  )
				: [];
			console.log('diffs2', diffs2);

			console.log(
				'filter1',
				diffs2.filter(i => i.path.join(',').indexOf('_') === -1),
			);

			console.log(
				'filter2',
				diffs2.filter(i =>
					exclude.every(x => i.path.indexOf(x) === -1),
				),
			);
		}

		const diffs = di
			? di
				.map(i =>
					JSON.parse(JSON.stringify(i).replace('"__data",', '')),
				)
				.filter(i => {
					if (!strict && i.kind === 'E') {
						if (i.lhs !== i.rhs) return i;
					} else return i;
					return false;
				})
				.filter(i => exclude.every(x => i.path.indexOf(x) === -1))
			: [];
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
		}
		if (val === true) {
			return '1';
		}
		if (val === false) {
			return '0';
		}
		if (typeof val === 'string') {
			return val;
		}
		if (!isNaN(val)) {
			return `${String(val)}`;
		}
		if (
			(typeof val === 'undefined' ? 'undefined' : typeof val) === 'object'
		) {
			return `${JSON.stringify(val)}`;
		}
		if (Array.isArray(val)) {
			return `${JSON.stringify(val)}`;
		}
		return '';
	},
	toUnderscored: function toUnderscored(obj) {
		_.forEach(obj, (k, v) => {
			obj[k] = v
				.replace(/(?:^|\.?)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`)
				.replace(/^_/, '');
		});
		return obj;
	},
};
module.exports = exports.default;

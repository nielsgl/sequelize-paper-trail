import { diff } from 'deep-diff';
import _ from 'lodash';

const capitalizeFirstLetter = string =>
	string.charAt(0).toUpperCase() + string.slice(1);

const toUnderscored = obj => {
	_.forEach(obj, (k, v) => {
		obj[k] = v
			.replace(/(?:^|\.?)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`)
			.replace(/^_/, '');
	});
	return obj;
};

const calcDelta = (current, next, exclude, strict) => {
	const DEBUG = false;
	if (DEBUG) {
		console.log('current', current);
		console.log('next', next);
		console.log('exclude', exclude);
	}

	const di = diff(current, next);

	if (DEBUG) {
		console.log('di', di);

		let diffs2 = [];
		if (di) {
			diffs2 = di.map(i =>
				JSON.parse(JSON.stringify(i).replace('"__data",', '')),
			);
		}

		console.log('diffs2', diffs2);

		console.log(
			'filter1',
			diffs2.filter(i => i.path.join(',').indexOf('_') === -1),
		);

		console.log(
			'filter2',
			diffs2.filter(i => exclude.every(x => i.path.indexOf(x) === -1)),
		);
	}

	let diffs = [];
	if (di) {
		diffs = di
			.map(i => JSON.parse(JSON.stringify(i).replace('"__data",', '')))
			.filter(i => {
				// return i.path.join(",").indexOf("_") === -1;
				// console.log('i', i)
				// if (!strict && i.kind === 'E') {
				// 	// console.log('str & num', i.lhs == i.rhs)
				// 	// console.log('str & num (strict)', i.lhs === i.rhs)
				// 	if (i.lhs != i.rhs) {
				// 		return i;
				// 	}
				// } else {
				// 	return i;
				// }
				if (!strict && i.kind === 'E') {
					// eslint-disable-next-line eqeqeq
					if (i.lhs != i.rhs) return i;
				} else return i;
				return false;
			})
			.filter(i => exclude.every(x => i.path.indexOf(x) === -1));
	}

	if (diffs.length > 0) {
		return diffs;
	}
	return null;
};

const diffToString = val => {
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
	if (!Number.isNaN(Number(val))) {
		return `${String(val)}`;
	}
	if ((typeof val === 'undefined' ? 'undefined' : typeof val) === 'object') {
		return `${JSON.stringify(val)}`;
	}
	if (Array.isArray(val)) {
		return `${JSON.stringify(val)}`;
	}
	return '';
};

export default {
	capitalizeFirstLetter,
	toUnderscored,
	calcDelta,
	diffToString,
};

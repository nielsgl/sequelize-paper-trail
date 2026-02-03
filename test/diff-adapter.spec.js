const diffObjects = require('../lib/adapters/diff').default ||
	require('../lib/adapters/diff');

const pickShape = diffEntry => ({
	kind: diffEntry.kind,
	path: diffEntry.path,
	lhs: diffEntry.lhs,
	rhs: diffEntry.rhs,
	itemKind: diffEntry.item && diffEntry.item.kind,
});

describe('diff adapter', () => {
	it('returns null when there are no differences', () => {
		expect(diffObjects({ a: 1 }, { a: 1 })).toBeNull();
	});

	it('captures simple scalar changes', () => {
		const diffs = diffObjects({ a: 1 }, { a: 2 });
		expect(diffs).toHaveLength(1);
		expect(pickShape(diffs[0])).toEqual({
			kind: 'E',
			path: ['a'],
			lhs: 1,
			rhs: 2,
			itemKind: undefined,
		});
	});

	it('captures nested object changes with path', () => {
		const diffs = diffObjects({ a: { b: 'x' } }, { a: { b: 'y' } });
		expect(diffs).toHaveLength(1);
		expect(diffs[0].path).toEqual(['a', 'b']);
	});

	it('captures array changes with item entries', () => {
		const diffs = diffObjects({ list: [1, 2] }, { list: [1, 2, 3] });
		const arrayDiff = diffs.find(entry => entry.kind === 'A');
		expect(arrayDiff).toBeDefined();
		expect(arrayDiff.path).toEqual(['list']);
		expect(arrayDiff.item).toBeDefined();
	});
});

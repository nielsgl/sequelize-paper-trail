const { createSequelize } = require('./support/setup');

const setProcessVersions = (value, fn) => {
	const original = process.versions;
	Object.defineProperty(process, 'versions', {
		value,
		configurable: true,
	});
	try {
		fn();
	} finally {
		Object.defineProperty(process, 'versions', {
			value: original,
			configurable: true,
		});
	}
};

const setNodeVersion = (version, fn) =>
	setProcessVersions({ ...process.versions, node: version }, fn);

const getInitError = (init, sequelize) => {
	try {
		init(sequelize, {});
	} catch (error) {
		return error;
	}
	throw new Error('Expected init() to throw');
};

describe('node version enforcement', () => {
	let originalEnv;

	beforeEach(() => {
		originalEnv = process.env.SUPPRESS_NODE_DEPRECATION;
		delete process.env.SUPPRESS_NODE_DEPRECATION;
		jest.resetModules();
	});

	afterEach(() => {
		if (originalEnv === undefined) {
			delete process.env.SUPPRESS_NODE_DEPRECATION;
		} else {
			process.env.SUPPRESS_NODE_DEPRECATION = originalEnv;
		}
		jest.resetModules();
	});

	it('throws when Node is below the minimum', () => {
		setNodeVersion('18.19.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				expect(() => init(sequelize, {})).toThrow(
					'Unsupported Node runtime',
				);
				expect(() => init(sequelize, {})).toThrow(
					'Node >=20 is required.',
				);
				expect(getInitError(init, sequelize).code).toBe(
					'ERR_UNSUPPORTED_NODE_VERSION',
				);
				return sequelize.close();
			});
		});
	});

	it('does not throw when Node meets the minimum', () => {
		setNodeVersion('22.22.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				expect(() => init(sequelize, {})).not.toThrow();
				return sequelize.close();
			});
		});
	});

	it('throws when Node version is unavailable', () => {
		setProcessVersions({}, () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				expect(() => init(sequelize, {})).toThrow(
					'Unsupported Node runtime "unknown"',
				);
				expect(getInitError(init, sequelize).code).toBe(
					'ERR_UNSUPPORTED_NODE_VERSION',
				);
				return sequelize.close();
			});
		});
	});

	it('throws when Node version is malformed', () => {
		setProcessVersions({ node: 'not-a-version' }, () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				expect(() => init(sequelize, {})).toThrow(
					'Unsupported Node runtime "not-a-version"',
				);
				expect(getInitError(init, sequelize).code).toBe(
					'ERR_UNSUPPORTED_NODE_VERSION',
				);
				return sequelize.close();
			});
		});
	});

	it('does not bypass enforcement when SUPPRESS_NODE_DEPRECATION=1', () => {
		process.env.SUPPRESS_NODE_DEPRECATION = '1';
		setNodeVersion('18.19.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				expect(() => init(sequelize, {})).toThrow(
					'Unsupported Node runtime',
				);
				expect(getInitError(init, sequelize).code).toBe(
					'ERR_UNSUPPORTED_NODE_VERSION',
				);
				return sequelize.close();
			});
		});
	});
});

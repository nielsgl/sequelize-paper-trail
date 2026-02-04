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

describe('node version deprecation warning', () => {
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

	it('warns once when Node is below the minimum', () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		setNodeVersion('18.19.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				init(sequelize, {});
				init(sequelize, {});
				return sequelize.close();
			});
		});

		expect(warnSpy).toHaveBeenCalledTimes(1);
		warnSpy.mockRestore();
	});

	it('does not warn when Node meets the minimum', () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		setNodeVersion('22.22.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				init(sequelize, {});
				return sequelize.close();
			});
		});

		expect(warnSpy).not.toHaveBeenCalled();
		warnSpy.mockRestore();
	});

	it('does not warn when Node version is unavailable', () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		setProcessVersions({}, () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				init(sequelize, {});
				return sequelize.close();
			});
		});

		expect(warnSpy).not.toHaveBeenCalled();
		warnSpy.mockRestore();
	});

	it('does not warn when Node version is malformed', () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		setProcessVersions({ node: 'not-a-version' }, () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				init(sequelize, {});
				return sequelize.close();
			});
		});

		expect(warnSpy).not.toHaveBeenCalled();
		warnSpy.mockRestore();
	});

	it('does not warn when suppressed via env', () => {
		process.env.SUPPRESS_NODE_DEPRECATION = '1';
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		setNodeVersion('18.19.0', () => {
			jest.isolateModules(() => {
				const { init } = require('../lib/index');
				const sequelize = createSequelize();
				init(sequelize, {});
				return sequelize.close();
			});
		});

		expect(warnSpy).not.toHaveBeenCalled();
		warnSpy.mockRestore();
	});
});

module.exports = {
	rootDir: __dirname,
	roots: ['<rootDir>/../_shared/test'],
	setupFilesAfterEnv: ['<rootDir>/../_shared/test/setupTests.js'],
	moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
	testEnvironment: 'node',
};

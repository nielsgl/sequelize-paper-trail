const packageName = process.env.SEQUELIZE_PACKAGE || 'sequelize';
const forceClsHooked = process.env.SEQUELIZE_CLS === 'cls-hooked';
const useClsHooked = forceClsHooked || packageName === 'sequelize-v6';

module.exports = require(
	useClsHooked ? 'cls-hooked' : 'continuation-local-storage',
);

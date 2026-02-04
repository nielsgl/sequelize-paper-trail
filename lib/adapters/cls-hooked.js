let clsHooked = null;

const getClsHooked = () => {
	if (clsHooked) {
		return clsHooked;
	}
	try {
		/* eslint-disable-next-line global-require */
		clsHooked = require('cls-hooked');
		return clsHooked;
	} catch (err) {
		const error = new Error(
			'cls-hooked is required when using continuationNamespace with Sequelize v6. Install cls-hooked.',
		);
		error.cause = err;
		throw error;
	}
};

module.exports = getClsHooked;
module.exports.default = getClsHooked;

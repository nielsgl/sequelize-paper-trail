'use strict';

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		name: DataTypes.STRING
	}, {});
	User.associate = function (models) {
		// associations can be defined here
	};
	return User;
};

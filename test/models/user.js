module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', { name: DataTypes.STRING });

	// eslint-disable-next-line no-unused-vars
	User.associate = models => {
		// associations can be defined here
	};

	return User;
};

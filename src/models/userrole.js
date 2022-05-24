const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class UserRole extends Model {}
	UserRole.init({}, {
		sequelize,
		modelName: 'UserRole',
		tableName: 'user_roles',
	})
	return UserRole
}

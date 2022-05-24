const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class UserRole extends Model {}
	UserRole.init({}, {
		sequelize,
		modelName: 'UserRole',
		tableName: 'userRoles',
	})
	return UserRole
}

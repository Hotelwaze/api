const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class RolePermission extends Model {}
	RolePermission.init({}, {
		sequelize,
		modelName: 'RolePermission',
		tableName: 'role_permissions',
	})
	return RolePermission
}

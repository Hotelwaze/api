const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		static associate(models) {
			this.belongsToMany(models.User, {
				through: 'useRoles',
			})
			this.belongsToMany(models.Permission, {
				through: 'rolePermissions',
			})
		}
	}
	Role.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Role',
	})
	return Role
}

const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Permission extends Model {
		static associate(models) {
			this.belongsToMany(models.Role, {
				through: 'role_permissions',
			})
		}
	}
	Permission.init({
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
		modelName: 'Permission',
	})
	return Permission
}

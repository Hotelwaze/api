const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			this.belongsTo(models.Partner, {
				foreignKey: 'partnerId',
				as: 'account',
			})
			this.belongsToMany(models.Role, {
				through: 'userRoles',
			})
			this.hasOne(models.RefreshToken, {
				foreignKey: 'UserId',
				targetKey: 'id',
				constraints: false,
			})
		}
	}
	User.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
		},
		lastName: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			isEmail: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mobile: {
			type: DataTypes.STRING,
		},
		PartnerId: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
		status: {
			type: DataTypes.ENUM([
				'pending',
				'blocked',
				'active'
			]),
		},
		resetPasswordToken: {
			type: DataTypes.STRING,
		},
		resetPasswordExpires: {
			type: DataTypes.DATE,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
		deletedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'User',
		paranoid: true
	})
	return User
}

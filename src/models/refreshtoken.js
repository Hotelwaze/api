import { v4 as uuid } from 'uuid'
import authConfig from '../config/auth.config'

const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class RefreshToken extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: 'UserId',
				targetKey: 'id',
				constraints: false,
			})
		}
	}

	RefreshToken.init({
		token: {
			type: DataTypes.STRING,
		},
		expiryDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		UserId: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
	}, {
		sequelize,
		modelName: 'RefreshToken',
	})

	RefreshToken.createToken = async (user, transaction) => {
		const expiredAt = new Date()
		expiredAt.setSeconds(Number(expiredAt.getSeconds() + authConfig.jwtRefreshExpiration))
		const token = uuid()

		try {
			const refreshToken = await RefreshToken.create({
				token,
				UserId: user.id,
				expiryDate: expiredAt.getTime(),
			}, transaction)
			return refreshToken.token
		} catch (error) {
			return error
		}
	}

	RefreshToken.verifyExpiration = (token) => new Date(token.expiryDate).getTime() < new Date().getTime()

	return RefreshToken
}

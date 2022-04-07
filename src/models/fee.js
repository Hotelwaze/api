import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
	class Fee extends Model {
	}
	Fee.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		value: {
			type: DataTypes.STRING,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Fee',
	})
	return Fee
}

import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
	class CarMake extends Model {
		static associate(models) {
		}
	}
	CarMake.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'CarMake',
	})
	return CarMake
}

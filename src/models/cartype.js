const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class CarType extends Model {
		static associate(models) {
		}
	}
	CarType.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
		},
		passengers: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '2',
		},
		doors: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '2',
		},
		bags: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
		},
		pricePerDay: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'CarType',
	})
	return CarType
}

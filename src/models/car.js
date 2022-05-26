const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Car extends Model {
		static associate(models) {
			this.belongsTo(models.Partner, {
				foreignKey: 'PartnerId',
				as: 'partner',
			})
			this.belongsTo(models.CarModel, {
				foreignKey: 'CarModelId',
				as: 'model',
			})
			this.belongsToMany(models.Booking, {
				through: 'car_booking',
				as: 'bookings',
			})
		}
	}
	Car.init({
		plateNumber: {
			type: DataTypes.STRING(25),
			allowNull: false,
		},
		year: {
			type: DataTypes.STRING,
		},
		transmission: {
			type: DataTypes.ENUM([
				'MT',
				'AT'
			]),
			allowNull: false,
		},
		driver: {
			type: DataTypes.ENUM([
				'required',
				'optional'
			]),
		},
		PartnerId: {
			type: DataTypes.INTEGER,
		},
		CarModelId: {
			type: DataTypes.INTEGER,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Car',
	})
	return Car
}

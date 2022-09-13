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
			type: DataTypes.STRING(2),
			allowNull: false,
			defaultValue: 'MT'
		},
		driver: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'optional'
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
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'Car',
	})
	return Car
}

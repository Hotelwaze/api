const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class CarBooking extends Model {
		static associate(models) {
			this.hasMany(models.Place, {
				foreignKey: 'placeableId',
				constraints: false,
				as: 'places',
				scope: {
					placeableType: 'carBooking',
				},
			})
		}us
	}
	CarBooking.init({
		carId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		bookingId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		sequelize,
		modelName: 'CarBooking',
		tableName: 'car_booking',
	})
	return CarBooking
}

const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: 'UserId',
				as: 'customer'
			});
			this.belongsToMany(models.Car, {
				through: 'car_booking',
				as: 'cars',
			});
			this.hasMany(models.Place, {
				foreignKey: 'placeableId',
				constraints: false,
				as: 'places',
				scope: {
					placeableType: 'booking',
				},
			})
		}
	}
	Booking.init({
		ref: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		totalPrice: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		notes: {
			type: DataTypes.TEXT,
		},
		paymentIntentId: {
			type: DataTypes.STRING,
		},
		phone: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.ENUM([
				'pending',
				'booked',
				'active',
				'done',
				'cancelled'
			])
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		withDriver:{
			type: DataTypes.BOOLEAN,
		},
		PartnerId:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Booking',
	})
	return Booking
}

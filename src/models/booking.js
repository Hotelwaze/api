const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		static associate(models) {
			this.belongsTo(models.User, {
				foreignKey: 'UserId',
			})
			this.belongsToMany(models.Role, {
				through: 'booking_item',
				as: 'booking'
			})
		}
	}
	Booking.init({
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
		createdAt: {
			type: 'TIMESTAMP',
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

const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class UserRole extends Model {
		static associate(models) {}
	}
	UserRole.init({}, {
		sequelize,
		modelName: 'BookingItems',
		tableName: 'booking_item'
	})
	return UserRole
}

import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
	class Invoice extends Model {
		static associate(models) {
			this.hasMany(models.InvoiceItem, {
				foreignKey: 'InvoiceId',
				as: 'items',
			})
			this.belongsTo(models.Booking, {
				foreignKey: 'BookingId',
				as: 'booking'
			})
		}
	}
	Invoice.init({
		number: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.ENUM('open', 'paid')
		},
		ref: {
			type: DataTypes.STRING,
		},
		currency: {
			type: DataTypes.STRING(3),
		},
		BookingId: {
			type: DataTypes.INTEGER.UNSIGNED,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Invoice',
	})
	return Invoice
}

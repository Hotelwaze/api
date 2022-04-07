import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
	class InvoiceItem extends Model {
		static associate(models) {
			this.belongsTo(models.Invoice, {
				foreignKey: 'InvoiceId',
				as: 'invoice',
			})
		}
	}
	InvoiceItem.init({

		amount: {
			type: DataTypes.INTEGER,
		},
		currency: {
			type: DataTypes.STRING(3),
		},
		description: {
			type: DataTypes.STRING,
		},
		startDate: {
			type: 'TIMESTAMP',
		},
		endDate: {
			type: 'TIMESTAMP',
		},
		InvoiceId: {
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
		modelName: 'InvoiceItem',
	})
	return InvoiceItem
}

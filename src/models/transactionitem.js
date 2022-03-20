const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class TransactionItem extends Model {
		static associate(models) {
			this.belongsToMany(models.Role, {
				through: 'booking_item',
				as: 'items'
			})
		}
	}
	TransactionItem.init({
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		type: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		notes: {
			type: DataTypes.STRING,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'TransactionItem',
	})
	return TransactionItem
}

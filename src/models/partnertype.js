const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class PartnerType extends Model {
		static associate(models) {
		}
	}
	PartnerType.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'PartnerType',
	})
	return PartnerType
}

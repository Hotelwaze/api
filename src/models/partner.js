const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Partner extends Model {
		static associate(models) {
			this.belongsTo(models.PartnerType, {
				as: 'partnerType',
			})
			this.hasMany(models.Address, {
				foreignKey: 'addressableId',
				constraints: false,
				as: 'addresses',
				scope: {
					addressableType: 'partner',
				},
			})
			this.hasMany(models.Place, {
				foreignKey: 'placeableId',
				constraints: false,
				as: 'places',
				scope: {
					placeableType: 'partner',
				},
			})
			this.hasMany(models.Car, {
				as: 'cars',
			})
		}
	}
	Partner.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		registeredName: {
			type: DataTypes.STRING,
		},
		tradeNumber: {
			type: DataTypes.STRING,
		},
		taxNumber: {
			type: DataTypes.STRING,
		},
		PartnerTypeId: {
			type: DataTypes.INTEGER,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM([
				'active',
				'pending',
				'cancelled',
				'suspended'
			]),
			allowNull: false,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
		deletedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Partner',
		paranoid: true
	})
	return Partner
}

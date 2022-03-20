const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`

	class Address extends Model {
		static associate(models) {
			this.belongsTo(models.Partner, {
				foreignKey: 'addressableId',
				constraints: false,
			})
		}

		getAddressable(options) {
			if (!this.addressableType) return Promise.resolve(null)
			const mixinMethodName = `get${uppercaseFirst(this.addressableType)}`
			return this[mixinMethodName](options)
		}
	}
	Address.init({
		address1: {
			type: DataTypes.STRING,
		},
		address2: {
			type: DataTypes.STRING,
		},
		country: {
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
		},
		zip: {
			type: DataTypes.STRING,
		},
		addressableId: DataTypes.INTEGER,
		addressableType: DataTypes.STRING,
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Address',
	})
	return Address
}

const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`

	class Place extends Model {
		static associate(models) {
			this.belongsTo(models.Partner, {
				foreignKey: 'placeableId',
				as: 'partner',
				constraints: false,
			})
		}

		getPlaceable(options) {
			if (!this.placeableType) return Promise.resolve(null)
			const mixinMethodName = `get${uppercaseFirst(this.placeableType)}`
			return this[mixinMethodName](options)
		}
	}
	Place.init({
		description: {
			type: DataTypes.STRING,
		},
		placeId: {
			type: DataTypes.STRING,
		},
		coordinates: {
			type: DataTypes.GEOMETRY('POINT'),
		},
		placeableId: DataTypes.INTEGER,
		placeableType: DataTypes.STRING,
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Place',
	})

	return Place
}

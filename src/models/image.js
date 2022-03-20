const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`

	class Image extends Model {
		static associate(models) {
			this.belongsTo(models.CarModel, {
				foreignKey: 'imageableId',
				as: 'carModel',
				constraints: false,
			})
		}

		getImageable(options) {
			if (!this.imageableType) return Promise.resolve(null)
			const mixinMethodName = `get${uppercaseFirst(this.imageableType)}`
			return this[mixinMethodName](options)
		}
	}
	Image.init({
		name: {
			type: DataTypes.STRING,
		},
		file: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
		},
		alt: {
			type: DataTypes.STRING,
		},
		imageableId: DataTypes.INTEGER,
		imageableType: DataTypes.STRING,
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Image',
	})
	return Image
}

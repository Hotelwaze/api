const {
	Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class CarModel extends Model {
		static associate(models) {
			this.belongsTo(models.CarMake, {
				foreignKey: 'CarMakeId',
				as: 'make',
			})
			this.belongsTo(models.CarType, {
				foreignKey: 'CarTypeId',
				as: 'carType',
			})
			this.hasMany(models.Image, {
				foreignKey: 'imageableId',
				constraints: false,
				as: 'images',
				scope: {
					imageableType: 'carModel',
				},
			})
		}
	}
	CarModel.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
		CarMakeId: {
			type: DataTypes.INTEGER,
		},
		CarTypeId: {
			type: DataTypes.INTEGER,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'CarModel',
		timestamps: true,
	})
	return CarModel
}

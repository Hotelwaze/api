import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
	class Option extends Model {
	}
	Option.init({
		key: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		value: {
			type: DataTypes.TEXT,
		},
		createdAt: {
			type: 'TIMESTAMP',
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Option',
	})
	return Option
}

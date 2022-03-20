module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Places', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			description: {
				type: Sequelize.STRING,
			},
			placeId: {
				type: Sequelize.STRING,
			},
			coordinates: {
				type: Sequelize.GEOMETRY('POINT'),
			},
			placeableId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			placeableType: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
				onUpdate: Sequelize.literal('NOW()'),
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('Roles')
	},
}

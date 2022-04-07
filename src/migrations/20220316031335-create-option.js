module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Options', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			key: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			value: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable('Options')
	},
}

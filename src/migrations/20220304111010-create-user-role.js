module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('userRoles', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			roleId: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('userRoles')
	},
}

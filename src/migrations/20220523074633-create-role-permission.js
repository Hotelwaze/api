module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('rolePermissions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			roleId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			permissionId: {
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
		await queryInterface.dropTable('rolePermissions')
	},
}

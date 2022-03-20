module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('RefreshTokens', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			expiryDate: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('RefreshTokens')
	},
}

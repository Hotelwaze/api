module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Partners', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			registeredName: {
				type: Sequelize.STRING,
			},
			tradeNumber: {
				type: Sequelize.STRING,
			},
			taxNumber: {
				type: Sequelize.STRING,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			status: {
				driver: {
					type: Sequelize.ENUM([
						'active',
						'pending',
						'cancelled',
						'suspended'
					]),
					allowNull: false,
				},
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
			deletedAt: {
				type: Sequelize.DATE,
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('Partners')
	},
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Invoices', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			number: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.ENUM('open', 'paid'),
				allowNull: false,
			},
			ref: {
				type: Sequelize.STRING,
			},
			currency: {
				type: Sequelize.STRING(3),
				allowNull: false,
				unique: true,
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
		await queryInterface.dropTable('Invoices')
	},
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Cars', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			plateNumber: {
				type: Sequelize.STRING(25),
				allowNull: false,
			},
			year: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			transmission: {
				type: Sequelize.STRING(2),
				allowNull: false,
				defaultValue: 'MT'
			},
			driver: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'optional'
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
		await queryInterface.dropTable('Cars')
	},
}

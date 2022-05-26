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
				type: Sequelize.ENUM('AT', 'MT'),
				allowNull: false,
			},
			driver: {
				type: Sequelize.ENUM('included', 'optional'),
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
		await queryInterface.dropTable('Cars')
	},
}

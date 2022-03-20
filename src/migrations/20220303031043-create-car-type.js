module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('CarTypes', {
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
			description: {
				type: Sequelize.TEXT,
			},
			passengers: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '2',
			},
			doors: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '2',
			},
			bags: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '0',
			},
			pricePerDay: {
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
		await queryInterface.dropTable('CarTypes')
	},
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Images', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			name: {
				type: Sequelize.STRING,
			},
			file: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			type: {
				type: Sequelize.STRING,
			},
			alt: {
				type: Sequelize.STRING,
			},
			imageableId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			imageableType: {
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
		await queryInterface.dropTable('Images')
	},
}

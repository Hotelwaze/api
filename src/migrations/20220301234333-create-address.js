module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Addresses', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			address1: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			address2: {
				type: Sequelize.STRING,
			},
			country: {
				type: Sequelize.STRING,
			},
			state: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			zip: {
				type: Sequelize.STRING,
			},
			addressableId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			addressableType: {
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
		await queryInterface.dropTable('Addresses')
	},
}

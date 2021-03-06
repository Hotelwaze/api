module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Bookings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER.UNSIGNED,
			},
			ref: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			startDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			endDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			totalPrice: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			percentDiscount: {
				type: Sequelize.DECIMAL(5.2),
			},
			notes: {
				type: Sequelize.TEXT,
			},
			paymentIntentId: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.ENUM([
					'pending',
					'booked',
					'active',
					'done',
					'cancelled'
				])
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
		await queryInterface.dropTable('Bookings')
	},
}

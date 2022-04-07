module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			'Partners',
			'PartnerTypeId',
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'PartnerTypes',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'CarModels',
			'CarMakeId',
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'CarMakes',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'CarModels',
			'CarTypeId',
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'CarTypes',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'Cars',
			'PartnerId',
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Partners',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'Cars',
			'CarModelId',
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'CarModels',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'Bookings', // name of Source model
			'UserId', // name of the key we're adding
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Users', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'Users', // name of Source model
			'PartnerId', // name of the key we're adding
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Partners', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'RefreshTokens', // name of Source model
			'UserId', // name of the key we're adding
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Users', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'InvoiceItems', // name of Source model
			'InvoiceId', // name of the key we're adding
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Invoices', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
		await queryInterface.addColumn(
			'Invoices', // name of Source model
			'BookingId', // name of the key we're adding
			{
				type: Sequelize.INTEGER.UNSIGNED,
				references: {
					model: 'Bookings', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		)
	},

	down: async (queryInterface) => {
		await queryInterface.removeColumn(
			'Partners',
			'PartnerTypeId',
		)
		await queryInterface.removeColumn(
			'CarModels',
			'CarTypeId',
		)
		await queryInterface.removeColumn(
			'CarModels',
			'CarMakeId',
		)
		await queryInterface.removeColumn(
			'Cars',
			'PartnerId',
		)
		await queryInterface.removeColumn(
			'Cars',
			'CarModelId',
		)
		await queryInterface.removeColumn(
			'Bookings',
			'UserId',
		)
		await queryInterface.removeColumn(
			'RefreshTokens',
			'UserId',
		)
		await queryInterface.removeColumn(
			'InvoiceItems',
			'InvoiceId',
		)
		await queryInterface.removeColumn(
			'Invoices',
			'BookingId',
		)
	},
}

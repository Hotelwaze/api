const { Sequelize } = require('sequelize')

module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Partners', [
			{
				id: 1,
				name: 'MPesito',
				registeredName: 'MPesito',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 927 279 4395',
				email: 'pesito_manny@yahoo.com',
				PartnerTypeId: 1,
				status: 'active',
			},
			{
				id: 2,
				name: 'Nicojhuen Transport Services',
				registeredName: 'Nicojhuen Transport Services',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 927 134 7600',
				email: 'agrabio_jennifer@gmail.com',
				PartnerTypeId: 1,
				status: 'active',
			},
			{
				id: 3,
				name: 'Golden Road Tourist Transport Cooperative',
				registeredName: 'Golden Road Tourist Transport Cooperative',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 917 351 5927',
				email: 'goldenrdtransport@gmail.com',
				PartnerTypeId: 1,
				status: 'active',
			},
			{
				id: 4,
				name: 'A. Bacani Transport',
				registeredName: 'A. Bacani Transport',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 928 946 9031',
				email: 'romanbacani030@gmail.com',
				PartnerTypeId: 1,
				status: 'active',
			},
			{
				id: 5,
				name: 'Novo Ecijano Van Transport And Service Cooperative',
				registeredName: 'Novo Ecijano Van Transport And Service Cooperative',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 915 396 6508',
				email: 'virgiliocariazo@gmail.com',
				PartnerTypeId: 1,
				status: 'active',
			},
			{
				id: 6,
				name: 'G.V. Daraman Transport OPC',
				registeredName: 'G.V. Daraman Transport OPC',
				tradeNumber: '',
				taxNumber: '',
				phone: '+63 918 381 7806',
				email: 'gbdiola1978@gmail.com',
				PartnerTypeId: 1,
				status: 'active',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Partners', null, {})
	},
}

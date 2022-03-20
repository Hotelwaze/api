module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('PartnerTypes', [
			{
				id: 1,
				name: 'Car Rental',
			},
			{
				id: 2,
				name: 'Hotel',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('PartnerTypes', null, {})
	},
}

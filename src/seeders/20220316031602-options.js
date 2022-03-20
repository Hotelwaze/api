module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Options', [
			{
				id: 1,
				key: 'booking_fuel_charge',
				value: '100000'
			}
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Options', null, {})
	},
}

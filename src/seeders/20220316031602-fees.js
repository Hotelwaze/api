module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Fees', [
			{
				id: 1,
				name: 'fuel_charge',
				value: '100000',
				type: 'one_time'
			},
			{
				id: 2,
				name: 'driver_fee',
				value: '200000',
				type: 'recurring'
			}
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Fees', null, {})
	},
}

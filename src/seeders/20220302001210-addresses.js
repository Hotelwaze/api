module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Addresses', [
			{
				id: 1,
				address1: '17 Mamerto District, Rosario',
				city: 'Pasig',
				state: 'Metro Manila',
				country: 'Philippines',
				addressableId: 1,
				addressableType: 'partner',
			},
			{
				id: 2,
				address1: '#09 Cuasay Street Zone 2 Brgy. Central Signal Village',
				city: 'Taguig',
				state: 'Metro Manila',
				country: 'Philippines',
				addressableId: 2,
				addressableType: 'partner',
			},
			{
				id: 3,
				address1: 'C. Abueg St.',
				city: 'Rosario',
				state: 'Cavite',
				country: 'Philippines',
				addressableId: 3,
				addressableType: 'partner',
			},
			{
				id: 4,
				address1: '40 C Pili St. North Signal Village',
				city: 'Taguig',
				state: 'Metro Manila',
				country: 'Philippines',
				addressableId: 4,
				addressableType: 'partner',
			},
			{
				id: 5,
				address1: 'Jemjun Apartment Brgy Magsaysay Sur',
				city: 'Cabanatuan',
				state: 'Nueva Ecija',
				country: 'Philippines',
				addressableId: 5,
				addressableType: 'partner',
			},
			{
				id: 6,
				address1: 'Block 4 lot 27 Braceville 1 Fairville Homes Lagro',
				city: 'Quezon City',
				state: 'Metro Manila',
				country: 'Philippines',
				addressableId: 6,
				addressableType: 'partner',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Addresses', null, {})
	},
}

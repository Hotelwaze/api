module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Cars', [
			{
				id: 1,
				plateNumber: 'NBP8778',
				year: '2019',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 1,
				CarModelId: 10,
			},
			{
				id: 2,
				plateNumber: 'ADU7065',
				year: '2016',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 2,
				CarModelId: 11,
			},
			{
				id: 3,
				plateNumber: 'NBR3692',
				year: '2018',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 3,
				CarModelId: 12,
			},
			{
				id: 4,
				plateNumber: 'NEH2454',
				year: '2019',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 4,
				CarModelId: 13,
			},
			{
				id: 5,
				plateNumber: 'CAL5897',
				year: '2018',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 5,
				CarModelId: 10,
			},
			{
				id: 6,
				plateNumber: 'CAU4802',
				year: '2021',
				transmission: 'MT',
				driver: 'optional',
				PartnerId: 6,
				CarModelId: 13,
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Cars', null, {})
	},
}

module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('CarModels', [
			{
				id: 1,
				name: 'Hilux',
				CarMakeId: 1,
				CarTypeId: 10,
			},
			{
				id: 2,
				name: 'Vios',
				CarMakeId: 1,
				CarTypeId: 3,
			},
			{
				id: 3,
				name: 'Fortuner',
				CarMakeId: 1,
				CarTypeId: 11,
			},
			{
				id: 4,
				name: 'Innova',
				CarMakeId: 1,
				CarTypeId: 12,
			},
			{
				id: 5,
				name: 'Wigo',
				CarMakeId: 1,
				CarTypeId: 2,
			},
			{
				id: 6,
				name: 'Rush',
				CarMakeId: 1,
				CarTypeId: 12,
			},
			{
				id: 7,
				name: 'Rush',
				CarMakeId: 1,
				CarTypeId: 12,
			},
			{
				id: 8,
				name: 'Avanza',
				CarMakeId: 1,
				CarTypeId: 12,
			},
			{
				id: 9,
				name: 'Yaris',
				CarMakeId: 1,
				CarTypeId: 2,
			},
			{
				id: 10,
				name: 'Hiace Commuter',
				CarMakeId: 1,
				CarTypeId: 9,
			},
			{
				id: 11,
				name: 'Hiace GL Grandia',
				CarMakeId: 1,
				CarTypeId: 9,
			},
			{
				id: 12,
				name: 'Traveller',
				CarMakeId: 55,
				CarTypeId: 9,
			},
			{
				id: 13,
				name: 'Urvan',
				CarMakeId: 5,
				CarTypeId: 9,
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('CarModels', null, {})
	},
}

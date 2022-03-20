module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Images', [
			{
				'id': 1,
				'name': 'Foton Traveller',
				'file': 'foton-traveller.png',
				'alt': 'Foton Traveller',
				'imageableId': 12,
				'imageableType': 'carModel',
			},
			{
				'id': 2,
				'name': 'Nissan Urvan',
				'file': 'nissan-urvan.png',
				'alt': 'Nissan Urvan',
				'imageableId': 13,
				'imageableType': 'carModel',
			},
			{
				'id': 3,
				'name': 'Toyota Hiace GL Grandia',
				'file': 'toyota-grandia-gl.png',
				'alt': 'Toyota Hiace GL Grandia',
				'imageableId': 11,
				'imageableType': 'carModel',
			},
			{
				'id': 4,
				'name': 'Toyota Hiace Commuter',
				'file': 'toyota-grandia-commutter.png',
				'alt': 'Toyota Commuter',
				'imageableId': 10,
				'imageableType': 'carModel',
			},
			{
				'id': 5,
				'name': 'Toyota Vios',
				'file': 'toyota-vios.png',
				'alt': 'Toyota Vios',
				'imageableId': 2,
				'imageableType': 'carModel',
			}
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Images', null, {})
	},
}

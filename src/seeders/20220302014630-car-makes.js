module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('CarMakes', [
			{
				id: 1,
				name: 'Toyota',
			},
			{
				id: 2,
				name: 'Honda',
			},
			{
				id: 3,
				name: 'Mitsubishi',
			},
			{
				id: 4,
				name: 'Suzuki',
			},
			{
				id: 5,
				name: 'Nissan',
			},
			{
				id: 6,
				name: 'Isuzu',
			},
			{
				id: 7,
				name: 'Hyundai',
			},
			{
				id: 8,
				name: 'Ford',
			},
			{
				id: 9,
				name: 'Mazda',
			},
			{
				id: 10,
				name: 'Chevrolet',
			},
			{
				id: 11,
				name: 'Kia',
			},
			{
				id: 12,
				name: 'MG',
			},
			{
				id: 13,
				name: 'Subaru',
			},
			{
				id: 14,
				name: 'JAC',
			},
			{
				id: 15,
				name: 'GAC',
			},
			{
				id: 16,
				name: 'Volkswagen',
			},
			{
				id: 17,
				name: 'Jeep',
			},
			{
				id: 18,
				name: 'Mercedes-Benz',
			},
			{
				id: 19,
				name: 'Mahindra',
			},
			{
				id: 20,
				name: 'Haima',
			},
			{
				id: 21,
				name: 'Peugeot',
			},
			{
				id: 22,
				name: 'MINI',
			},
			{
				id: 23,
				name: 'Porsche',
			},
			{
				id: 24,
				name: 'BMW',
			},
			{
				id: 25,
				name: 'Land Rover',
			},
			{
				id: 26,
				name: 'Alfa Romeo',
			},
			{
				id: 27,
				name: 'Abarth',
			},
			{
				id: 28,
				name: 'Dodge',
			},
			{
				id: 29,
				name: 'BYD',
			},
			{
				id: 30,
				name: 'Ferrari',
			},
			{
				id: 31,
				name: 'Lexus',
			},
			{
				id: 32,
				name: 'Maserati',
			},
			{
				id: 33,
				name: 'Volvo',
			},
			{
				id: 34,
				name: 'Audi',
			},
			{
				id: 35,
				name: 'Tata',
			},
			{
				id: 36,
				name: 'Chrysler',
			},
			{
				id: 37,
				name: 'Sangyong',
			},
			{
				id: 38,
				name: 'Geely',
			},
			{
				id: 39,
				name: 'Jaguar',
			},
			{
				id: 40,
				name: 'RAM',
			},
			{
				id: 41,
				name: 'Aston Martin',
			},
			{
				id: 42,
				name: 'Rolls-Royce',
			},
			{
				id: 43,
				name: 'Bentley',
			},
			{
				id: 44,
				name: 'Lotus',
			},
			{
				id: 45,
				name: 'Chery',
			},
			{
				id: 46,
				name: 'Haval',
			},
			{
				id: 47,
				name: 'Lamborghini',
			},
			{
				id: 48,
				name: 'Maxus',
			},
			{
				id: 49,
				name: 'Cadillac',
			},
			{
				id: 50,
				name: 'Changan',
			},
			{
				id: 51,
				name: 'Lincoln',
			},
			{
				id: 52,
				name: 'Infiniti',
			},
			{
				id: 53,
				name: 'McLaren',
			},
			{
				id: 54,
				name: 'Kaicene',
			},
			{
				id: 55,
				name: 'Foton',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('CarMakes', null, {})
	},
}

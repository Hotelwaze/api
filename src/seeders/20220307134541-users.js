module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Users', [
			{
				id: 1,
				name: 'Jason Losito',
				firstName: 'Jason',
				lastName: 'Losito',
				email: 'jasonlosito@gmail.com',
				password: 'PassPass',
				mobile: '+63 916 220 0701',
				emailVerified: false,
				mobileVerified: false,
				status: 'active',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Users', null, {})
	},
}

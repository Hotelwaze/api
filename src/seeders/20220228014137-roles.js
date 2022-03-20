module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Roles', [
			{
				id: 1,
				name: 'admin',
			},
			{
				id: 2,
				name: 'admin_staff',
			},
			{
				id: 3,
				name: 'customer',
			},
			{
				id: 4,
				name: 'partner_admin',
			},
			{
				id: 5,
				name: 'partner_driver',
			},
			{
				id: 6,
				name: 'partner_staff',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Roles', null, {})
	},
}

const { Sequelize } = require('sequelize')

module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('Places', [
			{
				id: 1,
				description: '17 Mamerto District,Rosario Pasig',
				placeId: '17-Mamerto-District-Rosario-Pasig',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(121.083635 14.5889289)'),
				placeableId: 1,
				placeableType: 'partner',
			},
			{
				id: 2,
				description: '09 Cuasay Street Zone 2 Brgy. Central Signal Village Taguig City',
				placeId: '09-Cuasay-Street-Zone-2-Brgy-Central-Signal-Village-Taguig-City',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(121.0580601 14.5124137)'),
				placeableId: 2,
				placeableType: 'partner',
			},
			{
				id: 3,
				description: 'C. Abueg St. Rosario Cavite',
				placeId: 'C-Abueg-St-Rosario-Cavite',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(120.8494551 14.4145064)'),
				placeableId: 3,
				placeableType: 'partner',
			},
			{
				id: 4,
				description: '40 C Pili St North Signal Village Taguig City',
				placeId: '40-C-Pili-St-North-Signal-Village-Taguig-City',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(121.0554294 14.5166307)'),
				placeableId: 4,
				placeableType: 'partner',
			},
			{
				id: 5,
				description: 'Aduas Sur Cabanatuan City Nueva Ecija',
				placeId: 'Aduas-Sur-Cabanatuan-City-Nueva-Ecija',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(120.9647969 15.4946925)'),
				placeableId: 5,
				placeableType: 'partner',
			},
			{
				id: 6,
				description: 'Block 4 Lot 27 Braceville 1 Fairville Homes Lagro Q.C',
				placeId: 'Block-4-Lot-27-Braceville-1-Fairville-Homes-Lagro-Q-C',
				coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(121.0597186 14.7202562)'),
				placeableId: 6,
				placeableType: 'partner',
			},
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('Places', null, {})
	},
}

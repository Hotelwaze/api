module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert('CarTypes', [
			{
				'id': 1,
				'name': 'Economy Sedan',
				'description': '<p>A compact sedan is a smaller vehicle, such as a Toyota Wigo, that seats up to five people. This type of car is easy to park, plus gets excellent gas mileage.</p>',
				'passengers': '4',
				'doors': '4',
				'bags': '2',
				'pricePerDay': 500000,
			},
			{
				'id': 2,
				'name': 'Compact Sedan',
				'description': '<p>A compact vehicle is a small car, ranging from 100-109 cubic feet of combined passenger and cargo space. It should also be between 161 and 187 inches in length, so a compact car is easy to park around town, even if you have to parallel!</p>',
				'passengers': '2',
				'doors': '2',
				'bags': '4',
				'pricePerDay': 400000,
			},
			{
				'id': 3,
				'name': 'Standard Sedan',
				'description': '<p>In comparison to an intermediate sedan, a standard sedan is a larger sedan with more passenger space and the ability to fit an additional bag in the trunk.</p>',
				'passengers': '5',
				'doors': '3-4',
				'bags': '4',
				'pricePerDay': 600000,
			},
			{
				'id': 4,
				'name': 'Premium/Luxury Sedan',
				'description': '<p>A premium sedan is somewhere between a luxury sedan and a standard sedan. They typically look and perform far better than a standard sedan, hence the higher price tag. Premium sedans are usually four-door saloons or larger. The features and trim level set them apart from luxury vehicles.</p>',
				'passengers': '5',
				'doors': '4',
				'bags': '4',
				'pricePerDay': 2000000,
			},
			{
				'id': 5,
				'name': 'Compact SUV',
				'description': '<p>A compact sport utility vehicle, also known as a compact SUV, is a type of small SUV that is larger than mini SUVs but smaller than mid-size SUVs.</p>',
				'passengers': '5',
				'doors': '4',
				'bags': '3',
				'pricePerDay': 1500000,
			},
			{
				'id': 6,
				'name': 'Standard SUV',
				'description': '<p>A standard SUV is a larger sports utility vehicle than an intermediate (also known as a midsize) or compact SUV. The term standard is used to differentiate full-size SUVs from smaller models.</p>',
				'passengers': '5',
				'doors': '4',
				'bags': '4',
				'pricePerDay': 1700000,
			},
			{
				'id': 7,
				'name': 'Premium/Luxury SUV',
				'description': '<p>Today\'s luxury SUVs combine performance, comfortable and spacious interiors, strong towing capacity, and cutting-edge technology.</p>',
				'passengers': '5-7',
				'doors': '3-5',
				'bags': '4',
				'pricePerDay': 2500000,
			},
			{
				'id': 8,
				'name': 'Minivan',
				'description': '<p>A minivan is a vehicle that is built on the platform of a small car. One simple feature that sets it apart from other car classes is its easy-to-use, sliding or hinged rear doors, and its body, which sits lower to the ground than SUVs or trucks.</p>',
				'passengers': '7-8',
				'doors': '4-5',
				'bags': '7',
				'pricePerDay': 1500000,
			},
			{
				'id': 9,
				'name': 'Passenger Van',
				'description': '<p>A passenger van is a motor vehicle that is designed to transport 15 or fewer passengers, including the driver.</p>',
				'passengers': '8-12',
				'doors': '3-4',
				'bags': '7',
				'pricePerDay': 3000000,
			},
			{
				'id': 10,
				'name': 'Pickup Truck',
				'description': '<p>A pickup truck, also known as a pickup, is a light-duty truck with an enclosed cabin and an open cargo area, as well as low sides and a tailgate.</p>',
				'passengers': '4',
				'doors': '2-4',
				'bags': '3-4',
				'pricePerDay': 1200000,
			},
			{
				'id': 11,
				'name': 'Midsize SUV',
				'description': '<p>Midsize SUVs typically offer more passenger and cargo space than compacts, without the land-yacht footprint of full-size vehicles. Many midsizers employ a V6 engine to provide extra power and torque, although turbocharged four-cylinder engines are increasingly common.</p>',
				'passengers': '5-7',
				'doors': '5',
				'bags': '3-4',
				'pricePerDay': 1000000,
			},
			{
				'id': 12,
				'name': 'MPV',
				'description': '<p>MPV stands for Multi-Purpose Vehicle. MPVs are sometimes called ‘people carriers’, too, which is perhaps a more accurate name. They have tall, box-like bodies designed to create as much interior space as possible and often have more seats than a comparable hatchback or saloon. Most allow you to fold or remove the back seats in various ways to prioritise passenger space, load space or a mix of the two. </p>',
				'passengers': '7-8',
				'doors': '5',
				'bags': '3-4',
				'pricePerDay': 800000,
			}
		], {})
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete('CarTypes', null, {})
	},
}

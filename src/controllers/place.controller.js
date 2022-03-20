import model from '../models'

const { Place, Partner, Car, Booking } = model

const getPlaces = async (req, res) => {
	try {
		const places = await Place.findAll({
			attributes: [
				'id',
				'description',
				'placeId',
				'coordinates',
				'placeableId',
				'placeableType',
			],
			include: [
				{
					model: Partner,
					as: 'partner',
					include: [
						{
							model: Car,
							as: 'cars',
							include: [
								{
									model: Booking,
									as: 'bookings'
								}
							]
						}
					]
				}
			]
		})
		res.status(200).send({
			places
		})
	} catch (err) {
		console.log(err)
	}
}

const placeController = {
	getPlaces,
}

export default placeController

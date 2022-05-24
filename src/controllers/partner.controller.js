import model from '../models'
import common from '../helpers/common'

const { Partner, PartnerType, Address, Place, Car, CarModel, CarMake, CarType, Booking } = model

const getPartners = async (req, res) => {
	try {
		const partners = await Partner.findAll({
			attributes: [
				'id',
				'name',
				'registeredName',
				'tradeNumber',
				'taxNumber',
				'phone',
				'email',
				'status'
			],
			include: [
				{
					model: PartnerType,
					as: 'partnerType',
				},
				{
					model: Address,
					as: 'addresses'
				},
				{
					model: Place,
					as: 'places'
				}
			]
		})
		res.status(200).send({
			partners
		})
	} catch (err) {
		console.log(err)
	}
}

const getPartnerCars = async (req, res) => {
	const { id } = req.params
	try {
		// check if 'car.list' is in the user's list of permissions
		if (req.user.permissions.includes('car.list') || req.user.role.includes('admin')) {
			const cars = await Car.findAll({
				attributes: ['id', 'plateNumber', 'year', 'transmission', 'driver'],
				include: [
					{
						model: Partner,
						as: 'partner',
						attributes: [],
						where: {
							id
						}
					},
					{
						model: CarModel,
						as: 'model',
						attributes: ['name'],
						include: [
							{
								model: CarMake,
								as: 'make',
								attributes: ['name'],
							},
							{
								model: CarType,
								as: 'carType',
								attributes: ['name'],
							},
						]
					}
				]
			})

			const partnerCars = []

			cars.forEach((car) => {
				partnerCars.push({
					mode: car.model.name,
					make: car.model.make.name,
					year: car.year,
					plate: car.plateNumber,
					type: car.model.carType.name,
					transmission: car.transmission,
					driver: car.driver,
				})
			})
			res.status(200).send({
				data: partnerCars
			})
		} else {
			const error = new Error('Unauthorized')
			error.code = 401
			throw error
		}
	} catch (e) {
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const partnerController = {
	getPartners,
	getPartnerCars
}

export default partnerController

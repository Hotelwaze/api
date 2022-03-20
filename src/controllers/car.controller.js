import { Op, Sequelize } from 'sequelize'
import * as _ from 'lodash'
import model from '../models'
import common from '../helpers/common'

const { Car, Place, Partner, Booking, CarModel, CarMake, CarType, Image } = model

const getCars = async (req, res) => {
	try {
		const cars = await Car.findAll({
			attributes: ['id', 'plateNumber', 'year', 'transmission', 'driver'],
			include: [
				{
					model: CarModel,
					as: 'model',
					include: [
						{
							model: Image,
							as: 'images'
						}
					]
				}
			]
		})
		res.status(200).send({
			cars
		})
	} catch (err) {
		console.log(err)
	}
}

const getCarsNearby = async (req, res) => {
	const { radius, lat, lng, startDate, endDate } = req.query
	const location = Sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`)
	const distance = Sequelize.fn('ST_Distance_Sphere', Sequelize.literal('coordinates'), location)

	try {
		// Search all partner garage locations within a given radius that are booked
		const bookedCarsNearby = await Place.findAll({
			include: [
				{
					model: Partner,
					as: 'partner',
					include: [
						{
							model: Car,
							as: 'cars',
							required: true,
							include: [
								{
									model: Booking,
									as: 'bookings',
									where: {
										[Op.or]: [{
											startDate: {
												[Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)]
											}
										}, {
											endDate: {
												[Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)]
											}
										}]
									},
								},
							],
						},
					],
					required: true,
				},
			],
			attributes: {
				include: [
					[distance, 'distance'],
				],
			},
			where: {
				[Op.and]: [
					Sequelize.where(distance, { [Op.lte]: radius }),
					{
						placeableType: 'partner',
					},
				],
			},
		})

		const bookedCarsNearbyIds = []

		if (bookedCarsNearby.length > 0) {
			bookedCarsNearby.forEach((bookedPartnerCar) => {
				bookedPartnerCar.partner.cars.forEach((car) => {
					bookedCarsNearbyIds.push(car.id)
				})
			})
		}

		const carsNearby = await Place.findAll({
			include: [
				{
					model: Partner,
					as: 'partner',
					include: [
						{
							model: Car,
							as: 'cars',
							required: true,
							include: [
								{
									model: CarModel,
									as: 'model',
									include: [
										{
											model: CarMake,
											as: 'make'
										},
										{
											model: CarType,
											as: 'carType'
										},
										{
											model: Image,
											as: 'images',
										},
									]
								}
							]
						},
					],
					required: true,
				},
			],
			attributes: {
				include: [
					[distance, 'distance'],
				],
			},
			where: {
				[Op.and]: [
					Sequelize.where(distance, { [Op.lte]: radius }),
					{
						placeableType: 'partner',
					},
				],
			},
		})

		let availableCarsNearby = []

		if (bookedCarsNearbyIds.length > 0) {
			carsNearby.forEach((partnerCar) => {
				const newPartnerCar = partnerCar
				const cars = _.remove(partnerCar.partner.cars, (car) => bookedCarsNearbyIds.includes(car.id))
				newPartnerCar.partner.cars = cars
				availableCarsNearby.push(newPartnerCar)
			})
		} else {
			availableCarsNearby = carsNearby
		}

		availableCarsNearby = JSON.stringify(availableCarsNearby)
		availableCarsNearby = JSON.parse(availableCarsNearby)

		const availableCarGroups = []

		availableCarsNearby.forEach((item) => {
			let group = _.groupBy(item.partner.cars, (car) => `"${car.CarModelId}+${car.transmission}"`)
			Object.keys(group).forEach((key) => {
				const carIds = []
				let driverOptions = []
				group[key].forEach((car) => {
					carIds.push(car.id)
					driverOptions.push(car.driver)
				})
				driverOptions = [...new Set(driverOptions)]
				availableCarGroups.push({
					partnerId: item.partner.id,
					partnerName: item.partner.name,
					carMakeName: group[key][0].model.make.name,
					image: group[key][0].model.images[0].file,
					carModelName: group[key][0].model.name,
					carTypeId: group[key][0].model.carType.id,
					carTypeName: group[key][0].model.carType.name,
					doors: group[key][0].model.carType.doors,
					bags: group[key][0].model.carType.bags,
					passengers: group[key][0].model.carType.passengers,
					pricePerDay: group[key][0].model.carType.pricePerDay,
					transmission: group[key][0].transmission,
					carIds,
					driverOptions: driverOptions.join(' or ')
				})
			})
		})

		res.status(200).send({
			success: true,
			message: 'Query successful',
			data: availableCarGroups
		})
	} catch (err) {
		console.log(err)
	}
}

const carController = {
	getCars,
	getCarsNearby,
}

export default carController

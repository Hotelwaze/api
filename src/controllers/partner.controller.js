import model from '../models'
import bcrypt from 'bcrypt'
import common from '../helpers/common'

const { Partner, PartnerType, Address, Place, Car, CarModel, CarMake, CarType, Role, User } = model

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

const savePartner = async (req, res) => {
	const { partnerType, name: partnerName, registeredName, tradeNumber, taxNumber, phone, email, status,
		username, userEmail, password, role, mobile
	} = req.body

	try {
		if (!partnerName) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		const existingName = await Partner.findOne({
			where: {
				name: partnerName
			}
		})

		if (existingName) {
			const error = new Error('name provided already exists')
			error.code = 403
			throw error
		}

		if (!phone) {
			const error = new Error('phone is not provided')
			error.code = 403
			throw error
		}

		if (!email) {
			const error = new Error('email is not provided')
			error.code = 403
			throw error
		}

		if (!status) {
			const error = new Error('status should have a value of active, pending, cancelled, suspended')
			error.code = 403
			throw error
		}

		const args = {
			name: partnerName,
			phone,
			email,
			status,
			PartnerTypeId: partnerType
		}

		if (registeredName) {
			args.registeredName = registeredName
		}

		if (tradeNumber) {
			args.tradeNumber = tradeNumber
		}

		if (taxNumber) {
			args.taxNumber = taxNumber
		}

		if (!username) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		if (!userEmail || !common.isValidEmail(userEmail)) {
			const error = new Error('email is not valid')
			error.code = 403
			throw error
		}

		if (!password) {
			const error = new Error('provided is not provided')
			error.code = 403
			throw error
		}

		if (!role) {
			const error = new Error('role is not provided')
			error.code = 403
			throw error
		}

		await model.sequelize.transaction(async (t) => {
			const partner = await Partner.create(args, { transaction: t })

			if (!partner) {
				const error = new Error('car create failed')
				error.code = 403
				throw error
			}

			const fetchedRole = await Role.findOne({
				where: {
					name: role
				}
			})

			if (!fetchedRole) {
				const error = new Error('role does not exist')
				error.code = 403
				throw error
			}

			const [firstName, lastName] = username.split(' ')

			const userArgs = {
				name: username,
				firstName,
				lastName,
				email,
				password: bcrypt.hashSync(password, 11),
				PartnerId: partner.id
			}

			if (mobile) {
				args.mobile = mobile
			}

			const user = await User.create(userArgs, { transaction: t })

			if (user) {
				await user.setRoles([fetchedRole.id], { transaction: t })
				const roles = await user.getRoles()

				if (roles && roles.length > 0) {
					const authorities = []
					for (let i = 0; i < roles.length; i += 1) {
						authorities.push(roles[i].name)
					}

					res.status(200).send({
						message: 'user create successful',
						data: {
							user: {
								id: user.id,
								email: user.email,
								name: user.name,
								firstName: user.firstName,
								lastName: user.lastName,
								account: partner
							}
						},
					})
				}
			}
		})
	} catch (e) {
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}
const getCars = async (req, res) => {
	const { id } = req.params
	try {
		if ((!req.user.permissions.includes('car.list') && req.user.id !== id) || req.user.role.includes('admin')) {
			const error = new Error('Unauthorized')
			error.code = 401
			throw error
		}

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
	} catch (e) {
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const saveCar = async (req, res) => {
	const { id } = req.params
	const { model, year, plate, driver, transmission } = req.body

	try {
		console.log(req.user.roles.includes('admin'))
		if (!(req.user.permissions.includes('car.save') && req.user.id == id) || req.user.roles.includes('admin')) {
			const error = new Error('Unauthorized')
			error.code = 401
			throw error
		}

		if (!model) {
			const error = new Error('car model id is not provided')
			error.code = 403
			throw error
		}

		if (!year) {
			const error = new Error('car year is not provided')
			error.code = 403
			throw error
		}

		if (!driver && !['required', 'optional'].includes(driver)) {
			const error = new Error('driver should have a value of optional or required')
			error.code = 403
			throw error
		}

		if (!transmission && !['MT', 'AT'].includes(transmission)) {
			const error = new Error('transmission should have a value of MT or AT')
			error.code = 403
			throw error
		}

		if (!plate) {
			const error = new Error('car plate number is not provided')
			error.code = 403
			throw error
		}

		const car = await Car.create({
			PartnerId: id,
			CarModelId: model,
			plateNumber: plate,
			transmission,
			driver,
			year
		})

		if (!car) {
			const error = new Error('car create failed')
			error.code = 403
			throw error
		}

		res.status(200).send({
			message: 'car create successful',
			data: {
				car
			},
		})

	} catch (e) {
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const partnerController = {
	getPartners,
	savePartner,
	saveCar,
	getCars
}

export default partnerController

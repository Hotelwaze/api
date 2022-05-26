import model from '../models'
import common from '../helpers/common'

const { CarType } = model

const list = async (req, res) => {
	try {
		const carTypes = await CarType.findAll()
		res.status(200).send({
			carTypes
		})
	} catch (err) {
		console.log(err)
	}
}

const add = async (req, res) => {
	const { name, description, passengers, doors, bags, pricePerDay } = req.body

	try {
		if (!common.checkRole(req.user.roles, 'admin')) {
			const error = new Error('unauthorized')
			error.code = 401
			throw error
		}

		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		if (!passengers) {
			const error = new Error('number of passengers make is not provided')
			error.code = 403
			throw error
		}

		if (!doors) {
			const error = new Error('number of doors is not provided')
			error.code = 403
			throw error
		}

		if (!bags) {
			const error = new Error('number of bags is not provided')
			error.code = 403
			throw error
		}

		if (!pricePerDay) {
			const error = new Error('rental price per day is not provided')
			error.code = 403
			throw error
		}

		const args = {
			name,
			passengers,
			doors,
			bags,
			pricePerDay
		}

		if (description) {
			args.description = description
		}

		const carType = await CarType.create(args)

		if (!carType) {
			const error = new Error('car rental type create failed')
			error.code = 403
			throw error
		}

		res.status(200).send({
			message: 'car rental type create successful',
			data: {
				carType
			},
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const carTypeController = {
	list,
	add
}

export default carTypeController

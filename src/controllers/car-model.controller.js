import model from '../models'
import common from '../helpers/common'

const { CarModel } = model

const list = async (req, res) => {
	try {
		const carModels = await CarModel.findAll()
		res.status(200).send({
			carModels
		})
	} catch (err) {
		console.log(err)
	}
}

const add = async (req, res) => {
	const { name, description, carMake, carType } = req.body

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

		if (!carMake) {
			const error = new Error('car make is not provided')
			error.code = 403
			throw error
		}

		if (!carType) {
			const error = new Error('car type is not provided')
			error.code = 403
			throw error
		}

		const args = {
			name,
			carMake,
			carType
		}

		if (description) {
			args.description = description
		}

		const carModel = await CarModel.create(args)

		if (!carModel) {
			const error = new Error('car model create failed')
			error.code = 403
			throw error
		}

		res.status(200).send({
			message: 'car model create successful',
			data: {
				carModel
			},
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const carModelController = {
	list,
	add
}

export default carModelController

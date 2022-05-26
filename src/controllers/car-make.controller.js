import model from '../models'
import common from '../helpers/common'

const { CarMake } = model

const list = async (req, res) => {
	try {
		const carMakes = await CarMake.findAll({
			attributes: ['id', 'name', 'description'],
		})
		res.status(200).send({
			carMakes
		})
	} catch (err) {
		console.log(err)
	}
}

const add = async (req, res) => {
	const { name, description } = req.body

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

		const args = {
			name
		}

		if (description) {
			args.description = description
		}

		const carMake = await CarMake.create(args)

		if (!carMake) {
			const error = new Error('car make create failed')
			error.code = 403
			throw error
		}

		res.status(200).send({
			message: 'car make create successful',
			data: {
				carMake
			},
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const carMakeController = {
	list,
	add
}

export default carMakeController

import model from '../models'

const { Role } = model

const getRoles = async (req, res) => {
	try {
		const roles = await Role.findAll({
			attributes: ['id', 'name'],
		})
		res.status(200).send({
			roles
		})
	} catch (err) {
		console.log(err)
	}
}

const create = async (req, res) => {
	const { name } = req.body

	try {
		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		await model.sequelize.transaction(async (t) => {
			const role = await Role.create({
				name
			}, { transaction: t })

			if (!role) {
				const error = new Error('failed to create role')
				error.code = 401
				throw error
			}

			res.status(200).send({
				message: 'role create successful',
				data: {
					role
				},
			})
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const roleController = {
	getRoles,
	create
}

export default roleController

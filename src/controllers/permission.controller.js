import model from '../models'
import common from '../helpers/common'

const { Permission } = model

const create = async (req, res) => {
	const { name } = req.body

	try {
		if (!common.checkRole(req.user.roles, 'admin')) {
			const error = new Error('unauthorized')
			error.code = 403
			throw error
		}

		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		await model.sequelize.transaction(async (t) => {
			const permission = await Permission.create({
				name
			}, { transaction: t })

			if (!permission) {
				const error = new Error('failed to create permission')
				error.code = 401
				throw error
			}

			res.status(200).send({
				message: 'permission create successful',
				data: {
					permission
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

export default {
	create
}

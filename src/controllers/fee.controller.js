import model from '../models'

const { Fee } = model

const save = async (req, res) => {
	const { name, type, value } = req.body

	try {
		if (!req.user.roles.includes('admin')) {
			const error = new Error('unauthorized')
			error.code = 401
			throw error
		}

		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		if (!type) {
			const error = new Error('type is not provided')
			error.code = 403
			throw error
		}
		if (!value) {
			const error = new Error('value is not provided')
			error.code = 403
			throw error
		}

		const fee = await Fee.create({
			name,
			type,
			value
		})

		if (!fee) {
			const error = new Error('fee create failed')
			error.code = 400
			throw error
		}

		res.status(200).send({
			message: 'Fee create successful',
			data: fee,
		})
	} catch (e) {
		res.status(e.code || 500).send({
			success: e.success,
			message: e.message,
		})
	}
}

const findFee = async (req, res) => {
	const { name } = req.query

	try {
		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		const fee = await Fee.findOne({
			where: {
				name
			},
			attributes: ['name', 'type', 'value']
		})

		if (!fee) {
			const error = new Error('fee fetch error')
			error.code = 403
			throw error
		}


		res.status(200).send({
			message: 'Fee fetch successful',
			data: fee,
		})
	} catch (e) {
		res.status(e.code || 500).send({
			success: e.success,
			message: e.message,
		})
	}
}

const optionController = {
	save,
	findFee,
}

export default optionController

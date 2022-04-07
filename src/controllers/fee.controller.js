import model from '../models'

const { Fee } = model

const findFee = async (req, res) => {
	const { name } = req.query

	try {
		const args = {}

		if (name !== null && name !== '') {
			args.where = {
				name,
			}
		} else {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		const fee = await Fee.findOne(args)

		res.status(200).send({
			message: 'Query successful',
			data: fee,
		})
	} catch (err) {
		res.status(err.code || 500).send({
			success: err.success,
			message: err.message,
		})
	}
}

const optionController = {
	findFee,
}

export default optionController

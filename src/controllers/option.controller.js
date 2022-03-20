import model from '../models'

const { Option } = model

const findOption = async (req, res) => {
	const { key } = req.query

	try {
		const args = {}

		if (key !== undefined && key !== null && key !== '') {
			args.where = {
				key,
			}
		} else {
			const error = new Error('Key is required.')
			error.code = 403
			throw error
		}

		const option = await Option.findOne(args)

		res.status(200).send({
			message: 'Query successful',
			data: option,
		})
		return
	} catch (err) {
		res.status(err.code || 500).send({
			success: err.success,
			message: err.message,
		})
	}
}

const optionController = {
	findOption,
}

export default optionController

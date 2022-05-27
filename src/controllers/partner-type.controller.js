import model from '../models'

const { PartnerType } = model

const get = async (req, res) => {
	try {
		const partnerTypes = await PartnerType.findAll({
			attributes: ['id', 'name'],
		})
		res.status(200).send({
			partnerTypes
		})
	} catch (err) {
		console.log(err)
	}
}

const add = async(req, res) => {
	const { name } = req.body

	try {
		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		const partnerType = await PartnerType.create({
			name
		})

		if (!partnerType) {
			const error = new Error('partner type create not successful')
			error.code = 502
			throw error
		}

		res.status(200).send({
			message: 'user create successful',
			data: {
				partnerType
			},
		})
	} catch (e) {
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const partnerTypeController = {
	get,
	add
}

export default partnerTypeController

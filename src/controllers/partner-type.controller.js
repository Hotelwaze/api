import model from '../models'

const { PartnerType } = model

const getPartnerTypes = async (req, res) => {
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

const partnerTypeController = {
	getPartnerTypes,
}

export default partnerTypeController

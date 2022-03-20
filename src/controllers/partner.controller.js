import model from '../models'

const { Partner, PartnerType, Address, Place } = model

const getPartners = async (req, res) => {
	try {
		const partners = await Partner.findAll({
			attributes: [
				'id',
				'name',
				'registeredName',
				'tradeNumber',
				'taxNumber',
				'phone',
				'email',
				'status'
			],
			include: [
				{
					model: PartnerType,
					as: 'partnerType',
				},
				{
					model: Address,
					as: 'addresses'
				},
				{
					model: Place,
					as: 'places'
				}
			]
		})
		res.status(200).send({
			partners
		})
	} catch (err) {
		console.log(err)
	}
}

const partnerController = {
	getPartners,
}

export default partnerController

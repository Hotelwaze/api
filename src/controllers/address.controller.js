import model from '../models'

const { Address } = model

const getAddresses = async (req, res) => {
	try {
		const addresses = await Address.findAll({
			attributes: [
				'id',
				'address1',
				'address2',
				'city',
				'state',
				'country',
				'zip'
			],
		})
		res.status(200).send({
			addresses
		})
	} catch (err) {
		console.log(err)
	}
}

const addressController = {
	getAddresses,
}

export default addressController

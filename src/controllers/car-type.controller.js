import model from '../models'

const { CarType } = model

const getCarTypes = async (req, res) => {
	try {
		const carTypes = await CarType.findAll()
		res.status(200).send({
			carTypes
		})
	} catch (err) {
		console.log(err)
	}
}

const carTypeController = {
	getCarTypes,
}

export default carTypeController

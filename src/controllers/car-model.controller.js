import model from '../models'

const { CarModel } = model

const getCarModels = async (req, res) => {
	try {
		const carModels = await CarModel.findAll()
		res.status(200).send({
			carModels
		})
	} catch (err) {
		console.log(err)
	}
}

const carModelController = {
	getCarModels,
}

export default carModelController

import model from '../models'

const { CarMake } = model

const getCarMakes = async (req, res) => {
	try {
		const carMakes = await CarMake.findAll({
			attributes: ['id', 'name', 'description'],
		})
		res.status(200).send({
			carMakes
		})
	} catch (err) {
		console.log(err)
	}
}

const carMakeController = {
	getCarMakes,
}

export default carMakeController

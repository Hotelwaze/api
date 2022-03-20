import model from '../models'

const { Role } = model

const getRoles = async (req, res) => {
	try {
		const roles = await Role.findAll({
			attributes: ['id', 'name'],
		})
		res.status(200).send({
			roles
		})
	} catch (err) {
		console.log(err)
	}
}

const roleController = {
	getRoles,
}

export default roleController

import carTypeController from '../controllers/car-type.controller'

const carTypeRoutes = (app) => {
	app.get('/car-types', carTypeController.getCarTypes)
}

export default carTypeRoutes

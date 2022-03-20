import carMakeController from '../controllers/car-make.controller'

const carMakeRoutes = (app) => {
	app.get('/car-makes', carMakeController.getCarMakes)
}

export default carMakeRoutes

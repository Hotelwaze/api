import carController from '../controllers/car.controller'

const carRoutes = (app) => {
	app.get('/cars/cars', carController.getCars)
	app.get('/cars/cars-nearby', carController.getCarsNearby)
}

export default carRoutes

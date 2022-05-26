import carModelController from '../controllers/car-model.controller'

const carModelRoutes = (app) => {
	app.get('/cars/models', carModelController.list)
	app.post('/cars/models', carModelController.add)
}

export default carModelRoutes

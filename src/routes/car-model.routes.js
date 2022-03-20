import carModelController from '../controllers/car-model.controller'

const carModelRoutes = (app) => {
	app.get('/car-models', carModelController.getCarModels)
}

export default carModelRoutes

import carModelController from '../controllers/car-model.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const carModelRoutes = (app) => {
	app.get('/cars/models', carModelController.list)
	app.post('/cars/models', verifyToken, carModelController.add)
}

export default carModelRoutes

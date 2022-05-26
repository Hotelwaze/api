import carTypeController from '../controllers/car-type.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const carTypeRoutes = (app) => {
	app.get('/cars/types', carTypeController.list)
	app.post('/cars/types', verifyToken, carTypeController.add)
}

export default carTypeRoutes

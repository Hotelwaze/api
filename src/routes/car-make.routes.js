import carMakeController from '../controllers/car-make.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const carMakeRoutes = (app) => {
	app.get('/cars/makes', carMakeController.list)
	app.post('/cars/makes', verifyToken, carMakeController.add)
}

export default carMakeRoutes

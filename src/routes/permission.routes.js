import permissionController from '../controllers/permission.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const permissionRoutes = (app) => {
	app.post(
		'/permissions',
		verifyToken,
		permissionController.create
	)
}

export default permissionRoutes

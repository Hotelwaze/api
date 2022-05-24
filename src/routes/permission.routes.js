import permissionController from '../controllers/permission.controller'

const permissionRoutes = (app) => {
	app.post('/permissions', permissionController.create)
}

export default permissionRoutes

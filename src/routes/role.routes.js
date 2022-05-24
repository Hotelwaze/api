import roleController from '../controllers/role.controller'

const roleRoutes = (app) => {
	app.get('/roles', roleController.getRoles)
	app.post('/roles', roleController.createRole)
	app.post('/roles/:id/permissions', roleController.addPermissions)
}

export default roleRoutes

import roleController from '../controllers/role.controller'

const roleRoutes = (app) => {
	app.get('/roles', roleController.getRoles)
	app.post('/roles', roleController.create)
}

export default roleRoutes

import roleController from '../controllers/role.controller'

const roleRoutes = (app) => {
	app.get('/roles', roleController.getRoles)
}

export default roleRoutes

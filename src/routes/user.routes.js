import userController from '../controllers/user.controller'

const userRoutes = (app) => {
	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Headers',
			'Authorization, Origin, Content-Type, Accept',
		)
		next()
	})

	app.post(
		'/users/create',
		userController.create,
	)
}

export default userRoutes


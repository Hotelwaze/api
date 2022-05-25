import authController from '../controllers/auth.controller'

const authRoutes = (app) => {
	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Headers',
			'Authorization, Origin, Content-Type, Accept',
		)
		next()
	})

	app.post('/auth/login', authController.login)
}

export default authRoutes

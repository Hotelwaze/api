import { checkDuplicateEmail } from '../middlewares/verify-sign-up'
import authController from '../controllers/auth.controller'

const authRoutes = (app) => {
	app.use((req, res, next) => {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept',
		)
		next()
	})

	app.post(
		'/auth/create',
		[
			checkDuplicateEmail,
		],
		authController.createUser,
	)

	app.post('/auth/login', authController.login)

	app.post('/auth/refresh-token', authController.refreshToken)
}

export default authRoutes

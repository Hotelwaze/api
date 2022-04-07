import bookingController from '../controllers/booking.controller'
import { isCustomer, verifyToken } from '../middlewares/auth-jwt'

const bookingRoutes = (app) => {
	app.post(
		'/bookings',
		[
			verifyToken, isCustomer
		],
		bookingController.createBooking
	)
}

export default bookingRoutes

import bookingController from '../controllers/booking.controller'
import {  verifyToken, isCustomer } from '../middlewares/auth-jwt'

const bookingRoutes = (app) => {
	app.post(
		'/bookings',
		[
			verifyToken,
			isCustomer
		],
		bookingController.createBooking
	);

	app.get(
		'/current-booking/user/current',
		[
			verifyToken, isCustomer
		],
		bookingController.getCurrentUserBooking
	);

	app.post(
		'/booking/cancel',
		[
			verifyToken, isCustomer
		],
		bookingController.cancelBooking
	);

	app.get(
		'/booking/history',
		[
			verifyToken, isCustomer
		],
		bookingController.getBookingHistory
	);
}

export default bookingRoutes

import bookingController from '../controllers/booking.controller'
import {  verifyToken, isCustomer } from '../middlewares/auth-jwt'

const bookingRoutes = (app) => {
	app.post('/bookings', [verifyToken], bookingController.createBooking);
	app.post('/bookings-delete', [verifyToken], bookingController.DeleteBooking);

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

	app.post(
		'/booking-partners',
		[
			verifyToken,
		],
		bookingController.getBookingPartner
	);

	app.post(
		'/booking-info',
		[
			verifyToken,
		],
		bookingController.getBookingPartnerInfo
	);

	app.get('/booking-sample', bookingController.sample);

	app.post('/booking-update-status', bookingController.updateBookingStatus);

	// app.get('/booking-payment-status', bookingController.paymentWebhook)
	app.post('/booking-payment-status', bookingController.paymentWebhook)
}

export default bookingRoutes

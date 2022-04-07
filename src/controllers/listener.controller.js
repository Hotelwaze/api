import model from '../models'
import mailer from '../services/mail.service'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const {
	Booking, Invoice, User
} = model

const payMongo = async (req, res) => {
	const { data } = req.body

	try {
		if (data.attributes.type === 'payment.paid') {
			const booking = await Booking.findOne({
				where: {
					paymentIntentId: data.attributes.data.attributes.payment_intent_id,
				},
				include: [
					{
						model: User,
						as: 'customer'
					}
				]
			})

			if (booking) {
				booking.update({
					status: 'booked',
				})

				// get invoice and set invoice to paid
				const invoice = await Invoice.findOne({
					where: {
						BookingId: booking.id
					}
				})

				if (invoice) {
					invoice.update({
						status: 'paid'
					})
					invoice.save()
				} else {
					const error = new Error('Invoice not found.')
					error.code = 404
					throw error
				}
				// send booking details to customer email
				const templateSource = fs.readFileSync(path.join(__dirname, '../../public/email/templates/new-booking-customer.hbs'), 'utf8')
				const template = handlebars.compile(templateSource)
				const htmlToSend = template({
					name: booking.customer.name,
				})
				mailer(
					'You\'ve successfully booked a car',
					htmlToSend,
					booking.customer.email
				)
				// send booking details to partner email
				// send booking details to hotelwaze
			}
		}

		res.status(200).send()
	} catch(err) {
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

const listenerController = {
	payMongo,
}

export default listenerController

import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import dotenv from 'dotenv'

dotenv.config()

const mailer = (subject, html, to, from = 'no-reply@hotelwaze.com') => {
	const mailgunAuth = {
		auth: {
			api_key: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN
		}
	}
  
	const smtpTransport = nodemailer.createTransport(mg(mailgunAuth))
	
	const mailOptions = {
		from,
		to,
		subject,
		html
	}

	smtpTransport.sendMail(mailOptions, (error) => {
		if (error) {
			const error = new Error('Failed to send email.')
			error.code = 500
			throw error
		} else {
			console.log('Successfully sent email.')
		}
	})
}

export default mailer

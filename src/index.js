import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import roleRoutes from './routes/role.routes'
import partnerTypeRoutes from './routes/partner-type.routes'
import partnerRoutes from './routes/partner.routes'
import addressRoutes from './routes/address.routes'
import placeRoutes from './routes/place.routes'
import carMakeRoutes from './routes/car-make.routes'
import carTypeRoutes from './routes/car-type.routes'
import carModelRoutes from './routes/car-model.routes'
import carRoutes from './routes/car.routes'
import feeRoutes from './routes/fee.routes'
import authRoutes from './routes/auth.routes'
import bookingRoutes from './routes/booking.routes'
import listenerRoutes from './routes/listener.routes'

dotenv.config()

const app = express()
const port = process.env.PORT

const allowedDomains = [
	'https://staging.admin.hotelwaze.com',
	'https://admin.hotelwaze.com',
	'https://staging.hotelwaze.com',
	'https://hotelwaze.com',
	'https://www.hotelwaze.com',
	'http://localhost:3000',
]

const corsOptions = {
	origin: (origin, callback) => {
		// bypass the requests with no origin (like curl requests, mobile apps, etc )
		if (!origin) return callback(null, true)
		if (allowedDomains.indexOf(origin) === -1) {
			const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`
			return callback(new Error(msg), false)
		}
		return callback(null, true)
	},
	credentials: true,
}

app.use(cors(corsOptions))

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, '../access.log'),
	{ flags: 'a' },
)

app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/images', express.static(path.join(__dirname, '../public/images')))

roleRoutes(app)
partnerTypeRoutes(app)
partnerRoutes(app)
addressRoutes(app)
placeRoutes(app)
carMakeRoutes(app)
carTypeRoutes(app)
carModelRoutes(app)
carRoutes(app)
feeRoutes(app)
authRoutes(app)
bookingRoutes(app)
listenerRoutes(app)

app.use((req, res) => {
	res.status(404).send('404: Page not found')
})

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Hotelwaze platform API listening on port ${port}!`)
})
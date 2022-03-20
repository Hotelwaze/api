import express from 'express'
import fs from 'fs'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'

import roleRoutes from './routes/role.routes'
import partnerTypeRoutes from './routes/partner-type.routes'
import partnerRoutes from './routes/partner.routes'
import addressRoutes from './routes/address.routes'
import placeRoutes from './routes/place.routes'
import carMakeRoutes from './routes/car-make.routes'
import carTypeRoutes from './routes/car-type.routes'
import carModelRoutes from './routes/car-model.routes'
import carRoutes from './routes/car.routes'
import optionRoutes from './routes/option.routes'
import authRoutes from './routes/auth.routes'

const app = express()
const port = 8082

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
optionRoutes(app)
authRoutes(app)

app.use((req, res) => {
	res.status(404).send('404: Page not found')
})

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Hotelwaze platform API listening on port ${port}!`)
})
import { Op, Sequelize } from 'sequelize'
import model from '../models'

const { Booking } = model

const createBooking = async (req, res) => {
	const {
		CarTypeId, fuelCharge, driveOption, startDate, endDate, UserId, bookingNotes, PartnerId,
		lat, lng, placeId, placeDescription,
	} = req.body
}